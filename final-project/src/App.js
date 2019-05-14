import React, { Component } from 'react';
import { BrowserRouter as Router,Route, Switch } from "react-router-dom";
import './App.css';
import Chat from "./components/chatRoom"
import pdfContainer from './components/pdfContainer';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import Landing from './components/LandingPage';
import Navigation from './components/Navigation';
import AccountPage from './components/Account';
import HomePage from './components/Home'; 
import PrivateRoute from './components/Session/PrivateRoute';
import firebase from 'firebase';
import withAuthentication from './components/Session/withAuthentication';
import * as ROUTES from "./const/routes";
import { PasswordForgetForm } from './components/PasswordForget';

class App extends Component {
    state = { loading: true, authenticated: false, user: null };

    componentWillMount() {
        firebase.auth().onAuthStateChanged(user => {
          if (user) {
            this.setState({
              authenticated: true,
              currentUser: user,
              loading: false
            });
          } else {
            this.setState({
              authenticated: false,
              currentUser: null,
              loading: false
            });
          }
        });
      }

    render() {

        const { authenticated, loading } = this.state;
        if (loading) {
            return <p>Loading..</p>;
          }

        return (
           /*  <div className="window">
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
                    </div>
                </header>
                </div> */
                <Router>
                    <div>
                    <Navigation/>
                    <Route exact path={ROUTES.LANDING} component={Landing} />
                    <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
                    <Route exact path={ROUTES.CHAT} component={Chat}/>
                    <Route exact path={ROUTES.PDF} component={pdfContainer}/>
                    <Route exact path={ROUTES.HOME} component={HomePage}/>
                    <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
                    <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
                    <Route exact path={ROUTES.PASSWORD_FORGET} component={PasswordForgetForm} />

                    </div>
                </Router>
            
        );
    }
}

export default withAuthentication(App);
