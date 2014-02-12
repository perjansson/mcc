app.controller('TopListCtrl', function ($rootScope, $scope, $location, constants, meetingService) {

    var deRegTopListUpdateEvent = $rootScope.$on('top list update event', function (event, topList) {
        sortAndSaveTopList(topList);
        $scope.$apply();
    });

    function sortAndSaveTopList(topList) {
        topList.sort(function (a, b) {
            return parseFloat(b.comparableMeetingCost) - parseFloat(a.comparableMeetingCost)
        });
        $scope.topList = topList;
    }

    var topList = meetingService.tryGetTopList();
    if (topList != null) {
        sortAndSaveTopList(topList);
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
        console.log("Sharing " + meetingId);
        if (meetingId != null) {
            var path = constants.sharingUrl + meetingId;
            $location.path(path);
        }
    }

    $scope.$on('$destroy', function () {
        deRegTopListUpdateEvent()
    });

});
