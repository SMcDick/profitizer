import React, { Component } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

class OrderNav extends Component {
	render() {
		let pathCheck = this.props.routerProps.match.path === "/orders/incomplete"
		let type = pathCheck ? "All" : "Incomplete"
		let link = pathCheck ? "" : "/incomplete"
		return (
			<div className="flex-parent__space-between flex-parent__center-cross padBot20">
				<div className="flex-child">
					<Link to={"/orders" + link}>View {type} Orders</Link>
				</div>
				<div className="flex-child">
					<Link to="/orders/create" className="btn">
						Create New Order
					</Link>
				</div>
			</div>
		)
	}
}

OrderNav.propTypes = {
	routerProps: PropTypes.object
}

export default OrderNav
