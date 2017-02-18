/*global window*/
window.shrub = (function (shrub) {

    'use strict';

    shrub = function (callback) {
        callback(shrub);
    };

    shrub.isEqual = function (a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    shrub.isNotEqual = function (a, b) {
        return !shrub.isEqual(a, b);
    };

    shrub.isEmptyObject = function (obj) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    shrub.isNotEmptyObject = function (obj) {
        return !shrub.isEmptyObject(obj);
    };

    return shrub;

}(window.shrub || {}));
