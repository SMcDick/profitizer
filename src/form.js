import React, { Component } from "react"
import propType from "prop-types"
import Input from "./input"
import axios from "axios"
import { Redirect } from "react-router-dom"
import SelectWrapper from "./select"

import util from "./utils"
import { API_ROOT } from "./config"

class OrderForm extends Component {
	constructor(props) {
		super(props)

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

		this.state = {
			details: {},
			// TODO This might not be state?
			// inventory: [],
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
		const state = { ...this.state.details }
		state[name] = value
		this.setState({
			details: state
		})
	}
	// Probably only used on the Create page
	handleReactSelectChange = val => {
		const details = { ...this.state.details }
		let description = []
		for (var i = 1; i <= 5; i++) {
			delete details["Item_" + i]
			delete details["Item_" + i + "_Quantity"]
		}
		this.itemGroups = val.map((item, idx) => {
			let itemNumber = `Item_${idx + 1}`
			let itemQuantity = `${itemNumber}_Quantity`
			let timestamp = "_" + Date.now()
			let nameLabel = itemNumber + "_Name"
			let name = this.props.inventory.find(inv => inv.Item_Id === item.value)
			name = name ? name.Item : "Item Not Found - Something went wrong"
			description.push(name)
			details[itemNumber] = item.value.toString()
			details[itemQuantity] = "1"
			return [
				{
					name: nameLabel,
					key: nameLabel + timestamp,
					readonly: true,
					value: name,
					type: "text"
				},
				{
					name: itemNumber,
					readonly: true,
					key: itemNumber + timestamp,
					type: "text"
				},
				{
					name: itemQuantity,
					readonly: false,
					key: itemQuantity + timestamp,
					int: true
				}
			]
		})
		this.itemFields = this.itemGroups.reduce((items, groups) => items.concat(groups), [])
		if (!this.itemGroups.length) {
			this.itemFields = undefined
		}
		// TODO this doesn't quite work as expected.
		// It doesn't update the default value and it doesn't clear out the updated value when
		// choosing a second item. Leaving for now and might revisit later
		details.Description = description.join("; ")
		this.setState({ details })
	}
	handleSubmit(e) {
		const { create, details, handleOrderUpdates } = this.props
		e.preventDefault()
		let url = API_ROOT + "sale/" + details.Order_Id
		let method = "put"
		if (create) {
			url = API_ROOT + "createSale"
			method = "post"
		}

		axios[method](url, this.state.details)
			.then(results => {
				let data = results.data
				if (create) {
					data = data.sale
				}
				handleOrderUpdates(data)
				this.setState({ redirect: true })
			})
			.catch(e => {
				alert(e.response.data.body)
			})
	}
	static createFields() {
		return [
			{ name: "Description", type: "text" },
			{ name: "Total_Sold_Price", required: true },
			{ name: "Transaction_Fee" },
			{ name: "Marketplace_Fee" },
			{ name: "Shipping" },
			{ name: "Tax", label: "Tax" },
			{ name: "Platform_Order_Id", type: "text", required: true },
			{ name: "Order_Id", readonly: true, type: "text" },
			{ name: "Sold_Date", type: "date", required: true },
			{ name: "Marketplace", type: "text" },
			{ name: "Completed", type: "checkbox" }
		]
	}
	static createItems(props) {
		let items = []
		for (var i = 1; i <= 5; i++) {
			let itemNumber = `Item_${i}`
			let itemQuantity = `${itemNumber}_Quantity`
			let timestamp = "_" + Date.now()
			let nameLabel = itemNumber + "_Name"

			if (props.details[itemQuantity] > 0) {
				items.push(
					{
						name: nameLabel,
						key: nameLabel + timestamp,
						readonly: true,
						type: "text"
					},
					{
						name: itemNumber,
						readonly: true,
						key: itemNumber + timestamp,
						type: "text"
					},
					{
						name: itemQuantity,
						readonly: true,
						key: itemQuantity + timestamp,
						int: true
					},
					{
						name: itemNumber + "_Cost",
						readonly: true,
						key: itemNumber + "_Cost" + timestamp
					}
				)
			}
		}
		items.push({
			name: "Total_Cost_calc",
			label: "Total Cost",
			readonly: true,
			key: "Total_Cost"
		})
		return items
	}
	computeDefaultFees(details) {
		let soldPrice = details.Total_Sold_Price
		let marketplaceFee = 2.95
		if (soldPrice >= 15) {
			marketplaceFee = (soldPrice * 0.2).toFixed(2)
		}
		let transactionFee = 0
		if (details.Marketplace && details.Marketplace.toLowerCase() === "ebay") {
			marketplaceFee = (soldPrice * 0.0915).toFixed(2)
			transactionFee = (soldPrice * 0.029 + 0.3).toFixed(2)
		}
		return { marketplaceFee, transactionFee }
	}
	static getDerivedStateFromProps(nextProps) {
		let details = {}
		let items = {}
		for (const key of OrderForm.createFields()) {
			details[key.name] = nextProps.details[key.name]
		}
		// TODO would not be surprised if this breaks the new order item functionality. Make sure to test
		for (const key of OrderForm.createItems(nextProps)) {
			items[key.name] = nextProps.details[key.name]
		}
		if (!details.Sold_Date) {
			details.Sold_Date = new Date().toISOString().split("T")[0]
		}
		return { details, items }
	}
	mapper(collection) {
		return collection.reduce((array, item) => {
			if (item.Remaining > 0) {
				return array.concat({
					value: item.Item_Id,
					label: `${item.Item} ( ${item.Item_Id} ) - $${item.Final_Cost} (${item.Remaining})`
				})
			}
			return array
		}, [])
	}
	renderInput(type, options, fees) {
		const { details, items } = this.state
		const name = options.name
		let state = type === "details" ? details : items
		let stateVal = state[name] !== undefined ? state[name] : ""

		let value = options.value ? options.value : stateVal
		let feeEstimate = ""
		if (name === "Transaction_Fee") {
			feeEstimate = fees.transactionFee
		} else if (name === "Marketplace_Fee") {
			feeEstimate = fees.marketplaceFee
		}
		let label = options.label ? options.label : util.stringify(options.name)
		return (
			<Input
				key={options.key ? options.key : name}
				label={label}
				feeEstimate={feeEstimate.toString()}
				name={options.name}
				value={value.toString()}
				readonly={options.readonly}
				type={options.type ? options.type : "number"}
				int={options.int}
				required={options.required}
			/>
		)
	}
	handleInventory = val => {
		this.setState({ inventory: val })
	}
	render() {
		if (this.state.redirect) {
			return <Redirect exact={true} to="/orders" />
		}
		let fees = this.computeDefaultFees(this.state.details)
		return (
			<form onSubmit={this.handleSubmit} onChange={this.handleInputChange}>
				{this.props.create && (
					<div className="item-wrapper">
						<SelectWrapper
							options={this.mapper(this.props.inventory)}
							name="Items Sold"
							reactSelectChange={this.handleReactSelectChange}
						/>
						{this.itemFields && (
							// TODO fix this so that the fields display correctly
							<div className="item-field-wrapperx">
								<h3>Item Details</h3>
								{this.itemFields.map(field => this.renderInput("items", field, null))}
							</div>
						)}
					</div>
				)}
				{(!this.props.create || this.itemFields) && (
					<div>
						{OrderForm.createFields().map(field => this.renderInput("details", field, fees))}
						{!this.props.create && (
							<div className="item-wrapper">
								<div className="item-field-wrapper">
									<h3>Item Details</h3>
									{OrderForm.createItems(this.props).map(field =>
										this.renderInput("items", field, null)
									)}
								</div>
							</div>
						)}
						<input type="submit" className="btn" value="Submit" />
					</div>
				)}
			</form>
		)
	}
}
OrderForm.propTypes = {
	details: propType.object,
	edit: propType.bool,
	isCompleted: propType.bool,
	handleCompleted: propType.func,
	create: propType.bool,
	handleOrderUpdates: propType.func,
	inventory: propType.array
}

export default OrderForm
