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

    socket.on('message', function (data) {
      service.onMessageCallback(data);
    });
  }
 
  service.send = function(data) {
    socket.emit('meeting update', data);
  }
 
  service.subscribe = function(onConnectCallback, onMessageCallback, onDisconnectCallback, onErrorCallback) {
    service.onConnectCallback = onConnectCallback;
    service.onMessageCallback = onMessageCallback;
    service.onDisconnectCallback = onDisconnectCallback;
    service.onErrorCallback = onErrorCallback;
  }
 
  return service;
  
});