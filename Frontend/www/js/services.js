angular.module('starter.services', [])

.factory('IonicService', function() {

  var callBackFunction ;
  var latitude ;
  var longitude;
  var altitude ;


  function getPosition(){ // RETURN A POSITION
    return new Array(latitude, longitude, altitude);
  }

  function checkLocation(callback){

		callBackFunction = callback ;

        var options = {
            enableHighAccuracy: true, // HIGH ACCURACY
            timeout: 15000, // LOCATION TIMEOUT
            maximumAge: 0 // MAX AGE FOR LOCATION
        };

       function showError(error) { // WILL EXECUTE WHEN GPS IS TURNED OFF OR LOCATION IS DISABLED FOR THE APP
       	   console.log('Unable to get your location. Please enable IonicService in your settings for this app.');
       }

        function showPosition(position) {

          latitude = position.coords.latitude ;
          longitude = position.coords.longitude ;
          altitude = position.coords.altitude ;

          callBackFunction(); // let the controller know we got the position
        }

        navigator.geolocation.getCurrentPosition(showPosition, showError, options);
   }

  return {

    checkLocation: checkLocation,
    getPosition: getPosition

    }
});
