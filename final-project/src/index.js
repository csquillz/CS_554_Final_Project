import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/photon.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import Header from './components/header';
ReactDOM.render((        
        <BrowserRouter>    
            <Header>
                <App />
            </Header>
        </BrowserRouter>
), document.getElementById('root'));
registerServiceWorker();
