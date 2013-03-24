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
        it('is wrapped by default',
           ok(_(null) !== null && _(null).value === null));
        it('is unwrapped by operators', ok(''+_(null) === ''+null))
        it('.class === "Null"', ok(_(null).class === 'Null'));
    });
    describe('Undefined', function() {
        it('is wrapped by default', 
           ok(_(undefined) !== undefined 
              && _(undefined).value === undefined));
        it('is unwrapped by operators',
           ok(''+_(undefined) === ''+undefined))
        it('.class === "Undefined"', 
           ok(_(undefined).class === 'Undefined'));
    });
})(this);
