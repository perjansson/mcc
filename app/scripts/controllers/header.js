app.controller('HeaderCtrl', function ($rootScope, $scope, $location, constants, meetingService) {

    // TODO: Change to a status model on scope which updates the view (don't forget to $apply...)
    var deRegConnectingEvent = $rootScope.$on('socket connect event', function () {
        $('#connection-indicator').addClass('connecting').removeClass('connected').removeClass('disconnected');
    });

    var deRegConnectEvent = $rootScope.$on('socket connect event', function () {
        $('#connection-indicator').addClass('connected').removeClass('disconnected').removeClass('connecting');
    });

    var deRegConnectFailedEvent = $rootScope.$on('socket connect failed event', function () {
        $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
    });

    var deRegDisconnectFailedEvent = $rootScope.$on('socket disconnect event', function () {
        $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
    });

    var deRegErrorEvent = $rootScope.$on('socket error event', function () {
        $('#connection-indicator').addClass('disconnected').removeClass('connected').removeClass('connecting');
    });

    $scope.version = constants.versionNumber;

    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };

    $scope.connect = function () {
        if ($('#connection-indicator').attr('class').split(' ') == 'disconnected') {
            meetingService.connect();
        }
    }

    $scope.$on('$destroy', function () {
        deRegConnectingEvent();
        deRegConnectEvent();
        deRegConnectFailedEvent();
        deRegDisconnectFailedEvent();
        deRegErrorEvent();
    });

});