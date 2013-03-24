[![build status](https://secure.travis-ci.org/dankogai/js-wrap.png)](http://travis-ci.org/dankogai/js-wrap)

wrap.js
=======

Universal Wrapper Object for JavaScript

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
  .square() * 1;	// 1764;
(42).square();		// TypeError: Object 42 has no method 'square'
// class method without changing Number
_.Number.prototype
  .learn('times', function(f) { for (var i = 0; i < this; i++) f(i) });
_(42).times(function(n){ console.log(n) });	// see your log!
(42).times(function(n){ console.log(n) });	// TypeError: Object 42 has no method 'times'

````
