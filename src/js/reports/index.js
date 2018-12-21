import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"

import fields from "./gridFields"

import { Line } from "react-chartjs-2"

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
		let labelArray = [
			{ name: "Profit", color: "rgba(63, 195, 128,0.7)" },
			{ name: "Return", color: "rgba(63, 195, 128,0.7)" }
			// { name: "COGS", color: "rgba(241, 241, 103, 0.7)" },
			// { name: "Shipping", color: "rgba(103, 132, 241, 0.5)" },
			// { name: "Total Fees", color: "rgba(241, 132, 103, 0.5)", border: "green", width: 2 }
		]
		let dataList = labelArray.map(label => {
			return {
				label: label.name,
				data: [],
				borderColor: label.border ? label.border : "rgba(0,0,0,0.5)",
				borderWidth: label.width ? label.width : 1,
				backgroundColor: label.color
			}
		})
		let chartData = util.sortBy(data, null, [{ name: "Date" }]).reduce(
			(obj, datum) => {
				let labels = [...obj.labels, datum["Date"]]
				let datasets = dataList.map((dataset, idx) => {
					dataset.data = [...obj.datasets[idx].data, datum[dataset.label]]
					return dataset
				})
				return { labels, datasets }
			},
			{ labels: [], datasets: dataList }
		)
		let chartOptions = {
			tooltips: {
				mode: "x"
			},
			legend: {
				reverse: true
			},
			scales: {
				xAxes: [
					{
						scaleLabel: {
							display: true,
							labelString: "Month"
						},
						stacked: true
					}
				],
				yAxes: [
					{
						stacked: true,
						scaleLabel: {
							display: true,
							labelString: "Value"
						}
					}
				]
			}
		}
		return (
			<section>
				<h1>Sales Report</h1>
				<Line data={chartData} options={chartOptions} />
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
