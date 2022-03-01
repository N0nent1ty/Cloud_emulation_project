
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';

import './MyContainer.css'
import {XTerm} from 'xterm-for-react'







const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
const { TextArea } = Input;
const { strip } = require('ansicolor')
const client = new W3CWebSocket('ws://10.128.8.182:5001/ws');


export default class WebSocketTerminal_withXterm extends Component {
  constructor(props) {
    super(props);
    this.CircularBuffer = require("circular-buffer");

    //here you can setup the console buffer on the front end
    this.RingBuf = new this.CircularBuffer(15000);

    //Create Xterm
    this.xtermRef = React.createRef()
  }

  state = {
    userName: 'cipher',
    isLoggedIn: true,
    messages: [],
    alltext: 'no-data'
  }



  onButtonClicked = (value) => {
    switch (value) {
      //if input is clear, just clean all the console
      case 'clear':
        while(this.RingBuf.capacity>=0){
            this.RingBuf.shift()
        }
        this.setState((state) => ({
          alltext: '',
          searchVal:''
        })
        );
        break;
      default:

        client.send(value)
        this.setState({ searchVal: '' })
    }
  }
  componentDidMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const dataFromServer = message.data;

      //Push every recived data into buffer
      [...dataFromServer].map(x=>this.RingBuf.push(x));
      this.setState((state) => ({
        alltext: this.RingBuf.get(0,this.RingBuf.size() - 1).join('')
      })
      );
      console.log(...dataFromServer)
      console.log('alltext :' + this.state.alltext)
      console.log('dataformserver:'+dataFromServer);
      this.setState((state) =>
      ({
        messages: [...state.messages,
        {
          msg: message.data,
          user: "server"
        }],
      //  alltext: state.alltext + dataFromServer
      })
      );

    };
  }
  render() {

    return (
      <div className="main" id='wrapper'>

        <div>
          <div className="title">

            <Text id="main-heading" type="secondary" style={{ fontSize: '30x' }}>Websocket ssh connection {this.state.userName}</Text>
          </div>

          <div id="messages" class="div-for-terminal">
            {/*<RenderTerminal text={this.state.alltext} />*/}
            <XTerm
                    ref={this.xtermRef}
                    onData={(data) => {
                        const code = data.charCodeAt(0);
                        // If the user hits empty and there is something typed echo it.
                        this.xtermRef.current.terminal.write(this.state.alltext)
                        if (code === 13 && this.state.input!==undefined) {
                          console.log("Debug message from Xterm, you type"+this.state.input);
                            client.send(this.state.input);
                            this.setState({input: ""});
                        } else if (code < 32 ) { // Disable control Keys such as arrow keys
                            return;
                        } else { // Add general key press characters to the terminal
                            this.xtermRef.current.terminal.write(data);
                            this.setState({input: this.state.input + data})
                        }
                    }}
                />
          </div>
          <div className="bottom">
            <Search
              placeholder="input message and send"
              enterButton="Send"
              value={this.state.searchVal}
              size="large"
              onChange={(e) => this.setState({ searchVal: e.target.value })}
              onSearch={value => this.onButtonClicked(value)}
            />
          </div>
        </div>
      </div>
    )
  }
}