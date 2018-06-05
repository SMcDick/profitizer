import React, { Component } from "react"
import axios from "axios"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Pager from "./pager"
import Inventory from "./inventory"
import Item from "./item"
import Form from "./inventoryForm"

class InventoryWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			inventory: [],
			meta: {}
		}
	}
	static getDerivedStateFromProps(props) {
		let type =
			props.location.pathname.indexOf("inventory/remaining") > -1
				? "remaining"
				: "all"
		return { type: type + props.location.search }
	}
	getSales(type) {
		let url = "http://localhost:7555/api/inventory/" + type
		axios.get(url).then(result => {
			this.setState({
				inventory: result.data.data,
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
								<Inventory
									inventory={this.state.inventory}
									routerProps={props}
								/>
							)
						}}
					/>
					<Route
						exact
						path={this.props.match.url + "/all"}
						render={props => {
							return (
								<Inventory
									inventory={this.state.inventory}
									routerProps={props}
									pager={
										<Pager
											meta={this.state.meta}
											routerProps={props}
										/>
									}
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
										api={"http://localhost:7555/api/"}
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
							return (
								<Item
									inventory={this.state.inventory}
									routerProps={props}
									api={"http://localhost:7555/api/"}
								/>
							)
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
