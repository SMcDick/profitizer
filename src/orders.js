import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';
import OrderNav from './orderNav';

class Orders extends Component {

    constructor( props ){
        super( props )
        this.state = {
            orders: []
        }
        console.log( props )
        this.chooseOrder = this.chooseOrder.bind( this );
    }
    chooseOrder( e, order ){
        this.props.onOrderChange( order )
    }

    componentDidMount() {
        axios.get( this.props.api )
            .then( result => {
                this.setState({
                    orders: result.data.data
                });
            })
    }
    componentWillUnmount(){
        console.log( 'Orders will unmount?' )
    }
    static getDerivedStateFromProps( props, state ){
        console.log( props, state );
        console.log( 'this should render with every update to orders' )
        return null;
    }
    render() {
        return (
            <div>
                <h1>Orders</h1>
                <OrderNav />
                { this.state.orders.map( order => {
                    return (
                        <div key={order.Order_Id} className="job">
                            <Link to={'/orders/' + order.Order_Id} onClick={e => this.chooseOrder( e, order )}>{ order.Description }<br />
                            <div className="sold_date">{ new Date(order.Sold_Date).toUTCString() }</div></Link>
                        </div>
                    );
                })}
            </div>
        )
    }
}
Orders.propTypes = {
    onOrderChange: propTypes.func.isRequired,
    api: propTypes.string.isRequired
};


export default Orders;
