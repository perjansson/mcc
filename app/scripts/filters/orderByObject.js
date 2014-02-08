'use strict';

app.filter('orderObjectBy', function () {
    return function (input, attribute) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
            var first = a[attribute];
            var second = b[attribute];
            if (isNaN(first)) {
                var alc = first.toLowerCase(),
                    blc = second.toLowerCase();
                return alc < blc ? 1 : alc > blc ? -1 : 0;
            } else {
                a = parseInt(first);
                b = parseInt(second);
                return b - a;
            }
        });
        return array;
    }
});
