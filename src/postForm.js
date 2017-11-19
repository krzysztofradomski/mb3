import React, { Component } from 'react';

import './css/App.css';

const Captcha = require('react-captcha');  

class PosthtmlForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            logged: props.who,
            whoName: props.whoName,
            whoId: props.whoId,
            displayStyle: 'none',
            toggle:false,
            handle: '',
            message: '',
            activeInput: null,
            heading: 'Type in your message below:'
        };
        this.handleInputChange = this.handleInputChange.bind(this);

        //this.handleSubmit = this.handleSubmit.bind(this);
    }

    activateField(event) {
        this.setState({
           activeInput: event.target
        });
         event.target.style.border = `2px solid ${this.highlightValidation(event.target)}`;
    }

    handleInputChange(event) {       
        this.activateField(event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    post() {
        let $ = global.jQuery;
        let title = this.state.title;
        let category = $("#category").val();
        let email = this.state.email;
        let message = this.state.message;
        let handle = this.state.handle;
        console.log(category + " " + email + " " + message);
        let timestamp = Date.now();
        let user = global.firebase.auth().currentUser;
        let data = {
            title: this.state.title,
            category: category,
            message: this.state.message,
            email: this.state.email,
            timestamp: timestamp,
            whoId: this.state.whoId,
            whoName: this.state.whoName,
            handle: this.state.handle
        };
        if (global.grecaptcha.getResponse() !== '') {
            console.log(data);
            let push = global.firebase.database().ref("/entries").push(data);
            console.log("Creating entry key: " + push.key);
            this.setState({heading: 'Your message has been sent, this window will now close.'});
            //mb2.drawEntry(mb2.keyName, title, category, message, email, timestamp, mb2.whoId, mb2.whoName, handle);
            //mb2.drawDeleteEntryButton();
            this.setState({ title: '', handle: '', message: '', message: '', email: '' });
            setTimeout(() => this.formReset(), 5000);
        } else
        {
            //console.log(data);
            //let push = global.firebase.database().ref("/entries").push(data);
            console.log("captcha error");
            this.setState({heading: 'Try again now'});
            //mb2.drawEntry(mb2.keyName, title, category, message, email, timestamp, mb2.whoId, mb2.whoName, handle);
            //mb2.drawDeleteEntryButton();
            //this.setState({ title: '', handle: '', message: '', message: '', email: '' });
            //setTimeout(() => this.formReset(), 5000);
        }
        
    }

    formReset() {
         //this.handleToggle();
         this.props.handler(); 
        global.grecaptcha.reset();
        this.setState({ title: '', handle: '', message: '', message: '', email: '' });
        this.setState({toggle: false});
        this.setState({heading: 'Type in your message below:'});
        this.clearValidationHighlight(this.state.activeInput);
    }

    toggle() {

        return this.state.toggle ? 'block' : 'none';
    }

    //  handleToggle() {
    //     console.log('handleToggle')
    //     this.props.handler();    
    // }


    validate(...items) {
        items = items.map((item) => { return item !== undefined && item !== '' });
        let email = this.state.email ? this.state.email.match(/@+\w+\./gi) ? true : false : true;
        //let c = typeof global.grecaptcha !== 'undefined' ? global.grecaptcha.getResponse() : 'no captcha';
        //console.log(c);
        let v = email && items.reduce(function(a, b) { return a * b; });
        console.log(v ? 'validated' : 'not validated');
        return v;
    }

    highlightValidation(field) {
        let email = field.type == 'email' ? field.value.match(/@+\w+\./gi) ? true : false : true;
        return email && typeof field.value !== undefined && field.value !== '' ? 'green' : 'red';
    }

    clearValidationHighlight(field) {
        return field !== null ? field.style.border = '1px solid rgb(204, 204, 204)' : null;
    }

    componentDidMount() {
        // let captcha = global.grecaptcha.render('myCaptcha', {
        //     'sitekey': '6LcGHiUUAAAAAFCQHYmU5ykjBZBhmYdARg3eX3Jc',
        //     'theme': 'light'
        // });
    }

    componentWillReceiveProps(newProps) {
        this.setState({toggle: newProps.toggle });
        console.log('newProps.toggle: ' + newProps.toggle)
        this.setState({whoName: newProps.whoName});
        this.setState({whoId: newProps.whoId});
        //global.grecaptcha.reset();

    }

    componentDidUpdate(prevProps, prevState){

      console.log(prevState.activeInput == this.state.activeInput);
       console.log('form component updated')
      prevState.activeInput !== null && prevState.activeInput.id !== this.state.activeInput.id ? this.clearValidationHighlight(prevState.activeInput) : '';
    }

    render() {
        //let handleToUpdate  =   this.props.handleToUpdate;
        const validated = this.validate(this.state.email, this.state.message, this.state.title, this.state.category);
        return (<div id="modal-input" className="modal" style={{display: this.toggle()}}>
                  <div className="modal-content">
                    <div className="modal-header">
                      <span id="closeAdd" className="close" onClick={() => {this.formReset()}}>&times;</span>
                      <h2>{this.state.heading}</h2>
                    </div>
                    <div className="modal-body">
                      <div id="contact">
                        <div className="">
                          <br/>
                          <div className="">
                            <htmlForm className="htmlForm-horizontal" id="contactForm">
                              <p>Adding entry as {this.state.whoName}, or specify below:</p>
                              <div className="form-group">
                                <label htmlFor="handle" className="control-label">Handle</label>
                                <div>
                                  <input type="text" className="form-control" id="handle" name="handle" placeholder="anonymous" maxLength="30"  value={this.state.handle}
            onChange={this.handleInputChange}
                   />
                                </div>
                                <label htmlFor="title" className="control-label">Title</label>
                                <div>
                                  <input type="text" className="form-control required" id="title" name="title" placeholder="Title example"  maxLength="30" required   value={this.state.title}
            onChange={this.handleInputChange}/>
                                </div>
                                <label htmlFor="category" className="control-label">Category</label>
                                <div>
                                  
                                  <select className="form-control required" id="category" name="category" required onChange={this.handleInputChange}>
                                    <option value="">Choose category...</option>
                                    <option>Category 0</option>
                                    <option>Category 1</option>
                                    <option>Category 2</option>
                                    <option>Category 3</option>
                                  </select>
                                </div>
                                <label htmlFor="email" className="control-label">Email</label>
                                <div>
                                  <input type="email" className="htmlForm-control required" id="email" name="email" placeholder="example@domain.com" maxLength="50" required  value={this.state.email}
            onChange={this.handleInputChange}/>
                                </div>
                                <label htmlFor="message" className="control-label">Message</label>
                                <div>
                                  <textarea className="htmlForm-control" rows="4" id="message" name="message" placeholder="your message" required  value={this.state.message}
            onChange={this.handleInputChange}></textarea>
                                </div>
                                <div className="">
                                  <br/>
                                  <input className="g-recaptcha"
data-sitekey="6LcPXjkUAAAAAPdWdVxs2b1tg6LBK8KYmKc1XqfD" id="submit" name="submit-form" type="submit" disabled={!validated} value="Send" onClick={()=>{this.post();}}/>
                                </div>
                              </div>                        
                            </htmlForm>                   
                            <br/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>);
    }
}

export default PosthtmlForm;