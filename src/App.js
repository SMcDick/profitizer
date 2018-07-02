import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, NavLink, Link, Redirect } from "react-router-dom"
import axios from "axios"
import OrderWrapper from "./orderWrapper"
import InventoryWrapper from "./inventoryWrapper"
import Taxes from "./taxes"
import Restaurants from "./restaurants"
import RequestError from "./error"
import Loading from "./loading"

import { API_ROOT } from "./config"

const Home = () => {
	return (
		<section>
			<div className="padBot20 flex-parent__center-both">
				<Link to="/orders/create" className="btn">
					Create an Order
				</Link>
			</div>
			<div className="padBot20 flex-parent__center-both">
				<Link to="/orders?filters={incomplete:true}" className="btn">
					View Incomplete Orders
				</Link>
			</div>
			<div className="padBot20 flex-parent__center-both">
				<Link to="/inventory" className="btn">
					View Inventory
				</Link>
			</div>
			<div className="padBot20 flex-parent__center-both">
				<Link to="/inventory/create" className="btn">
					Add Inventory Item
				</Link>
			</div>
		</section>
	)
}
const NotFound = () => {
	return (
		<section>
			<h1>Page not found</h1>
		</section>
	)
}

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inventory: [],
			orders: [],
			loading: true,
			error: false
		}
		this.handleUpdate = val => this.setState(val)
	}
	componentDidMount() {
		this.fetchData()
	}
	fetchData = () => {
		axios
			.all([axios.get(API_ROOT + "sales/all"), axios.get(API_ROOT + "inventory/all")])
			.then(
				axios.spread((sales, inventory) => {
					this.setState({
						orders: sales.data.data,
						inventory: inventory.data.data,
						loading: false,
						error: false
					})
				})
			)
			.catch(e => {
				console.error(e.response)
				this.setState({ error: true, loading: false })
			})
	}
	refreshData = e => {
		e.preventDefault()
		this.setState({ loading: true, error: false }, this.fetchData())
	}
	render() {
		const { inventory, orders, loading, error } = this.state
		const { handleUpdate } = this
		return (
			<Router>
				<div className="App width-wrapper">
					<ul className="flex-parent nav">
						<li className="flex-child nav__item">
							<NavLink exact to="/">
								Home
							</NavLink>
						</li>
						<li className="flex-child nav__item">
							<NavLink to="/inventory">Inventory</NavLink>
						</li>
						<li className="flex-child nav__item">
							<NavLink to="/orders">Orders</NavLink>
						</li>
						<li className="flex-child nav__item">
							<NavLink to="/taxes">Taxes</NavLink>
						</li>
						<li className="flex-child nav__item">
							<NavLink to="/expenses">Expenses</NavLink>
						</li>
						<li className="flex-child nav__item">
							<NavLink to="/restaurants">Restaurants</NavLink>
						</li>
						<li className="flex-child nav__item">
							<a href="/" onClick={this.refreshData}>
								Refresh
							</a>
						</li>
					</ul>
					<Switch>
						{loading && <Route path="/" component={Loading} />}
						{error && <Route path="/" component={RequestError} />}
						<Route path="/" exact component={Home} />
						<Route
							path="/inventory"
							render={props => {
								return (
									<InventoryWrapper
										{...props}
										handleUpdate={handleUpdate}
										inventory={inventory}
										source={this.source}
									/>
								)
							}}
						/>
						<Route
							path="/orders"
							render={props => {
								return (
									<OrderWrapper
										{...props}
										handleUpdate={handleUpdate}
										orders={orders}
										inventory={inventory}
										source={this.source}
									/>
								)
							}}
						/>
						<Route
							path="/taxes/:month?"
							render={props => {
								return <Taxes {...props} orders={orders} />
							}}
						/>
						<Route
							path="/restaurants"
							exact
							render={props => {
								return <Restaurants {...props} />
							}}
						/>
						<Route
							path="/ebay"
							render={() => {
								this.source = "eBay"
								return <Redirect to="/" />
							}}
						/>
						<Route
							path="/poshmark"
							render={() => {
								this.source = "Poshmark"
								return <Redirect to="/" />
							}}
						/>
						<Route
							path="/paypal"
							render={() => {
								return <Redirect to="/orders?filters={incomplete:true}" />
							}}
						/>
						<Route path="/*" component={NotFound} />
					</Switch>
				</div>
			</Router>
		)
	}
}

export default App
