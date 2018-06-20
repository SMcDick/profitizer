import React, { Component, Children } from "react"
import PropType from "prop-types"

class Grid extends Component {
	constructor(props) {
		super(props)
	}
	renderChildren() {
		return Children.toArray(this.props.children).map(child => {
			return React.cloneElement(child)
		})
	}
	getClasses = () => {
		const { classes } = this.props
		return classes ? " " + classes : ""
	}
	render() {
		return <div className={"item__grid" + this.getClasses()}>{this.renderChildren()}</div>
	}
}
Grid.propTypes = {
	children: PropType.node,
	classes: PropType.string
}

class GridHeader extends Grid {
	render() {
		return <div className={"item__row item__row--header" + this.getClasses()}>{this.renderChildren()}</div>
	}
}

class GridRow extends Grid {
	render() {
		return <div className={"item__row" + this.getClasses()}>{this.renderChildren()}</div>
	}
}

class GridItem extends Grid {
	render() {
		return <span className={"item__detail" + this.getClasses()}>{this.props.children}</span>
	}
}

export { Grid, GridHeader, GridRow, GridItem }
