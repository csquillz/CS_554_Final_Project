import React from 'react';
import { Link } from 'react-router-dom';

import * as ROUTES from '../../const/routes';

import SignOutButton from '../SignOut';


const Navigation = ({ authUser }) => (
  <div>{authUser ? <NavigationAuth /> : <NavigationNonAuth />}</div>
);

const NavigationAuth = () => (
  <ul>
    <li>
      <Link to={ROUTES.LANDING}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.HOME}>Home</Link>
    </li>
    <li>
      <Link to={ROUTES.ACCOUNT}>Account</Link>
    </li>
    <li>
      <Link to={ROUTES.ADMIN}>Admin</Link>
    </li>
    <li>
      <SignOutButton />
    </li>
    <li>
      <Link to={ROUTES.CHAT}>Chat</Link>
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul style={{"margin": "1rem", "marginTop": "2rem"}}>
    <li>
      <Link to={ROUTES.LANDING} style={{"color": "#1073f3", "textDecoration": "none", "cursor": "pointer", "fontSize": "18px"}}>Landing</Link>
    </li>
    <li>
      <Link to={ROUTES.SIGN_IN} style={{"color": "#f24a2a", "textDecoration": "none", "cursor": "pointer", "fontSize": "18px"}}>Sign In</Link>
    </li>
  </ul>
);

export default Navigation;