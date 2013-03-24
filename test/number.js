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
    describe('Number', function() {
        it('is wrapped by default', ok(_(0) !== 0 && _(0).value === 0));
        it('is unwrapped by operators', ok(+_(0) === 0))
        it('.class === "Number"', ok(_(0).class === 'Number'));
    });
    describe('Number Methods', function() {
        var n = 42.195;
        ['toFixed', 'toExponential', 'toPrecision']
            .forEach(function(meth) {
                it('.' + meth, 
                   ok(_(n)[meth]() !== n[meth]()
                      && _(n)[meth]().value === n[meth]()
                     ));
            });
    });
})(this);
