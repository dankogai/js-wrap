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
````
````javascript
// for convenience -- any identifier will do
var $ = Object.Wrap
// class method without changing Number
$.Number.prototype.learn({
    times: function(f) { for (var i = 0; i < this; i++) f(i) },
    toThe: function(n) { return Math.pow(this, n) }
});
 // see your log!
$(42).times(function(n){ console.log(_(2).toThe(n)) });
 // TypeError: Object 42 has no method 'times'
(42).times(function(n){ console.log(_(2).toThe(n)) });

````

See [wrap.md] for details!
