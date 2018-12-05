import React, { Component } from "react"
import { func } from "prop-types"
import axios from "axios"

import Input from "../input"
import Select from "../select"
import { API_ROOT } from "../config"

class CreateItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inventory: [],
			loading: true,
			items: []
		}
	}
	handleReactSelectChange = val => {
		const description = val.map(item => `${item.item} (${item.quantity})`).join("; ")
		this.setState({ items: val }, this.props.updateItems(this.itemsArrayToObject(val), description))
	}
	componentDidMount() {
		axios.get(API_ROOT + "inventory/remaining").then(result => {
			this.setState({ inventory: result.data.data, loading: false })
		})
	}
	selectBuilder(collection) {
		return collection.map(item => {
			return {
				value: item.Item_Id,
				label: `${item.Item} ( ${item.Item_Id} ) - $${item.Final_Cost} (${item.Remaining})`,
				item: item.Item,
				cost: item.Final_Cost,
				quantity: 1,
				name: "Item_" + item.Item_Id
			}
		})
	}
	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		if (name === "") {
			return
		}
		const items = [...this.state.items]
		const item = items.find(itm => itm.name === name)
		if (!item) {
			return
		}
		item.quantity = value
		const description = items.map(item => `${item.item} (${item.quantity})`).join("; ")
		this.setState({ items }, this.props.updateItems(this.itemsArrayToObject(items), description))
	}
	renderInput(options) {
		return (
			<Input options={options} onChange={this.handleInputChange} key={options.key ? options.key : options.name} />
		)
	}
	itemsArrayToObject(items) {
		return items.reduce((object, item) => {
			let key = "Item_" + item.value
			object[key] = item.value
			object[key + "_Quantity"] = item.quantity
			return object
		}, {})
	}
	render() {
		const { inventory, loading, items } = this.state
		if (loading) {
			return <div>Loading...</div>
		}
		return (
			<div className="item-wrapper">
				<Select
					options={this.selectBuilder(inventory)}
					name="Items Sold"
					handleChange={this.handleReactSelectChange}
				/>
				{items.map(item => {
					const options = {
						label: "Quantity",
						name: item.name,
						int: true,
						value: item.quantity,
						className: "short"
					}
					return (
						<div key={item.name} className="pad10">
							<div>
								<strong>{item.item}</strong>
							</div>
							{this.renderInput(options)}
						</div>
					)
				})}
			</div>
		)
	}
}

export default CreateItem

CreateItem.propTypes = {
	updateItems: func.isRequired
}
