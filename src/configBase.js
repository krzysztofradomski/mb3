import React, { Component } from 'react';
import './App.css';

function configBase(state) {
  let this.state = state;
    let config = {
      apiKey: "AIzaSyANmT2lWop_rbnLuXcl2V13Izjg3H3ybaY",
      authDomain: "messageboard1-6c745.firebaseapp.com",
      databaseURL: "https://messageboard1-6c745.firebaseio.com",
      projectId: "messageboard1-6c745",
      storageBucket: "messageboard1-6c745.appspot.com",
      messagingSenderId: "515471374408"
    };
    let firebase = this.state.firebase;
    firebase.initializeApp(config);
    let uiConfig = {
      signInSuccessUrl: "http://localhost:3000/",
      signInOptions: [
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID
      ]
    };
    /* initialize firebase auth */
    const ui = new this.state.firebaseui.auth.AuthUI(
      this.state.firebase.auth()
    );
    /* the start method will wait until the DOM is loaded */
    ui.start("#firebaseui-auth-container", uiConfig);
    let deadline = this.state.now - this.state.expiration * 60 * 60 * 1000;
    this.setState({
      refShoutbox: this.state.firebase
        .database()
        .ref("/shoutbox")
        .orderByChild("timestamp")
        .endAt(deadline)
    });
  }

  export default configBase;