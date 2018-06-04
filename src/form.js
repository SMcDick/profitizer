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
            details: {},
            // TODO This might not be state?
            inventory: [],
            redirect: false
        }
    }
    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        if( name === '' ){
            return
        }
        const state = { ...this.state.details }
        state[name] = value
        this.setState({
            details: state
        });
    }
    handleReactSelectChange = val => {
        const details = { ...this.state.details }
        let description = []
        for( var i = 1; i <= 5; i++ ){
            delete details[ 'Item_' + i ]
            delete details[ 'Item_' + i + '_Quantity' ]
        }
        this.itemGroups = val.map( ( item, idx ) => {
            let itemNumber = `Item_${ idx + 1 }`
            let stringify = val => val.replace( /_/g, ' ' )
            let itemNumberString = stringify( itemNumber )
            let itemQuantity = `${ itemNumber }_Quantity`
            let itemQuantityString = stringify( itemQuantity )
            let timestamp = '_' + Date.now()
            let nameLabel = itemNumber + '_Name'
            let nameString = stringify( nameLabel )
            let name = this.state.inventory.find( inv => inv.Item_Id === item.value )
            name = name ? name.Item : 'Item Not Found - Something went wrong'
            description.push( name )
            details[ itemNumber ] = item.value.toString()
            details[ itemQuantity ] = "1"
            return [
                { name: nameLabel, label: nameString, key: nameLabel + timestamp, readonly: true, value: name, type: 'text' },
                { name: itemNumber, label: itemNumberString, readonly: true, key: itemNumber + timestamp, type: 'text' },
                { name: itemQuantity, label: itemQuantityString, readonly: false, key: itemQuantity + timestamp, int: true }
            ]
        })
        this.itemFields = this.itemGroups.reduce( ( items, groups ) => items.concat( groups ), [] )
        if( ! this.itemGroups.length ){
            this.itemFields = undefined
        }
        // TODO this doesn't quite work as expected.
        // It doesn't update the default value and it doesn't clear out the updated value when
        // choosing a second item. Leaving for now and might revisit later
        details.Description = description.join( '; ' )
        this.setState({ details })
    }
    handleSubmit( e ){
            e.preventDefault();
            let url = this.props.api + "sale/" + this.props.details.Order_Id
            let method = 'put';
            if( this.props.create ){
                url = this.props.api + 'createSale'
                method = 'post'
            }

            axios[ method ]( url, this.state.details )
                .then( results => {
                    this.props.handleOrderUpdates( results.data.sale )
                    this.setState({ redirect: true })
                })
                .catch( e => {
                    alert( e.response.data.body )
                })
    }
    static createFields( props ){
        let readonly = ! props.edit;
        return [
            { name: 'Description', readonly: readonly, type: 'text' },
            { name: 'Total_Sold_Price', label: 'Total Sold Price', readonly: readonly, required: true },
            { name: 'Transaction_Fee', label: `Transaction Fee` },
            { name: 'Marketplace_Fee', label: `Marketplace Fee` },
            { name: 'Shipping' },
            { name: 'Tax', label: 'Tax' },
            { name: 'Platform_Order_Id', readonly: readonly, label: 'Platform Order Id', type: 'text', required: true },
            { name: 'Order_Id', readonly: true, label: 'Order ID', type: 'text' },
            { name: 'Sold_Date', label: 'Sold Date', readonly: readonly, type: 'date', required: true },
            { name: 'Marketplace', readonly: readonly, type: 'text' },
            { name: 'Completed', type: 'checkbox' }
        ];
    }
    static createItems( props ){
        let items = []
        for( var i = 1; i <= 5; i++ ){
            let itemNumber = `Item_${ i }`
            let stringify = val => val.replace( /_/g, ' ' )
            let itemNumberString = stringify( itemNumber )
            let itemQuantity = `${ itemNumber }_Quantity`
            let itemQuantityString = stringify( itemQuantity )
            let timestamp = '_' + Date.now()
            let nameLabel = itemNumber + '_Name'
            let nameString = stringify( nameLabel )

            if( props.details[ itemQuantity ] > 0 ){
                items.push(
                    { name: nameLabel, label: nameString, key: nameLabel + timestamp, readonly: true, type: 'text' },
                    { name: itemNumber, label: itemNumberString, readonly: true, key: itemNumber + timestamp, type: 'text' },
                    { name: itemQuantity, label: itemQuantityString, readonly: true, key: itemQuantity + timestamp, int: true },
                    { name: itemNumber + '_Cost', label: stringify( itemNumber + '_Cost' ), readonly: true, key: itemNumber + '_Cost' + timestamp }
                )
            }
        }
        items.push(
            { name: 'Total_Cost_calc', label: 'Total Cost', readonly: true, key: 'Total_Cost' }
        )
        return items
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
        // TODO would not be surprised if this breaks the new order item functionality. Make sure to test
        for( const key of OrderForm.createItems( nextProps ) ){
            details[ key.name ] = nextProps.details[ key.name ]
        }
        if( ! details.Sold_Date ){
            details.Sold_Date = new Date().toISOString().split( 'T' )[0]
        }
        return { details }
    }
    mapper( collection ){
        return collection.data.map( item => {
            return {
                value: item.Item_Id,
                label: `${ item.Item } ( ${ item.Item_Id } ) - $${ item.Final_Cost } (${ item.Remaining })`
            }
        })
    }
    renderInput( options, fees ){
        let value = options.value ? options.value : this.state.details[ options.name ] !== undefined ? this.state.details[ options.name ] : ''
        let feeEstimate = ''
        if( options.name === 'Transaction_Fee' ){
            feeEstimate = fees.transactionFee
        } else if( options.name === 'Marketplace_Fee' ){
            feeEstimate = fees.marketplaceFee
        }
        return (
            <Input
                key={ options.key ? options.key : options.name }
                label={ options.label ? options.label : options.name }
                feeEstimate={ feeEstimate.toString() }
                name={ options.name }
                value={ value.toString() }
                readonly={ options.readonly }
                type={ options.type ? options.type : 'number' }
                int={ options.int }
                required={ options.required } />
        )
    }
    handleInventory = val => {
        this.setState({ inventory: val })
    }
    render() {
        if( this.state.redirect ){
            return (
                <Redirect exact={true} to='/orders' />
            )
        }
        let fees = this.computeDefaultFees( this.state.details )
        return (
            <form onSubmit={this.handleSubmit} onChange={ this.handleInputChange }>
                { this.props.create &&
                    <div className="item-wrapper">
                        <SelectWrapper
                            url="http://localhost:7555/api/inventory/remaining"
                            optionsMapper={ this.mapper }
                            name="Items Sold"
                            reactSelectChange={ this.handleReactSelectChange }
                            handleInventory={ this.handleInventory } />
                        { this.itemFields &&
                            // TODO fix this so that the fields display correctly
                            <div className="item-field-wrapperx">
                                <h3>Item Details</h3>
                                { this.itemFields.map( field => this.renderInput( field, null ) ) }
                            </div>
                        }
                    </div>
                }
                { ( ! this.props.create || this.itemFields ) &&
                    <div>
                        { OrderForm.createFields( this.props ).map( field => this.renderInput( field, fees ) ) }
                        { ! this.props.create &&
                            <div className="item-wrapper">
                                <div className="item-field-wrapper">
                                    <h3>Item Details</h3>
                                    { OrderForm.createItems( this.props ).map( field => this.renderInput( field, null ) ) }
                                </div>
                            </div>
                        }
                        <input type="submit" className="btn" value="Submit" />
                    </div>
                }
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
