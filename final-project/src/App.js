import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Chat from "./components/chatRoom"


class App extends Component {
  render() {
    return (
      <Router>
      <div>
        <Route exact path="/" component={Chat} />
        
      </div>
    </Router>
    );
  }
}

export default App;
