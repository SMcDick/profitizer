import React, { Component } from "react"

import Expenses from "./expenses"

class Restaurant extends Component {
	render() {
		// TODO remove Tip and Amount and only use total
		// TODO Add filters for restaurant and date
		const formFields = [
			{ name: "Date", type: "date", className: "pad10 flex-child__50" },
			{ name: "Restaurant", type: "text", className: "pad10 flex-child__50" },
			{ name: "Amount", className: "pad10 flex-child__50" },
			{ name: "Tip", className: "pad10 flex-child__50" },
			{ name: "Total", className: "pad10 flex-child__50" }
		]
		const gridFields = [
			{ name: "Date", format: "date", width: 100, sticky: true },
			{ name: "Restaurant", width: 120, mods: "desc", sticky: true, format: "title" },
			{ name: "Amount", format: "money" },
			{ name: "Tip", format: "money" },
			{ name: "Total", format: "money" }
		]
		const url = "restaurants/"
		return (
			<Expenses
				{...this.props}
				formFields={formFields}
				gridFields={gridFields}
				url={url}
				textVal="Restaurant"
				totalField="Total"
			/>
		)
	}
}

export default Restaurant
