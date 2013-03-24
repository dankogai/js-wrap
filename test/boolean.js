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
    describe('Boolean', function() {
        it('is not wrapped by default', ok(_(false) === false));
        it('is wrapped by request', 
           ok(_(false, 1) !== false && _(false, 1).value === false));
        it('.class === "Boolean"', 
           ok(_(false, 1).class === 'Boolean'));
    });
    describe('Boolean Methods', function() {
        var t = _.Boolean(true), f = _.Boolean(false);
        // not
        it('t.not()', eq(t.not().value, false));
        it('f.not()', eq(f.not().value, true));
        // and
        it('t.and(t)', eq(t.and(t).value, true));
        it('f.and(t)', eq(f.and(t).value, false));
        it('t.and(f)', eq(t.and(f).value, false));
        it('f.and(f)', eq(f.and(f).value, false));
        // or
        it('t.or(t)', eq(t.or(t).value, true));
        it('f.or(t)', eq(f.or(t).value, true));
        it('t.or(f)', eq(t.or(f).value, true));
        it('f.or(f)', eq(f.or(f).value, false));
        // xor
        it('t.xor(t)', eq(t.xor(t).value, false));
        it('f.xor(t)', eq(f.xor(t).value, true));
        it('t.xor(f)', eq(t.xor(f).value, true));
        it('f.xor(f)', eq(f.xor(f).value, false));
    });
})(this);
