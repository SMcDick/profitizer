import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"

import { Doughnut } from "react-chartjs-2"

import Loading from "../loading"
import RequestError from "../error"
import util from "../utils"

import { API_ROOT } from "../config"

class TopRight extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			requestError: false
		}
	}
	componentDidMount() {
		this.fetchData(["2018?marketplace=ebay", "2018?marketplace=poshmark"])
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

		let doughnut = {
			labelArray: [
				{ name: "eBay", color: "rgba(0, 80, 157, 0.9)" },
				{ name: "Poshmark", color: "rgba(130, 36, 48, 0.9)" }
			]
		}
		doughnut.dataList = this.createDataList(doughnut.labelArray)

		let ebayTotal = data[0].reduce((total, day) => total + day["Gross Sales"], 0)
		let poshTotal = data[1].reduce((total, day) => total + day["Gross Sales"], 0)
		let totals = doughnut.dataList.map(list => {
			if (list.label === "eBay") {
				list.data = ebayTotal
			}
			if (list.label === "Poshmark") {
				list.data = poshTotal
			}
			return list
		})

		let dData = totals.reduce(
			(obj, item) => {
				let labels = [...obj.labels, item.label]
				let datasets = obj.datasets
				for (const key in item) {
					if (key !== "label") {
						datasets[0][key].push(item[key])
					}
				}
				return { labels, datasets: datasets }
			},
			{ labels: [], datasets: [{ data: [], backgroundColor: [], borderColor: [], borderWidth: [] }] }
		)

		doughnut.chartData = dData
		doughnut.chartOptions = {
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						let index = tooltipItem.index
						let label = " "
						label += data.labels[index]
						label += " Sales:"

						return label
					},
					afterLabel: function(tooltipItem, data) {
						let index = tooltipItem.index
						let val = data.datasets[0].data[index]
						let total = data.datasets[0].data.reduce((tot, item) => tot + item, 0)
						let label = "$" + val.toFixed(2)
						label += " (" + ((val / total) * 100).toFixed(2) + "%)"
						return label
					}
				},
				bodyFontSize: 14
			},
			legend: {},
			scales: {},
			title: {
				display: true,
				text: "Gross Sales by Platform"
			}
		}

		return <Doughnut data={doughnut.chartData} options={doughnut.chartOptions} />
	}
}

TopRight.propTypes = {
	fields: PropType.array,
	url: PropType.string
}
TopRight.defaultProps = {
	url: "reports/"
}

export default TopRight
