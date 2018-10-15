const util = {
	stringify: function(val) {
		return val.replace(/_/g, " ")
	},
	formatMoney: function(val) {
		if (!val || Number.isNaN(val)) {
			val = 0
		}
		if (Number(val) >= 0) {
			return "$" + Number(val).toFixed(2)
		} else {
			return "-$" + (0 - Number(val)).toFixed(2)
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
	},
	debounce(func, wait, immediate) {
		var timeout
		return function() {
			var context = this,
				args = arguments
			var later = function() {
				timeout = null
				if (!immediate) {
					func.apply(context, args)
				}
			}
			var callNow = immediate && !timeout
			clearTimeout(timeout)
			timeout = setTimeout(later, wait)
			if (callNow) {
				func.apply(context, args)
			}
		}
	},
	sortBy(collection, id, sorts) {
		return collection.sort((a, b) => {
			let sortsLength = sorts.length
			let ret = 0
			for (let i = 0; i < sortsLength; i++) {
				let item = sorts[i]
				let aVal = a[item.name]
				let bVal = b[item.name]
				if (aVal < bVal) {
					ret = item.desc ? 1 : -1
					break
				} else if (aVal > bVal) {
					ret = item.desc ? -1 : 1
					break
				} else {
					if (sorts[sortsLength - 1].name !== id) {
						if (a[id] < b[id]) {
							ret = 1
						} else if (a[id] > b[id]) {
							ret = -1
						}
					}
				}
			}
			return ret
		})
	},
	getMods(mods, name, type) {
		let mod
		if (mods) {
			mod = mods.split(" ")
			mod = mod.map(modifier => `${name}--${modifier}`).join(" ")
		}
		if (type) {
			name += ` ${name}--${type}`
		}
		return mods ? `${name} ${mod}` : name
	},
	getClasses(className) {
		return className ? ` ${className}` : ""
	},
	checkForPct(val, width) {
		return typeof val === "string" && val.indexOf("%") > -1 ? (parseFloat(val) * width) / 100 : val
	}
}

export default util
