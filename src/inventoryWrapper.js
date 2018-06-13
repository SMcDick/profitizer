import React, { Component } from "react"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Inventory from "./inventory"
import Item from "./item"
import Form from "./inventoryForm"

import Filter from "./filter"

// import util from "./utils"

class InventoryWrapper extends Component {
	constructor(props) {
		super(props)
	}
	componentWillUnmount() {
		console.log("inventory wrapper unmounted")
	}
	render() {
		console.log("inventory wrapper rendered")
		const { match, inventory } = this.props
		return (
			<div>
				<Switch>
					<Route
						exact
						path={match.url}
						render={props => {
							return (
								<Filter {...props} items={inventory}>
									<Inventory {...props} />
								</Filter>
							)
						}}
					/>
					<Route
						exact
						path={match.url + "/create"}
						render={props => {
							return (
								<div>
									<h1>Create a New Inventory Item</h1>
									<Form
										details={{
											Quantity: 1,
											Tax: 0,
											Num_Sold: 0
										}}
										edit={true}
										{...props}
										create={true}
									/>
								</div>
							)
						}}
					/>
					<Route
						path={match.url + "/:id"}
						render={props => {
							return <Item inventory={inventory} {...props} />
						}}
					/>
				</Switch>
			</div>
		)
	}
}

InventoryWrapper.propTypes = {
	match: PropType.object,
	location: PropType.object,
	type: PropType.string,
	inventory: PropType.array
}

export default InventoryWrapper
