import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import logo from './logo.svg';
import './App.css';
import Chat from "./components/chatRoom"
import pdfContainer from './component/pdfContainer';


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
