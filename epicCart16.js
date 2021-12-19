/* epic.cart */

if(typeof epic !== "undefined") {
	epic.cart = {
		"setoptions": () => {
			if(!epic.cart.ref.hasOwnProperty("option")) {return}
			if(!epic.cart.ref.hasOwnProperty("variation")) {return}
			epic.cart.ref.option.every(opt => {
				if(!opt.hasOwnProperty("variation")) {return true}
				epic.cart.ref.variation.every(vari => {
					if(!vari.hasOwnProperty(opt.variation)) {return true}
					if(opt.el.tagName === "SELECT") {
						for(let i = 0; i < opt.el.options.length; i++) {
							if(opt.el.options[i].text === vari[opt.variation]) {
								return true
							}
						}
						let op = document.createElement("option");
						op.text = vari[opt.variation];
						if(vari.hasOwnProperty("quantity")) {
							if(vari.quantity === 0 || vari.quantity === "") {
								op.setAttribute("disabled", "")
							}
						}
						opt.el.add(op);
					}
					return true
				});
				return true
			})
		},
		"setproducts": () => {
			if(!epic.cart.ref.hasOwnProperty("product")) {return}
			epic.cart.ref.product.every((product, i) => {
				epic.cart.ref.product[i].children = [];
				epic.js.ref(epic.js.array(product.el.querySelectorAll("[epic-cart-element]"))).every(item => {
					if(item.hasOwnProperty("product")) {return true}
					epic.cart.ref.product[i].children.push(item);
					item.product = epic.cart.ref.product[i];
					return true
				});
				return true
			})
		},
		"getvariation": () => {
			//
		},
		"getproduct": (id) => {
			if(id === undefined) {return}
			if(typeof id !== "string") {return}
			if(!epic.cart.ref.hasOwnProperty("product")) {return}
			let x;
			epic.cart.ref.product.every((p, i) => {
				if(p.id === id) {
					x = epic.cart.ref.product[i];
					return false
				}
				return true
			});
			return x
		},
		"updateproduct": (product, option, value) => {
			product = epic.cart.getproduct(product);
			if(product === undefined) {return}
			if(option === undefined) {return}
			if(typeof option !== "string") {return}
			if(value === undefined) {return}
			if(typeof value !== "string") {return}
			// apply update(s)
			product[option] = value;
			console.log(product);
			// match to a variation
		},
		"addtocart": (product) => {
			if(product === undefined) {return}
			if(typeof product !== "string") {return}
			product = epic.cart.getproduct(product);
			if(product === undefined) {return}
			console.log(product);
			let obj = {
				"name": product.id,
				"catalogid": "",
				"price": "",
				"quantity": "1"
			}
			console.log(obj);
			// collate options + inputs
			// add to the cart as a new item OR update existing
			// open cart modal
		},
		"current": []
	}
	epic.js.refBuilder("cart");
	if(epic.cart.hasOwnProperty("ref")) {
		epic.cart.setoptions();
		epic.cart.setproducts()
	}
}
