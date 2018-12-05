import React, { Component } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { func, oneOfType, string, number, object } from "prop-types"

import FormWrapper from "./orderFormWrapper"
import Item from "./orderItems"

import Alert from "../alert"
import util from "../utils"
import { API_ROOT } from "../config"

class Order extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true
		}
	}
	componentDidMount() {
		this.fetchData()
	}
	fetchData = () => {
		const { id } = this.props.match.params
		axios
			.get(API_ROOT + "sales/" + id)
			.then(result => {
				const details = result.data.data
				const items = details.items
				const cogs = details.COGS
				this.setState({ details, items, cogs, loading: false, id })
			})
			.catch(e => {
				alert(e.response.data.message)
			})
	}
	liftState = val => {
		let details = { ...this.state.details, ...val }
		this.setState({ details })
	}
	calculateProfit = () => {
		const { details, cogs } = this.state
		const sold = Number(details.Total_Sold_Price)
		const fees = Number(details.Transaction_Fee) + Number(details.Marketplace_Fee)
		const ship = Number(details.Shipping)
		const tax = Number(details.Tax_Calculated_Calc)
		return util.formatMoney(sold - fees - ship - tax - cogs)
	}
	handleError = e => {
		this.setState({ error: e.response.data.message })
	}
	render() {
		const { details, id, items, cogs, loading, error } = this.state

		if (loading) {
			return <div>Loading...</div>
		}
		return (
			<section>
				<h1>
					Order#: {details.Order_Id} &bull; <span className="positive-text">{this.calculateProfit()}</span>
				</h1>
				<Link to="/orders">Back</Link>
				<section>
					{error && <Alert>{error}</Alert>}
					<FormWrapper details={details} liftState={this.liftState} id={id} handleError={this.handleError} />
					<Item items={items} cogs={cogs} id={id} fetchData={this.fetchData} />
				</section>
			</section>
		)
	}
}
Order.propTypes = {
	id: oneOfType([string, number]),
	match: object,
	handleUpdate: func
}

export default Order
