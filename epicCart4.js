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
						let op = document.createElement("option");
						op.text = vari[opt.variation];
						opt.el.add(op)
					}
				})
			})
		}
	}
	epic.js.refBuilder("cart");
	if(epic.cart.hasOwnProperty("ref")) {
		epic.cart.options()
	}
}
