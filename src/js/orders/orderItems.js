import React, { Component } from "react"
import { array, number, oneOfType, string, func } from "prop-types"

import AddItem from "./modal_addItem"
import UpdateItem from "./modal_updateItem"

import Modal from "../modal"
import Util from "../utils"

class Item extends Component {
	constructor() {
		super()
		this.state = {}
	}
	getFormInfo = items => {
		const formInfo = items.reduce(
			(obj, item) => {
				let qtyField = {
					name: `Item_${item.Item_Id}_Quantity`,
					label: `${item.Item} Quantity`,
					int: true,
					className: "short pad10"
				}
				obj.fields = [...obj.fields, qtyField]
				obj.details = {
					...obj.details,
					[`Item_${item.Item_Id}`]: item.Item_Id,
					[`Item_${item.Item_Id}_Quantity`]: item.Quantity
				}
				return obj
			},
			{ fields: [], details: {} }
		)
		return formInfo
	}
	openUpdateModal = () => {
		const { items, id } = this.props
		const formInfo = this.getFormInfo(items)
		const body = (
			<UpdateItem
				details={formInfo.details}
				fields={formInfo.fields}
				url="orders/"
				id={id}
				closeModal={this.closeModal}
			/>
		)
		this.setState({ showModal: true, modal: this.buildModal(body, "Update Quantities") })
	}
	openAddModal = () => {
		const body = <AddItem id={this.props.id} closeModal={this.closeModal} />
		this.setState({ showModal: true, modal: this.buildModal(body, "Add Items") })
	}
	closeModal = val => {
		let method = null
		if (val === "fetch") {
			method = this.props.fetchData()
		}
		this.setState({ showModal: false, modal: null }, method)
	}
	buildModal = (body, title) => {
		return <Modal body={body} title={title} closeModal={this.closeModal} minHeight={400} />
	}
	render() {
		const { items, cogs } = this.props
		const { showModal, modal } = this.state
		return (
			<div className="item-wrapper">
				<h2>Item Details</h2>
				<p className="negative-text padBot20">
					<strong>Total Cost: {Util.formatMoney(cogs)}</strong>
				</p>
				<button className="btn" style={{ marginRight: 20 }} onClick={this.openUpdateModal}>
					Change Quantities
				</button>
				<button className="btn margin10" onClick={this.openAddModal}>
					Add Items
				</button>
				<div className="flex-parent__wrap">
					{items.map(item => {
						return (
							<div key={item.Item_Id} className="pad10">
								<strong>{item.Item}</strong>
								<br />
								Quantity: {item.Quantity}
								<br />
								Unit Cost: {Util.formatMoney(item.Final_Cost)}
								<br />
								Subtotal: {Util.formatMoney(item.Subtotal)}
							</div>
						)
					})}
				</div>
				{showModal && modal}
			</div>
		)
	}
}

export default Item

Item.propTypes = {
	items: array,
	cogs: number,
	id: oneOfType([string, number]),
	fetchData: func
}
