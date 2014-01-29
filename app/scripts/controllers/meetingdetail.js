app.controller('MeetingDetailCtrl', function ($scope, $http, $location, $routeParams, meetingServiceREST) {

    meetingServiceREST.get({meetingId:$routeParams.meetingId}, function(meeting) {
        $scope.meeting = meeting;
    });

});
