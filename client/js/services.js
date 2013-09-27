app.factory('meetingService', function() {

  var service = {};
 
  service.connect = function() {

    if(service.ws) { return; }
 
    var ws = new WebSocket("ws://localhost:1337");
 
    ws.onopen = function() {
      service.callback("WebSocket connection opened on client side using AngularJS :)");
    };
 
    ws.onerror = function() {
      service.callback("WebSocket connection NOT opened on client side using AngularJS :(");
    }
 
    ws.onmessage = function(message) {
      service.callback(message.data);
    };
 
    service.ws = ws;
  }
 
  service.send = function(message) {
    service.ws.send(message);
  }
 
  service.subscribe = function(callback) {
    service.callback = callback;
  }
 
  return service;
});