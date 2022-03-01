import Ansi from "ansi-to-react";
import React, { Component } from "react";


class  RenderTerminal extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            text:''
          };
      }


  
  render(){
    let text=this.props.text+"\n"
    return(
        <div>
           
    <Ansi>
        {text}
    </Ansi>
    </div>
    );
  }
}

export default RenderTerminal;