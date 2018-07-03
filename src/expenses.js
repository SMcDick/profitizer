import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"
import axios from "axios"

import Loading from "./loading"
import RequestError from "./error"
import { Grid, GridRow, GridHeader, GridItem } from "./grid"
import Input from "./input"
import Util from "./utils"
import { API_ROOT } from "./config"

class Expenses extends Component {
	constructor(props) {
		super(props)
		this.state = {
			expenses: [],
			loading: true,
			error: false,
			edit: 0,
			create: 0,
			details: {}
		}
	}
	componentDidMount() {
		this.fetchData()
	}
	componentDidUpdate(prevProps) {
		if (prevProps.match.path !== this.props.match.path) {
			this.setState({ expenses: [] }, this.fetchData())
		}
	}
	fetchData() {
		axios
			.get(API_ROOT + this.props.urls.getAll)
			.then(expenses => {
				this.setState({
					expenses: expenses.data.data,
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
		// TODO also figure out how to disable edit when creating new item
		const { expenses, edit, details } = this.state
		const newDetails = expenses.find(item => item.Id === id)
		const prevDetails = expenses.find(item => item.Id === edit)
		if (edit !== 0 && id !== edit && details !== prevDetails) {
			const confirm = window.confirm("Do you want to save the changes?")
			if (confirm) {
				return this.handleSubmit()
			}
		}

		// TODO Allow continuation after successful save
		this.setState({ edit: id, details: newDetails })
	}

	handleInputChange = event => {
		const target = event.target
		const value =
			target.type === "checkbox" ? target.checked : target.type === "number" ? Number(target.value) : target.value
		const name = target.name
		if (name === "") {
			return
		}
		const details = { ...this.state.details }
		details[name] = value
		this.setState({ details })
	}
	handleEnter = e => {
		if (e.key === "Enter") {
			this.handleSubmit(e)
		}
	}

	handleSubmit = e => {
		if (e) {
			e.preventDefault()
		}
		let { create } = this.state
		let { urls } = this.props
		let details = { ...this.state.details }
		let url = API_ROOT + urls.getOne + details.Id
		let method = "post"
		if (create) {
			url = API_ROOT + urls.create
			method = "post"
			delete details.Id
		}

		axios[method](url, details)
			.then(() => {
				this.setState({ edit: 0, details: {}, create: 0 }, this.fetchData())
			})
			.catch(err => {
				console.log(err.response)
			})
	}
	cancel = e => {
		e.stopPropagation()
		let expenses = [...this.state.expenses]
		if (this.state.create) {
			expenses.shift()
		}
		this.setState({ edit: 0, details: {}, create: 0, expenses })
	}
	createExpense = e => {
		e.preventDefault()
		let expenses = [...this.state.expenses]
		let { fields } = this.props
		const details = {}
		for (const key of fields) {
			details[key.name] = key.type === "number" ? 0 : key.type === "date" ? Moment().format("YYYY-MM-DD") : ""
		}
		details.Id = "new"
		expenses.unshift(details)
		this.setState({ create: "new", details, expenses })
	}
	displayFields(val, type) {
		if (type === "date") {
			return Moment(val).format("M/D/YYYY")
		}
		if (type === "number") {
			return Util.formatMoney(val)
		}
		return val
	}

	render() {
		const { expenses, loading, error, create, edit, details } = this.state
		const { fields, textVal } = this.props

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
					{create !== "new" &&
						edit === 0 && (
							<div className="flex-parent__center">
								<button className="btn flex-child__auto" onClick={this.createExpense}>
									Create Expense
								</button>
							</div>
						)}
				</div>
				<Grid>
					<GridHeader classes="col-5">
						{fields.length > 0 &&
							fields.map(field => {
								return <GridItem key={field.name}>{field.name}</GridItem>
							})}
					</GridHeader>
					{expenses.length > 0 &&
						expenses.map(expense => {
							const active = edit === expense.Id || create === expense.Id
							const editing = edit !== 0 || create !== 0
							let dimmer = editing ? " dimmer" : ""
							if (active) {
								dimmer = " active"
							}
							return (
								<GridRow
									classes={"col-5" + dimmer}
									key={expense.Id}
									onClick={e => this.editItem(expense.Id)}>
									{fields.length > 0 &&
										fields.map(field => {
											let item = this.displayFields(expense[field.name], field.type)
											if (active) {
												item = (
													<Input
														type={field.type ? field.type : "number"}
														value={details[field.name].toString()}
														onChange={this.handleInputChange}
														name={field.name}
														onKeyPress={this.handleEnter}
													/>
												)
											}
											return <GridItem key={field.name}>{item}</GridItem>
										})}
									{active && (
										<div className="inline-input-btns">
											<span className="btn btn--accent" onClick={this.cancel}>
												Cancel
											</span>
											<span className="btn btn--positive" onClick={this.handleSubmit}>
												Save
											</span>
										</div>
									)}
								</GridRow>
							)
						})}
					{expenses.length === 0 && (
						<GridRow>
							<GridItem classes="item__detail--full">No {textVal.toLowerCase()} expenses</GridItem>
						</GridRow>
					)}
				</Grid>
			</section>
		)
	}
}

Expenses.propTypes = {
	fields: PropType.array,
	urls: PropType.object,
	textVal: PropType.string,
	match: PropType.object
}

export default Expenses
