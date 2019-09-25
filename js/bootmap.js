/* global L:false */
var map, featureList, app = {};
var flSearch = [],
  alSearch = [],
  msSearch = [],
  laSearch = [],
  txSearch = [];

// ================================================================
/* For Social Apps */
// ================================================================
//TODO (1) Edit this settings
app.author = "Shin Kobara, GCOOS";
app.copyright = "GCOOS";
app.title = "Clean Marinas";
app.html = "https://geo.gcoos.org/marina/";
app.desc = "Clean Marinas Program in the Gulf of Mexico";

// ================================================================
// Initial Map Settings
// ================================================================
//TODO (2) Edit coordinates, basemap, zoom level etc.
map = L.map("map", {
  zoomControl: false,
  scrollWheelZoom: false,
  zoom: 6,
  center: [28.0, -89.5],
  attributionControl: false
});
//var initBase = L.esri.basemapLayer('Topographic').addTo(map);

// ================================================================
// Basemap Layers
// ================================================================
//TODO (4) Edit initial basemap if necessary
var mapquestOSM = L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png", {
  maxZoom: 20,
  subdomains: ["otile1", "otile2", "otile3", "otile4"],
  attribution: 'Tiles courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA.'
});
var mapquestHYB = L.layerGroup([L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/sat/{z}/{x}/{y}.jpg", {
  maxZoom: 20,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"]
}), L.tileLayer("http://{s}.mqcdn.com/tiles/1.0.0/hyb/{z}/{x}/{y}.png", {
  maxZoom: 20,
  subdomains: ["oatile1", "oatile2", "oatile3", "oatile4"],
  attribution: 'Labels courtesy of <a href="http://www.mapquest.com/" target="_blank">MapQuest</a> <img src="http://developer.mapquest.com/content/osm/mq_logo.png">. Map data (c) <a href="http://www.openstreetmap.org/" target="_blank">OpenStreetMap</a> contributors, CC-BY-SA. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency | Points data from <a href="http://galvbay.org">galvbay.org</a>'
})]);
var esriOcean = L.layerGroup([L.esri.tiledMapLayer("http://services.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Base/MapServer", {
  attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org, and other contributors| Points data from <a href="http://galvbay.org">galvbay.org</a>'
}), L.esri.tiledMapLayer("http://server.arcgisonline.com/arcgis/rest/services/Ocean/World_Ocean_Reference/MapServer", {
  attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, GEBCO, NOAA, National Geographic, DeLorme, HERE, Geonames.org, and other contributors| Points data from <a href="http://galvbay.org">galvbay.org</a>'
})]);
var esriTopo = L.esri.tiledMapLayer("http://services.arcgisonline.com/arcgis/rest/services/World_Topo_Map/MapServer", {
  attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, HERE, DeLorme, TomTom, Intermap, increment P Corp., GEBCO, USGS, FAO, NPS, NRCAN, GeoBase, IGN, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), swisstopo, MapmyIndia, © OpenStreetMap contributors, GIS User Comm. | Points data from <a href="http://galvbay.org">galvbay.org</a>'
});
var esriImage = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; <a href="http://www.esri.com/">Esri</a>, DigitalGlobe, Earthstar Geographics, CNES/Airbus DS, GeoEye, USDA FSA, USGS, Getmapping, Aerogrid, IGN, IGP, swisstopo, and the GIS User Community | Points data from <a href="http://galvbay.org">galvbay.org</a>',
  maxZoom: 18,
});
var cartodb_light = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a> | Points data from <a href="http://galvbay.org">galvbay.org</a>',
  maxZoom: 18
});
var cartodb_dark = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a> | Points data from <a href="http://galvbay.org">galvbay.org</a>',
  maxZoom: 18
});
/* grouping basemap layers */
var baseLayers = {
  "Street Map": mapquestOSM,
  "Light": cartodb_light,
  "Dark": cartodb_dark,
  "Imagery with Streets": mapquestHYB,
  "Esri World Imagery": esriImage,
  //"Ocean": esriOcean,
  "Topography": esriTopo
};
map.addLayer(cartodb_light);

