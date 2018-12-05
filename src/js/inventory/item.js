import React, { Component } from "react"
import { object } from "prop-types"
import { Link } from "react-router-dom"
import axios from "axios"

import { fields, doNotUpdate, totalFields, lotFields, saleFields } from "./itemFields"

import Form from "../form"
import Loading from "../loading"
import { Grid } from "../grid"
import Alert from "../alert"
import RequestError from "../error"

import util from "../utils"
import { API_ROOT } from "../config"

class Item extends Component {
	constructor(props) {
		super(props)
		this.state = {
			item: {},
			loading: true,
			requestError: false
		}
	}
	componentDidMount() {
		const { id } = this.props.match.params
		axios
			.get(API_ROOT + "inventory/" + id)
			.then(result => {
				this.setState({ item: result.data.data, loading: false, id })
			})
			.catch(err =>
				this.setState({ item: {}, loading: false, requestError: true, error: err.response.data.message })
			)
	}
	handleError = e => {
		this.setState({ error: e.response.data.message })
	}
	render() {
		const { item, id, loading, error, requestError } = this.state
		let details = { ...item }
		for (const remove of doNotUpdate) {
			delete details[remove.name]
		}
		delete details.sales
		if (loading) {
			return <Loading />
		}
		if (requestError) {
			return <RequestError>{error}</RequestError>
		}
		let totals = {
			sales: util.totaler(item.sales, "Total_Sold_Price"),
			return: util.totaler(item.sales, "Total_Return"),
			realizedProfit: util.totaler(item.sales, "Total_Profit"),
			fees: util.totaler(item.sales, "Transaction_Fee") + util.totaler(item.sales, "Marketplace_Fee"),
			ship: util.totaler(item.sales, "Shipping")
		}
		const totalData = [
			{
				sales: totals.sales,
				cost: item.Total_Cost,
				return: totals.return,
				realized: totals.realizedProfit,
				overall: totals.return - item.Total_Cost,
				average: totals.realizedProfit / item.Num_Sold,
				fees: totals.fees,
				ship: totals.ship,
				cogs: item.Num_Sold * item.Final_Cost,
				count: item.sales.length,
				item_count: item.Num_Sold,
				perSale: totals.realizedProfit / item.sales.length
			}
		]
		const saleData = item.sales.map((sale, idx) => {
			return {
				order: idx + 1,
				id: sale.Order_Id,
				profit: sale.Total_Profit,
				date: sale.Sold_Date,
				description: sale.Description
			}
		})
		const saleLink = { name: "orders", id: "id" }
		const saleAvailable = item.Num_Sold > 0
		return (
			<section>
				<Link to="/inventory">Back</Link>
				<h1>
					Item#: {item.Item_Id} &bull; {item.Item}
				</h1>
				{error && <Alert>{error}</Alert>}
				<p className="pad10 bold-text">
					<span>
						<span className="negative-text">{util.formatMoney(item.Final_Cost)}</span>/each |{" "}
					</span>
					<span> Sold: {item.Num_Sold} |</span>
					<span> Left: {item.Remaining}</span>
				</p>
				<Form
					fields={fields}
					details={details}
					url="inventory/"
					redirectTo="/inventory"
					id={id}
					handleError={this.handleError}
				/>
				<br />
				{!saleAvailable && (
					<div className="item-wrapper">
						<strong>Total Cost: {util.formatMoney(item.Total_Cost)}</strong>
					</div>
				)}
				{saleAvailable && (
					<div>
						<div className="item-wrapper">
							<h2>Sold Item Details</h2>
							<Grid
								className="total-table"
								fields={totalFields}
								data={totalData}
								fullHeight
								defaultColWidth={100}
							/>
							{item.Quantity > 1 && (
								<div>
									<h2>Lot Details</h2>
									<Grid
										className="total-table"
										fields={lotFields}
										data={totalData}
										fullHeight
										defaultColWidth={100}
									/>
								</div>
							)}
						</div>
						<Grid data={saleData} link={saleLink} fields={saleFields} fullHeight />
					</div>
				)}
			</section>
		)
	}
}
Item.propTypes = {
	match: object
}

export default Item
