import Aboutpage from './components/Aboutpage';
import Mainpage from './components/Mainpage';
import Documentpage from './components/Documentpage';



//for different page routing
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";

function App() {


  return (
    <Router>
      <Switch>
        <Route exact path="/"> <Mainpage /></Route>
        <Route path="/home">   <Mainpage /></Route>
        <Route path="/about"><Aboutpage /></Route>
        <Route path="/documentation"><Documentpage /></Route>
      </Switch>
    </Router>
  );
}

export default App;
