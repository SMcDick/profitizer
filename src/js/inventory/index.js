import React from "react"
import { object } from "prop-types"
import { Route, Switch } from "react-router-dom"

import Item from "./item"
import Create from "./create"
import Inventory from "./inventory"

const InventoryWrapper = props => {
	const { match } = props
	return (
		<Switch>
			<Route path={match.url + "/:id(\\d+)"} component={Item} />
			<Route path={match.url + "/create"} component={Create} />
			<Route path={match.url + "/:params*"} component={Inventory} />
		</Switch>
	)
}

InventoryWrapper.propTypes = {
	match: object
}

export default InventoryWrapper
