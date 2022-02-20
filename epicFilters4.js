/* epic.filters */

if(typeof epic === "undefined") {var epic = {}}
epic.filters = {
	"updateCounters": () => {
		console.log("epic.filters.updateCounters( )");
		console.log("epic.filters.count = " + epic.filters.count);
		if(!epic.filters.ref.hasOwnProperty("counter")) {return}
		epic.filters.ref.counter.every(counter => {
			counter.textContent = epic.filters.count
		})
	},
	"filterItems": () => {
		console.log("epic.filters.filterItems( )");
		console.log("epic.filters.active:");
		console.log(epic.filters.active);
		epic.filters.count = 0;
		if(!epic.filters.ref.hasOwnProperty("item")) {return}
		epic.filters.ref.item.every(item => {
			let state = "active";
			//
			//
			//
			//
			//
			epic.js.state(state, item.el);
			if(state === "active") {epic.filters.count++}
			return true
		})
	},
	"getInputs": () => {
		console.log("epic.filters.getInputs( )");
		if(!epic.filters.ref.hasOwnProperty("input")) {return}
		epic.filters.active = {};
		epic.filters.ref.input.every(input => {
			if(input.el.value === "") {return true}
			if(!input.hasOwnProperty("name")) {return true}
			if(typeof input.name !== "string") {return true}
			let eltype, value = input.el.value, type;
			if(input.el.hasAttribute("type")) {
				eltype = input.el.getAttribute("type")
			}
			// format
			if(eltype === "checkbox") {
				if(input.el.checked == true) {
					if(input.hasOwnProperty("value")) {
						value = input.value;
						if(typeof value === "string") {
							value = epic.js.value(value)
						}
					}
					else {value = true}
				}
				else {return true}
			}
			// store
			if(value === undefined) {return true}
			if(typeof value === "string") {value = value.toLowerCase()}
			if(input.hasOwnProperty("type")) {
				type = input.type
			}
			if(!epic.filters.active.hasOwnProperty(input.name)) {
				epic.filters.active[input.name] = []
			}
			epic.filters.active[input.name].push({"type": type, "value": value})
			return true
		})
	},
	"update": () => {
		console.log("epic.filters.update( )");
		epic.filters.getInputs();
		epic.filters.filterItems();
		epic.filters.updateCounters()
	},
	"reset": () => {
		if(!epic.filters.ref.hasOwnProperty("input")) {return}
		epic.filters.ref.input.every(input => {
			let type = input.el.getAttribute("type");
			let tag = input.el.tagName.toLowerCase();
			if(type === "checkbox") {
				if(input.el.checked === true) {
					input.el.click()
				}
				return true
			}
			if(tag === "select") {
				input.el.selectedIndex = 0;
				return true
			}
			return true
		});
		epic.filters.update()
	},
	"init": () => {
		epic.js.refBuilder("filters");
		// url queries
		epic.filters.filter()
	},
	"ref": {},
	"active": {},
	"count": 0
}
if(epic.hasOwnProperty("js")) {epic.filters.init()}
