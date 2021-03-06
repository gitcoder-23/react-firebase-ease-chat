import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// firebase functions credentials
// site not deployed because of untick the hosting

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
// import App from './App';
import reportWebVitals from './reportWebVitals';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';

// all components
import LoginComponent from './login/login';
import SignupComponent from './signup/signup';
import DashboardComponent from './dashboard/dashboard';

// firebase functions credentials
// site not deployed because of untick the hosting
// const firebase = require('firebase/app');
// require('firebase/firestore');

firebase.initializeApp({
  apiKey: "AIzaSyDG2PfiJiVfV2LcEWSc_QxdrHgnyrQdFXA",
  authDomain: "easychat-b510b.firebaseapp.com",
  databaseURL: "https://easychat-b510b.firebaseio.com",
  projectId: "easychat-b510b",
  storageBucket: "easychat-b510b.appspot.com",
  messagingSenderId: "272673462517",
  appId: "1:272673462517:web:25e2b5c8635a53210c0dbc",
  measurementId: "G-7S226L091X"
});

// routing
const routing = (
  <Router>
    <div id="routing-container">
      <Route exact path='/login' component={LoginComponent}/>
      <Route path='/signup' component={SignupComponent}/>
      <Route path='/dashboard' component={DashboardComponent}/>

    </div>
  </Router>
);


ReactDOM.render(
  // <React.StrictMode></React.StrictMode>
  // routing object call here
    routing,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
