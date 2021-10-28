function epicFiltersActive(group) {
	if(group === undefined) {
		group = "*"
	}
	else if(typeof group !== "string") {
		epicError("epicFiltersActive()", false, "group", group, "string");
		return
	}
	if(!epicRef.filters.hasOwnProperty(group)) {
		// error: no epicRef.filters[group]
		return
	}
	let ref = epicRef.filters[group];
	if(!ref.hasOwnProperty("item")) {return}
	ref.item.every(item => {
		if(!item.hasOwnProperty("active")) {return true}
		if(item.active === false) {
			item.el.style.display = "none";
			if(item.hasOwnProperty("filter")) {
				item.filter.forEach(el => {
					if(el.hasOwnProperty("el")) {
						el = el.el
					}
					el.style.display = "none"
				})
			}
		}
		else if(item.active === true) {
			item.el.style.removeProperty("display");
			if(item.hasOwnProperty("filter")) {
				item.filter.forEach(el => {
					if(el.hasOwnProperty("el")) {
						el = el.el
					}
					el.style.removeProperty("display")
				})
			}
		}
		//
		return true
	})
}

function epicFiltersReset(group) {
	if(group === undefined) {group = "*"}
	else if(typeof group !== "string") {
		epicError("epicFiltersReset()", false, "group", group, "string");
		return
	}
	if(!epicRef.filters.hasOwnProperty(group)) {
		// error: no matching epicRef.filters[group]
		return
	}
	if(!epicRef.filters[group].hasOwnProperty("input")) {return}
	epicRef.filters[group].input.every(input => {
		if(!input.el.hasAttribute("type")) {
			// error: no input.options.type
			return true
		}
		let type = input.el.getAttribute("type");
		if(type === "checkbox") {
			//input.el.checked = false
			if(input.el.checked === true) {
				input.el.click()
			}
		}
		//
		return true
	});
	epicFilter()
}

function epicFiltersItems(group) {
	if(group === undefined) {group = "*"}
	else if(typeof group !== "string") {
		// error: incompatible group
		return
	}
	if(!epicRef.filters.hasOwnProperty(group)) {
		// error: no matching group
		return
	}
	let ref = epicRef.filters[group];
	if(!ref.hasOwnProperty("item")) {
		// error: missing item(s)
		return
	}
	if(!ref.hasOwnProperty("activeFilters")) {
		// error: missing activeFilters
		return
	}
	ref.item.every((item, i) => {
		if(!item.options.hasOwnProperty("data")) {
			// error: missing data option
			return true
		}
		if(typeof item.options.data !== "object") {
			// error: incompatible data option
			return true
		}
		let data = item.options.data, res = {}, pass = true;
		for(name in ref.activeFilters) {
			if(!data.hasOwnProperty(name)) {
				// error: no matching data[name]
				continue
			}
			if(!res.hasOwnProperty(name)) {
				res[name] = []
			}
			// compare
			ref.activeFilters[name].every(fltr => {
				if(fltr.type === "range") {
					console.log("RANGE");
					// fltr.val = ["-", #] OR [#, "+"] OR [#, #]
					if(!Array.isArray(fltr.val)) {
						// error: incompatible fltr.val
						return true
					}
					if(fltr.val.length !== 2) {
						// error: incompatible fltr.val
						return true
					}
					let range = {"s": undefined, "e": undefined}
					fltr.val.forEach(val => {
						if(val === "-") {
							if(range.s !== undefined) {
								range.e = range.s
							}
							range.s = val
						}
						else if(val === "+") {
							range.e = "+"
						}
						else {
							if(typeof val === "string") {
								val = Number(val.replace(",", ""))
							}
							if(range.s === undefined) {
								range.s = val
							}
							else {
								range.e = val
							}
						}
					});
					console.log(range);
					console.log(data[name]);
					if(typeof range.s === "number" && typeof range.e === "number") {
						if(data[name] >= range.s && data[name] <= range.e) {
							res[name].push(true)
						}
						else {
							res[name].push(false)
						}
					}
					else if(range.s === "-") {
						if(data[name] <= range.e) {
							res[name].push(true)
						}
						else {
							res[name].push(false)
						}
					}
					else if(range.e === "+") {
						if(data[name] >= range.s) {
							res[name].push(true)
						}
						else {
							res[name].push(false)
						}
					}
				}
				else {
					if(data[name] == fltr.val) {
						res[name].push(true)
					}
					else {
						res[name].push(false)
					}
				}
				//
				return true
			})
		}
		for(name in res) {
			res[name].every((val, i) => {
				if(val === true) {
					return false
				}
				else if(i === res[name].length - 1) {
					pass = false;
					return false
				}
				return true
			})
		}
		console.log(pass);
		epicRef.filters[group].item[i].active = pass
		return true
	})
}

function epicFiltersInputs(group) {
	if(group === undefined) {group = "*"}
	else if(typeof group !== "string") {
		// error: incompatible group
		return
	}
	if(!epicRef.filters.hasOwnProperty(group)) {
		// error: no matching group
		return
	}
	if(!epicRef.filters[group].hasOwnProperty("input")) {
		// error: missing input(s)
		return
	}
	epicRef.filters[group].activeFilters = {}
	epicRef.filters[group].input.every(input => {
		let name, type, val = input.el.value, fltrtype;
		if(!input.options.hasOwnProperty("filter-name")) {
			// error: missing name
			return true
		}
		name = input.options["filter-name"];
		if(typeof name !== "string") {
			// error: incompatible name
			return true
		}
		if(input.el.hasAttribute("type")) {
			type = input.el.getAttribute("type")
		}
		if(val === "") {return true}
		// formatting
		if(type === "checkbox") {
			if(input.el.checked == true) {
				if(input.options.hasOwnProperty("value")) {
					val = input.options.value
				}
				else {val = true}
			}
			else {return true}
		}
		// store
		if(val === undefined) {return true}
		if(input.options.hasOwnProperty("filter-type")) {
			fltrtype = input.options["filter-type"]
		}
		if(!epicRef.filters[group].activeFilters.hasOwnProperty(name)) {
			epicRef.filters[group].activeFilters[name] = []
		}
		epicRef.filters[group].activeFilters[name].push({"type": fltrtype, "val": val})
		return true
	})
}

function epicFilter(group) {
	epicFiltersInputs(group);
	epicFiltersItems(group);
	epicFiltersActive(group)
}

function epicFiltersInit() {
	epicRefBuilder("filters");
	if(epicRef.hasOwnProperty("filters")) {
		//
	}
	else {
		console.error("EPIC error: epicFilters.js failed to initalise")
	}
}

epicFiltersInit();
console.log("epicFilters.js");
console.log(epicRef);
