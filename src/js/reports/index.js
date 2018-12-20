import React, { Component } from "react"
import PropType from "prop-types"
import axios from "axios"

import fields from "./gridFields"

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
		const { loading, requestError } = this.state

		if (loading) {
			return <Loading />
		}
		if (requestError) {
			return <RequestError />
		}
		return (
			<section>
				<h1>Sales Report</h1>
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
