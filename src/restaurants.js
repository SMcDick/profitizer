import React, { Component } from "react"
import PropType from "prop-types"
import Moment from "moment"
import { Link } from "react-router-dom"
import axios from "axios"

import Loading from "./loading"
import RequestError from "./error"
import { Grid, GridRow, GridHeader, GridItem } from "./grid"
import Util from "./utils"
import { API_ROOT } from "./config"

class Restaurants extends Component {
	constructor(props) {
		super(props)
		this.state = {
			restaurants: [],
			loading: true,
			error: false
		}
	}
	componentDidMount() {
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

	render() {
		const { restaurants, loading, error } = this.state
		const { match } = this.props
		if (loading) {
			return <Loading />
		}
		if (error) {
			return <RequestError />
		}
		if (match.params.id) {
			let restaurant = restaurants.find(rest => rest.Id.toString() === match.params.id)
			return (
				<section>
					<h1>Restaurant Expense Details</h1>
					<Grid>
						<GridHeader classes="col-5">
							<GridItem>Date</GridItem>
							<GridItem>Restaurant</GridItem>
							<GridItem>Amount</GridItem>
							<GridItem>Tip</GridItem>
							<GridItem>Total</GridItem>
						</GridHeader>
						<GridRow classes="col-5">
							<GridItem>{Moment(restaurant.Date).format("M/D/YYYY")}</GridItem>
							<GridItem>{restaurant.Restaurant}</GridItem>
							<GridItem>{Util.formatMoney(restaurant.Amount)}</GridItem>
							<GridItem>{Util.formatMoney(restaurant.Tip)}</GridItem>
							<GridItem>{Util.formatMoney(restaurant.Total)}</GridItem>
						</GridRow>
					</Grid>
				</section>
			)
		}
		return (
			<section>
				<h1>Restaurant Expenses</h1>
				<Grid>
					<GridHeader classes="col-5">
						<GridItem>Date</GridItem>
						<GridItem>Restaurant</GridItem>
						<GridItem>Amount</GridItem>
						<GridItem>Tip</GridItem>
						<GridItem>Total</GridItem>
					</GridHeader>
					{restaurants.length > 0 &&
						restaurants.map(restaurant => {
							return (
								<Link to={"/restaurants/" + restaurant.Id} key={restaurant.Id}>
									<GridRow classes="col-5">
										<GridItem>{Moment(restaurant.Date).format("M/D/YYYY")}</GridItem>
										<GridItem>{restaurant.Restaurant}</GridItem>
										<GridItem>{Util.formatMoney(restaurant.Amount)}</GridItem>
										<GridItem>{Util.formatMoney(restaurant.Tip)}</GridItem>
										<GridItem>{Util.formatMoney(restaurant.Total)}</GridItem>
									</GridRow>
								</Link>
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
