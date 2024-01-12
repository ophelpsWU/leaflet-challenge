

// fetch the data from the url
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(response) {
    // Create a map object.
    let myMap = L.map("map", {
        center: [36, -115],
        zoom: 5
    });

    // Add a tile layer.
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    let quakes=response.features;

    function getColor(d) {
        return d > 90 ? '#FF5F65' :
               d > 70 ? '#FCA35D' :
               d > 50 ? '#FDB72A' :
               d > 30 ? '#F7DB11' :
               d > 10 ? '#DCF400' :
                        '#A3F600' ;
    }

    // Looping through the cities array, create one marker for each city, bind a popup containing its name and population, and add it to the map.
    for (let i = 0; i < quakes.length; i++) {
        let dateTime = new Date(quakes[i].properties.time);
        L.circle([quakes[i].geometry.coordinates[1], quakes[i].geometry.coordinates[0]], {
            fillOpacity: 0.75,
            color: "black",
            weight: 1,
            fillColor: getColor(quakes[i].geometry.coordinates[2]),
            radius: quakes[i].properties.mag * 10000,
        }).bindPopup(`<h1>${new Date(quakes[i].properties.time)}</h1> <hr> <a href="${quakes[i].properties.url}">Details</a>`).addTo(myMap);
    };

    // Set up the legend.
	const legend = L.control({position: 'bottomright'});
	legend.onAdd = function (myMap) {

		const div = L.DomUtil.create('div', 'info legend');
		grades = [-10, 10, 30, 50, 70, 90];
		const labels = [];
		let from, to;

		for (let i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];
            console.log(getColor(from + 1))
			labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : '+'}`);
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(myMap);

});