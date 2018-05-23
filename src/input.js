import React, { Component } from 'react';
import PropType from 'prop-types';

class Input extends Component {
    render(){
        return (
            <div className="input__wrapper">
                <label className="input--label">{this.props.label}</label>
                <input
                    className="input--text"
                    type={this.props.type }
                    defaultValue={this.props.value}
                    name={ this.props.name }
                    readOnly={ this.props.readonly } />
            </div>
        );
    }
}
Input.propTypes = {
    label: PropType.string,
    type: PropType.string,
    value: PropType.string,
    name: PropType.string,
    readonly: PropType.bool
}

export default Input;
