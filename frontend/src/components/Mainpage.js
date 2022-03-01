
import '../App.css';
import MyFormSend from './MyFormSend';
import MyNavbar from './MyNavbar'
//import TestComponent from './components/TestComponent';
import MySearchComponent from './MySearchComponent';
//import MyUploadFile from './components/MyUploadFile';
import Footer from './Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import SSEexperiment from './SSEexperiment';
//import './components/MyContainer.css'



function Mainpage(){
    return(
        <div class="App">

        <SSEexperiment/>
        <MyNavbar />
        <MySearchComponent />
        <p>There is go rutine will stop VM every 15 second to simulate the sinario that VM state will change any time</p>
        <div >
        <MyFormSend vm_id="1" />
        <MyFormSend vm_id="2" />
        <MyFormSend vm_id="3" />
        <MyFormSend vm_id="4" />
        </div>
        <Footer/>
      </div>
    );
}
export default Mainpage;