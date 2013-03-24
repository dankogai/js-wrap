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
    var jstr = JSON.stringify;
    describe('Object', function() {
        var o = {};
        it('is wrapped by default', ok(_(o) !== o && _(o).value === o));
        it('is unwrapped by operators', ok(''+_(o) === ''+o))
        it('.class === "Object"', ok(_(o).class === 'Object'));
    });
    describe('Object Methods', function() {
        var o, wo;
        // extend|default
        o = {zero:1};
        it('.extend', 
           eq_deeply(_(o).extend({zero:0}).value, {zero:0}));
        it('.extend mutates', eq_deeply(o, {zero:0}));
        o = {zero:0};
        it('.defaults',
           eq_deeply(_(o).defaults({zero:1, one:1}).value, {zero:0, one:1}));
        it('.defaults mutates', eq_deeply(o, {zero:0, one:1}));
        o = {};
        // extended|defaulted
        it('.extended', 
           eq_deeply(_(o).extended({zero:0}).value, {zero:0}));
        it('.extended does not mutate', eq_deeply(o, {}));
        o = {zero:0};
        it('.defaulted',
           eq_deeply(_(o).defaulted({zero:1, one:1}).value, {zero:0, one:1}));
        it('.defaulted does not  mutate', eq_deeply(o, {zero:0}));
        // pick|omit
        o = {zero:0, one:1};
        it('.pick', 
           eq_deeply(_(o).pick('zero').value, {zero:0}));
        it('.pick mutates', eq_deeply(o, {zero:0}));
        o = {zero:0, one:1};
        it('.omit',
           eq_deeply(_(o).omit('zero').value, {one:1}));
        it('.omit mutates', eq_deeply(o, {one:1}));
        o = {zero:0, one:1};
        // picked|omitted
        it('.picked', 
           eq_deeply(_(o).picked('zero').value, {zero:0}));
        it('.picked does not mutate', eq_deeply(o, {zero:0, one:1}));
        o = {zero:0, one:1};
        it('.omittted',
           eq_deeply(_(o).omitted('zero').value, {one:1}));
        it('.omitted does not mutate', eq_deeply(o, {zero:0, one:1}));
        // has
        it('_({zero:0}).has("zero");', ok(_({zero:0}).has("zero")));
        it('!_({zero:0}).has("one");', ok(!_({zero:0}).has("one")));
        it('!_({zero:0}).has("hasOwnProperty");',
           ok(!_({zero:0}).has("hasOwnProperty")));
        // get
        it('_({zero:0}).get("zero");', 
           eq(_({zero:0}).get("zero").value, 0));
        it('_({zero:0}).get("one");', 
           eq(_({zero:0}).get("one").value, undefined));
        // set and size
        o = {zero:0}, wo = _(o);
        it ('wo.size === 1', eq(wo.size, 1));
        it('wo.set("one", 1); // wo = _(' + jstr(o) + ')', 
           eq(wo.set("one", 1).value, 1));
        it('o = ' + jstr(o),
           eq_deeply(o, {zero:0, one:1}));
        it('wo.size === 2', eq(wo.size, 2));
        // delete and size
        o = {zero:0, one:1}, wo = _(o);
        it('wo.delete("one"); // true',  eq(wo.delete("one"), true));
        it('wo.delete("one"); // false', eq(wo.delete("one"), false));
        it('o = ' + jstr(o),
           eq_deeply(o, {zero:0}));
        it('wo.size === 1', eq(wo.size, 1));
        // keys, values, items
        o = {zero:0, one:1}
        it('.keys()',   eq_deeply(_(o).keys().value, ['zero', 'one']));
        it('.values()', eq_deeply(_(o).values().value, [0, 1]));
        it('.items()',  
           eq_deeply(_(o).items().value, [['zero',0], ['one',1]]));
    })
})(this);
