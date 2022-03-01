import React, { Component } from 'react';
import { useState, useEffect } from 'react';

class MyVMSettingFrom extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 
          filename: '',
          ports:'',
          description:''
        };
    }

    //choose the file name want to be emulate
    fileNameChangeHandler = (event) => {
      this.setState({filename: event.target.value});
    }


    portsChangeHandler=(event)=>{  
        this.setState({ports:event.target.value})
    }

    descriptionChangeHandler=(event)=>{
        this.setState({description:event.target.value})
    }

    render() {
        return (
            <form class="flexbox-container">
                <div class=" div-for-VM-setting">
                    {/*<label >Firmware FileName</label>*/}
                    <input type="text"
                        class="form-control"
                        placeholder="filename"
                        onChange={this.fileNameChangeHandler}
                    />
                    <small  class="form-text text-muted">Make sure you have upload the file first.</small>
                </div>
                <div class=" div-for-VM-setting">
                   {/* <label>Enter the ports you want to expose(Please separate with commas)</label>*/}
                    <input tyoe='number'
                        onChange={this.portsChangeHandler}
                        class="form-control" 
                        placeholder=".e.g 22,23,80,8080"
                    />
                    <small class="form-text text-muted">Enter the ports you want to expose(Please separate with commas)</small>
                </div>
                <div class=" div-for-VM-setting">
                   {/* <label>Enter the ports you want to expose(Please separate with commas)</label>*/}
                    <input tyoe='number'
                        onChange={this.descriptionChangeHandler}
                        class="form-control" 
                        placeholder="Description"
                    />
                    <small class="form-text text-muted">Enter any description you want</small>
                </div>
            </form>
        );
    }
  }

  export default MyVMSettingFrom;