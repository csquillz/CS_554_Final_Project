import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/photon.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render((
    <div>
        <FirebaseContext.Provider value={new Firebase()}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </FirebaseContext.Provider>
    </div>
), document.getElementById('root'));
registerServiceWorker();
