import React, { Component } from "react"
import { object, string } from "prop-types"
import axios from "axios"

import OrderFilters from "./orderFilters"
import OrderNav from "./orderNav"
import { fields, totalFields } from "./gridFields"

import Loading from "../loading"
import RequestError from "../error"
import Input from "../input"
import { Grid } from "../grid"

import util from "../utils"
import { API_ROOT } from "../config"

class Orders extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			error: false,
			details: {},
			search: ""
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
		let { params } = this.props.match.params
		const { search } = this.props.location

		const filter = OrderFilters.find(filter => util.dashify(filter.name) === params)
		if (filter) {
			params = filter.url
		}
		let paramString = params ? `/${params}` : ""
		axios
			.get(API_ROOT + "sales" + paramString + search)
			.then(sales => {
				const data = sales.data.data
				this.setState({
					data,
					loading: false,
					error: false
				})
			})
			.catch(e => {
				console.error(e.response)
				this.setState({ error: true, loading: false })
			})
	}
	handleSearch = e => {
		const target = e.target
		const val = target.value
		this.setState({ search: val })
	}
	render() {
		const { loading, error, search, data } = this.state

		const link = {
			name: "orders",
			id: "Order_Id"
		}

		// TODO revisit search because it might be super laggy
		let filteredData = [...data]
		if( search.length > 0){
			filteredData = data.filter( order => order.Description.toLowerCase().indexOf( search.toLowerCase() ) > -1 )
		}
		filteredData.map( (item,idx) => {
			item.order = idx + 1
			return item
		})

		let totals = [
			{
				sales: util.totaler(filteredData, "Total_Sold_Price"),
				return: util.totaler(filteredData, "Total_Return"),
				profit: util.totaler(filteredData, "Total_Profit"),
				cost: util.totaler(filteredData, "COGS"),
				fees: util.totaler(filteredData, "Marketplace_Fee") + util.totaler(data, "Transaction_Fee"),
				ship: util.totaler(filteredData, "Shipping"),
				tax: util.totaler(filteredData, "Tax_Calculated_Calc")
			}
		]

		const searchOptions = {type:"text", name:"Search", placeholder:"Search", className:"search__wrapper", value: search}

		if (loading) {
			return <Loading />
		}
		if (error) {
			return <RequestError />
		}
		// TODO handle empty and/or limited row grids
		return (
			<section>
				<div>
					<h1>New Orders</h1>
					<OrderNav />
				</div>
				<Input options={searchOptions} onChange={this.handleSearch} />
				<Grid
					className="item-wrapper total-table"
					fields={totalFields}
					data={totals}
					fullHeight
					defaultColWidth={100}
				/>
				<Grid fields={fields} data={filteredData} link={link} />
			</section>
		)
	}
}

Orders.propTypes = {
	match: object,
	search: string
}

export default Orders
