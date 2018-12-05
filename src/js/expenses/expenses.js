import React, { Component } from "react"
import { string, object, array } from "prop-types"
import Moment from "moment"
import axios from "axios"

import Loading from "../loading"
import RequestError from "../error"
import { Grid } from "../grid"
import Modal from "../modal"
import Form from "../form"
import Alert from "../alert"

import Util from "../utils"
import { API_ROOT } from "../config"

class Expenses extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			requestError: false,
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
		let { params } = this.props.match.params
		const { search } = this.props.location

		let paramString = params ? `${params}` : ""

		axios
			.get(API_ROOT + this.props.url + paramString + search)
			.then(expenses => {
				this.setState({
					data: expenses.data.data,
					loading: false,
					error: false
				})
			})
			.catch(err => {
				console.error(err.response)
				this.setState({ requestError: true, loading: false, error: err.response.data.message })
			})
	}
	editItem = id => {
		const { data } = this.state
		const details = data.find(item => item.Id === id)
		this.setState({ showModal: true, details, id })
	}

	createExpense = e => {
		e.preventDefault()
		let { formFields } = this.props
		const details = {}
		for (const key of formFields) {
			details[key.name] = key.type === "number" ? 0 : key.type === "date" ? Moment().format("YYYY-MM-DD") : ""
		}
		this.setState({ showModal: true, details })
	}

	closeModal = val => {
		let method = null
		if (val === "fetch") {
			method = this.fetchData()
		}
		this.setState({ showModal: false, details: {} }, method)
	}
	handleError = err => this.setState({ error: err.response.data.message })

	renderModal = () => {
		const { formFields, url } = this.props
		const { details, id, error } = this.state
		const body = (
			<div>
				{error && <Alert>{error}</Alert>}
				<Form
					fields={formFields}
					details={details}
					url={url}
					closeModal={this.closeModal}
					id={id}
					handleError={this.handleError}
				/>
			</div>
		)

		return <Modal body={body} closeModal={this.closeModal} />
	}

	render() {
		const { loading, requestError, data, showModal, error } = this.state
		const { gridFields, textVal, totalField } = this.props

		if (loading) {
			return <Loading />
		}
		if (requestError) {
			return <RequestError>{error}</RequestError>
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
				<Grid fields={gridFields} {...this.state} clickHandler={this.editItem} />
				{showModal && this.renderModal()}
			</section>
		)
	}
}

Expenses.propTypes = {
	formFields: array,
	gridFields: array,
	url: string,
	textVal: string,
	match: object,
	totalField: string
}

export default Expenses
