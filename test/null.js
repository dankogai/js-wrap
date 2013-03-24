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
    describe('Null', function() {
        it('is not wrapped by default', ok(_(null) === null));
        it('is wrapped upon request', 
           ok(_(null, 1) !== null && _(null, 1).value === null));
        it('is unwrapped by operators', ok(''+_(null, 1) === ''+null))
        it('.class === "Null"', ok(_(null, 1).class === 'Null'));
    });
    describe('Undefined', function() {
        it('is not wrapped by default', ok(_(void(0)) === void(0)));
        it('is wrapped upon request', 
           ok(_(void(0), 1) !== void(0) && _(void(0), 1).value === void(0)));
        it('is unwrapped by operators', ok(''+_(void(0), 1) === ''+void(0)))
        it('.class === "Undefined"', ok(_(void(0), 1).class === 'Undefined'));
    });
})(this);
