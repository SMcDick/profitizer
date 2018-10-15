import React from "react"
import PropType from "prop-types"
import Moment from "moment"
import { NavLink, Redirect } from "react-router-dom"

import { Grid } from "./grid"
import Util from "./utils"

const Taxes = props => {
	const { match, orders } = props
	const thisMonthLink = "/taxes/" + Moment().format("YYYY-MM")
	const lastMonthLink =
		"/taxes/" +
		Moment()
			.add(-1, "month")
			.format("YYYY-MM")
	const twoMonthsAgoLink =
		"/taxes/" +
		Moment()
			.add(-2, "month")
			.format("YYYY-MM")
	if (match.params.month === undefined) {
		return <Redirect to={thisMonthLink} />
	}
	const month = Moment(match.params.month)
	if (!month.isValid()) {
		return (
			<section>
				<h1>Invalid date</h1>
			</section>
		)
	}

	let filteredOrders = orders.filter(
		order => Moment(order.Sold_Date).isSame(month, "month") && order.Tax_Calculated_Calc > 0
	)
	let counties = [...new Set(filteredOrders.map(order => order.Tax_County))]
	let totals = counties.map(county => {
		const countyOrders = filteredOrders.filter(order => order.Tax_County === county)
		const sales = Util.totaler(countyOrders, "Total_Sold_Price")
		const collected = Util.totaler(countyOrders, "Tax_Collected")
		const taxableAmount = sales - collected
		return {
			name: county,
			taxableAmount: taxableAmount,
			collected: collected,
			due: Util.totaler(countyOrders, "Tax_Calculated_Calc"),
			orders: countyOrders.map(order => {
				return {
					id: order.Order_Id,
					url: "/orders/" + order.Order_Id
				}
			})
		}
	})

	const fields = [
		{
			name: "name",
			heading: "County",
			width: 100,
			mods: "desc"
		},
		{
			name: "taxableAmount",
			heading: "Taxable Amount",
			format: "money"
		},
		{
			name: "collected",
			heading: "Tax Collected",
			format: "money"
		},
		{
			name: "due",
			heading: "Estimated Tax Due",
			width: 120,
			format: "money"
		},
		{
			name: "orders",
			heading: "Orders",
			width: "40%",
			format: "links",
			className: "alignleft"
		}
	]
	return (
		<section>
			<h1>{month.format("MMMM YYYY")} Sales Tax</h1>
			<div className="btn-group padBot20">
				<NavLink to={thisMonthLink} className="btn">
					This Month
				</NavLink>
				<NavLink to={lastMonthLink} className="btn">
					Last Month
				</NavLink>
				<NavLink to={twoMonthsAgoLink} className="btn">
					Two Months Ago
				</NavLink>
			</div>
			<Grid fields={fields} data={totals} />
		</section>
	)
}

Taxes.propTypes = {
	match: PropType.object,
	orders: PropType.array
}

export default Taxes
