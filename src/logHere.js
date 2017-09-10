import React, { Component } from 'react';
import './App.css';

class LogHere extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
    	 logged: props.who,
    	 displayStyle: 'none',
    };
  }


showLoginBox() {
	let style;
	if (this.state.displayStyle === 'none') { style = 'block'}
		else { style = 'none'}
	this.setState({displayStyle: style});
}


render() { 
	return (
		<div><div id="firebaseui-auth-container" style={{display: this.state.displayStyle}}> </div>
        <div id="sign-in-status"> {this.props.who}</div> 
        <div id="sign-in" onClick= {() => this.showLoginBox()}> {this.props.who === 'Signed out' ? 'Sign in' : 'Sign out'}</div>
        <div id="account-details" ></div> <h1 > Message Board Shoutbox</h1>
        <div className="loader" id="ldr" ></div></div>
        ) 
    }
}

export default LogHere;