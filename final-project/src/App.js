import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import './App.css';
import Chat from "./components/chatRoom"
import pdfContainer from './components/pdfContainer';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route exact path="/" component={Chat} />
        <Route exact path='/pdfViewer' component={pdfContainer} />
      </Switch>
    );
  }
}

export default App;
