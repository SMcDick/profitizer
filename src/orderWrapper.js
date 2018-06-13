import React, { Component } from "react"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Orders from "./orders"
import Order from "./order"
import Form from "./form"
import Filter from "./orderFilter"

import util from "./utils"

class OrderWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: util.queryParams(props.location.search),
			filters: {},
			search: ""
		}
		this.handleOrderUpdates = this.handleOrderUpdates.bind(this)
		this.debounceSearch = util.debounce(this.debounceSearch, 250)
	}
	debounceSearch(val) {
		this.setState(val)
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
		const search = target.value
		this.debounceSearch({ search })
	}
	componentWillUnmount() {
		// console.log("order wrapper unmounted")
	}
	render() {
		const { match, orders, inventory, source } = this.props
		const { filters, search } = this.state
		return (
			<div>
				<Switch>
					<Route
						exact
						path={match.url}
						render={props => {
							return (
								<Filter filters={filters} search={search} items={orders}>
									<Orders {...props} handleSearch={this.handleSearch} />
								</Filter>
							)
						}}
					/>
					<Route
						exact
						path={match.url + "/create"}
						render={props => {
							return (
								<section>
									<h1>Create a New Order</h1>
									<Form
										{...props}
										details={{ Marketplace: source || "Poshmark" }}
										inventory={inventory}
										create={true}
										handleOrderUpdates={this.props.handleUpdate}
									/>
								</section>
							)
						}}
					/>
					<Route
						path={match.url + "/:id"}
						render={props => {
							return (
								<Order
									{...props}
									orders={orders}
									inventory={inventory}
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
	inventory: PropType.array,
	orders: PropType.array,
	source: PropType.string
}

export default OrderWrapper
