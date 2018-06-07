const util = {
	logger: function(val) {
		console.log(val)
	},
	formatDate: function(date) {
		let fdate = new Date(date)
		return fdate.getMonth() + 1 + "/" + fdate.getDate() + "/" + fdate.getFullYear()
	},
	stringify: function(val) {
		return val.replace(/_/g, " ")
	},
	formatMoney: function(val) {
		if (Number(val) >= 0) {
			return "$" + val.toFixed(2)
		} else {
			return "-$" + (0 - val).toFixed(2)
		}
	}
}

export default util
