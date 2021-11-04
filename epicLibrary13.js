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
		// error: missing fn
		return
	}
	else if(typeof fn !== "string") {
		// error: incompatible fn
		return
	}
	function ref(keys) {
		console.log("ref()")
	}
	function get(sels) {
		console.log("get()")
	}
	function attr(attrs) {
		console.log("attr()")
	}
	//
	//
	// fn = "ref(this).marker.map.panTo(geo)"
	// fn = ["this", "marker", "map", "panTo(geo)"]
	// fn = [
		// {"name": "ref", "params": "this"},
		// {"name": "marker"},
		// {"name": "map"},
		// {"name": "panTo", "params": "geo"} 
	// ]
	console.log(fn);
	fn = fn.split(".");
	fn.forEach((fnx, i) => {
		let j = fnx.indexOf("(");
		if(j === -1) {fn[i] = {"name": fnx}}
		else {
			fn[i] = {
				"name": fnx.slice(0, j),
				"params": fnx.slice(j + 1).slice(0, -1).split(",")
			}
		}
	});
	console.log(fn);
	let obj = window;
	console.log(obj);
	fn.every((fnx, i) => {
		if(!fnx.hasOwnProperty("name") || fnx.name === undefined || fnx.name === "") {
			// error: missing fnx.name
			return false
		}
		/*if(!obj.hasOwnProperty(fnx.name)) {
			// error: no matching object/function
			return false
		}*/
		if(!fnx.hasOwnProperty("params")) {
			console.log("obj[" + fnx.name + "]");
			//obj = obj[fnx.name];
			return true
		}
		let cycle = 0, pass = false;
		while(pass !== true && cycle < 20) {
			console.log("Cycle: " + cycle);
			let tempParams = [], str;
			let x = {"s": 0, "e": 0, "pass": false}
			fnx.params.every((param, j) => {
				if(x.pass === true) {
					tempParams.push(param);
					return true
				}
				if(str !== undefined) {
					str += "," + param;
					if(param.includes(")")) {
						tempParams.push(str);
						x.pass = true
					}
					return true
				}
				if(!param.includes("(")) {
					tempParams.push(param);
					return true
				}
				x.s = 0;
				x.e = 0;
				for(let k = 0; k < param.length; k++) {
					if(param[k] === "(") {x.s++}
					else if(param[k] === ")") {x.e++}
				}
				if(x.s > x.e) {str = param}
				else {tempParams.push(param)}
				return true
			});
			console.log(str);
			fn[i].params = tempParams;
			fn[i].params.every((param, j) => {
				x.s = 0;
				x.e = 0;
				for(let k = 0; k < param.length; k++) {
					if(param[k] === "(") {x.s++}
					else if(param[k] === ")") {x.e++}
				}
				if(x.s !== x.e) {return false}
				else if(j === fn[i].params.length - 1) {pass = true}
				return true
			});
			cycle++
		}
		fnx = fn[i];
		console.log(fnx.params);
		//
		return true
	});
	//
	//
	//
	//
	/*let i = fn.indexOf("("), cycle = 0, pass = false;
	fn = {
		"name": fn.slice(0, i),
		"params": fn.slice(i + 1).slice(0, -1)
	}
	console.log(fn.params);
	if(!fn.params.includes("(")) {pass = true}
	fn.params = fn.params.split(",");
	while(pass !== true && cycle < 20) {
		console.log("Cycle: " + cycle);
		let tempParams = [], str;
		let x = {"s": 0, "e": 0, "pass": false}
		for(let i = 0; i < fn.params.length; i++) {
			x.s = 0; x.e = 0;
			if(x.pass === true) {
				tempParams.push(fn.params[i])
			}
			else if(str === undefined) {
				if(fn.params[i].includes("(")) {
					for(let j = 0; j < fn.params[i].length; j++) {
						if(fn.params[i][j] === "(") {x.s++}
						else if(fn.params[i][j] === ")") {x.e++}
					}
					if(x.s > x.e) {
						str = fn.params[i]
					}
					else {
						tempParams.push(fn.params[i])
					}
				}
				else {
					tempParams.push(fn.params[i])
				}
			}
			else {
				str += "," + fn.params[i];
				if(fn.params[i].includes(")")) {
					tempParams.push(str);
					x.pass = true
				}
			}
		}
		console.log(str);
		fn.params = tempParams;
		fn.params.every((param, j) => {
			x.s = 0; x.e = 0;
			for(let i = 0; i < param.length; i++) {
				if(param[i] === "(") {x.s++}
				else if(param[i] === ")") {x.e++}
			}
			if(x.s !== x.e) {return false}
			else if(j === fn.params.length - 1) {pass = true}
			return true
		});
		cycle++
	}
	console.log(fn.params);
	fn.params.forEach((param, i) => {
		fn.params[i] = epicConverter(param, el)
	});
	console.log(fn.name);
	console.log(fn.params);
	if(fn.name === "ref") {return ref.apply(null, fn.params)}
	else if(fn.name === "get") {return ref.apply(null, fn.params)}
	else if(fn.name === "attr") {return ref.apply(null, fn.params)}
	else if(window.hasOwnProperty(fn.name)) {
		if(call === undefined || call === true) {
			return window[fn.name].apply(null, fn.params)
		}
		else if(call === false) {return fn}
	}
	else {
		// error: no matching global function
		return "NO MATCHING FUNCTION"
	}*/
}

