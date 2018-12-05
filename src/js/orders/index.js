import React from "react"
import { object } from "prop-types"
import { Route, Switch } from "react-router-dom"

import Orders from "./orders"
import Create from "./create"
import Order from "./order"

const OrderWrapper = props => {
	const { match } = props
	return (
		<div>
			<Switch>
				<Route path={match.url + "/:id(\\d+)"} component={Order} />
				<Route path={match.url + "/create"} component={Create} />
				<Route path={match.url + "/:params*"} component={Orders} />
			</Switch>
		</div>
	)
}

OrderWrapper.propTypes = {
	match: object
}

export default OrderWrapper
