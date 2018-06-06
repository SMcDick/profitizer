import React, { Component } from "react"
import axios from "axios"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Orders from "./orders"
import Order from "./order"
import Form from "./form"
import Pager from "./pager"

import { API_ROOT } from "./config"

class OrderWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			orders: [],
			meta: {},
			searchFired: false,
			searchData: [],
			origOrders: []
		}
		this.handleOrderUpdates = this.handleOrderUpdates.bind(this)
	}
	static getDerivedStateFromProps(props) {
		let type = props.location.pathname.indexOf("orders/all") > -1 ? "all" : "incomplete"
		return { type: type + props.location.search }
	}
	getSales(type) {
		let url = API_ROOT + "sales/" + type
		axios.get(url).then(result => {
			this.setState({
				orders: result.data.data,
				origOrders: result.data.data,
				meta: result.data.meta
			})
		})
	}
	componentDidMount() {
		console.log("order wrapper mounted (Post initial render)")
		this.getSales(this.state.type)
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (this.state.type !== nextState.type) {
			this.getSales(nextState.type)
		}
		return true
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
		const { searchData } = this.state
		if (!value) {
			this.setState(prevState => {
				return { orders: prevState.origOrders }
			})
			return
		}
		if (!this.state.searchFired) {
			this.setState({ searchFired: true })
			axios.get(API_ROOT + "/sales/year/2018").then(results => {
				this.setState({ searchData: results.data.data }, () => {
					let orders = searchData.filter(
						item => item.Description.toLowerCase().indexOf(value.toLowerCase()) > -1
					)
					this.setState({ orders: orders })
				})
			})
		} else if (searchData) {
			let orders = searchData.filter(item => item.Description.toLowerCase().indexOf(value.toLowerCase()) > -1)
			this.setState({ orders: orders })
		}
	}
	componentWillUnmount() {
		console.log("order wrapper unmounted")
	}
	render() {
		console.log("order wrapper rendered")
		return (
			<div>
				<Switch>
					<Route
						exact
						path={this.props.match.url}
						render={props => {
							return (
								<Orders
									orders={this.state.orders}
									routerProps={props}
									handleSearch={this.handleSearch}
								/>
							)
						}}
					/>
					<Route
						exact
						path={this.props.match.url + "/all"}
						render={props => {
							return (
								<Orders orders={this.state.orders} routerProps={props}>
									<Pager meta={this.state.meta} />
								</Orders>
							)
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
										edit={true}
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
									orders={this.state.orders}
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
