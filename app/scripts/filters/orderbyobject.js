'use strict';

app.filter('orderObjectBy', function () {
    return function (input, attribute, orderByDesc) {
        if (!angular.isObject(input)) return input;

        var array = [];
        for (var objectKey in input) {
            array.push(input[objectKey]);
        }

        array.sort(function (a, b) {
                var first = a[attribute];
                var second = b[attribute];

                if (isNaN(first)) {
                    if (orderByDesc) {
                        return sortAlphanumericColumnDesc();
                    } else {
                        return sortAlphanumericColumnAsc();
                    }
                }
                else {
                    if (orderByDesc) {
                        return sortNumericColumnDesc();
                    } else {
                        return sortNumericColumnAsc();
                    }
                }

                function sortAlphanumericColumnDesc() {
                    var alc = first.toLowerCase(),
                        blc = second.toLowerCase();
                    return alc < blc ? 1 : alc > blc ? -1 : 0;
                }

                function sortAlphanumericColumnAsc() {
                    var alc = first.toLowerCase(),
                        blc = second.toLowerCase();
                    return alc > blc ? 1 : alc < blc ? -1 : 0;
                }

                function sortNumericColumnAsc() {
                    a = parseInt(first);
                    b = parseInt(second);
                    return a - b;
                }

                function sortNumericColumnDesc() {
                    a = parseInt(first);
                    b = parseInt(second);
                    return b - a;
                }
            }
        )
        ;
        return array;
    }
})
;
