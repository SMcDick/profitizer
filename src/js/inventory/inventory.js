import React, { Component } from "react"
import { object } from "prop-types"
import axios from "axios"

import fields from "./inventoryGridFields"
import { Grid } from "../grid"
import InventoryNav from "./inventoryNav"
import Input from "../input"

import { API_ROOT } from "../config"

class Inventory extends Component {
	constructor(props) {
		super(props)
		this.state = {
			data: [],
			loading: true,
			error: false,
			search: ""
		}
	}
	componentDidMount() {
		this.fetchData()
	}
	componentDidUpdate(prevProps) {
		if (prevProps.match.url !== this.props.match.url) {
			this.setState({ data: [], loading: true }, this.fetchData())
		}
	}
	fetchData() {
		let { params } = this.props.match.params
		const { search } = this.props.location
		let paramString = params ? `/${params}` : ""
		axios
			.get(API_ROOT + "inventory" + paramString + search)
			.then(inventory => {
				const data = inventory.data.data
				this.setState({
					data,
					loading: false,
					error: false
				})
			})
			.catch(e => {
				console.error(e.response)
				this.setState({ error: true, loading: false })
			})
	}
	handleSearch = e => {
		const target = e.target
		const val = target.value
		this.setState({ search: val })
	}
	render() {
		const { data, search } = this.state
		let filteredData = [...data]
		if( search.length > 0){
			filteredData = data.filter( item => item.Item.toLowerCase().indexOf( search.toLowerCase() ) > -1 )
		}
		filteredData.map( (item,idx) => {
			item.order = idx + 1
			return item
		})

		const link = { name: "inventory", id: "Item_Id" }
		const searchOptions = {type:"text", name:"Search", placeholder:"Search", className:"search__wrapper", value: search}
		// TODO Reimplement search
		return (
			<section>
				<h1>Inventory</h1>
				<InventoryNav />
				<Input options={searchOptions} onChange={this.handleSearch} />
				<Grid fields={fields} data={filteredData} link={link} />
			</section>
		)
	}
}
Inventory.propTypes = {
	match: object,
	location: object
}

export default Inventory
