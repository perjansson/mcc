app.controller('MeetingDetailCtrl', function ($rootScope, $scope, $routeParams, $location, meetingService, constants) {

    var meetingId = $routeParams.meetingId;
    meetingService.tryToGetMeetingById(meetingId);

    var deRegMeetingUpdateEvent = $rootScope.$on('meeting status event', function (event, meeting) {
        $scope.meeting = meeting;
        $scope.meeting.id = meetingId;
        $scope.$apply();
    });

    $scope.keyPressed = function (e) {
        if (46 == e.which) {
            meetingService.deleteMeetingWithId(meetingId);
            $location.path(constants.topListUrl);
        }
    };

    $scope.$on('$destroy', function () {
        deRegMeetingUpdateEvent();
    });

});
