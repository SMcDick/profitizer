import React, { Component } from 'react';
import Orders from './orders';
import Order from './order';

class App extends Component {
    constructor(){
        super();
        this.state = {
            order: {}
        }
        this.handleChange = this.handleChange.bind( this );
    }
    handleChange( val ){
        this.setState({ 'order': val })
    }

    render() {
        console.log( this.state.order )
        if( this.state.order.Order_Id ){
            return (
                <div className="App width-wrapper">
                    <Order order={this.state.order} onOrderChange={ this.handleChange } />
                </div>
            );
        } else {
            return (
                <div className="App width-wrapper">
                    <Orders
                        source="http://localhost:7555/api/sales/incomplete"
                        onOrderChange={ this.handleChange }
                    />
                </div>
            );
        }
    }
}

export default App;
