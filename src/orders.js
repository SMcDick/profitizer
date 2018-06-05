import React, { Component, Children } from "react"
import propTypes from "prop-types"
import { Link } from "react-router-dom"
import OrderNav from "./orderNav"

import Input from "./input"

import util from "./utils"

class Orders extends Component {
	render() {
		const { children, routerProps, orders } = this.props
		const childrenWithProps = Children.map(children, child =>
			React.cloneElement(child, { routerProps: routerProps })
		)
		return (
			<div>
				<h1>{routerProps.match.path === "/orders/all" ? "All " : "Incomplete "}Orders</h1>
				<OrderNav routerProps={routerProps} />
				{childrenWithProps}
				<Input type="text" name="Search" onChange={this.props.handleSearch} label="Search" />
				<div className="item__grid">
					<div className="item__row item__row--header">
						<span className="item__detail item__detail--icon" />
						<span className="item__detail item__detail--desc">Description</span>
						<span className="item__detail">Cost</span>
						<span className="item__detail">Fees</span>
						<span className="item__detail">Profit</span>
						<span className="item__detail item__detail--date">Sold Date</span>
					</div>
					{orders.map(order => {
						return (
							<Link to={"/orders/" + order.Order_Id} key={order.Order_Id} className="item__row">
								<span className="item__detail item__detail--icon">
									<span className={order.Completed ? "icon--check" : "icon--bang"} />
								</span>
								<span className="item__detail item__detail--desc">{order.Description}</span>
								<span className="item__detail">${order.Total_Cost_calc.toFixed(2)}</span>
								<span className="item__detail">
									${(order.Marketplace_Fee + order.Transaction_Fee + order.Shipping).toFixed(2)}
								</span>
								<span className="item__detail">${order.Profit_calc.toFixed(2)}</span>
								<span className="item__detail item__detail--date">
									{util.formatDate(order.Sold_Date)}
								</span>
							</Link>
						)
					})}
					{!orders.length && <div>No results</div>}
				</div>
			</div>
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
