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
			// function
			//
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
			let ref = {}
			if(sys === undefined) {return ref}
			if(typeof sys !== "string") {return ref}
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
				if(!ref.hasOwnProperty(name)) {ref[name] = []}
				ref[name].push(obj);
			});
			return ref
		},
		"initActions": () => {
			epic.js.array(document.querySelectorAll("[epic-actions]")).forEach(el => {
				let acts = el.getAttribute("epic-actions").split("&");
				acts.forEach(act => {
					let i = act.indexOf("=");
					//
				})
			})
		}
	}
}
