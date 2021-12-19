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
						// let x = false;
						for(let i = 0; i < opt.el.options.length; i++) {
							if(opt.el.options[i].text === vari[opt.variation]) {
								// x = true;
								// break
								return true
							}
						}
						let op = document.createElement("option");
						op.text = vari[opt.variation];
						opt.el.add(op)
					}
				});
				return true
			})
		}
	}
	epic.js.refBuilder("cart");
	if(epic.cart.hasOwnProperty("ref")) {
		epic.cart.options()
	}
}
