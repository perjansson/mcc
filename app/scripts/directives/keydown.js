app.directive('keydown', function () {
    return {
        restrict: 'E',
        replace: true,
        scope: true,
        link: function postLink(scope, iElement, iAttrs) {
            jQuery(document).on('keydown', function (e) {
                scope.$apply(scope.keyPressed(e));
            });
        }
    };
});