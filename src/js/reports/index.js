import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"

import fields from "./gridFields"

import Chart from "./charts"

import Loading from "../loading"
import RequestError from "../error"
import { Grid } from "../grid"
import util from "../utils"

import { API_ROOT } from "../config"

class Reports extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			requestError: false
		}
	}
	componentDidMount() {
		this.fetchData()
	}
	componentDidUpdate(prevProps) {
		if (prevProps.match.path !== this.props.match.path) {
			this.setState({ data: [] }, this.fetchData())
		}
	}
	fetchData() {
		let { year, month } = this.props.match.params
		const { search } = this.props.location

		let paramString = ""
		if (year) {
			paramString = "/" + year
		}
		if (month) {
			paramString += "/" + month
		}

		axios
			.get(API_ROOT + this.props.url + paramString + search)
			.then(expenses => {
				const data = util.sortBy(expenses.data.data, null, [{ name: "Sold_Date", desc: true }])
				this.setState({
					data,
					loading: false,
					requestError: false
				})
			})
			.catch(e => {
				console.error(e.response)
				this.setState({ requestError: true, loading: false })
			})
	}

	render() {
		const { loading, requestError, data } = this.state

		if (loading) {
			return <Loading />
		}
		if (requestError) {
			return <RequestError />
		}
		// TODO Move this out of render and play with colors
		// Also, add in dynamic show/hide datasets
		let labelArray = ["Fees", "Shipping", "COGS", "Profit", "Sales"]
		let dataList = labelArray.map(label => {
			return {
				label,
				data: [],
				borderColor: "rgba(180,0,0,0.5)",
				borderWidth: 1,
				backgroundColor: "rgba(0,0,0,0.3)"
			}
		})
		let chartData = util.sortBy(data, null, [{ name: "Sold_Date" }]).reduce(
			(obj, datum) => {
				let labels = [...obj.labels, datum["Sold_Date"]]
				let datasets = dataList.map((dataset, idx) => {
					if (dataset.label === "Sales") {
						dataset.backgroundColor = "green"
					}
					if (dataset.label === "COGS") {
						dataset.backgroundColor = "red"
					}
					if (dataset.label === "Profit") {
						dataset.backgroundColor = "rgba(0,155,0,0.5)"
					}
					dataset.data = [...obj.datasets[idx].data, datum[dataset.label]]
					return dataset
				})
				return { labels, datasets }
			},
			{ labels: [], datasets: dataList }
		)
		return (
			<section>
				<h1>Sales Report</h1>
				<Chart chartData={chartData} />
				<Grid fields={fields} {...this.state} />
			</section>
		)
	}
}

Reports.propTypes = {
	fields: PropType.array,
	url: PropType.string
}
Reports.defaultProps = {
	url: "reports/"
}

export default Reports
