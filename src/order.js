import React, { Component } from 'react';
import propTypes from 'prop-types';
import Form from './form';
import { Link } from 'react-router-dom';

class Order extends Component {
    constructor( props ){
        super( props );
        this.handleCompleted = this.handleCompleted.bind( this );
        this.state = {
            isCompleted: false,
            order: {},
            loading: true
        }
    }
    static getDerivedStateFromProps( props ){
        let order = props.orders.find( order => order.Order_Id.toString() === props.routerProps.match.params.id.toString() )
        let state = {
            edit: props.routerProps.location.pathname.indexOf( '/edit' ) > -1
        };
        if( props.orders.length ){
            state.loading = false
            if( order ){
                state.order = order
            }
        }
        return state;
    }
    handleCompleted( val ){
        this.setState({ isCompleted: val })
    }
    render() {
        console.log( this.props.routerProps )
        if( this.state.loading ){
            return (<div>Loading...</div>)
        } else if( ! this.state.order.hasOwnProperty( 'Order_Id' ) ){
            return (<div>{'Order not found. Figure our some way to make a new request or if order doesn\'t exist.'}</div>)
        }
        return (
            <div>
                <h1>Order#: { this.state.order.Order_Id }</h1>
                {/* <Link to="/orders">Back</Link> */}
                <a href="#" onClick={ this.props.routerProps.history.goBack }>Back</a>
                { ! this.state.edit && <Link to={ "/orders/" + this.props.routerProps.match.params.id + '/edit' }>Edit</Link> }
                <Form
                    details={ this.state.order }
                    edit={ this.state.edit }
                    api={ this.props.api }
                    handleCompleted={ this.handleCompleted }
                    isCompleted={ this.state.isCompleted }
                    handleOrderUpdates={ this.props.handleOrderUpdates }/>
            </div>
        )
    }
}
Order.propTypes = {
    order: propTypes.object,
    onOrderChange: propTypes.func,
    id: propTypes.string || propTypes.number,
    routerProps: propTypes.object,
    api: propTypes.string,
    orders: propTypes.array,
    handleOrderUpdates: propTypes.func

};


export default Order;
