import React, { Component } from 'react';
import propTypes from 'prop-types';
import Form from './form';
import axios from 'axios';
import { Link } from 'react-router-dom';

class Order extends Component {
    constructor( props ){
        super( props );
        this.editOrder = this.editOrder.bind( this );
        this.handleCompleted = this.handleCompleted.bind( this );
        this.state = {
            edit: false,
            isCompleted: false,
            order: {},
            loading: true
        }
        // let match = this.props.routerProps.match;
        // let orderId = this.props.order.hasOwnProperty( 'Order_Id' )
        //
        // if( ! orderId && match.params.id !== 'create' || orderId !== match.params.id ){
        //     axios.get( this.props.api + 'sale/' + match.params.id )
        //         .then( result => {
        //             this.props.onOrderChange( result.data.data );
        //         })
        // }
    }
    static getDerivedStateFromProps( props, state ){
        console.log( props, state );
        console.log( 'this should render with every update to orders' );
        // if( props.routerProps.match.params.id === 'create' ){
        //     return { edit: true };
        // }
        let order = props.orders.find( order => order.Order_Id.toString() === props.routerProps.match.params.id.toString() )
        if( props.orders.length ){
            if( order ){
                return { order: order, loading: false }
            } else {
                return { loading: false }
            }
        }
        return null;
    }
    handleCompleted( val ){
        this.setState({ isCompleted: val })
    }
    editOrder( e ){
        e.preventDefault();
        this.setState({ edit: true })
    }
    render() {
        if( this.state.loading ){
            return (<div>Loading...</div>)
        } else if( ! this.state.order.hasOwnProperty( 'Order_Id' ) ){
            return (<div>Order not found</div>)
        }
        return (
            <div>
                <h1>Order#: { this.state.order.Order_Id }</h1>
                <Link to="/orders">Back</Link>
                { ! this.state.edit && <a href="#" onClick={ this.editOrder }>Edit</a> }
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
