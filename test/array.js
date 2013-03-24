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
    var falsies = [undefined, null, false, 0];
    describe('Array', function() {
        var a = [];
        it('is wrapped by default', ok(_(a) !== 0 && _(a).value === a));
        it('is unwrapped by operators', ok(!!_(a) === !!a))
    });
    // ES3 methods
    describe('Array Methods', function() {
        [
            'toLocaleString', 'join',
            'pop', 'push', 'concat', 'reverse', 'shift', 'unshift',
            'slice', 'splice', 'sort',
            /*'filter', 'forEach', 'some', 'every', 'map',*/
            'indexOf', 'lastIndexOf', /* 'reduce', 'reduceRight' */
        ].forEach(function(meth) {
            // console.log(meth);
            // some methods are destructive so we copy
            var a = [0,1,2,3], wa = _(a.slice()),
            ra = a[meth](), rwa = wa[meth]();
            it('.' + meth + '() is wrapped',
               ok(wa !== a));
            it('.' + meth + '() equals',
               eq_deeply(wa.value, a));
            it('.' + meth + '() return value equals',
               eq_deeply(rwa.value, ra));
        });
        // ES5 functional methods
        [
            'filter', 'forEach', 'some', 'every', 'map',
            'reduce', 'reduceRight'
        ].forEach(function(meth) {
            // console.log(meth);
            var a = [0,1,2,3], wa = _(a.slice()),
            f = function(v){ return v },
            ra = a[meth](f), rwa = wa[meth](f);
            it('.' + meth + '() is wrapped', 
               ok(wa !== a));
            it('.' + meth + '() equals',
               eq_deeply(wa.value, a));
            // the return value may not be wrapped
            it('.' + meth + '() return value equals',
               eq_deeply(_.isWrapped(rwa) ? rwa.value : rwa, ra)); 
        });
    });
})(this);
