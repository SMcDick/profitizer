import React, { Component } from "react"
import propTypes from "prop-types"

import { Grid } from "./grid"
import InventoryNav from "./inventoryNav"
import Input from "./input"

class Inventory extends Component {
	render() {
		const { handleSearch, items } = this.props
		const inventory = items

		const fields = [
			{
				name: "order",
				mods: "row",
				heading: "#",
				width: 24,
				sticky: true
			},
			{
				name: "Item",
				mods: "desc",
				heading: "Item",
				width: "30%",
				sticky: true
			},
			{
				name: "Final_Cost",
				heading: "Cost/ea",
				format: "money"
			},
			{
				name: "Remaining",
				heading: "Left",
				className: "aligncenter"
			},
			{
				name: "Remaining_Cost",
				heading: "Total Left",
				format: "money"
			},
			{
				name: "Quantity",
				heading: "Qty",
				className: "aligncenter"
			},
			{
				name: "Num_Sold",
				heading: "Sold",
				className: "aligncenter"
			},
			{
				name: "Total_Cost",
				heading: "Total",
				format: "money"
			}
		]
		const link = { name: "inventory", id: "Item_Id" }
		return (
			<section>
				<h1>Inventory</h1>
				<InventoryNav {...this.props} />
				<Input type="text" name="Search" onChange={handleSearch} label="Search" className="search__wrapper" />
				<Grid fields={fields} data={inventory} link={link} />
			</section>
		)
	}
}
Inventory.propTypes = {
	items: propTypes.array,
	handleSearch: propTypes.func
}

export default Inventory
