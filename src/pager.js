import React, { Component } from "react"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"

class Pager extends Component {
	render() {
		let page = this.props.meta.page
		let pages = this.props.meta.pages
		let next = page < pages ? page + 1 : null
		let prev = page > 1 ? page - 1 : null
		// TODO allow different page sizes
		return (
			<div className="pager__container">
				<p>
					Page {page} of {pages}
				</p>
				{prev && (
					<Link
						to={{
							pathname: this.props.routerProps.location.pathname,
							search: `?page=${prev}`
						}}
						className="pager">
						Prev Page
					</Link>
				)}
				{next && (
					<Link
						to={{
							pathname: this.props.routerProps.location.pathname,
							search: `?page=${next}`
						}}
						className="pager">
						Next Page
					</Link>
				)}
			</div>
		)
	}
}

Pager.propTypes = {
	meta: PropTypes.object,
	routerProps: PropTypes.object
}

export default Pager
