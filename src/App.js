import React from 'react';
import './css/index.css';
import Shout from './newShout';
import LogHere from './logHere';
import firebaseConfig from './firebase-helpers/firebaseConfig';
import purgeOldDatabaseDataAndDrawNew from './firebase-helpers/purgeOldDatabaseDataAndDrawNew';
import Nav from './nav';
import stickyModals from './stickyModals'

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            listOfShouts: [],
            loaded: false,
            whoId: null,
            whoName: 'anonymous',
            showLogin: false,
            login: 'Signed out',
            now: Date.now(),
            expiration: 24,
            refShoutbox: "",
            keyName: "",
            firebase: global.firebase,
            firebaseui: global.firebaseui,
            cats: [0,1,2,3]
        };
    }

    configBase() {
        let config = firebaseConfig.base;
        let firebase = this.state.firebase;
        firebase.initializeApp(config);
        let uiConfig = firebaseConfig.ui;
        let ui = new this.state.firebaseui.auth.AuthUI(
            this.state.firebase.auth()
        );
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
                    this.setState({
                        whoId: user.uid,
                        whoName: user.displayName
                    });
                    let displayName = user.displayName;
                    let uid = user.uid;
                    user.getIdToken().then((accessToken) => {
                        //document.querySelector("#contactForm p").textContent = "Adding entry as " + displayName + ", or specify below:";
                        this.setState({
                            login: `Signed in as ${displayName}`
                        });
                    });
                } else {
                    this.setState({
                        login: 'Signed out',
                        whoId: null,
                        whoName: 'anonymous'
                    });
                }
            },
            (error) => {
                console.log(error);
            }
        );
    };

    componentWillMount() {
        console.log(`Starting app ${navigator.onLine ? `online` : `offline`}...`)
        this.configBase();
    }

    componentDidMount() {
        purgeOldDatabaseDataAndDrawNew("shoutbox", this.state.refShoutbox);
        const rootRef = this.state.firebase.database().ref().child("/shoutbox").orderByChild("timestamp").limitToLast(10);
        rootRef.on("child_added", (snap) => {
            const previousList = this.state.listOfShouts;
            previousList.push({
                timestamp: snap.val().timestamp,
                shout: snap.val().shout,
                whoName: snap.val().whoName,
                whoId: snap.val().whoId
            });
            this.setState({
                listOfShouts: previousList
            });
            console.log(`whoname: ${snap.val().whoName}, whoId: ${ snap.val().whoId}`);
            console.log(`${this.state.listOfShouts.length === 10 ? `Shouts rendered in ${Date.now() - this.state.now} ms.` : `rendering...`}`);
            this.setState({
                loaded: true
            });
            this.initLogin();
        });
        let startmodals = this.state.cats.map((nr, i) => stickyModals(nr));
    }

    componentDidUpdate() {
        document.querySelectorAll(".shout:last-of-type")[0].scrollIntoView();
    }

    render() {
        let who = this.state.whoId;
        let float = (item) => { return who !== item.whoId ? 'right' : 'left' };
        const listOfShouts = this.state.listOfShouts.map((item, i) =>
            <div className="shout" style={{float: float(item)}} key={i}>
           <h1> {item.shout} </h1>
            <p>
                {item.whoName}
            </p>
            <p style={{fontStyle: 'italic'}}>
                {new Date(item.timestamp).toLocaleTimeString()} on {new Date(item.timestamp).toLocaleDateString()}
            </p>
          </div>
        );

        const listOfCats = this.state.cats.map((nr, i) =>
            <div id={"cat" + nr}  key={i} className="tab-pane fade">
            <div data-cat={"Category " + nr} className={"board-item -sticky"+ nr} id={"-sticky" + nr}>
                <h4>Sticky - Admin</h4>
                <p>Hello users, here is your admin speaking. All entries with Category {nr} go into here. The entries are purged every 24h. The entries are validated, but not moderated. Good luck and have fun.</p>
            </div>
            <div id={"modal--sticky" + nr} className={"modal -sticky" + nr} data-user-id="Admin" data-user-name="Admin">
                <div className="modal-content">
                    <div className="modal-header">
                        <span id={"close-modal--sticky" + nr} className="close"  >×</span>
                        <h2>Sticky</h2>
                    </div>
                    <div className="modal-body">
                        <p>Hello users, here is your admin speaking. All entries from Category {nr} go into here. The entries are purged every 24h. The entries are validated, but not moderated. Good luck and have fun.</p>
                    </div>
                    <div className="modal-footer">
                        <p>Admin</p>
                        <p>Added in July, 2017.<br/>Expires: never.</p>
                    </div>
                </div>
            </div>    
        </div>
        );

        return (<div>
            <div className="container board-container">
              <div className="board-title">
               <LogHere who= {this.state.login} loaded={this.state.loaded}/>
               <Nav />
               <div className="tab-content fill">
                    {listOfCats}
                    <div id="shoutbox" className="tab-pane fade in active">
                      <form className="form-horizontal" id="shoutboxForm">
                        <div id="shoutbox-inner"> 
                            <div> {listOfShouts} </div> 
                        </div>
                        <Shout state = {this.state}/>
                      </form>
                    </div>
                </div>
                <footer> Made by KR. </footer>
              </div>
            </div>
          </div>);
    }
}

export default App;