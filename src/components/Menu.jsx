import React, { Component } from 'react';

class Menu extends Component {
    handleStart() {
        console.log("Clicked start");
    }

    render() { 
        return ( 
            <button onClick={this.handleStart}className="btn btn-info btn-sm m-2">Start</button>
         );
    }
}
 
export default Menu;