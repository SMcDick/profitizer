import React, { Component } from "react"
import propTypes from "prop-types"
import Form from "./inventoryForm"
import { Link } from "react-router-dom"
import axios from "axios"

import util from "./utils"
import { API_ROOT } from "./config"

class Item extends Component {
	constructor(props) {
		super(props)
		this.state = {
			item: {},
			loading: true
		}
	}
	componentDidMount() {
		axios.get(API_ROOT + "/item/" + this.props.routerProps.match.params.id).then(result => {
			this.setState({ item: result.data.data, loading: false })
		})
	}
	render() {
		if (this.state.loading) {
			return <div>Loading...</div>
		} else if (!this.state.item.hasOwnProperty("Item_Id")) {
			return <div>{"Item not found. Figure our some way to make a new request or if item doesn't exist."}</div>
		}

		const { item } = this.state
		let totals = {
			sales: util.totaler(item.sales, "Total_Sold_Price"),
			return: util.totaler(item.sales, "Return_calc"),
			realizedProfit: util.totaler(item.sales, "Profit_calc")
		}
		totals.overallProfit = totals.return - item.Total_Cost
		totals.averagePerItem = totals.realizedProfit / item.Num_Sold
		return (
			<section>
				<h1>Item#: {this.state.item.Item_Id}</h1>
				<a href="#" onClick={this.props.routerProps.history.goBack}>
					Back
				</a>
				<Form details={this.state.item} />
				<div className="pad10">
					Details:<br />
					Total Cost: {util.formatMoney(item.Total_Cost)}
					<br />
					Total Sales: {util.formatMoney(totals.sales)}
					<br />
					Total Return: {util.formatMoney(totals.return)}
					<br />
					Realized Profit: {util.formatMoney(totals.realizedProfit)}
					<br />
					Overall Profit: {util.formatMoney(totals.overallProfit)}
					<br />
					Average Profit per Item sold: {util.formatMoney(totals.averagePerItem)}
				</div>
				<div className="item-wrapper item__grid">
					<div className="item__row item__row--header">
						<span className="item__detail">Order Id</span>
						<span className="item__detail">Profit</span>
						<span className="item__detail item__detail--date">Sold Date</span>
						<span className="item__detail item__detail--desc">Description</span>
					</div>
					{this.state.item.sales.map(sale => {
						return (
							<Link to={"/orders/" + sale.Order_Id} key={sale.Order_Id} className="item__row">
								<span className="item__detail">#{sale.Order_Id}</span>
								<span className="item__detail">${sale.Profit_calc.toFixed(2)}</span>
								<span className="item__detail item__detail--date">{sale.Sold_Date}</span>
								<span className="item__detail item__detail--desc">{sale.Description}</span>
							</Link>
						)
					})}
				</div>
			</section>
		)
	}
}
Item.propTypes = {
	id: propTypes.string || propTypes.number,
	routerProps: propTypes.object,
	items: propTypes.array
}

export default Item
