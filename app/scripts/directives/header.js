app.directive('pjHeader', function() {
	return {
		restrict: 'A',
        scope: {header: '@text'},
		template: '<h3>{{header}}</h3><br>'
	}
});