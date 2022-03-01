package views

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/chengjoey/web-terminal/connections"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func ShellWs(c *gin.Context) {
	c.Header("Access-Control-Allow-Origin", "*")
	var err error
	msg := c.DefaultQuery("msg", "")
	cols := c.DefaultQuery("cols", "150")
	rows := c.DefaultQuery("rows", "35")
	col, _ := strconv.Atoi(cols)
	row, _ := strconv.Atoi(rows)
	terminal := connections.Terminal{
		Columns: uint32(col),
		Rows:    uint32(row),
	}

	sshClient, err := connections.DecodedMsgToSSHClient(msg)
	if err != nil {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Error(err)
		fmt.Println("fail in create sshClient")
		return
	}
	if sshClient.IpAddress == "" || sshClient.Password == "" {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Error(&ApiError{Message: "IP address can't not be empty", Code: 400})
		fmt.Println("fail in IP address")
		return
	}

	var myUpGrader = websocket.Upgrader{
		CheckOrigin: func(r *http.Request) bool {
			return true
		},
	}

	//conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	conn, err := myUpGrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		c.Header("Access-Control-Allow-Origin", "*")
		fmt.Println("Fail in upgrade")
		c.Error(err)
		return
	}
	err = sshClient.GenerateClient()
	if err != nil {
		c.Header("Access-Control-Allow-Origin", "*")
		conn.WriteMessage(1, []byte(err.Error()))
		conn.Close()
		return
	}
	sshClient.RequestTerminal(terminal)
	sshClient.Connect(conn)
}
