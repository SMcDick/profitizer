import React, { Component } from "react"
import propTypes from "prop-types"

import OrderNav from "./orderNav"
import { Grid } from "./grid"
import Input from "./input"

import util from "./utils"

class Orders extends Component {
	render() {
		const { items } = this.props
		let orders = items

		/***********/
		/* Sorting */
		/***********/
		orders = util.sortBy(orders, "Order_Id", [{ name: "Sold_Date", desc: true }])

		/**********/
		/* Totals */
		/**********/
		let totals = [
			{
				sales: util.totaler(orders, "Total_Sold_Price"),
				return: util.totaler(orders, "Return_calc"),
				profit: util.totaler(orders, "Profit_calc"),
				cost: util.totaler(orders, "Total_Cost_calc"),
				fees: util.totaler(orders, "Marketplace_Fee") + util.totaler(orders, "Transaction_Fee"),
				ship: util.totaler(orders, "Shipping"),
				tax: util.totaler(orders, "Tax_Calculated_Calc")
			}
		]

		const totalFields = [
			{
				name: "sales",
				format: "positiveMoney",
				heading: "Sales"
			},
			{
				name: "fees",
				format: "negativeMoney",
				heading: "Fees"
			},
			{
				name: "ship",
				format: "negativeMoney",
				heading: "Shipping"
			},
			{
				name: "tax",
				format: "negativeMoney",
				heading: "Tax"
			},
			{
				name: "return",
				format: "positiveMoney",
				heading: "Return"
			},
			{
				name: "cost",
				format: "negativeMoney",
				heading: "COGS"
			},
			{
				name: "profit",
				format: "positiveMoney",
				heading: "Profit"
			}
		]
		const fields = [
			{
				name: "Completed",
				mods: "icon",
				heading: "",
				format: "check",
				width: 24,
				sticky: true
			},
			{
				name: "order",
				mods: "row",
				heading: "#",
				width: 40,
				sticky: true
			},
			{
				name: "Description",
				mods: "desc",
				width: "40%",
				sticky: true
			},
			{
				name: "Platform_Order_Id",
				heading: "ID",
				format: "truncate",
				className: "alignleft"
			},
			{
				name: "Total_Sold_Price",
				heading: "Sale",
				format: "positiveMoney"
			},
			{
				name: "Total_Cost_calc",
				heading: "Cost",
				format: "negativeMoney"
			},
			{
				name: "Marketplace_Fee",
				heading: "FVF",
				format: "negativeMoney"
			},
			{
				name: "Transaction_Fee",
				heading: "Trx",
				format: "negativeMoney"
			},
			{
				name: "Shipping",
				format: "negativeMoney"
			},
			{
				name: "Tax_Calculated_Calc",
				heading: "Tax",
				format: "negativeMoney"
			},
			{
				name: "Profit_calc",
				heading: "Profit",
				format: "positiveMoney"
			},
			{
				name: "Sold_Date",
				mods: "date",
				heading: "Sold Date",
				format: "date",
				width: 100
			}
		]
		const link = {
			name: "orders",
			id: "Order_Id"
		}
		return (
			<section>
				<h1>Orders</h1>
				<OrderNav {...this.props} />
				<Input
					type="text"
					name="Search"
					onChange={this.props.handleSearch}
					label="Search"
					className="search__wrapper"
				/>
				<Grid
					className="item-wrapper total-table"
					fields={totalFields}
					data={totals}
					fullHeight
					defaultColWidth={100}
				/>
				<Grid fields={fields} data={orders} link={link} />
			</section>
		)
	}
}
Orders.propTypes = {
	items: propTypes.array,
	pager: propTypes.element,
	children: propTypes.element,
	handleSearch: propTypes.func
}

export default Orders
