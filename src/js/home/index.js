import React from "react"
import { Link } from "react-router-dom"

const Home = () => (
	<section>
		<div className="padBot20 flex-parent__center-both">
			<Link to="/orders/create" className="btn">
				Create an Order
			</Link>
		</div>
		<div className="padBot20 flex-parent__center-both">
			<Link to="/orders/incomplete" className="btn">
				View Incomplete Orders
			</Link>
		</div>
		<div className="padBot20 flex-parent__center-both">
			<Link to="/inventory" className="btn">
				View Inventory
			</Link>
		</div>
		<div className="padBot20 flex-parent__center-both">
			<Link to="/inventory/create" className="btn">
				Add Inventory Item
			</Link>
		</div>
	</section>
)

export default Home
