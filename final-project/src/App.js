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
            <div className="window">
                <header className="toolbar toolbar-header">
                    <div className="toolbar-actions">
                        <div className="btn-group">
                            <button className="btn btn-default">
                                <span className="icon icon-left-open"></span>
                            </button>
                            <button className="btn btn-default">
                                <span className="icon icon-right-open"></span>
                            </button>
                            <button className="btn btn-default">
                                <span className="icon icon-dot-3"></span>
                            </button>
                        </div>
                        <button className="btn btn-default">
                            <span className="icon icon-home icon-text"></span>
                            Home
                </button>
                        <button className="btn btn-default">
                            <span className="icon icon-newspaper icon-text"></span>
                            Documents
                </button>
                        <button className="btn btn-default">
                            <span className="icon icon-chat icon-text"></span>
                            Chatroom
                </button>
                <button className="btn btn-default">
                            <span className="icon icon-chat icon-text"></span>
                            Sign In
                </button>
                <button className="btn btn-default">
                            <span className="icon icon-chat icon-text"></span>
                            Sign Out
                </button>
                    </div>
                </header>

                <Switch>
                    <Route exact path="/" component={SignInPage} />
                    <Route exact path="/chat" component={Chat} />
                    <Route exact path='/pdfViewer' component={pdfContainer} />
                    <Route exact path='/signup' component={SignUpPage} />

                </Switch>

            </div>
        );
    }
}

export default App;
