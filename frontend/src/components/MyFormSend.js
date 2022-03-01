import React, {useState} from 'react';
import MyShowVMsStates from './MyShowVMsStates';
import axios from 'axios';
import MyShowVMsStatesBtn from './MyShowVMsStatesBtn';
import './MyContainer.css'
import MyUploadFile from './MyUploadFile';
import 'bootstrap/dist/css/bootstrap.min.css';
import MyVMSettingFrom from './MyVMsettingFrom';
import WebSocketTerminal_withXterm from './WebSocketTerminal_withXterm'

class MyFormSend extends React.Component {
    constructor(props) {
      super(props);
      // create a ref to store the DOM element
      this.nameEl = React.createRef();
      this.handleSubmit = this.handleSubmit.bind(this);
      //vms is the virtual machine data retrived from server
      this.state={
        vms: []
      };
    };

    handleSubmit(e) {
        e.preventDefault();
        
        //combined url and parameter that passed into this component to the target url
        //we are go into make query.
        var target_url='/api/vm/start/'+this.props.vm_id
        axios({
            method: 'post',
            baseURL: 'http://localhost:4000',
            url: target_url,
          })
            .then(response => {
              const vms=response.data; 
              console.log(vms);
              this.setState({vms});
            })

    }
  
    render() {
      return (
        <div class="input-group row align-items-center div-for-VM" >
          <div class="div-for-VM-ID">VM ID:{this.props.vm_id}

          </div>

          <form onSubmit={this.handleSubmit} class="flexbox-container">

            <MyUploadFile vm_id={this.props.vm_id}/>
            <MyVMSettingFrom/>
            <div>
            <button type="submit" class="btn btn-sm btn-light px-2 ">Start the VM</button>
            </div>
            <MyShowVMsStatesBtn vm_id={this.props.vm_id} />
          </form>
          <WebSocketTerminal_withXterm/>
        </div>

      )
    }
  }

  export default MyFormSend;