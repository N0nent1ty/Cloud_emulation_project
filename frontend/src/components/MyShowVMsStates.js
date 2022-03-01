import React, {useState} from 'react';


class MyShowVMsStates extends React.Component {
    constructor(props) {
        super(props);
    };


    render(){
    return (
        <div class="container-fluid">
        <ul class="list-group ">
            <li class="list-group-item d-flex justify-content-between align-items-center">
                {this.props.ip}
                <span class="badge badge-primary badge-pill">14</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                {this.props.status}
                <span class="badge badge-primary badge-pill">2</span>
            </li>
            <li class="list-group-item d-flex justify-content-between align-items-center">
                {this.props.description}
                <span class="badge badge-primary badge-pill">1</span>
            </li>
        </ul>
        </div>
    )
    }
}
export default MyShowVMsStates;