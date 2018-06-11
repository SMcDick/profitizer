import React, { Component } from "react"
import PropType from "prop-types"

class Input extends Component {
	render() {
		const { type, int, className, label, onChange, name, readonly, required } = this.props
		let value = this.props.value
		let checked = type === "checkbox" && value === "1"
		if (readonly && type === "number") {
			value = Number(value).toFixed(int ? 0 : 2)
		}
		return (
			<div className={"input__wrapper " + className}>
				<label className="input--label">{label}</label>
				<input
					ref={this.myRef}
					onFocus={this.props.onFocus}
					onBlur={this.props.onBlur}
					onChange={onChange}
					className="input--text"
					type={type}
					value={value}
					checked={checked}
					name={name}
					readOnly={readonly}
					autoComplete="off"
					data-lpignore="true"
					step={type === "number" ? (int ? 1 : 0.01) : undefined}
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
	int: PropType.bool,
	required: PropType.bool,
	onChange: PropType.func,
	className: PropType.string,
	onBlur: PropType.func,
	onFocus: PropType.func
}

export default Input
