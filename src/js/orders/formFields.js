const fields = [
	{ name: "Description", type: "text", className: "flex-child__100 pad10" },
	{ name: "Platform_Order_Id", type: "text", required: true },
	{ name: "Marketplace", type: "text" },
	{ name: "Sold_Date", type: "date", required: true },
	{ name: "Total_Sold_Price", required: true },
	{ name: "Shipping" },
	{ name: "Marketplace_Fee_Shipping", label: "Shipping FVF", noUpdate: true },
	{ name: "Marketplace_Fee_Base", label: "Base FVF", noUpdate: true },
	{ name: "Marketplace_Fee", readonly: true },
	{ name: "Transaction_Fee" },
	{ name: "Tax_County", type: "text" },
	{ name: "Tax_Pct", label: "Tax %" },
	{ name: "Tax_Collected" },
	{ name: "Tax_Calculated_Calc", label: "Estimated Taxes", readonly: true, noUpdate: true },
	{ name: "Completed", type: "checkbox" }
]

const doNotUpdate = [{ name: "Total_Return" }, { name: "Total_Fees" }, { name: "Total_Profit" }, { name: "COGS" }]

export { fields, doNotUpdate }
