/*TODO implement this library*/

var utils = (function () {
    /**
     * custom wrapper over for loop
     * */
    var forEach = function (iterable, cb) {
        for (var i = 0, l = iterable.length; i < l; i++) {
            cb(iterable[i], i, iterable);
        }
    };

    return {
        forEach: forEach
    };
})();