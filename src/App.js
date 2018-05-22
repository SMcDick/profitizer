import React, { Component } from 'react';
import Orders from './orders';

class App extends Component {
    constructor(){
        super();
        this.state = {
            orders: [],
            order: ''
        }
        this.handleChange = this.handleChange.bind( this );
    }
    handleChange( e ){
        this.setState({ 'order': e })
    }

    render() {
        console.log( this.state.order )
        if( this.state.order !== '' ){
            return (
                <h1>Order Number is { this.state.order }</h1>
            );
        } else {
            return (
                <div className="App width-wrapper">
                    <Orders
                        source="http://localhost:7555/api/sales/incomplete"
                        order={this.state.order}
                        orders={this.state.orders}
                        onOrderChange={ this.handleChange }
                    />
                </div>
            );
        }
    }
}

export default App;
