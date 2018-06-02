import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';
import OrderWrapper from './orderWrapper'
import InventoryWrapper from './inventoryWrapper'

class Home extends Component{
    render(){
        return (
            <div>
                <Link to='/inventory'>Inventory</Link>
                <Link to="/orders">Orders</Link>
            </div>
        )
    }
}
class App extends Component {
    render(){
        return (
            <Router>
                <div className="App width-wrapper">
                    <ul>
                        <li><NavLink exact to="/">Home</NavLink></li>
                        <li><NavLink to="/inventory">Inventory</NavLink></li>
                        <li><NavLink to="/orders">Orders</NavLink></li>
                    </ul>
                    <hr />
                    <Route exact path="/" component={ Home } />
                    <Route path="/inventory" component={ InventoryWrapper } />
                    <Route path="/orders" component={ OrderWrapper } />
                </div>
            </Router>
         );
    }
}

export default App;
