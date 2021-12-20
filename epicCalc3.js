/* epic.calc */

if(typeof epic !== "undefined") {
	epic.calc = {
		"update": (name) => {
			console.log("update( )");
			console.log("name: " + name);
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
				// store original + calculate & display
				// calc=![1b]*[1c]*[1d]*[1a]*365
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
								y = input.el.value;
								return false
							}
							return true
						});
						if(y === undefined) {return true}
						calc = calc.replace(x, y)
					}
					else {ev = true}
				}
				if(ev !== true) {return true}
				calc = eval(calc);
				if(calc === undefined) {return true}
				// TEMPORARY
				output.el.textContent = calc;
				return true
			})
		}
	}
	epic.js.refBuilder("calc");
	if(epic.calc.hasOwnProperty("ref")) {
		//
	}
}
