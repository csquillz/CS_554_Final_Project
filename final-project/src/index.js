import React from 'react';
import ReactDOM from 'react-dom';
import './assets/css/photon.css';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import registerServiceWorker from './registerServiceWorker';
<<<<<<< HEAD
ReactDOM.render((        
        <BrowserRouter>    
=======
import Firebase, { FirebaseContext } from './components/Firebase';

ReactDOM.render((
    <div>
        <FirebaseContext.Provider value={new Firebase()}>
        <BrowserRouter>
>>>>>>> 9bb6b1fbaf8830fa1fde549347adf1937b741099
            <App />
        </BrowserRouter>
    </FirebaseContext.Provider>
    </div>
), document.getElementById('root'));
registerServiceWorker();
