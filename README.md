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
  .square() * 1;  // 1764;
(42).square();    // TypeError: Object 42 has no method 'square'

// class method without changing Number
_.Number.prototype.learn({
    times: function(f) { for (var i = 0; i < this; i++) f(i) },
    toThe: function(n) { return Math.pow(this, n) }
});
 // see your log!
_(42).times(function(n){ console.log( _(2).toThe(n) ) });
 // TypeError: Object 42 has no method 'times'
(42).times(function(n){ console.log(   (2).toThe(n) ) });
````

Description
-----------

As seen above, `Object.Wrap()` wraps objects as transparently and painlessly as possible:

+ transparently
  + wrapped objects have same methods as its original
  + wrapped objects automatical unwraps on demand
+ painlessly
  + you can extend wrapped objects as easy as unwrapped version

So you can extend built-in methods without tainting built-in prototypes.

See [wrap.md](wrap.md#description) for details!
