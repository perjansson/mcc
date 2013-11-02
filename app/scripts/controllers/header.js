app.controller('HeaderCtrl', function ($scope, $location, constants, socketioMeetingService) {

    $scope.version = constants.versionNumber;

	$scope.isActive = function (viewLocation) { 
	    return viewLocation === $location.path();
	};

    $scope.connect = function() {        
        if (constants.shouldPersistMeetings && constants.shouldUseNodeJs && $('#connection-indicator').attr('class').split(' ') == 'disconnected') {
            socketioMeetingService.connect();
        }
    }

});