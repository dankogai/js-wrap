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
    var f = function(){ return [this].concat([].slice.call(arguments)) };
    describe('Function', function() {
        it('is not wrapped by default', ok(_(f) === f));
        it('is wrapped by request',
           ok(_(f, 1) !== f && _(f, 1).value === f));
        it('is unwrapped by operators', ok(''+_(f, 1) === ''+f))
        it('.class === "Function"', ok(_(f, 1).class === 'Function'));
    });
    describe('Function Methods', function() {
        var wf = _(f, 1);
        it('.apply wraps the return value"',
           eq_deeply(wf.apply('that', [0,1]).value, ['that',0,1]));
        it('.call wraps the return value"',
           eq_deeply(wf.call('that', 0,1).value, ['that',0,1]));
    });
})(this);
