import React, { Component } from "react"
import Select from "react-select"
import "react-select/dist/react-select.css"
import PropTypes from "prop-types"

class SelectWrapper extends Component {
	constructor(props) {
		super(props)
		this.state = {
			selectedOption: []
		}
	}
	handleChange = selectedOption => {
		this.setState({ selectedOption }, this.props.reactSelectChange(selectedOption))
	}
	render() {
		const { selectedOption } = this.state
		const { name, options } = this.props
		return (
			<Select
				className="react-select-override"
				name={name}
				value={selectedOption}
				onChange={this.handleChange}
				options={options}
				closeOnSelect
				multi
				placeholder="Choose Items"
				clearable={false}
			/>
		)
	}
}

SelectWrapper.propTypes = {
	options: PropTypes.array,
	name: PropTypes.string,
	reactSelectChange: PropTypes.func
}

export default SelectWrapper
