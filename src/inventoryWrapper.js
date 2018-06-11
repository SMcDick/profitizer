import React, { Component } from "react"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Inventory from "./inventory"
import Item from "./item"
import Form from "./inventoryForm"

import util from "./utils"

class InventoryWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			query: util.queryParams(props.location.search),
			filters: {},
			search: ""
		}
	}
	static getDerivedStateFromProps(props) {
		let query = util.queryParams(props.location.search)
		return { query: query, filters: query.filters ? query.filters : {} }
	}

	componentWillUnmount() {
		console.log("inventory wrapper unmounted")
	}
	handleSearch = e => {
		e.preventDefault()
		const target = e.target
		const value = target.value
		this.setState({ search: value })
	}
	render() {
		console.log("inventory wrapper rendered")

		let activeInventory = this.props.inventory
		const { filters, search } = this.state
		const { match } = this.props
		if (filters.remaining === "true") {
			activeInventory = activeInventory.filter(inventory => inventory.Remaining > 0)
		}
		if (search.length) {
			activeInventory = activeInventory.filter(item => item.Item.toLowerCase().indexOf(search.toLowerCase()) > -1)
		}
		return (
			<div>
				<Switch>
					<Route
						exact
						path={match.url}
						render={props => {
							return <Inventory inventory={activeInventory} {...props} handleSearch={this.handleSearch} />
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
							return <Item inventory={this.props.inventory} {...props} />
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
