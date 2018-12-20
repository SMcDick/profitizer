const fields = [
	{ name: "Sold_Date", heading: "Date", type: "date", format: 'date', width: 100, className: "alignleft" },
	{ name: "Sales", format: 'positiveMoney' },
	{ name: "FVF", format: 'negativeMoney' },
	{ name: "Trx", format: 'negativeMoney' },
	{ name: "Fees", format: 'negativeMoney' },
	{ name: "Shipping", format: 'negativeMoney' },
	{ name: "Taxes", format: 'negativeMoney' },
	{ name: "Total Selling Costs", heading: "Selling Costs", format: 'negativeMoney' },
	{ name: "Return", format: 'positiveMoney' },
	{ name: "COGS", format: 'negativeMoney' },
	{ name: "Profit", format: 'positiveMoney' },

]
export default fields
