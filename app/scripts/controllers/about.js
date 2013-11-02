app.controller('AboutCtrl', function ($scope, $http) {
    $http.get('app/frameworks.json').success(function (data) {
    	$scope.frameworks = data;
  });
});
