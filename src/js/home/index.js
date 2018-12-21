import React from "react"
import { Link } from "react-router-dom"

import Dashboard from "../dashboard"

const Home = props => (
	<section>
		<div className="flex-parent__wrap flex-parent__center-both">
			<div className="pad10">
				<Link to="/orders/create" className="btn">
					Create an Order
				</Link>
			</div>
			<div className="pad10">
				<Link to="/orders/incomplete" className="btn">
					View Incomplete Orders
				</Link>
			</div>
			<div className="pad10">
				<Link to="/inventory" className="btn">
					View Inventory
				</Link>
			</div>
			<div className="pad10">
				<Link to="/inventory/create" className="btn">
					Add Inventory Item
				</Link>
			</div>
		</div>
		<Dashboard />
	</section>
)

export default Home
