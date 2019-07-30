import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"
import { NavLink, Redirect } from "react-router-dom"

import { fields } from "./gridFields"

import { Grid } from "../grid"
import Util from "../utils"
import { API_ROOT } from "../config"
import Loading from "../loading"
import Error from "../error"
import { requester } from "../utilities/apiUtils";

class Taxes extends Component {
	constructor(props) {
		super(props)
		this.state = {
			loading: true,
			error: false,
			redirect: false,
			data: []
		}
	}
	componentDidMount() {
		this.fetchData()
	}
	componentDidUpdate(prevProps) {
		if (prevProps.match.url !== this.props.match.url) {
			this.setState({ data: [], loading: true }, this.fetchData())
		}
	}
	fetchData() {
		let { month } = this.props.match.params
		if (month === undefined) {
			month = Moment().format("YYYY-MM")
		}
		const url = API_ROOT + "sales/month/" + month
		requester({ url, method: 'GET' })
			.then(result => {
				this.setState({ data: result.data, loading: false })
			})
			.catch(e => {
				console.error(e.response)
				this.setState({ error: true, loading: false })
			})
	}

	links() {
		const thisMonth = Moment().format("YYYY-MM")
		const lastMonth = Moment()
			.add(-1, "month")
			.format("YYYY-MM")
		const twoMonthsAgo = Moment()
			.add(-2, "month")
			.format("YYYY-MM")
		const links = [
			{ text: "This Month", url: "/taxes/" + thisMonth },
			{ text: "Last Month", url: "/taxes/" + lastMonth },
			{ text: "Two Months Ago", url: "/taxes/" + twoMonthsAgo }
		]
		return links.map(link => {
			return (
				<NavLink key={link.url} to={link.url} className="btn">
					{link.text}
				</NavLink>
			)
		})
	}
	filterOrdersByCounty(data) {
		// TODO create an endpoint that does some (all?) of this for me
		let filteredOrders = data.filter(order => order.Tax_Calculated_Calc > 0)
		let counties = [...new Set(filteredOrders.map(order => order.Tax_County))].sort()
		let totals = counties.reduce(
			(totals, county) => {
				const countyOrders = filteredOrders.filter(order => order.Tax_County === county)
				const sales = Util.totaler(countyOrders, "Total_Sold_Price")
				const collected = Util.totaler(countyOrders, "Tax_Collected")
				const taxableAmount = sales - collected

				totals.Counties.push({
					name: county,
					taxableAmount: taxableAmount,
					collected: collected,
					due: Util.totaler(countyOrders, "Tax_Calculated_Calc"),
					orders: countyOrders.map(order => {
						return {
							id: order.Order_Id,
							url: "/orders/" + order.Order_Id
						}
					})
				})
				totals.Taxable += taxableAmount
				totals.Collected += collected
				return totals
			},
			{ Counties: [], Taxable: 0, Collected: 0 }
		)

		return totals
	}

	render() {
		const { loading, error, data } = this.state
		const { match } = this.props
		if (loading) {
			return <Loading />
		}
		if (error) {
			return <Error />
		}
		if (match.params.month === undefined) {
			return <Redirect to={"/taxes/" + Moment().format("YYYY-MM")} />
		}
		const month = Moment(match.params.month)

		let totals = this.filterOrdersByCounty(data)

		return (
			<section>
				<h1>{month.format("MMMM YYYY")} Sales Tax</h1>

				<div className="btn-group padBot20">{this.links()}</div>
				<Grid fields={fields} data={totals.Counties} fullHeight />
				<p>
					<strong>Total Taxable Amount: {Util.formatMoney(totals.Taxable)}</strong>
				</p>
				<p>
					<strong>Total Tax Collected: {Util.formatMoney(totals.Collected)}</strong>
				</p>
			</section>
		)
	}
}

Taxes.propTypes = {
	match: PropType.object
}

export default Taxes
