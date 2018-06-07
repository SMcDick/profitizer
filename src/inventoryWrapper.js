import React, { Component } from "react"
import axios from "axios"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Inventory from "./inventory"
import Item from "./item"
import Form from "./inventoryForm"

import { API_ROOT } from "./config"

class InventoryWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inventory: [],
			filter: {},
			search: ""
		}
	}
	static getDerivedStateFromProps(props) {
		let type = props.location.pathname.indexOf("inventory/all") > -1 ? "remaining" : "all"
		return { type: type + props.location.search }
	}
	componentDidMount() {
		console.log("inventory wrapper mounted (Post initial render)")
		axios.get(API_ROOT + "inventory/all").then(result => {
			this.setState({
				inventory: result.data.data
			})
		})
	}
	// shouldComponentUpdate(nextProps, nextState) {
	// 	if (this.state.type !== nextState.type) {
	// 		this.getSales(nextState.type)
	// 	}
	// 	return true
	// }
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
		let activeInventory = this.state.inventory
		const { filter, search } = this.state
		// if (filter.type) {
		// 	activeInventory = activeInventory.filter(order => order.Completed === 0)
		// }
		if (search.length) {
			activeInventory = activeInventory.filter(
				item => item.Description.toLowerCase().indexOf(search.toLowerCase()) > -1
			)
		}
		return (
			<div>
				<Switch>
					<Route
						exact
						path={this.props.match.url}
						render={props => {
							return (
								<Inventory
									inventory={activeInventory}
									routerProps={props}
									handleSearch={this.handleSearch}
								/>
							)
						}}
					/>
					<Route
						exact
						path={this.props.match.url + "/create"}
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
										routerProps={props}
										create={true}
									/>
								</div>
							)
						}}
					/>
					<Route
						path={this.props.match.url + "/:id"}
						render={props => {
							return <Item inventory={this.state.inventory} routerProps={props} />
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
	type: PropType.string
}

export default InventoryWrapper
