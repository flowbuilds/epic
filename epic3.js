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
		"refBuilder": (sys) => {
			let ref = {}
			if(sys === undefined) {return ref}
			if(typeof sys !== "string") {return ref}
			let els = document.querySelectorAll("epic-" + sys + "-element");
			if(els === null) {return ref}
			els = epic.js.array(els);
			els.forEach(el => {
				let name = el.getAttribute("epic-" + sys + "-element");
				let obj = {"el": el}
				for(let i = 0; i < el.attributes.length; i++) {
					let attr = el.attributes[i];
					console.log(attr.name);
					console.log(attr.value);
					console.log("Specified: " + attr.specified);
					if(attr.specified === false) {continue}
					if(!attr.name.includes("epic-" + sys + "-")) {continue}
					if(attr.name === "epic-" + sys + "-element") {continue}
					obj[attr.name] = attr.value
				}
				if(!ref.hasOwnProperty(name)) {ref[name] = []}
				ref[name].push(obj);
			});
			console.log(ref);
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
