import React, { Component } from 'react';
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import axios from 'axios'
import PropTypes from 'prop-types'

class SelectWrapper extends Component {
    constructor( props ){
        super( props )
        this.state = {
            selectedOption: [],
            details: {},
            options: []
        }
    }
    componentDidMount(){
        axios.get( this.props.url )
            .then( result => {
                this.props.handleInventory( result.data.data )
                this.setState({
                    options: this.props.optionsMapper( result.data ),
                    details: result.data
                })
            })
    }
    handleChange = selectedOption => {
        this.setState({ selectedOption }, this.props.reactSelectChange( selectedOption ) )
    }
    render() {
        const { selectedOption, options } = this.state;
        return (
            <Select
                className="react-select-override"
                name={ this.props.name }
                value={ selectedOption }
                onChange={ this.handleChange }
                options={ options }
                closeOnSelect={ true }
                multi
                placeholder="Choose Items"
                clearable={ false }
            />
        );
    }
}

SelectWrapper.propTypes = {
    options: PropTypes.array,
    url: PropTypes.string,
    optionsMapper: PropTypes.func,
    name: PropTypes.string,
    reactSelectChange: PropTypes.func,
    handleInventory: PropTypes.func
}

export default SelectWrapper
