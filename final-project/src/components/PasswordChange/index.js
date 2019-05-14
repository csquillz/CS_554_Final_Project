import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

const INITIAL_STATE = {
  passwordOne: '',
  passwordTwo: '',
  error: null,
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { passwordOne } = this.state;

    alert("Your password has been updated succesfully!")

    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
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
    const { passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo || passwordOne === '';

    return (
      <div className = "passwordFromDiv">
        <form className="passwordForm" onSubmit={this.onSubmit}>
          <div className="form-group">
            <input
              className="password"
              value={passwordOne}
              onChange={this.onChange}
              type="password"
              placeholder="New Password"
            />
            <input
              className="password"
              value={passwordTwo}
              onChange={this.onChange}
              type="password"
              placeholder="Confirm New Password"
            />
            <button disabled={isInvalid} type="submit">
              Reset My Password
        </button>

            {error && <p>{error.message}</p>}
          </div>
        </form>
      </div>
    );
  }
}

export default withFirebase(PasswordChangeForm);