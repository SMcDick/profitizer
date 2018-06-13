import React, { Component, Children } from "react"
import PropType from "prop-types"
import Moment from "moment"

import util from "./utils"

class Filter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: util.queryParams(props.location.search),
			filters: {},
			search: ""
		}
		this.debounceSearch = util.debounce(this.debounceSearch, 250)
	}
	debounceSearch(search) {
		this.setState({ search })
	}
	handleSearch = e => {
		e.preventDefault()
		const target = e.target
		const search = target.value
		this.debounceSearch(search)
	}
	processFilters() {
		const { filters, search } = this.state
		const { items } = this.props
		let activeItems = items

		/*****************/
		/* Order Filters */
		/*****************/
		if (filters.incomplete === "true") {
			activeItems = activeItems.filter(item => item.Completed === 0)
		}
		if (filters.day === "today") {
			activeItems = activeItems.filter(item => Moment(item.Sold_Date).isSame(Moment(), "day"))
		}
		if (filters.day === "yesterday") {
			activeItems = activeItems.filter(item => Moment(item.Sold_Date).isSame(Moment().add(-1, "days"), "day"))
		}
		if (filters.week === "current") {
			activeItems = activeItems.filter(item => Moment(item.Sold_Date).isSame(Moment(), "week"))
		}
		if (filters.week === "last") {
			activeItems = activeItems.filter(item => {
				let last = Moment().add(-1, "week")
				let lastStart = last.clone().startOf("week")
				let lastEnd = last.clone().endOf("week")
				return Moment(item.Sold_Date).isBetween(lastStart, lastEnd, "week", [])
			})
		}
		if (filters.month === "current") {
			activeItems = activeItems.filter(item => Moment(item.Sold_Date).isSame(Moment(), "month"))
		}
		if (filters.month === "last") {
			activeItems = activeItems.filter(item => {
				let last = Moment().add(-1, "month")
				let lastStart = last.clone().startOf("month")
				let lastEnd = last.clone().endOf("month")
				return Moment(item.Sold_Date).isBetween(lastStart, lastEnd, "month", [])
			})
		}
		if (filters.year === "current") {
			activeItems = activeItems.filter(item => Moment(item.Sold_Date).isSame(Moment(), "year"))
		}
		if (filters.year === "last") {
			activeItems = activeItems.filter(item => {
				let last = Moment().add(-1, "year")
				let lastStart = last.clone().startOf("year")
				let lastEnd = last.clone().endOf("year")
				return Moment(item.Sold_Date).isBetween(lastStart, lastEnd, "year", [])
			})
		}
		if (filters.taxes === "true") {
			activeItems = activeItems.filter(item => item.Tax_Calculated_Calc > 0 || item.Tax_Calculated_Temp > 0)
		}
		if (filters.refunds === "true") {
			activeItems = activeItems.filter(item => item.Refund_Transaction || item.Refunded)
		}

		/*********************/
		/* Inventory Filters */
		/*********************/
		if (filters.remaining === "true") {
			activeItems = activeItems.filter(item => item.Remaining > 0)
		}

		/**********/
		/* Search */
		/**********/
		if (search.length) {
			activeItems = activeItems.filter(item => {
				let stringToSearch = item.Item ? item.Item : item.Description
				return stringToSearch.toLowerCase().indexOf(search.toLowerCase()) > -1
			})
		}
		return activeItems
	}
	static getDerivedStateFromProps(props) {
		let query = util.queryParams(props.location.search)
		let filters = query.filters ? query.filters : {}
		return { filters, query }
	}

	renderChildren() {
		return Children.map(this.props.children, child => {
			return React.cloneElement(child, {
				items: this.processFilters(),
				handleSearch: this.handleSearch
			})
		})
	}
	render() {
		return <div>{this.renderChildren()}</div>
	}
}
Filter.propTypes = {
	children: PropType.element,
	filters: PropType.object,
	search: PropType.string,
	items: PropType.array,
	location: PropType.object
}

export default Filter
