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
    describe('OK', function() {
        it ('loaded', ok(Object.Wrap));
    });
})(this);
