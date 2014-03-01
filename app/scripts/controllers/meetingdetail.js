app.controller('MeetingDetailCtrl', function ($rootScope, $scope, $routeParams, $location, meetingService, constants) {

    var meetingId = $routeParams.meetingId;
    meetingService.tryToGetMeetingById(meetingId);

    var deRegMeetingStatusEvent = $rootScope.$on('meeting status event', function (event, meeting) {
        updateThisMeeting(meeting);
    });

    var deRegMeetingUpdateEvent = $rootScope.$on('some meeting update event', function (event, meeting) {
        console.log('On (some) meeting update: ' + JSON.stringify(meeting));
        if ($scope.meeting.id == meeting.id) {
            updateThisMeeting(meeting);
        }
    });

    function updateThisMeeting(meeting) {
        $scope.meeting = meeting;
        $scope.meeting.id = meetingId;
        $scope.$apply();
    }

    $scope.keyPressed = function (e) {
        if (46 == e.which) {
            meetingService.deleteMeetingWithId(meetingId);
            $location.path(constants.topListUrl);
        }
    };

    $scope.$on('$destroy', function () {
        deRegMeetingStatusEvent();
        deRegMeetingUpdateEvent();
    });

});
