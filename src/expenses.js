import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"
import axios from "axios"

import Loading from "./loading"
import RequestError from "./error"
import { Grid } from "./grid"
import Input from "./input"
import Util from "./utils"
import { API_ROOT } from "./config"

class Expenses extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			error: false,
			showModal: false,
			details: {}
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
		axios
			.get(API_ROOT + this.props.urls.getAll)
			.then(expenses => {
				this.setState({
					data: expenses.data.data,
					loading: false,
					error: false
				})
			})
			.catch(e => {
				console.error(e.response)
				this.setState({ error: true, loading: false })
			})
	}
	editItem = id => {
		const { data } = this.state
		const details = data.find(item => item.Id === id)
		this.setState({ showModal: true, details })
	}
	handleInputChange = event => {
		const target = event.target
		const value = target.type === "checkbox" ? target.checked : target.value
		const name = target.name
		if (name === "") {
			return
		}
		const details = { ...this.state.details }
		details[name] = value
		this.setState({ details })
	}
	handleSubmit = e => {
		if (e) {
			e.preventDefault()
		}
		let { urls } = this.props
		let details = { ...this.state.details }
		let url = API_ROOT + urls.getOne + details.Id
		let method = "post"

		if (!details.Id) {
			url = API_ROOT + urls.create
			method = "post"
		}

		axios[method](url, details)
			.then(() => {
				this.setState({ showModal: false, details: {} }, this.fetchData())
			})
			.catch(err => {
				console.log(err.response)
				// TODO handle error on submit
			})
	}
	cancel = e => {
		e.stopPropagation()
		this.setState({ showModal: false, details: {} })
	}
	createExpense = e => {
		e.preventDefault()
		let { fields } = this.props
		const details = {}
		for (const key of fields) {
			details[key.name] = key.type === "number" ? 0 : key.type === "date" ? Moment().format("YYYY-MM-DD") : ""
		}
		this.setState({ showModal: true, details })
	}
	validate = val => {
		const target = val.target
		const { details } = this.state
		let { name, type, value, step } = target
		if (type === "number") {
			details[name] = Number(value).toFixed(step === "1" ? 0 : 2)
			this.setState({ details })
		}
	}
	focus = val => {
		const target = val.target
		const { details } = this.state
		let { name, type, value } = target
		if (type === "number") {
			details[name] = Number(value)
			this.setState({ details })
		}
	}
	inputBuilder = (field, value) => {
		return (
			<Input
				type={field.type ? field.type : "number"}
				value={value.toString()}
				onChange={this.handleInputChange}
				onFocus={this.focus}
				onBlur={this.validate}
				name={field.name}
				label={field.heading ? field.heading : field.name}
			/>
		)
	}

	render() {
		const { loading, error, data } = this.state
		const { fields, textVal, totalField } = this.props

		if (loading) {
			return <Loading />
		}
		if (error) {
			return <RequestError />
		}
		return (
			<section>
				<div className="flex-parent__space-between">
					<h1>{textVal} Expenses</h1>
					<div className="flex-parent__center">
						<button className="btn flex-child__auto" onClick={this.createExpense}>
							Create Expense
						</button>
					</div>
				</div>
				<div>
					<strong>Total:</strong> {Util.formatMoney(Util.totaler(data, totalField))}
				</div>
				<Grid
					fields={fields}
					{...this.state}
					clickHandler={this.editItem}
					modalInputs={this.inputBuilder}
					submit={this.handleSubmit}
					cancel={this.cancel}
				/>
			</section>
		)
	}
}

Expenses.propTypes = {
	fields: PropType.array,
	urls: PropType.object,
	textVal: PropType.string,
	match: PropType.object,
	totalField: PropType.string
}

export default Expenses
