function epicArray(x) {
	let y = [];
	if(x !== undefined) {
		for(let i = 0; i < x.length; i++) {
			y.push(x[i])
		}
	}
	return y
}

function epicError(fn, msng, name, param, type) {
	let msg = "EPIC error";
	if(fn !== undefined && typeof fn === "string") {
		msg = msg + ": " + fn;
		if(msng !== undefined && msng == true || msng !== undefined && msng == false) {
			if(msng == true) {
				msg = msg + " missing"
			}
			else if(msng == false) {
				msg = msg + " incompatible"
			}
			if(name !== undefined && typeof name === "string") {
				msg = msg + " '" + name + "' parameter.";
				if(param !== undefined) {
					msg = msg + " '" + name + "' is currently a/an '" + typeof param + "'";
					if(type !== undefined && typeof type === "string") {
						msg = msg + " when it should be a/an '" + type + "'"
					}
				}
			}
		}
		else {
			msg = msg + " missing or incompatible parameter."
		}
	}
	console.error(msg)
}

function epicFunction(fn, el, call) {
	if(fn === undefined) {
		epicError("epicFunction()", true, "fn");
		return
	}
	else if(typeof fn !== "string") {
		epicError("epicFunction()", false, "fn", fn, "string");
		return
	}
	if(call !== undefined && typeof call !== "boolean") {
		epicError("epicFunction()", false, "call", call, "boolean");
		return
	}
	function ref(keys) {
		if(keys === undefined) {
			epicError("ref()", true, "keys");
			return
		}
		else if(typeof keys !== "string") {
			epicError("ref()", false, "keys", keys, "string");
			return
		}
		function error() {
			console.error("EPIC error: ref() cannot find a matching key in 'epicRef' using '" + keys.join() + "'")
		}
		keys = keys.split(".");
		if(keys.length >= 1) {
			if(epicRef.hasOwnProperty(keys[0])) {
				if(keys.length >= 2) {
					if(epicRef[keys[0]].hasOwnProperty(keys[1])) {
						if(keys.length >= 3) {
							if(epicRef[keys[0]][keys[1]].hasOwnProperty(keys[2])) {
								return epicRef[keys[0]][keys[1]][keys[2]]
							}
							else {
								error();
								return
							}
						}
						else {
							return epicRef[keys[0]][keys[1]]
						}
					}
					else {
						error();
						return
					}
				}
				else {
					return epicRef[keys[0]]
				}
			}
			else {
				error();
				return
			}
		}
		else {
			error();
			return
		}
	}
	function get(selectors) {
		if(selectors === undefined) {
			epicError("get()", true, "selectors");
			return
		}
		else if(typeof selectors !== "string") {
			epicError("get()", false, "selectors", selectors, "string");
			return
		}
		let x = document;
		if(selectors.substr(0, 4) === "this") {
			if(el !== undefined) {
				x = el
			}
			selectors = selectors.slice(4)
		}
		return epicArray(x.querySelectorAll(selectors))
	}
	function attr(attr, el) {
		if(attr === undefined) {
			epicError("attr()", true, "attr");
			return {}
		}
		else if(typeof attr !== "string") {
			epicError("attr()", false, "attr", attr, "string");
			return {}
		}
		if(el === undefined) {
			epicError("attr()", true, "el");
			return {}
		}
		else if(typeof el !== "object") {
			epicError("attr()", false, "el", el, "object(element)");
			return {}
		}
		if(Array.isArray(el)) {
			el = el[0]
		}
		if(el.hasAttribute(attr)) {
			return epicAttributes(el.getAttribute(attr, el))
		}
		else {
			console.error("EPIC error: attr() cannot find the attribute '" + attr + "' on the 'el' provided:");
			console.log(el);
			return {}
		}
	}
	let i = fn.indexOf("(");
	fn = [fn.slice(0, i), fn.slice(i + 1)];
	fn = {"name": fn[0], "params": fn[1].slice(0, -1).split(",")}
	fn.params.forEach((x, i) => {
		fn.params[i] = epicConverter(x, el)
	});
	if(fn.name === "ref") {
		return ref.apply(null, fn.params)
	}
	else if(fn.name === "get") {
		return get.apply(null, fn.params)
	}
	else if(fn.name === "attr") {
		return attr.apply(null, fn.params)
	}
	else if(window.hasOwnProperty(fn.name)) {
		if(call === undefined || call === true) {
			return window[fn.name].apply(null, fn.params)
		}
		else if(call === false) {
			return fn
		}
	}
	else {
		console.error("EPIC error: epicFunction() couldn't find a function that matches '" + fn.name + "(" + fn.param + ")'")
	}
}

