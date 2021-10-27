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

function epicFiltersItems(group) {
	if(group === undefined) {
		group = "*"
	}
	else if(typeof group !== "string") {
		epicError("epicFiltersItems()", false, "group", group, "string");
		return
	}
	if(epicRef.filters.hasOwnProperty(group)) {
		if(!epicRef.filters[group].hasOwnProperty("activeFilters")) {
			epicRef.filters[group].activeFilters = {}
		}
		let ref = epicRef.filters[group];
		if(ref.hasOwnProperty("item")) {
			ref.item.forEach((item, i) => {
				let res = {}, act = true;
				if(item.options.hasOwnProperty("data")) {
					if(typeof item.options.data === "object") {
						let data = item.options.data;
						for(fltr in ref.activeFilters) {
							if(data.hasOwnProperty(fltr)) {
								if(!res.hasOwnProperty(fltr)) {
									res[fltr] = []
								}
								ref.activeFilters[fltr].forEach(val => {
									if(val == data[fltr]) {
										res[fltr].push(true)
									}
									else {
										res[fltr].push(false)
									}
								})
							}
							else {
								console.log("EPIC note: epicFiltersItems() could not find matching 'fltr': '" + fltr + "' option from 'activeFilters[fltr]' in 'item.options.data':");
								console.log(item)
							}
						}
					}
					else {
						console.error("EPIC error: epicFiltersItems() incompatible 'data' option in 'epicRef.filters." + group + ".item':");
						console.log(item)
					}
				}
				else {
					console.error("EPIC error: epicFiltersItems() missing 'data' option in epicRef.filters." + group + ".item:");
					console.log(item)
				}
				//
				// evaluate pass
				for(fltr in res) {
					res[fltr].every((val, i) => {
						if(val === true) {
							return false
						}
						else if(i === res[fltr].length - 1) {
							act = false;
							return false
						}
						return true
					})
				}
				console.log(act);
				epicRef.filters[group].item[i].active = act
			})
		}
		else {
			console.error("EPIC error: epicFiltersItems() missing 'item' element(s) in epicRef.filters." + group + "':");
			console.log(epicRef.filters)
		}
	}
	else {
		console.error("EPIC error: epicFiltersItems() could not find matching '" + group + "' group in 'epicRef.filters':");
		console.log(epicRef.filters)
	}
}

function epicFiltersInputs(group) {
	if(group === undefined) {
		group = "*"
	}
	else if(typeof group !== "string") {
		epicError("epicFiltersInputs()", false, "group", group, "string");
		return
	}
	if(epicRef.filters.hasOwnProperty(group)) {
		let ref = epicRef.filters[group];
		if(ref.hasOwnProperty("input")) {
			epicRef.filters[group].activeFilters = {}
			ref.input.forEach(input => {
				let val = input.el.value, fltr, type;
				if(input.options.hasOwnProperty("type")) {
					type = input.options.type;
					if(typeof type === "string") {
						if(input.options.hasOwnProperty("filter")) {
							fltr = input.options.filter;
							if(typeof fltr === "string") {
								if(val !== "") {
									// formatting
									if(type === "checkbox") {
										if(input.el.checked == true) {
											if(input.options.hasOwnProperty("value")) {
												val = input.options.value
											}
											else {
												val = true
											}
										}
										else {
											val = undefined
										}
									}
									// store
									if(val !== undefined) {
										if(!epicRef.filters[group].activeFilters.hasOwnProperty(fltr)) {
											epicRef.filters[group].activeFilters[fltr] = []
										}
										epicRef.filters[group].activeFilters[fltr].push(val)
									}
								}
								else {console.log("epicFiltersInputs() val === ''")}
							}
							else {
								console.error("EPIC error: epicFiltersInputs() incompatible 'filter' option in 'epicRef.filters." + group + ".input':");
								console.log(input)
							}
						}
						else {
							console.error("EPIC error: epicFiltersInputs() missing 'filter' option in 'epicRef.filters." + group + ".input':");
							console.log(input)
						}
					}
					else {
						console.error("EPIC error: epicFiltersInputs() incompatible 'type' option in 'epicRef.filters." + group + ".input':");
						console.log(input)
					}
				}
				else {
					console.error("EPIC error: epicFiltersInputs() missing 'type' option in 'epicRef.filters." + group + ".input':");
					console.log(input)
				}
			})
		}
		else {
			console.error("EPIC error: epicFiltersInputs() missing 'input' element(s) from epicRef.filters." + group + "':");
			console.log(epicRef.filters)
		}
	}
	else {
		console.error("EPIC error: epicFiltersInputs() could not find matching '" + group + "' group in 'epicRef.filters':");
		console.log(epicRef.filters)
	}
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
