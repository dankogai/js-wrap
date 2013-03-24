/*
 * use mocha to test me
 * http://visionmedia.github.com/mocha/
 */
if (this['window'] !== this) {
    require('./helper.js');
    require('../wrap.js');
}

(function(root){
    'use strict';
    var _ = Object.Wrap;
    var str = function(o) {
        return o === null ? o 
            : o === 0 ? 1/o === +Infinity ? '+0' : '-0'
            : JSON.stringify(o);
    };
    describe('Kernel', function() {
        var falsy = [undefined, null, false, 0, ''];
        var empty = [[], {}];
        var objs  = falsy.concat(empty);
        objs.forEach(function(v0) {
            objs.forEach(function(v1) {
                it('_('+str(v0)+', true).is('+str(v1)+'); // ' 
                    + (v0 === v1),
                    eq(_(v0, true).is(v1), v0 === v1));
                it('_('+str(v0)+', true).isnt('+str(v1)+'); // '
                    + (v0 !== v1),
                    eq(_(v0, true).isnt(v1), v0 !== v1));
                it('_('+str(v0)+', true).is('+str(_(v1))+'); // ' 
                    + (v0 === v1),
                    eq(_(v0, true).is(_(v1)), v0 === v1));
                it('_('+str(v0)+', true).isnt('+str(_(v1))+'); // '
                    + (v0 !== v1),
                    eq(_(v0, true).isnt(_(v1)), v0 !== v1));
            })
        });
        [+0,-0].forEach(function(v0){
            [+0,-0].forEach(function(v1){
                it('_('+str(v0)+', true).is('+str(v1)+'); // '
                    + (1/v0 === 1/v1),
                    eq(_(v0, true).is(v1), 1/v0 === 1/v1));
                it('_('+str(v0)+', true).isnt('+str(v1)+'); // '
                    + (1/v0 !== 1/v1),
                    eq(_(v0, true).isnt(v1), 1/v0 !== 1/v1));
            })
        });
        it('_(NaN, true).is(NaN); // true',
            eq(_(NaN, true).is(NaN), true));
        it('_(NaN, true).isnt(NaN); // false',
            eq(_(NaN, true).isnt(NaN), false));
    });
})(this);
