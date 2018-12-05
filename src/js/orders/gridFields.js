const fields = [
	{
		name: "Completed",
		mods: "icon",
		heading: "",
		format: "check",
		width: 24,
		sticky: true
	},
	{
		name: "order",
		mods: "row",
		heading: "#",
		width: 40,
		sticky: true
	},
	{
		name: "Description",
		mods: "desc",
		width: "40%",
		sticky: true,
		format: "title"
	},
	{
		name: "Platform_Order_Id",
		heading: "ID",
		format: "truncate",
		className: "alignleft"
	},
	{
		name: "Total_Sold_Price",
		heading: "Sale",
		format: "positiveMoney"
	},
	{
		name: "COGS",
		heading: "Cost",
		format: "negativeMoney"
	},
	{
		name: "Marketplace_Fee",
		heading: "FVF",
		format: "negativeMoney"
	},
	{
		name: "Transaction_Fee",
		heading: "Trx",
		format: "negativeMoney"
	},
	{
		name: "Shipping",
		format: "negativeMoney"
	},
	{
		name: "Tax_Calculated_Calc",
		heading: "Tax",
		format: "negativeMoney"
	},
	{
		name: "Total_Profit",
		heading: "Profit",
		format: "positiveMoney"
	},
	{
		name: "Sold_Date",
		mods: "date",
		heading: "Sold Date",
		format: "date",
		width: 100
	}
]
const totalFields = [
	{
		name: "sales",
		format: "positiveMoney",
		heading: "Sales"
	},
	{
		name: "fees",
		format: "negativeMoney",
		heading: "Fees"
	},
	{
		name: "ship",
		format: "negativeMoney",
		heading: "Shipping"
	},
	{
		name: "tax",
		format: "negativeMoney",
		heading: "Tax"
	},
	{
		name: "return",
		format: "positiveMoney",
		heading: "Return"
	},
	{
		name: "cost",
		format: "negativeMoney",
		heading: "COGS"
	},
	{
		name: "profit",
		format: "positiveMoney",
		heading: "Profit"
	}
]
export { fields, totalFields }
