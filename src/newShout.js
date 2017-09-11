import React from 'react';
import './App.css';

class Shout extends React.Component {
  constructor() {
    super();
    this.state = {
      shout: "",
    };
  }

  handleSubmit(event) {
    let firebase =  this.props.state.firebase;
    let shout = this.state.shout;
    let handle = "anon";
    let who = this.props.state.handle || this.props.state.whoName;
    let timestamp = Date.now();
    let whoId = this.props.state.whoId || "anonymous";
    let data = {
      shout: shout,
      timestamp: timestamp,
      whoId: this.props.state.whoId,
      whoName: this.props.state.whoName,
      handle: handle
    };
    firebase.database().ref("/shoutbox").push(data);
    console.log("Creating shout...");
    console.log(data);
    this.setState({
      shout: ''
    });
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
            placeholder="type here"
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
        </div>
      </div>
    );
  }
}

export default Shout;
