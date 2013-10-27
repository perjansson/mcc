app.factory('nodeJsMeetingService', function(constants) {

  var service = {};
 
  service.connect = function() {

    if (service.webSocket) { 
      return; 
    }
 
    console.log("Using nodejs server: " + constants.nodeJsServer);
    var webSocket = new WebSocket(constants.nodeJsServer);
 
    webSocket.onopen = function() {
      service.callback("WebSocket connection opened on client side using AngularJS :)");
    };
 
    webSocket.onerror = function() {
      service.callback("WebSocket connection NOT opened on client side using AngularJS :(");
    }
 
    webSocket.onmessage = function(message) {
      service.callback(message.data);
    };
 
    service.webSocket = webSocket;
  }
 
  service.send = function(message) {
    service.webSocket.send(message);
  }
 
  service.subscribe = function(callback) {
    service.callback = callback;
  }
 
  return service;
  
});