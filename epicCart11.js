/* epic.cart */

if(typeof epic !== "undefined") {
	epic.cart = {
		"options": () => {
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
		"addtocart": (product) => {
			if(product === undefined) {return}
			if(typeof product !== "string") {return}
			if(!epic.cart.ref.hasOwnProperty("product")) {return}
			epic.cart.ref.product.every((p, i) => {
				if(p.name === product) {
					product = epic.cart.ref.product[i];
					return false
				}
				return true
			});
			if(typeof product === "string") {return}
			console.log(product)
		}
	}
	epic.js.refBuilder("cart");
	if(epic.cart.hasOwnProperty("ref")) {
		epic.cart.options()
	}
}
