const fields = [
	{
		name: "name",
		heading: "County",
		width: 100,
		mods: "desc"
	},
	{
		name: "taxableAmount",
		heading: "Taxable Amount",
		format: "money"
	},
	{
		name: "collected",
		heading: "Tax Collected",
		format: "money"
	},
	{
		name: "due",
		heading: "Estimated Tax Due",
		width: 120,
		format: "money"
	},
	{
		name: "orders",
		heading: "Orders",
		width: "40%",
		format: "links",
		className: "alignleft"
	}
]
export { fields }
