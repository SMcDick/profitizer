import React, { Component } from "react"
import propType from "prop-types"
import Input from "./input"
import axios from "axios"
import { Redirect, Link } from "react-router-dom"
import SelectWrapper from "./select"

import util from "./utils"
import { API_ROOT } from "./config"

class OrderForm extends Component {
	constructor(props) {
		super(props)

		this.handleInputChange = this.handleInputChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleUpdate = this.handleUpdate.bind(this)

		this.state = {
			details: {},
			redirect: false
		}
		this.createdItems = []
		if (!props.create) {
			this.createdItems = [1, 2, 3, 4, 5].reduce((array, item) => {
				let itemNumber = `Item_${item}`

				if (props.details[itemNumber]) {
					return array.concat(item)
				}
				return array
			}, [])
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
		if (name.indexOf("_Quantity") > -1) {
			let totalCost = [1, 2, 3, 4, 5].reduce((total, item) => {
				let itemNumber = `Item_${item}`
				let itemId = state[itemNumber]
				let inventoryItem = this.props.inventory.find(itm => itm.Item_Id === itemId)
				if (itemId) {
					return (
						total + parseInt(state[itemNumber + "_Quantity"], 10) * parseFloat(inventoryItem.Final_Cost, 10)
					)
				}
				return total
			}, 0)
			state.Total_Cost_calc = totalCost
		}
		this.setState({
			details: state
		})
	}
	// Probably only used on the Create page
	handleReactSelectChange = val => {
		let details = { ...this.state.details }
		for (var i = 1; i <= 5; i++) {
			delete details["Item_" + i]
			delete details["Item_" + i + "_Quantity"]
		}
		let desc = []
		let cost = 0
		this.createdItems = val.map((item, idx) => {
			let number = idx + 1
			let string = `Item_${number}`
			// Set item values to be saved
			details[string] = item.value
			details[string + "_Quantity"] = "1"

			// Get inventory item name
			let inventoryItem = this.props.inventory.find(itm => itm.Item_Id === item.value)
			if (inventoryItem) {
				desc.push(inventoryItem.Item)
				cost += inventoryItem.Final_Cost
			} else {
				desc.push(item.label)
			}
			return number
		})
		details.Description = desc.join("; ")
		details.Total_Cost_calc = cost
		this.setState({ details })
	}
	handleUpdate = val => {
		let orders = [...this.props.orders]
		let current = orders.find(item => item.Order_Id === val.Order_Id)
		if (current) {
			orders[orders.indexOf(current)] = val
		} else {
			orders = [val, ...orders]
		}
		this.props.handleUpdate({ orders })
	}
	handleSubmit(e) {
		const { create, details } = this.props
		e.preventDefault()
		let url = API_ROOT + "sale/" + details.Order_Id
		let method = "put"
		if (create) {
			url = API_ROOT + "createSale"
			method = "post"
		}
		let saveDetails = { ...this.state.details }
		for (var i = 1; i <= 5; i++) {
			delete saveDetails[`Item_${i}_Name`]
			delete saveDetails[`Item_${i}_Cost`]
		}
		delete saveDetails.Tax_Calculated_Calc
		delete saveDetails.Tax_Calculated_Temp
		delete saveDetails.Total_Cost_calc

		axios[method](url, saveDetails)
			.then(results => {
				let data = results.data
				if (create) {
					data = data.sale
				}
				this.handleUpdate(data)
				this.setState({ redirect: true })
			})
			.catch(e => {
				let resp = e.response.data ? e.response.data.body : e.response
				alert(resp)
			})
	}
	static createFields() {
		return [
			{ name: "Description", type: "text" },
			{ name: "Platform_Order_Id", type: "text", required: true },
			{ name: "Marketplace", type: "text" },
			{ name: "Sold_Date", type: "date", required: true },
			{ name: "Total_Sold_Price", required: true },
			{ name: "Transaction_Fee" },
			{ name: "Marketplace_Fee" },
			{ name: "Shipping" },
			{ name: "Tax_County", type: "text" },
			{ name: "Tax_Pct", label: "Tax %" },
			{ name: "Tax_Collected" },
			{ name: "Tax_Calculated_Temp", label: "Old Taxes" },
			{ name: "Tax_Calculated_Calc", label: "Estimated Taxes", readonly: true },
			{ name: "Order_Id", readonly: true, type: "text" },
			{ name: "Completed", type: "checkbox" }
		]
	}
	static createItems(itemArray, props) {
		let items = itemArray.reduce((array, item) => {
			let itemNumber = `Item_${item}`
			let itemQuantity = `${itemNumber}_Quantity`
			let nameLabel = itemNumber + "_Name"
			let itemFields = [
				{
					name: nameLabel,
					key: nameLabel + "_" + itemArray.length,
					readonly: true,
					type: "text",
					parent: itemNumber,
					fieldType: "name",
					className: "item-name"
				},
				{
					name: itemQuantity,
					key: itemQuantity + "_" + itemArray.length,
					int: true,
					readonly: !props.create,
					className: "item-qty"
				},
				{
					name: itemNumber + "_Cost",
					readonly: true,
					key: itemNumber + "_Cost_" + itemArray.length,
					parent: itemNumber,
					fieldType: "cost",
					className: "item-cost"
				},
				{
					name: itemNumber,
					readonly: true,
					key: itemNumber + "_" + itemArray.length,
					type: "text",
					className: "item-number"
				}
			]
			return array.concat(itemFields)
		}, [])
		items.push({
			name: "Total_Cost_calc",
			label: "Total Cost",
			readonly: true,
			key: "Total_Cost",
			className: "item-total"
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
		for (const key of OrderForm.createFields()) {
			details[key.name] = nextProps.details[key.name]
		}
		let itemArray = [1, 2, 3, 4, 5].reduce((array, item) => {
			if (nextProps.details[`Item_${item}`]) {
				return array.concat(item)
			}
			return array
		}, [])

		for (const key of OrderForm.createItems(itemArray, nextProps)) {
			details[key.name] = nextProps.details[key.name]
		}
		if (!details.Sold_Date) {
			details.Sold_Date = new Date().toISOString().split("T")[0]
		}
		return { details }
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
	getFormValues = (options, fees) => {
		const { details } = this.state
		const name = options.name

		let value = details[name] ? details[name] : ""
		if (this.props.create && options.parent) {
			let parentId = parseInt(details[options.parent], 10)
			let inventoryItem = this.props.inventory.find(itm => itm.Item_Id === parentId)
			if (options.fieldType === "name") {
				value = inventoryItem ? inventoryItem.Item : "No Name Found. Something went wrong"
			}
			if (options.fieldType === "cost") {
				value = inventoryItem ? inventoryItem.Final_Cost : "No Cost Found. Something went wrong"
			}
		}
		let label = options.label ? options.label : util.stringify(options.name)
		let feeEstimate = ""
		if (options.name === "Transaction_Fee") {
			feeEstimate = ` ($${fees.transactionFee})`
		} else if (options.name === "Marketplace_Fee") {
			feeEstimate = ` ($${fees.marketplaceFee})`
		}
		label = label + feeEstimate
		options.label = label
		options.type = options.type ? options.type : "number"
		options.value = value
		return options
	}
	validate = val => {
		const target = val.target
		const { details } = this.state
		let { name, type, value, step } = target
		if (type === "number") {
			details[name] = Number(value).toFixed(step === "1" ? 0 : 2)
			this.setState({ details })
		}
	}
	focus = val => {
		const target = val.target
		const { details } = this.state
		let { name, type, value } = target
		if (type === "number") {
			details[name] = Number(value)
			this.setState({ details })
		}
	}
	renderInput(options, fees) {
		options = this.getFormValues(options, fees)
		return (
			<Input
				onFocus={this.focus}
				onBlur={this.validate}
				onChange={this.handleInputChange}
				key={options.key ? options.key : options.name}
				className={options.className}
				label={options.label}
				name={options.name}
				value={options.value.toString()}
				readonly={options.readonly}
				type={options.type}
				int={options.int}
				required={options.required}
			/>
		)
	}
	render() {
		if (this.state.redirect) {
			return <Redirect exact={true} to="/orders" />
		}
		let fees = this.computeDefaultFees(this.state.details)
		return (
			<form onSubmit={this.handleSubmit}>
				{this.props.create && (
					<div className="item-wrapper select-wrapper">
						{this.createdItems.length === 0 && (
							<div className="padBot20">
								<Link className="btn" to="/inventory/create">
									Add new item
								</Link>
							</div>
						)}
						<SelectWrapper
							options={this.mapper(this.props.inventory)}
							name="Items Sold"
							reactSelectChange={this.handleReactSelectChange}
						/>
						{this.createdItems.length > 0 && (
							// TODO fix this so that the fields display correctly
							<div className="item-field-wrapper">
								<h3>Item Details</h3>
								{OrderForm.createItems(this.createdItems, this.props).map(field =>
									this.renderInput(field)
								)}
							</div>
						)}
					</div>
				)}
				{(!this.props.create || this.createdItems.length > 0) && (
					<div className="order-form">
						{OrderForm.createFields().map(field => this.renderInput(field, fees))}
						{!this.props.create && (
							<div className="item-wrapper">
								<div className="item-field-wrapper">
									<h3>Item Details</h3>
									{OrderForm.createItems(this.createdItems, this.props).map(field => {
										return this.renderInput(field)
									})}
								</div>
							</div>
						)}
						<div className="btn-container flex-child__100 pad10">
							<input type="submit" className="btn" value="Submit" />
						</div>
					</div>
				)}
			</form>
		)
	}
}
OrderForm.propTypes = {
	details: propType.object,
	create: propType.bool,
	handleUpdate: propType.func,
	inventory: propType.array,
	orders: propType.array
}

export default OrderForm
