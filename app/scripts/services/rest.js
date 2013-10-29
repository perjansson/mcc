app.factory('restMeetingService', function($resource) {

  return $resource('http://localhost\\:8080/mcc/meeting', {}, {
    query: { method: 'GET', isArray: true },
    create: { method: 'POST' }
  })

});