import { Component } from "react"
import Moment from "moment"

class Ts extends Component {
	render() {
		console.log(this.props.type + " rendered at " + Moment().format("hh:mm:ss:SSSS"))
		return null
	}
}

export default Ts