// Leaflet Map Base Functions
// Zoom control (bottom right)
// ================================================================
var zoomControl = L.control.zoom({
  position: "bottomright"
}).addTo(map);
// Home button - back to default extent (bottom right)
// ================================================================
L.control.defaultExtent({
  position: "bottomright"
}).addTo(map);
// GPS enabled geolocation control set to follow the user's location (bottom right)
// ================================================================
var locateControl = L.control.locate({
  position: "bottomright",
  drawCircle: true,
  follow: true,
  setView: true,
  keepCurrentZoomLevel: true,
  markerStyle: {
    weight: 1,
    opacity: 0.8,
    fillOpacity: 0.8
  },
  circleStyle: {
    weight: 1,
    clickable: false
  },
  icon: "fa fa-map-marker",
  metric: false,
  strings: {
    title: "My location", // title of the locate control
    metersUnit: "meters",
    feetUnit: "feet",
    popup: "You are within {distance} {unit} from this point",
    outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
  },
  locateOptions: {
    maxZoom: 17,
    watch: true,
    enableHighAccuracy: true,
    maximumAge: 10000,
    timeout: 10000
  }
}).addTo(map);
map.on('dragstart', locateControl._stopFollowing, locateControl);
// leaflet draw (top left corner)
// ================================================================
var drawnItems = L.featureGroup().addTo(map);
map.addControl(new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  }
}));
map.on('draw:created', function(event) {
  var layer = event.layer;
  drawnItems.addLayer(layer);
});
/* leaflet Measurement */
// ================================================================
L.Control.measureControl().addTo(map);
/* leaflet filelayer (load local files suc as GeoJSON, GPX, KML) */
// ================================================================
L.Control.FileLayerLoad.LABEL = '<i class="fa fa-folder-open"></i>';
L.Control.fileLayerLoad({
  fitBounds: true,
  layerOptions: {
    style: {
      color: 'red',
      opacity: 1.0,
      fillOpacity: 1.0,
      weight: 2,
      clickable: false
    }
  },
  // File size limit in kb (default: 1024) ?
  fileSizeLimit: 1024,
  // Restrict accepted file formats (default: .geojson, .kml, and .gpx) ?
  formats: [
    '.geojson',
    '.kml'
  ]
}).addTo(map);
//$('.leaflet-control-filelayer').hide();
$('.leaflet-top.leaflet-left').hide();

// esri geocode
var geoSearchControl = new L.esri.Geocoding.Controls.Geosearch({
  position: 'bottomright',
  providers: [
    new L.esri.Geocoding.Controls.Geosearch.Providers.FeatureLayer({
      url: '//services.arcgis.com/uCXeTVveQzP4IIcx/arcgis/rest/services/gisday/FeatureServer/0/',
      searchFields: ['Name', 'Organization'],
      label: 'GIS Day Events',
      bufferRadius: 5000,
      formatSuggestion: function(feature) {
        return feature.properties.Name + ' - ' + feature.properties.Organization;
      }
    })
  ]
}).addTo(map);
var results = new L.LayerGroup().addTo(map);
geoSearchControl.on('results', function(data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
  console.log('geocoding!');
});

// ================================================================
/* Attribution control (bottom right. Order:bottom to top) */
// ================================================================
function updateAttribution(e) {
  $.each(map._layers, function(index, layer) {
    if (layer.getAttribution) {
      $("#attribution").html((layer.getAttribution()));
    }
  });
}
map.on("layeradd", updateAttribution);
map.on("layerremove", updateAttribution);
var attributionControl = L.control({
  position: "bottomleft"
});
attributionControl.onAdd = function(map) {
  var div = L.DomUtil.create("div", "leaflet-control-attribution");
  //TODO (3) Edit bottom-left Attribution information
  div.innerHTML = "<span class='hidden-xs'><a href='https://products.gcoos.org/' target='_blank'>GCOOS</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
  return div;
};
map.addControl(attributionControl);


// ================================================================
// Layer Controls - Highlight & Clustering
// ================================================================
var highlight = L.geoJson(null);
var highlightStyle = {
  stroke: false,
  fillColor: "#00FFFF",
  fillOpacity: 0.7,
  radius: 10
};

function clearHighlight() {
  highlight.clearLayers();
}
/* Clear feature highlight when map is clicked */
// ================================================================
map.on("click", function(e) {
  highlight.clearLayers();
});
/* Single marker cluster layer to hold all clusters */
// ================================================================
var markerClusters = new L.MarkerClusterGroup({
  spiderfyOnMaxZoom: true,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  disableClusteringAtZoom: 16
});
map.addLayer(markerClusters);
map.addLayer(highlight);
/* Layer Size */
// ================================================================
$(window).resize(function() {
  sizeLayerControl();
});

