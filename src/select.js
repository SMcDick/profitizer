import React, { Component } from 'react';
import Select from 'react-select'
import 'react-select/dist/react-select.css'
import axios from 'axios'
import PropTypes from 'prop-types'

class SelectWrapper extends Component {
    constructor( props ){
        super( props )
        this.state = {
            selectedOption: '',
            options: []
        }
    }
    componentDidMount(){
        axios.get( this.props.url )
            .then( result => {
                this.setState({ options: this.props.optionsMapper( result.data ) })
            })
    }

    handleChange = (selectedOption) => {
        this.setState({ selectedOption });
        if( selectedOption ){
            console.log(`Selected: ${selectedOption.label}`);
        }

    }
    render() {
        const { selectedOption } = this.state;

        return (
            <Select
                name="form-field-name"
                value={selectedOption}
                onChange={this.handleChange}
                options={this.state.options}
            />
        );
    }
}

SelectWrapper.propTypes = {
    options: PropTypes.array,
    url: PropTypes.string,
    optionsMapper: PropTypes.func
}

export default SelectWrapper
