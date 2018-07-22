import React, { Component } from "react"
import propType from "prop-types"
import Input from "./input"
import axios from "axios"
import { Redirect } from "react-router-dom"

import util from "./utils"
import { API_ROOT } from "./config"

class InventoryForm extends Component {
	constructor(props) {
		super(props)

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

		this.state = {
			details: {},
			redirect: false
		}
	}
	handleInputChange(event) {
		const target = event.target
		const value = target.type === "checkbox" ? target.checked : target.value
		const name = target.name
		if (name === "") {
			return
		}
		const details = { ...this.state.details }
		details[name] = value
		this.setState({ details })
	}
	handleSubmit(e) {
		const { create, details } = this.props
		e.preventDefault()
		let url = API_ROOT + "item/" + details.Item_Id
		// let method = "put"
		let method = "post"
		if (create) {
			url = API_ROOT + "createItem"
			method = "post"
		}

		axios[method](url, this.state.details)
			.then(() => {
				axios.get(API_ROOT + "inventory/all").then(result => {
					this.props.handleUpdate({ inventory: result.data.data })
					this.setState({ redirect: true })
				})
			})
			.catch(e => {
				alert(e.response.data.body)
			})
	}
	static createFields() {
		return [
			{ name: "Item", type: "text" },
			{ name: "Item_Id", label: "Item Id", readonly: true, type: "text" },
			{ name: "Quantity", int: true },
			{ name: "Unit_Cost", label: "Unit Cost" },
			{ name: "Tax" },
			{ name: "Num_Sold", label: "Number Sold", int: true }
		]
	}
	static getDerivedStateFromProps(nextProps) {
		let details = {}
		for (const key of InventoryForm.createFields()) {
			details[key.name] = nextProps.details[key.name]
		}
		return { details }
	}
	renderInput(options) {
		const { details } = this.state
		const name = options.name
		let stateVal = details[name] !== undefined ? details[name] : ""
		let value = options.value ? options.value : stateVal
		let label = options.label ? options.label : util.stringify(options.name)
		return (
			<Input
				onChange={this.handleInputChange}
				key={options.key ? options.key : name}
				label={label}
				name={name}
				value={value.toString()}
				readonly={options.readonly}
				type={options.type ? options.type : "number"}
				int={options.int}
				required={options.required}
			/>
		)
	}
	render() {
		if (this.state.redirect) {
			return <Redirect exact={true} to="/inventory" />
		}
		return (
			<form onSubmit={this.handleSubmit} className="order-form">
				{InventoryForm.createFields().map(field => this.renderInput(field))}
				<div className="btn-container flex-child__100 pad10">
					<input type="submit" value="Submit" className="btn" />
				</div>
			</form>
		)
	}
}
InventoryForm.propTypes = {
	details: propType.object,
	edit: propType.bool,
	create: propType.bool,
	handleUpdate: propType.func
}

export default InventoryForm
