/* epic.forms */

if(typeof epic !== "object") {var epic = {}}
epic.forms = {
	"submit": (ref, el) => {
		if(typeof ref !== "object" && typeof el === "object") {ref = epic.js.getref(el)}
		if(typeof ref !== "object") {return}
		if(!ref.hasOwnProperty("form")) {return}
		if(ref.form.tagName.toLowerCase() !== "form") {return}
		let method = ref.form.getAttribute("method");
		let action = ref.form.getAttribute("action");
		let data = {};
		if(ref.hasOwnProperty("data")) {data = ref.data}
		let inputs = epic.js.getall("thisinput", ref.el);
		inputs.every(input => {
			if(input.type === "submit") {return true}
			if(!input.hasAttribute("name") || input.name === "") {return true}
			// input types formatting
			data[input.name] = input.value;
			return true
		});
		let req = new XMLHttpRequest();
		req.onreadystatechange = () => {
			if(req.readyState == 4) {
				if(String(req.status).charAt(0) == 2) {
					ref.form.style.display = "none";
					ref.success.style.display = "block"
				}
				else {
					ref.error.style.display = "block"
				}
			}
		}
		req.open(method, action);
		if(ref.hasOwnProperty("headers")) {
			for(key in ref.headers) {
				req.setRequestHeader(key, ref.headers[key])
			}
		}
		req.send(JSON.stringify({"data": data}))
	},
	"disable": (ref) => {
		if(ref === undefined) {
			if(epic.forms.ref.hasOwnProperty("form")) {ref = epic.forms.ref.form}
			else {return}
		}
		else if(typeof ref === "object") {
			if(!Array.isArray(ref)) {ref = [ref]}
		}
		else {return}
		ref.every(r => {
			if(!r.hasOwnProperty("form")) {return true}
			if(r.form.tagName.toLowerCase() !== "form") {return true}
			$(r.form).submit((e) => {
				e.preventDefault();
				epic.forms.submit(r);
				return false
			});
			return true
		})
	},
	"init": () => {
		epic.js.refBuilder("forms");
		if(epic.forms.ref.hasOwnProperty("form")) {
			epic.forms.ref.form.forEach(ref => {
				ref.form = ref.el.querySelector("form");
				ref.success = ref.el.querySelector(".w-form-done");
				ref.error = ref.el.querySelector(".w-form-fail");
				epic.forms.disable(ref)
			})
		}
	},
	"ref": {}
}
if(epic.hasOwnProperty("js")) {epic.forms.init()}
