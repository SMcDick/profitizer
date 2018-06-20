import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"
import { NavLink, Link, Redirect } from "react-router-dom"

import { Grid, GridRow, GridHeader, GridItem } from "./grid"
import Util from "./utils"

class Taxes extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { match, orders } = this.props
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
				taxableAmount: Util.formatMoney(taxableAmount),
				collected: Util.formatMoney(collected),
				due: Util.formatMoney(Util.totaler(countyOrders, "Tax_Calculated_Calc")),
				orders: countyOrders.map(order => order.Order_Id)
			}
		})
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
				<Grid>
					<GridHeader classes="col-5">
						<GridItem>County</GridItem>
						<GridItem>Taxable Amount</GridItem>
						<GridItem>Tax Collected</GridItem>
						<GridItem>Estimated Tax Due</GridItem>
						<GridItem>Orders</GridItem>
					</GridHeader>
					{totals.map(county => {
						return (
							<GridRow classes="col-5" key={county.name}>
								<GridItem>{county.name}</GridItem>
								<GridItem>{county.taxableAmount}</GridItem>
								<GridItem>{county.collected}</GridItem>
								<GridItem>{county.due}</GridItem>
								<GridItem>
									{county.orders.map(order => {
										return (
											<div key={order}>
												<Link to={"/orders/" + order}>{order}</Link>
											</div>
										)
									})}
								</GridItem>
							</GridRow>
						)
					})}
					{totals.length === 0 && (
						<GridRow>
							<GridItem classes="item__detail--full">No sales tax due for this month</GridItem>
						</GridRow>
					)}
				</Grid>
			</section>
		)
	}
}

Taxes.propTypes = {
	match: PropType.object,
	orders: PropType.array
}

export default Taxes
