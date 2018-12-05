import Moment from "moment"
const today = Moment().format("YYYY-MM-DD")
const yesterday = Moment()
	.subtract(1, "days")
	.format("YYYY-MM-DD")
const this_week = Moment()
	.startOf("week")
	.format("YYYY-MM-DD")
const last_week_end = Moment(this_week)
	.subtract(1, "days")
	.format("YYYY-MM-DD")
const last_week_start = Moment(this_week)
	.subtract(1, "week")
	.format("YYYY-MM-DD")
const this_month = Moment().format("YYYY-MM")
const last_month = Moment()
	.subtract(1, "month")
	.format("YYYY-MM")
const this_year = Moment().format("YYYY")
const last_year = Moment()
	.subtract(1, "year")
	.format("YYYY")

const OrderFilters = [
	{ name: "Today", url: "date/" + today },
	{ name: "Yesterday", url: "date/" + yesterday },
	{ name: "This Week", url: "range/" + this_week },
	{ name: "Last Week", url: "range/" + last_week_start + ":" + last_week_end },
	{ name: "This Month", url: "month/" + this_month },
	{ name: "Last Month", url: "month/" + last_month },
	{ name: "This Year", url: "year/" + this_year },
	{ name: "Last Year", url: "year/" + last_year }
]

export default OrderFilters
