app.controller('MeetingDetailCtrl', function ($rootScope, $scope, $routeParams, meetingService) {

    var meetingId = $routeParams.meetingId;
    meetingService.tryToGetMeetingById(meetingId);

    var deRegMeetingUpdateEvent = $rootScope.$on('meeting status event', function (event, meeting) {
        $scope.meeting = meeting;
        $scope.meeting.id = meetingId;
        $scope.$apply();
    });

    $scope.$on('$destroy', function () {
        deRegMeetingUpdateEvent();
    });

});
