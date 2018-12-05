import React from "react"
import { NavLink, Link } from "react-router-dom"

import util from "../utils"

const Nav = () => {
	const filters = ["Remaining", "All"]
	const links = filters.map(filter => {
		const val = util.dashify(filter)
		return (
			<NavLink to={"/inventory/" + val} className="btn" activeClassName="btn--neutral" key={val}>
				{filter}
			</NavLink>
		)
	})
	return (
		<div className="flex-parent__space-between flex-parent__center-cross flex-parent__wrap padBot20">
			<div className="flex-child flex-child btn-group padBot20">{links}</div>
			<div className="flex-child">
				<Link to="/inventory/create" className="btn">
					Add Inventory
				</Link>
			</div>
		</div>
	)
}

export default Nav
