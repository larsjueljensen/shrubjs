/*global jasmine, describe, it, expect, shrub, console*/
(function () {

    'use strict';

    describe('general tree structure', function () {

        it('shall create a new tree', function () {
            expect(shrub.Tree).toEqual(jasmine.any(Function));
            expect(new shrub.Tree('root')).toEqual(jasmine.objectContaining({value: 'root', parent: null, children: [], level: 0}));
        });

        it('shall add children', function () {
            var root = new shrub.Tree('root'),
                child1 = root.add('child - 1'),
                child2 = root.add('child - 2');
            expect(root.children.length).toBe(2);
            expect(child1.parent).toBe(root);
            expect(child2.parent).toBe(root);
            expect(child1.level).toBe(1);
        });

        it('shall traverse with root first order', function () {

            var result = [],
                root = new shrub.Tree('root');

            root
                .add('A').add('A-A').parent.add('A-B').parent.parent
                .add('B').add('B-A').parent.add('B-B');

            root.traverse(root.TRAVERSE_ORDER().ROOT_FIRST, function (node) {
                result.push(node.value);
            });

            expect(result).toEqual(['root', 'A', 'A-A', 'A-B', 'B', 'B-A', 'B-B']);
        });

        it('shall traverse with children first order', function () {
            var result = [], root = new shrub.Tree('root');
            root
                .add('A').add('A-A').parent.add('A-B').parent.parent
                .add('B').add('B-A').parent.add('B-B');
            root.traverse(root.TRAVERSE_ORDER().CHILDREN_FIRST, function (node) {
                result.push(node.value);
            });

            expect(result).toEqual(['A-A', 'A-B', 'A', 'B-A', 'B-B', 'B', 'root']);
        });

        it('shall traverse with level order', function () {
            var result = [], root = new shrub.Tree('root');
            root
                .add('A').add('A-A').parent.add('A-B').parent.parent
                .add('B').add('B-A').parent.add('B-B');
            root.traverse(root.TRAVERSE_ORDER().LEVEL_ORDER, function (node) {
                result.push(node.value);
            });

            expect(result).toEqual(['root', 'A', 'B', 'A-A', 'A-B', 'B-A', 'B-B']);
        });

        it('shall create path from root', function () {

            var articles = new shrub.Tree('articles'),
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

        it('shall run inside shrub', function () {
            shrub(function ($) {
                expect($).toEqual(shrub);
            });
        });

        it('shall convert tree with more than one level to JSON', function () {
            shrub(function ($) {
                var root = new $.Tree('root');
                root.add('A');
                root.add('B');
                expect(JSON.stringify(root)).toEqual(
                    '{"value":"root","children":[' +
                        '{"value":"A","children":[],"level":1,"height":1},' +
                        '{"value":"B","children":[],"level":1,"height":1}],"level":0,"height":2}'
                );
            });
        });

        it('shall find and return an existing node', function () {
            shrub(function ($) {
                var root = new $.Tree('root'),
                    a = root.add('a'),
                    b = root.add('b'),
                    aa = a.add('a-a'),
                    ab = a.add('a-b'),
                    ba = b.add('b-a');

                expect(root.find('root')).toEqual(root);
                expect(root.find('a')).toEqual(a);
                expect(root.find('b')).toEqual(b);
                expect(root.find('a-a')).toEqual(aa);
                expect(root.find('a-b')).toEqual(ab);
                expect(root.find('b-a')).toEqual(ba);
            });
        });

        it('shall merge a path to a tree', function () {
            shrub(function ($) {
                var root = new $.Tree('articles');
                root.mergePath('articles/:id/texts');
                root.mergePath('articles/:id/group');
                root.mergePath('articles/:id/module');
                root.mergePath('articles/:id/properties');
                root.mergePath('articles/:id/units');
                shrub.logTree(root, console);
                expect(root.height).toEqual(3);
            });


        });

    });
}());
