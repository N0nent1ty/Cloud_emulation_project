
import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import Ansi from "ansi-to-react";
import RenderAnsi from './AnsiToReactTest'
import RenderTerminal from './AnsiToReactTest';
import './MyContainer.css'








const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;
const { TextArea } = Input;
const { strip } = require('ansicolor')
const client = new W3CWebSocket('ws://127.0.0.1:5001/ws');


export default class WebSocketTerminal extends Component {
  constructor(props) {
    super(props);
    this.CircularBuffer = require("circular-buffer");

    //here you can setup the console buffer on the front end
    this.RingBuf = new this.CircularBuffer(15000);
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
            {<RenderTerminal text={this.state.alltext} />}{'\n'}
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