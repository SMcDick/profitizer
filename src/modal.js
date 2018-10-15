import React, { Component } from "react"
import PropType from "prop-types"

const { func, object, string, array } = PropType

export default class Modal extends Component {
	render() {
		const { fields, title, item, modalInputs, submit, cancel } = this.props
		return (
			<div className="modal--active">
				<div className="modal__inner">
					<h2 className="modal__header">{title}</h2>
					{fields.map(field => {
						return <div key={field.name}>{modalInputs(field, item[field.name])}</div>
					})}
					<div className="flex-parent__flex-end">
						{cancel && (
							<button
								className="btn btn--accent flex-child"
								style={{ marginRight: "10px" }}
								onClick={cancel}>
								Cancel
							</button>
						)}
						{submit && (
							<button className="btn btn--positive flex-child" onClick={submit}>
								OK
							</button>
						)}
					</div>
				</div>
			</div>
		)
	}
}

Modal.propTypes = {
	fields: array,
	item: object,
	title: string,
	modalInputs: func,
	submit: func,
	cancel: func
}
Modal.defaultProps = {
	title: "Details"
}
