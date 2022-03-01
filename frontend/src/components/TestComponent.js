import React from "react";
//import the components from bootstrap
import {
    Navbar,
    Nav,
    NavDropdown,
    Form,
    FormControl,
    Button,
   } from "react-bootstrap";
   import 'bootstrap/dist/css/bootstrap.min.css'

   function TestComponent(){
    return(
        <div class="flex">
            <div>
                <button type="button" class="btn">Delete</button>
            </div>
            <div>
                <div class="input-group">
                    <input type="text" class="form-control" value="1" />
                    <span class="input-group-addon">Update</span>
                </div>
            </div>
        </div>
    );
   }
   export default TestComponent;