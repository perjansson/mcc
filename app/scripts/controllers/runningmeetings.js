app.controller('RunningMeetingsCtrl', function ($rootScope, $scope, $location, constants, meetingService) {

    var deRegRunningMeetingsUpdateEvent = $rootScope.$on('running meetings update event', function (event, runningMeetings) {
        sortAndSaveRunningMeetings(runningMeetings);
        $scope.$apply();
    });

    function sortAndSaveRunningMeetings(runningMeetings) {
        runningMeetings.sort(function (a, b) {
            return parseFloat(b.comparableMeetingCost) - parseFloat(a.comparableMeetingCost)
        });
        $scope.runningMeetings = runningMeetings;
    }

    var runningMeetings = meetingService.tryToGetRunningMeetings();
    if (runningMeetings != null) {
        sortAndSaveRunningMeetings(runningMeetings);
    }

    $scope.orderByAttribute = 'comparableMeetingCost';
    $scope.orderByDesc = true;

    var nameOrderByDesc = true;
    var numberOfAttendeesOrderByDesc = true;
    var averageHourlyRateOrderByDesc = true;
    var meetingCostOrderByDesc = true;
    var durationOrderByDesc = true;
    var comparableMeetingCostOrderByDesc = true;

    $scope.updateNameOrder = function () {
        nameOrderByDesc = !nameOrderByDesc;
        updateOrder('name', nameOrderByDesc);
    }

    $scope.updateNumberOfAttendeesOrder = function () {
        numberOfAttendeesOrderByDesc = !numberOfAttendeesOrderByDesc;
        updateOrder('numberOfAttendees', numberOfAttendeesOrderByDesc);
    }

    $scope.updateAverageHourlyRateOrder = function () {
        averageHourlyRateOrderByDesc = !averageHourlyRateOrderByDesc;
        updateOrder('averageHourlyRate', averageHourlyRateOrderByDesc);
    }

    $scope.updateMeetingCostOrder = function () {
        meetingCostOrderByDesc = !meetingCostOrderByDesc;
        updateOrder('meetingCost', meetingCostOrderByDesc);
    }

    $scope.updateDurationOrder = function () {
        durationOrderByDesc = !durationOrderByDesc;
        updateOrder('duration', durationOrderByDesc);
    }

    $scope.updateComparableMeetingCostOrder = function () {
        comparableMeetingCostOrderByDesc = !comparableMeetingCostOrderByDesc;
        updateOrder('comparableMeetingCost', comparableMeetingCostOrderByDesc);
    }

    function updateOrder(column, orderByDesc) {
        $scope.orderByAttribute = column;
        $scope.orderByDesc = orderByDesc;
    }

    $scope.shareMeeting = function (meetingId) {
        if (meetingId != null) {
            var path = constants.meetingDetailUrl + meetingId;
            $location.path(path);
        }
    }

    $scope.$on('$destroy', function () {
        deRegRunningMeetingsUpdateEvent()
    });

});
