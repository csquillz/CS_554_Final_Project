import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/photon.css';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
ReactDOM.render((        
        <BrowserRouter>    
            <App/>
        </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
