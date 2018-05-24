import React, { Component } from 'react';
import propTypes from 'prop-types';
import Form from './form';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Order extends Component {
    constructor( props ){
        super( props );
        this.editOrder = this.editOrder.bind( this );
        this.state = {edit: false}
        let match = this.props.routerProps.match;
        if( ! this.props.order.hasOwnProperty( 'Order_Id' ) ){
            axios.get( this.props.api + 'sale/' + match.params.id )
                .then( result => {
                    this.props.onOrderChange( result.data.data );
                })
        }

    }
    editOrder( e ){
        e.preventDefault();
        this.setState({ edit: true })
    }
    render() {
        return (
            <div>
                <h1>Order#: { this.props.order.Order_Id }</h1>
                <Link to="/orders">Back</Link>
                { ! this.state.edit && <a href="#" onClick={ this.editOrder }>Edit</a> }
                { this.props.order.hasOwnProperty( 'Order_Id' ) &&
                    <Form details={this.props.order} edit={ this.state.edit } api={ this.props.api } />
                }
            </div>
        )
    }
}
Order.propTypes = {
    order: propTypes.object,
    onOrderChange: propTypes.func,
    id: propTypes.string || propTypes.number,
    routerProps: propTypes.object,
    api: propTypes.string.isRequired
};


export default Order;
