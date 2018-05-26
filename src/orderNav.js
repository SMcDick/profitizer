import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class OrderNav extends Component {
    render(){
        return (
            <ul>
                <li><Link to="/orders/create">Create New Order</Link></li>
                <li><Link to="/orders/all">View All Orders</Link></li>
            </ul>
        );
    }
}
 export default OrderNav
