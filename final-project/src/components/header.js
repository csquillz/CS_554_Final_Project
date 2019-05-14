import React from 'react';

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
                <header className="toolbar toolbar-header" style={{"pointerEvents": "auto"}}>
                    <div className="toolbar-actions">
                        <button className="btn btn-default"  onClick={() => {switcher(props, "chat")}}>
                            <span className="icon icon-chat icon-text"></span>
                            Chatroom
                        </button>
                <button className="btn btn-default"  onClick={() => {switcher(props, "pdf")}}>
                            <span className="icon icon-newspaper icon-text"></span>
                            Documents
                        </button>
                        <button className="btn btn-default" onClick={() => {switcher(props, "signin")}}>
                            <span className="icon icon-chat icon-text"></span>
                            Sign In
                        </button>
                        <button className="btn btn-default" onClick={() => {switcher(props, null)}}> 
                                    <span className="icon icon-chat icon-text"></span>
                                    Sign Out
                        </button>
                            </div>
                        </header>
            {props.children}
    </div>
)

export default header;