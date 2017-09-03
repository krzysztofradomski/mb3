import React from 'react';
import './App.css';
import Shout from './newShout';
//import configBase from './configBase';

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      listOfShouts: [],
      loaded: false,
      whoId: null,
      whoName: "anonymous",
      showLogin: false,
      now: Date.now(),
      expiration: 24,
      refShoutbox: "",
      keyName: "",
      firebase: global.firebase,
      firebaseui: global.firebaseui
    };
    this.initLogin =  this.initLogin.bind(this);

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

  initLogin() {
    let firebase = this.state.firebase; 

    firebase.auth().onAuthStateChanged(
        (user) => {


            if (user) {
                /* user is signed in */
                this.setState({
                whoId: user.uid,
                whoName: user.displayName
                });
                let displayName = user.displayName;
                let uid = user.uid;
                user.getToken().then(function(accessToken) {
                    document.getElementById("sign-in-status").textContent =
                        "Signed in as " + displayName;
                    document.getElementById("sign-in").textContent = "Sign out";
                    document.querySelector("#contactForm p").textContent =
                        "Adding entry as " +
                        displayName +
                        ", or specify below:";
                });
            } else {
                /* user is signed out */
                this.setState({
                whoName: "anonymous"
              });
                document.getElementById("sign-in-status").textContent =
                    "Signed out";
                document.getElementById("sign-in").textContent = "Sign in";
            }
        },
        (error) => {
            console.log(error);
        }
    );
};

/* show or hide log options */
showLoginOptions() {
    if (
        document.getElementById("sign-in").textContent === "Sign out" &&
        this.state.whoName !== "anonymous"
    ) {
        document.querySelector("#contactForm p").textContent =
            "Adding entry as anonymous, or specify below:";
            let firebase = this.state.firebase; 
        firebase.auth().signOut();
        //wipedeleteEntryButton();
        console.log(this.state);
         this.setState({
        whoId: null,
        whoName: null
      });
    }

    if (this.state.showLogin === false) {
        document.getElementById("firebaseui-auth-container").style.display =
            "block";
             this.setState({
        showLogin: true
      });
    } else if (this.state.showLogin === true) {
        document.getElementById("firebaseui-auth-container").style.display =
            "none";
             this.setState({
        showLogin: false
      });
    }
};


  purgeOldDatabaseDataAndDrawNew(name, ref) {
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
        deleted !== 0
          ? console.log("Finished purging old data from: " + name)
          : console.log("..." + name + " up to date, no data purged...");
      });
  }

  hideProgress() {
    if (
      this.state.loaded === false &&
      document.querySelector(".loader") !== null
    ) {
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
    console.log('Starting app online...')
    this.configBase();
  }

  componentDidMount() {
    this.purgeOldDatabaseDataAndDrawNew("shoutbox", this.state.refShoutbox);
    const rootRef = this.state.firebase.database().ref().child("/shoutbox").orderByChild("timestamp").limitToLast(10);

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
      document.querySelectorAll(".shout:last-of-type")[0].scrollIntoView();

      this.hideProgress();
      this.showLoginOptions();
      this.initLogin();
      
    });
  }

  componentDidUpdate() {
    document.querySelectorAll(".shout:last-of-type")[0].scrollIntoView();
  }

  render() {
    const listOfShouts = this.state.listOfShouts.map((item, i) =>
      <div className="shout" key={i}>
        <p>
          {new Date(item.timestamp).toLocaleTimeString()} on {new Date(item.timestamp).toLocaleDateString()}, by {item.whoName}
        </p>
        {" "}
        <h1> {item.shout} </h1>
        {" "}
      </div>
    );
    return (<div>
    <div className="container board-container">
      <div className="board-title">
       <div id="firebaseui-auth-container"> </div>
        <div id="sign-in-status"> </div> <div id="sign-in"> </div>
        <div id="account-details"> </div> <h1> Chuttup </h1>
        <div className="loader" id="ldr" ></div>
        <div id="shoutbox" className="tab-pane">
          <form className="form-horizontal" id="shoutboxForm">
            <div id="shoutbox-inner"> <div> {listOfShouts} </div> </div>

            <Shout state = {this.state}/>
          </form>

        </div>

        <footer> Made by KR. </footer>

      </div>

    </div>
  </div>);
  }
}

export default App;
