import React, { Component } from 'react';
import propTypes from 'prop-types';
import Form from './form';


class Order extends Component {
    constructor( props ){
        super( props )
        console.log( props );
        this.resetOrders = this.resetOrders.bind( this );
        this.editOrder = this.editOrder.bind( this );
        this.state = {edit: false}
    }
    resetOrders( e ){
        e.preventDefault();
        this.props.onOrderChange( '' )
    }
    editOrder( e ){
        e.preventDefault();
        this.setState({ edit: true })
    }
    render() {
        return (
            <div>
                <h1>Order#: { this.props.order.Order_Id }</h1>
                <a href="#" onClick={ this.resetOrders }>Back</a>
                { ! this.state.edit && <a href="#" onClick={ this.editOrder }>Edit</a> }
                <Form details={this.props.order} edit={ this.state.edit } />
            </div>
        )
    }
}
Order.propTypes = { order: propTypes.object, onOrderChange: propTypes.func };


export default Order;
