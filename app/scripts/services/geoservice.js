app.factory('geoService', function ($rootScope, $window) {

    var service = {};
    var position = null;

    service.findPosition = function (callback) {
        if (position != null) {
            callback(position);
        } else {
            $window.navigator.geolocation.getCurrentPosition(function(position) {
                position = createPosition(position.coords.longitude, position.coords.latitude);
                callback(position);
            });
        }
    }

    function createPosition(longitude, latitude) {
        return {
            longitude: longitude,
            latitude: latitude
        }
    }

    return service;

})