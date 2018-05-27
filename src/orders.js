import React, { Component } from 'react';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OrderNav from './orderNav';
import Pager from './pager'

class Orders extends Component {
    constructor( props ){
        super( props )
    }
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
                <Pager meta={ this.props.meta } handleMeta={ this.props.handleMeta }/>
                { this.props.orders.map( order => {
                    return (
                        <div key={order.Order_Id} className="job">
                            <Link to={'/orders/' + order.Order_Id}>{ order.Description }<br />
                            <div className="sold_date">{ new Date(order.Sold_Date).toUTCString().split( '00:' )[0] }</div></Link>
                        </div>
                    )
                })}
            </div>
        )
    }
}
Orders.propTypes = {
    orders: propTypes.array,
    handleMeta: propTypes.func
};


export default Orders;
