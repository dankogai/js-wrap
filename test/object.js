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
    describe('Object', function() {
        var o = {};
        it('is wrapped by default', ok(_(o) !== o && _(o).value === o));
        it('is unwrapped by operators', ok(''+_(o) === ''+o))
        it('.class === "Object"', ok(_(o).class === 'Object'));
    });
})(this);
