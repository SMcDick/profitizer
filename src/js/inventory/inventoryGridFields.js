const fields = [
	{
		name: "order",
		mods: "row",
		heading: "#",
		width: 40,
		sticky: true
	},
	{
		name: "Item",
		mods: "desc",
		heading: "Item",
		width: "30%",
		sticky: true,
		format: "title"
	},
	{
		name: "Final_Cost",
		heading: "Cost/ea",
		format: "money"
	},
	{
		name: "Remaining",
		heading: "Qty",
		className: "aligncenter"
	},
	{
		name: "Remaining_Cost",
		heading: "Value",
		format: "negativeMoney"
	},
	{
		name: "Quantity",
		heading: "Inital",
		className: "aligncenter"
	},
	{
		name: "Num_Sold",
		heading: "Sold",
		className: "aligncenter"
	},
	{
		name: "Total_Cost",
		heading: "Total",
		format: "money"
	}
]
export default fields
