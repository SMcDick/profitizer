import React, { Component } from "react"
import Moment from "moment"

import CreateItem from "./createItem"
import FormWrapper from "./orderFormWrapper"

import Alert from "../alert"

class CreateOrder extends Component {
	constructor(props) {
		super(props)
		this.state = {
			details: {},
			showForm: false
		}
	}
	liftState = val => {
		let details = { ...this.state.details, ...val }
		this.setState({ details })
	}

	updateItems = (val, description) => {
		let details = { ...this.state.details }
		for (const key in details) {
			if (key.indexOf("Item_") > -1) {
				delete details[key]
			}
		}
		let showForm = Object.keys(val).length > 0
		details = { ...details, ...val, Description: description }
		this.setState({ details, showForm })
	}
	handleError = e => {
		this.setState({ error: e.response.data.message })
	}
	render() {
		let { details, error, showForm } = this.state
		details = {
			Sold_Date: Moment().format("YYYY-MM-DD"),
			...details
		}

		return (
			<section>
				<h1>Create a New Order</h1>
				{error && <Alert>{error}</Alert>}
				<CreateItem updateItems={this.updateItems} />
				{showForm && (
					<FormWrapper details={details} liftState={this.liftState} handleError={this.handleError} />
				)}
			</section>
		)
	}
}

export default CreateOrder
