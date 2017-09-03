import React, { Component } from 'react';
import './App.css';

class LogHere extends React.Component {
	 constructor() {
    super();
    this.state = {
    };
  }

render() { 
	return (
		<div><div id="firebaseui-auth-container"> </div>
        <div id="sign-in-status"> </div> <div id="sign-in" ></div>
        <div id="account-details"> </div> <h1> Message Board Shoutbox</h1>
        <div className="loader" id="ldr" ></div></div>
        ) 
    }

}

export default LogHere;