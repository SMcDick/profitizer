import React, { Component } from "react"
import PropType from "prop-types"

class Input extends Component {
	render() {
		const { type, int, className, label, feeEstimate, onChange, name, readonly, required } = this.props
		let checked = type === "checkbox" && value === "1"
		let value = this.props.value
		// This is all to show decimals unless the input component has a true int prop
		value = !isNaN(Number(value)) && type === "number" ? Number(value).toFixed(int ? 0 : 2) : value
		return (
			<div className={"input__wrapper " + className}>
				<label className="input--label">
					{label}
					{feeEstimate && <span> (estimate: ${feeEstimate})</span>}
				</label>
				<input
					onChange={onChange}
					className="input--text"
					type={type}
					defaultValue={value}
					defaultChecked={checked}
					name={name}
					readOnly={readonly}
					autoComplete="off"
					data-lpignore="true"
					step={int ? 1 : 0.01}
					required={required}
				/>
			</div>
		)
	}
}
Input.propTypes = {
	label: PropType.string,
	type: PropType.string,
	value: PropType.string,
	name: PropType.string,
	readonly: PropType.bool,
	feeEstimate: PropType.string,
	int: PropType.bool,
	required: PropType.bool,
	onChange: PropType.func,
	className: PropType.string
}

export default Input
