import React from "react"
import { NavLink, Link } from "react-router-dom"

let isLinkActive = (location, root) => {
	if (location.pathname.indexOf(root) === 1) {
		return true
	} else {
		return false
	}
}

const Nav = () => (
	<ul className="flex-parent nav">
		<li className="flex-child nav__item">
			<NavLink to="/" exact>
				Home
			</NavLink>
		</li>
		<li className="flex-child nav__item">
			<NavLink to="/inventory/all" isActive={(match, location) => isLinkActive(location, "inventory")}>
				Inventory
			</NavLink>
		</li>
		<li className="flex-child nav__item">
			<NavLink to="/orders/this-month" isActive={(match, location) => isLinkActive(location, "orders")}>
				Orders
			</NavLink>
		</li>
		<li className="flex-child nav__item">
			<NavLink to="/taxes">Taxes</NavLink>
		</li>
		<li className="flex-child nav__item">
			<NavLink to="/expenses">Expenses</NavLink>
		</li>
		<li className="flex-child nav__item">
			<NavLink to="/restaurants">Restaurants</NavLink>
		</li>
		<li className="flex-child nav__item">
			<NavLink to="/bugs">Bugs</NavLink>
		</li>
		<li className="flex-child nav__item">
			<Link to="/logout">Logout</Link>
		</li>
		{/*
            <li className="flex-child nav__item">
                <a href="/" onClick={this.refreshData}>
                    Refresh
                </a>
            </li>
            */}
	</ul>
)

export default Nav
