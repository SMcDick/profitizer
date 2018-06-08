import React, { Component } from "react"
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"
import axios from "axios"
import OrderWrapper from "./orderWrapper"
import InventoryWrapper from "./inventoryWrapper"

import { API_ROOT } from "./config"

class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inventory: [],
			orders: []
		}
		this.handleUpdate = val => this.setState(val)
	}
	componentDidMount() {
		axios.all([axios.get(API_ROOT + "sales/all"), axios.get(API_ROOT + "inventory/all")]).then(
			axios.spread((sales, inventory) => {
				this.setState({
					orders: sales.data.data,
					inventory: inventory.data.data
				})
			})
		)
	}
	render() {
		const { inventory, orders } = this.state
		const { handleUpdate } = this
		return (
			<Router>
				<div className="App width-wrapper">
					<ul className="flex-parent nav">
						<li className="flex-child nav__item">
							<NavLink to="/inventory">Inventory</NavLink>
						</li>
						<li className="flex-child nav__item">
							<NavLink to="/orders">Orders</NavLink>
						</li>
					</ul>
					<Route
						path="/inventory"
						render={props => {
							return <InventoryWrapper {...props} handleUpdate={handleUpdate} inventory={inventory} />
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
								/>
							)
						}}
					/>
				</div>
			</Router>
		)
	}
}

export default App
