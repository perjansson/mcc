app.directive('pjHeader', function() {
	return {
		restrict: 'A',
        scope: {header: '@text', subHeader: '@subtext'},
		template: '<div class="page-header"><h3>{{header}}</h3><small ng-show="subHeader != null">{{subHeader}}</small></div><br>'
	}
});