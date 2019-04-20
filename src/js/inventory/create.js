import React from "react"
import Moment from 'moment';

import { fields } from "./itemFields"

import Form from "../form"

class Create extends React.PureComponent {
	render() {
		return (
			<section>
				<h1>Create a New Item</h1>
				<Form 
					fields={fields} 
					details={{ Quantity: 1, Purchase_Date:  Moment().format('YYYY-MM-DD') }} 
					url="inventory/" 
					redirectTo="/inventory" 
				/>
			</section >
		)
	}
}

export default Create
