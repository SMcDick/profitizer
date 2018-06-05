import React, { Component } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

class OrderNav extends Component {
	render() {
		let pathCheck = this.props.routerProps.match.path === "/orders/all"
		let type = pathCheck ? "Incomplete" : "All"
		let link = pathCheck ? "" : "/all"
		return (
			<ul>
				<li>
					<Link to="/orders/create">Create New Order</Link>
				</li>
				<li>
					<Link to={"/orders" + link}>View {type} Orders</Link>
				</li>
			</ul>
		)
	}
}

OrderNav.propTypes = {
	routerProps: PropTypes.object
}

export default OrderNav
