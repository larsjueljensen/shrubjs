/*global window*/
window.shrub = (function (shrub) {

    'use strict';

    function Tree(value) {
        this.value = value;
        this.parent = null;
        this.children = [];
        this.level = 0;
        this.height = 1;
    }


    function traverse(mode, order, node, callback) {
        return order(node, mode, callback);
    }

    var TRAVERSE_MODE = Object.freeze({
        TRAVERSE: function (node, callback) {
            callback(node);
            return false;
        },
        SEARCH: function (node, callback) {
            if (callback(node) === true) {
                return node;
            }
            return false;
        }
    }),
        TRAVERSE_ORDER = Object.freeze({
            ROOT_FIRST: function (node, mode, callback) {
                var index, result = mode(node, callback);
                if (result === false) {
                    for (index = 0; index < node.children.length; index = index + 1) {
                        result = traverse(mode, TRAVERSE_ORDER.ROOT_FIRST, node.children[index], callback);
                        if (result !== false) {
                            break;
                        }
                    }
                }
                return result;
            },
            CHILDREN_FIRST: function (node, mode, callback) {
                node.children.forEach(function (child) {
                    return traverse(mode, TRAVERSE_ORDER.CHILDREN_FIRST, child, callback);
                });
                return mode(node, callback);
            },
            LEVEL_ORDER: function (node, mode, callback) {
                var queue = [node];

                return (function () {
                    var current;

                    function push(element) {
                        queue.push(element);
                    }

                    while (queue.length > 0) {
                        current = queue.shift();
                        if (mode(current, callback) === false) {
                            current.children.forEach(push);
                        } else {
                            return current;
                        }
                    }

                    return false;
                }());
            }
        });

    function splitPathIntoElements(path, delimiter) {
        if (!Array.isArray(path)) {
            return path.split(delimiter || '/');
        }
        return path;
    }

    function calculateCoincidingStartLength(pathElementsA, pathElementsB) {
        var index,
            commonLength = Math.min(pathElementsA.length, pathElementsB.length);

        for (index = 0; index < commonLength; index = index + 1) {
            if (shrub.isNotEqual(pathElementsA[index], pathElementsB[index])) {
                return index;
            }
        }

        return index;
    }

    function findLongestCoincidingPath(rootNode, pathElements) {
        var longestCoincidingPath = [];

        traverse(TRAVERSE_MODE.TRAVERSE, Tree.TRAVERSE_ORDER.ROOT_FIRST, rootNode, function (node) {
            var pathFromRoot = node.pathFromRoot(),
                coincidingStartLength = calculateCoincidingStartLength(pathElements, pathFromRoot);
            if (coincidingStartLength > longestCoincidingPath.length) {
                longestCoincidingPath = pathFromRoot;
            }
        });

        return longestCoincidingPath;
    }

    function adjustHeight(leaf) {
        var parent, current = leaf;

        while (current.isNotRoot()) {
            parent = current.parent;
            parent.height = Math.max(current.height + 1, parent.height);
            current = parent;
        }
    }

    Tree.TRAVERSE_ORDER = TRAVERSE_ORDER;
    shrub.TRAVERSE_ORDER = TRAVERSE_ORDER;
    Tree.prototype.TRAVERSE_ORDER = function () {
        return Tree.TRAVERSE_ORDER;
    };

    Tree.prototype.isRoot = function () {
        return this.parent === null;
    };

    Tree.prototype.isNotRoot = function () {
        return !this.isRoot();
    };

    Tree.prototype.isLeaf =  function () {
        return this.children.length > 0;
    };

    Tree.prototype.pathFromRoot = function () {
        var current = this,
            path = [];

        while (current.isRoot() === false) {
            path.push(current.value);
            current = current.parent;
        }
        path.push(current.value);
        return path.reverse();
    };

    Tree.prototype.traverse = function (order, callback) {
        traverse(TRAVERSE_MODE.TRAVERSE, order, this, callback);
    };

    Tree.prototype.find = function (value) {
        return traverse(TRAVERSE_MODE.SEARCH, Tree.TRAVERSE_ORDER.ROOT_FIRST, this, function (node) {
            return shrub.isEqual(node.value, value);
        });
    };

    Tree.prototype.add = function (value) {
        var tree = new Tree(value);
        tree.parent = this;
        tree.level = this.level + 1;
        this.children.push(tree);
        adjustHeight(tree);
        return tree;
    };

    Tree.prototype.addPath = function (path, delimiter) {
        var index, current = this, pathElements = splitPathIntoElements(path, delimiter);

        for (index = 0; index < pathElements.length; index = index + 1) {
            current = current.add(pathElements[index]);
        }
    };

    Tree.prototype.mergePath = function (path, delimiter) {
        var pathElements = splitPathIntoElements(path, delimiter),
            longestCoincidingPath = findLongestCoincidingPath(this, pathElements),
            splitNode = this.find(longestCoincidingPath[longestCoincidingPath.length - 1]);

        if (splitNode !== false && pathElements.length > splitNode.level + 1) {
            splitNode.addPath(pathElements.slice(splitNode.level + 1));
        }
    };

    Tree.prototype.toJSON = function () {
        return {
            value: this.value,
            children: this.children,
            level: this.level,
            height: this.height
        };
    };

    shrub.Tree = Tree;

    shrub.logTree = function (tree, logger) {
        traverse(TRAVERSE_MODE.TRAVERSE, TRAVERSE_ORDER.ROOT_FIRST, tree, function (node) {
            logger.log('   |'.repeat(node.level) + '-> ' + node.value + ':' + node.height);
        });
    };

    return shrub;

}(window.shrub || {}));
