/**
 * Copyright © 2011 Sebastian Schneider
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

$(function() {
	doLog("Initialize Map...");
	initializeMap();
});

var geoCoordinates = "{\"geocoordinates\": [\n" + 
	"{\n\"id\": 1, \"lat\": 52.4189194, \"lng\": 13.284903500000041, \"description\": \"Test1\", \"imageid\": 1\n},\n" +
	"{\n\"id\": 2, \"lat\": 52.5234051, \"lng\": 13.411399899999992, \"description\": \"Test2\", \"imageid\": 2\n},\n" +
	"{\n\"id\": 3, \"lat\": 49.48666129999999, \"lng\": 8.466352700000016, \"description\": \"Test3\", \"imageid\": 3\n},\n" +
	"{\n\"id\": 4, \"lat\": 49.0080848, \"lng\": 8.403756299999941, \"description\": \"Test4\", \"imageid\": 4\n},\n" +
	"{\n\"id\": 5, \"lat\": 50.9406645, \"lng\": 6.959911499999976, \"description\": \"Test5\", \"imageid\": 5\n},\n" +
	"{\n\"id\": 6, \"lat\": 49.444838, \"lng\": 8.418296999999939, \"description\": \"Test6\", \"imageid\": 6\n}\n" +
	"]}";

// test address
var $address = "Berlin";
// global var
var $gmap = google.maps;

var map;
var geocoder;
var locationLatLng;

var markerArray = [];
var infowindow = null;

function initializeMap() {
	
	// create Map
	var latlng = new $gmap.LatLng(50.974401, 10.325228);
    options = {
      zoom: 6,
      center: latlng,
      mapTypeId: $gmap.MapTypeId.ROADMAP
    };
    
    doLog(geoCoordinates);
//    getGeoCoordinate();
    
    map = new $gmap.Map($("#googleMapPanel")[0],
    		options);
    
    var geoResponse = jQuery.parseJSON(geoCoordinates);
    // TODO add AJAX call to get GeoCoordinates
    updateGeoCoordinates(geoResponse);
}

function getGeoCoordinate() {
	doLog("Get geo coordinate...");
	geocoder = new $gmap.Geocoder();
	geocoder.geocode ({'address': $address}, function(result, status) {
		doLog("Status: " + google.maps.GeocoderStatus.OK);
		if (status == google.maps.GeocoderStatus.OK && result != null) {
			doLog("Found lat lng: " + result[0].geometry.location);	
			locationLatLng = result[0].geometry.location;
			doLog("Lat: " + locationLatLng.lat());
			doLog("Lng: " + locationLatLng.lng());
		} else {
			doLog("Address not found for " + address);
		}
	});
	
	if (locationLatLng != undefined) {
		return locationLatLng;
	} else {
		return null;
	}
	
}

function updateGeoCoordinates(geoResponse) {
	doLog("Update markers...");
	doLog(geoResponse);
	for (var i = 0; i < geoResponse.geocoordinates.length; i++) {
		doLog("Progressing GeoCoordinate " + geoResponse.geocoordinates[i].id);
		
		// add marker
		createMarker(geoResponse.geocoordinates[i]);
		
		// add info window
		renderInfoWindow(geoResponse.geocoordinates[i]);
		
//		marker.setMap(map);
	}
}

function createMarker(geocoordinate) {
	
	var image = new $gmap.MarkerImage('resource/images/' + geocoordinate.imageid + '.jpg',
			// marker image size
			new $gmap.Size(20, 32),
			// base of flagepole at 0, 32
			new $gmap.Point(0, 32));
	
	
	//TODO ICON max. 60 x 90 px
	var latlng = new $gmap.LatLng(geocoordinate.lat, geocoordinate.lng);
    var marker = new $gmap.Marker({
        position: latlng,
        map: map,
        title: geocoordinate.id + ", " + geocoordinate.description
    });
	    
	marker.geocoordinate = geocoordinate;
    markerArray.push(marker);
	    
    $gmap.event.addListener(marker, 'click', function() {
   		onSelectMarker(geocoordinate);
    });

    return marker;
}

//Renders the HTML for the google Map Bubble.
function renderInfoWindow(geocoordinate) { 	
	
	var html = '<div id="infoWindow">';
	html += '<div class="thumbnail">';
	html += '<a href="resource/images/' + geocoordinate.imageid + '.jpg">';
	html += '<img src="resource/images/' + geocoordinate.imageid + '.jpg">';
	html += '</a></div>';
	html += '<div class="geocoordinateid">' + geocoordinate.id + "</div>\n";
	html += '<div class="description">Description: ' + geocoordinate.description + '</div>';
	html += '<div class="geocoordinate">Geo: ' + geocoordinate.lat + ', ' + geocoordinate.lng + '</div>';
	html += '</div>';
	return html;	
}

function onSelectMarker(geocoordinate) {
	doLog("Select marker: " + geocoordinate.id);
	
	// Info window
	if (infowindow != null) {
		infowindow.close();
	}
    infowindow = new $gmap.InfoWindow({
        content: renderInfoWindow(geocoordinate)
    });
   
    infowindow.setPosition(new $gmap.LatLng(geocoordinate.lat, geocoordinate.lng));
    infowindow.open(map);
}

function doLog(message) {
	try {
		top.console.log(message);
	} catch (e) {
	}
}

