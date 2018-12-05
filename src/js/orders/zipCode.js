import React, { Component } from "react"
import axios from "axios"
import { func } from "prop-types"

import Input from "../input"

class ZipCode extends Component {
	constructor() {
		super()
		this.state = {
			zip: "",
			loading: false
		}
	}
	handleInputChange = event => {
		const target = event.target
		const value = target.value
		const name = target.name
		if (name === "") {
			return
		}
		if (value.length > 5) {
			return
		}
		this.setState({ zip: value })
	}
	lookupZip = zip => {
		const { loading } = this.state
		if (!loading) {
			this.setState({ loading: true })
		}

		axios
			.get(
				"https://api.zip-codes.com/ZipCodesAPI.svc/1.0/QuickGetZipCodeDetails/" +
					zip +
					"?key=JGGQP7LC3URUS5PSVFGX"
			)
			.then(response => {
				let data = response.data
				let county = data.Error ? data.Error : data.County
				if (!county) {
					return this.setState({ loading: false, county: "Unable to find County" })
				}

				let city = ""
				if (county.toLowerCase() === "fulton" || county.toLowerCase() === "dekalb") {
					city = data.City
					if (city.toLowerCase() === "atlanta") {
						county = county + " (In Atlanta)"
					} else {
						county = county + " (Not Atlanta)"
					}
				}
				this.setState({ loading: false, county })
			})
			.catch(e => {
				console.error(e)
				this.setState({ error: "An error occurred", loading: false })
			})
	}
	componentDidUpdate(props, state) {
		const { zip } = this.state
		if (zip.length === 5 && zip !== state.zip) {
			this.lookupZip(zip)
		}
	}
	useCounty = val => {
		const target = val.target
		const value = target.value
		this.props.closeModal()
		this.props.updateCalculatedFields("Tax_County", value)
	}
	render() {
		const { zip, loading, county } = this.state
		if (loading) {
			return <div>Searching...</div>
		}
		const options = {
			value: zip,
			name: "Zip_Code",
			int: true,
			type: "text"
		}
		return (
			<div>
				<Input onChange={this.handleInputChange} options={options} />

				{county && (
					<button
						onClick={this.useCounty}
						value={county}
						className="btn btn--positive"
						style={{ marginRight: 10 }}>
						Use {county}
					</button>
				)}
				<button onClick={this.props.closeModal} className="btn btn--accent">
					Close
				</button>
			</div>
		)
	}
}

export default ZipCode

ZipCode.propTypes = {
	updateCalculatedFields: func,
	closeModal: func
}
