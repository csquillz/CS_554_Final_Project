import React from 'react';
import { Link } from 'react-router-dom';
import * as ROUTES from '../../const/routes';
import SignOutButton from '../SignOut';
import { AuthUserContext } from '../Session';


const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? <NavigationAuth /> : <NavigationNonAuth />
      }
    </AuthUserContext.Consumer>
  </div>
);

const NavigationAuth = (props) => (
  <div className="root">
                <header className="toolbar toolbar-header">
                    <div className="toolbar-actions">
                        {/* <div className="btn-group">
                            <button className="btn btn-default">
                                <span className="icon icon-left-open"></span>
                            </button>
                            <button className="btn btn-default">
                                <span className="icon icon-right-open"></span>
                            </button>
                            <button className="btn btn-default">
                                <span className="icon icon-dot-3"></span>
                            </button>
                        </div> */}
                        <Link to={ROUTES.HOME}>
                        <button className="btn btn-default">
                            <span className="icon icon-home icon-text"></span>
                            Home
                        </button></Link>
                        <Link to={ROUTES.PDF}>
                        <button className="btn btn-default" >
                            <span className="icon icon-newspaper icon-text"></span>
                            Documents
                        </button></Link>
                        <Link to={ROUTES.CHAT}>
                        <button className="btn btn-default">
                            <span className="icon icon-chat icon-text"></span>
                            Chatroom
                        </button></Link>
                        <Link to={ROUTES.ACCOUNT}>
                        <button className="btn btn-default">
                            <span className="icon icon-chat icon-text"></span>
                            My Account
                        </button></Link>
                        <SignOutButton/>
                    </div>
                </header>
            {props.children}
    </div>
);

const NavigationNonAuth = (props) => (
<div className="root">
                <header className="toolbar toolbar-header">
                    <div className="toolbar-actions">
                        {/* <div className="btn-group">
                            <button className="btn btn-default">
                                <span className="icon icon-left-open"></span>
                            </button>
                            <button className="btn btn-default">
                                <span className="icon icon-right-open"></span>
                            </button>
                            <button className="btn btn-default">
                                <span className="icon icon-dot-3"></span>
                            </button>
                        </div> */}
                        <Link to={ROUTES.LANDING}>
                        <button className="btn btn-default">
                            <span className="icon icon-home icon-text"></span>
                            Home
                        </button></Link>
                        <Link to={ROUTES.SIGN_IN}><button className="btn btn-default">
                            <span className="icon icon-home icon-text"></span>
                            Sign In
                        </button>
                        </Link>
                    </div>
                </header>
            {props.children}
    </div>
);

export default Navigation;