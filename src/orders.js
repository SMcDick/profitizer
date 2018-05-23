import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';

class Orders extends Component {

    constructor( props ){
        super( props )
        this.state = {
            orders: []
        }
        console.log( props );
        this.chooseOrder = this.chooseOrder.bind( this );
    }
    chooseOrder( e, order ){
        e.preventDefault();
        this.props.onOrderChange( order )
    }

    componentDidMount() {
        this.serverRequest = axios.get(this.props.source)
            .then( result => {
                this.setState({
                    orders: result.data.data
                });
            })
    }
    render() {
        return (
            <div>
                <h1>Orders</h1>
                { this.state.orders.map( order => {
                    return (
                        <div key={order.Order_Id} className="job">
                            <a href="#" onClick={e => this.chooseOrder( e, order )}>{ order.Description }</a>
                        </div>
                    );
                })}
            </div>
        )
    }
}
Orders.propTypes = { source: propTypes.string, onOrderChange: propTypes.func };


export default Orders;
