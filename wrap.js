/*
 * $Id$
 *
 *  (c) 2013 Dan Kogai
 *
 *  Licensed under the MIT license.
 *  http://www.opensource.org/licenses/mit-license
 *
 */

(function(root) {
    'use strict';
    if (typeof Object.Wrap === 'function') return;
    var create = Object.create;
    if (!create || 'hasOwnProperty' in create(null)) {
        throw new Error('ES5 unsupported');
    }
    var O = Object, OP = O.prototype,
    A = Array, AP = A.prototype,
    F = Function, FP = F.prototype,
    B = Boolean, BP = B.prototype,
    N = Number, NP = N.prototype,
    S = String, SP = S.prototype,
    R = RegExp, RP = R.prototype,
    D = Date, DP = D.prototype,
    defineProperties = O.defineProperties,
    defineProperty = O.defineProperty,
    getOwnPropertyDescriptor = O.getOwnPropertyDescriptor,
    getOwnPropertyNames = O.getOwnPropertyNames,
    getPrototypeOf = O.getPrototypeOf,
    isPrototypeOf = OP.isPrototypeOf,
    hasOwnProperty = OP.hasOwnProperty,
    keys = O.keys,
    slice = AP.slice,
    toString = OP.toString,
    isArray = A.isArray;
    // exported functions
    // function public(){ ... }
    // internal functions
    // var private = function(){ ... }
    var has = function(o, k) { return hasOwnProperty.call(o, k) };
    var classOf = function(o) {
        var t = typeof o;
        var c = t !== 'object'
            ? t[0].toUpperCase() + t.slice(1)
            : isArray(o) ? 'Array' : toString.call(o).slice(8, -1)
        return c;
    };
    var _valueOf = function() { return this.__value__ };
    var _toString = function() { return '' + this.__value__};
    var _classOf = function() { return this.__class__ };
    var learn = function(name, fun, klass) {
        if (typeof name === 'string') {
            this[name] = function() {
                return _(fun.apply(
                    this.value,
                    slice.call(arguments).map(function(v) {
                        return isWrapped(v) ? v.value : v;
                    })
                ), klass);
            };
            defineProperty(this, name, {enumerable: false});
        } else {
            var pairs = name;
            getOwnPropertyNames(pairs).forEach(function(name) {
                var fun = pairs[name]; /* klass = fun.class; */
                this.learn(name, fun);
            }, this);
        }
        return this;
    };
    // Mother of all objects
    var Kernel = create(null, {
        valueOf: { value: _valueOf },
        toString: { value: _toString },
        classOf: { value: _classOf },
        toJSON: { value: _valueOf },
        value: { get: _valueOf },
        'class': { get: _classOf },
        learn: { value: learn }
    });
    function isWrapped(o) { return isPrototypeOf.call(Kernel, o) };
    var obj2specs = function(o) {
        var specs = create(null);
        keys(o).forEach(function(k) {
            specs[k] = { value: o[k], writable: true, configurable: true };
        });
        return specs;
    };
    //
    // I am not Underscore; it's just my nickname!
    //
    var _ = function Wrap(that, klass) {
        if (arguments.length < 1) throw TypeError('first argument missing');
        if (_.debug) console.log(arguments);
        // if already wrapped just return that
        if (isWrapped(that)) return that;
        if (!klass) { // if unspecifed, check the type of that
            klass = classOf(that);
            if (! _[klass]) return that;
            if (! _[klass].autowrap) return that;
        } else {
            if (typeof klass !== 'string') klass = classOf(that);
        }
        // wrap only supported types
        return _[klass] ? _[klass](that) : that;
    };
    // _.debug = true;
    _.Kernel = Kernel;
    _.isWrapped = isWrapped;
    // Boolean - wrapped only on explicit request
    _.Boolean = function(b) {
        return create(_.Boolean.prototype, {
            __class__: { value: 'Boolean' },
            __value__: { value: !!b }
        });
    };
    _.Boolean.prototype = create(Kernel);
    _.Boolean.prototype = create(Kernel, obj2specs({
        not: function() {
            return _.Boolean(!this.value);
        },
        and: function(b) {
            return _.Boolean(!!(this.value & _(b, true).value));
        },
        xor: function(b) {
            return _.Boolean(!!(this.value ^ _(b, true).value));
        },
        or: function(b) {
            return _.Boolean(!!(this.value | _(b, true).value));
        }
    }));
    // Number
    _.Number = function(n) {
        return create(_.Number.prototype, {
            __class__: { value: 'Number' },
            __value__: { value: 1 * n }
        });
    };
    _.Number.autowrap = true;
    _.Number.prototype = create(Kernel);
    _.Number.prototype.learn(picked(NP, [
        'toFixed', 'toExponential', 'toPrecision'
    ]));
    defineProperties(_.Number.prototype, obj2specs({
        toInteger: function(n) { return _.Number(~~this.value) }
    }));
    // String -- without hairy .blink and such
    _.String = function(s) {
        return create(_.String.prototype, {
            __class__: { value: 'String' },
            __value__: { value: '' + s }
        });
    };
    _.String.autowrap = true;
    _.String.prototype = create(Kernel);
    _.String.prototype.learn(picked(SP, [
        'charAt', 'charCodeAt', 'concat',
        'indexOf', 'lastIndexOf',
        'localeCompare', 'match', 'replace', 'search',
        'slice', 'split', 'substring', 'substr',
        'toLowerCase', 'toLocaleLowerCase',
        'toUpperCase', 'toLocaleUpperCase',
        'trim', 'trimLeft', 'trimRight'
    ]));
    defineProperties(_.String.prototype, {
        length: { get: function() { return this.value.length } }
    });
    // Object - wrapped as a collection type
    _.Object = function(o) {
        return create(_.Object.prototype, {
            __class__: { value: 'Object' },
            __value__: { value: o },
            __size__:  { value: keys(o).length, writable: true }
        });
    };
    _.Object.autowrap = true;
    _.Object.prototype = create(Kernel, obj2specs({
        has: function(k) { return has(this.__value__, k) },
        get: function(k) { return _(this.__value__[k]) },
        set: function(k, v) {
            if (!this.has(k)) this.__size__++;
            return _(this.__value__[k] = v);
        },
        'delete': function(k) {
            if (!this.has(k)) return false;
            this.__size__--;
            delete this.__value__[k];
            return true;
        }
    }));
    function extend(dst, src) {
        var isarray = isArray(src);
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    function copyOf(src) { // shallow copy
        return extend(create(getPrototypeOf(src)), src);
    }
    function defaults(dst, src) {
        var isarray = isArray(src);
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            if (has(dst, k)) return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    function pick(src, lst) {
        var keep = create(null),
        isarray = isArray(src);
        lst.forEach(function(k) { keep[k] = true });
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            if (keep[k]) return;
            delete src[k];
        });
        return src;
    };
    function picked(src, lst) {
        var isarray = isArray(src),
        dst = create(getPrototypeOf(src));
        lst.forEach(function(k) {
            if (isarray && k === 'length') return;
            if (!has(src, k)) return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    function omit(src, lst) {
        var isarray = isArray(src);
        lst.forEach(function(k) {
            if (isarray && k === 'length') return;
            if (!has(src, k)) return;
            delete src[k];
        });
        return src;
    };
    function omitted(src, lst) {
        var ignore = create(null),
        isarray = isArray(src),
        dst = create(getPrototypeOf(src));
        lst.forEach(function(k) { ignore[k] = true });
        getOwnPropertyNames(src).forEach(function(k) {
            if (isarray && k === 'length') return;
            if (has(ignore, k)) return;
            defineProperty(dst, k, getOwnPropertyDescriptor(src, k));
        });
        return dst;
    };
    _.Object.prototype.learn({
        copyOf: function(){ return copyOf(this) },
        keys: function() { return keys(this) },
        values: function() {
            return keys(this).map(function(k) { return this[k] });
        },
        items: function() {
            return keys(this).map(function(k) { return [k, this[k]] });
        },
        extend: function(o) { return extend(this, o) },
        defaults: function(o) { return defaults(this, o) },
        extended: function(o) { return extend(copyOf(this), o) },
        defaulted: function(o) { return defaults(copyOf(this), o) },
        pick: function(lst) {
            return pick(this, isArray(lst) ? lst : slice.call(arguments));
        },
        picked: function(lst) {
            return picked(this, isArray(lst) ? lst : slice.call(arguments));
        },
        omit: function(lst) {
            return omit(this, isArray(lst) ? lst : slice.call(arguments));
        },
        omitted: function(lst) {
            return omitted(this, isArray(lst) ? lst : slice.call(arguments));
        }
    });
    defineProperties(_.Object.prototype, {
        size: {
            get: function() { return this.__size__ }
        }
    });
    // Array
    _.Array = function(a) {
        return create(_.Array.prototype, {
            __class__: { value: 'Array' },
            __value__: { value: a }
        });
    };
    _.Array.autowrap = true;
    // Inheriting from _.Object.prototype
    _.Array.prototype = create(_.Object.prototype);
    _.Array.prototype.learn(picked(AP, [
        'toLocaleString', 'join',
        'pop', 'push', 'concat', 'reverse', 'shift', 'unshift',
        'slice', 'splice', 'sort',
        'filter', 'forEach', 'some', 'every', 'map',
        'indexOf', 'lastIndexOf', 'reduce', 'reduceRight'
    ]));
   defineProperties(_.Array.prototype, {
       length: {
            get: function() { return this.value.length },
            set: function(n) { return this.value.length = _(n).value * 1 }
       }
    });
    // Function - this one is a little tricky
    _.Function = function(f) {
        var w = f.bind(f);
        if (has(f, '__value__')) {
            getOwnPropertyNames(f).forEach(function(p) {
                defineProperty(w, p, getOwnPropertyDescriptor(f, p));
            });
        } else {
            var wfp = _.Function.prototype;
            getOwnPropertyNames(Kernel).forEach(function(p) {
                defineProperty(w, p, getOwnPropertyDescriptor(Kernel, p));
            });
            getOwnPropertyNames(wfp).forEach(function(p) {
                defineProperty(w, p, getOwnPropertyDescriptor(wfp, p));
            });
        }
        defineProperty(w, '__value__', {value: f});
        return w;
    };
    _.Function.prototype = create(Kernel, obj2specs({
        apply: function(ctx, args) {
            return _(this.__value__.apply(ctx, args));
        },
        // bind does not work :-(
        // TypeError: Bind must be called on a function
        call: function() {
              var args = slice.call(arguments),
              ctx = args.shift();
              return _(this.__value__.apply(ctx, args));
        }
    }));
    // RegExp - wrapped only opon request
    _.RegExp = function(r) {
        return create(_.RegExp.prototype, {
            __class__: { value: 'RegExp' },
            __value__: { value: r }
        });
    };
    _.RegExp.prototype = create(Kernel);
    _.RegExp.prototype.learn(picked(RP, [
        'exec', 'test', 'compile'
    ]));
    defineProperties(_.RegExp.prototype, {
        source: { get: function() { return this.value.source } },
        global: { get: function() { return this.value.global } },
        ignoreCase: { get: function() { return this.value.ignoreCase } },
        lastIndex: { get: function() { return this.value.ignoreCase } }
    });
    // Date - wrapped only opon request
    _.Date = function(d) {
        return create(_.Date.prototype, {
            __class__: { value: 'Date' },
            __value__: { value: d }
        });
    };
    _.Date.prototype = create(Kernel);
    _.Date.prototype.learn(picked(DP, [
        'setUTCFullYear', 'toLocaleString', 'setUTCMilliseconds',
        'toLocaleTimeString', 'toTimeString', /* toString, */
        'getUTCMilliseconds', 'getUTCFullYear', 'getMinutes',
        'toISOString', 'getTimezoneOffset', 'getYear',
        'setUTCMinutes', 'setUTCHours', 'getFullYear',
        'getUTCSeconds', 'getUTCDay', 'getMonth',
        'getMilliseconds', 'toDateString', 'getHours',
        'getUTCDate', 'getDay', 'setMonth', 'getUTCHours',
        'toLocaleDateString', 'toUTCString', 'setMinutes',
        'toGMTString', 'getTime', 'setYear', 'setDate', 'setTime',
        'getUTCMinutes', 'getDate', /* 'valueOf', 'toJSON', */
        'setUTCMonth', 'setFullYear', 'getSeconds', 'getUTCMonth',
        'setMilliseconds', 'setSeconds', 'setUTCSeconds',
        'setHours', 'setUTCDate'
    ]));
    // Install!
    Object.Wrap = _;
})(this);
