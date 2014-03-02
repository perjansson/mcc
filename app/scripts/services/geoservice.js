app.factory('geoService', function ($rootScope, $window) {

    var service = {};
    var position = null;

    service.findPosition = function (callback) {
        if (position != null) {
            callback(position);
        } else {
            $window.navigator.geolocation.getCurrentPosition(function (position) {
                position = createPosition(position.coords.longitude, position.coords.latitude);
                callback(position);
            });
        }
    }

    service.findCity = function (callback) {
        this.findPosition(function (position) {
            var geocoder = new google.maps.Geocoder();
            var latlng = new google.maps.LatLng(position.latitude, position.longitude);
            geocoder.geocode({location: latlng}, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var result = results[0];
                    var city = null;
                    for (var component in result['address_components']) {
                        for (var i in result['address_components'][component]['types']) {
                            if (result['address_components'][component]['types'][i] == "locality") {
                                city = result['address_components'][component]['long_name'];
                            }
                        }
                    }
                    var address = result.formatted_address;
                    position = createPosition(position.longitude, position.latitude, city, address);
                    callback(position);
                } else {
                    callback(null);
                }
            });
        });
    }

    function createPosition(longitude, latitude, city, address) {
        return {
            longitude: longitude,
            latitude: latitude,
            city: city,
            address: address
        }
    }

    return service;

})