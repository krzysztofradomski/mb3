import React from 'react';
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
            let firebase = global.firebase;
            firebase.auth().signOut();
        }
    }

    componentWillReceiveProps() {
        this.setState({ loaded: this.props.loaded });
        //this.setState({ logged: this.props.logged });
    }

    render() {
        return (
            <div>
                <div id="firebaseui-auth-container" style={{display: this.state.displayStyle}}></div>
                <div id="sign-in-status"> {this.props.who}</div> 
                <div id="sign-in" onClick= {() => this.showLoginBox()}> {this.props.who === 'Signed out' ? 'Sign in' : 'Sign out'}</div>         
                <div className="loader" style={{display: this.hideLoader()}} id="ldr" ></div>

            </div>
        )
    }
}

export default LogHere;