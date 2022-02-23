/* epic.maps */

if(typeof epic === "undefined") {var epic = {}}
epic.maps = {
	"bounds": (container) => {
		if(container === undefined) {return}
		if(!container.hasOwnProperty("map")) {return}
		let x = container.map.getBounds();
		return {
			"left": x._sw.lng,
			"top": x._ne.lat,
			"right": x._ne.lng,
			"bottom": x._sw.lat
		}
	},
	"options": (ref) => {
		if(typeof ref !== "object") {return {}}
		if(!ref.hasOwnProperty("options")) {return {}}
		if(typeof ref.options === "object" && !Array.isArray(ref.options)) {return ref.options}
		if(typeof ref.options !== "string" && !Array.isArray(ref.options)) {return {}}
		let options = {}, names = ref.options;
		if(ref.options === "string") {
			names = ref.options.split("&")
		}
		names.forEach(name => {
			if(ref.hasOwnProperty(name)) {
				options[name] = ref[name]
			}
		});
		return options
	},
	"popup": (marker) => {
		if(typeof marker !== "object") {return}
		if(!marker.hasOwnProperty("popup")) {return}
		//
	},
	"marker": (marker) => {
		if(!epic.maps.ref.hasOwnProperty("container")) {return}
		if(typeof marker !== "object") {return}
		function addToMap() {
			epic.maps.ref.container.every(container => {
				if(!container.hasOwnProperty("map")) {return true}
				if(!marker.hasOwnProperty("mapmarker")) {
					marker.mapmarker = []
				}
				let newmarker = document.createElement("div");
				if(marker.hasOwnProperty("class") && typeof marker.class === "string") {
					newmarker.classList.add(marker.class)
				}
				newmarker = new mapboxgl.Marker(newmarker)
				.setLngLat(marker.geo)
				.addTo(container.map);
				marker.mapmarker.push(newmarker);
				// filter
				if(marker.hasOwnProperty("filter") && marker.filter === true) {
					// ADD TO ITEM FILTER GROUP
				}
				// bounding
				//
				// popup
				//
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
		epic.maps.ref.marker.forEach(marker => {epic.maps.marker(marker)})
	},
	"initMap": () => {
		if(!epic.maps.ref.hasOwnProperty("container")) {return}
		epic.maps.ref.container.every((container, i) => {
			// map
			if(!container.hasOwnProperty("options")) {
				container.options = {}
				//epic.maps.ref.container[i].options = {}
			}
			//epic.maps.ref.container[i].options = epic.maps.options(epic.maps.ref.container[i]);
			//container = epic.maps.ref.container[i];
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
