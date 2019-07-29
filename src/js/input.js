import React, { Component, Fragment } from "react"
import { object, func } from "prop-types"

import util from "./utils"

class Input extends Component {
	constructor(props) {
		super(props)
		this.state = {
			editing: false
		}
	}
	innerOnFocus = val => {
		const { options, onFocus } = this.props
		if (onFocus) {
			val.persist()
			let method = () => onFocus(val)
			if (options.noUpdate) {
				method = null
			}
			this.setState({ editing: true }, method)
		}
	}
	innerOnBlur = val => {
		const { options, onBlur } = this.props
		if (onBlur) {
			val.persist()
			let method = () => onBlur(val)
			if (options.noUpdate) {
				method = null
			}
			this.setState({ editing: false }, method)
		}
	}
	render() {
		let { onChange, options } = this.props
		let {
			name,
			label = util.stringify(name),
			placeholder = label,
			type = "number",
			value = "",
			readonly,
			required,
			className = "",
			int,
			allowLP
		} = options
		let checked = type === "checkbox" && value.toString() === "1"
		if (value === null) {
			value = ""
		}
		if (type === "number" && !this.state.editing && value !== "") {
			value = Number(value).toFixed(int ? 0 : 2)
		}

		let input = (
			<input
				onFocus={this.innerOnFocus}
				onBlur={this.innerOnBlur}
				onChange={onChange}
				className="input--text"
				type={type}
				value={value}
				name={name}
				placeholder={placeholder}
				readOnly={readonly}
				autoComplete={allowLP ? "off" : undefined}
				data-lpignore={allowLP ? undefined : "true"}
				step={type === "number" ? (int ? 1 : 0.01) : undefined}
				required={required}
			/>
		)
		let textarea = (
			<textarea
				onFocus={this.innerOnFocus}
				onBlur={this.innerOnBlur}
				onChange={onChange}
				className="input--text input--textarea"
				type={type}
				value={value}
				name={name}
				placeholder={placeholder}
				readOnly={readonly}
				autoComplete="off"
				data-lpignore="true"
				required={required}
			/>
		)

		let checkbox = (
			<div className="flex-parent">
				<div className="checkbox__label flex-child__auto">{label}</div>
				<input
					id={"checkbox-" + name}
					type="checkbox"
					className={"checkbox__input " + className}
					defaultChecked={checked}
					value={value}
					onChange={onChange}
					name={name}
					readOnly={readonly}
					required={required}
				/>
				<label htmlFor={"checkbox-" + name} className="checkbox__graphic flex-child__auto" />
			</div>
		)

		let checkboxClass = type === "checkbox" ? "flex-child__100 " : ""

		return (
			<div className={"input__wrapper " + checkboxClass + className}>
				{type === "checkbox" && checkbox}
				{type !== "checkbox" && (
					<Fragment>
						<label className="input--label">{label}</label>
						{type !== "textarea" && input}
						{type === "textarea" && textarea}
					</Fragment>
				)}
			</div>
		)
	}
}

Input.propTypes = {
	onChange: func,
	onBlur: func,
	onFocus: func,
	options: object
}

export default Input
