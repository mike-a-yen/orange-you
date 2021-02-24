import React, { Component } from 'react';
import logo from "../logo.svg";

class LoadingIcon extends Component {
    render() { 
        return ( 
            <React.Fragment>
                <span className="App-logo">
                    <img src={logo} className="App-logo"></img>
                </span>
            </React.Fragment>
         );
    }
}
 
export default LoadingIcon;