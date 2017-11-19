import React from 'react';
import Dotdotdot from 'react-dotdotdot';
import './css/index.css';
import Shout from './newShout';
import LogHere from './logHere';
import firebaseConfig from './firebase-helpers/firebaseConfig';
import purgeOldDatabaseDataAndDrawNew from './firebase-helpers/purgeOldDatabaseDataAndDrawNew';
import Nav from './nav';
import stickyModals from './stickyModals';
import PostForm from './postForm';
import drawEntry from './drawEntry.js';
import drawDeleteEntryButton from './drawDeleteEntryButton';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            listOfShouts: [],
            listOfEntries: [],
            loaded: false,
            whoId: 'anonymous',
            whoName: 'anonymous',
            showLogin: false,
            login: 'Signed out',
            now: Date.now(),
            expiration: 24,
            refShoutbox: "",
            keyName: "",
            firebase: global.firebase,
            firebaseui: global.firebaseui,
            cats: [0,1,2,3],
            showForm: false
        };
        this.handler = this.handler.bind(this);
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
                        //this.forceUpdate()
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

    drawShouts() {
        const rootRef = this.state.firebase.database().ref("/shoutbox").orderByChild("timestamp").limitToLast(10);
        console.log('rootRef: ' + rootRef)
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
            //this.initLogin();
        });
    }

    drawEntries() {
        const rootRef = this.state.firebase.database().ref().child("/entries").orderByChild("timestamp").limitToLast(50);
        rootRef.on("child_added", (snap) => {
            const previousList = this.state.listOfEntries;
            let entry = {
                category: snap.val().category,
                email: snap.val().email,
                handle: snap.val().handle,
                message: snap.val().message,
                timestamp: snap.val().timestamp,
                title: snap.val().title,
                whoName: snap.val().whoName,
                whoId: snap.val().whoId,
                key: snap.V.path.o[1]
            }
            previousList.push(entry);
            this.setState({
                listOfEntries: previousList
            });
            console.log(`whoname: ${snap.val().whoName}, whoId: ${ snap.val().whoId}`);
            console.log(`${this.state.listOfEntries.length > 0 ? `Entries rendered in ${Date.now() - this.state.now} ms.` : `rendering...`}`);
            this.setState({
                loaded: true
            });
            drawEntry(this.state.expiration, entry);
            
        
            //this.initLogin();
        });
    }

    componentWillMount() {
        console.log(`Starting app ${navigator.onLine ? `online` : `offline`}...`);
    
        this.configBase();
    }

    componentDidMount() {
        purgeOldDatabaseDataAndDrawNew("shoutbox", this.state.refShoutbox);
        this.initLogin();
        this.drawShouts();
        this.drawEntries();
console.log(this.state.listOfEntries.length);
        let startmodals = this.state.cats.map((nr, i) => stickyModals(nr));
       
    }

    componentDidUpdate() {
        document.querySelectorAll(".shout:last-of-type")[0].scrollIntoView();
         //this.setState({ showForm: this.props.showForm })
        console.log('whoName:');
        console.log(this.state.whoName);

    }

    handler() {
  
    this.setState({
      showForm: false
    })
  }

    render() {

        drawDeleteEntryButton(this.state.whoId, this.state.whoName);
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
                <Dotdotdot className= "p-sticky" clamp={2 | String | 'auto'}>
                    Hello users, here is your admin speaking. All entries with Category {nr} go into here. The entries are purged every 24h. The entries are validated, but not moderated. Good luck and have fun.
                </Dotdotdot>           
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
              <h1> Message Board
                    <button id="showAdd" className="add-button" onClick= {() => this.setState({showForm: true})}>+</button> 
               </h1>
               <LogHere who= {this.state.login} loaded={this.state.loaded}/>
               <PostForm handleToggle={this.handler} who= {this.state.login} toggle={this.state.showForm} whoId={this.state.whoId} whoName={this.state.whoName}/>
               <Nav />
               <div className="tab-content fill">
                    {listOfCats}
                    <div id="shoutbox" className="tab-pane fade in active">
                      <form className="form-horizontal" id="shoutboxForm">
                        <div id="shoutbox-inner"> 
                            <div> {listOfShouts} </div> 
                        </div>
                        <Shout firebase={this.state.firebase} handle={this.state.handle} whoName={this.state.whoName} whoId={this.state.whoId}/>
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