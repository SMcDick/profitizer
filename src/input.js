import React, { Component } from 'react';
import PropType from 'prop-types';

class Input extends Component {
    render(){
        let checked = ( this.props.type === 'checkbox' && this.props.value === "1" )
        return (
            <div className="input__wrapper">
                <label className="input--label">{this.props.label}
                    { this.props.feeEstimate &&
                        <span> (estimate: ${ this.props.feeEstimate })</span>
                    }</label>
                <input
                    className="input--text"
                    type={ this.props.type }
                    defaultValue={ this.props.value }
                    defaultChecked={ checked }
                    name={ this.props.name }
                    readOnly={ this.props.readonly }
                    autoComplete="off"
                    data-lpignore="true"
                    step={ this.props.int ? 1 : 0.01 }
                    required={ this.props.required } />
            </div>
        )
    }
}
Input.propTypes = {
    label: PropType.string,
    type: PropType.string,
    value: PropType.string,
    name: PropType.string,
    readonly: PropType.bool,
    feeEstimate: PropType.string,
    int: PropType.bool,
    required: PropType.bool
}

export default Input;
