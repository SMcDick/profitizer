import React, { Component } from "react"
import propTypes from "prop-types"
import { Link } from "react-router-dom"
import InventoryNav from "./inventoryNav"

class Inventory extends Component {
	render() {
		if (!this.props.inventory.length) {
			return (
				<div>
					<h1>Inventory</h1>
					<p>Loading...</p>
				</div>
			)
		}
		return (
			<div>
				<h1>
					{this.props.routerProps.match.path ===
					"/inventory/remaining"
						? "Remaining "
						: "All "}Inventory
				</h1>
				<InventoryNav routerProps={this.props.routerProps} />
				{this.props.pager}
				{this.props.inventory.map(item => {
					return (
						<div key={item.Item_Id} className="job">
							<Link to={"/inventory/" + item.Item_Id}>
								{item.Item}
							</Link>
						</div>
					)
				})}
			</div>
		)
	}
}
Inventory.propTypes = {
	inventory: propTypes.array,
	pager: propTypes.element,
	routerProps: propTypes.object
}

export default Inventory
