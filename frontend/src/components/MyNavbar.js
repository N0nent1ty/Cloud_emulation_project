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

    function MyNavbar(){
        return(
          <Navbar bg="dark" variant="dark" >
          <Navbar.Brand href="home">Virtaulization cloud service</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="home">Home</Nav.Link>
            <Nav.Link href="documentation">Documentation</Nav.Link>
            <Nav.Link href="about">About</Nav.Link>

          </Nav>

        </Navbar>
        )
    }
    export default MyNavbar;