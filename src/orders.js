import React, { Component } from "react"
import propTypes from "prop-types"
import { Link } from "react-router-dom"
import Moment from "moment"
import OrderNav from "./orderNav"

import Input from "./input"

import util from "./utils"

class Orders extends Component {
	render() {
		const { orders } = this.props
		let totals = {
			sales: util.formatMoney(util.totaler(orders, "Total_Sold_Price")),
			return: util.formatMoney(util.totaler(orders, "Return_calc")),
			profit: util.formatMoney(util.totaler(orders, "Profit_calc")),
			cost: util.formatMoney(util.totaler(orders, "Total_Cost_calc"))
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
				<div className="item-wrapper">
					<div className="pad10">
						Details:<br />
						Cost of Goods Sold: {totals.cost}
						<br />
						Total Sales: {totals.sales}
						<br />
						Total Return: {totals.return}
						<br />
						Total Profit: {totals.profit}
					</div>
				</div>
				<div className="item__grid">
					<div className="item__row item__row--header">
						<span className="item__detail item__detail--icon item__detail--minor" />
						<span className="item__detail item__detail--desc">Description</span>
						<span className="item__detail item__detail--minor">Cost</span>
						<span className="item__detail item__detail--minor">Fees</span>
						<span className="item__detail">Profit</span>
						<span className="item__detail item__detail--date">Sold Date</span>
					</div>
					{orders.map(order => {
						return (
							<Link to={"/orders/" + order.Order_Id} key={order.Order_Id} className="item__row">
								<span className="item__detail item__detail--icon item__detail--minor">
									<span className={order.Completed ? "icon--check" : "icon--bang"} />
								</span>
								<span className="item__detail item__detail--desc">{order.Description}</span>
								<span className="item__detail item__detail--minor">
									${order.Total_Cost_calc.toFixed(2)}
								</span>
								<span className="item__detail item__detail--minor">
									${(order.Marketplace_Fee + order.Transaction_Fee + order.Shipping).toFixed(2)}
								</span>
								<span className="item__detail">${order.Profit_calc.toFixed(2)}</span>
								<span className="item__detail item__detail--date">
									{Moment(order.Sold_Date).format("M/D/YYYY")}
								</span>
							</Link>
						)
					})}
					{!orders.length && <div>No results</div>}
				</div>
			</section>
		)
	}
}
Orders.propTypes = {
	orders: propTypes.array,
	pager: propTypes.element,
	routerProps: propTypes.object,
	children: propTypes.element,
	handleSearch: propTypes.func
}

export default Orders
