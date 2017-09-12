import React, { Component } from 'react';
import './css/App.css';

class LogHere extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            logged: props.who,
            displayStyle: 'none',
            loaded: props.loaded
        };
    }

    hideLoader() {
        return this.state.loaded ? 'none' : 'block';
    }

    showLoginBox() {
        let style;
        this.state.displayStyle === 'none' ? style = 'block' : style = 'none';
        this.setState({ displayStyle: style });
        if (
            this.state.whoName !== "anonymous"
        ) {
            //document.querySelector("#contactForm p").textContent = "Adding entry as anonymous, or specify below:";
            let firebase = global.firebase;
            firebase.auth().signOut();
            //wipedeleteEntryButton();
        }
    }

    componentWillReceiveProps() {
        this.setState({ loaded: this.props.loaded });
    }

    render() {
        return (
            <div><div id="firebaseui-auth-container" style={{display: this.state.displayStyle}}> </div>
        <div id="sign-in-status"> {this.props.who}</div> 
        <div id="sign-in" onClick= {() => this.showLoginBox()}> {this.props.who === 'Signed out' ? 'Sign in' : 'Sign out'}</div>
        <div id="account-details" ></div> <h1 > Message Board Shoutbox</h1>
        <div className="loader" style={{display: this.hideLoader()}} id="ldr" ></div></div>
        )
    }
}

export default LogHere;