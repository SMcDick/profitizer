import React, { Component } from "react"
import { object, func, oneOfType, string, number } from "prop-types"

import { fields, doNotUpdate } from "./formFields"
import ZipCode from "./zipCode"

import TaxRates from "../taxRates"
import Modal from "../modal"

import Form from "../form"
import util from "../utils"

class FormWrapper extends Component {
	constructor(props) {
		super(props)
		// TODO need a copy of array instead of mutating array
		let modFields = this.calculateFees(fields, props.details)

		this.state = {
			modFields,
			showModal: false
		}
	}
	calculateFees = (modFields, details) => {
		const sold = Number(details.Total_Sold_Price || 0)
		const taxes = Number(details.Tax_Collected || 0)
		const trx = modFields.find(field => field.name === "Transaction_Fee")
		const mkt = modFields.find(field => field.name === "Marketplace_Fee")
		let trxFee = "???"
		let mktFee = "???"
		let mktPlace = details.Marketplace ? details.Marketplace.toLowerCase() : ""
		if (mktPlace === "ebay") {
			trxFee = util.formatMoney(sold * 0.029 + 0.3)
			mktFee = util.formatMoney((sold - taxes) * 0.0915)
		} else if (mktPlace === "poshmark") {
			trxFee = "$0.00"
			mktFee = "$2.95"
			if (sold > 15) {
				mktFee = util.formatMoney(sold * 0.2)
			}
		}
		trx.label = `Transaction Fee (${trxFee})`
		mkt.label = `Marketplace Fee (${mktFee})`
		return modFields
	}
	updateCalculatedFields = (name, val) => {
		// This takes a key/value pair and modifies the state details
		// It calcuates default fees and estimated taxes without the need for a new request
		let { modFields } = this.state
		let { details, liftState } = this.props

		let update = {
			[name]: val
		}
		let sold = Number(details.Total_Sold_Price || 0)
		let rate = Number(details.Tax_Pct / 100 || 0)
		let collected = Number(details.Tax_Collected || 0)

		const updateLabels = () => {
			modFields = this.calculateFees(modFields, { ...details, ...update })
			return this.setState({ modFields })
		}

		if (name === "Total_Sold_Price") {
			sold = Number(val)
			updateLabels()
		}
		if (name === "Marketplace") {
			updateLabels()
		}
		if (name === "Tax_Collected") {
			collected = Number(val)
			updateLabels()
		}
		if (name === "Marketplace_Fee_Shipping" || name === "Marketplace_Fee_Base") {
			let ship = "Marketplace_Fee_Shipping"
			let base = "Marketplace_Fee_Base"
			let fee = Number(val) + Number(details[name === ship ? base : ship] || 0)
			update.Marketplace_Fee = fee.toFixed(2)
		}
		if (name === "Tax_County") {
			const county = TaxRates.find(rate => rate.name.toLowerCase() === val.toLowerCase())
			update.Tax_Pct = county ? county.value : 0
			rate = Number(update.Tax_Pct / 100)
		}
		if (name === "Tax_Pct") {
			rate = Number(val) / 100
		}
		if (name === "Tax_Collected") {
			collected = Number(val)
		}
		update.Tax_Calculated_Calc = (sold - collected) * rate
		liftState(update)
	}

	openModal = () => {
		this.setState({ showModal: true })
	}
	closeModal = () => {
		this.setState({ showModal: false })
	}

	render() {
		const { details, id, handleError } = this.props
		const { modFields } = this.state

		// TODO should i remove all of these fields from the api?
		for (const remove of doNotUpdate) {
			delete details[remove.name]
		}
		delete details.items
		return (
			<div>
				<Form
					fields={modFields}
					details={details}
					url="sales/"
					id={id}
					updateCalculatedFields={this.updateCalculatedFields}
					redirectTo="/orders"
					handleError={handleError}
				/>
				<button onClick={this.openModal} className="btn">
					Get County from Zip
				</button>
				{this.state.showModal && (
					<Modal
						body={
							<ZipCode
								updateCalculatedFields={this.updateCalculatedFields}
								closeModal={this.closeModal}
							/>
						}
						closeModal={this.closeModal}
					/>
				)}
			</div>
		)
	}
}

export default FormWrapper

FormWrapper.propTypes = {
	details: object,
	liftState: func,
	id: oneOfType([string, number]),
	handleError: func
}
