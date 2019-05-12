import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import { PasswordForgetLink } from '../PasswordForget';
import firebase from 'firebase';
import * as ROUTES from "../../const/routes"

const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <PasswordForgetLink />
    <SignUpLink />

  </div>
);

const INITIAL_STATE = {
  email: '',
  password: '',
  username: '',
  error: null,
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.CHAT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onSubmitGoogle = event => {
    var provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  
    provider.setCustomParameters({
      'login_hint': 'user@example.com'
    });
  
    firebase.auth().signInWithRedirect(provider);
  
    firebase.auth().getRedirectResult().then(() => {
      this.props.history.push(ROUTES.CHAT);
    })
    .catch(error => {
      this.setState({ error });
    });

  event.preventDefault();
};

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="Email Address"
        />
        <input
          name="password"
          value={password}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <button disabled={isInvalid} type="submit">
          Sign In
        </button>
        <button type="submit" onClick={this.onSubmitGoogle}>
          Sign In With Google
        </button>
        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

export default SignInPage;

export { SignInForm };