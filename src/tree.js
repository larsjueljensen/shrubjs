/*global window*/
window.shrub = (function (shrub) {

    'use strict';

    function Tree(value) {

        this.value = value;
        this.parent = null;
        this.children = [];
        this.level = 0;

    }

    Tree.TRAVERSE_MODE = Object.freeze({
        ROOT_FIRST : {},
        CHILDREN_FIRST: {},
        LEVEL_ORDER: {}
    });

    Tree.prototype.TRAVERSE_MODE = function () {
        return Tree.TRAVERSE_MODE;
    };

    Tree.prototype.isRoot = function () {
        return this.parent === null;
    };

    Tree.prototype.isLeaf =  function () {
        return this.children.length > 0;
    };

    Tree.prototype.pathFromRoot = function() {
        var current = this,
            path = [];

        while (current.isRoot() === false) {
            path.push(current.value);
            current = current.parent;
        }
        path.push(current.value);
        return path.reverse();
    }

    Tree.prototype.traverse = function (mode, callback) {
        if (Tree.TRAVERSE_MODE.CHILDREN_FIRST === mode) {
            this.children.forEach(function (child) {
                child.traverse(mode, callback);
            });
            callback(this);
        } else if (Tree.TRAVERSE_MODE.ROOT_FIRST === mode) {
            callback(this);
            this.children.forEach(function (child) {
                child.traverse(mode, callback);
            });
        } else if (Tree.TRAVERSE_MODE.LEVEL_ORDER === mode) {

            var queue = [];
            queue.push(this);

            (function () {

                var node;

                function push(element) {
                    queue.push(element);
                }

                while (queue.length > 0) {
                    node = queue.shift();
                    callback(node);
                    node.children.forEach(push);
                }
            }());
        }
    };

    Tree.prototype.add = function (value) {

        var tree = new Tree(value);
        tree.parent = this;
        tree.level = this.level + 1;
        this.children.push(tree);

        return tree;
    };

    shrub.createTree = function (value) {
        return new Tree(value);
    };

    return shrub;

}(window.shrub || {}));
