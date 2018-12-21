import React, { Component } from "react"
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom"

import Home from "./home"
import Inventory from "./inventory"
import Orders from "./orders"
import Taxes from "./taxes"

import ExpenseWrapper from "./expenses/expenseWrapper"
import RestaurantWrapper from "./expenses/restaurantWrapper"
import Bugs from "./bugs"
import Reports from "./reports"

import Nav from "./mainNav"

import util from "./utils"
import { API_ROOT } from "./config"

const NotFound = () => (
	<section>
		<h1>Page not found</h1>
	</section>
)

class App extends Component {
	render() {
		return (
			<Router>
				<div className="App width-wrapper">
					{process.env.NODE_ENV === "development" && <p>This is the dev site</p>}
					{console.log(`${util.capitalize(process.env.NODE_ENV)} build. API: ${API_ROOT}`)}
					<Nav />
					<Switch>
						<Route path="/" exact component={Home} />
						<Route path="/inventory" component={Inventory} />
						<Route path="/orders" component={Orders} />
						<Route path="/taxes/:month?" component={Taxes} />
						<Route path="/reports/:year?/:month?" component={Reports} />
						<Route path="/restaurants/:params*" component={RestaurantWrapper} />
						<Route path="/expenses/:params*" component={ExpenseWrapper} />
						<Route path="/Bugs/:params*" component={Bugs} />
						<Redirect from="/ebay" to="/orders/incomplete" />
						<Redirect from="/poshmark" to="/orders/incomplete" />
						<Redirect from="/paypal" to="/orders/incomplete" />
						<Route path="/*" component={NotFound} />
					</Switch>
				</div>
			</Router>
		)
	}
}

export default App
