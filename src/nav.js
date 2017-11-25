import React, { Component } from 'react';
import './css/App.css';

class Nav extends React.Component {
    render() {
        return (
            <nav>
                <div className="navbar-header">
                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                        <span className="icon-bar"></span>
                    </button>
                </div>
                <div className="collapse navbar-collapse" id="myNavbar">
                    <ul className="nav nav-tabs nav-justified child-borders">
                        <li><a className="col shadow shadow-hover" data-toggle="tab" href="#cat0"><h3>Category 0</h3></a></li>
                        <li><a className="col shadow shadow-hover" data-toggle="tab" href="#cat1"><h3>Category 1</h3></a></li>
                        <li><a className="col shadow shadow-hover" data-toggle="tab" href="#cat2"><h3>Category 2</h3></a></li>
                        <li><a className="col shadow shadow-hover" data-toggle="tab" href="#cat3"><h3>Category 3</h3></a></li>
                        <li className="active" id="sb"><a data-toggle="tab" href="#shoutbox"><h3>Shoutbox</h3></a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default Nav;