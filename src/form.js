import React, { Component } from 'react';
import PropType from 'prop-types';
import Input from './input';

class OrderForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    for (const key of Object.keys( props.details )) {
        this.state[key] = props.details[key];
    }
    this.handleInputChange = this.handleInputChange.bind( this )
    this.handleSubmit = this.handleSubmit.bind( this )
    this.temp = {};
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
      console.log( this.state )
  }
  renderInput( options ){
      let value = this.state[options.name] ? this.state[ options.name ].toString() : ''
      if( options.name === "Marketplace_Fee" ){
          value = this.temp.marketplaceFee;
      }
      if( options.name === "Transaction_Fee" ){
          value = this.temp.transactionFee;
      }
      return (
          <Input
            label={ options.label ? options.label : options.name }
            name={ options.name }
            value={ value }
            readonly={ options.readonly }
            type={ options.type ? options.type : 'text' } />
      );
  }
  computeDefaultFees(){
      let soldPrice = this.props.details.Total_Sold_Price;
      let marketplaceFee = 2.95;
      if( soldPrice > 15 ){
          marketplaceFee = soldPrice * 0.2;
      }
      let transactionFee = 0;
      if( this.state.Marketplace === 'eBay' ){
          marketplaceFee = (soldPrice * 0.0915).toFixed( 2 );
          transactionFee = ((soldPrice * 0.029) + 0.30).toFixed( 2 );
      }
      return {marketplaceFee, transactionFee};
  }


  render() {
      let readonly = ! this.props.edit;
      this.temp = this.computeDefaultFees();
    return (
      <form onSubmit={this.handleSubmit} onChange={ this.handleInputChange }>
        { this.renderInput({ name: 'Description', readonly: readonly }) }
        { this.renderInput({ name: 'Marketplace_Fee', label: 'Marketplace Fee' }) }
        { this.renderInput({ name: 'Transaction_Fee', label: 'Transaction Fee' }) }
        { this.renderInput({ name: 'Shipping' }) }
        { this.renderInput({ name: 'Tax', label: 'Tax' }) }
        { this.renderInput({ name: 'Platform_Order_Id', readonly: readonly, label: 'Platform Order Id' }) }
        { this.renderInput({ name: 'Order_Id', readonly: readonly, label: 'Order ID' }) }
        { this.renderInput({ name: 'Sold_Date', label: 'Sold Date', readonly: readonly }) }
        { this.renderInput({ name: 'Total_Sold_Price', label: 'Total Sold Price', readonly: readonly }) }
        { this.renderInput({ name: 'Marketplace', readonly: readonly }) }
        { this.renderInput({ name: 'Completed', type: 'checkbox' }) }

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
OrderForm.propTypes = { details: PropType.object, edit: PropType.bool }

export default OrderForm;
