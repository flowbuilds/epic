/* epic.calc */

if(typeof epic === "undefined") {var epic = {}}
epic.calc = {
	"update": (name) => {
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
				let i = calc.indexOf("["), j = calc.indexOf("]");
				let k = calc.indexOf("{"), l = calc.indexOf("}");
				if(i !== -1 && j !== -1 || k !== -1 && l !== -1) {
					let key = "input", a, b, x, y;
					if(i !== -1 && j !== -1) {a = i; b = j}
					else {key = "output"; a = k; b = l}
					x = calc.slice(a + 1, b);
					// inputs
					epic.calc.ref[key].every(input => {
						if(!input.hasOwnProperty("name")) {return true}
						if(input.name === x) {
							let value;
							if(input.el.tagName === "INPUT") {value = input.el.value}
							else {value = input.el.textContent}
							if(input.hasOwnProperty("ogtext") && value === input.ogtext) {y = false}
							else if(value === "") {y = false}
							else {y = value}
							if(y === false) {
								if(input.hasOwnProperty("default")) {
									y = input.default.toString()
								}
							}
							if(y !== false) {
								if(input.hasOwnProperty("format")) {
									if(input.format.toLowerCase() === "usd") {
										y = Number(y.replace(/[$,]/g, ""))
									}
									else if(input.format === "%") {
										y = Number(y) / 100
									}
								}
							}
							return false
						}
						return true
					});
					// output
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
					if(key === "output") {x = "{" + x + "}"}
					else {x = "[" + x + "]"}
					calc = calc.replace(x, y);
				}
				else {ev = true}
			}
			// calculate
			calc = eval(calc);
			if(calc === undefined) {return true}
			// format
			let dec = 0;
			if(output.hasOwnProperty("decimal")) {
				dec = output.decimal
			}
			calc = calc.toFixed(dec);
			if(output.hasOwnProperty("format")) {
				let sepa, sepb, cur, cycle = 0;
				if(output.format.toLowerCase() === "usd") {
					sepa = "."; sepb = ","; cur = "$"
				}
				if(sepa !== undefined && sepb !== undefined) {
					let i = calc.indexOf(".");
					if(i !== -1) {
						i = calc.length - i;
						calc = calc.replace(".", sepa)
					}
					else {i = 0}
					i += 3;
					while(cycle < 10 && i < calc.length) {
						calc = calc.slice(0, calc.length - i) + sepb + calc.slice(calc.length - i)
						i += 4;
						cycle++
					}
				}
				if(cur !== undefined) {calc = cur + calc}
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
if(epic.hasOwnProperty("js")) {
	epic.js.refBuilder("calc")
}
if(epic.calc.hasOwnProperty("ref")) {
	epic.calc.update()
}
