app.factory('meetingServiceRest', ['$resource', function($resource) {

  return $resource('https://couchdb.cloudno.de/mcc/:meetingId',
      {meetingInternalId: '@meetingId'}
  );

}]);