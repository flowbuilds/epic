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
	"updatecart": (x) => {
		if(!epic.cart.ref.hasOwnProperty("cartitem")) {return}
		// update shipping + store cart
		// OR retrieve cart from storage
		// reset & populate cart items
		// reset & populate discounts
		// set shipping & calculate subtotal
		if(x === undefined || x == true) {
			let shp = "false";
			epic.cart.current.items.every(item => {
				if(item.hasOwnProperty("shipping") && item.shipping == true) {
					shp = "true"
					return false
				}
				return true
			});
			epic.cart.current.shipping = shp;
			localStorage.setItem("epicCart", JSON.stringify(epic.cart.current))
		}
		else {
			epic.cart.current = JSON.parse(localStorage.getItem("epicCart"))
		}
		//
		// populate
		//
		let cartitems = [], next = false, cycle = 0;
		let sibling = epic.cart.ref.cartitem[0].el;
		while(next === true && cycle < 20) {
			cartitems.push(sibling);
			sibling = sibling.nextSibling();
			if(!sibling.hasAttribute("epic-cart-element='cartitem'")) {
				next = false
			}
			cycle++
		}
		if(cartitems.length >= epic.cart.current.items.length) {
			cartitems.every((cartitem, i) => {
				if(i > epic.cart.current.items.length) {
					cartitem.remove()
				}
			})
		}
		let ogcartitem = epic.cart.ref.cartitem[0].el;
		epic.cart.current.items.every((item, i) => {
			let cartitem;
			if(i < cartitems.length) {cartitem = cartitems[i]}
			else {
				cartitem = ogcartitem.cloneNode(true);
				ogcartitem.parentNode.insertBefore(cartitem, ogcartitem.nextSibling)
			}
			for(let j = 0; j < cartitem.attributes.length; j++) {
				let attr = cartitem.attributes[j];
				console.log(attr);
				if(attr.specified === false) {continue}
				if(!attr.name.includes("epic-cart-")) {continue}
				if(attr.name === "epic-cart-element") {continue}
				let name = attr.name.replace("epic-cart-", "");
				console.log(name);
				console.log(attr.value);
				if(!item.hasOwnProperty(name)) {continue}
				let val = attr.value;
				if(val.charAt(0) === "!") {val = val.slice(1)}
				console.log(val);
				let el = epic.js.attribute(val, cartitem);
				// set value
				if(typeof el !== "object") {continue}
				if(el.tagName === "INPUT") {el.value = item[name]}
				else {el.textContent = item[name]}
			}
		});
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
		//
		// cartitem keys
		//
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
		// add to cart
		//
		let add = true, obj = {}, quantity = 1;
		if(el.product.options.hasOwnProperty("quantity")) {
			quantity = Number(el.product.options.quantity)
		}
		//
		keys.every(key => {
			if(key === "el") {return true}
			if(key === "remove") {return true}
			if(key === "quantity") {return true}
			obj[key] = el.product.options.variation[key];
			return true
		});
		console.log(obj);
		//
		epic.cart.current.items.every(item => {
			let match = true;
			for(key in obj) {
				if(!item.hasOwnProperty(key)) {continue}
				if(obj[key] != item[key]) {
					match = false;
					break
				}
			}
			if(match === true) {
				item.quantity = Number(item.quantity) + quantity;
				item.quantity = item.quantity.toString();
				add = false;
				return false
			}
			return true
		});
		//
		if(add === true) {
			obj.quantity = quantity.toString();
			epic.cart.current.items.push(obj)
		}
		console.log(epic.cart.current);
		epic.cart.updatecart()
	},
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
