app.factory('socketioMeetingService', function(constants) {

  var service = {};
  var socket;
 
  service.connect = function() {
    // Only create connection if no connected socket exist
    if (socket == null || !socket.socket.connected) {
      console.log("message");
      socket = io.connect(constants.nodeJsBackendHost, {
        'force new connection': true
      });

      socket.on('connecting', function () {
        console.log('Trying to connect to websocket at ' + constants.nodeJsBackendHost);
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

      socket.on('error', function () {
        console.log('Error from websocket at ' + constants.nodeJsBackendHost);
        service.onErrorCallback();
      });

      socket.on('meeting update response', function (meeting) {
        service.onMeetingUpdatedCallback(meeting);
      });
    }
  }
 
  service.send = function(data) {
    /*if (constants.nodeJsBackendHost != '127.0.0.1:1337/') {*/
      socket.emit('meeting update request', data);
    /*}*/
  }
 
  service.subscribe = function(onConnectCallback, onMeetingUpdatedCallback, onDisconnectCallback, onErrorCallback) {
    service.onConnectCallback = onConnectCallback;
    service.onMeetingUpdatedCallback = onMeetingUpdatedCallback;
    service.onDisconnectCallback = onDisconnectCallback;
    service.onErrorCallback = onErrorCallback;
  }
 
  return service;
  
});