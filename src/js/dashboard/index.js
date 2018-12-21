import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"

import { Line, Doughnut, Pie, Bar } from "react-chartjs-2"

import Loading from "../loading"
import RequestError from "../error"
import util from "../utils"

import { API_ROOT } from "../config"

class Dashboard extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			requestError: false
		}
	}
	componentDidMount() {
		this.fetchData(["2018", "last-30", "last-30?marketplace=ebay", "last-30?marketplace=poshmark"])
	}
	fetchData(paramStrings) {
		const requests = paramStrings.map(string => {
			return axios.get(API_ROOT + this.props.url + string)
		})
		axios
			.all(requests)
			.then(
				axios.spread((...results) => {
					let data = results.map(res => res.data.data)
					this.setState({
						data,
						loading: false,
						requestError: false
					})
				})
			)
			.catch(e => {
				console.error(e.response)
				this.setState({ requestError: true, loading: false })
			})
	}

	filterChartData(dataList, data, label) {
		return util.sortBy(data, null, [{ name: label }]).reduce(
			(obj, datum) => {
				let labels = [...obj.labels, datum[label]]
				let datasets = dataList.map((dataset, idx) => {
					dataset.data = [...obj.datasets[idx].data, datum[dataset.label]]
					return dataset
				})
				return { labels, datasets }
			},
			{ labels: [], datasets: dataList }
		)
	}
	createDataList(labelArray) {
		return labelArray.map(label => {
			return {
				label: label.name,
				data: [],
				borderColor: label.border ? label.border : "rgba(0,0,0,0.5)",
				borderWidth: label.width ? label.width : 1,
				backgroundColor: label.color
			}
		})
	}

	lineChartOptions = {
		tooltips: {
			mode: "x"
		},
		legend: {
			reverse: true
		},
		scales: {
			yAxes: [
				{
					stacked: true
				}
			]
		}
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
		let chartOptions = this.lineChartOptions

		let line = {
			labelArray: [
				{ name: "Profit", color: "rgba(63, 195, 128,0.7)" },
				{ name: "Return", color: "rgba(63, 195, 128,0.7)" }
			]
		}
		line.dataList = this.createDataList(line.labelArray)
		line.chartData = this.filterChartData(line.dataList, data[0], "Gross Sales")

		let doughnut = {
			labelArray: [{ name: "eBay", color: "rgb(0, 80, 157)" }, { name: "Poshmark", color: "rgb(130, 36, 48)" }]
		}
		doughnut.dataList = this.createDataList(doughnut.labelArray)

		let ebayTotal = data[2].reduce((total, day) => total + day["Gross Sales"], 0)
		let poshTotal = data[3].reduce((total, day) => total + day["Gross Sales"], 0)
		let totals = doughnut.dataList.map(list => {
			if (list.label === "eBay") {
				list.value = ebayTotal
			}
			if (list.label === "Poshmark") {
				list.value = poshTotal
			}
			return list
		})

		let dData = totals.reduce(
			(obj, item) => {
				let labels = [...obj.labels, item.label]
				let datasets = obj.datasets
				if (!obj.datasets.length) {
					datasets.push({
						data: [item.value],
						backgroundColor: [item.backgroundColor],
						borderColor: [item.borderColor],
						borderWidth: [item.borderWidth]
					})
				} else {
					datasets[0].data.push(item.value)
					datasets[0].backgroundColor.push(item.backgroundColor)
					datasets[0].borderColor.push(item.borderColor)
					datasets[0].borderWidth.push(item.borderWidth)
				}

				return { labels, datasets: datasets }
			},
			{ labels: [], datasets: [] }
		)

		doughnut.chartData = dData

		return (
			<section>
				<h1>Sales Report</h1>
				<div className="flex-parent pad10">
					<div className="pad10 flex-child__50">
						<Line data={line.chartData} options={chartOptions} />
					</div>
					<div className="pad10 flex-child__50">
						<Doughnut data={doughnut.chartData} options={{}} />
					</div>
				</div>
				{/*

					<div className="flex-parent pad10">
						<div className="pad10 flex-child__50">
							<Bar data={chartData} options={{}} />
						</div>
						<div className="pad10 flex-child__50">
							<Pie data={chartData} options={{}} />
						</div>
					</div>

					*/}
			</section>
		)
	}
}

Dashboard.propTypes = {
	fields: PropType.array,
	url: PropType.string
}
Dashboard.defaultProps = {
	url: "reports/"
}

export default Dashboard
