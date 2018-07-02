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

class Restaurants extends Component {
	constructor(props) {
		super(props)
		this.state = {
			restaurants: [],
			loading: true,
			error: false,
			edit: 0,
			create: 0,
			details: {}
		}
		this.fields = [
			{ name: "Date", type: "date", display: val => Moment(val).format("M/D/YYYY") },
			{ name: "Restaurant", type: "text", display: val => val },
			{ name: "Amount", display: val => Util.formatMoney(val) },
			{ name: "Tip", display: val => Util.formatMoney(val) },
			{ name: "Total", display: val => Util.formatMoney(val) }
		]
	}
	componentDidMount() {
		this.fetchData()
	}
	fetchData() {
		axios
			.get(API_ROOT + "restaurants/all")
			.then(restaurants => {
				this.setState({
					restaurants: restaurants.data.data,
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
		const { restaurants, edit, details } = this.state
		const newDetails = restaurants.find(rest => rest.Id === id)
		const prevDetails = restaurants.find(rest => rest.Id === edit)
		if (edit !== 0 && id !== edit && details !== prevDetails) {
			const confirm = window.confirm("do you want to save the changes?")
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

	handleSubmit(e) {
		if (e) {
			e.preventDefault()
		}
		let { create } = this.state
		let details = { ...this.state.details }
		let url = API_ROOT + "restaurant/" + details.Id
		let method = "post"
		if (create) {
			url = API_ROOT + "createRestaurant"
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
	createRestaurant = e => {
		e.preventDefault()
		let restaurants = [...this.state.restaurants]
		const details = {
			Amount: 0,
			Date: Moment().format("YYYY-MM-DD"),
			Restaurant: "",
			Tip: 0,
			Total: 0,
			Id: "new"
		}
		restaurants.unshift(details)
		this.setState({ create: "new", details, restaurants })
	}

	render() {
		const { restaurants, loading, error, create, edit, details } = this.state
		if (loading) {
			return <Loading />
		}
		if (error) {
			return <RequestError />
		}
		return (
			<section>
				<div className="flex-parent__space-between">
					<h1>Restaurant Expenses</h1>
					{create !== "new" && (
						<div className="flex-parent__center">
							<button className="btn flex-child__auto" onClick={this.createRestaurant}>
								Create Expense
							</button>
						</div>
					)}
				</div>
				<Grid>
					<GridHeader classes="col-5">
						{this.fields.map(field => {
							return <GridItem key={field.name}>{field.name}</GridItem>
						})}
					</GridHeader>
					{restaurants.length > 0 &&
						restaurants.map(restaurant => {
							return (
								<GridRow
									classes="col-5"
									key={restaurant.Id}
									onClick={e => this.editItem(restaurant.Id)}>
									{this.fields.map(field => {
										let item = field.display(restaurant[field.name])
										if (edit === restaurant.Id || create === restaurant.Id) {
											item = (
												<Input
													type={field.type ? field.type : "number"}
													value={details[field.name].toString()}
													onChange={this.handleInputChange}
													name={field.name}
													onKeyPress={this.handleEnter}
													onBlur={this.onBlur}
												/>
											)
										}
										return <GridItem key={field.name}>{item}</GridItem>
									})}
								</GridRow>
							)
						})}
					{restaurants.length === 0 && (
						<GridRow>
							<GridItem classes="item__detail--full">No restaurants expenses</GridItem>
						</GridRow>
					)}
				</Grid>
			</section>
		)
	}
}

Restaurants.propTypes = {
	match: PropType.object
}

export default Restaurants
