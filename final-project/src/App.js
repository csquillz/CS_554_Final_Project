import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import pdfContainer from './component/pdfContainer';
import {NavLink, BrowserRouter as Router, Route,Switch} from 'react-router-dom';

const App = () => {
  return <Switch>
      <Route exact path='/pdf' component={pdfContainer}/>
     
  </Switch>
};

export default App;
