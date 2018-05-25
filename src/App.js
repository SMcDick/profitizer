import React, { Component } from 'react';
import Orders from './orders';
import Order from './order';
import { BrowserRouter as Router, Route, NavLink, Link } from 'react-router-dom';

const baseurl = "http://localhost:7555/api/"

class Home extends Component{
    render(){
        return (
            <div>
                <Link to='/inventory'>Inventory</Link>
                <Link to="/orders">Orders</Link>
            </div>);
    }
}
class Inventory extends Component{
    render(){
        return( <div>Inventory (Eventually)</div> );
    }
}

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

    render(){
        return (
            <Router>
                <div className="App width-wrapper">
                    <ul>
                        <li><NavLink exact to="/">Home</NavLink></li>
                    </ul>
                    <hr />
                    <Route exact path="/" component={ Home } />
                    <Route path="/inventory" component={ Inventory } />
                    <Route exact path="/orders" render={ (props) => {
                        let api = baseurl + 'sales/' + ( props.location.search.indexOf( 'view=all' ) > -1 ? 'all' : 'incomplete' );
                        return (
                            <Orders
                                onOrderChange={ this.handleChange }
                                routerProps={ props }
                                api={ api } />
                            );
                    }} />
                    <Route path="/orders/:id" render={ (props) => {
                        return (
                            <Order
                                order={ this.state.order }
                                onOrderChange={ this.handleChange }
                                routerProps={ props }
                                api={ baseurl } />
                            );
                    }} />
                </div>
            </Router>
         );
    }
}

export default App;
