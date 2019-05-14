import React from 'react';

import { withAuthorization } from '../Session';
import SignOutButton from '../SignOut'

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <p>Home :
Welcome to the Home Page!
Thanks for signing in! You can join one of our chat rooms to interact with other students and discuss any problems or solution of the class.
There are many separate rooms you can choose according to the courses.
You can also create your own room which other students can join for chatting.

Also, you can upload your PDF documents in the Documents option above and comment on the pages for your reference and save the PDF accordingly.
This makes it easier to make notes while studying!
To view the previously saved comments, you can simply reload the PDF you made the comments on!
You can also update your Account options by visiting the MyAccount page</p>

  </div>

);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(HomePage);