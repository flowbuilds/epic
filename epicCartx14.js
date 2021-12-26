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
			let req = {"items": []}
			epic.cart.current.forEach(item => {
				if(!item.hasOwnProperty("variation")) {return true}
				let obj = {
					"quantity": "1",
					"data": item.variation
				}
				if(item.hasOwnProperty("quantity")) {
					obj.quantity = item.quantity.toString()
				}
				req.items.push(obj);
				return true
			});
			console.log(req);
			console.log(y);
			// ADD DISCOUNTS
			let xhr = new XMLHttpRequest();
			xhr.open("POST", y, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.responseType = "json";
			xhr.onload = () => {console.log(xhr.response)}
			xhr.send()
		}
		if(x === "square") {
			// y = store location id
			if(y === undefined) {return}
			if(typeof y !== "string") {return}
			// API request
			// GENERATE AN IDEMPOTENCY KEY
			let obj = {
				"idempotency_key": "xxxx-xxxx-xxxx-xxxx",
				"order": {
					"order": {
						"location_id": y,
						"line_items": []
					}
				}
			}
			epic.cart.current.forEach(item => {
				if(!item.hasOwnProperty("variation")) {return true}
				if(!item.variation.hasOwnProperty("catalogid")) {return true}
				let quantity = "1";
				if(item.hasOwnProperty("quantity")) {quantity = item.quantity.toString()}
				obj.order.order.line_items.push({
					"catalog_object_id": item.variation.catalogid,
					"quantity": quantity
				});
				return true
			});
			console.log(obj)
			// ADD DISCOUNTS
			let req = new XMLHttpRequest();
			req.open("POST", "https://connect.squareup.com/v2/locations/" + y + "/checkouts", true);
			req.responseType = "json";
			req.setRequestHeader("Authorization", "Bearer " + z);
			req.onload = () => {
				if(req.status == 200) {
					if(req.response.hasOwnProperty("checkout") && 
						req.response.checkout.hasOwnProperty("checkout_page_url")) {
						console.log(req.response.checkout.checkout_page_url)
					}
					else {
						console.log("API Request Error: Response does not include .checkout or .checkout.checkout_page_url");
						console.log(req.response)
					}
				}
				else {console.log("API Request Error: Bad Response")}
			}
			req.send()
		}
	},
	"updatecart": () => {
		// cycle through .current & populate items
	},
	"remove": () => {
		//
	},
	"addtocart": (x, el) => {
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
		epic.cart.current.every(product => {
			if(product.variation === el.product.options.variation) {
				product.quantity += quantity;
				add = false;
				return false
			}
			return true
		});
		if(add === true) {
			epic.cart.current.push({
				"quantity": quantity,
				"variation": el.product.options.variation
			})
		}
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
	"current": []
}
if(epic.hasOwnProperty("js")) {epic.cart.init()}
