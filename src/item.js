import React, { Component } from "react"
import propTypes from "prop-types"
import Form from "./inventoryForm"
import { Link } from "react-router-dom"

class Item extends Component {
	constructor(props) {
		super(props)
		this.state = {
			item: {},
			loading: true
		}
	}
	static getDerivedStateFromProps(props) {
		let item = props.inventory.find(
			item =>
				item.Item_Id.toString() ===
				props.routerProps.match.params.id.toString()
		)
		let state = {
			edit: props.routerProps.location.pathname.indexOf("/edit") > -1
		}
		if (props.inventory.length) {
			state.loading = false
			if (item) {
				state.item = item
			}
		}
		return state
	}
	render() {
		if (this.state.loading) {
			return <div>Loading...</div>
		} else if (!this.state.item.hasOwnProperty("Item_Id")) {
			return (
				<div>
					{
						"Item not found. Figure our some way to make a new request or if item doesn't exist."
					}
				</div>
			)
		}
		return (
			<div>
				<h1>Item #: {this.state.item.Item_Id}</h1>
				<a href="#" onClick={this.props.routerProps.history.goBack}>
					Back
				</a>
				{!this.state.edit && (
					<Link
						to={
							"/inventory/" +
							this.props.routerProps.match.params.id +
							"/edit"
						}>
						Edit
					</Link>
				)}
				<Form
					details={this.state.item}
					edit={this.state.edit}
					api={this.props.api}
				/>
			</div>
		)
	}
}
Item.propTypes = {
	order: propTypes.object,
	onOrderChange: propTypes.func,
	id: propTypes.string || propTypes.number,
	routerProps: propTypes.object,
	api: propTypes.string,
	orders: propTypes.array,
	handleOrderUpdates: propTypes.func
}

export default Item
