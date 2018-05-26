import React, { Component } from 'react'
import axios from 'axios'
import PropType from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import Orders from './orders'
import Order from './order'
import Form from './form'

class OrderWrapper extends Component {
    constructor( props ){
        super( props )
        this.state = {
            orders: []
        }
        this.handleOrderUpdates = this.handleOrderUpdates.bind( this )
    }
    componentDidMount(){
        console.log( 'order wrapper mounted' )
        axios.get( "http://localhost:7555/api/sales/incomplete" )
            .then( result => {
                this.setState({
                    orders: result.data.data
                });
            })
    }
    handleOrderUpdates( val ){
        this.setState( prevState => {
            let orders = [ ... prevState.orders ]
            let current = orders.find( order => order.Order_Id === val.Order_Id )
            if( current ){
                if( val.Completed ){
                    orders.splice( orders.indexOf( current ), 1 )
                } else {
                    Object.assign( current, val )
                }
            } else {
                if( ! val.Completed ){
                    orders.unshift( val )
                }
            }
            return { orders: orders }
        })
    }
    componentWillUnmount(){
        console.log( 'order wrapper unmounted' )
    }
    render(){
        console.log( 'order wrapper rendered')
        return (
            <div>
                <Switch>
                    <Route exact path={ this.props.match.url } render={(props) => {
                        return (<Orders orders={ this.state.orders } />)
                    }} />
                    <Route exact path={ this.props.match.url + '/create' } render={ props => {
                        return (
                            <div>
                                <h1>Create a New Order</h1>
                                <Form
                                    details={ { Marketplace: 'Poshmark' } }
                                    edit={ true }
                                    api={ 'http://localhost:7555/api/' }
                                    routerProps={ props }
                                    create={ true }
                                    handleOrderUpdates={ this.handleOrderUpdates } />
                            </div>
                        )
                    }} />
                    <Route path={ this.props.match.url + '/:id' } render={(props) => {
                        return (
                            <Order
                                orders={ this.state.orders }
                                routerProps={ props }
                                api={ 'http://localhost:7555/api/' }
                                handleOrderUpdates={ this.handleOrderUpdates } />
                        )
                    }} />
                </Switch>
            </div>
        );
    }
}

OrderWrapper.propTypes = {
    match: PropType.object
}

export default OrderWrapper