function epicConverter(str, el, fn) {
	if(str === undefined) {
		epicError("epicConverter()", true, "str");
		return
	}
	else if(typeof str !== "string") {
		epicError("epicConverter()", false, "str", str, "string");
		return str
	}
	// booleans / null / undefined / number
	if(str === "true") {str = true}
	else if(str === "false") {str = false}
	else if(str === "null") {str = null}
	else if(str === "undefined") {str = undefined}
	else if(!isNaN(str)) {str = Number(str)}
	// date
	// array
	else if(str.charAt(0) === "[" && str.charAt(str.length - 1) === "]") {
		str = str.slice(1, str.length - 1).split(",");
		str.forEach((x, i) => {
			str[i] = epicConverter(x, el, fn)
		})
	}
	// object
	else if(str.charAt(0) === "{" && str.charAt(str.length - 1) === "}") {
		str = str.slice(1, str.length - 1).split(",");
		let temp = {}
		str.forEach(x => {
			x = x.split(":");
			temp[x[0]] = epicConverter(x[1], el, fn)
		});
		str = temp
	}
	// function
	else if(str.includes("(") && str.charAt(str.length - 1) === ")") {
		str = epicFunction(str, el, fn)
	}
	return str
}

function epicAttributes(value, el) {
	let obj = {}
	if(value === undefined) {
		epicError("epicAttributes()", true, "value")
		return obj
	}
	else if(typeof value !== "string") {
		epicError("epicAttributes()", false, "value", value, "string")
		return obj
	}
	value = value.split("&");
	value.forEach(snip => {
		let i = snip.indexOf("=");
		if(i !== -1) {
			snip = {"key": snip.slice(0, i), "val": epicConverter(snip.slice(i + 1), el)};
			obj[snip.key] = snip.val
		}
		else {
			epicError("epicAttributes()", false, "value item", snip, "string(x = y)")
		}
	});
	return obj
}

function epicRefBuilder(system, attributes, elements) {
	// errors & formatting
	if(system === undefined) {
		epicError("epicRefBuilder()", true, "system");
		return
	}
	else if(typeof system !== "string") {
		epicError("epicRefBuilder()", false, "system", system, "string");
		return
	}
	if(attributes !== undefined) {
		if(typeof attributes !== "string" || !Array.isArray(attributes)) {
			epicError("epicRefBuilder()", false, "attributes", attributes, "string or array");
			return
		}
		else if(typeof attributes === "string") {
			attributes = [attributes]
		}
		let temp = ["options"];
		attributes.forEach(attr => {
			if(typeof attr === "string") {
				if(attr !== "options") {
					temp.push(attr)
				}
			}
			else {
				epicError("epicRefBuilder()", false, "attributes item", attr, "string")
			}
		});
		attributes = temp
	}
	else {
		attributes = ["options"]
	}
	if(elements !== undefined) {
		if(typeof elements !== "object") {
			epicError("epicRefBuilder()", false, "elements", elements, "element or array");
			return
		}
		else if(!Array.isArray(elements)) {
			elements = [elements]
		}
		let temp = [];
		elements.forEach(el => {
			if(typeof el === "object") {
				temp.push(el)
			}
			else {
				epicError("epicRefBuilder()", false, "elements item", el, "object")
			}
		});
		elements = temp
	}
	else {
		console.log("[epic-" + system + "]");
		elements = epicArray(document.querySelectorAll("[epic-" + system + "]"))
	}
	// reference building
	if(!epicRef.hasOwnProperty(system)) {
		epicRef[system] = {"*": {}}
	}
	elements.forEach(el => {
		let groups = ["*"], id = el.getAttribute("epic-" + system), ref = {"el": el};
		attributes.forEach(attr => {
			let value = "";
			if(el.hasAttribute("epic-" + system + "-" + attr)) {
				value = el.getAttribute("epic-" + system + "-" + attr)
			}
			ref[attr] = epicAttributes(value, el)
		});
		if(ref.hasOwnProperty('options') && ref.options.hasOwnProperty("group")) {
			if(typeof ref.options.group === "string") {
				groups = [ref.options.group]
			}
			else if(Array.isArray(ref.options.group)) {
				groups = ref.options.group
			}
			else {
				console.log(el);
				console.error("EPIC error: epicRefBuilder() incompatible 'group' from 'epic-" + system + "-options' attribute. 'group' is a/an '" + typeof ref.options.group + "' when it should be 'string or array")
			}
		}
		groups.forEach(group => {
			if(!epicRef[system].hasOwnProperty(group)) {
				epicRef[system][group] = {}
			}
			if(!epicRef[system][group].hasOwnProperty(id)) {
				epicRef[system][group][id] = []
			}
			epicRef[system][group][id].push(ref)
		})
	})
}

function epicActions() {
	epicArray(document.querySelectorAll("[epic-actions]")).forEach(el => {
		let actions = el.getAttribute("epic-actions").split("&");
		actions.forEach(act => {
			let i = act.indexOf("=");
			act = {"ev": act.slice(0, i), "fn": epicConverter(act.slice(i + 1), el, false)}
			if(act.ev !== undefined && act.fn !== undefined) {
				if(typeof act.fn === "object" && act.fn.hasOwnProperty("name") && act.fn.hasOwnProperty("params") && Array.isArray(act.fn.params)) {
					el.addEventListener(act.ev, () => {
						window[act.fn.name].apply(act.fn.params)
					})
				}
			}
		})
	})
}

var epicRef = {}
window.addEventListener("DOMContentLoaded", () => {
	epicActions();
})
