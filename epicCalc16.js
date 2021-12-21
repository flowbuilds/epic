/* epic.calc */

if(typeof epic !== "undefined") {
	epic.calc = {
		"update": (name) => {
			console.log("update( )");
			if(!epic.calc.ref.hasOwnProperty("output")) {return}
			let outputs = [];
			if(name !== undefined && name !== "") {
				if(typeof name !== "string") {return}
				epic.calc.ref.output.every(output => {
					if(!output.hasOwnProperty("name")) {return true}
					if(output.name === name) {outputs.push(output)}
					return true
				});
				if(outputs.length === 0) {return}
			}
			else {outputs = epic.calc.ref.output}
			console.log(outputs);
			outputs.every(output => {
				if(!output.hasOwnProperty("calc")) {return true}
				// store original text, if any
				if(!output.hasOwnProperty("ogtext")) {
					if(output.el.textContent !== "") {
						output.ogtext = output.el.textContent
					}
				}
				// replace calc vars with input values
				let calc = output.calc, ev = false, cycle = 0;
				while(ev === false && cycle < 20) {
					cycle++;
					let i = calc.indexOf("[");
					let j = calc.indexOf("]");
					if(i !== -1 && j !== -1) {
						let x = calc.slice(i + 1, j), y;
						epic.calc.ref.input.every(input => {
							if(!input.hasOwnProperty("name")) {return true}
							if(input.name === x) {
								console.log(input.name);
								console.log(input.el.value);
								if(input.el.value === "") {y = false}
								else {y = input.el.value}
								return false
							}
							return true
						});
						if(y === undefined) {return true}
						else if(y === false) {
							if(output.el.tagName === "INPUT") {
								output.el.value = ""
							}
							else if(output.hasOwnProperty("ogtext")) {
								output.el.textContent = output.ogtext
							}
							return true
						}
						calc = calc.replace("[" + x + "]", y)
					}
					else {ev = true}
				}
				// calculate
				calc = eval(calc);
				if(calc === undefined) {return true}
				// format
				if(output.hasOwnProperty("decimal")) {
					calc = Number(calc.toFixed(output.decimal))
				}
				if(output.hasOwnProperty("format")) {
					//
				}
				// display
				if(output.el.tagName === "INPUT") {
					output.el.value = calc
				}
				else {output.el.textContent = calc}
				return true
			})
		}
	}
	epic.js.refBuilder("calc");
	if(epic.calc.hasOwnProperty("ref")) {
		//
	}
}
