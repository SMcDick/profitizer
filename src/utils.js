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
	},
	totaler: function(sale, field) {
		return sale.reduce((total, value) => total + value[field], 0)
	},
	queryParams: function(searchString) {
		let params = searchString.replace(/\?/g, "&").split("&")
		params = params.reduce((array, param) => {
			let parts = param.split("=")
			let key = parts[0]
			let value = parts[1]
			if (param !== "") {
				if (key === "filters") {
					let filterString = value.substr(1, value.length - 2)
					value = filterString.split(",").reduce((all, item) => {
						let filter = item.split(":")
						return Object.assign(all, { [filter[0]]: filter[1] })
					}, {})
				}
				return Object.assign(array, { [key]: value })
			}
			return {}
		}, {})
		return params
	}
}

export default util
