import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import pdfContainer from './component/pdfContainer';
import { PDFViewer } from '@react-pdf/renderer';
import {NavLink, BrowserRouter as Router, Route,Switch} from 'react-router-dom';
import pdf from './component/pdfindex'
//import saiku from './component/saikuPdf'
const App = () => {
  return <Switch>
    
      <Route exact path='/pdf1' component={pdfContainer}/>
    
      
  </Switch>
};

export default App;
