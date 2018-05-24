import React, { Component } from 'react';
import PropType from 'prop-types';
import Input from './input';
import axios from 'axios';

class OrderForm extends Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind( this )
    this.handleSubmit = this.handleSubmit.bind( this )

    // Slighly hacky because I need to know the state of Marketplace in order to compute fees
    // So Marketpplace is invoked before the other fields are created
    this.state = {Marketplace: props.details.Marketplace};
    this.fields = this.createFields( props, this.state.Marketplace );

    for( const key of this.fields ){
        this.state[ key.name ] = props.details[key.name];
    }
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
      axios.put("http://localhost:7555/api/sale/" + this.props.details.Order_Id, this.state )
          .then( result => {
              console.log( result );
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


  render() {
    return (
      <form onSubmit={this.handleSubmit} onChange={ this.handleInputChange }>
        { this.fields.map( field => this.renderInput( field ) ) }
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
OrderForm.propTypes = { details: PropType.object, edit: PropType.bool }

export default OrderForm;
