/* epic.cart */

if(typeof epic === "undefined") {var epic = {}}
epic.cart = {
	"remove": () => {
		//
	},
	"addtocart": () => {
		//
	},
	"update": (x, option) => {
		if(x === undefined) {return}
		if(typeof x !== "string") {return}
		if(option === undefined) {return}
		if(typeof option !== "object") {return}
		option = epic.js.ref(option);
		if(option === undefined) {return}
		// add/update/remove product options
		if(!option.hasOwnProperty("name")) {return}
		if(!option.hasOwnProperty("product")) {return}
		let value = option.el.value;
		if(option.hasOwnProperty("value")) {value = option.value}
		if(!option.product.hasOwnProperty("options")) {option.product.options = {}}
		let options = option.product.options;
		if(value !== undefined && value !== "") {options[option.name] = value}
		else {delete options[option.name]}
		// variation match
		if(epic.cart.ref.hasOwnProperty("variation")) {
			let matches = [];
			epic.cart.ref.variation.every(vari => {
				if(!vari.hasOwnProperty("id")) {return true}
				for(name in options) {
					if(name === "quantity") {continue}
					if(!vari.hasOwnProperty(name)) {continue}
					if(vari[name] !== options[name]) {return true}
				}
				matches.push(vari.id);
				return true
			});
			if(matches.length === 1) {options.variation = matches[0]}
			else {delete options.variation}
		}
	},
	"setoptions": () => {
		if(!epic.cart.ref.hasOwnProperty("option")) {return}
		if(!epic.cart.ref.hasOwnProperty("product")) {return}
		epic.cart.ref.option.every(option => {
			if(!option.hasOwnProperty("product")) {return true}
			if(!option.hasOwnProperty("name")) {return true}
			// populate options
			if(option.hasOwnProperty("options")) {
				let options, o = option.options;
				if(typeof o === "string") {
					if(o === "variations") {o = "variation"}
					if(epic.cart.ref.hasOwnProperty(o)) {
						options = epic.cart.ref[o]
					}
				}
				if(options !== undefined) {
					// select
					if(option.el.tagName === "SELECT") {
						options.every(opt => {
							for(let i = 0; i < option.el.options.length; i++) {
								if(option.el.options[i].text === opt[option.name]) {
									return true
								}
							}
							o = document.createElement("option");
							o.text = opt[option.name];
							if(opt.hasOwnProperty("quantity")) {
								if(opt.quantity === 0 || opt.quantity === "") {
									o.setAttribute("disabled", "")
								}
							}
							option.el.add(o);
							return true
						})
					}
				}
			}
			return true
		})
	},
	"setproducts": () => {
		if(!epic.cart.ref.hasOwnProperty("product")) {return}
		epic.cart.ref.product.every((product, i) => {
			epic.cart.ref.product[i].elements = [];
			epic.js.ref(epic.js.array(product.el.querySelectorAll("[epic-cart-element]"))).every(item => {
				if(item.hasOwnProperty("product")) {return true}
				epic.cart.ref.product[i].elements.push(item);
				item.product = epic.cart.ref.product[i];
				return true
			});
			return true
		})
	},
	"current": []
}
if(epic.hasOwnProperty("js")) {
	epic.js.refBuilder("cart")
}
if(epic.cart.hasOwnProperty("ref")) {
	epic.cart.setproducts();
	epic.cart.setoptions()
}
