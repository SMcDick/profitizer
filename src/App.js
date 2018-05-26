import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';
import OrderWrapper from './orderWrapper'

class Home extends Component{
    render(){
        return (
            <div>
                <Link to='/inventory'>Inventory</Link>
                <Link to="/orders">Orders</Link>
            </div>);
    }
}
class Inventory extends Component{
    render(){
        return( <div>Inventory (Eventually)</div> );
    }
}

class App extends Component {
    constructor(){
        super();
        // this.state = {
        //     order: {},
        //     orders: []
        // }
        // this.handleChange = this.handleChange.bind( this );
    }
    // handleChange( changeObj ){
    //     this.setState( changeObj )
    // }

    render(){
        return (
            <Router>
                <div className="App width-wrapper">
                    <ul>
                        <li><NavLink exact to="/">Home</NavLink></li>
                    </ul>
                    <hr />
                    <Route exact path="/" component={ Home } />
                    <Route path="/inventory" component={ Inventory } />
                    <Route path="/orders" component={ OrderWrapper } />
                </div>
            </Router>
         );
    }
}

export default App;
