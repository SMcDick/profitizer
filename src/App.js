import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';
import OrderWrapper from './orderWrapper'
import InventoryWrapper from './inventoryWrapper'

class App extends Component {
    render(){
        return (
            <Router>
                <div className="App width-wrapper">
                    <ul>
                        <li><NavLink to="/inventory">Inventory</NavLink></li>
                        <li><NavLink to="/orders">Orders</NavLink></li>
                    </ul>
                    <hr />
                    <Route path="/inventory" component={ InventoryWrapper } />
                    <Route path="/orders" component={ OrderWrapper } />
                </div>
            </Router>
         );
    }
}

export default App;
