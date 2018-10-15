import React from "react"
import PropType from "prop-types"
import { Route, Switch } from "react-router-dom"
import Inventory from "./inventory"
import Item from "./item"
import Form from "./inventoryForm"

import Filter from "./filter"

const { func, object, string, array } = PropType

const InventoryWrapper = props => {
	const { match, inventory, handleUpdate } = props
	// TODO mixing props passed to InventoryWrapper with props passed to render function of Route
	// Revisit eventually
	return (
		<div>
			<Switch>
				<Route
					exact
					path={match.url}
					render={props => {
						return (
							<Filter {...props} items={inventory}>
								<Inventory {...props} />
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
								<h1>Create a New Inventory Item</h1>
								<Form
									details={{
										Quantity: 1,
										Tax: 0,
										Num_Sold: 0
									}}
									edit={true}
									{...props}
									create={true}
									handleUpdate={handleUpdate}
								/>
							</section>
						)
					}}
				/>
				<Route
					path={match.url + "/:id"}
					render={props => {
						return <Item inventory={inventory} {...props} handleUpdate={handleUpdate} />
					}}
				/>
			</Switch>
		</div>
	)
}

InventoryWrapper.propTypes = {
	match: object,
	location: object,
	type: string,
	inventory: array,
	handleUpdate: func
}

export default InventoryWrapper
