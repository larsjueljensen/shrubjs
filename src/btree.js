/*global window*/
window.shrub = (function (shrub) {

    'use strict';

    function BTree(value, parent) {
        this.value = value;
        this.parent = parent || {};
        this.left = {};
        this.right = {};
    }

    BTree.prototype.add = function (value) {
        if (value < this.value) {
            this.left = new BTree(value, this);
        } else if (value > this.value) {
            this.right = new BTree(value, this);
        }
    };

    shrub.createBTree = function (value) {
        return new BTree(value);
    };

    return shrub;

}(window.shrub || {}));
