// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(data.features);
});

function markerSize(mag) {
    return mag**7
}

function getColor(mag) {
    return  mag > 7 ? '#b35806':
            mag > 6 ? '#e08214':
            mag > 5 ? '#fdb863':
            mag > 4 ? '#fee0b6':
            mag > 3 ? '#d8daeb':
            mag > 2 ? '#b2abd2':
            mag > 1 ? '#8073ac':
                      '#542788';
}

function createFeatures(quakeData) {
    console.log(quakeData)
    
    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake   
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + 
            "</h3><hr><p>Magnitude: " + feature.properties.mag + 
            "</p><p>" + new Date(feature.properties.time) + "</p>");
    }
    
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    var earthquakes = L.geoJSON(quakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    function pointToLayer(feature,latlng){
        return new L.circle(latlng,{
            stroke: false,    
            fillOpacity: 0.8,
            fillColor:getColor(feature.properties.mag),
            radius: markerSize(feature.properties.mag)
        })
    }

    createMap(earthquakes);
};

function createMap(earthquakes) {
    // Define streetmap and darkmap layers
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    var baseMaps = {
        "Street Map": streetmap,
        "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    var overlayMaps = {
        Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    var myMap = L.map("map", {
        center: [
        30, 0
        ],
        zoom: 3,
        layers: [darkmap, earthquakes]
    });

    // Create color legend
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 1, 2, 3, 4, 5, 6, 7],
            labels = [];

        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);
};