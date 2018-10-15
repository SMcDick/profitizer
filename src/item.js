import React, { Component } from "react"
import PropType from "prop-types"
import Form from "./inventoryForm"
import { Link } from "react-router-dom"
import axios from "axios"

import { Grid } from "./grid"
import util from "./utils"
import { API_ROOT } from "./config"

const { func, array, string, number, oneOfType, object } = PropType

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
		const { handleUpdate } = this.props
		let totals = {
			sales: util.totaler(item.sales, "Total_Sold_Price"),
			return: util.totaler(item.sales, "Return_calc"),
			realizedProfit: util.totaler(item.sales, "Profit_calc"),
			fees: util.totaler(item.sales, "Transaction_Fee") + util.totaler(item.sales, "Marketplace_Fee"),
			ship: util.totaler(item.sales, "Shipping")
		}

		const totalFields = [
			{ name: "sales", heading: "Sales", format: "positiveMoney" },
			{ name: "fees", heading: "Fees", format: "negativeMoney" },
			{ name: "ship", heading: "Shipping", format: "negativeMoney" },
			{ name: "return", heading: "ROGS", format: "positiveMoney" },
			{ name: "cogs", heading: "COGS", format: "negativeMoney" },
			{ name: "realized", heading: "Realized", format: "positiveMoney" }
		]
		const lotFields = [
			{ name: "count", heading: "# of Sales" },
			{ name: "item_count", heading: "# of Items" },
			{ name: "return", heading: "Return", format: "positiveMoney" },
			{ name: "cost", heading: "Total Cost", format: "negativeMoney" },
			{ name: "overall", heading: "Overall", format: "positiveMoney" },
			{ name: "average", heading: "Profit/Item", format: "positiveMoney" },
			{ name: "perSale", heading: "Profit/Sale", format: "positiveMoney" }
		]
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
				cogs: item.Num_Sold * item.Unit_Cost * (1 + item.Tax / 100),
				count: item.sales.length,
				item_count: item.Num_Sold,
				perSale: totals.realizedProfit / item.sales.length
			}
		]
		const saleFields = [
			{ name: "order", heading: "#", width: 20 },
			{ name: "id", heading: "Order Id", width: 40 },
			{ name: "profit", heading: "Profit", format: "positiveMoney" },
			{ name: "date", heading: "Sold Date", format: "date" },
			{ name: "description", heading: "Description", mods: "desc", width: "60%" }
		]
		const saleData = item.sales.map((sale, idx) => {
			return {
				order: idx + 1,
				id: sale.Order_Id,
				profit: sale.Profit_calc,
				date: sale.Sold_Date,
				description: sale.Description
			}
		})
		const saleLink = { name: "orders", id: "id" }
		const saleAvailable = item.Num_Sold > 0
		return (
			<section>
				<h1>
					Item#: {item.Item_Id} &bull; {item.Item} &bull;
					<span className="negative-text">{util.formatMoney(item.Final_Cost)}</span>/each
				</h1>
				<Link to="/inventory">Back</Link>
				<Form details={item} handleUpdate={handleUpdate} />
				<br />
				{!saleAvailable && (
					<div className="item-wrapper">
						<strong>Total Cost: {util.formatMoney(item.Total_Cost)}</strong>
					</div>
				)}
				{saleAvailable && (
					<div className="item-wrapper">
						<h2>Sold Item Details</h2>
						<Grid
							className="total-table"
							fields={totalFields}
							data={totalData}
							fullHeight
							defaultColWidth={100}
						/>
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
				{saleAvailable && <Grid data={saleData} link={saleLink} fields={saleFields} fullHeight />}
			</section>
		)
	}
}
Item.propTypes = {
	id: oneOfType([string, number]),
	items: array,
	handleUpdate: func,
	match: object
}

export default Item
