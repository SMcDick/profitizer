import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import { Link } from 'react-router-dom';

class Orders extends Component {

    constructor( props ){
        super( props )
        this.state = {
            orders: []
        }
        this.chooseOrder = this.chooseOrder.bind( this );
    }
    chooseOrder( e, order ){
        this.props.onOrderChange( order )
    }

    componentDidMount() {
        axios.get(this.props.api + this.props.source)
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
                            <Link to={'/orders/' + order.Order_Id} onClick={e => this.chooseOrder( e, order )}>{ order.Description }</Link>
                        </div>
                    );
                })}
            </div>
        )
    }
}
Orders.propTypes = {
    source: propTypes.string.isRequired,
    onOrderChange: propTypes.func.isRequired,
    api: propTypes.string.isRequired
};


export default Orders;
