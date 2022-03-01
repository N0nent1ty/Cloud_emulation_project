import React, {useState} from 'react';
import axios from 'axios';



import MyShowVMsStates from './MyShowVMsStates'

//Pass the id, and button will send the request to REST api with info query
class MyShowVMsStatesBtn extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            vm: [],
            showVMStatusComponent: false
        };
        // 為了讓 `this` 能在 callback 中被使用，這裡的綁定是必要的：
        this.handleClick = this.handleClick.bind(this);
      }
    


    handleClick(e) {
        e.preventDefault();
        
        //combined url and parameter that passed into this component to the target url
        //we are go into make query.
        var target_url='/api/vm/getinfo/'+this.props.vm_id


        //only send the request while the info is not shown on the page(duble click will just collapse
        // the content and not send any request)
        if(this.state.showVMStatusComponent==false){
        axios({
            method: 'post',
            baseURL: 'http://localhost:4000',
            url: target_url,
          })
            .then(response => {
              const vm=response.data; 
              console.log(vm);
              this.setState({vm});
            });
        }

        this.setState(prevState=>({
                showVMStatusComponent:!prevState.showVMStatusComponent,
            }));
        
      }
    

      
    render(){ 
        return(
            <div>
                <button onClick={this.handleClick} class="btn btn-sm btn-light px-2">
                    Get the VM info
                </button>

                {/*Only render the component while button clicked */}
                {
                    this.state.showVMStatusComponent?
                <MyShowVMsStates 
                ip={this.state.vm.ip} 
                status={this.state.vm.status} 
                description={this.state.vm.description}
                />:null
    }
            </div>
    );
    }
};
export default MyShowVMsStatesBtn; 