/*function epicFunction(fn, el, call) {
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
		if(Array.isArray(selectors)) {
			selectors = "[" + selectors.join() + "]"
		}
		else if(typeof selectors !== "string") {
			epicError("get()", false, "selectors", selectors, "string");
			return
		}
		let x = document, qs = true;
		if(selectors.substr(0, 4) === "this") {
			if(el !== undefined) {x = el}
			if(selectors.length === 4) {qs = false}
			else {selectors = selectors.slice(4)}
		}
		else if(selectors.substr(0, 6) === "parent") {
			if(el !== undefined) {x = el.parentNode}
			if(selectors.length === 6) {qs = false}
			else {selectors = selectors.slice(6)}
		}
		else if(selectors.substr(0, 15) === "previousSibling") {
			if(el !== undefined) {x = el.previousSibling}
			if(selectors.length === 15) {qs = false}
			else {selectors = selectors.slice(15)}
		}
		else if(selectors.substr(0, 11) === "nextSibling") {
			if(el !== undefined) {x = el.nextSibling}
			if(selectors.length === 11) {qs = false}
			else {selectors = selectors.slice(11)}
		}
		if(qs === false) {return [x]}
		else {return epicArray(x.querySelectorAll(selectors))}
	}
	function attr(attr, attrEl) {
		if(attr === undefined) {
			epicError("attr()", true, "attr");
			return {}
		}
		else if(typeof attr !== "string") {
			epicError("attr()", false, "attr", attr, "string");
			return {}
		}
		if(attrEl === undefined) {
			epicError("attr()", true, "el");
			return {}
		}
		else if(typeof attrEl !== "object") {
			epicError("attr()", false, "el", el, "object(element)");
			return {}
		}
		if(Array.isArray(attrEl)) {
			attrEl = attrEl[0]
		}
		if(attrEl.hasAttribute(attr)) {
			return epicAttribute(attrEl.getAttribute(attr, attrEl), el)
		}
		else {
			console.error("EPIC error: attr() cannot find the attribute '" + attr + "' on the 'el' provided:");
			console.log(attrEl);
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
}*/

