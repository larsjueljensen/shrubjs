/*global jasmine, describe, it, expect, shrub*/
(function () {

    'use strict';

    describe('binary tree structure', function () {

        it('can create a binary tree', function () {
            expect(shrub.createBTree).toEqual(jasmine.any(Function));
            expect(shrub.createBTree('root')).toEqual(jasmine.objectContaining({value: 'root', parent: {}, left: {}, right: {}}));
        });

        it('can add to tree', function () {
            var root = new shrub.Tree('root'),
                child1 = root.add('child - 1'),
                child2 = root.add('child - 2');
            expect(root.children.length).toBe(2);
            expect(child1.parent).toBe(root);
            expect(child2.parent).toBe(root);
            expect(child1.level).toBe(1);
        });
    });
}());
