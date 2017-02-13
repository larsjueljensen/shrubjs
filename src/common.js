/*global window*/
window.shrub = (function (shrub) {

    'use strict';

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
