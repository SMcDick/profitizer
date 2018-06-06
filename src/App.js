import React, { Component } from "react"
import { BrowserRouter as Router, Route, NavLink } from "react-router-dom"
import OrderWrapper from "./orderWrapper"
import InventoryWrapper from "./inventoryWrapper"

class App extends Component {
	render() {
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
					<Route path="/inventory" component={InventoryWrapper} />
					<Route path="/orders" component={OrderWrapper} />
				</div>
			</Router>
		)
	}
}

export default App
