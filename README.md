[![build status](https://secure.travis-ci.org/dankogai/js-wrap.png)](http://travis-ci.org/dankogai/js-wrap)

wrap.js
=======

Universal Wrapper Object System for ECMAScript 5 and beyond

Usage
-----

### From HTML:

````html
<script src="wrap.js"></script>
````

### On node.js:

````javascript
require('wrap');
````

Synopsis
--------

````javascript
// for convenience
var _ = Object.Wrap;
// singleton method!
_(42)
  .learn('square', function() { return this*this })
  .square() * 1;    // 1764;
(42).square();      // TypeError: Object 42 has no method 'square'
// class method without changing Number
_.Number.prototype
  .learn('times', function(f) { for (var i = 0; i < this; i++) f(i) });
_(42).times(function(n){ console.log(n) });  // see your log!
(42).times(function(n){ console.log(n) });	// TypeError: Object 42 has no method 'times'

````

Description
-----------

This script provides a universal wrapper object system for ECMAScript 5 and beyond.

### Object.Wrap( *obj* *[, klass]* )

That's where all begins.  It wraps the object in a way that behaves almost the same as unwrapped original without worring about clobbering the prototype chain.

Like `Object()` which wraps primitives types and leaves objects intact, `Object.Wrap()` returns wrapped object if it can wrap it, or the original object if it is already wrapped or it doesn't know how to wrap it.

````javascript
Object(o) === o;        // true if o is already an object
Object.Wrap(o) === o;   // true if o is already wrapped
````

And if wrapped, you can access its original, unwrapped value via `.valueOf()` or `.value`, which is a getter that calls `.valueOf()`.

Currently following types are wrapped by default:

+ `Number`
+ `String`
+ `Object`
+ `Array`

````javascript
if (!assert) assert = function(p) { if (!p) throw Error('assertion failed') };
````
````javascript
var n = 0,  wn = Object.Wrap(n),
    s = '', ws = Object.Wrap(s),
    o = {}, wo = Object.Wrap(o),
    a = [], wa = Object.Wrap(a);
assert(wn !== n && wn.value === n);
assert(ws !== s && ws.value === s);
assert(wo !== n && wo.value === o);
assert(wa !== n && wa.value === a);
````

And the following types are wrapped by giving truthy value to the secound argument *klass*:

+ `Null`
+ `Undefined`
+ `Boolean`
+ `Function`
+ `RegExp`
+ `Date`

Objects of any other classes like DOM objects stay unwrapped regardless of *klass*.

````javascript
var z = null,                   wz = Object.Wrap(z, 1),
    u = undefined,              wu = Object.Wrap(u, 1),
    b = false,                  wb = Object.Wrap(b, 1),
    f = function(a){return a},  wf = Object.Wrap(f, 1),
    r = /^.*$/,                 wr = Object.Wrap(r, 1),
    d = new Date(0),            wd = Object.Wrap(d, 1);
assert(Object.Wrap(z) === z && wz !== z && wz.value === z);
assert(Object.Wrap(u) === u && wu !== u && wu.value === u);
assert(Object.Wrap(b) === b && wb !== b && wz.value === b);
assert(Object.Wrap(f) === f && wf !== f && wz.value === f);
assert(Object.Wrap(r) === r && wr !== r && wz.value === r);
assert(Object.Wrap(d) === d && wd !== d && wz.value === d);
````

#### `var _ = Object.Wrap;`

You can directly call `Object.wrap()` but it is handier to alias that with following idiom:

````javascript
var _ = Object.Wrap;    // or '$' or 'wrap' or any name you like -- it's lexical
````

From now on, we assume `_` be aliased to `Object.Wrap`.

#### Why `Null`, `Undefined`, and `Boolean` are not wrapped by default

They are not wrapped by default because unlike `Numbers` and `String`, boolean operators do not coerce.

````javascript
Object(21)  + Object(21);   // 42
Object('4') + Object('2');  // '42'
!!Object(false);            // surprisingly true
                            // because ! does not coerce 
                            // and objects are always true
````

Like `Object()`'ed primitives, `Object.Wrap()`'ed objects gets unwrapped by operators:

````javascript
_(21)  + _(21);         // 42
_('4') + _('2');        // '42'
!!_(false);             // false because it is not wrapped
!!_(null);              // false
!!_(undefined);         // false
!!_(false, 1);          // true because it is wrapped
!!_(false, 1).value;    // false because it is unwrapped explicitly
````

### `.learn()`

It is pointless to wrap objects unless you can extend it at ease.  We resort to wrapping them because [it is considered harmful to extend built-in prototypes](#why-wrap), most notably `Object.prototype`.  But to extend methods for wrapped objects, you have to first unwrap `this` and all arguments, feed it to the functions, then wrap it back again.  That's pain in the rhino arse!

the `.learn()` method is exactly for that.

#### .learn(*name*, *fun* *[, klass]*)

You have already seen it in [Synopsis](#synopsis).  Just define a method as you define an ordinary method in prototype and `.learn()` converts that for wrapped version.

````
var wn = _(42);
wn.learn('square', function() { return this*this }, 'Number');
````

The third argument *klass* is optional.  If specified it is used to determine the return type.  When lost, just leave it blank.

#### .learn( *methods* )

Or you can pass many methods at once by passing *methods* the object whose key is the name of the method and the value is the definition.

````javascript
_.Number.prototype.learn({
    times:function(f) { for (var i = 0; i < this; i++) f(i) },
    square:function() { return this*this }
})
````

As a matter of fact, most methods predefined in this script are defined that way.

### .value

The wrapped objects in this module tries to unwrap when necessary but sometimes you have to unwrap manually, notably collection types like `Array` and `Object`.  In which case just `.valueOf()` or `.value`.  The latter is a getter which just invokes `.valueOf()`.

````javascript
_([0,1,2,3]).slice(1);          // still wrapped
_([0,1,2,3]).slice(1).value;    // [1,2,3]
````

You save `()` compared to [jQuery] or [Underscore.js].

### Alternatives to []

One inevitable inconveniences of wrapped objects is you can no longer use `[]` to access the element of collection types.

````javascript
_([0,1,2,3])[1];        // undefined
_([0,1,2,3])[4] = 4;    // futile
_([0,1,2,3]).push(4)    // though this one works
````

To cope with that, wrapped collection types come with accessors.

#### .has( *key*)

Checks the presence of the *key* in the original value.

````javascript
_([0,1,2,3]).has(1);            // true
_([0,1,2,3]).has(4);            // false
_({zero:0,one:1}).has('zero');  // true
_({zero:0,one:1}).has('four');  // false
````

#### .get( *key* )

Gets the value of *key*.  The return value is **wrapped**.

````javascript
_([0,1,2,3]).get(1);            // _(1)
_([0,1,2,3]).get(4);            // undefined
_({zero:0,one:1}).get('zero');  // _(0)
_({zero:0,one:1}).has('four');  // undefined
````

#### .set( *key*, *value* )

Sets the value of *key* to *value*.

````javascript
var wa = [0,1,2,3];
wa.set(5, 5);   // _(5) is the return value
wa.value;       // [0,1,2,3,undefined,5]
var wo = {zero:0,one:1};
wo.set('five', 5);
wo.value;       // {zero:0,one:1,five:5}
````
#### .delete( *key* )

Deletes *key* from the object.
Returns `true` on success, `false` on failure (*key* is nonexistent).

````javascript
var wa = [0,1,2,3];
wa.delete(0);       // true
wa.delete(4);       // false
wa.value;           // [1,2,3]
var wo = {zero:0,one:1};
wo.delete('zero');  // true
wo.delete('five');  // false
wo.value;           // {one:1}
````

### Predefined Methods

The whole point of this script to make object (un)?wrapping as easy and transparent as possible.  Therefore most of built-in methods are already `learn()`ed.

````javascript
_({zero:0,one:1,two:2,three:3})
    .values()                                   // _([0,1,2,3]),
    .map(function(x){ return x * x })           // _([0,1,4,9]),
    .filter(function(x){ return x % 2 === 0})   // _([0,4]),
    .pop()                                      // _(4)
    * 10 + 2                                    // 42
````

See the source for the complete list of predefined methods.

Why Wrap?
---------

### Prototype extension considered harmful

[Prototype.js] has proven two things.

[Prototype.js]: http://prototypejs.org/

1. Prototype extension is powerful
2. Prototype extension is dangerous.

It's powerful because it propagates to all instances.
If you want ruby-like `.times`, the snippet below is all what it takes.

````javascript
Number.prototype.times = function(f) {
    for (var i = 0; i < this; i++) f(i);
};
````

And it is dangerous because it propagates to all instances.  Just add a method to `Object.prototype` and you break `for (var p in o)`, even if `o` is `{}`;
````javascript
//  Just don't do that!
Object.prototype.keys = function() {
    var result = [];
    for (var p in this) if (this.hasOwnProperty(p)) result.push(p);
    return result;
};
(function(o){
    console.log(o.keys());
    for (var p in o) console.log(p);
})({zero:0});
````

So even [Prototype.js] had to abstain from extending `Object.prototype`.

ECMAScript 5 introduced `Object.defineProperty` so you can extend relatively safely:

````javascript
Object.defineProperty(Object.prototype, 'keys', {
    value:function() {
        var result = [];
        for (var p in this) if (this.hasOwnProperty(p)) result.push(p);
        return result;
    },
    enumerable: false,  // does the trick,
    configurable: true,
    writable:true
});
(function(o){
    console.log(o.keys());
    for (var p in o) console.log(p);
})({zero:0});
````

But not safe enough.  Consider the following:

````javascript
console.log(({keys:'what keys?'}).keys())
````

The problem is *obj.propname* is always *obj['propname']* and its own property always masks its prototype.  Fortunately we have `Function.prototype.apply` (and `Function.prototype.call`) so you can circumvent as follows:

````javascript
console.log(
    ({}).keys.apply({keys:'what keys?'})
);
````

But this breaks the method chain, meaning virtually all the benefits of prototype extension is blown.

### If you can't extend it, wrap it.

Then came [jQuery] and [Underscore.js], sporting method chains without clobbering methods.  How do they do that?

[jQuery]: http://jquery.org/
[Underscore.js]: http://underscorejs.org/

That's where **wrapping** comes to rescue
