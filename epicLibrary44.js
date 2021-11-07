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
	//
	//
	function ref(els) {
		console.log("ref()");
		console.log(els);
		if(els === undefined) {
			// error: missing x
			return
		}
		if(typeof els !== "string" && typeof els !== "object") {
			// error: incompatible x
			return
		}
		if(typeof els === "string") {
			if(els === "") {return epicRef}
			if(els === "this") {els = [el]}
			else {
				// error: unrecognised string
				return
			}
		}
		if(!Array.isArray(els)) {els = [els]}
		console.log(els);
		let items = [];
		els.every(elx => {
			for(sys in epicRef) {
				for(group in epicRef[sys]) {
					for(id in epicRef[sys][group]) {
						if(!Array.isArray(epicRef[sys][group][id])) {
							continue
						}
						epicRef[sys][group][id].every(item => {
							if(!item.hasOwnProperty("el")) {
								return true
							}
							console.log(elx);
							console.log(item.el);
							if(item.el === elx) {
								console.log("MATCH");
								items.push(item)
							}
							return true
						})
					}
				}
			}
		});
		if(items.length === 0) {
			console.log("ZERO MATCHES");
			// error: no matching ref items
			return
		}
		if(items.length === 1) {
			console.log("ONE MATCH");
			console.log(items);
			return items[0]
		}
		console.log(items);
		return items
	}
	//
	//
	/*function ref(x) {
		console.log("ref()");
		console.log(x);
		if(x === undefined) {
			// error: missing x
			return
		}
		if(typeof x !== "string" && typeof x !== "object") {
			// error: incompatible x
			return
		}
		if(x === "") {return epicRef}
		if(typeof x === "string") {
			if(x === "this") {x = [el]}
			else {
				// error: unrecognised string
				return
			}
		}
		console.log(x);
		x.every()
		if(!x.hasAttribute("epic-ref")) {
			// error: missing epic-ref
			return
		}
		x = x.getAttribute("epic-ref").split(".");
		console.log(x);
		// x = "filters.*.item[0]"
		// x = ["filters", "*", "item[0]"]
		// x = {"el": el, "options": {}}
		let xRef = epicRef;
		x.every(str => {
			console.log(str);
			let num, i = str.indexOf("[");
			if(i !== -1 && str.charAt(str.length - 1) === "]") {
				num = str.slice(i + 1, -1);
				if(!isNaN(num)) {num = Number(num)}
				console.log(num);
				str = str.slice(0, i);
				console.log(str)
			}
			console.log(str);
			if(!xRef.hasOwnProperty(str)) {
				// error: no matching str
				xRef = undefined;
				return false
			}
			xRef = xRef[str];
			console.log(xRef);
			if(num !== undefined) {
				if(typeof xRef !== "object") {
					// error
					xRef = undefined;
					return false
				}
				if(Array.isArray(xRef)) {
					if(typeof num !== "num") {
						// error
						xRef = undefined;
						return false
					}
					if(xRef.length > num) {
						// error
						xRef = undefined;
						return false
					}
				}
				else if(!xRef.hasOwnProperty(num)) {
					// error
					xRef = undefined;
					return false
				}
				xRef = xRef[num]
			}
			return true
		});
	}*/
	function get(sels) {
		console.log("get(" + sels + ")");
		if(sels === undefined) {
			// error: missing sels
			return
		}
		if(typeof sels !== "string") {
			// error: incompatible sels
			return
		}
		let x = document, qs = true;
		if(sels.substr(0, 4) === "this") {
			x = el;
			if(sels.length === 4) {
				qs = false
			}
			else {
				sels = sels.slice(4)
			}
		}
		if(qs === false) {return x}
		return epicArray(x.querySelectorAll(sels))
	}
	function attr(attrs) {
		console.log("attr()")
	}
	let intFn = {
		"ref": ref,
		"get": get,
		"attr": attr
	}
	function repair(arr, div) {
		if(arr === undefined || div === undefined) {return}
		if(!Array.isArray(arr)) {
			// error: incompatible arr
			return
		}
		if(typeof div !== "string") {
			// error: incompatible div
			return
		}
		let pass = false, cycle = 0;
		while(cycle !== true && cycle < 20) {
			let tempArr = [], str;
			let x = {"s": 0, "e": 0, "pass": false}
			arr.every((item, i) => {
				if(x.pass === true) {
					tempArr.push(item);
					return true
				}
				if(str !== undefined) {
					str += div + item;
					if(item.includes(")")) {
						tempArr.push(str);
						x.pass = true
					}
					return true
				}
				if(!item.includes("(")) {
					tempArr.push(item);
					return true
				}
				x.s = 0;
				x.e = 0;
				for(let j = 0; j < item.length; j++) {
					if(item[j] === "(") {x.s++}
					else if(item[j] === ")") {x.e++}
				}
				if(x.s > x.e) {str = item}
				else {tempArr.push(item)}
				return true
			});
			arr = tempArr;
			arr.every((item, i) => {
				x.s = 0;
				x.e = 0;
				for(let j = 0; j < item.length; j++) {
					if(item[j] === "(") {x.s++}
					else if(item[j] === ")") {x.e++}
				}
				if(x.s !== x.e) {return false}
				else if(i === arr.length - 1) {pass = true}
				return true
			});
			cycle++
		}
		return arr
	}
	//
	console.log(fn);
	fn = repair(fn.split("."), ".");
	console.log(fn);
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
	let obj;
	fn.every((fnx, i) => {
		console.log(fnx);
		if(!fnx.hasOwnProperty("name") || fnx.name === undefined || fnx.name === "") {
			// error: missing fnx.name
			obj = undefined;
			return false
		}
		// no .params => is an object/key
		if(!fnx.hasOwnProperty("params")) {
			let x = obj;
			if(x === undefined) {x = window}
			if(!x.hasOwnProperty(fnx.name)) {
				// error: no matching object
				obj = undefined;
				return false
			}
			obj = x[fnx.name];
			console.log(obj);
			return true
		}
		// has .params => is a function
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
		console.log(fnx.name);
		console.log(fnx.params);
		fn[i].params.forEach((param, j) => {
			fn[i].params[j] = epicConverter(param, el)
		});
		if(obj === undefined && intFn.hasOwnProperty(fn[i].name)) {
			obj = intFn[fn[i].name].apply(null, fn[i].params);
			console.log(obj);
			return true
		}
		let x = obj;
		if(obj === undefined) {x = window}
		if(!x.hasOwnProperty(fn[i].name)) {
			// error: no matching function
			obj = undefined;
			return false
		}
		obj = x[fn[i].name].apply(null, fn[i].params);
		return true
	});
	return obj
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
	/*else if(str.includes("(") && str.charAt(str.length - 1) === ")") {
		str = epicFunction(str, el, fn)
	}*/
	else if(str.includes("(") && str.includes(")")) {
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
		//
		//
		//el.setAttribute("epic-ref", "");
		//
		//
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
			epicRef[sys][group][id].push(ref);
			// epic-ref attribute
			let num = epicRef[sys][group][id].length - 1;
			let str = sys + "." + group + "." + id + "[" + num + "]";
			if(el.hasAttribute("epic-ref")) {
				str = el.getAttribute("epic-ref") + "&" + str
			}
			el.setAttribute("epic-ref", str)
		})
	})
}

function epicActions() {
	epicArray(document.querySelectorAll("[epic-actions]")).forEach(el => {
		let actions = el.getAttribute("epic-actions").split("&");
		actions.forEach(act => {
			let i = act.indexOf("=");
			//act = {"ev": act.slice(0, i), "fn": epicConverter(act.slice(i + 1), el, false)}
			//
			//
			act = {"ev": act.slice(0, i), "fn": {"name": "epicConverter", "params": [act.slice(i + 1), el, false]}}
			//
			//
			if(act.ev !== undefined && act.fn !== undefined) {
				if(typeof act.fn === "object" && act.fn.hasOwnProperty("name") && act.fn.hasOwnProperty("params") && Array.isArray(act.fn.params)) {
					el.addEventListener(act.ev, (ev) => {
						console.log(ev);
						console.log(act);
						window[act.fn.name].apply(null, act.fn.params)
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
