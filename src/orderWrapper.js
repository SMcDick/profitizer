import React, { Component } from "react"
import axios from "axios"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Orders from "./orders"
import Order from "./order"
import Form from "./form"

import { API_ROOT } from "./config"

class OrderWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			orders: [],
			filter: {},
			search: ""
		}
		this.handleOrderUpdates = this.handleOrderUpdates.bind(this)
	}
	static getDerivedStateFromProps(props) {
		let type = props.location.pathname.indexOf("orders/incomplete") > -1 ? "incomplete" : null
		return { filter: { type: type } }
	}
	componentDidMount() {
		console.log("order wrapper mounted (Post initial render)")
		axios.get(API_ROOT + "sales/all").then(result => {
			let data = result.data.data
			this.setState({
				orders: data
			})
		})
	}
	handleOrderUpdates(val) {
		this.setState(prevState => {
			let orders = [...prevState.orders]
			let current = orders.find(order => order.Order_Id === val.Order_Id)
			if (current) {
				if (val.Completed) {
					orders.splice(orders.indexOf(current), 1)
				} else {
					Object.assign(current, val)
				}
			} else {
				if (!val.Completed) {
					orders.unshift(val)
				}
			}
			orders.sort((a, b) => {
				return a.Date_Sold - b.Date_Sold
			})
			return { orders: orders }
		})
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
		let activeOrders = this.state.orders
		const { filter, search } = this.state
		if (filter.type) {
			activeOrders = activeOrders.filter(order => order.Completed === 0)
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
						path={this.props.match.url}
						render={props => {
							return <Orders orders={activeOrders} routerProps={props} handleSearch={this.handleSearch} />
						}}
					/>
					<Route
						exact
						path={this.props.match.url + "/incomplete"}
						render={props => {
							return <Orders orders={activeOrders} routerProps={props} handleSearch={this.handleSearch} />
						}}
					/>
					<Route
						exact
						path={this.props.match.url + "/create"}
						render={props => {
							return (
								<div>
									<h1>Create a New Order</h1>
									<Form
										details={{ Marketplace: "Poshmark" }}
										routerProps={props}
										create={true}
										handleOrderUpdates={this.handleOrderUpdates}
									/>
								</div>
							)
						}}
					/>
					<Route
						path={this.props.match.url + "/:id"}
						render={props => {
							return (
								<Order
									orders={activeOrders}
									routerProps={props}
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
	type: PropType.string
}

export default OrderWrapper
