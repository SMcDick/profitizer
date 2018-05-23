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
  }
  handleInputChange(event) {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;
      this.setState({
          [name]: value
      });
  }
  renderInput( options ){
      return (
          <Input
            label={ options.label ? options.label : options.name }
            name={ options.name }
            value={ this.state[options.name] ? this.state[ options.name ].toString() : '' }
            readonly={ options.readonly }
            onChange={ this.handleInputChange }
            type={ options.type ? options.type : 'text' } />
      );
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        { this.renderInput({ name: 'Description', readonly: true }) }
        { this.renderInput({ name: 'Platform_Order_Id', readonly: this.props.details.Platform_Order_Id ? true : false, label: 'Platform Order Id' }) }
        { this.renderInput({ name: 'Order_Id', readonly: true, label: 'Order ID' }) }
        { this.renderInput({ name: 'Sold_Date', label: 'Sold Date' }) }
        { this.renderInput({ name: 'Total_Sold_Price', label: 'Total Sold Price' }) }
        { this.renderInput({ name: 'Marketplace' }) }
        { this.renderInput({ name: 'Marketplace_Fee', label: 'Marketplace Fee' }) }
        { this.renderInput({ name: 'Shipping' }) }
        { this.renderInput({ name: 'Transaction_Fee', label: 'Transaction Fee' }) }
        { this.renderInput({ name: 'Tax', label: 'Tax' }) }
        { this.renderInput({ name: 'Completed', type: 'checkbox' }) }

        <input type="submit" value="Submit" />
      </form>
    );
  }
}
OrderForm.propTypes = { details: PropType.object }

export default OrderForm;
