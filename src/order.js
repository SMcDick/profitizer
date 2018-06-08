import React, { Component } from "react"
import propTypes from "prop-types"
import Form from "./form"
import axios from "axios"

import { API_ROOT } from "./config"

class Order extends Component {
	constructor(props) {
		super(props)
		this.state = {
			order: {},
			loading: true
		}
	}
	componentDidMount() {
		axios.get(API_ROOT + "/sale/" + this.props.match.params.id).then(result => {
			this.setState({ order: result.data.data, loading: false })
		})
	}
	render() {
		const { order } = this.state
		if (this.state.loading) {
			return <div>Loading...</div>
		} else if (!order.hasOwnProperty("Order_Id")) {
			return <div>{"Order not found. Figure our some way to make a new request or if order doesn't exist."}</div>
		}
		return (
			<section>
				<h1>Order#: {order.Order_Id}</h1>
				<a href="#" onClick={this.props.history.goBack}>
					Back
				</a>
				<Form details={order} handleOrderUpdates={this.props.handleOrderUpdates} />
			</section>
		)
	}
}
Order.propTypes = {
	onOrderChange: propTypes.func,
	id: propTypes.string || propTypes.number,
	match: propTypes.object,
	history: propTypes.object,
	orders: propTypes.array,
	handleOrderUpdates: propTypes.func
}

export default Order
