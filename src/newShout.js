import React from 'react';
import './css/App.css';

class Shout extends React.Component {
    constructor() {
        super();
        this.state = {
            shout: "",
        };
    }

    handleSubmit(event) {
        switch (this.state.shout) {
            case '':
                break;
            default:
                let firebase = this.props.firebase;
                let shout = this.state.shout;
                let handle = "anon";
                let who = this.props.handle || this.props.whoName;
                let timestamp = Date.now();
                let whoId = this.props.whoId || "anonymous";
                let whoName = this.props.whoName;
                let data = {
                    shout,
                    timestamp,
                    whoId,
                    whoName,
                    handle
                };
                firebase.database().ref("/shoutbox").push(data);
                console.log("Creating shout...");
                console.log(data);
                this.setState({
                    shout: ''
                });
        }
        event.preventDefault();
    }

    handleChange(event) {
        this.setState({
            shout: event.target.value
        });
    }

    render() {
        return (
            <div>
        <label htmlFor="handle" className="control-label"> </label>
        <div>
          <input
            type="text"
            className="form-control required"
            id="shout"
            name="shout"
            placeholder="type here to send"
            value={this.state.shout}
            onChange={this.handleChange.bind(this)}
            required
          />
          <input
            id="submitShoutbox"
            name="submit-shout"
            type="submit"
            value="Send"
            onClick={this.handleSubmit.bind(this)}
          />
        </div>
      </div>
        );
    }
}

export default Shout;