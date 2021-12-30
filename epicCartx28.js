/* epic.cart */

if(typeof epic === "undefined") {var epic = {}}
epic.cart = {
	"checkout": (x, y, z) => {
		if(x === undefined) {return}
		if(typeof x !== "string") {return}
		if(x === "ext") {
			// y = webhook url
			if(y === undefined) {return}
			if(typeof y !== "string") {return}
			// webhook request
			let req = {
				"items": [],
				"discounts": [],
				"shipping": epic.cart.current.shipping
			}
			// items
			epic.cart.current.items.forEach(item => {
				if(!item.hasOwnProperty("variation")) {return true}
				let obj = {
					"quantity": "1"
				}
				if(item.hasOwnProperty("quantity")) {
					obj.quantity = item.quantity.toString()
				}
				for(key in item.variation) {
					if(key === "el") {continue}
					if(key === "product") {continue}
					if(key === "quantity") {continue}
					obj[key] = item.variation[key]
				}
				req.items.push(obj);
				return true
			});
			// discounts
			if(epic.cart.current.discounts.length >= 1) {
				req.discounts = epic.cart.current.discounts
			}
			// request
			req = JSON.stringify(req);
			let xhr = new XMLHttpRequest();
			xhr.open("POST", y, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.responseType = "json";
			xhr.onload = () => {
				console.log(xhr.response);
				if(xhr.status == 200) {
					if(xhr.response.hasOwnProperty("url")) {
						/* OPEN IN SAME TAB */
						window.open(xhr.response.url/*, "_self"*/)
					}
				}
				else {
					console.log("ERROR: Something went wrong:");
					console.log(xhr.response);
					console.log(xhr.status)
				}
			}
			xhr.send(req)
		}
	},
	"updatecart": () => {
		let shipping = "false";
		epic.cart.current.items.every(item => {
			if(item.variation.hasOwnProperty("shipping") && item.variation.shipping === true) {
				shipping = "true";
				return false
			}
			return true
		});
		epic.cart.current.shipping = shipping;
		// populate items, discounts, & shipping
		// calculate subtotal
		//
		// populate
		// cartitem = template // .name // .name.textContent = item.variation.name
		// ls[{"name": "", "price": ""}]
		let ls = [];
		epic.cart.current.items.every(item => {
			//
		});
		localStorage.setItem("epicCart", "")
	},
	"remove": () => {
		//
	},
	"addtocart": (x, el) => {
		if(el === undefined) {return}
		if(typeof el !== "object") {return}
		//
		el = epic.js.getref(el);
		if(el === undefined) {return}
		//
		if(!el.hasOwnProperty("product")) {return}
		if(!el.product.hasOwnProperty("options")) {return}
		if(!el.product.options.hasOwnProperty("variation")) {return}
		// cartitem keys
		let keys = [], cartitem;
		//
		if(el.hasOwnProperty("cartitem")) {cartitem = el.cartitem}
		else if(epic.cart.ref.hasOwnProperty("cartitem")) {
			cartitem = epic.cart.ref.cartitem[0]
		}
		if(cartitem === undefined) {return}
		//
		if(typeof cartitem === "string") {keys.push(cartitem)}
		else if(Array.isArray(cartitem)) {keys = cartitem}
		else if(typeof cartitem === "object") {
			for(key in cartitem) {keys.push(key)}
		}
		else {return}
		//
		let add = true, obj = {};
		keys.every(key => {
			if(key === "el") {return true}
			if(key === "remove") {return true}
			if(key === "quantity") {return true}
			obj[key] = el.product.options.variation[key];
			return true
		});
		console.log(obj);
	},
	/*"addtocart": (x, el) => {
		if(el === undefined) {return}
		if(typeof el !== "object") {return}
		el = epic.js.getref(el);
		if(el === undefined) {return}
		if(!el.hasOwnProperty("product")) {return}
		if(!el.product.hasOwnProperty("options")) {return}
		if(!el.product.options.hasOwnProperty("variation")) {return}
		// cartitem keys
		let keys = [], cartitem;
		if(el.hasOwnProperty("cartitem")) {cartitem = el.cartitem}
		else if(epic.cart.ref.hasOwnProperty("cartitem")) {
			cartitem = epic.cart.ref.cartitem[0]
		}
		if(cartitem === undefined) {return}
		if(typeof cartitem === "string") {keys.push(cartitem)}
		else if(Array.isArray(cartitem)) {keys = cartitem}
		else if(typeof cartitem === "object") {
			for(name in cartitem) {keys.push(name)}
		}
		else {return}
		// add to cart
		let options = el.product.options, add = true, obj = {"quantity": "1"};
		if(el.hasOwnProperty("quantity")) {
			obj.quantity = options.quantity
		}
		keys.every(key => {
			if(key === "el") {return true}
			if(key === "remove") {return true}
			if(key === "quantity") {return true}
			obj[key] = options.variation[key];
			return true
		});
		// match to existing items
		epic.cart.current.items(item => {
			match = false;
			for(key in obj) {
				if()
			}
			//
			return true
		});
		// current.items = [{"image": "", "name": ""}]
		if()
	},*/
	/*"addtocart": (x, el) => {
		if(x === undefined) {return}
		if(typeof x !== "string") {return}
		if(el === undefined) {return}
		if(typeof el !== "object") {return}
		el = epic.js.getref(el);
		if(el === undefined) {return}
		if(!el.hasOwnProperty("product")) {return}
		if(!el.product.hasOwnProperty("options")) {return}
		if(!el.product.options.hasOwnProperty("variation")) {return}
		// add to cart
		let add = true, quantity = 1;
		if(el.product.options.hasOwnProperty("quantity")) {
			quantity = Number(el.product.options.quantity)
		}
		epic.cart.current.items.every(item => {
			if(item.variation === el.product.options.variation) {
				item.quantity += quantity;
				add = false;
				return false
			}
			return true
		});
		if(add === true) {
			epic.cart.current.items.push({
				"quantity": quantity,
				"variation": el.product.options.variation
			})
		}
		epic.cart.updatecart()
	},*/
	"update": (x, option) => {
		if(x === undefined) {return}
		if(typeof x !== "string") {return}
		if(option === undefined) {return}
		if(typeof option !== "object") {return}
		option = epic.js.getref(option);
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
		// match to variation
		if(option.product.hasOwnProperty("variations")) {
			let matches = [];
			option.product.variations.every(vari => {
				for(name in options) {
					if(name === "quantity") {continue}
					if(!vari.hasOwnProperty(name)) {continue}
					if(vari[name] !== options[name]) {return true}
				}
				matches.push(vari);
				return true
			});
			if(matches.length === 1) {options.variation = matches[0]}
			else {delete options.variation}
		}
	},
	"toggle": (state) => {
		if(state === undefined) {return}
		if(typeof state !== "string") {return}
		if(state !== "open" && state !== "close") {return}
		if(!epic.cart.ref.hasOwnProperty("cart")) {return}
		epic.cart.ref.cart.every(cart => {
			if(!cart.hasOwnProperty("state")) {return true}
			if(cart.state === "class") {
				//
			}
			//
			return true
		})
		// epic-cart-state='class'
		// epic-cart-close='inactive'
		// if has an option that matches new state, 
	},
	"close": () => {
		epic.cart.toggle("close")
	},
	"open": () => {
		epic.cart.toggle("open")
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
		epic.cart.ref.product.every(product => {
			product.elements = [];
			product.variations = [];
			epic.js.getref(epic.js.array(product.el.querySelectorAll("[epic-cart-element]"))).every(el => {
				if(el.el.getAttribute("epic-cart-element") === "variation") {
					product.variations.push(el)
				}
				if(el.hasOwnProperty("product")) {return true}
				product.elements.push(el);
				el.product = product
				return true
			});
			return true
		})
	},
	"init": () => {
		epic.js.refBuilder("cart");
		epic.cart.setproducts();
		epic.cart.setoptions()
	},
	"ref": {},
	"current": {
		"items": [],
		"discounts": [],
		"shipping": "false"
	}
}
if(epic.hasOwnProperty("js")) {epic.cart.init()}
