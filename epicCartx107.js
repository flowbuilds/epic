/* epic.cart */

if(typeof epic === "undefined") {var epic = {}}
epic.cart = {
	"checkout": (x, y) => {
		if(x === undefined) {return}
		if(typeof x !== "string") {return}
		if(x === "ext") {
			// y = webhook url
			if(y === undefined) {return}
			if(typeof y !== "string") {return}
			// request
			let xhr = new XMLHttpRequest();
			xhr.open("POST", y, true);
			xhr.setRequestHeader("Content-Type", "application/json");
			xhr.responseType = "json";
			xhr.onload = () => {
				console.log(xhr.response);
				if(xhr.status == 200) {
					if(xhr.response.hasOwnProperty("url")) {
						window.open(xhr.response.url, "_self")
					}
				}
				else {
					console.log("ERROR: Something went wrong:");
					console.log(xhr.status);
					console.log(xhr.response)
				}
			}
			xhr.send(JSON.stringify(epic.cart.current))
		}
	},
	"updatecart": (x) => {
		if(!epic.cart.ref.hasOwnProperty("cartitem")) {return}
		// shipping + get/set localstorage
		if(x === undefined || x == true) {
			let shp = "false";
			epic.cart.current.items.every(item => {
				if(item.hasOwnProperty("shipping") && item.shipping == true) {
					shp = "true";
					return false
				}
				return true
			});
			epic.cart.current.shipping = shp;
			localStorage.setItem("epicCart", JSON.stringify(epic.cart.current))
		}
		else if(localStorage.hasOwnProperty("epicCart")) {
			epic.cart.current = JSON.parse(localStorage.getItem("epicCart"))
		}
		// cartitems
		let ogcartitem = epic.cart.ref.cartitem[0].el;
		let cartitems = epic.js.getall("this[epic-cart-element='cartitem']", ogcartitem.parentNode);
		cartitems.forEach((citem, i) => {
			if(i !== 0 && i >= epic.cart.current.items.length) {citem.remove()}
		});
		cartitems = epic.js.getall("this[epic-cart-element='cartitem']", ogcartitem.parentNode);
		// empty state
		let est = "active", ist = "inactive";
		if(epic.cart.current.items.length >= 1) {est = "inactive"; ist = "active"}
		epic.js.state(ist, ogcartitem);
		if(epic.cart.ref.hasOwnProperty("cartempty")) {
			epic.js.state(est, epic.cart.ref.cartempty[0].el)
		}
		// items
		epic.cart.current.items.forEach((item, i) => {
			// get/create cartitem
			let cartitem;
			if(i < cartitems.length) {cartitem = cartitems[i]}
			else {
				cartitem = ogcartitem.cloneNode(true);
				ogcartitem.parentNode.insertBefore(cartitem, ogcartitem.nextSibling);
				epic.js.actions(cartitem)
			}
			// removers
			if(cartitem.hasAttribute("epic-cart-remove")) {
				let remrs = [], attr = cartitem.getAttribute("epic-cart-remove");
				if(attr.charAt(0) === "!") {attr = attr.slice(1)}
				attr = epic.js.attribute(attr, cartitem);
				if(Array.isArray(attr)) {remrs = attr}
				else if(typeof attr === "object") {remrs.push(attr)}
				remrs.forEach(remr => {
					remr.setAttribute("epic-cart-remove", i)
				})
			}
			// quanity
			if(cartitem.hasAttribute("epic-cart-quantity")) {
				let quans = [], attr = cartitem.getAttribute("epic-cart-quantity");
				if(attr.charAt(0) === "!") {attr = attr.slice(1)}
				attr = epic.js.attribute(attr, cartitem);
				if(Array.isArray(attr)) {quans = attr}
				else if(typeof attr === "object") {quans.push(attr)}
				quans.forEach(quan => {
					quan.setAttribute("epic-cart-quantity", i)
				})
			}
			// values
			for(let j = 0; j < cartitem.attributes.length; j++) {
				let attr = cartitem.attributes[j];
				if(attr.specified === false) {continue}
				if(!attr.name.includes("epic-cart-")) {continue}
				if(attr.name === "epic-cart-element") {continue}
				let name = attr.name.replace("epic-cart-", "");
				if(!item.hasOwnProperty(name)) {continue}
				let val = attr.value;
				if(val.charAt(0) === "!") {val = val.slice(1)}
				epic.js.output(item[name], epic.js.attribute(val, cartitem))
			}
		});
		// discitems
		let ogdiscitem, discitems;
		if(epic.cart.ref.hasOwnProperty("discountitem")) {
			ogdiscitem = epic.cart.ref.discountitem[0].el;
			discitems = epic.js.getall("this[epic-cart-element='discountitem']", ogdiscitem.parentNode);
			discitems.forEach((ditem, i) => {
				if(i !== 0 && i >= epic.cart.current.discounts.length) {ditem.remove()}
			});
			discitems = epic.js.getall("this[epic-cart-element='discountitem']", ogdiscitem.parentNode);
			// empty state
			let dest = "active", dist = "inactive";
			if(epic.cart.current.discounts.length >= 1) {dest = "inactive"; dist = "active"}
			epic.js.state(dist, ogdiscitem);
			if(epic.cart.ref.hasOwnProperty("discountempty")) {
				epic.js.state(dest, epic.cart.ref.discountempty[0].el)
			}
		}
		// discounts
		epic.cart.current.discounts.forEach((disc, i) => {
			// get/create discitem
			let discitem;
			if(i < discitems.length) {discitem = discitems[i]}
			else {
				discitem = ogdiscitem.cloneNode(true);
				ogdiscitem.parentNode.insertBefore(discitem, ogdiscitem.nextSibling);
				epic.js.actions(discitem)
			}
			// removers
			if(discitem.hasAttribute("epic-cart-remove")) {
				let remrs = [], attr = discitem.getAttribute("epic-cart-remove");
				if(attr.charAt(0) === "!") {attr = attr.slice(1)}
				attr = epic.js.attribute(attr, discitem);
				if(Array.isArray(attr)) {remrs = attr}
				else if(typeof attr === "object") {remrs.push(attr)}
				remrs.forEach(remr => {
					remr.setAttribute("epic-cart-remove", i)
				})
			}
			// values
			for(let j = 0; j < discitem.attributes.length; j++) {
				let attr = discitem.attributes[j];
				if(attr.specified === false) {continue}
				if(!attr.name.includes("epic-cart-")) {continue}
				if(attr.name === "epic-cart-element") {continue}
				let name = attr.name.replace("epic-cart-", "");
				if(!disc.hasOwnProperty(name)) {continue}
				let val = attr.value;
				if(val.charAt(0) === "!") {val = val.slice(1)}
				if(name === "value" && disc.hasOwnProperty("type") && disc.type.toLowerCase() === "percentage") {
					let els = epic.js.attribute(val, discitem);
					if(typeof els === "object") {
						if(!Array.isArray(els)) {els = [els]}
						els.forEach(el => {el.textContent = disc[name] + "%"})
					}
				}
				else {epic.js.output(disc[name], epic.js.attribute(val, discitem))}
			}
		});
		// subtotal
		if(epic.cart.ref.hasOwnProperty("total")) {
			let num = 0;
			// items
			epic.cart.current.items.every(item => {
				let quan = 1, price = 0;
				if(!item.hasOwnProperty("price")) {return true}
				if(typeof item.quantity === "string") {quan = Number(item.quantity)}
				else if(typeof item.quantity === "number") {quan = item.quantity}
				if(typeof item.price === "string") {price = Number(item.price)}
				else if(typeof item.price === "number") {price = item.price}
				num += (quan * price);
				return true
			});
			// discounts
			let added = [], pass = false, cycle = 0;
			while(pass === false && cycle < 50) {
				let best = {"val": undefined, "i": undefined};
				epic.cart.current.discounts.every((disc, i) => {
					if(added.includes(i)) {return true}
					if(!disc.hasOwnProperty("type")) {return true}
					if(!disc.hasOwnProperty("value")) {return true}
					if(typeof disc.value === "string" && isNaN(disc.value)) {return true}
					let total = num, val = disc.value;
					if(typeof val === "string") {val = Number(val)}
					if(disc.type.toLowerCase() === "amount") {total -= val}
					else if(disc.type.toLowerCase() === "percentage") {total -= total * (val / 100)}
					if(best.val === undefined || best.val !== undefined && total < best.val) {
						best.val = total;
						best.i = i
					}
					return true
				});
				if(best.val !== undefined) {
					num = best.val;
					added.push(best.i)
				}
				else {pass = true}
				cycle++
			}
			// display
			if(num < 0) {num = 0}
			epic.cart.ref.total.forEach(total => {
				epic.js.output(num, total.el)
			})
		}
		// idempotency_key
		let dt = new Date(), nums = "";
		dt = dt.toISOString().replace(/[^\w\s]/gi, "");
		for(let i = 0; i < 4; i++) {nums += Math.floor(Math.random() * 10).toString()}
		epic.cart.current.idempotency_key = "dotcom-" + dt + nums
	},
	"quantity": (x, el) => {
		if(el === undefined) {return}
		if(typeof el !== "object") {return}
		if(!el.hasAttribute("epic-cart-quantity")) {return}
		let i = Number(el.getAttribute("epic-cart-quantity"));
		if(isNaN(i) || i < 0) {return}
		if(i >= epic.cart.current.items.length) {return}
		epic.cart.current.items[i].quantity = el.value;
		epic.cart.updatecart()
	},
	"removediscount": (x, el) => {
		if(el === undefined) {return}
		if(typeof el !== "object") {return}
		if(!el.hasAttribute("epic-cart-remove")) {return}
		let i = Number(el.getAttribute("epic-cart-remove"));
		if(isNaN(i) || i < 0) {return}
		if(i >= epic.cart.current.discounts.length) {return}
		epic.cart.current.discounts.splice(i, 1);
		epic.cart.updatecart()
	},
	"remove": (x, el) => {
		if(el === undefined) {return}
		if(typeof el !== "object") {return}
		if(!el.hasAttribute("epic-cart-remove")) {return}
		let i = Number(el.getAttribute("epic-cart-remove"));
		if(isNaN(i) || i < 0) {return}
		if(i >= epic.cart.current.items.length) {return}
		epic.cart.current.items.splice(i, 1);
		epic.cart.updatecart()
	},
	"discount": (x) => {
		if(x === undefined || x === "") {return}
		if(typeof x !== "string") {return}
		x = x.toLowerCase();
		let match = false;
		if(epic.cart.ref.hasOwnProperty("discount")) {
			epic.cart.ref.discount.every(discount => {
				if(!discount.hasOwnProperty("name")) {return true}
				if(discount.name.toLowerCase() === x) {
					let add = true;
					epic.cart.current.discounts.every(cdisc => {
						if(cdisc.name.toLowerCase() === discount.name.toLowerCase()) {
							add = false;
							return false
						}
						return true
					});
					if(add === true) {
						let obj = {};
						for(key in discount) {
							if(key === "el") {continue}
							obj[key] = discount[key]
						}
						epic.cart.current.discounts.push(obj)
					}
					match = true;
					return false
				}
				return true
			});
		}
		if(match === false) {
			console.log("DISCOUNT does not exist")
		}
		epic.cart.updatecart()
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
		epic.cart.updatecart();
		if(x == true) {epic.cart.open()}
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
	"close": () => {
		if(!epic.cart.ref.hasOwnProperty("cart")) {return}
		epic.js.state("inactive", epic.cart.ref.cart[0].el)
	},
	"open": () => {
		if(!epic.cart.ref.hasOwnProperty("cart")) {return}
		epic.js.state("active", epic.cart.ref.cart[0].el)
	},
	"setoptions": () => {
		if(!epic.cart.ref.hasOwnProperty("option")) {return}
		if(!epic.cart.ref.hasOwnProperty("variation")) {return}
		let groups = [], options = {};
		epic.cart.ref.option.every(option => {
			if(!option.hasOwnProperty("name")) {return true}
			if(option.name.toLowerCase() === "quantity") {return true}
			if(groups.includes(option.name)) {return true}
			groups.push(option.name);
			options[option.name] = {};
			return true
		});
		epic.cart.ref.variation.forEach(vari => {
			groups.forEach(group => {
				if(vari.hasOwnProperty(group)) {
					if(!options[group].hasOwnProperty(vari[group])) {
						options[group][vari[group]] = []
					}
					groups.forEach(relgroup => {
						let obj = {}, store = false;
						if(relgroup !== group && vari.hasOwnProperty(relgroup)) {
							obj[relgroup] = vari[relgroup];
							store = true
						}
						if(store) {
							obj.quantity = vari.quantity;
							options[group][vari[group]].push(obj)
						}
					})
				}
			})
		});
		console.log(groups);
		console.log(options);
		epic.cart.ref.option.every(option => {
			// option.options = {"Heather Blue": ["size": "2XL", "quantity": 0]}
			// set order / populate options / disable unavailable?
			if(!option.hasOwnProperty("name")) {return true}
			if(option.name.toLowerCase() === "quantity") {return true}
			for(group in options) {
				if(group === option.name) {
					option.options = options[group];
					//
				}
			}
			//
			return true
		})
	},
	/*"setoptions": () => {
		if(!epic.cart.ref.hasOwnProperty("option")) {return}
		let opsall = {};
		epic.cart.ref.option.every(option => {
			if(!option.hasOwnProperty("name")) {return true}
			//
			if(option.hasOwnProperty("options")) {
				let options = [], source, x = option.options;
				if(typeof x === "string") {
					if(x === "variations") {x = "variation"}
					if(epic.cart.ref.hasOwnProperty(x)) {
						source = epic.cart.ref[x]
					}
				}
				if(source === undefined) {return true}
				source.every(ref => {
					for(let i = 0; i < options.length; i++) {
						if(options[i].value === ref[option.name]) {
							return true
						}
					}
					options.push({"value": ref[option.name]});
					if(!opsall.hasOwnProperty(option.name)) {opsall[option.name] = []}
					opsall[option.name].push({"ref": ref, "option": option, "value": ref[option.name]})
					return true
				});
				option.options = options
			}
			return true
		});
		console.log(opsall);
		// relative options
		// opsall = {"size": [{"ref": x, "value": "XS"}]}
		for(group in opsall) {
			// group = "size"
			console.log(group);
			opsall[group].forEach(opA => {
				// op = {"ref": x, "value": "XS"}
				for(name in opsall) {
					if(name === group) {continue}
					if(!opA.ref.hasOwnProperty(name)) {continue}
					console.log(name);
					opsall[name].forEach(opB => {
						//
						console.log(opB.value);
						if(opB.value === opA.ref[name]) {
							if(!opA.hasOwnProperty(name)) {opA[name] = []}
							opA[name].push({"rel": opB, "quantity": opA.ref.quantity})
						}
					})
				}
				console.log(opA);
			})
		}
	},*/
	/*"setoptions": () => {
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
	},*/
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
		epic.cart.updatecart(false);
		epic.cart.setproducts();
		epic.cart.setoptions()
	},
	"ref": {},
	"current": {
		"items": [],
		"discounts": [],
		"shipping": "false",
		"idempotency_key": ""
	}
}
if(epic.hasOwnProperty("js")) {epic.cart.init()}
