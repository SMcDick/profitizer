import React, { Component } from "react"
import propTypes from "prop-types"
import { Link } from "react-router-dom"
import InventoryNav from "./inventoryNav"
import Input from "./input"

class Inventory extends Component {
	render() {
		const { inventory, handleSearch } = this.props
		return (
			<section>
				<h1>Inventory</h1>
				<InventoryNav {...this.props} />
				<Input type="text" name="Search" onChange={handleSearch} label="Search" className="search__wrapper" />
				<div className="item__grid">
					<div className="item__row item__row--header">
						<span className="item__detail item__detail--desc">Item</span>
						<span className="item__detail item__detail--minor">Quantity</span>
						<span className="item__detail">Sold</span>
						<span className="item__detail">Remaining</span>
						<span className="item__detail item__detail--minor">Cost</span>
					</div>
					{inventory.map(item => {
						return (
							<Link to={"/inventory/" + item.Item_Id} key={item.Item_Id} className="item__row">
								<span className="item__detail item__detail--desc">{item.Item}</span>
								<span className="item__detail item__detail--minor">{item.Quantity}</span>
								<span className="item__detail item__detail">{item.Num_Sold}</span>
								<span className="item__detail">{item.Remaining}</span>
								<span className="item__detail item__detail--minor">${item.Final_Cost.toFixed(2)}</span>
							</Link>
						)
					})}
					{!inventory.length && <div>No results</div>}
				</div>
			</section>
		)
	}
}
Inventory.propTypes = {
	inventory: propTypes.array,
	pager: propTypes.element,
	handleSearch: propTypes.func
}

export default Inventory
