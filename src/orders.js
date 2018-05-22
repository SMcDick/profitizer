import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';

class Orders extends Component {

    constructor( props ){
        super( props )
        this.state = {
            orders: []
        }
    }

    componentDidMount() {
        this.serverRequest = axios.get(this.props.source)
            .then( result => {
                this.setState({
                    orders: result.data.data
                });
            })
    }

    componentWillUnmount() {
        this.serverRequest.abort();
    }

    render() {
        return (
            <div>
            <h1>Jobs!</h1>
            { this.state.orders.map( order => {
                return (
                    <div key={order.Order_Id} className="job">
                        <a href={"http://localhost:7555/api/sale/" + order.Order_Id }>{ order.Description }</a>
                    </div>
                );
            })}
            </div>
        )
    }
}
Orders.propTypes = { source: propTypes.string };


export default Orders;
