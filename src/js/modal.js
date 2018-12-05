import React, { Component } from "react"
import { string, node, func, number } from "prop-types"

export default class Modal extends Component {
	closeModal = e => {
		if (e.target.className === "modal--active") {
			this.props.closeModal()
		}
	}
	render() {
		const { title, body, minHeight } = this.props
		return (
			<div className="modal--active" onClick={this.closeModal}>
				<div className="modal__inner" style={{ minHeight }}>
					<h2 className="modal__header">{title}</h2>
					{body}
				</div>
			</div>
		)
	}
}

Modal.propTypes = {
	title: string,
	body: node.isRequired,
	closeModal: func.isRequired,
	minHeight: number
}
Modal.defaultProps = {
	title: "Details"
}
