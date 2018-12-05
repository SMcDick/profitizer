import React, { Component } from "react"

import Form from "../form"
import Alert from "../alert"

class UpdateItem extends Component {
	constructor() {
		super()
		this.state = {}
	}
	handleError = e => {
		this.setState({ error: e.response.data.message })
	}
	render() {
		const { error } = this.state
		return (
			<div>
				{error && <Alert>{error}</Alert>}
				<Form {...this.props} handleError={this.handleError} />
			</div>
		)
	}
}

export default UpdateItem
