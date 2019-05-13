import React from 'react';
import SignOutButton from './SignOut';

const switcher = (props, x) =>
{
    if (props.propEx !== undefined)
    {
        switch (x) {
            case "signin":
                props.propEx.history.push("/");
                break;
            case "chat":
                props.propEx.history.push("/chat");
                break;
            case "pdf":
                props.propEx.history.push("/pdfViewer");
                break;
            default:
                break;
        }
    }
    else {
        console.log("props. is empty");
    }
}


// make a function and add the logic for signing out, use props to pass data from your component into this component, use switcher to redirect to the page you want. If you think of making any other page, make the higher order component as this component in your file and pass this.props.

const header = (props) => (
    <div className="window">
                <header className="toolbar toolbar-header">
                    <div className="toolbar-actions">
                        <button className="btn btn-default"  onClick={() => {switcher(props, "chat")}}>
                            <span className="icon icon-chat icon-text"></span>
                            Chatroom
                        </button>
                <button className="btn btn-default"  onClick={() => {switcher(props, "pdf")}}>
                            <span className="icon icon-newspaper icon-text"></span>
                            Documents
                        </button>
<<<<<<< HEAD
                        <button className="btn btn-default" onClick={() => {switcher(props, "signin")}}>
=======
                        <button className="btn btn-default"  onClick={() => {props.propEx.history.push("/chat")}}>
>>>>>>> 47423c79ae7fd40f3130700bbfcd56b4e255870a
                            <span className="icon icon-chat icon-text"></span>
                            Sign In
                        </button>
                        <button className="btn btn-default" onClick={() => {switcher(props, null)}}> 
                                    <span className="icon icon-chat icon-text"></span>
                                    Sign Out
                        </button>
<<<<<<< HEAD
                            </div>
                        </header>
=======
                        <button className="btn btn-default"  onClick={() => {props.propEx.history.push("/account")}}>
                            <span className="icon icon-chat icon-text"></span>
                            My Account
                        </button>
                        <SignOutButton/>
                    </div>
                </header>
>>>>>>> 47423c79ae7fd40f3130700bbfcd56b4e255870a
            {props.children}
    </div>
)

export default header;