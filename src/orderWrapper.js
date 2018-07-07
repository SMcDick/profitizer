import React from "react"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"

import Orders from "./orders"
import Order from "./order"
import Form from "./form"
import Filter from "./filter"

const OrderWrapper = props => {
	const { match, orders, inventory, source, handleUpdate } = props
	return (
		<div>
			<Switch>
				<Route
					exact
					path={match.url}
					render={props => {
						return (
							<Filter {...props} items={orders}>
								<Orders {...props} />
							</Filter>
						)
					}}
				/>
				<Route
					exact
					path={match.url + "/create"}
					render={props => {
						return (
							<section>
								<h1>Create a New Order</h1>
								<Form
									{...props}
									details={{ Marketplace: source || "Poshmark" }}
									inventory={inventory}
									create={true}
									handleUpdate={handleUpdate}
									orders={orders}
								/>
							</section>
						)
					}}
				/>
				<Route
					path={match.url + "/:id"}
					render={props => {
						return <Order {...props} orders={orders} inventory={inventory} handleUpdate={handleUpdate} />
					}}
				/>
			</Switch>
		</div>
	)
}

OrderWrapper.propTypes = {
	match: PropType.object,
	location: PropType.object,
	type: PropType.string,
	query: PropType.object,
	handleUpdate: PropType.func,
	inventory: PropType.array,
	orders: PropType.array,
	source: PropType.string
}

export default OrderWrapper
