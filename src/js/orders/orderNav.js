import React from "react"
import { NavLink, Link } from "react-router-dom"

import OrderFilters from "./orderFilters"

import util from "../utils"

const OrderNav = () => {
	const links = OrderFilters.map(filter => {
		const { name } = filter
		const val = util.dashify(name)
		return (
			<NavLink to={"/orders/" + val} className="btn" activeClassName="btn--neutral" key={val}>
				{name}
			</NavLink>
		)
	})
	return (
		<div className="flex-parent__space-between flex-parent__center-cross flex-parent__wrap padBot20">
			<div className="flex-child flex-child__100 btn-group padBot20">{links}</div>
			<div className="flex-child">
				<Link to="/orders/create" className="btn">
					Create New Order
				</Link>
			</div>
		</div>
	)
}

export default OrderNav
