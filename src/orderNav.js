import React, { Component } from "react"
import { Link } from "react-router-dom"
import PropTypes from "prop-types"

class OrderNav extends Component {
	constructor(props) {
		super(props)
		this.filters = [
			{ text: "Today", val: "day:today" },
			{ text: "Yesterday", val: "day:yesterday" },
			{ text: "This Week", val: "week:current" },
			{ text: "Last Week", val: "week:last" },
			{ text: "This Month", val: "month:current" },
			{ text: "Last Month", val: "month:last" },
			{ text: "This Year", val: "year:current" },
			{ text: "Last Year", val: "year:last" }
		]
	}
	checkFilter(val) {
		if (this.props.location.search.indexOf(val) > -1) {
			return " btn--neutral"
		}
		return ""
	}
	renderLink(val, text) {
		return (
			<Link to={"/orders?filters={" + val + "}"} className={"btn" + this.checkFilter(val)} key={val}>
				{text}
			</Link>
		)
	}
	render() {
		return (
			<div className="flex-parent__space-between flex-parent__center-cross flex-parent__wrap padBot20">
				<div className="flex-child flex-child__100 btn-group padBot20">
					{this.filters.map(filter => this.renderLink(filter.val, filter.text))}
				</div>
				<div className="flex-child">{this.renderLink("incomplete:true", "Incomplete")}</div>
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
	location: PropTypes.object
}

export default OrderNav
