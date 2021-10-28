mapboxgl.accessToken = "pk.eyJ1IjoidGhlY2hyaXNlbHNvbiIsImEiOiJjazY2aWMwYW4wNHN3M2xwajVwdXg5bnZwIn0.qN17abkQA21Ry6Bu2PbMBA";

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
			let markers = [];
			map.options.markers.every(marker => {
				if(marker.hasOwnProperty("el") && marker.hasOwnProperty("options")) {
					if(!marker.options.hasOwnProperty("marker-options")) {
						// error: missing marker-options option
						return true
					}
					if(!marker.options["marker-options"].hasOwnProperty("geo")) {
						// error: missing geo option
						return true
					}
					markers.push(marker)
				}
				else if(marker.hasAttribute("epic-marker-options")) {
					let options = epicAttributes(marker.getAttribute("epic-marker-options"));
					if(!options.hasOwnProperty("geo")) {
						// error: missing geo option
						return true
					}
					markers.push({"el": marker, "options": {"marker-options": options}})
				}
				else {
					// error: incompatible marker
				}
				return true
			});
			if(markers.length === 0) {return true}
			ref[group].map[i].options.markersRef = map.options.markers;
			ref[group].map[i].options.markers = markers;
			map = ref[group].map[i];
			markers = map.options.markers;
			// markers = [{"el": el, "options": {"marker-options": {}}}]
			if(map.options.platform.toLowerCase() === "mapbox") {
				let mapboxClient = mapboxSdk({accessToken: mapboxgl.accessToken});
				function addToMap(options, j) {
					let newMarker = document.createElement("div");
					if(options.hasOwnProperty("class")) {
						newMarker.classList.add(options.class)
					}
					newMarker = new mapboxgl.Marker(newMarker)
					.setLngLat(options.geo)
					.addTo(map.map);
					markers[j].options.marker = newMarker;
					markers[j].el = newMarker.element;
					console.log(markers);
					console.log(map.options.markersRef);
					map.options.markersRef.every((mref, k) => {
						console.log("markerRef")
					})
					// TEMPORARY
					//
					//
					//
					//
					//
					/*let items = epicRef.filters[group].item;
					if(!items[j].hasOwnProperty("filter")) {
						items[j].filter = []
					}
					items[j].filter.push({"el": marker._element});*/
					//
					//
					// bounding
					if(map.options.hasOwnProperty("bounds")) {
						map.options.bounds.extend(data.geo);
						if(j === ref[group].map[i].options.markers.data.length - 1) {
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
				//
				//
				markers.data.every((data, j) => {
					if(data.hasOwnProperty("marker-data")) {
						data = data["marker-data"]
					}
					else if(data.hasOwnProperty("options") && data.options.hasOwnProperty("marker-data")) {
						data = data.options["marker-data"]
					}
					// data.geo & data.filter
					if(!data.hasOwnProperty("geo")) {
						// error: missing geo
						return true
					}
					if(Array.isArray(data.geo)) {addToMap(data, j)}
					else if(typeof data.geo === "string") {
						mapboxClient.geocoding.forwardGeocode({
							query: data.geo,
							autocomplete: false,
							limit: 1
						})
						.send()
						.then(resp => {
							if(!resp || !resp.body || !resp.body.features || !resp.body.features.length) {
								console.error("Invalid Mapbox geocode response:")
								console.error(resp)
							}
							data.geo = resp.body.features[0].center;
							addToMap(data, j)
						})
					}
					//
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
							options = epicAttributes(map.el.getAttribute("epic-mapbox-options"))
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
