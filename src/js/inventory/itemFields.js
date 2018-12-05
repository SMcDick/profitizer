const fields = [
	{ name: "Item", type: "text", className: "flex-child__100 pad10" },
	{ name: "Quantity", int: true, className: "short pad10" },
	{ name: "Unit_Cost", label: "Unit Cost", className: "short pad10" },
	{ name: "Tax", className: "short pad10" }
]
const doNotUpdate = [
	{ name: "Num_Sold" },
	{ name: "Final_Cost" },
	{ name: "Remaining" },
	{ name: "Total_Cost" },
	{ name: "Remaining_Cost" }
]
const totalFields = [
	{ name: "sales", heading: "Sales", format: "positiveMoney" },
	{ name: "fees", heading: "Fees", format: "negativeMoney" },
	{ name: "ship", heading: "Shipping", format: "negativeMoney" },
	{ name: "return", heading: "ROGS", format: "positiveMoney" },
	{ name: "cogs", heading: "COGS", format: "negativeMoney" },
	{ name: "realized", heading: "Realized", format: "positiveMoney" }
]
const lotFields = [
	{ name: "count", heading: "# of Sales" },
	{ name: "item_count", heading: "# of Items" },
	{ name: "return", heading: "Return", format: "positiveMoney" },
	{ name: "cost", heading: "Total Cost", format: "negativeMoney" },
	{ name: "overall", heading: "Overall", format: "positiveMoney" },
	{ name: "average", heading: "Profit/Item", format: "positiveMoney" },
	{ name: "perSale", heading: "Profit/Sale", format: "positiveMoney" }
]
const saleFields = [
	{ name: "order", heading: "#", width: 20 },
	{ name: "id", heading: "Order Id", width: 40 },
	{ name: "profit", heading: "Profit", format: "positiveMoney" },
	{ name: "date", heading: "Sold Date", format: "date" },
	{ name: "description", heading: "Description", mods: "desc", width: "60%" }
]
export { fields, doNotUpdate, totalFields, lotFields, saleFields }
