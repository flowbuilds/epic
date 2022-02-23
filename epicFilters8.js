/* epic.filters */

if(typeof epic === "undefined") {var epic = {}}
epic.filters = {
	"counters": () => {
		if(!epic.filters.ref.hasOwnProperty("counter")) {return}
		epic.filters.ref.counter.every(counter => {
			counter.textContent = epic.filters.count
		})
	},
	"items": () => {
		epic.filters.count = 0;
		if(!epic.filters.ref.hasOwnProperty("item")) {return}
		epic.filters.ref.item.every(item => {
			let state = "active";
			let active = epic.filters.active, res = {}, pass = true;
			for(name in active) {
				if(!item.hasOwnProperty(name)) {continue}
				if(!res.hasOwnProperty(name)) {res[name] = []}
				// compare
				active[name].every(filter => {
					if(filter.type === "includes") {
						let value;
						if(typeof item[name] === "number") {value = String(item[name])}
						else if(typeof item[name] === "string") {value = item[name]}
						if(value === undefined) {return true}
						value = value.toLowerCase();
						if(value.includes(filter.value)) {res[name].push(true)}
						else {res[name].push(false)}
					}
					else if(filter.type === "range") {
						if(!Array.isArray(filter.value)) {return true}
						if(filter.value.length !== 2) {return true}
						let range = {"s": undefined, "e": undefined}
						filter.value.forEach(value => {
							if(value === "-") {
								if(range.s !== undefined) {range.e = range.s}
								range.s = value
							}
							else if(value === "+") {range.e = value}
							else {
								if(typeof value === "string") {
									value = Number(value.replace(",", ""))
								}
								if(range.s === undefined) {range.s = value}
								else {range.e = value}
							}
						});
						if(typeof range.s === "number" && typeof range.e === "number") {
							if(item[name] >= range.s && item[name] <= range.e) {res[name].push(true)}
							else {res[name].push(false)}
						}
						else if(range.s === "-") {
							if(item[name] <= range.e) {res[name].push(true)}
							else {res[name].push(false)}
						}
						else if(range.e === "+") {
							if(item[name] >= range.s) {res[name].push(true)}
							else {res[name].push(false)}
						}
					}
					else if(filter.type === "geo") {
						if(!Array.isArray(item[name])) {
							// get coordinates from marker data
						}
						// does the data need re-getting?
						if(item[name].length !== 2) {return true}
						if(item[name][0] > filter.value.left 
							&& item[name][0] < filter.value.right 
							&& item[name][1] < filter.value.top 
							&& item[name][1] > filter.value.bottom) {
							res[name].push(true)
						}
						else {res[name].push(false)}
					}
					else {
						if(item[name] !== undefined && item[name].toLowerCase() == filter.value) {
							res[name].push(true)
						}
						else {res[name].push(false)}
					}
					return true
				})
			}
			for(name in res) {
				res[name].every((value, i) => {
					if(value === true) {return false}
					else if(i === res[name].length - 1) {
						pass = false;
						return false
					}
					return true
				})
			}
			if(pass === false) {state = "inactive"}
			else {epic.filters.count++}
			epic.js.state(state, item.el);
			return true
		})
	},
	"inputs": () => {
		if(!epic.filters.ref.hasOwnProperty("input")) {return}
		epic.filters.active = {};
		epic.filters.ref.input.every(input => {
			if(input.el.value === "") {return true}
			if(!input.hasOwnProperty("name")) {return true}
			if(typeof input.name !== "string") {return true}
			let eltype, value = input.el.value, type;
			if(input.el.hasAttribute("type")) {
				eltype = input.el.getAttribute("type")
			}
			// format
			if(eltype === "checkbox") {
				if(input.el.checked == true) {
					if(input.hasOwnProperty("value")) {
						value = input.value;
						if(typeof value === "string") {
							value = epic.js.value(value)
						}
					}
					else {value = true}
				}
				else {return true}
			}
			// store
			if(value === undefined) {return true}
			if(typeof value === "string") {value = value.toLowerCase()}
			if(input.hasOwnProperty("type")) {
				type = input.type
			}
			if(!epic.filters.active.hasOwnProperty(input.name)) {
				epic.filters.active[input.name] = []
			}
			epic.filters.active[input.name].push({"type": type, "value": value})
			return true
		})
	},
	"update": () => {
		epic.filters.inputs();
		epic.filters.items();
		epic.filters.counters()
	},
	"reset": () => {
		if(!epic.filters.ref.hasOwnProperty("input")) {return}
		epic.filters.ref.input.every(input => {
			let type = input.el.getAttribute("type");
			let tag = input.el.tagName.toLowerCase();
			if(type === "checkbox") {
				if(input.el.checked === true) {
					input.el.click()
				}
				return true
			}
			if(tag === "select") {
				input.el.selectedIndex = 0;
				return true
			}
			return true
		});
		epic.filters.update()
	},
	"init": () => {
		epic.js.refBuilder("filters");
		// url queries
		epic.filters.update()
	},
	"ref": {},
	"active": {},
	"count": 0
}
if(epic.hasOwnProperty("js")) {epic.filters.init()}
