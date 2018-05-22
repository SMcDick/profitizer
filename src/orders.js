import React, { Component } from 'react';
import axios from 'axios';
import propTypes from 'prop-types';
import Form from './form';

class Orders extends Component {

    constructor( props ){
        super( props )
        this.state = {
            orders: [],
            order: ''
        }
        console.log( props );
        this.handleClick = this.handleClick.bind( this );
    }
    handleClick( e, id ){
        e.preventDefault();
        // this.setState( 'order', 'temp' );
        this.props.onOrderChange( id )
    }

    componentDidMount() {
        this.serverRequest = axios.get(this.props.source)
            .then( result => {
                this.setState({
                    orders: result.data.data
                });
            })
    }

    // componentWillUnmount() {
    //     this.serverRequest.abort();
    // }

    render() {
        return (
            <div>
            <Form />
            <h1>Jobs!</h1>
            { this.state.orders.map( order => {
                return (
                    <div key={order.Order_Id} className="job">
                        <a href={"http://localhost:7555/api/sale/" + order.Order_Id } data-orderno={order.Order_Id} onClick={e => this.handleClick( e, order.Order_Id )}>{ order.Description }</a>
                    </div>
                );
            })}
            </div>
        )
    }
}
Orders.propTypes = { source: propTypes.string, onOrderChange: propTypes.func };


export default Orders;
