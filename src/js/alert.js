import React, { Component } from "react"
import { string } from "prop-types"

class Alert extends Component {
	render() {
		// TODO add in ability to clear errors
		const { children } = this.props
		return (
			<div className="alert alert--error active">
				<i className="icon--bang alert__icon" />
				{children}
			</div>
		)
	}
}

export default Alert

Alert.propTypes = {
	children: string
}
