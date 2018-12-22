import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"

import { Bar } from "react-chartjs-2"

import Loading from "../loading"
import RequestError from "../error"
import util from "../utils"

import { API_ROOT } from "../config"

class TopLeft extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			requestError: false
		}
	}
	componentDidMount() {
		this.fetchData(["last-180?groupby=month(sold_date)"])
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
				backgroundColor: label.color,
				pointRadius: 0,
				borderJoinStyle: "miter",
				pointHoverRadius: 5,
				pointHoverBackgroundColor: "rgba(75,192,192,1)",
				pointHoverBorderColor: "rgba(220,220,220,1)",
				pointHoverBorderWidth: 1,
				pointHitRadius: 5
			}
		})
	}

	lineChartOptions = {
		legend: {
			reverse: true
		},
		tooltips: {
			mode: "x",
			callbacks: {
				label: function(tooltipItem, data) {
					var label = data.datasets[tooltipItem.datasetIndex].label || ""

					if (label) {
						label += ": $"
					}
					label += (Math.round(tooltipItem.yLabel * 100) / 100).toFixed(0)
					return label
				}
			}
		},
		scales: {
			yAxes: [
				{
					gridLines: false
				}
			],
			xAxes: [
				{
					type: "time",
					time: {
						unit: "month"
					},
					gridLines: false
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
				{ name: "Profit", color: "rgba(63, 195, 128,0.9)" },
				{ name: "Return", color: "rgba(63, 195, 128,0.7)" }
			]
		}
		line.dataList = this.createDataList(line.labelArray)
		line.chartData = this.filterChartData(line.dataList, data[0], "Date")

		return <Bar data={line.chartData} options={chartOptions} />
	}
}

TopLeft.propTypes = {
	fields: PropType.array,
	url: PropType.string
}
TopLeft.defaultProps = {
	url: "reports/"
}

export default TopLeft
