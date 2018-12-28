import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"
import Moment from "moment"

import { Line } from "react-chartjs-2"

import Loading from "../loading"
import RequestError from "../error"

import { API_ROOT } from "../config"

class TopLeft extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			requestError: false,
			period: 180,
			periodUnit: "days",
			lookback: 1,
			lookbackUnit: "years"
		}
	}
	componentDidMount() {
		const { period, periodUnit, lookback, lookbackUnit } = this.state
		const formatDate = date => {
			return date.format("YYYY-MM-DD")
		}
		const curStart = formatDate(Moment().subtract(period, periodUnit))
		const curEnd = formatDate(Moment())
		const lbStart = formatDate(Moment(curStart).subtract(lookback, lookbackUnit))
		const lbEnd = formatDate(Moment().subtract(lookback, lookbackUnit))
		// TODO figure out why some weeks start on Saturday and some dont
		// Its because Im getting the max Display_Date. Figure out how to do that better
		const formatUrl = (start, end) => `range/${start}/${end}?groupby=Week(Sold_Date)`

		this.fetchData([formatUrl(curStart, curEnd), formatUrl(lbStart, lbEnd)])
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

	createDataList(labelArray, datasets) {
		return labelArray.reduce(
			(obj, label) => {
				let dataset = {
					label: label.name,
					data: datasets[label.index],
					borderColor: label.border ? label.border : "rgba(0,0,0,0.5)",
					borderWidth: label.width ? label.width : 1,
					backgroundColor: label.color,
					// pointRadius: 0,
					pointRadius: 3,
					borderJoinStyle: "miter",
					pointHoverRadius: 5,
					// pointHoverBackgroundColor: "rgba(75,192,192,1)",
					pointHoverBorderColor: "rgba(220,220,220,1)",
					pointHoverBorderWidth: 1
					// pointHitRadius: 5
				}
				return { datasets: [...obj.datasets, dataset] }
			},
			{ labels: [], datasets: [] }
		)
	}

	lineChartOptions = {
		tooltips: {
			mode: "x",
			backgroundColor: "white",
			titleFontColor: "#333",
			callbacks: {
				label: function(tooltipItem, data) {
					var label = data.datasets[tooltipItem.datasetIndex].label || ""
					if (label) {
						label += ": $"
					}
					label += (Math.round(tooltipItem.yLabel * 100) / 100).toFixed(0)
					return label
				},
				title: function(tooltipItem, data) {
					return ["Week of ", Moment(tooltipItem[0].xLabel).format("ddd MM/DD/YY")]
				},
				labelTextColor: function(tooltipItem, chart) {
					return "#543453"
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
						unit: "week",
						displayFormats: {
							week: "M/D"
						}
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
				{ name: "Current", color: "rgba(63, 195, 128,0.9)", index: 0 },
				{ name: "Past", color: "rgba(163, 95, 128,0.7)", index: 1 }
			]
		}
		let current = data[0].map(item => {
			return {
				y: item["Net Sales"],
				x: item["Date"]
			}
		})
		let past = data[1].map(item => {
			return {
				y: item["Net Sales"],
				x: Moment(item["Date"]).add(this.state.lookback, this.state.lookbackUnit)
			}
		})
		// TODO this is getting the labels for the first dataset as the date. Labels should be more clear.
		// Need to account for dates without data because labels become misaligned due do being displayed by array index
		line.chartData = this.createDataList(line.labelArray, [current, past])

		return <Line data={line.chartData} options={chartOptions} />
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
