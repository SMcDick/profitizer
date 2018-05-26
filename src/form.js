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
    this.handleCompleted = this.handleCompleted.bind( this )

    // Slighly hacky because I need to know the state of Marketplace in order to compute fees
    // So Marketpplace is invoked before the other fields are created
    this.state = {Marketplace: props.details.Marketplace};
    this.fields = this.createFields( props, this.state.Marketplace );

    for( const key of this.fields ){
        this.state[ key.name ] = props.details[key.name];
    }
  }
  handleCompleted( val ){
      this.props.handleCompleted( val );
  }
  createFields( props, marketplace ){
      let defaultFees = this.computeDefaultFees( props, marketplace );
      let readonly = ! props.edit;
      return [
          { name: 'Description', readonly: readonly },
          { name: 'Marketplace_Fee', label: `Marketplace Fee (estimate: $${ defaultFees.marketplaceFee })` },
          { name: 'Transaction_Fee', label: `Transaction Fee (estimate: $${ defaultFees.transactionFee })` },
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
  componentWillUpdate(nextProps, nextState ){
      this.fields = this.createFields( nextProps, nextState.Marketplace );
  }
  handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
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
      axios[method]( url, this.state )
          .then( result => {
              this.props.handleOrderUpdates( result.data )
              if( result.data.hasOwnProperty( 'Completed' ) && result.data.Completed === 1 ){
                  this.handleCompleted( true );
              }

          })
  }
  renderInput( options ){
      let value = this.state[options.name] ? this.state[ options.name ].toString() : ''
      return (
          <Input
            key={ options.name }
            label={ options.label ? options.label : options.name }
            name={ options.name }
            value={ value }
            readonly={ options.readonly }
            type={ options.type ? options.type : 'text' } />
      );
  }
  computeDefaultFees( props, marketplace ){
      let soldPrice = props.details.Total_Sold_Price;
      let marketplaceFee = 2.95;
      if( soldPrice > 15 ){
          marketplaceFee = ( soldPrice * 0.2 ).toFixed( 2 );
      }
      let transactionFee = 0;
      if( marketplace === 'eBay' ){
          marketplaceFee = (soldPrice * 0.0915).toFixed( 2 );
          transactionFee = ((soldPrice * 0.029) + 0.30).toFixed( 2 );
      }
      return {marketplaceFee, transactionFee};
  }
  mapper( collection ){
      return collection.data.map( item => {
          return {
              value: item.Item_Id,
              label: `${ item.Item } - ${ item.Final_Cost } (${ item.Remaining })`
          }
      })
  }
  render() {
      if( this.props.isCompleted ){
          return (
              <Redirect exact={true} to='/orders' />
          );
      }
    return (
        <form onSubmit={this.handleSubmit} onChange={ this.handleInputChange }>
            { this.props.create &&
                <SelectWrapper
                    url="http://localhost:7555/api/inventory/remaining"
                    optionsMapper={ this.mapper }  />
            }
          { this.fields.map( field => this.renderInput( field ) ) }
          <input type="submit" value="Submit" />
        </form>

    );
  }
}
OrderForm.propTypes = {
    details: propType.object,
    edit: propType.bool,
    api: propType.string.isRequired,
    isCompleted: propType.bool,
    handleCompleted: propType.func,
    create: propType.bool,
    handleOrderUpdates: propType.func
}

export default OrderForm;
