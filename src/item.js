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
		axios.get(API_ROOT + "/item/" + this.props.match.params.id).then(result => {
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
				<a href="#" onClick={this.props.history.goBack}>
					Back
				</a>
				<Form details={this.state.item} />

				<div className="item-wrapper item__grid">
					<div className="item__row item__row--header">
						<span className="item__detail item__detail--date">Cost</span>
						<span className="item__detail item__detail--date">Sales</span>
						<span className="item__detail item__detail--date">Return</span>
						<span className="item__detail item__detail--date">Realized Profit</span>
						<span className="item__detail item__detail--date">Overall Profit</span>
						<span className="item__detail item__detail--date">Avg Profit per Item Sold</span>
					</div>
					<div className="item__row item__row--header">
						<span className="item__detail item__detail--date">{util.formatMoney(item.Total_Cost)}</span>
						<span className="item__detail positive-text item__detail--date">
							{util.formatMoney(totals.sales)}
						</span>
						<span className="item__detail item__detail--date">{util.formatMoney(totals.return)}</span>
						<span className="item__detail positive-text item__detail--date">
							{util.formatMoney(totals.realizedProfit)}
						</span>
						<span className="item__detail positive-text item__detail--date">
							{util.formatMoney(totals.overallProfit)}
						</span>
						<span className="item__detail positive-text item__detail--date">
							{util.formatMoney(totals.averagePerItem)}
						</span>
					</div>
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
	items: propTypes.array
}

export default Item
