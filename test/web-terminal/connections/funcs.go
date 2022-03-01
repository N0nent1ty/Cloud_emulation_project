package connections

import (
	"bufio"
	"bytes"
	"fmt"
	"log"
	"net"
	"strconv"
	"time"
	"unicode/utf8"

	"github.com/gorilla/websocket"
	"golang.org/x/crypto/ssh"
)

//Return sshclient structure, but I commented the password and user name parsing part and
//hard code in the source code
func DecodedMsgToSSHClient(msg string) (SSHClient, error) {
	client := NewSSHClient()
	/*	decoded, err := base64.StdEncoding.DecodeString(msg)
		if err != nil {
			return client, err
		}
		err = json.Unmarshal(decoded, &client)
		if err != nil {
			return client, err
		}
	*/
	return client, nil

}

func (this *SSHClient) GenerateClient() error {
	var (
		auth         []ssh.AuthMethod
		addr         string
		clientConfig *ssh.ClientConfig
		client       *ssh.Client
		config       ssh.Config
		err          error
	)
	auth = make([]ssh.AuthMethod, 0)
	auth = append(auth, ssh.Password(this.Password))
	config = ssh.Config{
		Ciphers: []string{"aes128-ctr", "aes192-ctr", "aes256-ctr", "aes128-gcm@openssh.com", "arcfour256", "arcfour128", "aes128-cbc", "3des-cbc", "aes192-cbc", "aes256-cbc"},
	}
	clientConfig = &ssh.ClientConfig{
		User:    this.Username,
		Auth:    auth,
		Timeout: 5 * time.Second,
		Config:  config,
		HostKeyCallback: func(hostname string, remote net.Addr, key ssh.PublicKey) error {
			return nil
		},
	}
	addr = fmt.Sprintf("%s:%d", this.IpAddress, this.Port)
	if client, err = ssh.Dial("tcp", addr, clientConfig); err != nil {
		return err
	}
	this.Client = client
	return nil
}

func (this *SSHClient) RequestTerminal(terminal Terminal) *SSHClient {
	session, err := this.Client.NewSession()
	if err != nil {
		log.Println(err)
		return nil
	}
	this.Session = session
	channel, inRequests, err := this.Client.OpenChannel("session", nil)
	if err != nil {
		log.Println(err)
		return nil
	}
	this.channel = channel
	go func() {
		for req := range inRequests {
			if req.WantReply {
				req.Reply(false, nil)
			}
		}
	}()
	modes := ssh.TerminalModes{
		ssh.ECHO:          1,
		ssh.TTY_OP_ISPEED: 14400,
		ssh.TTY_OP_OSPEED: 14400,
	}
	var modeList []byte
	for k, v := range modes {
		kv := struct {
			Key byte
			Val uint32
		}{k, v}
		modeList = append(modeList, ssh.Marshal(&kv)...)
	}
	modeList = append(modeList, 0)
	req := ptyRequestMsg{
		Term:     "xterm",
		Columns:  terminal.Columns,
		Rows:     terminal.Rows,
		Width:    uint32(terminal.Columns * 8),
		Height:   uint32(terminal.Columns * 8),
		Modelist: string(modeList),
	}
	ok, err := channel.SendRequest("pty-req", true, ssh.Marshal(&req))
	if !ok || err != nil {
		log.Println(err)
		return nil
	}
	ok, err = channel.SendRequest("shell", true, nil)
	if !ok || err != nil {
		log.Println(err)
		return nil
	}
	return this
}

func BytesCombine(pBytes ...[]byte) []byte {
	return bytes.Join(pBytes, []byte(""))
}

func (this *SSHClient) Connect(ws *websocket.Conn) {

	//get the input for first go cocurren process.
	go func() {
		for {
			// read from websocket
			_, p, err := ws.ReadMessage()
			fmt.Println("Read from websocket")
			fmt.Printf("%s", p)
			if err != nil {
				return
			}

			//add change line to every message send to here
			changeline := "\n"
			byteChangeline := []byte(changeline)
			p = BytesCombine(p, byteChangeline)

			fmt.Println("write to ssh")
			fmt.Printf("%s", p)
			//write to ssh channel
			_, err = this.channel.Write(p)
			if err != nil {
				return
			}
		}
	}()

	//the second cocurrent proccess will send input to remote 
	go func() {

		//read from ssh channel
		br := bufio.NewReader(this.channel)
		buf := []byte{}
		t := time.NewTimer(time.Microsecond * 1000)
		defer t.Stop()
		//構建一個信道, 一端將數據遠程主機的數據寫入, 一段讀取數據寫入ws
		r := make(chan rune)

		// read ssh information into channel
		go func() {
			defer this.Client.Close()
			defer this.Session.Close()

			for {
				x, size, err := br.ReadRune()
				if err != nil {
					log.Println(err)
					ws.WriteMessage(1, []byte("\033[31mSession has been close!\033[0m"))
					ws.Close()
					return
				}
				if size > 0 {
					r <- x
					fmt.Println("Write to websocket")
					fmt.Println(x)
				}
			}
		}()

		// main loop
		for {
			select {
			// Every 100 microseconds, write data to ws as long as the length of buf is not 0, and reset the time and buf
			case <-t.C:
				if len(buf) != 0 {
					err := ws.WriteMessage(websocket.TextMessage, buf)
					astring, _ := strconv.Atoi(string(buf))
					fmt.Println("Write to websocket")
					fmt.Println(astring)
					buf = []byte{}
					if err != nil {
						log.Println(err)
						return
					}
				}
				t.Reset(time.Microsecond * 100)
			// 前面已經將ssh channel裡讀取的數據寫入創建的通道r, 這裡讀取數據, 不斷增加buf的長度, 在設定的 100 microsecond後由上面判定長度是否返送數據
			case d := <-r:
				if d != utf8.RuneError {
					p := make([]byte, utf8.RuneLen(d))
					utf8.EncodeRune(p, d)
					buf = append(buf, p...)
				} else {
					buf = append(buf, []byte("@")...)
				}
			}
		}
	}()

	defer func() {
		if err := recover(); err != nil {
			log.Println(err)
		}
	}()
}
