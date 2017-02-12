window.Tree = (function () {

    'use strict';

    function Tree(value) {

        this.value = value;
        this.parent = {};
        this.children = [];
        this.level = 0;

    }

    Tree.TRAVERSE_MODE = Object.freeze({
        ROOT_FIRST : {},
        CHILDREN_FIRST: {},
        LEVEL_ORDER: {}
    });

    Tree.prototype.isRoot = function () {
        return JSON.stringify(this.parent === '{}');
    };

    Tree.prototype.isLeaf =  function () {
        return this.children.length > 0;
    };

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
                function push(element) {
                    queue.push(element);
                }

                while (queue.length > 0) {
                    var node = queue.shift();
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

    return Tree;
}());

