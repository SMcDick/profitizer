import React, { Component } from 'react';
import propType from 'prop-types';
import Input from './input';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import SelectWrapper from './select'

class OrderForm extends Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind( this )
        this.handleSubmit = this.handleSubmit.bind( this )

        this.state = {
            details: {}
        }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        const state = { ...this.state.details }
        state[name] = value
        this.setState({
            details: state
        });
    }
    handleSubmit( e ){
        e.preventDefault();
        let url = this.props.api + "sale/" + this.props.details.Order_Id
        let method = 'put';
        if( this.props.create ){
            url = this.props.api + 'createSale'
            method = 'post'
        }
        axios[method]( url, this.state.details )
            .then( result => {
                this.props.handleOrderUpdates( result.data )
            })
    }
    static createFields( props ){
        let readonly = ! props.edit;
        return [
            { name: 'Description', readonly: readonly },
            { name: 'Transaction_Fee', label: `Transaction Fee` },
            { name: 'Marketplace_Fee', label: `Marketplace Fee` },
            { name: 'Shipping' },
            { name: 'Tax', label: 'Tax' },
            { name: 'Platform_Order_Id', readonly: readonly, label: 'Platform Order Id' },
            { name: 'Order_Id', readonly: true, label: 'Order ID' },
            { name: 'Sold_Date', label: 'Sold Date', readonly: readonly },
            { name: 'Total_Sold_Price', label: 'Total Sold Price', readonly: readonly },
            { name: 'Marketplace', readonly: readonly },
            { name: 'Completed', type: 'checkbox' }
        ];
    }
    computeDefaultFees( details ){
        let soldPrice = details.Total_Sold_Price;
        let marketplaceFee = 2.95;
        if( soldPrice >= 15 ){
            marketplaceFee = ( soldPrice * 0.2 ).toFixed( 2 );
        }
        let transactionFee = 0;
        if( details.Marketplace && details.Marketplace.toLowerCase() === 'ebay' ){
            marketplaceFee = (soldPrice * 0.0915).toFixed( 2 );
            transactionFee = ((soldPrice * 0.029) + 0.30).toFixed( 2 );
        }
        return {marketplaceFee, transactionFee};
    }
    static getDerivedStateFromProps( nextProps ){
        let details = {}
        for( const key of OrderForm.createFields( nextProps ) ){
            details[ key.name ] = nextProps.details[ key.name ]
        }
        return { details }
    }
    mapper( collection ){
        return collection.data.map( item => {
            return {
                value: item.Item_Id,
                label: `${ item.Item } - $${ item.Final_Cost } (${ item.Remaining })`
            }
        })
    }
    renderInput( options, fees ){
        let value = this.state.details[ options.name ] ? this.state.details[ options.name ] : ''
        let feeEstimate = ''
        if( options.name === 'Transaction_Fee' ){
            feeEstimate = fees.transactionFee
        } else if( options.name === 'Marketplace_Fee' ){
            feeEstimate = fees.marketplaceFee
        }
        return (
            <Input
                key={ options.name }
                label={ options.label ? options.label : options.name }
                feeEstimate={ feeEstimate.toString() }
                name={ options.name }
                value={ value.toString() }
                readonly={ options.readonly }
                type={ options.type ? options.type : 'text' } />
        )
    }
    render() {
        if( this.props.isCompleted ){
            return (
                <Redirect exact={true} to='/orders' />
            )
        }
        let fees = this.computeDefaultFees( this.state.details )
        return (
            <form onSubmit={this.handleSubmit} onChange={ this.handleInputChange }>
                { this.renderInput( { name: 'Number_of_Item_types', label: 'Number of Item Types' } ) }
                { this.props.create &&
                    <SelectWrapper
                    url="http://localhost:7555/api/inventory/remaining"
                    optionsMapper={ this.mapper }  />
                }
                { ! this.props.create &&
                    OrderForm.createFields( this.props ).map( field => this.renderInput( field, fees ) )
                }
                <input type="submit" value="Submit" />
            </form>

        )
    }
}
OrderForm.propTypes = {
    details: propType.object,
    edit: propType.bool,
    api: propType.string,
    isCompleted: propType.bool,
    handleCompleted: propType.func,
    create: propType.bool,
    handleOrderUpdates: propType.func
}

export default OrderForm;
