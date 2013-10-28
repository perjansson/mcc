app.factory('socketioMeetingService', function(constants) {

  var service = {};
  var socket;
 
  service.connect = function() {
    socket = io.connect(constants.nodeJsBackendHost, {
      'force new connection': true
    });

    socket.on('connect', function () {
      service.onConnectCallback();
    });

    socket.on('reconnect', function () {
      service.onConnectCallback();
    });

    socket.on('connect_failed', function () {
      service.onErrorCallback();
    });

    socket.on('reconnect_failed', function () {
      service.onErrorCallback();
    });

    socket.on('disconnect', function () {
      service.onDisconnectCallback();
    });

    socket.on('error', function () {
      service.onErrorCallback();
    });

    socket.on('meeting update response', function (data) {
      service.onMeetingUpdatedCallback(data);
    });
  }
 
  service.send = function(data) {
    socket.emit('meeting update request', data);
  }
 
  service.subscribe = function(onConnectCallback, onMeetingUpdatedCallback, onDisconnectCallback, onErrorCallback) {
    service.onConnectCallback = onConnectCallback;
    service.onMeetingUpdatedCallback = onMeetingUpdatedCallback;
    service.onDisconnectCallback = onDisconnectCallback;
    service.onErrorCallback = onErrorCallback;
  }
 
  return service;
  
});