import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';
import Chat from "./components/chatRoom"
import pdfContainer from './components/pdfContainer';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';


class App extends Component {

    render() {
        return (
            
                <Switch>
                    <Route exact path="/" component={SignInPage} />
                    <Route exact path="/chat" component={Chat} />
                    <Route exact path='/pdfViewer' component={pdfContainer} />
                    <Route exact path='/signup' component={SignUpPage} />

                </Switch>

        );
    }
}

export default App;
