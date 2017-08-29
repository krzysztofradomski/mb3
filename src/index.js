import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import registerServiceWorker from './registerServiceWorker';


let whoId = null;
let whoName = "anonymous";

let startingTime = Date.now();
let now = Date.now();
/* line below is data lifetime in hours */
let expiration = 24;
let cutoff = now - expiration * 60 * 60 * 1000;
let refShoutbox;
let keyName;
let firebase = global.firebase;
let firebaseui = global.firebaseui;


class Shout extends React.Component {
    constructor() {
        super();
        this.state = {
            shout: ""
        };
        this.handleChange.bind(this);
        this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        let shout = this.state.shout;
        let handle = "anon";
        let who = handle || whoName;
        let timestamp = Date.now();
        whoId = whoId || "anonymous";
        let data = {
            shout: shout,
            timestamp: timestamp,
            whoId: whoId,
            whoName: whoName,
            handle: handle
        };
        let pushShout = firebase.database().ref("/shoutbox").push(data);
        console.log("Creating shout...");
        console.log(who);
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({
            shout: event.target.value
        });
    }

    render() {
        return ( < div >
            <
            label htmlFor = "handle"
            className = "control-label" > < /label> <
            div >
            <
            input type = "text"
            className = "form-control required"
            id = "shout"
            name = "shout"
            placeholder = "start typing to enable realtime"
            value = {
                this.state.shout
            }
            onChange = {
                this.handleChange.bind(this)
            }
            required /
            >
            <
            input id = "submitShoutbox"
            name = "submit"
            type = "submit"
            value = "Send"
            onClick = {
                this.handleSubmit.bind(this)
            }
            /> {
                " "
            } {
                " "
            } <
            /div> <
            /div>
        );
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            listOfShouts: [],
            loaded: false,
            whoId: null,
            whoName: "anonymous",
            showLogin: false,
            listen: false,
            listenForShouts: false,
            startingTime: Date.now(),
            now: Date.now(),
            /* line below is data lifetime in hours */
            expiration: 24,
            cutoff: now - expiration * 60 * 60 * 1000,
            refShoutbox: '',
            keyName: '',
            firebase: global.firebase,
            firebaseui: global.firebaseui
        };
        this.componentWillMount.bind(this);
        this.purgeOldDatabaseDataAndDrawNew.bind(this);
    }

    configBase() {
        let config = {
            apiKey: "AIzaSyANmT2lWop_rbnLuXcl2V13Izjg3H3ybaY",
            authDomain: "messageboard1-6c745.firebaseapp.com",
            databaseURL: "https://messageboard1-6c745.firebaseio.com",
            projectId: "messageboard1-6c745",
            storageBucket: "messageboard1-6c745.appspot.com",
            messagingSenderId: "515471374408"
        };
        let firebase = this.state.firebase;
        this.state.firebase.initializeApp(config);
        let uiConfig = {
            signInSuccessUrl: "http://localhost:3000/",
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID
            ]
        };
        /* initialize firebase auth */
        const ui = new this.state.firebaseui.auth.AuthUI(this.state.firebase.auth());
        /* the start method will wait until the DOM is loaded */
        ui.start("#firebaseui-auth-container", uiConfig);
        let cutoff = this.state.cutoff;
        this.setState({ refShoutbox: firebase
            .database()
            .ref("/shoutbox")
            .orderByChild("timestamp")
            .endAt(cutoff)
    });
}

    purgeOldDatabaseDataAndDrawNew(name , ref) {
        let deleted = 0;
        ref
            .once("value", function(snap) {
                snap.forEach(function(item) {
                    item.ref.remove();
                    deleted = deleted + 1;
                });
                console.log(
                    "Total outdated data removed from " + name + ": " + deleted
                );
            })
            .then(function() {
                deleted !== 0 ?
                    console.log("Finished purging old data from: " + name) :
                    console.log(
                        "..." + name + " up to date, no data purged..."
                    );
            });
    }

    hideProgress() {
        if (this.state.loaded === false && document.querySelector(".loader") !== null) {
            setTimeout(function() {
                document.querySelector(".loader").style.opacity = 0;
                document.querySelector(".loader").style.display = "none";
            }, 500);
        }
        this.setState({
            loaded: true
        });
    }

    componentWillMount() {
        this.configBase();
    }

    componentDidMount() {
        this.purgeOldDatabaseDataAndDrawNew("shoutbox", this.state.refShoutbox);
        const rootRef = firebase.database().ref().child("/shoutbox");

        rootRef.on("child_added", snap => {
            const previousList = this.state.listOfShouts;
            previousList.push({
                timestamp: snap.val().timestamp,
                shout: snap.val().shout,
                whoName: snap.val().whoName
            });
            this.setState({
                listOfShouts: previousList
            });
            document
                .querySelectorAll(".shout:last-of-type")[0]
                .scrollIntoView();

            this.hideProgress();
        });
    }

    componentDidUpdate() {
        document.querySelectorAll(".shout:last-of-type")[0].scrollIntoView();
    }

    render() {
        const listOfShouts = this.state.listOfShouts.map((item, i) =>
            <
            div className = "shout"
            key = {
                i
            } >
            <
            p > {
                new Date(item.timestamp).toLocaleTimeString()
            }
            on {
                " "
            } {
                new Date(item.timestamp).toLocaleDateString()
            }, by {
                " "
            } {
                item.whoName
            } {
                " "
            } <
            /p> <
            h1 > {
                item.shout
            } < /h1> <
            /div>
        );
        return <div > {
            listOfShouts
        } < /div>;
    }
}

//configBase();
ReactDOM.render( <
    div > < div className = "container board-container" >
    <
    div className = "board-title" >
    <
    div id = "firebaseui-auth-container" > < /div> <
    div id = "sign-in-status" > < /div> <
    div id = "sign-in" > < /div> <
    div id = "account-details" > < /div> <
    h1 > Chuttup < /h1><div className="loader" id="ldr"></div >
    <
    div id = "shoutbox"
    className = "tab-pane" >
    <
    form className = "form-horizontal"
    id = "shoutboxForm" >
    <
    div id = "shoutbox-inner" > < App / > < /div>

    <
    Shout / >
    <
    /form> <
    /div> <
    footer > Made by KR. < /footer> <
    /div> <
    /div></div > ,
    document.getElementById("root")
);


//ReactDOM.render(<App />, document.getElementById('shoutbox-inner'));
registerServiceWorker();
