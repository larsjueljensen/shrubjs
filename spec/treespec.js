/*global jasmine, describe, it, expect, shrub*/
(function () {

    'use strict';

    describe('general tree structure', function () {
        it('can create a new tree', function () {
            expect(shrub.createTree).toEqual(jasmine.any(Function));
            expect(shrub.createTree('root')).toEqual(jasmine.objectContaining({value: 'root', parent: null, children: [], level: 0}));
        });
        it('can add children', function () {
            var root = shrub.createTree('root'),
                child1 = root.add('child - 1'),
                child2 = root.add('child - 2');
            expect(root.children.length).toBe(2);
            expect(child1.parent).toBe(root);
            expect(child2.parent).toBe(root);
            expect(child1.level).toBe(1);
        });
        it('can traverse with root first order', function () {
            var result = [], root = shrub.createTree('root');
            root
                .add('A').add('A-A').parent.add('A-B').parent.parent
                .add('B').add('B-A').parent.add('B-B');
            root.traverse(root.TRAVERSE_MODE().ROOT_FIRST, function (node) {
                result.push(node.value);
            });

            expect(result).toEqual(['root', 'A', 'A-A', 'A-B', 'B', 'B-A', 'B-B']);
        });
        it('can traverse with children first order', function () {
            var result = [], root = shrub.createTree('root');
            root
                .add('A').add('A-A').parent.add('A-B').parent.parent
                .add('B').add('B-A').parent.add('B-B');
            root.traverse(root.TRAVERSE_MODE().CHILDREN_FIRST, function (node) {
                result.push(node.value);
            });

            expect(result).toEqual(['A-A', 'A-B', 'A', 'B-A', 'B-B', 'B', 'root']);
        });
        it('can traverse with level order', function () {
            var result = [], root = shrub.createTree('root');
            root
                .add('A').add('A-A').parent.add('A-B').parent.parent
                .add('B').add('B-A').parent.add('B-B');
            root.traverse(root.TRAVERSE_MODE().LEVEL_ORDER, function (node) {
                result.push(node.value);
            });

            expect(result).toEqual(['root', 'A', 'B', 'A-A', 'A-B', 'B-A', 'B-B']);
        });
        it('can create path from root', function () {

            var articles = shrub.createTree('articles'),
                supplier = articles
                    .add(':articleNumber')
                    .add('primarygroup').parent
                    .add('module').parent
                    .add('linediscountgroup').parent
                    .add('texts').parent
                    .add('supplierarticles')
                        .add(':id')
                        .add('supplier');

            expect(supplier.pathFromRoot())
                .toEqual([
                    'articles',
                    ':articleNumber',
                    'supplierarticles',
                    ':id',
                    'supplier'
                ]);
        });
    });
}());
