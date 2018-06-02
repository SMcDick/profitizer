import React, { Component } from 'react';
import propType from 'prop-types';
import Input from './input';
import axios from 'axios';

class InventoryForm extends Component {
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
        if( name === '' ){
            return
        }
        const state = { ...this.state.details }
        state[name] = value
        this.setState({
            details: state
        });
    }
    handleSubmit( e ){
        try {
            e.preventDefault();
            let url = this.props.api + "item/" + this.props.details.Item_Id
            let method = 'put';
            if( this.props.create ){
                url = this.props.api + 'createItem'
                method = 'post'
            }

            axios[ method ]( url, this.state.details )
                .then( result => {
                    console.log( result )
                })
        } catch( error ){
            alert( error.error )
        }
    }
    static createFields(){
        return [
            { name: 'Item_Id', label: 'Item Id', readonly: true, type: 'text' },
            { name: 'Item_Number', label: 'Item Number', readonly: true, type: 'text' },
            { name: 'Item', readonly: false, type: 'text' },
            { name: 'Quantity', readonly: false },
            { name: 'Unit_Cost', label: 'Unit Cost', readonly: false },
            { name: 'Tax', readonly: false },
            { name: 'Num_Sold', label: 'Number Sold', readonly: false }
        ]
    }
    static getDerivedStateFromProps( nextProps ){
        let details = {}
        for( const key of InventoryForm.createFields() ){
            details[ key.name ] = nextProps.details[ key.name ]
        }
        return { details }
    }
    renderInput( options ){
        let value = options.value ? options.value : this.state.details[ options.name ] ? this.state.details[ options.name ] : ''
        return (
            <Input
                key={ options.key ? options.key : options.name }
                label={ options.label ? options.label : options.name }
                name={ options.name }
                value={ value.toString() }
                readonly={ options.readonly }
                type={ options.type ? options.type : 'number' } />
        )
    }
    render() {
        return (
            <form onSubmit={ this.handleSubmit } onChange={ this.handleInputChange }>
                { InventoryForm.createFields( this.props ).map( field => this.renderInput( field ) ) }
                <input type="submit" value="Submit" />
            </form>
        )
    }
}
InventoryForm.propTypes = {
    details: propType.object,
    edit: propType.bool,
    api: propType.string,
    isCompleted: propType.bool,
    handleCompleted: propType.func,
    create: propType.bool,
    handleOrderUpdates: propType.func
}

export default InventoryForm;
