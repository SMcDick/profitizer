import React from "react"

import { fields } from "./itemFields"

import Form from "../form"

const Create = () => (
	<section>
		<h1>Create a New Item</h1>
		<Form fields={fields} details={{ Quantity: 1 }} url="inventory/" redirectTo="/inventory" />
	</section>
)

export default Create
