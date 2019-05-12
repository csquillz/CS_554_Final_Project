import React from 'react';



const header = (props) => (
    <div className="window">
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
                        <button className="btn btn-default" onClick={() => {props.propEx.history.push("/")}}>
                            <span className="icon icon-home icon-text"></span>
                            Home
                        </button>
                        <button className="btn btn-default"  onClick={() => {props.propEx.history.push("/pdfViewer")}}>
                            <span className="icon icon-newspaper icon-text"></span>
                            Documents
                        </button>
                        <button className="btn btn-default"  onClick={() => {props.propEx.history.push("/")}}>
                            <span className="icon icon-chat icon-text"></span>
                            Chatroom
                        </button>
                    </div>
                </header>
            {props.children}
    </div>
)

export default header;