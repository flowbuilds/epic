/* epic.maps */

if(typeof epic === "undefined") {var epic = {}}
epic.maps = {
	"bounds": (container) => {
		if(typeof container !== "object") {return}
		let ref = epic.js.getref(container);
		if(typeof ref !== "object" || !ref.hasOwnProperty("map")) {return}
		let x = ref.map.getBounds();
		return {
			"left": x._sw.lng,
			"top": x._ne.lat,
			"right": x._ne.lng,
			"bottom": x._sw.lat
		}
	},
	"options": (ref) => {
		// TEMPORARY: ADD TO EPIC.JS?
		if(typeof ref !== "object") {return {}}
		if(!ref.hasOwnProperty("options")) {return {}}
		if(typeof ref.options === "object" && !Array.isArray(ref.options)) {return ref.options}
		if(typeof ref.options !== "string" && !Array.isArray(ref.options)) {return {}}
		let options = {}, names = ref.options;
		if(names === "string") {
			if(names === "*") {
				for(name in ref) {
					if(name === "el") {continue}
					if(name === "options") {continue}
					options.push(ref[name])
				}
				return options
			}
			names = ref.options.split("&")
		}
		names.forEach(name => {
			if(ref.hasOwnProperty(name)) {
				options[name] = ref[name]
			}
		});
		return options
	},
	"popup": (ref, mapmarker) => {
		if(typeof ref !== "object" || typeof mapmarker !== "object") {return}
		if(!ref.hasOwnProperty("popup") || !mapmarker.hasOwnProperty("marker")) {return}
		let popup = epic.js.getref(ref.popup), options = {};
		if(popup === undefined) {return}
		if(popup.hasOwnProperty("options")) {
			options = popup.options = epic.maps.options(popup.options)
		}
		popup.container = new mapboxgl.Popup(options).setDOMContent(popup.el.cloneNode(true));
		mapmarker.marker.setPopup(popup.container);
		mapmarker.popup = popup
	},
	"marker": (marker, bound) => {
		if(!epic.maps.ref.hasOwnProperty("container")) {return}
		if(typeof marker !== "object") {return}
		function addToMap() {
			epic.maps.ref.container.every(container => {
				if(!container.hasOwnProperty("map")) {return true}
				if(!marker.hasOwnProperty("mapmarker")) {
					marker.mapmarker = []
				}
				let newmarker = {"marker": document.createElement("div")};
				if(marker.hasOwnProperty("class") && typeof marker.class === "string") {
					newmarker.marker.classList.add(marker.class)
				}
				newmarker.marker = new mapboxgl.Marker(newmarker.marker)
				.setLngLat(marker.geo)
				.addTo(container.map);
				newmarker.el = newmarker.marker._element;
				if(marker.hasOwnProperty("inactive") && typeof marker.inactive === "string") {
					newmarker.el.setAttribute("epic-state-inactive", marker.inactive)
				}
				marker.mapmarker.push(newmarker);
				// bounding
				if(container.hasOwnProperty("bounds")) {
					container.bounds.extend(marker.geo);
					if(bound === true) {
						let padding = 0;
						if(container.hasOwnProperty("padding")) {
							padding = container.padding
						}
						container.map.fitBounds(container.bounds, {"padding": padding})
					}
				}
				// popup
				if(marker.hasOwnProperty("popup")) {
					epic.maps.popup(marker, marker.mapmarker[marker.mapmarker.length - 1])
				}
				return true
			})
		}
		let geo = true;
		if(!marker.hasOwnProperty("geo")) {geo = false}
		else if(!Array.isArray(marker.geo)) {geo = false}
		else if(marker.geo.length !== 2) {geo = false}
		if(!geo) {
			if(!marker.hasOwnProperty("address") && !marker.hasOwnProperty("lnglat")) {return}
			if(marker.hasOwnProperty("lnglat") && Array.isArray(marker.lnglat) && marker.lnglat.length === 2 
				&& typeof marker.lnglat[0] === "number" && typeof marker.lnglat[1] === "number") {
				marker.geo = marker.lnglat;
				addToMap()
			}
			else if(marker.hasOwnProperty("address") && typeof marker.address === "string") {
				let mapboxClient = mapboxSdk({accessToken: mapboxgl.accessToken});
				mapboxClient.geocoding.forwardGeocode({
					query: marker.address,
					autocomplete: false,
					limit: 1
				})
				.send()
				.then(response => {
					if(!response 
						|| !response.body 
						|| !response.body.features 
						|| !response.body.features.length) {
						console.error("Invalid Mapbox geocode response");
						console.error(response)
					}
					else {
						marker.geo = response.body.features[0].center;
						addToMap()
					}
				})
			}
			else {return}
		}
	},
	"initMarkers": () => {
		if(!epic.maps.ref.hasOwnProperty("container")) {return}
		if(!epic.maps.ref.hasOwnProperty("marker")) {return}
		epic.maps.ref.marker.forEach((marker, i) => {
			let bound = false;
			if(i === epic.maps.ref.marker.length - 1) {bound = true}
			epic.maps.marker(marker, bound)
		})
	},
	"initMap": () => {
		if(!epic.maps.ref.hasOwnProperty("container")) {return}
		epic.maps.ref.container.every((container, i) => {
			// map
			if(!container.hasOwnProperty("options")) {container.options = {}}
			container.options = epic.maps.options(container)
			container.options.container = container.el.id;
			container.map = new mapboxgl.Map(container.options);
			// nav
			if(container.hasOwnProperty("nav") && container.nav === true) {
				container.map.addControl(new mapboxgl.NavigationControl())
			}
			// bounding
			if(container.hasOwnProperty("bounding") && container.bounding === true) {
				container.bounds = new mapboxgl.LngLatBounds()
			}
			return true
		})
	},
	"init": () => {
		epic.js.refBuilder("maps");
		epic.maps.initMap();
		epic.maps.initMarkers()
	},
	"ref": {}
}
if(epic.hasOwnProperty("js")) {epic.maps.init()}
