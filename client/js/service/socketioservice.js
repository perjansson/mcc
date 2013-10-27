app.factory('socketioMeetingService', function(constants) {

  var service = {};
  var socket;
 
  service.connect = function() {
    console.log("Trying websocket at: " + constants.nodeJsServer);
    socket = io.connect(constants.nodeJsServer);

    socket.on('connection', function (data) {
      service.connection(data);
    });

    socket.on('message', function (data) {
      service.message(data);
    });
  }
 
  service.send = function(data) {
    socket.emit('meeting update', data);
  }
 
  service.subscribe = function(connectionCallback, messageCallback) {
    service.connection = connectionCallback;
    service.message = messageCallback;
  }
 
  return service;
  
});