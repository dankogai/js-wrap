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
    describe('String', function() {
        it('is wrapped by default', ok(_('') !== 0 && _('').value === ''));
        it('is unwrapped by operators', ok(''+_('') === ''))
        it('.class === "String"', ok(_('').class === 'String'));
    });
    describe('String Methods', function() {
        var s = 'The Answer to the Ultimate Question';
        [
            'charAt', 'charCodeAt', 'concat',
            'indexOf', 'lastIndexOf',
            'localeCompare', /* 'match',*/ 'replace', 'search',
            'slice', /*'split',*/ 'substring', 'substr',
            'toLowerCase', 'toLocaleLowerCase',
            'toUpperCase', 'toLocaleUpperCase',
            'trim', 'trimLeft', 'trimRight'
        ].forEach(function(meth) {
                it('.' + meth, 
                   ok(_(s)[meth]() !== s[meth]()
                      && _(s)[meth]().value === s[meth]()
                     ));
            });
        // they return array so compare its content
        ['match','split'].forEach(function(meth) {
            it('.' + meth + '("") is wrapped', 
               ok(_(s)[meth]('') !== s[meth]('')));
            it('.' + meth + '("") equals by value', 
               eq_deeply(_(s)[meth]('').value, s[meth]('')));
        });
    });
})(this);
