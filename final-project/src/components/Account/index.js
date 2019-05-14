import React from 'react';

import { AuthUserContext, withAuthorization } from '../Session';
import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import SignOutButton from '../SignOut';

const AccountPage = () => (
  <AuthUserContext.Consumer>
    {authUser => (
      <div>
        {console.log(authUser.displayName)}
        <h1>Account: {authUser.email}</h1>
        <PasswordChangeForm />
        <SignOutButton />
      </div>
    )}
  </AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);