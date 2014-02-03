app.factory('meetingServiceSocketIO', function (constants) {

    var service = {};
    var socket;

    service.connect = function () {
        // Only create connection if no connected socket exist
        if (socket == null || !socket.socket.connected) {
            socket = io.connect(constants.nodeJsBackendHost, {
                'force new connection': true
            });

            socket.on('connecting', function () {
                console.log('Trying to connect to websocket at ' + constants.nodeJsBackendHost);
                service.onConnectingCallback();
            });

            socket.on('connect', function () {
                console.log('Connected to websocket at ' + constants.nodeJsBackendHost + ' d-(*_*)z');
                service.onConnectCallback();
            });

            socket.on('reconnect', function () {
                console.log('Reconnected to websocket at ' + constants.nodeJsBackendHost + ' d-(*_*)z');
                service.onConnectCallback();
            });

            socket.on('connect_failed', function () {
                console.log('Connect failed to websocket at ' + constants.nodeJsBackendHost);
                service.onErrorCallback();
            });

            socket.on('reconnect_failed', function () {
                console.log('Reconnect failed to websocket at ' + constants.nodeJsBackendHost);
                service.onErrorCallback();
            });

            socket.on('disconnect', function () {
                console.log('Disconnect from websocket at ' + constants.nodeJsBackendHost);
                service.onDisconnectCallback();
            });

            socket.on('error', function (errorMessage) {
                console.log('Error ' + errorMessage + ' from websocket at ' + constants.nodeJsBackendHost);
                service.onErrorCallback();
            });

            socket.on('meeting update response', function (meeting) {
                service.onMeetingUpdatedCallback(meeting);
            });

            socket.on('meeting update error', function (errorMessage) {
                console.log('Error ' + errorMessage + ' from websocket at ' + constants.nodeJsBackendHost);
            });

            socket.on('top list update response', function (topList) {
                service.onTopListUpdatedCallback(topList);
            });
        }
    }

    service.send = function (data) {
        //if (constants.nodeJsBackendHost != '127.0.0.1:1337/') {
        socket.emit('meeting update request', data);
        //}
    }

    service.getTopList = function (data) {
        socket.emit('top list request');
    }

    service.subscribe = function (onConnectingCallback, onConnectCallback, onDisconnectCallback, onErrorCallback, onMeetingUpdatedCallback) {
        service.onConnectingCallback = onConnectingCallback;
        service.onConnectCallback = onConnectCallback;
        service.onMeetingUpdatedCallback = onMeetingUpdatedCallback;
        service.onDisconnectCallback = onDisconnectCallback;
        service.onErrorCallback = onErrorCallback;
    }

    service.subscribeTopList = function (onConnectingCallback, onConnectCallback, onDisconnectCallback, onErrorCallback, onTopListUpdatedCallback) {
        service.onConnectingCallback = onConnectingCallback;
        service.onConnectCallback = onConnectCallback;
        service.onTopListUpdatedCallback = onTopListUpdatedCallback;
        service.onDisconnectCallback = onDisconnectCallback;
        service.onErrorCallback = onErrorCallback;
    }

    return service;

});