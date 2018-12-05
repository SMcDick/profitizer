import React, { Component } from "react"
import { func, oneOfType, number, string } from "prop-types"

import CreateItem from "./createItem"
import Form from "../form"
import Alert from "../alert"

class AddItem extends Component {
	constructor() {
		super()
		this.state = {
			details: {}
		}
	}
	handleError = e => {
		this.setState({ error: e.response.data.message })
	}
	updateItems = val => {
		this.setState({ details: val })
	}
	render() {
		const { id, closeModal } = this.props
		const { details, error } = this.state
		return (
			<div>
				{error && <Alert>{error}</Alert>}
				<CreateItem updateItems={this.updateItems} />
				<Form
					details={details}
					fields={[]}
					method="put"
					id={id}
					url="orders/"
					closeModal={closeModal}
					handleError={this.handleError}
				/>
			</div>
		)
	}
}

AddItem.propTypes = {
	closeModal: func,
	id: oneOfType([number, string])
}

export default AddItem
