import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"

import Util from "./utils"

class Taxes extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		const { match, orders } = this.props
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
			return {
				name: county,
				sales: Util.formatMoney(Util.totaler(countyOrders, "Total_Sold_Price")),
				collected: Util.formatMoney(Util.totaler(countyOrders, "Tax_Collected")),
				due: Util.formatMoney(Util.totaler(countyOrders, "Tax_Calculated_Calc"))
			}
		})
		return (
			<section>
				<h1>{month.format("MMMM YYYY")} Sales Tax</h1>
				<div className="item__grid">
					<div className="item__row item__row--header">
						<span className="item__detail item__detail--date">County</span>
						<span className="item__detail item__detail--date">Sales</span>
						<span className="item__detail item__detail--date">Tax Collected</span>
						<span className="item__detail item__detail--date">Estimated Tax Due</span>
					</div>
					{totals.map(county => {
						return (
							<div className="item__row item__row" key={county.name}>
								<span className="item__detail item__detail--date">{county.name}</span>
								<span className="item__detail item__detail--date">{county.sales}</span>
								<span className="item__detail item__detail--date">{county.collected}</span>
								<span className="item__detail item__detail--date">{county.due}</span>
							</div>
						)
					})}
				</div>
			</section>
		)
	}
}

Taxes.propTypes = {
	match: PropType.object,
	orders: PropType.array
}

export default Taxes
