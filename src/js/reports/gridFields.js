const fields = [
	{ name: "Sold_Date", heading: "Date", type: "date", format: "date", width: 100, className: "alignleft" },
	{ name: "Sales", format: "positiveMoney" },
	{ name: "FVF", format: "negativeMoney" },
	{ name: "Trx", format: "negativeMoney" },
	{ name: "Fees", format: "negativeMoney" },
	{ name: "Shipping", format: "negativeMoney" },
	{ name: "Taxes", format: "negativeMoney" },
	{ name: "Total Selling Costs", heading: "Costs", format: "negativeMoney" },
	{ name: "Return", format: "positiveMoney" },
	{ name: "COGS", format: "negativeMoney" },
	{ name: "Profit", format: "positiveMoney" },
	{ name: "Sales Count", heading: "# Sales" },
	{ name: "Items Sold", heading: "# Items" },
	{ name: "Average Selling Price", heading: "ASP", format: "positiveMoney", width: 90 },
	{ name: "Average Sale Per Item", heading: "ASP/Item", format: "positiveMoney", width: 90 },
	{ name: "Profit per Sale", heading: "Profit/Sale", format: "positiveMoney", width: 90 },
	{ name: "Profit per Item", heading: "Profit/Item", format: "positiveMoney", width: 90 }
]
export default fields
