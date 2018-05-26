import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OrderNav from './orderNav';

// let state = 'new';
class Orders extends Component {

    constructor( props ){
        super( props )
        // this.state = {
        //     orders: []
        // }
        console.log( props )
        // console.log( state );
        // this.chooseOrder = this.chooseOrder.bind( this );
    }
    // chooseOrder( e, order ){
    //     this.props.onOrderChange( order )
    // }

    // componentDidMount() {
    //     state = 'mounted';
    //     console.log( state )
    //     axios.get( this.props.api )
    //         .then( result => {
    //             this.chooseOrder( null, { orders: result.data.data })
    //             // this.setState({
    //             //     orders: result.data.data
    //             // });
    //         })
    // }
    // componentWillUnmount(){
    //     // state = 'unmounted';
    //     // console.log( state );
    //     console.log( 'Orders will unmount?' )
    // }
    // static getDerivedStateFromProps( props, state ){
    //     // console.log( props, state );
    //     console.log( 'this should render with every update to orders' )
    //     return null;
    // }
    render() {
        if( ! this.props.orders.length ){
            return (
                <div>
                    <h1>Orders</h1>
                    <p>Loading...</p>
                </div>
            )
        }
        return (
            <div>
                <h1>Orders</h1>
                <OrderNav />
                { this.props.orders.map( order => {
                    return (
                        <div key={order.Order_Id} className="job">
                            <Link to={'/orders/' + order.Order_Id}>{ order.Description }<br />
                            <div className="sold_date">{ new Date(order.Sold_Date).toUTCString() }</div></Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}
Orders.propTypes = {
    onOrderChange: propTypes.func,
    api: propTypes.string,
    orders: propTypes.array
};


export default Orders;
