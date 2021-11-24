function epicMapboxGetBounds(map) {
	if(map === undefined) {return}
	let x = map.getBounds();
	return {
		"left": x._sw.lng,
		"top": x._ne.lat,
		"right": x._ne.lng,
		"bottom": x._sw.lat
	}
}

function epicMapMarkers(ref) {
	if(ref === undefined) {
		epicError("epicMapMarkers()", true, "ref");
		return
	}
	else if(typeof ref !== "object") {
		epicError("epicMapMarkers()", false, "ref", ref, "object");
		return
	}
	for(group in ref) {
		if(!ref[group].hasOwnProperty("map")) {continue}
		ref[group].map.every((map, i) => {
			if(!map.hasOwnProperty("map") || !map.options.hasOwnProperty("markers")) {return true}
			if(!map.options.hasOwnProperty("platform")) {
				// error: missing platform
				return true
			}
			if(typeof map.options.platform !== "string") {
				// error: incompatible platform
				return true
			}
			if(!Array.isArray(map.options.markers)) {
				// error: incompatible markers
				return true
			}
			ref[group].map[i].options.markersRef = map.options.markers;
			delete ref[group].map[i].options.markers;
			ref[group].map[i].options.markers = [];
			let markers = ref[group].map[i].options.markers;
			map.options.markersRef.every((marker, i) => {
				if(marker.hasOwnProperty("el") && marker.hasOwnProperty("options")) {
					if(!marker.options.hasOwnProperty("marker-options")) {
						// error: missing marker-options option
						return true
					}
					if(!marker.options["marker-options"].hasOwnProperty("geo")) {
						// error: missing geo option
						return true
					}
					markers.push({
						"el": undefined,
						"options": {
							"marker": undefined,
							"marker-options": marker.options["marker-options"],
							"marker-ref": map.options.markersRef[i]
						}
					})
				}
				else if(marker.hasAttribute("epic-marker-options")) {
					let options = epicAttribute(marker.getAttribute("epic-marker-options"));
					if(!options.hasOwnProperty("geo")) {
						// error: missing geo option
						return true
					}
					markers.push({
						"el": undefined,
						"options": {
							"marker": undefined,
							"marker-options": options,
							"marker-ref": {
								"el": map.options.markersRef[i]
							}
						}
					})
				}
				else {
					// error: incompatible marker
				}
				return true
			});
			map = ref[group].map[i];
			if(markers.length === 0) {return true}
			// markers = [{"el": el, "options": {"marker-options": {}}}]
			if(map.options.platform.toLowerCase() === "mapbox") {
				let mapboxClient = mapboxSdk({accessToken: mapboxgl.accessToken});
				function addToMap(options, j) {
					let newMarker = document.createElement("div"), popup;
					if(options.hasOwnProperty("class")) {
						newMarker.classList.add(options.class)
					}
					if(options.hasOwnProperty("popup") && typeof options.popup === "object") {
						if(Array.isArray(options.popup)) {popup = options.popup[0]}
						else {popup = options.popup}
						let popupOptions = {}
						if(popup.hasAttribute("epic-popup-options")) {
							popupOptions = epicAttribute(popup.getAttribute("epic-popup-options"), popup)
						}
						popup = new mapboxgl.Popup(popupOptions).setDOMContent(popup)
					}
					if(popup !== undefined) {
						newMarker = new mapboxgl.Marker(newMarker)
						.setLngLat(options.geo)
						.setPopup(popup)
						.addTo(map.map)
					}
					else {
						newMarker = new mapboxgl.Marker(newMarker)
						.setLngLat(options.geo)
						.addTo(map.map)
					}
					markers[j].options.marker = newMarker;
					markers[j].el = newMarker._element;
					ref[group].map[i].options.markers[j].options["marker-options"].marker = newMarker;
					if(markers[j].options["marker-options"].hasOwnProperty("filter") && markers[j].options["marker-options"].filter == true) {
						if(markers[j].options["marker-ref"].options.hasOwnProperty("filter-group")) {
							markers[j].options["marker-ref"].options["filter-group"].push(markers[j])
						}
					}
					// bounding
					if(map.options.hasOwnProperty("bounds")) {
						map.options.bounds.extend(options.geo);
						if(j === markers.length - 1) {
							let pad = 0;
							if(map.options.hasOwnProperty("padding")) {
								pad = map.options.padding
							}
							map.map.fitBounds(map.options.bounds, {padding: pad})
						}
					}
				}
				markers.every((marker, j) => {
					let options = marker.options["marker-options"];
					if(Array.isArray(options.geo)) {
						addToMap(options, j)
					}
					else if(typeof options.geo === "string") {
						mapboxClient.geocoding.forwardGeocode({
							query: options.geo,
							autocomplete: false,
							limit: 1
						})
						.send()
						.then(resp => {
							if(!resp || !resp.body || !resp.body.features || !resp.body.features.length) {
								console.error("Invalid Mapbox geocode response:")
								console.error(resp)
							}
							options.geo = resp.body.features[0].center;
							addToMap(options, j)
						})
					}
					else {
						// error: incompatible geo option
					}
					return true
				})
			}
			else if(maps.options.platform.toLowerCase() === "googlemaps") {
				// error: Google Maps not supported
			}
			else {
				// error: platform not recognised
				return true
			}
			//
			return true

		})
	}
}

function epicMapBuilder(ref) {
	if(ref === undefined) {
		epicError("epicMapBuilder()", true, "ref");
		return
	}
	else if(typeof ref !== "object") {
		epicError("epicMapBuilder()", false, "ref", ref, "object");
		return
	}
	for(group in ref) {
		if(ref[group].hasOwnProperty("map")) {
			ref[group].map.forEach((map, i) => {
				if(map.options.hasOwnProperty("platform")) {
					if(map.options.platform === "mapbox") {
						let options = {}
						if(map.el.hasAttribute("epic-mapbox-options")) {
							options = epicAttribute(map.el.getAttribute("epic-mapbox-options"))
						}
						options.container = map.el.getAttribute("id");
						ref[group].map[i].map = new mapboxgl.Map(options);
						// nav controls
						if(map.options.hasOwnProperty("nav") && map.options.nav == true) {
							ref[group].map[i].map.addControl(new mapboxgl.NavigationControl())
						}
						// marker bounding
						if(map.options.hasOwnProperty("bounding") && map.options.bounding == true) {
							ref[group].map[i].options.bounds = new mapboxgl.LngLatBounds()
						}
					}
					else if(map.options.platform === "googlemaps") {
						console.error("epicMaps.js does not currently support Google Maps")
					}
				}
			})
		}
	}
}

function epicMapInit() {
	epicRefBuilder("maps");
	if(epicRef.hasOwnProperty("maps")) {
		epicMapBuilder(epicRef.maps);
		epicMapMarkers(epicRef.maps)
	}
	else {
		console.error("EPIC error: epicMaps.js failed to initialise")
	}
}

epicMapInit();
