import React, { Component } from 'react';
import { Route, Switch } from "react-router-dom";
import './App.css';
import Chat from "./components/chatRoom"
import pdfContainer from './components/pdfContainer';
import SignInPage from './components/SignIn';
import SignUpPage from './components/SignUp';
import Landing from './components/LandingPage';

import AccountPage from './components/Account';
import Navigation from './components/Navigation'; 
import PrivateRoute from './components/Session/PrivateRoute';
import firebase from 'firebase';
import withAuthentication from './components/Session/withAuthentication';
import * as ROUTES from "./const/routes";

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
            <div className="window">
                <Switch>
                    <Route exact path={ROUTES.LANDING} component={Landing} />
                    <Route exact path="/signin" component={SignInPage} />
                    <PrivateRoute exact path="/chat" component={Chat} authenticated={this.state.authenticated}/>
                    <PrivateRoute exact path="/pdfViewer" component={pdfContainer} authenticated={this.state.authenticated}/>
                    <Route exact path='/signup' component={SignUpPage} />
                    <Route exact path='/account' component={AccountPage} />


                </Switch>
                <Navigation />
            </div>

        );
    }
}

export default withAuthentication(App);
