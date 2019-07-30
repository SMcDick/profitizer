import React, { Component } from "react"
import { object, array, func, string, oneOfType, number } from "prop-types"
import Input from "./input"
import { Button } from "semantic-ui-react"
import { Redirect } from "react-router-dom"

import { API_ROOT } from "../config"
import { requester } from "../utilities/apiUtils";

class Form extends Component {
    constructor() {
        super()
        this.state = {
            redirect: false
        }
    }

    howToUpdate = (updateCalculatedFields, name, value) => {
        if (updateCalculatedFields) {
            return updateCalculatedFields(name, value)
        } else {
            let details = { ...this.props.details, ...this.state.details, [name]: value }
            return this.setState({ details })
        }
    }

    handleInputChange = event => {
        const { updateCalculatedFields } = this.props
        const target = event.target
        const value = target.type === "checkbox" ? target.checked : target.value
        const name = target.name
        if (name === "") {
            return
        }
        this.howToUpdate(updateCalculatedFields, name, value)
    }
    validate = val => {
        const target = val.target
        const { updateCalculatedFields } = this.props
        let { name, type, value, step } = target
        if (type === "number") {
            value = (Math.round(Number(value) * 100) / 100).toFixed(step === "1" ? 0 : 2)
            this.howToUpdate(updateCalculatedFields, name, value)
        }
    }
    focus = val => {
        const target = val.target
        const { updateCalculatedFields } = this.props
        let { name, type, value } = target
        target.select()
        if (type === "number" && value !== "") {
            value = Number(value)
            this.howToUpdate(updateCalculatedFields, name, value)
        }
    }
    handleSubmit = e => {
        const { url, id, closeModal, fields, method, handleError } = this.props
        let saveDetails = { ...this.props.details }
        if (this.state.details !== undefined) {
            saveDetails = { ...this.state.details }
        }
        for (const field of fields) {
            if (field.noUpdate) {
                delete saveDetails[field.name]
            }
        }

        e.preventDefault()
        let endpoint = API_ROOT + url + id
        // let method = "post"
        // TODO can I assume create if no details.Item_Id
        // if (create) {
        if (!id) {
            endpoint = API_ROOT + url + "create"
            // method = "post"
        }

        requester({ url: endpoint, body: saveDetails, method })
            .then(() => {
                // TODO this is probably a bad way to determine if the form is in a modal
                if (closeModal) {
                    closeModal("fetch")
                    return
                }
                this.setState({ redirect: true })
            })
            .catch(e => {
                handleError(e)
                // alert(e.response.data.message)
            })
    }
    externalSubmit = e => {
        const { handleSubmit } = this.props;
        const { url, id, closeModal, fields, method, handleError } = this.props
        let saveDetails = { ...this.props.details }
        if (this.state.details !== undefined) {
            saveDetails = { ...this.state.details }
        }
        for (const field of fields) {
            if (field.noUpdate) {
                delete saveDetails[field.name]
            }
        }
        handleSubmit(e, url, id, method, saveDetails);
    }
    cancel = e => {
        e.stopPropagation()
        this.props.closeModal()
    }
    renderInput(options) {
        let details = this.props.details
        if (this.state.details !== undefined) {
            details = { ...this.state.details }
        }
        const name = options.name
        options.className = options.className || ""
        options.value = details[name] !== undefined ? details[name] : ""

        return (
            <Input
                onChange={this.handleInputChange}
                onFocus={this.focus}
                onBlur={this.validate}
                key={options.key ? options.key : name}
                {...options}
            />
        )
    }
    render() {
        const { redirect } = this.state
        const { fields, redirectTo, closeModal, handleSubmit } = this.props
        if (redirect) {
            return <Redirect exact={true} to={redirectTo} />
        }
        return (
            <form onSubmit={handleSubmit ? this.externalSubmit : this.handleSubmit}>
                {fields.map(field => this.renderInput(field))}
                {!closeModal && (
                    <React.Fragment>
                        <br />
                        <Button content="Submit" positive />
                    </React.Fragment>
                    
                )}
                {closeModal && (
                    <div className="flex-child__100 flex-parent__flex-end">
                        <button
                            className="btn btn--accent flex-child"
                            style={{ marginRight: "10px" }}
                            onClick={this.cancel}
                            type="button">
                            Cancel
						</button>
                        <button className="btn btn--positive flex-child" type="submit">
                            OK
						</button>
                    </div>
                )}
            </form>
        )
    }
}
Form.propTypes = {
    fields: array.isRequired,
    details: object.isRequired,
    url: string.isRequired,
    id: oneOfType([string, number]),
    redirectTo: string,
    closeModal: func,
    updateCalculatedFields: func,
    method: string,
    handleError: func.isRequired,
    handleSubmit: func
}
Form.defaultProps = {
    method: "post",
    redirectTo: "/"
}

export default Form
