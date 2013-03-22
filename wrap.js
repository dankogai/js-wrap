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
    A = Array,      AP = A.prototype,
    F = Function,   FP = F.prototype,
    B = Boolean,    BP = B.prototype,
    N = Number,     NP = N.prototype,
    S = String,     SP = S.prototype,
    R = RegExp,     RP = R.prototype,
    defineProperties = O.defineProperties,
    getOwnPropertyNames = O.getOwnPropertyNames,
    hasOwnProperty = OP.hasOwnProperty,
    keys = O.keys,
    slice = AP.slice,
    toString = OP.toString
    ;
    var has = function(o, k){ return  hasOwnProperty.call(o, k) };
    var classOf = function(o){ return toString.call(o).slice(8,-1) };
    // Mother of all objects
    var valueOf = function(){ return this.__value__ };
    var Kernel = create(null, {
        valueOf:  { value: valueOf },
        value:    { get: valueOf },
        toJSON:   { value: function() { return this.value } },
        learn:    { value: function(name, fun, type) {
            this[name] = function() {
                return _(fun.apply(this.value, arguments), type);
            }
            return this;
        }}
    });
    var obj2specs = function(o) {
        var specs = create(null);
        keys(o).forEach(function(k){ 
            specs[k] = { value:o[k], writable:true, configurable:true }; 
        });
        return specs;
    };
    var _import = function(space, name) {
        var method = space[name];
        if (!method) return;
        return function() {
            return _(
                method.apply(
                    this.value, 
                    slice.call(arguments).map(
                        function(v){ return _(v).value }
                    )));
        };
    };
    var _importThese = function(space, names) {
        var result = {};
        names = names || getOwnPropertyNames(space);
        names.forEach(function(name) {
            var imported = _import(space, name);
            if (imported) result[name] = imported;
        });
        return result;
    };
    //
    // I am not Underscore; it's just my nickname!
    //
    function _(that, klass) {
        // console.log(arguments);
        // We do not wrap nullables
        if (that === void(0) || that === null) return that;
        // And already wrapped objects
        if (has(that, '__value__')) return that;
        klass = klass || classOf(that);
        if (!_[klass]) throw new TypeError(klass + ' unsupported');
        return _[klass](that);
    };
    // Boolean
    _.Boolean = function(b) {
        return create(_.Boolean.prototype, {
             __value__ : { value:!!b }
        });
    };
    _.Boolean.prototype = create(Kernel, obj2specs({
        not: function(){ 
            return _(!this.value, 'Boolean') 
        },
        and: function(b){ 
            return _(!!(this.value & _(b).value), 'Boolean')
        },
        xor: function(b){ 
            return _(!!(this.value ^ _(b).value), 'Boolean') 
        },
        or:  function(b){ 
            return _(!!(this.value | _(o).value), 'Boolean') 
        },
    }));
    // Number
    _.Number = function(n) {
        return create(_.Number.prototype, {
            __value__ : { value:1*n }
        });
    };
    _.Number.prototype = create(Kernel, obj2specs(_importThese(
        NP, [
        "toFixed", "toExponential", "toPrecision"
        ]
    )));
    defineProperties(_.Number.prototype, obj2specs({
        toInteger: function(n) {
            return _( ~~this.value, 'Number' );
        }        
    }));
    // String -- without hairy .blink and such
    _.String = function(s) {
        return create(_.String.prototype, {
            __value__ : { value:""+s }
        });
    };
    _.String.prototype = create(Kernel, obj2specs(_importThese(
        SP,[
            "charAt", "charCodeAt", "concat", 
            "indexOf", "lastIndexOf", 
            "localeCompare", "match", "replace", "search", 
            "slice", "split", "substring", "substr", 
            "toLowerCase", "toLocaleLowerCase", 
            "toUpperCase", "toLocaleUpperCase", 
            "trim", "trimLeft", "trimRight"
        ]
    )));
    defineProperties(_.String.prototype, {
        length: { get:function(){ return this.value.length } }
    });
    // Object
    _.Object = function(o) {
        return create(_.Object.prototype, {
            __value__ : { value:o },
            __size__  : { value:keys(o).length, writable:true }
        });
    };
    // Do not wrap return values if it is Boolean.
    // They are not coerced via && and ||
    _.Object.prototype = create(Kernel, obj2specs({
        has: function(k){ return has(this.value, k) },
        get: function(k){ return _(this.__value__[k]) },
        set: function(k, v){ 
            if (!this.has(k)) this.__size__++;
            return _(this.__value__[k] = v) 
        },
        'delete': function(k) { 
            if (!this.has(k)) return false;
            this.__size__--;
            delete this.__value__[k];
            return true;
        },
        keys: function(){
            return _(keys(this.__value__), 'Array') 
        },
        values: function(){ 
            return _( keys(this.value).map(function(k){ 
                return this.__value__[k] 
            }, this), 'Array')
        },
        items: function(){ 
            return _(
                keys(this.value).map(function(k){ 
                    return [ k, this.__value__[k] ]
                }, this), 'Array')
        },
        toString: function(r, s) {
            return JSON.stringify(this.__value__, r, s);
        },
    }));
    defineProperties(_.Object.prototype, {
        size: { 
            get:function(){ return this.__size__ }
        }
    });
    // Array
    _.Array = function(a) {
        return create(_.Array.prototype, {
            __value__ : { value:a }
        });
    };
    // Inheriting from _.Object.prototype
    _.Array.prototype = create(_.Object.prototype, obj2specs(_importThese(
        AP, [
            "toLocaleString", "join", 
            "pop", "push", "concat", "reverse", "shift", "unshift", 
            "slice", "splice", "sort", 
            "filter", "forEach", "some", "every", "map", 
            "indexOf", "lastIndexOf", "reduce", "reduceRight"
        ]
    )));
   defineProperties(_.Array.prototype, {
       length: { 
            get:function(){ return this.value.length },
            set:function(n){ return this.value.length = _(n).value * 1 }
       },
    });
    // RegExp
    _.RegExp = function(r) {
        return create(_.RegExp.prototype, {
            __value__ : { value:r }
        });
    };
    _.RegExp.prototype = create(Kernel, obj2specs(_importThese(
        RP, [ "exec", "test", "compile" ]
    )));
    defineProperties(_.RegExp.prototype, {
        toString: { value:function(){ return this.value.toString() } },
        source: { get:function(){ return this.value.source } },
        global: { get:function(){ return this.value.global } },
        ignoreCase: { get:function(){ return this.value.ignoreCase } },
        lastIndex: { get:function(){ return this.value.ignoreCase } },
    });
    // Install!
    Object.Wrap = _;
})(this);
