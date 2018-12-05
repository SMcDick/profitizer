import React, { Component } from "react"

import Expenses from "./expenses"

class Expense extends Component {
	render() {
		// TODO add filters for type and vendor
		const formFields = [
			{ name: "Date", type: "date", className: "pad10 flex-child__50" },
			{ name: "Vendor", type: "text", className: "pad10 flex-child__50" },
			{ name: "Amount", className: "pad10 flex-child__50" },
			{ name: "Type", type: "text", className: "pad10 flex-child__50" },
			{ name: "Notes", type: "textarea", className: "pad10 flex-child__100" }
		]
		const gridFields = [
			{ name: "Date", format: "date", width: 100, sticky: true },
			{ name: "Vendor", sticky: true, width: 120, mods: "desc", format: "title" },
			{ name: "Amount", format: "money", width: 100 },
			{ name: "Type", className: "alignleft" },
			{ name: "Notes", format: "title", width: 300, className: "alignleft" }
		]
		const url = "expenses/"
		return (
			<Expenses
				{...this.props}
				formFields={formFields}
				gridFields={gridFields}
				url={url}
				textVal="Business"
				totalField="Amount"
			/>
		)
	}
}
export default Expense
