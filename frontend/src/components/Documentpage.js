import MyNavbar from "./MyNavbar";
//import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Component = () => {
  const codeString = '#this is c code example\n'+
   'printf("helloWorld");';
  return (
    <SyntaxHighlighter language="c" style={dark}>
      {codeString}
    </SyntaxHighlighter>
  );
};


function Documentpage(){
    return(

        <div> 
            <MyNavbar/>
            this is document
            {Component()}        
        </div>
    );
}

export default Documentpage;