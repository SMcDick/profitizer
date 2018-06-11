import React, { Component } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

class OrderNav extends Component {
	constructor(props) {
		super(props)
		this.filters = [{ text: "Remaining", val: "remaining:true" }, { text: "All", val: "all:true" }]
	}
	checkFilter(val) {
		if (this.props.location.search.indexOf(val) > -1) {
			return " btn--neutral"
		}
		return ""
	}
	renderLink(val, text) {
		return (
			<Link to={"/inventory?filters={" + val + "}"} className={"btn" + this.checkFilter(val)} key={val}>
				{text}
			</Link>
		)
	}
	render() {
		return (
			<div className="flex-parent__space-between flex-parent__center-cross flex-parent__wrap padBot20">
				<div className="flex-child flex-child btn-group padBot20">
					{this.filters.map(filter => this.renderLink(filter.val, filter.text))}
				</div>
				<div className="flex-child">
					<Link to="/inventory/create" className="btn">
						Add Inventory
					</Link>
				</div>
			</div>
		)
	}
}

OrderNav.propTypes = {
	location: PropTypes.object
}

export default OrderNav
