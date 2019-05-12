import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyByKygBO_fpEMbRRHt73xL0I2rVOvTrHkM",
  authDomain: "cs554project.firebaseapp.com",
  databaseURL: "https://cs554project.firebaseio.com",
  projectId: "cs554project",
  storageBucket: "cs554project.appspot.com",
  messagingSenderId: "585876708249",
  appId: "1:585876708249:web:5d48a6df6313c36c"
};

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.auth = app.auth();
    this.db = app.database();
  }

  doCreateUserWithEmailAndPassword = (email, password, username) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  user = uid => this.db.ref(`users/${uid}`);

  users = () => this.db.ref('users');
}

export default Firebase;