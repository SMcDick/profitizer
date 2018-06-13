import React, { Component, Children } from "react"
import PropType from "prop-types"
import Moment from "moment"

class OrderFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			activeOrders: props.orders
		}
	}
	static getDerivedStateFromProps(props) {
		const { filters, search, orders } = props
		let activeOrders = orders
		if (filters.incomplete === "true") {
			activeOrders = activeOrders.filter(order => order.Completed === 0)
		}
		if (filters.day === "today") {
			activeOrders = activeOrders.filter(order => Moment(order.Sold_Date).isSame(Moment(), "day"))
		}
		if (filters.day === "yesterday") {
			activeOrders = activeOrders.filter(order => Moment(order.Sold_Date).isSame(Moment().add(-1, "days"), "day"))
		}
		if (filters.week === "current") {
			activeOrders = activeOrders.filter(order => Moment(order.Sold_Date).isSame(Moment(), "week"))
		}
		if (filters.week === "last") {
			activeOrders = activeOrders.filter(order => {
				let last = Moment().add(-1, "week")
				let lastStart = last.clone().startOf("week")
				let lastEnd = last.clone().endOf("week")
				return Moment(order.Sold_Date).isBetween(lastStart, lastEnd, "week", [])
			})
		}
		if (filters.month === "current") {
			activeOrders = activeOrders.filter(order => Moment(order.Sold_Date).isSame(Moment(), "month"))
		}
		if (filters.month === "last") {
			activeOrders = activeOrders.filter(order => {
				let last = Moment().add(-1, "month")
				let lastStart = last.clone().startOf("month")
				let lastEnd = last.clone().endOf("month")
				return Moment(order.Sold_Date).isBetween(lastStart, lastEnd, "month", [])
			})
		}
		if (filters.year === "current") {
			activeOrders = activeOrders.filter(order => Moment(order.Sold_Date).isSame(Moment(), "year"))
		}
		if (filters.year === "last") {
			activeOrders = activeOrders.filter(order => {
				let last = Moment().add(-1, "year")
				let lastStart = last.clone().startOf("year")
				let lastEnd = last.clone().endOf("year")
				return Moment(order.Sold_Date).isBetween(lastStart, lastEnd, "year", [])
			})
		}
		if (filters.taxes === "true") {
			activeOrders = activeOrders.filter(order => order.Tax_Calculated_Calc > 0 || order.Tax_Calculated_Temp > 0)
		}
		if (filters.refunds === "true") {
			activeOrders = activeOrders.filter(order => order.Refund_Transaction || order.Refunded)
		}
		if (search.length) {
			activeOrders = activeOrders.filter(
				order => order.Description.toLowerCase().indexOf(search.toLowerCase()) > -1
			)
		}
		return { activeOrders }
	}

	renderChildren() {
		return Children.map(this.props.children, child => {
			return React.cloneElement(child, { orders: this.state.activeOrders })
		})
	}
	render() {
		return <div>{this.renderChildren()}</div>
	}
}
OrderFilter.propTypes = {
	children: PropType.element,
	filters: PropType.object,
	search: PropType.string,
	orders: PropType.array
}

export default OrderFilter