function sizeLayerControl() {
  $(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}
/* Larger screens get expanded layer control and visible sidebar */
// ================================================================
if (document.body.clientWidth <= 767) {
  var isCollapsed = true;
} else {
  var isCollapsed = false;
}


// ================================================================
/* Empty layer placeholder to add to layer control for listening when to add/remove data to markerClusters layer */
// ================================================================
// Florida
var flmarinaLayer = L.geoJson(null);
var fl_marina = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "images/marina/fl_marina.png",
        iconSize: [22, 22],
        iconAnchor: [12, 24],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function(feature, layer) {
    //console.log(feature);
    if (feature.properties) {
      var p = feature.properties;
      var content;
      if (p.photo !== null && p.photo !== 'undefined') {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br  /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a><br /><br /><img src='" + p.photo + "' style='width:100%;' />";
      } else {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a>";
      }
      layer.on({
        click: function(e) {
          $("#feature-title").html(p.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="20" src="images/marina/fl_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      flSearch.push({
        name: layer.feature.properties.name,
        phone: layer.feature.properties.phone,
        source: "fl_marina",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

// Alabama
var almarinaLayer = L.geoJson(null);
var al_marina = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "images/marina/al_marina.png",
        iconSize: [22, 22],
        iconAnchor: [12, 24],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function(feature, layer) {
    //console.log(feature);
    if (feature.properties) {
      var p = feature.properties;
      var content;
      if (p.photo !== null && p.photo !== 'undefined') {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br  /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a><br /><br /><img src='" + p.photo + "' style='width:100%;' />";
      } else {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a>";
      }
      layer.on({
        click: function(e) {
          $("#feature-title").html(p.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="20" src="images/marina/al_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      alSearch.push({
        name: layer.feature.properties.name,
        phone: layer.feature.properties.phone,
        source: "al_marina",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

// Mississippi
var msmarinaLayer = L.geoJson(null);
var ms_marina = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "images/marina/ms_marina.png",
        iconSize: [22, 22],
        iconAnchor: [12, 24],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function(feature, layer) {
    //console.log(feature);
    if (feature.properties) {
      var p = feature.properties;
      var content;
      if (p.photo !== null && p.photo !== 'undefined') {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br  /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a><br /><br /><img src='" + p.photo + "' style='width:100%;' />";
      } else {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a>";
      }
      layer.on({
        click: function(e) {
          $("#feature-title").html(p.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="20" src="images/marina/ms_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      msSearch.push({
        name: layer.feature.properties.name,
        phone: layer.feature.properties.phone,
        source: "ms_marina",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

// Louisiana
var lamarinaLayer = L.geoJson(null);
var la_marina = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "images/marina/la_marina.png",
        iconSize: [22, 22],
        iconAnchor: [12, 24],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function(feature, layer) {
    //console.log(feature);
    if (feature.properties) {
      var p = feature.properties;
      var content;
      if (p.photo !== null && p.photo !== 'undefined') {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br  /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a><br /><br /><img src='" + p.photo + "' style='width:100%;' />";
      } else {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a>";
      }
      layer.on({
        click: function(e) {
          $("#feature-title").html(p.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="20" src="images/marina/la_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      laSearch.push({
        name: layer.feature.properties.name,
        phone: layer.feature.properties.phone,
        source: "la_marina",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

// Texas
var txmarinaLayer = L.geoJson(null);
var tx_marina = L.geoJson(null, {
  pointToLayer: function(feature, latlng) {
    return L.marker(latlng, {
      icon: L.icon({
        iconUrl: "images/marina/tx_marina.png",
        iconSize: [22, 22],
        iconAnchor: [12, 24],
        popupAnchor: [0, -25]
      }),
      title: feature.properties.name,
      riseOnHover: true
    });
  },
  onEachFeature: function(feature, layer) {
    //console.log(feature);
    if (feature.properties) {
      var p = feature.properties;
      var content;
      if (p.photo !== null && p.photo !== 'undefined') {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br  /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a><br /><br /><img src='" + p.photo + "' style='width:100%;' />";
      } else {
        content = "<b>" + p.street + "<br />" + p.city + " " + p.state + " " + p.zip + "</b><br /> Phone: <b>" + p.phone + "</b><br /><a href='" + p.url + "' target='_blank'>More information</a>";
      }
      layer.on({
        click: function(e) {
          $("#feature-title").html(p.name);
          $("#feature-info").html(content);
          $("#featureModal").modal("show");
          highlight.clearLayers().addLayer(L.circleMarker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], highlightStyle));
        }
      });
      $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="20" height="20" src="images/marina/tx_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      txSearch.push({
        name: layer.feature.properties.name,
        phone: layer.feature.properties.phone,
        source: "tx_marina",
        id: L.stamp(layer),
        lat: layer.feature.geometry.coordinates[1],
        lng: layer.feature.geometry.coordinates[0]
      });
    }
  }
});

// Loading json data
//=================================================================
queue()
  .defer(d3.json, 'data/FL_Clean_Marina.geojson')
  .defer(d3.json, 'data/AL_Clean_Marina.geojson')
  .defer(d3.json, 'data/MS_Clean_Marina.geojson')
  .defer(d3.json, 'data/LA_Clean_Marina.geojson')
  .defer(d3.json, 'data/TX_Clean_Marina.geojson')
  .await(function(error, flData, alData, msData, laData, txData) {
    console.log("loading search list");
    $("#loading").hide();

    fl_marina.addData(flData);
    al_marina.addData(alData);
    ms_marina.addData(msData);
    la_marina.addData(laData);
    tx_marina.addData(txData);

    map.addLayer(flmarinaLayer);
    map.addLayer(almarinaLayer);
    map.addLayer(msmarinaLayer);
    map.addLayer(lamarinaLayer);
    map.addLayer(txmarinaLayer);

    sizeLayerControl();

    /* Fit map to boroughs bounds */
    featureList = new List("features", {
      valueNames: ["feature-name"]
    });
    featureList.sort("feature-name", {
      order: "asc"
    });

    var flBH = new Bloodhound({
      name: "FL",
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: flSearch,
      limit: 10
    });

    var alBH = new Bloodhound({
      name: "AL",
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: alSearch,
      limit: 10
    });

    var msBH = new Bloodhound({
      name: "MS",
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: msSearch,
      limit: 10
    });

    var laBH = new Bloodhound({
      name: "LA",
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: laSearch,
      limit: 10
    });

    var txBH = new Bloodhound({
      name: "TX",
      datumTokenizer: function(d) {
        return Bloodhound.tokenizers.whitespace(d.name);
      },
      queryTokenizer: Bloodhound.tokenizers.whitespace,
      local: txSearch,
      limit: 10
    });
    flBH.initialize();
    alBH.initialize();
    msBH.initialize();
    laBH.initialize();
    txBH.initialize();

    /* instantiate the typeahead UI */
    $("#searchbox").typeahead({
      minLength: 4,
      highlight: true,
      hint: false
    }, {
      name: "FL",
      displayKey: "name",
      source: flBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/marina/fl_marina.png' width='22' height='22'>&nbsp;FL</h4>",
        suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{phone}}</small>"].join(""))
      }
    }, {
      name: "AL",
      displayKey: "name",
      source: alBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/marina/al_marina.png' width='22' height='22'>&nbsp;AL</h4>",
        suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{phone}}</small>"].join(""))
      }
    }, {
      name: "MS",
      displayKey: "name",
      source: msBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/marina/ms_marina.png' width='22' height='22'>&nbsp;MS</h4>",
        suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{phone}}</small>"].join(""))
      }
    }, {
      name: "LA",
      displayKey: "name",
      source: laBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/marina/la_marina.png' width='22' height='22'>&nbsp;LA</h4>",
        suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{phone}}</small>"].join(""))
      }
    }, {
      name: "TX",
      displayKey: "name",
      source: txBH.ttAdapter(),
      templates: {
        header: "<h4 class='typeahead-header'><img src='images/marina/tx_marina.png' width='22' height='22'>&nbsp;TX</h4>",
        suggestion: Handlebars.compile(["{{name}}<br>&nbsp;<small>{{phone}}</small>"].join(""))
      }
    }).on("typeahead:selected", function(obj, datum) {
      if (datum.source === "fl_marina") {
        if (!map.hasLayer(flmarinaLayer)) {
          map.addLayer(flmarinaLayer);
        }
        map.setView([datum.lat, datum.lng], 16);
        if (map._layers[datum.id]) {
          map._layers[datum.id].fire("click");
        }
      }
      if (datum.source === "al_marina") {
        if (!map.hasLayer(almarinaLayer)) {
          map.addLayer(almarinaLayer);
        }
        map.setView([datum.lat, datum.lng], 16);
        if (map._layers[datum.id]) {
          map._layers[datum.id].fire("click");
        }
      }
      if (datum.source === "ms_marina") {
        if (!map.hasLayer(msmarinaLayer)) {
          map.addLayer(msmarinaLayer);
        }
        map.setView([datum.lat, datum.lng], 16);
        if (map._layers[datum.id]) {
          map._layers[datum.id].fire("click");
        }
      }
      if (datum.source === "la_marina") {
        if (!map.hasLayer(lamarinaLayer)) {
          map.addLayer(lamarinaLayer);
        }
        map.setView([datum.lat, datum.lng], 16);
        if (map._layers[datum.id]) {
          map._layers[datum.id].fire("click");
        }
      }
      if (datum.source === "tx_marina") {
        if (!map.hasLayer(txmarinaLayer)) {
          map.addLayer(txmarinaLayer);
        }
        map.setView([datum.lat, datum.lng], 16);
        if (map._layers[datum.id]) {
          map._layers[datum.id].fire("click");
        }
      }
    });

  });

// ================================================================
// Ancillary Data Layers
// ================================================================
var nauticalChart = L.esri.dynamicMapLayer("http://seamlessrnc.nauticalcharts.noaa.gov/arcgis/rest/services/RNC/NOAA_RNC/MapServer", {
  opacity: 0.5
});

// ================================================================
/* grouping ancillayr data layers */
// ================================================================
var groupedOverlay = {
  "Additional layers": {
    "Nautical Chart": nauticalChart
  },
  "Clean Marinas": {
    "<img src='images/marina/fl_marina.png' width='22' height='22'>&nbsp;FL": flmarinaLayer,
    "<img src='images/marina/al_marina.png' width='22' height='22'>&nbsp;AL": almarinaLayer,
    "<img src='images/marina/ms_marina.png' width='22' height='22'>&nbsp;MS": msmarinaLayer,
    "<img src='images/marina/la_marina.png' width='22' height='22'>&nbsp;LA": lamarinaLayer,
    "<img src='images/marina/tx_marina.png' width='22' height='22'>&nbsp;TX": txmarinaLayer
  }
};
var layerControl = L.control.groupedLayers(baseLayers, groupedOverlay, {
  //collapsed: isCollapsed
}).addTo(map);


function syncSidebar() {
  // Empty sidebar features
  $("#feature-list tbody").empty();
  // Loop through gbf layer and add only features which are in the map bounds
  fl_marina.eachLayer(function(layer) {
    if (map.hasLayer(flmarinaLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="images/marina/fl_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through museums layer and add only features which are in the map bounds */
  al_marina.eachLayer(function(layer) {
    if (map.hasLayer(almarinaLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="images/marina/al_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  ms_marina.eachLayer(function(layer) {
    if (map.hasLayer(msmarinaLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="images/marina/ms_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  /* Loop through museums layer and add only features which are in the map bounds */
  la_marina.eachLayer(function(layer) {
    if (map.hasLayer(lamarinaLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="images/marina/la_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  tx_marina.eachLayer(function(layer) {
    if (map.hasLayer(txmarinaLayer)) {
      if (map.getBounds().contains(layer.getLatLng())) {
        $("#feature-list tbody").append('<tr class="feature-row" id="' + L.stamp(layer) + '" lat="' + layer.getLatLng().lat + '" lng="' + layer.getLatLng().lng + '"><td style="vertical-align: middle;"><img width="18" height="18" src="images/marina/tx_marina.png"></td><td class="feature-name">' + layer.feature.properties.name + '</td><td style="vertical-align: middle;"><i class="fa fa-chevron-right pull-right"></i></td></tr>');
      }
    }
  });
  // Update list.js featureList
  featureList = new List("features", {
    valueNames: ["feature-name"]
  });
  featureList.sort("feature-name", {
    order: "asc"
  });
}

/* Layer control listeners that allow for a single markerClusters layer */
// ================================================================
map.on("overlayadd", function(e) {
  if (e.layer === flmarinaLayer) {
    markerClusters.addLayer(fl_marina);
    syncSidebar();
  }
  if (e.layer === almarinaLayer) {
    markerClusters.addLayer(al_marina);
    syncSidebar();
  }
  if (e.layer === msmarinaLayer) {
    markerClusters.addLayer(ms_marina);
    syncSidebar();
  }
  if (e.layer === lamarinaLayer) {
    markerClusters.addLayer(la_marina);
    syncSidebar();
  }
  if (e.layer === txmarinaLayer) {
    markerClusters.addLayer(tx_marina);
    syncSidebar();
  }
});
map.on("overlayremove", function(e) {
  if (e.layer === flmarinaLayer) {
    markerClusters.removeLayer(fl_marina);
    syncSidebar();
  }
  if (e.layer === almarinaLayer) {
    markerClusters.removeLayer(al_marina);
    syncSidebar();
  }
  if (e.layer === msmarinaLayer) {
    markerClusters.removeLayer(ms_marina);
    syncSidebar();
  }
  if (e.layer === lamarinaLayer) {
    markerClusters.removeLayer(la_marina);
    syncSidebar();
  }
  if (e.layer === txmarinaLayer) {
    markerClusters.removeLayer(tx_marina);
    syncSidebar();
  }
});
// Filter sidebar feature list to only show features in current map bounds
map.on("moveend", function(e) {
  syncSidebar();
});

// ================================================================
// Map Page Settings
// ================================================================
/* Print */
$("#print-btn").click(function() {
  $("#map").print({
    stylesheet: "../css/bootmap.css"
  });
  $(".navbar-collapse.in").collapse("hide");
  return false;
});
/* Map Tools - all top left tools */
$("#tools-btn").click(function() {
  $('.leaflet-top.leaflet-left').toggle();
  return false;
});
/* Draw Tools */
$("#draw-btn").click(function() {
  $('.leaflet-draw').toggle();
  return false;
});
/* Distance measurement (require Leaflet.Draw) */
$("#distance-btn").click(function() {
  $('.leaflet-control-draw-measure').toggle();
  return false;
});
/* Upload tool */
$("#upload-btn").click(function() {
  $('.leaflet-control-filelayer').toggle();
  return false;
});
// Lat Long
var mousemove = document.getElementById('mousemove');
map.on('mousemove', function(e) {
  //console.log('checking');
  window[e.type].innerHTML = e.latlng.toString() + " Zoom:" + map.getZoom();
});

// ================================================================
// Leaflet patch to make layer control scrollable on touch browsers
// ================================================================
var container = $(".leaflet-control-layers")[0];
if (!L.Browser.touch) {
  L.DomEvent
    .disableClickPropagation(container)
    .disableScrollPropagation(container);
} else {
  L.DomEvent.disableClickPropagation(container);
}

// ================================================================
/* Navigator and Side bar */
// ================================================================
$("#nav-btn").click(function() {
  $(".navbar-collapse").collapse("toggle");
  return false;
});
$("#sidebar-toggle-btn").click(function() {
  $("#sidebar").toggle();
  map.invalidateSize();
  return false;
});
$("#sidebar-hide-btn").click(function() {
  $('#sidebar').hide();
  map.invalidateSize();
});
$("#panel-btn").click(function() {
  $('#sidebar').toggle();
  map.invalidateSize();
  return false;
});

function sidebarClick(id) {
  var layer = markerClusters.getLayer(id);
  map.setView([layer.getLatLng().lat, layer.getLatLng().lng], 13);
  layer.fire("click");
  /* Hide sidebar and go to the map on small screens */
  if (document.body.clientWidth <= 767) {
    $("#sidebar").hide();
    map.invalidateSize();
  }
}

// ================================================================
// Search box
// ================================================================
$("#searchbox").click(function() {
  $(this).select();
});
$("#searchbox").keypress(function(e) {
  if (e.which == 13) {
    e.preventDefault();
  }
});

// ================================================================
/* popup window */
// ================================================================
$(document).on("click", ".feature-row", function(e) {
  $(document).off("mouseout", ".feature-row", clearHighlight);
  sidebarClick(parseInt($(this).attr("id"), 10));
});
$(document).on("mouseover", ".feature-row", function(e) {
  highlight.clearLayers().addLayer(L.circleMarker([$(this).attr("lat"), $(this).attr("lng")], highlightStyle));
});
$(document).on("mouseout", ".feature-row", clearHighlight);

/* Modal */
// ================================================================
$("#about-btn").click(function() {
  $("#aboutModal").modal("show");
  $(".navbar-collapse.in").collapse("hide");
  return false;
});


// Feature Modal Popup
// ================================================================
$("#featureModal").on("hidden.bs.modal", function(e) {
  $(document).on("mouseout", ".feature-row", clearHighlight);
});
