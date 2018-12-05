import React from "react"
import { string } from "prop-types"

import Alert from "./alert"

const RequestError = props => {
	return (
		<section>
			<h1>There was a problem with the request. Hopefully, its temporary. Try refreshing</h1>
			{props.children && <Alert>{props.children}</Alert>}
		</section>
	)
}
RequestError.propTypes = {
	children: string
}
export default RequestError
