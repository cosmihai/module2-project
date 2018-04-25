'use strict';
function main () {
  // -- utility functions

  function getUserLocation (callback) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const userPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        callback(userPosition);
      }, () => {
        console.log('Error in the geolocation service.');
      });
    } else {
      console.log('Browser does not support geolocation.');
    }
  }
  function addMarker (map, location, title) {
    const markerOptions = {
      position: location,
      title: title
    };
    const myMarker = new google.maps.Marker(markerOptions);
    myMarker.setMap(map);
  }

  // BUILD THE MAP

  const container = document.getElementById('map');
  // -------------map option-------
  getUserLocation((userLocation) => {
    if (userLocation) {
      addMarker(map, userLocation, 'you are here');
      map.setCenter(userLocation);
    }
  });
  const userPosition = getUserLocation();
  const options = {
    zoom: 8,
    center: userPosition
  };

  const map = new google.maps.Map(container, options);
}

window.addEventListener('load', main);
