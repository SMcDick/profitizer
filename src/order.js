import React, { Component } from 'react';
import propTypes from 'prop-types';
import Form from './form';


class Order extends Component {
    constructor( props ){
        super( props )
        console.log( props );
        this.resetOrders = this.resetOrders.bind( this );
    }
    resetOrders( e ){
        e.preventDefault();
        this.props.onOrderChange( '' )
    }
    render() {
        return (
            <div>
                <h1>Order#: {this.props.order.Order_Id}</h1>
                <a href="#" onClick={this.resetOrders}>Back</a>
                <Form details={this.props.order}/>
            </div>
        )
    }
}
Order.propTypes = { order: propTypes.object, onOrderChange: propTypes.func };


export default Order;