function epicConverter(str, el, fn) {
	if(str === undefined) {
		epicError("epicConverter()", true, "str");
		return
	}
	else if(typeof str !== "string") {
		epicError("epicConverter()", false, "str", str, "string");
		return str
	}
	// empty
	if(str === "") {str = undefined}
	// booleans / null / undefined / number
	else if(str === "true") {str = true}
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

function epicAttribute(val, el) {
	let obj = {}
	if(val === undefined) {
		// error: missing val
		return obj
	}
	else if(typeof val !== "string") {
		// error: incompatible val
		return obj
	}
	if(val.indexOf("&") === -1 && val.indexOf("=") === -1) {
		return epicConverter(val, el)
	}
	val = val.split("&");
	val.forEach(x => {
		let i = x.indexOf("=");
		if(i !== -1) {
			obj[x.slice(0, i)] = epicConverter(x.slice(i + 1), el)
		}
		else {
			// error: incompatible var
		}
	});
	return obj
}

/*function epicAttributes(value, el) {
	let obj = {}
	if(value === undefined) {
		epicError("epicAttributes()", true, "value")
		return obj
	}
	else if(typeof value !== "string") {
		epicError("epicAttributes()", false, "value", value, "string")
		return obj
	}
	if(value.indexOf("&") === -1 && value.indexOf("=") === -1) {
		return epicConverter(value, el)
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
}*/

function epicRefBuilder(sys, attrs, els) {
	if(sys === undefined) {
		// error: missing sys
		return
	}
	else if(typeof sys !== "string") {
		// error: incompatible sys
		return
	}
	// formatting attributes
	if(attrs === undefined) {attrs = ["options"]}
	else if(typeof attrs !== "string" || !Array.isArray(attrs)) {
		// error: incompatible attrs
		return
	}
	else {
		if(typeof attrs === "string") {
			attrs = [attrs]
		}
		let tempAttrs = ["options"];
		attrs.forEach(attr => {
			if(typeof attr === "string") {
				if(attr !== "options") {
					tempAttrs.push(attr)
				}
			}
			else {
				// error: incomaptible attr
			}
		});
		attrs = tempAttrs
	}
	// formatting elements
	if(els === undefined) {
		els = epicArray(document.querySelectorAll("[epic-" + sys + "]"))
	}
	else if(typeof els !== "object") {
		// error: incompatible els
		return
	}
	else {
		if(!Array.isArray(els)) {els = [els]}
		let tempEls = [];
		els.forEach(el => {
			if(typeof el === "object") {
				tempEls.push(el)
			}
			else {
				// error: incompatible el
			}
		});
		els = tempEls
	}
	// reference building
	if(!epicRef.hasOwnProperty(sys)) {
		epicRef[sys] = {"*": {}}
	}
	els.forEach(el => {
		let groups = ["*"], id = el.getAttribute("epic-" + sys), ref = {"el": el}
		attrs.forEach(attr => {
			let val, str = "epic-" + sys + "-" + attr;
			if(el.hasAttribute(str)) {
				val = el.getAttribute(str)
			}
			if(val !== undefined) {
				ref[attr] = epicAttribute(val, el)
			}
		});
		if(ref.hasOwnProperty("options") && ref.options.hasOwnProperty("group")) {
			if(typeof ref.options.group === "string") {
				groups = [ref.options.group]
			}
			else if(Array.isArray(ref.options.group)) {
				groups = ref.options.group
			}
			else {
				// error: incompatible group
			}
		}
		groups.forEach(group => {
			if(!epicRef[sys].hasOwnProperty(group)) {
				epicRef[sys][group] = {}
			}
			if(!epicRef[sys][group].hasOwnProperty(id)) {
				epicRef[sys][group][id] = []
			}
			epicRef[sys][group][id].push(ref)
		})
	})
}

/*function epicRefBuilder(system, attributes, elements) {
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
			let value;
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
}*/

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

if(!String.prototype.includes) {
	String.prototype.includes = (search, start) => {
		'use strict';
		if(search instanceof RegExp) {
			throw TypeError("string.includes(): First argument must not be a RegExp")
		}
		if(start === undefined) {start = 0}
		return this.indexOf(search, start) !== -1
	}
}

var epicRef = {}
window.addEventListener("DOMContentLoaded", () => {
	epicActions();
})
