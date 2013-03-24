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

### on node.js

````javascript
require('wrap');
````


Synopsis
--------

````javascript
var _ = Object.Wrap;	// for convenience.
_(42)
	.learn('square',	// singleton method!
			function(){ return this*this })
	.square() * 1;	// 1764;
(42).square;		// TypeError: Object 42 has no method 'square'
_.Number.prototype
	.learn('times',		// class method without changing Number
			function(f) { for (var i = 0; i < this; i++) f(i) });
_(42).times(function(n){ console.log(n) });
(42).times(function(n){ console.log(n) });	// TypeError

````
