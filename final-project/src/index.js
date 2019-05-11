import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/photon.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
ReactDOM.render((
    <div className="window">
        <header className="toolbar toolbar-header">
            <div className="toolbar-actions">
                <div className="btn-group">
                    <button className="btn btn-default">
                        <span className="icon icon-home"></span>
                    </button>
                    <button className="btn btn-default">
                        <span className="icon icon-shuffle"></span>
                    </button>
                </div>
                <button className="btn btn-default">
                    <span className="icon icon-home icon-text"></span>
                    Filters
                </button>
            </div>
        </header>
        <BrowserRouter>    
            <App/>
        </BrowserRouter>
    </div>
), document.getElementById('root'));
registerServiceWorker();
