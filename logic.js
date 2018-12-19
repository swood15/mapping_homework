var myMap = L.map("map", {
  center: [
    50, 90
  ],
  zoom: 1,
});

L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

function markerSize(magnitude) {
  return magnitude**7
}

// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function(data) {
  
  console.log(data.features)
  // var quakeMarkers = []
  
  for (var i = 0; i < data.features.length; i++) {
    var quake = data.features[i];
    var coord = [
        parseFloat(quake.geometry.coordinates[1]),
        parseFloat(quake.geometry.coordinates[0])
    ];
    
    console.log([i])
    console.log(coord)
    console.log("Magnitude: " + quake.properties.mag)
    console.log("Power: " + markerSize(quake.properties.mag))
    
    L.circle(coord, {
      // stroke: 1,
      weight: 0.25,
      fillOpacity: 0.6,
      color: "black",
      fillColor: "red",
      radius: markerSize(quake.properties.mag)
    }).bindPopup("<h3>" + quake.properties.place + "</h3><hr><p>Magnitude: " + quake.properties.mag + "</p><p>" + new Date(quake.properties.time) + "</p>", maxWidth = 100, maxHeight = 50)
      .addTo(myMap);
  }  
});