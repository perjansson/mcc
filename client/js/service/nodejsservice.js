app.factory('nodeJsMeetingService', function() {

  var service = {};
 
  service.connect = function() {

    if (service.webSocket) { 
      return; 
    }
 
    var webSocket = new WebSocket("ws://mcc.cloudno.de/");
 
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