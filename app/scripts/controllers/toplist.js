app.controller('TopListCtrl', function ($scope, $location, constants, socketioMeetingService) {

	/*$scope.toplist =
	[
	    {
	        "name": "Meeting 1",
	        "numberOfAttendees": "10",
	        "averageHourlyRate": "1000",
	        "currency": "SEK",
	        "meetingCost": "10000"
	    },
	    {
	        "name": "Meeting 2",
	        "numberOfAttendees": "20",
	        "averageHourlyRate": "1000",
	        "currency": "SEK",
	        "meetingCost": "20000"
	    },
	    {
	        "name": "Meeting 3",
	        "numberOfAttendees": "30",
	        "averageHourlyRate": "1000",
	        "currency": "SEK",
	        "meetingCost": "30000"
	    }
	]*/
    
    if (constants.shouldPersistMeetings) {
        if (constants.shouldUseNodeJs) {
        	var onConnectingCallback = function() {
                $('#connection-indicator').addClass('connecting').removeClass('connected').removeClass('disconnected');
            };
            var onConnectCallback = function() {
                $('#connection-indicator').addClass('connected').removeClass('disconnected').removeClass('connecting');
            };
            var onDisconnectCallback = function() {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onErrorCallback = function() {
                $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
            };
            var onTopListUpdatedCallback = function(toplist) {
            	toplist.sort(function(a,b) { return parseFloat(b.meetingCost) - parseFloat(a.meetingCost) } );
                console.log('On toplist update');
                $scope.toplist = toplist;
        		$scope.$apply();
            };

            socketioMeetingService.subscribeTopList(onConnectingCallback, onConnectCallback, onDisconnectCallback, onErrorCallback, onTopListUpdatedCallback);
        
            socketioMeetingService.connect();

            socketioMeetingService.getTopList();
        }
    }

});