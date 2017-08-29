class NeWShout extends React.Component {
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
        this.setState({ shout: event.target.value });
    }

    render() {
        return (<div>
            <label htmlFor="handle" className="control-label"></label>
                <div>
                    <input
                        type="text"
                        className="form-control required"
                        id="shout"
                        name="shout"
                        placeholder="start typing to enable realtime"
                        value={this.state.shout}
                        onChange={this.handleChange.bind(this)}
                        required
                    />
                    <input
                        id="submitShoutbox"
                        name="submit"
                        type="submit"
                        value="Send"
                        onClick={this.handleSubmit.bind(this)}
                    />
                    {" "}
                    {" "}
                </div>
            </div>
        );
    }
}

export default NeWShout;
