import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"

import fields from "./gridFields"
import { fields as formFields } from "./formFields"

import Loading from "../loading"
import RequestError from "../error"
import { Grid } from "../grid"
import Modal from "../modal"
import Form from "../form"
import Alert from "../alert"

import { API_ROOT } from "../config"
import { requester } from "../utilities/apiUtils";

class Bugs extends Component {
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

		const url = API_ROOT + this.props.url + paramString + search
		requester({ url, method: 'GET' })
			.then(expenses => {
				this.setState({
					data: expenses.data,
					loading: false,
					requestError: false,
					submitError: false,
					id: undefined
				})
			})
			.catch(e => {
				console.error(e.response)
				this.setState({ requestError: true, loading: false })
			})
	}
	editItem = id => {
		const { data } = this.state
		const details = data.find(item => item.Id === id)
		this.setState({ showModal: true, details, id })
	}

	createItem = e => {
		e.preventDefault()
		// let { fields } = this.props
		const details = {}
		for (const key of fields) {
			details[key.name] = key.type === "number" ? 0 : key.type === "date" ? Moment().format("YYYY-MM-DD") : ""
		}
		// TODO This should probably be set up on the API side
		details.Completed = 0
		this.setState({ showModal: true, details })
	}

	closeModal = val => {
		let method = null
		if (val === "fetch") {
			method = this.fetchData()
		}
		this.setState({ showModal: false, details: {}, submitError: false, id: undefined }, method)
	}

	handleError = e => {
		this.setState({ submitError: e.response.data.message })
	}

	renderModal = () => {
		const { url } = this.props
		const { details, id, submitError } = this.state
		const body = (
			<div>
				{submitError && <Alert>{submitError}</Alert>}
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
		const { loading, requestError, showModal } = this.state

		if (loading) {
			return <Loading />
		}
		if (requestError) {
			return <RequestError />
		}
		return (
			<section>
				<div className="flex-parent__space-between">
					<h1>Bugs</h1>
					<div className="flex-parent__center">
						<button className="btn flex-child__auto" onClick={this.createItem}>
							Report Bug
						</button>
					</div>
				</div>
				<Grid fields={fields} {...this.state} clickHandler={this.editItem} />
				{showModal && this.renderModal()}
			</section>
		)
	}
}

Bugs.propTypes = {
	fields: PropType.array,
	url: PropType.string,
	textVal: PropType.string,
	match: PropType.object,
	totalField: PropType.string
}
Bugs.defaultProps = {
	url: "bugs/"
}

export default Bugs
