import React, { Component } from "react"
// import axios from "axios"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Moment from "moment"
import Orders from "./orders"
import Order from "./order"
import Form from "./form"

import util from "./utils"
// import { API_ROOT } from "./config"

class OrderWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: util.queryParams(props.location.search),
			filters: {},
			search: ""
		}
		this.handleOrderUpdates = this.handleOrderUpdates.bind(this)
	}
	static getDerivedStateFromProps(props) {
		let query = util.queryParams(props.location.search)
		return { query: query, filters: query.filters ? query.filters : {} }
	}
	handleOrderUpdates(val) {
		// this.setState(prevState => {
		// 	let orders = [...prevState.orders]
		// 	let current = orders.find(order => order.Order_Id === val.Order_Id)
		// 	if (current) {
		// 		if (val.Completed) {
		// 			orders.splice(orders.indexOf(current), 1)
		// 		} else {
		// 			Object.assign(current, val)
		// 		}
		// 	} else {
		// 		if (!val.Completed) {
		// 			orders.unshift(val)
		// 		}
		// 	}
		// 	orders.sort((a, b) => {
		// 		return a.Date_Sold - b.Date_Sold
		// 	})
		// 	return { orders: orders }
		// })
	}
	handleSearch = e => {
		e.preventDefault()
		const target = e.target
		const value = target.value
		this.setState({ search: value })
	}
	componentWillUnmount() {
		console.log("order wrapper unmounted")
	}
	render() {
		console.log("order wrapper rendered")
		let activeOrders = this.props.orders
		const { match } = this.props
		const { filters, search } = this.state
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
			activeOrders = activeOrders.filter(order => order.Tax_Calculated_Temp > 0)
		}
		if (filters.refunds === "true") {
			activeOrders = activeOrders.filter(order => order.Refund_Transaction || order.Refunded)
		}
		if (search.length) {
			activeOrders = activeOrders.filter(
				order => order.Description.toLowerCase().indexOf(search.toLowerCase()) > -1
			)
		}
		return (
			<div>
				<Switch>
					<Route
						exact
						path={match.url}
						render={props => {
							return <Orders {...props} orders={activeOrders} handleSearch={this.handleSearch} />
						}}
					/>
					<Route
						exact
						path={match.url + "/create"}
						render={props => {
							return (
								<div>
									<h1>Create a New Order</h1>
									<Form
										details={{ Marketplace: "Poshmark" }}
										inventory={this.props.inventory}
										create={true}
										handleOrderUpdates={this.props.handleUpdate}
									/>
								</div>
							)
						}}
					/>
					<Route
						path={match.url + "/:id"}
						render={props => {
							return (
								<Order
									{...props}
									orders={activeOrders}
									inventory={this.props.inventory}
									handleOrderUpdates={this.handleOrderUpdates}
								/>
							)
						}}
					/>
				</Switch>
			</div>
		)
	}
}

OrderWrapper.propTypes = {
	match: PropType.object,
	location: PropType.object,
	type: PropType.string,
	query: PropType.object,
	handleUpdate: PropType.func,
	inventory: PropType.array
}

export default OrderWrapper
