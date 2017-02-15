/*global window*/
window.shrub = (function (shrub) {

    'use strict';

    shrub = function (callback) {
        callback(shrub);
    }

    shrub.isEqual = function (a, b) {
        return JSON.stringify(a) === JSON.stringify(b);
    };

    shrub.isEmptyObject = function (obj) {
        return JSON.stringify(obj) === '{}';
    };

    shrub.isNotEmptyObject = function (obj) {
        return !shrub.isEmptyObject(obj);
    };

    shrub.TRAVERSE_MODE = Object.freeze({
        ROOT_FIRST: {},
        CHILDREN_FIRST: {},
        LEVEL_ORDER: {}
    });

    return shrub;

}(window.shrub || {}));
