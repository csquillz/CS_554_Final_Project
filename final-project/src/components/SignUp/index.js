import React, { Component } from 'react';
import { compose, setDisplayName } from 'recompose';
import { withFirebase } from '../Firebase';
import { Link, withRouter } from 'react-router-dom';
import * as ROUTES from "../../const/routes"

const SignUpPage = () => (
  <div className="sign-up">
    <h1>Sign Up</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };

  }

  onSubmit = event => {
    const { username, email, passwordOne } = this.state;
    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne, username)
      .then(authUser => {
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            username,
            email,
          });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.CHAT);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();

  }

  onChange = event => {

    this.setState({ [event.target.name]: event.target.value });

  };

  render() {

    const {
      username,
      email,
      passwordOne,
      passwordTwo,
      error,
    } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '';

    return (
      <form className="sign-up-form" onSubmit={this.onSubmit}>
        <div className="form-group">
        <label>Full Name</label>
        <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          className="form-control"
          placeholder="Full Name"
          />
        </div>
        <div className="form-group">
        <label>Email Address</label>
        <input
          name="email"
          value={email}
          onChange={this.onChange}
            type="text"
            className="form-control"
          placeholder="Email Address"
        />
        </div>
        <div className="form-group">
        <label>Password</label>
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
            type="password"
            className="form-control"
          placeholder="Password"
          />
        </div>
        <div className="form-group">
        <label>Confirm Password</label>
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
            type="password"
            className="form-control"
          placeholder="Confirm Password"
          />
        </div>
        <button className="btn btn-large btn-positive" disabled={isInvalid} type="submit">
          Sign Up
        </button>
        <button className="btn btn-large btn-negative" onClick={() => {this.props.history.push("/")}} >
          Go Back
        </button>
        {error && <p>{error.message}</p>}
        </form>
    );
  }
}

const SignUpLink = () => (
  <p className="sign-up-link">
    Don't have an account? <Link to={ROUTES.SIGN_UP} className="sign-up-noacc">Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };