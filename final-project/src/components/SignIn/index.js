import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';
import { SignUpLink } from '../SignUp';
import { withFirebase } from '../Firebase';
import { PasswordForgetLink } from '../PasswordForget';
import firebase from 'firebase';
import * as ROUTES from "../../const/routes"

const SignInPage = () => (
  <div classname = "sign-in">
    <h2>Sign In</h2>
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

  // async onSubmit(e) {
  //   e.preventDefault();
  //   const { email, password } = this.state;

  //   try {
  //     this.props.firebase.doSignInWithEmailAndPassword(email, password);
  //     this.setState({ ...INITIAL_STATE });
  //     this.props.history.push(ROUTES.HOME);
  //   } catch (e) {
  //     console.log(e.code);
  //   }
  // }

  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onSubmitGoogle= event => {

    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.HOME);
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
      <form onSubmit={this.onSubmit} class="sign-in-2">
        <div className="form-group">
          <label>Email Address</label>
          <input
            name="email"
            value={email}
            onChange={this.onChange}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            name="password"
            value={password}
            onChange={this.onChange}
            type="password"
            className="form-control"
          />
        </div>
        <button className="btn btn-large btn-default" disabled={isInvalid} type="submit">
          Sign In
        </button>
        <button className="btn btn-large btn-primary" type="submit" onClick={this.onSubmitGoogle}>
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