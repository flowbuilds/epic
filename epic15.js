/* epic.js */

var epic = {
	"js": {
		"array": (x) => {
			let y = [];
			if(x !== undefined) {
				for(let i = 0; i < x.length; i++) {
					y.push(x[i])
				}
			}
			return y
		},
		"attr": (attr, attrel, el) => {
			console.log("attr( )");
			console.log(attr);
			console.log(attrel);
			if(attr === undefined) {return}
			if(typeof attr !== "string") {return}
			if(attrel === undefined) {return}
			if(typeof attrel !== "object") {return}
			if(Array.isArray(attrel)) {attrel = attrel[0]}
			if(!attrel.hasAttribute(attr)) {return}
			return epic.js.attribute(attrel.getAttribute(attr), el)
		},
		"qs": (val, all, el) => {
			if(val === undefined) {return}
			if(typeof val !== "string") {return}
			let par = document, qs = true;
			if(val.substr(0, 4) === "this") {
				par = el;
				if(val.length === 4) {qs = false}
				else {val = val.slice(4)}
			}
			if(qs === false) {
				if(all === true) {par = [par]}
				return par
			}
			if(all === true) {
				return epic.js.array(par.querySelectorAll(val))
			}
			return par.querySelector(val)
		},
		"get": (val, el) => {
			if(val === undefined) {return}
			if(typeof val !== "string") {return}
			return epic.js.qs(val, false, el)
		},
		"getall": (val, el) => {
			if(val === undefined) {return}
			if(typeof val !== "string") {return}
			return epic.js.qs(val, true, el)
		},
		"ref": (els, el) => {
			if(els === undefined) {return}
			if(typeof els !== "string" && typeof els !== "object") {return}
			if(typeof els === "string") {
				if(els === "this") {els = el}
				else {return}
			}
			let ref = [];
			if(!Array.isArray(els)) {els = [els]}
			els.forEach(e => {
				epic.ref.every((r, i) => {
					if(r.el === e) {
						let j = 0, obj;
						for(key in r) {j++}
						if(j === 2) {
							for(key in r) {
								if(key !== "el") {
									obj = r[key]
								}
							}
						}
						else {obj = r}
						ref.push(obj);
						return false
					}
					return true
				})
			});
			if(ref.length === 1) {ref = ref[0]}
			return ref
		},
		"key": (val, el) => {
			if(val === undefined) {return val}
			if(typeof val !== "string") {return val}
			function patch(arr, sep) {
				if(arr === undefined) {return arr}
				if(!Array.isArray(arr)) {return arr}
				if(sep === undefined) {return arr}
				if(typeof sep !== "string") {return arr}
				let pass = false, cycle = 0;
				while(pass !== true && cycle < 25) {
					let temp = [], str;
					let x = {"s": 0, "e": 0, "pass": false}
					arr.every((item, i) => {
						if(x.pass === true) {
							temp.push(item);
							return true
						}
						if(str !== undefined) {
							str += sep + item;
							if(item.includes(")")) {
								temp.push(str);
								x.pass = true
							}
							return true
						}
						if(!item.includes("(")) {
							temp.push(item);
							return true
						}
						x.s = 0;
						x.e = 0;
						for(let j = 0; j < item.length; j++) {
							if(item[j] === "(") {x.s++}
							else if(item[j] === "(") {x.e++}
						}
						if(x.s > x.e) {str = item}
						else {temp.push(item)}
						return true
					});
					arr = temp;
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
			let obj;
			val = patch(val.split("."), ".");
			val.every((v, i) => {
				let j = v.indexOf("(");
				if(j === -1) {
					let par = obj;
					if(par === undefined) {par = window}
					if(!par.hasOwnProperty(v) && par[v] === undefined) {
						obj = undefined;
						return false
					}
					obj = par[v];
					return true
				}
				let name = v.slice(0, j), params = v.slice(j);
				if(params === "()") {params = ""}
				else {params = params.slice(1, -1)}
				params = patch(params.split(","), ",");
				params.forEach((p, k) => {
					if(p !== "") {params[k] = epic.js.value(p, el)}
				});
				if(obj === undefined && epic.js.hasOwnProperty(name)) {
					params.push(el);
					obj = epic.js[name].apply(null, params);
					return true
				}
				let par = obj;
				if(par === undefined) {par = window}
				if(!par.hasOwnProperty(name) && par[name] === undefined) {
					obj = undefined;
					return false
				}
				obj = par[name].apply(null, params);
				return true
			});
			return obj
		},
		"value": (val, el) => {
			if(val === undefined) {return val}
			if(typeof val !== "string") {return val}
			// empty
			if(val === "") {str = undefined}
			// booleans // null // undefined
			else if(val === "true") {str = true}
			else if(val === "false") {val = false}
			else if(val === "null") {val = null}
			else if(val === "undefined") {val = undefined}
			// number
			else if(!isNaN(val)) {val = Number(val)}
			// array
			else if(val.charAt(0) === "[" && val.charAt(val.length - 1) === "]") {
				val = val.slice(1, val.length - 1).split(",");
				val.forEach((v, i) => {val[i] = epic.js.value(v, el)})
			}
			// object
			else if(val.charAt(0) === "{" && val.charAt(val.length - 1) === "}") {
				val = val.slice(1, val.length - 1).split(",");
				let obj = {}
				val.forEach(v => {
					v = v.split(":");
					obj[v[0]] = epic.js.value(v[1], el)
				});
				val = obj
			}
			// key // function
			else if(val.includes(".") && val.charAt(0) !== "." || val.includes("(") && val.includes(")")) {
				val = epic.js.key(val, el)
			}
			return val
		},
		"attribute": (val, el) => {
			if(val === undefined) {return val}
			if(typeof val !== "string") {return val}
			if(!val.includes("&") && !val.includes("=")) {
				return epic.js.value(val, el)
			}
			let obj = {}, o = false;
			val = val.split("&");
			val.forEach((v, i) => {
				let j = v.indexOf("=");
				if(j === -1) {val[i] = epic.js.value(v)}
				else {
					obj[v.slice(0, j)] = epic.js.value(v.slice(j + 1), el);
					o = true
				}
			});
			if(o === true) {val = obj}
			return val
		},
		"refBuilder": (sys) => {
			// let ref = {}
			if(sys === undefined) {return ref}
			if(typeof sys !== "string") {return ref}
			if(!epic.hasOwnProperty(sys)) {epic[sys] = {}}
			if(!epic[sys].hasOwnProperty("ref")) {epic[sys].ref = {}}
			let ref = epic[sys].ref;
			let els = document.querySelectorAll("[epic-" + sys + "-element]");
			if(els === null) {return ref}
			els = epic.js.array(els);
			els.forEach(el => {
				let name = el.getAttribute("epic-" + sys + "-element");
				let obj = {"el": el}
				for(let i = 0; i < el.attributes.length; i++) {
					let attr = el.attributes[i];
					if(attr.specified === false) {continue}
					if(!attr.name.includes("epic-" + sys + "-")) {continue}
					if(attr.name === "epic-" + sys + "-element") {continue}
					obj[attr.name.replace("epic-" + sys + "-", "")] = epic.js.attribute(attr.value)
				}
				// system reference
				if(!ref.hasOwnProperty(name)) {ref[name] = []}
				ref[name].push(obj);
				// global reference
				let sysi = ref[name].length - 1, refi;
				epic.ref.every((r, i) => {
					if(r.el === el) {
						refi = i;
						return false
					}
					return true
				});
				if(refi === undefined) {
					epic.ref.push({"el": el});
					refi = epic.ref.length - 1
				}
				epic.ref[refi][sys] = epic[sys].ref[name][sysi]
			});
			// return ref
		},
		"actions": () => {
			epic.js.array(document.querySelectorAll("[epic-actions]")).forEach(el => {
				let acts = el.getAttribute("epic-actions").split("&");
				acts.forEach(act => {
					let i = act.indexOf("=");
					act = {
						"ev": act.slice(0, i),
						"fn": [act.slice(i + 1), el]
					}
					if(act.ev !== undefined) {
						el.addEventListener(act.ev, () => {
							epic.js.value.apply(null, act.fn)
						})
					}
				})
			})
		}
	},
	"ref": []
}
