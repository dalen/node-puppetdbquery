(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.parse = exports.parser = exports.evaluator = undefined;
	
	var _ast = __webpack_require__(2);
	
	var _ast2 = _interopRequireDefault(_ast);
	
	__webpack_require__(9);
	
	var _parser = __webpack_require__(10);
	
	var _parser2 = _interopRequireDefault(_parser);
	
	var _evaluator = __webpack_require__(13);
	
	var _evaluator2 = _interopRequireDefault(_evaluator);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var parse = function parse(query) {
	  var ast = _parser2.default.parse(query);
	  return (0, _evaluator2.default)(ast);
	};
	
	exports.evaluator = _evaluator2.default;
	exports.parser = _parser2.default;
	exports.parse = parse;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	var _types = __webpack_require__(3);
	
	var _types2 = _interopRequireDefault(_types);
	
	var _shared = __webpack_require__(4);
	
	var _shared2 = _interopRequireDefault(_shared);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var def = _types2.default.Type.def;
	var or = _types2.default.Type.or;
	var builtin = _types2.default.builtInTypes;
	var isString = builtin.string;
	var isNumber = builtin.number;
	var isBoolean = builtin.boolean;
	var defaults = _shared2.default.defaults;
	var geq = _shared2.default.geq;
	
	def('Printable').field('loc', or(def('SourceLocation'), null), defaults.null, true);
	
	def('Node').bases('Printable').field('type', isString);
	
	def('SourceLocation').build('start', 'end', 'source').field('start', def('Position')).field('end', def('Position')).field('source', or(isString, null), defaults.null);
	
	def('Position').build('line', 'column').field('line', geq(1)).field('column', geq(0));
	
	def('Literal').bases('Node');
	
	// Merge literals into Literal type?
	def('Boolean').bases('Literal').build('value').field('value', isBoolean);
	
	def('String').bases('Literal').build('value').field('value', isString);
	
	def('Number').bases('Literal').build('value').field('value', isNumber);
	
	def('Date').bases('Literal').build('value').field('value', isString);
	
	def('Expression').bases('Node');
	
	def('BinaryExpression').bases('Expression').field('left', def('Expression')).field('right', def('Expression'));
	
	def('UnaryExpression').bases('Expression').field('expression', def('Expression'));
	
	def('AndExpression').bases('BinaryExpression').build('left', 'right');
	
	def('OrExpression').bases('BinaryExpression').build('left', 'right');
	
	def('NotExpression').bases('UnaryExpression').build('expression');
	
	def('ParentesizedExpression').bases('UnaryExpression').build('expression');
	
	def('BlockExpression').bases('UnaryExpression').build('expression');
	
	def('Comparison').bases('Expression').build('operator', 'left', 'right').field('operator', or('=', '>=', '<=', '<', '>', '!=', '~', '!~')).field('left', def('IdentifierPath')).field('right', def('Literal'));
	
	def('Identifier').bases('Node').build('name').field('name', or(isString, isNumber));
	
	def('RegexpIdentifier').bases('Identifier').build('name');
	
	def('IdentifierPath').bases('Node').build('components', 'regexp').field('components', [or(def('Identifier'), null)]).field('regexp', isBoolean, defaults.false);
	
	def('Query').bases('Node').build('expression').field('expression', or(def('Expression'), null), defaults.null);
	
	def('Subquery').bases('Expression').build('endpoint', 'expression').field('endpoint', isString).field('expression', def('Expression'));
	
	def('Resource').bases('Expression').build('res_type', 'title', 'exported', 'parameters').field('res_type', isString).field('title', def('Identifier')).field('exported', isBoolean).field('parameters', or(def('BlockExpression'), null), defaults.null);
	
	def('RegexpNodeMatch').bases('Expression').build('value')
	// TODO: his is a bit silly, should just have the string directly here
	.field('value', def('IdentifierPath'));
	
	_types2.default.finalize();
	
	exports.Type = _types2.default.Type;
	exports.builtInTypes = _types2.default.builtInTypes;
	exports.namedTypes = _types2.default.namedTypes;
	exports.builders = _types2.default.builders;
	exports.defineMethod = _types2.default.defineMethod;
	exports.getFieldNames = _types2.default.getFieldNames;
	exports.getFieldValue = _types2.default.getFieldValue;
	exports.eachField = _types2.default.eachField;
	exports.someField = _types2.default.someField;
	exports.getSupertypeNames = _types2.default.getSupertypeNames;
	exports.finalize = _types2.default.finalize;
	exports.NodePath = __webpack_require__(5);
	exports.PathVisitor = __webpack_require__(8);
	
	exports.visit = exports.PathVisitor.visit;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var Ap = Array.prototype;
	var slice = Ap.slice;
	var map = Ap.map;
	var each = Ap.forEach;
	var Op = Object.prototype;
	var objToStr = Op.toString;
	var funObjStr = objToStr.call(function(){});
	var strObjStr = objToStr.call("");
	var hasOwn = Op.hasOwnProperty;
	
	// A type is an object with a .check method that takes a value and returns
	// true or false according to whether the value matches the type.
	
	function Type(check, name) {
	    var self = this;
	    if (!(self instanceof Type)) {
	        throw new Error("Type constructor cannot be invoked without 'new'");
	    }
	
	    // Unfortunately we can't elegantly reuse isFunction and isString,
	    // here, because this code is executed while defining those types.
	    if (objToStr.call(check) !== funObjStr) {
	        throw new Error(check + " is not a function");
	    }
	
	    // The `name` parameter can be either a function or a string.
	    var nameObjStr = objToStr.call(name);
	    if (!(nameObjStr === funObjStr ||
	          nameObjStr === strObjStr)) {
	        throw new Error(name + " is neither a function nor a string");
	    }
	
	    Object.defineProperties(self, {
	        name: { value: name },
	        check: {
	            value: function(value, deep) {
	                var result = check.call(self, value, deep);
	                if (!result && deep && objToStr.call(deep) === funObjStr)
	                    deep(self, value);
	                return result;
	            }
	        }
	    });
	}
	
	var Tp = Type.prototype;
	
	// Throughout this file we use Object.defineProperty to prevent
	// redefinition of exported properties.
	exports.Type = Type;
	
	// Like .check, except that failure triggers an AssertionError.
	Tp.assert = function(value, deep) {
	    if (!this.check(value, deep)) {
	        var str = shallowStringify(value);
	        throw new Error(str + " does not match type " + this);
	    }
	    return true;
	};
	
	function shallowStringify(value) {
	    if (isObject.check(value))
	        return "{" + Object.keys(value).map(function(key) {
	            return key + ": " + value[key];
	        }).join(", ") + "}";
	
	    if (isArray.check(value))
	        return "[" + value.map(shallowStringify).join(", ") + "]";
	
	    return JSON.stringify(value);
	}
	
	Tp.toString = function() {
	    var name = this.name;
	
	    if (isString.check(name))
	        return name;
	
	    if (isFunction.check(name))
	        return name.call(this) + "";
	
	    return name + " type";
	};
	
	var builtInCtorFns = [];
	var builtInCtorTypes = [];
	var builtInTypes = {};
	exports.builtInTypes = builtInTypes;
	
	function defBuiltInType(example, name) {
	    var objStr = objToStr.call(example);
	
	    var type = new Type(function(value) {
	        return objToStr.call(value) === objStr;
	    }, name);
	
	    builtInTypes[name] = type;
	
	    if (example && typeof example.constructor === "function") {
	        builtInCtorFns.push(example.constructor);
	        builtInCtorTypes.push(type);
	    }
	
	    return type;
	}
	
	// These types check the underlying [[Class]] attribute of the given
	// value, rather than using the problematic typeof operator. Note however
	// that no subtyping is considered; so, for instance, isObject.check
	// returns false for [], /./, new Date, and null.
	var isString = defBuiltInType("truthy", "string");
	var isFunction = defBuiltInType(function(){}, "function");
	var isArray = defBuiltInType([], "array");
	var isObject = defBuiltInType({}, "object");
	var isRegExp = defBuiltInType(/./, "RegExp");
	var isDate = defBuiltInType(new Date, "Date");
	var isNumber = defBuiltInType(3, "number");
	var isBoolean = defBuiltInType(true, "boolean");
	var isNull = defBuiltInType(null, "null");
	var isUndefined = defBuiltInType(void 0, "undefined");
	
	// There are a number of idiomatic ways of expressing types, so this
	// function serves to coerce them all to actual Type objects. Note that
	// providing the name argument is not necessary in most cases.
	function toType(from, name) {
	    // The toType function should of course be idempotent.
	    if (from instanceof Type)
	        return from;
	
	    // The Def type is used as a helper for constructing compound
	    // interface types for AST nodes.
	    if (from instanceof Def)
	        return from.type;
	
	    // Support [ElemType] syntax.
	    if (isArray.check(from))
	        return Type.fromArray(from);
	
	    // Support { someField: FieldType, ... } syntax.
	    if (isObject.check(from))
	        return Type.fromObject(from);
	
	    if (isFunction.check(from)) {
	        var bicfIndex = builtInCtorFns.indexOf(from);
	        if (bicfIndex >= 0) {
	            return builtInCtorTypes[bicfIndex];
	        }
	
	        // If isFunction.check(from), and from is not a built-in
	        // constructor, assume from is a binary predicate function we can
	        // use to define the type.
	        return new Type(from, name);
	    }
	
	    // As a last resort, toType returns a type that matches any value that
	    // is === from. This is primarily useful for literal values like
	    // toType(null), but it has the additional advantage of allowing
	    // toType to be a total function.
	    return new Type(function(value) {
	        return value === from;
	    }, isUndefined.check(name) ? function() {
	        return from + "";
	    } : name);
	}
	
	// Returns a type that matches the given value iff any of type1, type2,
	// etc. match the value.
	Type.or = function(/* type1, type2, ... */) {
	    var types = [];
	    var len = arguments.length;
	    for (var i = 0; i < len; ++i)
	        types.push(toType(arguments[i]));
	
	    return new Type(function(value, deep) {
	        for (var i = 0; i < len; ++i)
	            if (types[i].check(value, deep))
	                return true;
	        return false;
	    }, function() {
	        return types.join(" | ");
	    });
	};
	
	Type.fromArray = function(arr) {
	    if (!isArray.check(arr)) {
	        throw new Error("");
	    }
	    if (arr.length !== 1) {
	        throw new Error("only one element type is permitted for typed arrays");
	    }
	    return toType(arr[0]).arrayOf();
	};
	
	Tp.arrayOf = function() {
	    var elemType = this;
	    return new Type(function(value, deep) {
	        return isArray.check(value) && value.every(function(elem) {
	            return elemType.check(elem, deep);
	        });
	    }, function() {
	        return "[" + elemType + "]";
	    });
	};
	
	Type.fromObject = function(obj) {
	    var fields = Object.keys(obj).map(function(name) {
	        return new Field(name, obj[name]);
	    });
	
	    return new Type(function(value, deep) {
	        return isObject.check(value) && fields.every(function(field) {
	            return field.type.check(value[field.name], deep);
	        });
	    }, function() {
	        return "{ " + fields.join(", ") + " }";
	    });
	};
	
	function Field(name, type, defaultFn, hidden) {
	    var self = this;
	
	    if (!(self instanceof Field)) {
	        throw new Error("Field constructor cannot be invoked without 'new'");
	    }
	    isString.assert(name);
	
	    type = toType(type);
	
	    var properties = {
	        name: { value: name },
	        type: { value: type },
	        hidden: { value: !!hidden }
	    };
	
	    if (isFunction.check(defaultFn)) {
	        properties.defaultFn = { value: defaultFn };
	    }
	
	    Object.defineProperties(self, properties);
	}
	
	var Fp = Field.prototype;
	
	Fp.toString = function() {
	    return JSON.stringify(this.name) + ": " + this.type;
	};
	
	Fp.getValue = function(obj) {
	    var value = obj[this.name];
	
	    if (!isUndefined.check(value))
	        return value;
	
	    if (this.defaultFn)
	        value = this.defaultFn.call(obj);
	
	    return value;
	};
	
	// Define a type whose name is registered in a namespace (the defCache) so
	// that future definitions will return the same type given the same name.
	// In particular, this system allows for circular and forward definitions.
	// The Def object d returned from Type.def may be used to configure the
	// type d.type by calling methods such as d.bases, d.build, and d.field.
	Type.def = function(typeName) {
	    isString.assert(typeName);
	    return hasOwn.call(defCache, typeName)
	        ? defCache[typeName]
	        : defCache[typeName] = new Def(typeName);
	};
	
	// In order to return the same Def instance every time Type.def is called
	// with a particular name, those instances need to be stored in a cache.
	var defCache = Object.create(null);
	
	function Def(typeName) {
	    var self = this;
	    if (!(self instanceof Def)) {
	        throw new Error("Def constructor cannot be invoked without 'new'");
	    }
	
	    Object.defineProperties(self, {
	        typeName: { value: typeName },
	        baseNames: { value: [] },
	        ownFields: { value: Object.create(null) },
	
	        // These two are populated during finalization.
	        allSupertypes: { value: Object.create(null) }, // Includes own typeName.
	        supertypeList: { value: [] }, // Linear inheritance hierarchy.
	        allFields: { value: Object.create(null) }, // Includes inherited fields.
	        fieldNames: { value: [] }, // Non-hidden keys of allFields.
	
	        type: {
	            value: new Type(function(value, deep) {
	                return self.check(value, deep);
	            }, typeName)
	        }
	    });
	}
	
	Def.fromValue = function(value) {
	    if (value && typeof value === "object") {
	        var type = value.type;
	        if (typeof type === "string" &&
	            hasOwn.call(defCache, type)) {
	            var d = defCache[type];
	            if (d.finalized) {
	                return d;
	            }
	        }
	    }
	
	    return null;
	};
	
	var Dp = Def.prototype;
	
	Dp.isSupertypeOf = function(that) {
	    if (that instanceof Def) {
	        if (this.finalized !== true ||
	            that.finalized !== true) {
	            throw new Error("");
	        }
	        return hasOwn.call(that.allSupertypes, this.typeName);
	    } else {
	        throw new Error(that + " is not a Def");
	    }
	};
	
	// Note that the list returned by this function is a copy of the internal
	// supertypeList, *without* the typeName itself as the first element.
	exports.getSupertypeNames = function(typeName) {
	    if (!hasOwn.call(defCache, typeName)) {
	        throw new Error("");
	    }
	    var d = defCache[typeName];
	    if (d.finalized !== true) {
	        throw new Error("");
	    }
	    return d.supertypeList.slice(1);
	};
	
	// Returns an object mapping from every known type in the defCache to the
	// most specific supertype whose name is an own property of the candidates
	// object.
	exports.computeSupertypeLookupTable = function(candidates) {
	    var table = {};
	    var typeNames = Object.keys(defCache);
	    var typeNameCount = typeNames.length;
	
	    for (var i = 0; i < typeNameCount; ++i) {
	        var typeName = typeNames[i];
	        var d = defCache[typeName];
	        if (d.finalized !== true) {
	            throw new Error("" + typeName);
	        }
	        for (var j = 0; j < d.supertypeList.length; ++j) {
	            var superTypeName = d.supertypeList[j];
	            if (hasOwn.call(candidates, superTypeName)) {
	                table[typeName] = superTypeName;
	                break;
	            }
	        }
	    }
	
	    return table;
	};
	
	Dp.checkAllFields = function(value, deep) {
	    var allFields = this.allFields;
	    if (this.finalized !== true) {
	        throw new Error("" + this.typeName);
	    }
	
	    function checkFieldByName(name) {
	        var field = allFields[name];
	        var type = field.type;
	        var child = field.getValue(value);
	        return type.check(child, deep);
	    }
	
	    return isObject.check(value)
	        && Object.keys(allFields).every(checkFieldByName);
	};
	
	Dp.check = function(value, deep) {
	    if (this.finalized !== true) {
	        throw new Error(
	            "prematurely checking unfinalized type " + this.typeName
	        );
	    }
	
	    // A Def type can only match an object value.
	    if (!isObject.check(value))
	        return false;
	
	    var vDef = Def.fromValue(value);
	    if (!vDef) {
	        // If we couldn't infer the Def associated with the given value,
	        // and we expected it to be a SourceLocation or a Position, it was
	        // probably just missing a "type" field (because Esprima does not
	        // assign a type property to such nodes). Be optimistic and let
	        // this.checkAllFields make the final decision.
	        if (this.typeName === "SourceLocation" ||
	            this.typeName === "Position") {
	            return this.checkAllFields(value, deep);
	        }
	
	        // Calling this.checkAllFields for any other type of node is both
	        // bad for performance and way too forgiving.
	        return false;
	    }
	
	    // If checking deeply and vDef === this, then we only need to call
	    // checkAllFields once. Calling checkAllFields is too strict when deep
	    // is false, because then we only care about this.isSupertypeOf(vDef).
	    if (deep && vDef === this)
	        return this.checkAllFields(value, deep);
	
	    // In most cases we rely exclusively on isSupertypeOf to make O(1)
	    // subtyping determinations. This suffices in most situations outside
	    // of unit tests, since interface conformance is checked whenever new
	    // instances are created using builder functions.
	    if (!this.isSupertypeOf(vDef))
	        return false;
	
	    // The exception is when deep is true; then, we recursively check all
	    // fields.
	    if (!deep)
	        return true;
	
	    // Use the more specific Def (vDef) to perform the deep check, but
	    // shallow-check fields defined by the less specific Def (this).
	    return vDef.checkAllFields(value, deep)
	        && this.checkAllFields(value, false);
	};
	
	Dp.bases = function() {
	    var args = slice.call(arguments);
	    var bases = this.baseNames;
	
	    if (this.finalized) {
	        if (args.length !== bases.length) {
	            throw new Error("");
	        }
	        for (var i = 0; i < args.length; i++) {
	            if (args[i] !== bases[i]) {
	                throw new Error("");
	            }
	        }
	        return this;
	    }
	
	    args.forEach(function(baseName) {
	        isString.assert(baseName);
	
	        // This indexOf lookup may be O(n), but the typical number of base
	        // names is very small, and indexOf is a native Array method.
	        if (bases.indexOf(baseName) < 0)
	            bases.push(baseName);
	    });
	
	    return this; // For chaining.
	};
	
	// False by default until .build(...) is called on an instance.
	Object.defineProperty(Dp, "buildable", { value: false });
	
	var builders = {};
	exports.builders = builders;
	
	// This object is used as prototype for any node created by a builder.
	var nodePrototype = {};
	
	// Call this function to define a new method to be shared by all AST
	// nodes. The replaced method (if any) is returned for easy wrapping.
	exports.defineMethod = function(name, func) {
	    var old = nodePrototype[name];
	
	    // Pass undefined as func to delete nodePrototype[name].
	    if (isUndefined.check(func)) {
	        delete nodePrototype[name];
	
	    } else {
	        isFunction.assert(func);
	
	        Object.defineProperty(nodePrototype, name, {
	            enumerable: true, // For discoverability.
	            configurable: true, // For delete proto[name].
	            value: func
	        });
	    }
	
	    return old;
	};
	
	var isArrayOfString = isString.arrayOf();
	
	// Calling the .build method of a Def simultaneously marks the type as
	// buildable (by defining builders[getBuilderName(typeName)]) and
	// specifies the order of arguments that should be passed to the builder
	// function to create an instance of the type.
	Dp.build = function(/* param1, param2, ... */) {
	    var self = this;
	
	    var newBuildParams = slice.call(arguments);
	    isArrayOfString.assert(newBuildParams);
	
	    // Calling Def.prototype.build multiple times has the effect of merely
	    // redefining this property.
	    Object.defineProperty(self, "buildParams", {
	        value: newBuildParams,
	        writable: false,
	        enumerable: false,
	        configurable: true
	    });
	
	    if (self.buildable) {
	        // If this Def is already buildable, update self.buildParams and
	        // continue using the old builder function.
	        return self;
	    }
	
	    // Every buildable type will have its "type" field filled in
	    // automatically. This includes types that are not subtypes of Node,
	    // like SourceLocation, but that seems harmless (TODO?).
	    self.field("type", String, function() { return self.typeName });
	
	    // Override Dp.buildable for this Def instance.
	    Object.defineProperty(self, "buildable", { value: true });
	
	    Object.defineProperty(builders, getBuilderName(self.typeName), {
	        enumerable: true,
	
	        value: function() {
	            var args = arguments;
	            var argc = args.length;
	            var built = Object.create(nodePrototype);
	
	            if (!self.finalized) {
	                throw new Error(
	                    "attempting to instantiate unfinalized type " +
	                        self.typeName
	                );
	            }
	
	            function add(param, i) {
	                if (hasOwn.call(built, param))
	                    return;
	
	                var all = self.allFields;
	                if (!hasOwn.call(all, param)) {
	                    throw new Error("" + param);
	                }
	
	                var field = all[param];
	                var type = field.type;
	                var value;
	
	                if (isNumber.check(i) && i < argc) {
	                    value = args[i];
	                } else if (field.defaultFn) {
	                    // Expose the partially-built object to the default
	                    // function as its `this` object.
	                    value = field.defaultFn.call(built);
	                } else {
	                    var message = "no value or default function given for field " +
	                        JSON.stringify(param) + " of " + self.typeName + "(" +
	                            self.buildParams.map(function(name) {
	                                return all[name];
	                            }).join(", ") + ")";
	                    throw new Error(message);
	                }
	
	                if (!type.check(value)) {
	                    throw new Error(
	                        shallowStringify(value) +
	                            " does not match field " + field +
	                            " of type " + self.typeName
	                    );
	                }
	
	                // TODO Could attach getters and setters here to enforce
	                // dynamic type safety.
	                built[param] = value;
	            }
	
	            self.buildParams.forEach(function(param, i) {
	                add(param, i);
	            });
	
	            Object.keys(self.allFields).forEach(function(param) {
	                add(param); // Use the default value.
	            });
	
	            // Make sure that the "type" field was filled automatically.
	            if (built.type !== self.typeName) {
	                throw new Error("");
	            }
	
	            return built;
	        }
	    });
	
	    return self; // For chaining.
	};
	
	function getBuilderName(typeName) {
	    return typeName.replace(/^[A-Z]+/, function(upperCasePrefix) {
	        var len = upperCasePrefix.length;
	        switch (len) {
	        case 0: return "";
	        // If there's only one initial capital letter, just lower-case it.
	        case 1: return upperCasePrefix.toLowerCase();
	        default:
	            // If there's more than one initial capital letter, lower-case
	            // all but the last one, so that XMLDefaultDeclaration (for
	            // example) becomes xmlDefaultDeclaration.
	            return upperCasePrefix.slice(
	                0, len - 1).toLowerCase() +
	                upperCasePrefix.charAt(len - 1);
	        }
	    });
	}
	exports.getBuilderName = getBuilderName;
	
	function getStatementBuilderName(typeName) {
	    typeName = getBuilderName(typeName);
	    return typeName.replace(/(Expression)?$/, "Statement");
	}
	exports.getStatementBuilderName = getStatementBuilderName;
	
	// The reason fields are specified using .field(...) instead of an object
	// literal syntax is somewhat subtle: the object literal syntax would
	// support only one key and one value, but with .field(...) we can pass
	// any number of arguments to specify the field.
	Dp.field = function(name, type, defaultFn, hidden) {
	    if (this.finalized) {
	        console.error("Ignoring attempt to redefine field " +
	                      JSON.stringify(name) + " of finalized type " +
	                      JSON.stringify(this.typeName));
	        return this;
	    }
	    this.ownFields[name] = new Field(name, type, defaultFn, hidden);
	    return this; // For chaining.
	};
	
	var namedTypes = {};
	exports.namedTypes = namedTypes;
	
	// Like Object.keys, but aware of what fields each AST type should have.
	function getFieldNames(object) {
	    var d = Def.fromValue(object);
	    if (d) {
	        return d.fieldNames.slice(0);
	    }
	
	    if ("type" in object) {
	        throw new Error(
	            "did not recognize object of type " +
	                JSON.stringify(object.type)
	        );
	    }
	
	    return Object.keys(object);
	}
	exports.getFieldNames = getFieldNames;
	
	// Get the value of an object property, taking object.type and default
	// functions into account.
	function getFieldValue(object, fieldName) {
	    var d = Def.fromValue(object);
	    if (d) {
	        var field = d.allFields[fieldName];
	        if (field) {
	            return field.getValue(object);
	        }
	    }
	
	    return object[fieldName];
	}
	exports.getFieldValue = getFieldValue;
	
	// Iterate over all defined fields of an object, including those missing
	// or undefined, passing each field name and effective value (as returned
	// by getFieldValue) to the callback. If the object has no corresponding
	// Def, the callback will never be called.
	exports.eachField = function(object, callback, context) {
	    getFieldNames(object).forEach(function(name) {
	        callback.call(this, name, getFieldValue(object, name));
	    }, context);
	};
	
	// Similar to eachField, except that iteration stops as soon as the
	// callback returns a truthy value. Like Array.prototype.some, the final
	// result is either true or false to indicates whether the callback
	// returned true for any element or not.
	exports.someField = function(object, callback, context) {
	    return getFieldNames(object).some(function(name) {
	        return callback.call(this, name, getFieldValue(object, name));
	    }, context);
	};
	
	// This property will be overridden as true by individual Def instances
	// when they are finalized.
	Object.defineProperty(Dp, "finalized", { value: false });
	
	Dp.finalize = function() {
	    var self = this;
	
	    // It's not an error to finalize a type more than once, but only the
	    // first call to .finalize does anything.
	    if (!self.finalized) {
	        var allFields = self.allFields;
	        var allSupertypes = self.allSupertypes;
	
	        self.baseNames.forEach(function(name) {
	            var def = defCache[name];
	            if (def instanceof Def) {
	                def.finalize();
	                extend(allFields, def.allFields);
	                extend(allSupertypes, def.allSupertypes);
	            } else {
	                var message = "unknown supertype name " +
	                    JSON.stringify(name) +
	                    " for subtype " +
	                    JSON.stringify(self.typeName);
	                throw new Error(message);
	            }
	        });
	
	        // TODO Warn if fields are overridden with incompatible types.
	        extend(allFields, self.ownFields);
	        allSupertypes[self.typeName] = self;
	
	        self.fieldNames.length = 0;
	        for (var fieldName in allFields) {
	            if (hasOwn.call(allFields, fieldName) &&
	                !allFields[fieldName].hidden) {
	                self.fieldNames.push(fieldName);
	            }
	        }
	
	        // Types are exported only once they have been finalized.
	        Object.defineProperty(namedTypes, self.typeName, {
	            enumerable: true,
	            value: self.type
	        });
	
	        Object.defineProperty(self, "finalized", { value: true });
	
	        // A linearization of the inheritance hierarchy.
	        populateSupertypeList(self.typeName, self.supertypeList);
	
	        if (self.buildable && self.supertypeList.lastIndexOf("Expression") >= 0) {
	            wrapExpressionBuilderWithStatement(self.typeName);
	        }
	    }
	};
	
	// Adds an additional builder for Expression subtypes
	// that wraps the built Expression in an ExpressionStatements.
	function wrapExpressionBuilderWithStatement(typeName) {
	    var wrapperName = getStatementBuilderName(typeName);
	
	    // skip if the builder already exists
	    if (builders[wrapperName]) return;
	
	    // the builder function to wrap with builders.ExpressionStatement
	    var wrapped = builders[getBuilderName(typeName)];
	
	    // skip if there is nothing to wrap
	    if (!wrapped) return;
	
	    builders[wrapperName] = function() {
	        return builders.expressionStatement(wrapped.apply(builders, arguments));
	    };
	}
	
	function populateSupertypeList(typeName, list) {
	    list.length = 0;
	    list.push(typeName);
	
	    var lastSeen = Object.create(null);
	
	    for (var pos = 0; pos < list.length; ++pos) {
	        typeName = list[pos];
	        var d = defCache[typeName];
	        if (d.finalized !== true) {
	            throw new Error("");
	        }
	
	        // If we saw typeName earlier in the breadth-first traversal,
	        // delete the last-seen occurrence.
	        if (hasOwn.call(lastSeen, typeName)) {
	            delete list[lastSeen[typeName]];
	        }
	
	        // Record the new index of the last-seen occurrence of typeName.
	        lastSeen[typeName] = pos;
	
	        // Enqueue the base names of this type.
	        list.push.apply(list, d.baseNames);
	    }
	
	    // Compaction loop to remove array holes.
	    for (var to = 0, from = to, len = list.length; from < len; ++from) {
	        if (hasOwn.call(list, from)) {
	            list[to++] = list[from];
	        }
	    }
	
	    list.length = to;
	}
	
	function extend(into, from) {
	    Object.keys(from).forEach(function(name) {
	        into[name] = from[name];
	    });
	
	    return into;
	};
	
	exports.finalize = function() {
	    Object.keys(defCache).forEach(function(name) {
	        defCache[name].finalize();
	    });
	};


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var types = __webpack_require__(3);
	var Type = types.Type;
	var builtin = types.builtInTypes;
	var isNumber = builtin.number;
	
	// An example of constructing a new type with arbitrary constraints from
	// an existing type.
	exports.geq = function(than) {
	    return new Type(function(value) {
	        return isNumber.check(value) && value >= than;
	    }, isNumber + " >= " + than);
	};
	
	// Default value-returning functions that may optionally be passed as a
	// third argument to Def.prototype.field.
	exports.defaults = {
	    // Functions were used because (among other reasons) that's the most
	    // elegant way to allow for the emptyArray one always to give a new
	    // array instance.
	    "null": function() { return null },
	    "emptyArray": function() { return [] },
	    "false": function() { return false },
	    "true": function() { return true },
	    "undefined": function() {}
	};
	
	var naiveIsPrimitive = Type.or(
	    builtin.string,
	    builtin.number,
	    builtin.boolean,
	    builtin.null,
	    builtin.undefined
	);
	
	exports.isPrimitive = new Type(function(value) {
	    if (value === null)
	        return true;
	    var type = typeof value;
	    return !(type === "object" ||
	             type === "function");
	}, naiveIsPrimitive.toString());


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var types = __webpack_require__(3);
	var n = types.namedTypes;
	var b = types.builders;
	var isNumber = types.builtInTypes.number;
	var isArray = types.builtInTypes.array;
	var Path = __webpack_require__(6);
	var Scope = __webpack_require__(7);
	
	function NodePath(value, parentPath, name) {
	    if (!(this instanceof NodePath)) {
	        throw new Error("NodePath constructor cannot be invoked without 'new'");
	    }
	    Path.call(this, value, parentPath, name);
	}
	
	var NPp = NodePath.prototype = Object.create(Path.prototype, {
	    constructor: {
	        value: NodePath,
	        enumerable: false,
	        writable: true,
	        configurable: true
	    }
	});
	
	Object.defineProperties(NPp, {
	    node: {
	        get: function() {
	            Object.defineProperty(this, "node", {
	                configurable: true, // Enable deletion.
	                value: this._computeNode()
	            });
	
	            return this.node;
	        }
	    },
	
	    parent: {
	        get: function() {
	            Object.defineProperty(this, "parent", {
	                configurable: true, // Enable deletion.
	                value: this._computeParent()
	            });
	
	            return this.parent;
	        }
	    },
	
	    scope: {
	        get: function() {
	            Object.defineProperty(this, "scope", {
	                configurable: true, // Enable deletion.
	                value: this._computeScope()
	            });
	
	            return this.scope;
	        }
	    }
	});
	
	NPp.replace = function() {
	    delete this.node;
	    delete this.parent;
	    delete this.scope;
	    return Path.prototype.replace.apply(this, arguments);
	};
	
	NPp.prune = function() {
	    var remainingNodePath = this.parent;
	
	    this.replace();
	
	    return cleanUpNodesAfterPrune(remainingNodePath);
	};
	
	// The value of the first ancestor Path whose value is a Node.
	NPp._computeNode = function() {
	    var value = this.value;
	    if (n.Node.check(value)) {
	        return value;
	    }
	
	    var pp = this.parentPath;
	    return pp && pp.node || null;
	};
	
	// The first ancestor Path whose value is a Node distinct from this.node.
	NPp._computeParent = function() {
	    var value = this.value;
	    var pp = this.parentPath;
	
	    if (!n.Node.check(value)) {
	        while (pp && !n.Node.check(pp.value)) {
	            pp = pp.parentPath;
	        }
	
	        if (pp) {
	            pp = pp.parentPath;
	        }
	    }
	
	    while (pp && !n.Node.check(pp.value)) {
	        pp = pp.parentPath;
	    }
	
	    return pp || null;
	};
	
	// The closest enclosing scope that governs this node.
	NPp._computeScope = function() {
	    var value = this.value;
	    var pp = this.parentPath;
	    var scope = pp && pp.scope;
	
	    if (n.Node.check(value) &&
	        Scope.isEstablishedBy(value)) {
	        scope = new Scope(this, scope);
	    }
	
	    return scope || null;
	};
	
	NPp.getValueProperty = function(name) {
	    return types.getFieldValue(this.value, name);
	};
	
	/**
	 * Determine whether this.node needs to be wrapped in parentheses in order
	 * for a parser to reproduce the same local AST structure.
	 *
	 * For instance, in the expression `(1 + 2) * 3`, the BinaryExpression
	 * whose operator is "+" needs parentheses, because `1 + 2 * 3` would
	 * parse differently.
	 *
	 * If assumeExpressionContext === true, we don't worry about edge cases
	 * like an anonymous FunctionExpression appearing lexically first in its
	 * enclosing statement and thus needing parentheses to avoid being parsed
	 * as a FunctionDeclaration with a missing name.
	 */
	NPp.needsParens = function(assumeExpressionContext) {
	    var pp = this.parentPath;
	    if (!pp) {
	        return false;
	    }
	
	    var node = this.value;
	
	    // Only expressions need parentheses.
	    if (!n.Expression.check(node)) {
	        return false;
	    }
	
	    // Identifiers never need parentheses.
	    if (node.type === "Identifier") {
	        return false;
	    }
	
	    while (!n.Node.check(pp.value)) {
	        pp = pp.parentPath;
	        if (!pp) {
	            return false;
	        }
	    }
	
	    var parent = pp.value;
	
	    switch (node.type) {
	    case "UnaryExpression":
	    case "SpreadElement":
	    case "SpreadProperty":
	        return parent.type === "MemberExpression"
	            && this.name === "object"
	            && parent.object === node;
	
	    case "BinaryExpression":
	    case "LogicalExpression":
	        switch (parent.type) {
	        case "CallExpression":
	            return this.name === "callee"
	                && parent.callee === node;
	
	        case "UnaryExpression":
	        case "SpreadElement":
	        case "SpreadProperty":
	            return true;
	
	        case "MemberExpression":
	            return this.name === "object"
	                && parent.object === node;
	
	        case "BinaryExpression":
	        case "LogicalExpression":
	            var po = parent.operator;
	            var pp = PRECEDENCE[po];
	            var no = node.operator;
	            var np = PRECEDENCE[no];
	
	            if (pp > np) {
	                return true;
	            }
	
	            if (pp === np && this.name === "right") {
	                if (parent.right !== node) {
	                    throw new Error("Nodes must be equal");
	                }
	                return true;
	            }
	
	        default:
	            return false;
	        }
	
	    case "SequenceExpression":
	        switch (parent.type) {
	        case "ForStatement":
	            // Although parentheses wouldn't hurt around sequence
	            // expressions in the head of for loops, traditional style
	            // dictates that e.g. i++, j++ should not be wrapped with
	            // parentheses.
	            return false;
	
	        case "ExpressionStatement":
	            return this.name !== "expression";
	
	        default:
	            // Otherwise err on the side of overparenthesization, adding
	            // explicit exceptions above if this proves overzealous.
	            return true;
	        }
	
	    case "YieldExpression":
	        switch (parent.type) {
	        case "BinaryExpression":
	        case "LogicalExpression":
	        case "UnaryExpression":
	        case "SpreadElement":
	        case "SpreadProperty":
	        case "CallExpression":
	        case "MemberExpression":
	        case "NewExpression":
	        case "ConditionalExpression":
	        case "YieldExpression":
	            return true;
	
	        default:
	            return false;
	        }
	
	    case "Literal":
	        return parent.type === "MemberExpression"
	            && isNumber.check(node.value)
	            && this.name === "object"
	            && parent.object === node;
	
	    case "AssignmentExpression":
	    case "ConditionalExpression":
	        switch (parent.type) {
	        case "UnaryExpression":
	        case "SpreadElement":
	        case "SpreadProperty":
	        case "BinaryExpression":
	        case "LogicalExpression":
	            return true;
	
	        case "CallExpression":
	            return this.name === "callee"
	                && parent.callee === node;
	
	        case "ConditionalExpression":
	            return this.name === "test"
	                && parent.test === node;
	
	        case "MemberExpression":
	            return this.name === "object"
	                && parent.object === node;
	
	        default:
	            return false;
	        }
	
	    default:
	        if (parent.type === "NewExpression" &&
	            this.name === "callee" &&
	            parent.callee === node) {
	            return containsCallExpression(node);
	        }
	    }
	
	    if (assumeExpressionContext !== true &&
	        !this.canBeFirstInStatement() &&
	        this.firstInStatement())
	        return true;
	
	    return false;
	};
	
	function isBinary(node) {
	    return n.BinaryExpression.check(node)
	        || n.LogicalExpression.check(node);
	}
	
	function isUnaryLike(node) {
	    return n.UnaryExpression.check(node)
	        // I considered making SpreadElement and SpreadProperty subtypes
	        // of UnaryExpression, but they're not really Expression nodes.
	        || (n.SpreadElement && n.SpreadElement.check(node))
	        || (n.SpreadProperty && n.SpreadProperty.check(node));
	}
	
	var PRECEDENCE = {};
	[["||"],
	 ["&&"],
	 ["|"],
	 ["^"],
	 ["&"],
	 ["==", "===", "!=", "!=="],
	 ["<", ">", "<=", ">=", "in", "instanceof"],
	 [">>", "<<", ">>>"],
	 ["+", "-"],
	 ["*", "/", "%"]
	].forEach(function(tier, i) {
	    tier.forEach(function(op) {
	        PRECEDENCE[op] = i;
	    });
	});
	
	function containsCallExpression(node) {
	    if (n.CallExpression.check(node)) {
	        return true;
	    }
	
	    if (isArray.check(node)) {
	        return node.some(containsCallExpression);
	    }
	
	    if (n.Node.check(node)) {
	        return types.someField(node, function(name, child) {
	            return containsCallExpression(child);
	        });
	    }
	
	    return false;
	}
	
	NPp.canBeFirstInStatement = function() {
	    var node = this.node;
	    return !n.FunctionExpression.check(node)
	        && !n.ObjectExpression.check(node);
	};
	
	NPp.firstInStatement = function() {
	    return firstInStatement(this);
	};
	
	function firstInStatement(path) {
	    for (var node, parent; path.parent; path = path.parent) {
	        node = path.node;
	        parent = path.parent.node;
	
	        if (n.BlockStatement.check(parent) &&
	            path.parent.name === "body" &&
	            path.name === 0) {
	            if (parent.body[0] !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            return true;
	        }
	
	        if (n.ExpressionStatement.check(parent) &&
	            path.name === "expression") {
	            if (parent.expression !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            return true;
	        }
	
	        if (n.SequenceExpression.check(parent) &&
	            path.parent.name === "expressions" &&
	            path.name === 0) {
	            if (parent.expressions[0] !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            continue;
	        }
	
	        if (n.CallExpression.check(parent) &&
	            path.name === "callee") {
	            if (parent.callee !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            continue;
	        }
	
	        if (n.MemberExpression.check(parent) &&
	            path.name === "object") {
	            if (parent.object !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            continue;
	        }
	
	        if (n.ConditionalExpression.check(parent) &&
	            path.name === "test") {
	            if (parent.test !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            continue;
	        }
	
	        if (isBinary(parent) &&
	            path.name === "left") {
	            if (parent.left !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            continue;
	        }
	
	        if (n.UnaryExpression.check(parent) &&
	            !parent.prefix &&
	            path.name === "argument") {
	            if (parent.argument !== node) {
	                throw new Error("Nodes must be equal");
	            }
	            continue;
	        }
	
	        return false;
	    }
	
	    return true;
	}
	
	/**
	 * Pruning certain nodes will result in empty or incomplete nodes, here we clean those nodes up.
	 */
	function cleanUpNodesAfterPrune(remainingNodePath) {
	    if (n.VariableDeclaration.check(remainingNodePath.node)) {
	        var declarations = remainingNodePath.get('declarations').value;
	        if (!declarations || declarations.length === 0) {
	            return remainingNodePath.prune();
	        }
	    } else if (n.ExpressionStatement.check(remainingNodePath.node)) {
	        if (!remainingNodePath.get('expression').value) {
	            return remainingNodePath.prune();
	        }
	    } else if (n.IfStatement.check(remainingNodePath.node)) {
	        cleanUpIfStatementAfterPrune(remainingNodePath);
	    }
	
	    return remainingNodePath;
	}
	
	function cleanUpIfStatementAfterPrune(ifStatement) {
	    var testExpression = ifStatement.get('test').value;
	    var alternate = ifStatement.get('alternate').value;
	    var consequent = ifStatement.get('consequent').value;
	
	    if (!consequent && !alternate) {
	        var testExpressionStatement = b.expressionStatement(testExpression);
	
	        ifStatement.replace(testExpressionStatement);
	    } else if (!consequent && alternate) {
	        var negatedTestExpression = b.unaryExpression('!', testExpression, true);
	
	        if (n.UnaryExpression.check(testExpression) && testExpression.operator === '!') {
	            negatedTestExpression = testExpression.argument;
	        }
	
	        ifStatement.get("test").replace(negatedTestExpression);
	        ifStatement.get("consequent").replace(alternate);
	        ifStatement.get("alternate").replace();
	    }
	}
	
	module.exports = NodePath;


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	var Op = Object.prototype;
	var hasOwn = Op.hasOwnProperty;
	var types = __webpack_require__(3);
	var isArray = types.builtInTypes.array;
	var isNumber = types.builtInTypes.number;
	var Ap = Array.prototype;
	var slice = Ap.slice;
	var map = Ap.map;
	
	function Path(value, parentPath, name) {
	    if (!(this instanceof Path)) {
	        throw new Error("Path constructor cannot be invoked without 'new'");
	    }
	
	    if (parentPath) {
	        if (!(parentPath instanceof Path)) {
	            throw new Error("");
	        }
	    } else {
	        parentPath = null;
	        name = null;
	    }
	
	    // The value encapsulated by this Path, generally equal to
	    // parentPath.value[name] if we have a parentPath.
	    this.value = value;
	
	    // The immediate parent Path of this Path.
	    this.parentPath = parentPath;
	
	    // The name of the property of parentPath.value through which this
	    // Path's value was reached.
	    this.name = name;
	
	    // Calling path.get("child") multiple times always returns the same
	    // child Path object, for both performance and consistency reasons.
	    this.__childCache = null;
	}
	
	var Pp = Path.prototype;
	
	function getChildCache(path) {
	    // Lazily create the child cache. This also cheapens cache
	    // invalidation, since you can just reset path.__childCache to null.
	    return path.__childCache || (path.__childCache = Object.create(null));
	}
	
	function getChildPath(path, name) {
	    var cache = getChildCache(path);
	    var actualChildValue = path.getValueProperty(name);
	    var childPath = cache[name];
	    if (!hasOwn.call(cache, name) ||
	        // Ensure consistency between cache and reality.
	        childPath.value !== actualChildValue) {
	        childPath = cache[name] = new path.constructor(
	            actualChildValue, path, name
	        );
	    }
	    return childPath;
	}
	
	// This method is designed to be overridden by subclasses that need to
	// handle missing properties, etc.
	Pp.getValueProperty = function getValueProperty(name) {
	    return this.value[name];
	};
	
	Pp.get = function get(name) {
	    var path = this;
	    var names = arguments;
	    var count = names.length;
	
	    for (var i = 0; i < count; ++i) {
	        path = getChildPath(path, names[i]);
	    }
	
	    return path;
	};
	
	Pp.each = function each(callback, context) {
	    var childPaths = [];
	    var len = this.value.length;
	    var i = 0;
	
	    // Collect all the original child paths before invoking the callback.
	    for (var i = 0; i < len; ++i) {
	        if (hasOwn.call(this.value, i)) {
	            childPaths[i] = this.get(i);
	        }
	    }
	
	    // Invoke the callback on just the original child paths, regardless of
	    // any modifications made to the array by the callback. I chose these
	    // semantics over cleverly invoking the callback on new elements because
	    // this way is much easier to reason about.
	    context = context || this;
	    for (i = 0; i < len; ++i) {
	        if (hasOwn.call(childPaths, i)) {
	            callback.call(context, childPaths[i]);
	        }
	    }
	};
	
	Pp.map = function map(callback, context) {
	    var result = [];
	
	    this.each(function(childPath) {
	        result.push(callback.call(this, childPath));
	    }, context);
	
	    return result;
	};
	
	Pp.filter = function filter(callback, context) {
	    var result = [];
	
	    this.each(function(childPath) {
	        if (callback.call(this, childPath)) {
	            result.push(childPath);
	        }
	    }, context);
	
	    return result;
	};
	
	function emptyMoves() {}
	function getMoves(path, offset, start, end) {
	    isArray.assert(path.value);
	
	    if (offset === 0) {
	        return emptyMoves;
	    }
	
	    var length = path.value.length;
	    if (length < 1) {
	        return emptyMoves;
	    }
	
	    var argc = arguments.length;
	    if (argc === 2) {
	        start = 0;
	        end = length;
	    } else if (argc === 3) {
	        start = Math.max(start, 0);
	        end = length;
	    } else {
	        start = Math.max(start, 0);
	        end = Math.min(end, length);
	    }
	
	    isNumber.assert(start);
	    isNumber.assert(end);
	
	    var moves = Object.create(null);
	    var cache = getChildCache(path);
	
	    for (var i = start; i < end; ++i) {
	        if (hasOwn.call(path.value, i)) {
	            var childPath = path.get(i);
	            if (childPath.name !== i) {
	                throw new Error("");
	            }
	            var newIndex = i + offset;
	            childPath.name = newIndex;
	            moves[newIndex] = childPath;
	            delete cache[i];
	        }
	    }
	
	    delete cache.length;
	
	    return function() {
	        for (var newIndex in moves) {
	            var childPath = moves[newIndex];
	            if (childPath.name !== +newIndex) {
	                throw new Error("");
	            }
	            cache[newIndex] = childPath;
	            path.value[newIndex] = childPath.value;
	        }
	    };
	}
	
	Pp.shift = function shift() {
	    var move = getMoves(this, -1);
	    var result = this.value.shift();
	    move();
	    return result;
	};
	
	Pp.unshift = function unshift(node) {
	    var move = getMoves(this, arguments.length);
	    var result = this.value.unshift.apply(this.value, arguments);
	    move();
	    return result;
	};
	
	Pp.push = function push(node) {
	    isArray.assert(this.value);
	    delete getChildCache(this).length
	    return this.value.push.apply(this.value, arguments);
	};
	
	Pp.pop = function pop() {
	    isArray.assert(this.value);
	    var cache = getChildCache(this);
	    delete cache[this.value.length - 1];
	    delete cache.length;
	    return this.value.pop();
	};
	
	Pp.insertAt = function insertAt(index, node) {
	    var argc = arguments.length;
	    var move = getMoves(this, argc - 1, index);
	    if (move === emptyMoves) {
	        return this;
	    }
	
	    index = Math.max(index, 0);
	
	    for (var i = 1; i < argc; ++i) {
	        this.value[index + i - 1] = arguments[i];
	    }
	
	    move();
	
	    return this;
	};
	
	Pp.insertBefore = function insertBefore(node) {
	    var pp = this.parentPath;
	    var argc = arguments.length;
	    var insertAtArgs = [this.name];
	    for (var i = 0; i < argc; ++i) {
	        insertAtArgs.push(arguments[i]);
	    }
	    return pp.insertAt.apply(pp, insertAtArgs);
	};
	
	Pp.insertAfter = function insertAfter(node) {
	    var pp = this.parentPath;
	    var argc = arguments.length;
	    var insertAtArgs = [this.name + 1];
	    for (var i = 0; i < argc; ++i) {
	        insertAtArgs.push(arguments[i]);
	    }
	    return pp.insertAt.apply(pp, insertAtArgs);
	};
	
	function repairRelationshipWithParent(path) {
	    if (!(path instanceof Path)) {
	        throw new Error("");
	    }
	
	    var pp = path.parentPath;
	    if (!pp) {
	        // Orphan paths have no relationship to repair.
	        return path;
	    }
	
	    var parentValue = pp.value;
	    var parentCache = getChildCache(pp);
	
	    // Make sure parentCache[path.name] is populated.
	    if (parentValue[path.name] === path.value) {
	        parentCache[path.name] = path;
	    } else if (isArray.check(parentValue)) {
	        // Something caused path.name to become out of date, so attempt to
	        // recover by searching for path.value in parentValue.
	        var i = parentValue.indexOf(path.value);
	        if (i >= 0) {
	            parentCache[path.name = i] = path;
	        }
	    } else {
	        // If path.value disagrees with parentValue[path.name], and
	        // path.name is not an array index, let path.value become the new
	        // parentValue[path.name] and update parentCache accordingly.
	        parentValue[path.name] = path.value;
	        parentCache[path.name] = path;
	    }
	
	    if (parentValue[path.name] !== path.value) {
	        throw new Error("");
	    }
	    if (path.parentPath.get(path.name) !== path) {
	        throw new Error("");
	    }
	
	    return path;
	}
	
	Pp.replace = function replace(replacement) {
	    var results = [];
	    var parentValue = this.parentPath.value;
	    var parentCache = getChildCache(this.parentPath);
	    var count = arguments.length;
	
	    repairRelationshipWithParent(this);
	
	    if (isArray.check(parentValue)) {
	        var originalLength = parentValue.length;
	        var move = getMoves(this.parentPath, count - 1, this.name + 1);
	
	        var spliceArgs = [this.name, 1];
	        for (var i = 0; i < count; ++i) {
	            spliceArgs.push(arguments[i]);
	        }
	
	        var splicedOut = parentValue.splice.apply(parentValue, spliceArgs);
	
	        if (splicedOut[0] !== this.value) {
	            throw new Error("");
	        }
	        if (parentValue.length !== (originalLength - 1 + count)) {
	            throw new Error("");
	        }
	
	        move();
	
	        if (count === 0) {
	            delete this.value;
	            delete parentCache[this.name];
	            this.__childCache = null;
	
	        } else {
	            if (parentValue[this.name] !== replacement) {
	                throw new Error("");
	            }
	
	            if (this.value !== replacement) {
	                this.value = replacement;
	                this.__childCache = null;
	            }
	
	            for (i = 0; i < count; ++i) {
	                results.push(this.parentPath.get(this.name + i));
	            }
	
	            if (results[0] !== this) {
	                throw new Error("");
	            }
	        }
	
	    } else if (count === 1) {
	        if (this.value !== replacement) {
	            this.__childCache = null;
	        }
	        this.value = parentValue[this.name] = replacement;
	        results.push(this);
	
	    } else if (count === 0) {
	        delete parentValue[this.name];
	        delete this.value;
	        this.__childCache = null;
	
	        // Leave this path cached as parentCache[this.name], even though
	        // it no longer has a value defined.
	
	    } else {
	        throw new Error("Could not replace path");
	    }
	
	    return results;
	};
	
	module.exports = Path;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	var types = __webpack_require__(3);
	var Type = types.Type;
	var namedTypes = types.namedTypes;
	var Node = namedTypes.Node;
	var Expression = namedTypes.Expression;
	var isArray = types.builtInTypes.array;
	var hasOwn = Object.prototype.hasOwnProperty;
	var b = types.builders;
	
	function Scope(path, parentScope) {
	    if (!(this instanceof Scope)) {
	        throw new Error("Scope constructor cannot be invoked without 'new'");
	    }
	    if (!(path instanceof __webpack_require__(5))) {
	        throw new Error("");
	    }
	    ScopeType.assert(path.value);
	
	    var depth;
	
	    if (parentScope) {
	        if (!(parentScope instanceof Scope)) {
	            throw new Error("");
	        }
	        depth = parentScope.depth + 1;
	    } else {
	        parentScope = null;
	        depth = 0;
	    }
	
	    Object.defineProperties(this, {
	        path: { value: path },
	        node: { value: path.value },
	        isGlobal: { value: !parentScope, enumerable: true },
	        depth: { value: depth },
	        parent: { value: parentScope },
	        bindings: { value: {} },
	        types: { value: {} },
	    });
	}
	
	var scopeTypes = [
	    // Program nodes introduce global scopes.
	    namedTypes.Program,
	
	    // Function is the supertype of FunctionExpression,
	    // FunctionDeclaration, ArrowExpression, etc.
	    namedTypes.Function,
	
	    // In case you didn't know, the caught parameter shadows any variable
	    // of the same name in an outer scope.
	    namedTypes.CatchClause
	];
	
	var ScopeType = Type.or.apply(Type, scopeTypes);
	
	Scope.isEstablishedBy = function(node) {
	    return ScopeType.check(node);
	};
	
	var Sp = Scope.prototype;
	
	// Will be overridden after an instance lazily calls scanScope.
	Sp.didScan = false;
	
	Sp.declares = function(name) {
	    this.scan();
	    return hasOwn.call(this.bindings, name);
	};
	
	Sp.declaresType = function(name) {
	    this.scan();
	    return hasOwn.call(this.types, name);
	};
	
	Sp.declareTemporary = function(prefix) {
	    if (prefix) {
	        if (!/^[a-z$_]/i.test(prefix)) {
	            throw new Error("");
	        }
	    } else {
	        prefix = "t$";
	    }
	
	    // Include this.depth in the name to make sure the name does not
	    // collide with any variables in nested/enclosing scopes.
	    prefix += this.depth.toString(36) + "$";
	
	    this.scan();
	
	    var index = 0;
	    while (this.declares(prefix + index)) {
	        ++index;
	    }
	
	    var name = prefix + index;
	    return this.bindings[name] = types.builders.identifier(name);
	};
	
	Sp.injectTemporary = function(identifier, init) {
	    identifier || (identifier = this.declareTemporary());
	
	    var bodyPath = this.path.get("body");
	    if (namedTypes.BlockStatement.check(bodyPath.value)) {
	        bodyPath = bodyPath.get("body");
	    }
	
	    bodyPath.unshift(
	        b.variableDeclaration(
	            "var",
	            [b.variableDeclarator(identifier, init || null)]
	        )
	    );
	
	    return identifier;
	};
	
	Sp.scan = function(force) {
	    if (force || !this.didScan) {
	        for (var name in this.bindings) {
	            // Empty out this.bindings, just in cases.
	            delete this.bindings[name];
	        }
	        scanScope(this.path, this.bindings, this.types);
	        this.didScan = true;
	    }
	};
	
	Sp.getBindings = function () {
	    this.scan();
	    return this.bindings;
	};
	
	Sp.getTypes = function () {
	    this.scan();
	    return this.types;
	};
	
	function scanScope(path, bindings, scopeTypes) {
	    var node = path.value;
	    ScopeType.assert(node);
	
	    if (namedTypes.CatchClause.check(node)) {
	        // A catch clause establishes a new scope but the only variable
	        // bound in that scope is the catch parameter. Any other
	        // declarations create bindings in the outer scope.
	        addPattern(path.get("param"), bindings);
	
	    } else {
	        recursiveScanScope(path, bindings, scopeTypes);
	    }
	}
	
	function recursiveScanScope(path, bindings, scopeTypes) {
	    var node = path.value;
	
	    if (path.parent &&
	        namedTypes.FunctionExpression.check(path.parent.node) &&
	        path.parent.node.id) {
	        addPattern(path.parent.get("id"), bindings);
	    }
	
	    if (!node) {
	        // None of the remaining cases matter if node is falsy.
	
	    } else if (isArray.check(node)) {
	        path.each(function(childPath) {
	            recursiveScanChild(childPath, bindings, scopeTypes);
	        });
	
	    } else if (namedTypes.Function.check(node)) {
	        path.get("params").each(function(paramPath) {
	            addPattern(paramPath, bindings);
	        });
	
	        recursiveScanChild(path.get("body"), bindings, scopeTypes);
	
	    } else if (namedTypes.TypeAlias && namedTypes.TypeAlias.check(node)) {
	        addTypePattern(path.get("id"), scopeTypes);
	
	    } else if (namedTypes.VariableDeclarator.check(node)) {
	        addPattern(path.get("id"), bindings);
	        recursiveScanChild(path.get("init"), bindings, scopeTypes);
	
	    } else if (node.type === "ImportSpecifier" ||
	               node.type === "ImportNamespaceSpecifier" ||
	               node.type === "ImportDefaultSpecifier") {
	        addPattern(
	            // Esprima used to use the .name field to refer to the local
	            // binding identifier for ImportSpecifier nodes, but .id for
	            // ImportNamespaceSpecifier and ImportDefaultSpecifier nodes.
	            // ESTree/Acorn/ESpree use .local for all three node types.
	            path.get(node.local ? "local" :
	                     node.name ? "name" : "id"),
	            bindings
	        );
	
	    } else if (Node.check(node) && !Expression.check(node)) {
	        types.eachField(node, function(name, child) {
	            var childPath = path.get(name);
	            if (! pathHasValue(childPath, child)) {
	                throw new Error("");
	            }
	            recursiveScanChild(childPath, bindings, scopeTypes);
	        });
	    }
	}
	
	function pathHasValue(path, value) {
	  if (path.value === value) {
	    return true;
	  }
	
	  // Empty arrays are probably produced by defaults.emptyArray, in which
	  // case is makes sense to regard them as equivalent, if not ===.
	  if (Array.isArray(path.value) &&
	      path.value.length === 0 &&
	      Array.isArray(value) &&
	      value.length === 0) {
	    return true;
	  }
	
	  return false;
	}
	
	function recursiveScanChild(path, bindings, scopeTypes) {
	    var node = path.value;
	
	    if (!node || Expression.check(node)) {
	        // Ignore falsy values and Expressions.
	
	    } else if (namedTypes.FunctionDeclaration.check(node)) {
	        addPattern(path.get("id"), bindings);
	
	    } else if (namedTypes.ClassDeclaration &&
	               namedTypes.ClassDeclaration.check(node)) {
	        addPattern(path.get("id"), bindings);
	
	    } else if (ScopeType.check(node)) {
	        if (namedTypes.CatchClause.check(node)) {
	            var catchParamName = node.param.name;
	            var hadBinding = hasOwn.call(bindings, catchParamName);
	
	            // Any declarations that occur inside the catch body that do
	            // not have the same name as the catch parameter should count
	            // as bindings in the outer scope.
	            recursiveScanScope(path.get("body"), bindings, scopeTypes);
	
	            // If a new binding matching the catch parameter name was
	            // created while scanning the catch body, ignore it because it
	            // actually refers to the catch parameter and not the outer
	            // scope that we're currently scanning.
	            if (!hadBinding) {
	                delete bindings[catchParamName];
	            }
	        }
	
	    } else {
	        recursiveScanScope(path, bindings, scopeTypes);
	    }
	}
	
	function addPattern(patternPath, bindings) {
	    var pattern = patternPath.value;
	    namedTypes.Pattern.assert(pattern);
	
	    if (namedTypes.Identifier.check(pattern)) {
	        if (hasOwn.call(bindings, pattern.name)) {
	            bindings[pattern.name].push(patternPath);
	        } else {
	            bindings[pattern.name] = [patternPath];
	        }
	
	    } else if (namedTypes.ObjectPattern &&
	               namedTypes.ObjectPattern.check(pattern)) {
	        patternPath.get('properties').each(function(propertyPath) {
	            var property = propertyPath.value;
	            if (namedTypes.Pattern.check(property)) {
	                addPattern(propertyPath, bindings);
	            } else  if (namedTypes.Property.check(property)) {
	                addPattern(propertyPath.get('value'), bindings);
	            } else if (namedTypes.SpreadProperty &&
	                       namedTypes.SpreadProperty.check(property)) {
	                addPattern(propertyPath.get('argument'), bindings);
	            }
	        });
	
	    } else if (namedTypes.ArrayPattern &&
	               namedTypes.ArrayPattern.check(pattern)) {
	        patternPath.get('elements').each(function(elementPath) {
	            var element = elementPath.value;
	            if (namedTypes.Pattern.check(element)) {
	                addPattern(elementPath, bindings);
	            } else if (namedTypes.SpreadElement &&
	                       namedTypes.SpreadElement.check(element)) {
	                addPattern(elementPath.get("argument"), bindings);
	            }
	        });
	
	    } else if (namedTypes.PropertyPattern &&
	               namedTypes.PropertyPattern.check(pattern)) {
	        addPattern(patternPath.get('pattern'), bindings);
	
	    } else if ((namedTypes.SpreadElementPattern &&
	                namedTypes.SpreadElementPattern.check(pattern)) ||
	               (namedTypes.SpreadPropertyPattern &&
	                namedTypes.SpreadPropertyPattern.check(pattern))) {
	        addPattern(patternPath.get('argument'), bindings);
	    }
	}
	
	function addTypePattern(patternPath, types) {
	    var pattern = patternPath.value;
	    namedTypes.Pattern.assert(pattern);
	
	    if (namedTypes.Identifier.check(pattern)) {
	        if (hasOwn.call(types, pattern.name)) {
	            types[pattern.name].push(patternPath);
	        } else {
	            types[pattern.name] = [patternPath];
	        }
	
	    }
	}
	
	Sp.lookup = function(name) {
	    for (var scope = this; scope; scope = scope.parent)
	        if (scope.declares(name))
	            break;
	    return scope;
	};
	
	Sp.lookupType = function(name) {
	    for (var scope = this; scope; scope = scope.parent)
	        if (scope.declaresType(name))
	            break;
	    return scope;
	};
	
	Sp.getGlobalScope = function() {
	    var scope = this;
	    while (!scope.isGlobal)
	        scope = scope.parent;
	    return scope;
	};
	
	module.exports = Scope;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	var types = __webpack_require__(3);
	var NodePath = __webpack_require__(5);
	var Printable = types.namedTypes.Printable;
	var isArray = types.builtInTypes.array;
	var isObject = types.builtInTypes.object;
	var isFunction = types.builtInTypes.function;
	var hasOwn = Object.prototype.hasOwnProperty;
	var undefined;
	
	function PathVisitor() {
	    if (!(this instanceof PathVisitor)) {
	        throw new Error(
	            "PathVisitor constructor cannot be invoked without 'new'"
	        );
	    }
	
	    // Permanent state.
	    this._reusableContextStack = [];
	
	    this._methodNameTable = computeMethodNameTable(this);
	    this._shouldVisitComments =
	        hasOwn.call(this._methodNameTable, "Block") ||
	        hasOwn.call(this._methodNameTable, "Line");
	
	    this.Context = makeContextConstructor(this);
	
	    // State reset every time PathVisitor.prototype.visit is called.
	    this._visiting = false;
	    this._changeReported = false;
	}
	
	function computeMethodNameTable(visitor) {
	    var typeNames = Object.create(null);
	
	    for (var methodName in visitor) {
	        if (/^visit[A-Z]/.test(methodName)) {
	            typeNames[methodName.slice("visit".length)] = true;
	        }
	    }
	
	    var supertypeTable = types.computeSupertypeLookupTable(typeNames);
	    var methodNameTable = Object.create(null);
	
	    var typeNames = Object.keys(supertypeTable);
	    var typeNameCount = typeNames.length;
	    for (var i = 0; i < typeNameCount; ++i) {
	        var typeName = typeNames[i];
	        methodName = "visit" + supertypeTable[typeName];
	        if (isFunction.check(visitor[methodName])) {
	            methodNameTable[typeName] = methodName;
	        }
	    }
	
	    return methodNameTable;
	}
	
	PathVisitor.fromMethodsObject = function fromMethodsObject(methods) {
	    if (methods instanceof PathVisitor) {
	        return methods;
	    }
	
	    if (!isObject.check(methods)) {
	        // An empty visitor?
	        return new PathVisitor;
	    }
	
	    function Visitor() {
	        if (!(this instanceof Visitor)) {
	            throw new Error(
	                "Visitor constructor cannot be invoked without 'new'"
	            );
	        }
	        PathVisitor.call(this);
	    }
	
	    var Vp = Visitor.prototype = Object.create(PVp);
	    Vp.constructor = Visitor;
	
	    extend(Vp, methods);
	    extend(Visitor, PathVisitor);
	
	    isFunction.assert(Visitor.fromMethodsObject);
	    isFunction.assert(Visitor.visit);
	
	    return new Visitor;
	};
	
	function extend(target, source) {
	    for (var property in source) {
	        if (hasOwn.call(source, property)) {
	            target[property] = source[property];
	        }
	    }
	
	    return target;
	}
	
	PathVisitor.visit = function visit(node, methods) {
	    return PathVisitor.fromMethodsObject(methods).visit(node);
	};
	
	var PVp = PathVisitor.prototype;
	
	PVp.visit = function() {
	    if (this._visiting) {
	        throw new Error(
	            "Recursively calling visitor.visit(path) resets visitor state. " +
	                "Try this.visit(path) or this.traverse(path) instead."
	        );
	    }
	
	    // Private state that needs to be reset before every traversal.
	    this._visiting = true;
	    this._changeReported = false;
	    this._abortRequested = false;
	
	    var argc = arguments.length;
	    var args = new Array(argc)
	    for (var i = 0; i < argc; ++i) {
	        args[i] = arguments[i];
	    }
	
	    if (!(args[0] instanceof NodePath)) {
	        args[0] = new NodePath({ root: args[0] }).get("root");
	    }
	
	    // Called with the same arguments as .visit.
	    this.reset.apply(this, args);
	
	    try {
	        var root = this.visitWithoutReset(args[0]);
	        var didNotThrow = true;
	    } finally {
	        this._visiting = false;
	
	        if (!didNotThrow && this._abortRequested) {
	            // If this.visitWithoutReset threw an exception and
	            // this._abortRequested was set to true, return the root of
	            // the AST instead of letting the exception propagate, so that
	            // client code does not have to provide a try-catch block to
	            // intercept the AbortRequest exception.  Other kinds of
	            // exceptions will propagate without being intercepted and
	            // rethrown by a catch block, so their stacks will accurately
	            // reflect the original throwing context.
	            return args[0].value;
	        }
	    }
	
	    return root;
	};
	
	PVp.AbortRequest = function AbortRequest() {};
	PVp.abort = function() {
	    var visitor = this;
	    visitor._abortRequested = true;
	    var request = new visitor.AbortRequest();
	
	    // If you decide to catch this exception and stop it from propagating,
	    // make sure to call its cancel method to avoid silencing other
	    // exceptions that might be thrown later in the traversal.
	    request.cancel = function() {
	        visitor._abortRequested = false;
	    };
	
	    throw request;
	};
	
	PVp.reset = function(path/*, additional arguments */) {
	    // Empty stub; may be reassigned or overridden by subclasses.
	};
	
	PVp.visitWithoutReset = function(path) {
	    if (this instanceof this.Context) {
	        // Since this.Context.prototype === this, there's a chance we
	        // might accidentally call context.visitWithoutReset. If that
	        // happens, re-invoke the method against context.visitor.
	        return this.visitor.visitWithoutReset(path);
	    }
	
	    if (!(path instanceof NodePath)) {
	        throw new Error("");
	    }
	
	    var value = path.value;
	
	    var methodName = value &&
	        typeof value === "object" &&
	        typeof value.type === "string" &&
	        this._methodNameTable[value.type];
	
	    if (methodName) {
	        var context = this.acquireContext(path);
	        try {
	            return context.invokeVisitorMethod(methodName);
	        } finally {
	            this.releaseContext(context);
	        }
	
	    } else {
	        // If there was no visitor method to call, visit the children of
	        // this node generically.
	        return visitChildren(path, this);
	    }
	};
	
	function visitChildren(path, visitor) {
	    if (!(path instanceof NodePath)) {
	        throw new Error("");
	    }
	    if (!(visitor instanceof PathVisitor)) {
	        throw new Error("");
	    }
	
	    var value = path.value;
	
	    if (isArray.check(value)) {
	        path.each(visitor.visitWithoutReset, visitor);
	    } else if (!isObject.check(value)) {
	        // No children to visit.
	    } else {
	        var childNames = types.getFieldNames(value);
	
	        // The .comments field of the Node type is hidden, so we only
	        // visit it if the visitor defines visitBlock or visitLine, and
	        // value.comments is defined.
	        if (visitor._shouldVisitComments &&
	            value.comments &&
	            childNames.indexOf("comments") < 0) {
	            childNames.push("comments");
	        }
	
	        var childCount = childNames.length;
	        var childPaths = [];
	
	        for (var i = 0; i < childCount; ++i) {
	            var childName = childNames[i];
	            if (!hasOwn.call(value, childName)) {
	                value[childName] = types.getFieldValue(value, childName);
	            }
	            childPaths.push(path.get(childName));
	        }
	
	        for (var i = 0; i < childCount; ++i) {
	            visitor.visitWithoutReset(childPaths[i]);
	        }
	    }
	
	    return path.value;
	}
	
	PVp.acquireContext = function(path) {
	    if (this._reusableContextStack.length === 0) {
	        return new this.Context(path);
	    }
	    return this._reusableContextStack.pop().reset(path);
	};
	
	PVp.releaseContext = function(context) {
	    if (!(context instanceof this.Context)) {
	        throw new Error("");
	    }
	    this._reusableContextStack.push(context);
	    context.currentPath = null;
	};
	
	PVp.reportChanged = function() {
	    this._changeReported = true;
	};
	
	PVp.wasChangeReported = function() {
	    return this._changeReported;
	};
	
	function makeContextConstructor(visitor) {
	    function Context(path) {
	        if (!(this instanceof Context)) {
	            throw new Error("");
	        }
	        if (!(this instanceof PathVisitor)) {
	            throw new Error("");
	        }
	        if (!(path instanceof NodePath)) {
	            throw new Error("");
	        }
	
	        Object.defineProperty(this, "visitor", {
	            value: visitor,
	            writable: false,
	            enumerable: true,
	            configurable: false
	        });
	
	        this.currentPath = path;
	        this.needToCallTraverse = true;
	
	        Object.seal(this);
	    }
	
	    if (!(visitor instanceof PathVisitor)) {
	        throw new Error("");
	    }
	
	    // Note that the visitor object is the prototype of Context.prototype,
	    // so all visitor methods are inherited by context objects.
	    var Cp = Context.prototype = Object.create(visitor);
	
	    Cp.constructor = Context;
	    extend(Cp, sharedContextProtoMethods);
	
	    return Context;
	}
	
	// Every PathVisitor has a different this.Context constructor and
	// this.Context.prototype object, but those prototypes can all use the
	// same reset, invokeVisitorMethod, and traverse function objects.
	var sharedContextProtoMethods = Object.create(null);
	
	sharedContextProtoMethods.reset =
	function reset(path) {
	    if (!(this instanceof this.Context)) {
	        throw new Error("");
	    }
	    if (!(path instanceof NodePath)) {
	        throw new Error("");
	    }
	
	    this.currentPath = path;
	    this.needToCallTraverse = true;
	
	    return this;
	};
	
	sharedContextProtoMethods.invokeVisitorMethod =
	function invokeVisitorMethod(methodName) {
	    if (!(this instanceof this.Context)) {
	        throw new Error("");
	    }
	    if (!(this.currentPath instanceof NodePath)) {
	        throw new Error("");
	    }
	
	    var result = this.visitor[methodName].call(this, this.currentPath);
	
	    if (result === false) {
	        // Visitor methods return false to indicate that they have handled
	        // their own traversal needs, and we should not complain if
	        // this.needToCallTraverse is still true.
	        this.needToCallTraverse = false;
	
	    } else if (result !== undefined) {
	        // Any other non-undefined value returned from the visitor method
	        // is interpreted as a replacement value.
	        this.currentPath = this.currentPath.replace(result)[0];
	
	        if (this.needToCallTraverse) {
	            // If this.traverse still hasn't been called, visit the
	            // children of the replacement node.
	            this.traverse(this.currentPath);
	        }
	    }
	
	    if (this.needToCallTraverse !== false) {
	        throw new Error(
	            "Must either call this.traverse or return false in " + methodName
	        );
	    }
	
	    var path = this.currentPath;
	    return path && path.value;
	};
	
	sharedContextProtoMethods.traverse =
	function traverse(path, newVisitor) {
	    if (!(this instanceof this.Context)) {
	        throw new Error("");
	    }
	    if (!(path instanceof NodePath)) {
	        throw new Error("");
	    }
	    if (!(this.currentPath instanceof NodePath)) {
	        throw new Error("");
	    }
	
	    this.needToCallTraverse = false;
	
	    return visitChildren(path, PathVisitor.fromMethodsObject(
	        newVisitor || this.visitor
	    ));
	};
	
	sharedContextProtoMethods.visit =
	function visit(path, newVisitor) {
	    if (!(this instanceof this.Context)) {
	        throw new Error("");
	    }
	    if (!(path instanceof NodePath)) {
	        throw new Error("");
	    }
	    if (!(this.currentPath instanceof NodePath)) {
	        throw new Error("");
	    }
	
	    this.needToCallTraverse = false;
	
	    return PathVisitor.fromMethodsObject(
	        newVisitor || this.visitor
	    ).visitWithoutReset(path);
	};
	
	sharedContextProtoMethods.reportChanged = function reportChanged() {
	    this.visitor.reportChanged();
	};
	
	sharedContextProtoMethods.abort = function abort() {
	    this.needToCallTraverse = false;
	    this.visitor.abort();
	};
	
	module.exports = PathVisitor;


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.formatLocation = exports.loc = exports.regexpEscape = exports.capitalizeClass = exports.capitalize = undefined;
	
	var _ast = __webpack_require__(2);
	
	var _ast2 = _interopRequireDefault(_ast);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var capitalize = function capitalize(s) {
	  return s[0].toUpperCase() + s.slice(1).toLowerCase();
	};
	var capitalizeClass = function capitalizeClass(s) {
	  return s.split('::').map(module.exports.capitalize).join('::');
	};
	
	var regexpEscape = function regexpEscape(s) {
	  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1');
	};
	
	var loc = function loc(location) {
	  var b = _ast2.default.builders;
	  return b.sourceLocation(b.position(location.first_line, location.first_column), b.position(location.last_line, location.last_column));
	};
	
	var formatLocation = function formatLocation(astnode) {
	  if (astnode.loc != null) {
	    var l = astnode.loc;
	    if (l.start.line === l.end.line && l.start.column === l.end.column) {
	      return 'line ' + l.start.line + ':' + l.start.column;
	    }
	    return 'line ' + l.start.line + ':' + l.start.column + ' - line ' + l.end.line + ':' + l.end.column;
	  }
	  return '';
	};
	
	exports.capitalize = capitalize;
	exports.capitalizeClass = capitalizeClass;
	exports.regexpEscape = regexpEscape;
	exports.loc = loc;
	exports.formatLocation = formatLocation;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, module) {/* parser generated by jison 0.4.18 */
	/*
	  Returns a Parser object of the following structure:
	
	  Parser: {
	    yy: {}
	  }
	
	  Parser.prototype: {
	    yy: {},
	    trace: function(),
	    symbols_: {associative list: name ==> number},
	    terminals_: {associative list: number ==> name},
	    productions_: [...],
	    performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate, $$, _$),
	    table: [...],
	    defaultActions: {...},
	    parseError: function(str, hash),
	    parse: function(input),
	
	    lexer: {
	        EOF: 1,
	        parseError: function(str, hash),
	        setInput: function(input),
	        input: function(),
	        unput: function(str),
	        more: function(),
	        less: function(n),
	        pastInput: function(),
	        upcomingInput: function(),
	        showPosition: function(),
	        test_match: function(regex_match_array, rule_index),
	        next: function(),
	        lex: function(),
	        begin: function(condition),
	        popState: function(),
	        _currentRules: function(),
	        topState: function(),
	        pushState: function(condition),
	
	        options: {
	            ranges: boolean           (optional: true ==> token location info will include a .range[] member)
	            flex: boolean             (optional: true ==> flex-like lexing behaviour where the rules are tested exhaustively to find the longest match)
	            backtrack_lexer: boolean  (optional: true ==> lexer regexes are tested in order and for each matching regex the action code is invoked; the lexer terminates the scan when a token is returned by the action code)
	        },
	
	        performAction: function(yy, yy_, $avoiding_name_collisions, YY_START),
	        rules: [...],
	        conditions: {associative list: name ==> set},
	    }
	  }
	
	
	  token location info (@$, _$, etc.): {
	    first_line: n,
	    last_line: n,
	    first_column: n,
	    last_column: n,
	    range: [start_number, end_number]       (where the numbers are indexes into the input string, regular zero-based)
	  }
	
	
	  the parseError function receives a 'hash' object with these members for lexer and parser errors: {
	    text:        (matched text)
	    token:       (the produced terminal token, if any)
	    line:        (yylineno)
	  }
	  while parser (grammar) errors will also provide these members, i.e. parser errors deliver a superset of attributes: {
	    loc:         (yylloc)
	    expected:    (string describing the set of expected tokens)
	    recoverable: (boolean: TRUE when the parser has a error recovery rule available for this particular error)
	  }
	*/
	var parser = (function(){
	var o=function(k,v,o,l){for(o=o||{},l=k.length;l--;o[k[l]]=v);return o},$V0=[1,5],$V1=[1,6],$V2=[1,16],$V3=[1,17],$V4=[1,14],$V5=[1,13],$V6=[1,19],$V7=[1,18],$V8=[1,21],$V9=[1,22],$Va=[5,8,9,11,38],$Vb=[1,25],$Vc=[1,26],$Vd=[1,27],$Ve=[1,28],$Vf=[1,29],$Vg=[1,30],$Vh=[1,31],$Vi=[1,32],$Vj=[1,23],$Vk=[5,8,9,11,22,23,24,25,26,27,28,29,34,38],$Vl=[2,25],$Vm=[5,8,9,11,22,23,24,25,26,27,28,29,34,38,40],$Vn=[2,43],$Vo=[20,42,43,44],$Vp=[1,59];
	var parser = {trace: function trace() { },
	yy: {},
	symbols_: {"error":2,"query":3,"expression":4,"EOF":5,"identifier_path":6,"not":7,"and":8,"or":9,"(":10,")":11,"resource_expression":12,"comparison_expression":13,"subquery":14,"literal":15,"boolean":16,"string":17,"integer":18,"float":19,"@":20,"comparison_op":21,"~":22,"!~":23,"=":24,"!=":25,">":26,">=":27,"<":28,"<=":29,"literal_identifier":30,"regexp_identifier":31,"*":32,"identifier":33,".":34,"#":35,"block_expression":36,"{":37,"}":38,"[":39,"]":40,"@@":41,"Boolean":42,"Number":43,"String":44,"$accept":0,"$end":1},
	terminals_: {2:"error",5:"EOF",7:"not",8:"and",9:"or",10:"(",11:")",20:"@",22:"~",23:"!~",24:"=",25:"!=",26:">",27:">=",28:"<",29:"<=",32:"*",34:".",35:"#",37:"{",38:"}",39:"[",40:"]",41:"@@",42:"Boolean",43:"Number",44:"String"},
	productions_: [0,[3,2],[3,1],[4,1],[4,2],[4,3],[4,3],[4,3],[4,1],[4,1],[4,1],[15,1],[15,1],[15,1],[15,1],[15,2],[21,1],[21,1],[21,1],[21,1],[21,1],[21,1],[21,1],[21,1],[13,3],[30,1],[30,1],[31,2],[31,1],[33,1],[33,1],[6,1],[6,1],[6,3],[6,3],[14,4],[14,3],[36,3],[12,4],[12,5],[12,5],[12,6],[16,1],[18,1],[17,1],[19,3]],
	performAction: function anonymous(yytext, yyleng, yylineno, yy, yystate /* action[1] */, $$ /* vstack */, _$ /* lstack */) {
	/* this == yyval */
	
	var $0 = $$.length - 1;
	switch (yystate) {
	case 1:
	 this.$ = ast.query($$[$0-1]); this.$.loc = loc(this._$); return this.$; 
	break;
	case 2:
	 this.$ = ast.query(); this.$.loc = loc(this._$); return this.$;
	break;
	case 3:
	 this.$ = ast.regexpNodeMatch($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 4:
	 this.$ = ast.notExpression($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 5:
	 this.$ = ast.andExpression($$[$0-2], $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 6:
	 this.$ = ast.orExpression($$[$0-2], $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 7:
	 this.$ = ast.parentesizedExpression($$[$0-1]); this.$.loc = loc(this._$); 
	break;
	case 11:
	 this.$ = ast.boolean($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 12:
	 this.$ = ast.string($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 13: case 14:
	 this.$ = ast.number($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 15:
	 this.$ = ast.date($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 24:
	 this.$ = ast.comparison($$[$0-1], $$[$0-2], $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 25: case 26:
	 this.$ = ast.identifier($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 27:
	 this.$ = ast.regexpIdentifier($$[$0]); this.$.loc = loc(this._$); 
	break;
	case 28:
	 this.$ = ast.regexpIdentifier(".*"); this.$.loc = loc(this._$); 
	break;
	case 31:
	 this.$ = ast.identifierPath([$$[$0]], false); this.$.loc = loc(this._$); 
	break;
	case 32:
	 this.$ = ast.identifierPath([$$[$0]], true); this.$.loc = loc(this._$); 
	break;
	case 33:
	 $$[$0-2].components.push($$[$0]); this.$ = $$[$0-2]; this.$.loc = loc(this._$); 
	break;
	case 34:
	 $$[$0-2].components.push($$[$0]); $$[$0-2].regexp = true; this.$ = $$[$0-2]; this.$.loc = loc(this._$); 
	break;
	case 35:
	 this.$ = ast.subquery($$[$0-2], $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 36:
	 this.$ = ast.subquery($$[$0-1], $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 37:
	 this.$ = ast.blockExpression($$[$0-1]); this.$.loc = loc(this._$); 
	break;
	case 38:
	 this.$ = ast.resource($$[$0-3], $$[$0-1], false); this.$.loc = loc(this._$); 
	break;
	case 39:
	 this.$ = ast.resource($$[$0-4], $$[$0-2], false, $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 40:
	 this.$ = ast.resource($$[$0-3], $$[$0-1], true); this.$.loc = loc(this._$); 
	break;
	case 41:
	 this.$ = ast.resource($$[$0-4], $$[$0-2], true, $$[$0]); this.$.loc = loc(this._$); 
	break;
	case 42:
	 this.$ = yytext === 'true' ? true: false; 
	break;
	case 43:
	 this.$ = parseInt(yytext, 10); 
	break;
	case 44:
	 this.$ = yytext; 
	break;
	case 45:
	 this.$ = parseFloat($$[$0-2] + '.' + $$[$0]) 
	break;
	}
	},
	table: [{3:1,4:2,5:[1,3],6:4,7:$V0,10:$V1,12:7,13:8,14:9,17:12,18:15,22:$V2,30:10,31:11,32:$V3,35:$V4,41:$V5,43:$V6,44:$V7},{1:[3]},{5:[1,20],8:$V8,9:$V9},{1:[2,2]},o($Va,[2,3],{21:24,22:$Vb,23:$Vc,24:$Vd,25:$Ve,26:$Vf,27:$Vg,28:$Vh,29:$Vi,34:$Vj}),{4:33,6:4,7:$V0,10:$V1,12:7,13:8,14:9,17:12,18:15,22:$V2,30:10,31:11,32:$V3,35:$V4,41:$V5,43:$V6,44:$V7},{4:34,6:4,7:$V0,10:$V1,12:7,13:8,14:9,17:12,18:15,22:$V2,30:10,31:11,32:$V3,35:$V4,41:$V5,43:$V6,44:$V7},o($Va,[2,8]),o($Va,[2,9]),o($Va,[2,10]),o($Vk,[2,31]),o($Vk,[2,32]),o($Vk,$Vl,{39:[1,35]}),{17:36,44:$V7},{17:37,44:$V7},o($Vm,[2,26]),{17:38,44:$V7},o($Vm,[2,28]),o([5,8,9,11,22,23,24,25,26,27,28,29,34,37,38,39,40],[2,44]),o($Vm,$Vn),{1:[2,1]},{4:39,6:4,7:$V0,10:$V1,12:7,13:8,14:9,17:12,18:15,22:$V2,30:10,31:11,32:$V3,35:$V4,41:$V5,43:$V6,44:$V7},{4:40,6:4,7:$V0,10:$V1,12:7,13:8,14:9,17:12,18:15,22:$V2,30:10,31:11,32:$V3,35:$V4,41:$V5,43:$V6,44:$V7},{17:43,18:15,22:$V2,30:41,31:42,32:$V3,43:$V6,44:$V7},{15:44,16:45,17:46,18:47,19:48,20:[1,49],42:[1,50],43:[1,51],44:$V7},o($Vo,[2,16]),o($Vo,[2,17]),o($Vo,[2,18]),o($Vo,[2,19]),o($Vo,[2,20]),o($Vo,[2,21]),o($Vo,[2,22]),o($Vo,[2,23]),o($Va,[2,4]),{8:$V8,9:$V9,11:[1,52]},{17:43,18:15,22:$V2,30:54,31:55,32:$V3,33:53,43:$V6,44:$V7},{39:[1,56]},{34:[1,57],36:58,37:$Vp},o($Vm,[2,27]),o($Va,[2,5]),o([5,9,11,38],[2,6],{8:$V8}),o($Vk,[2,33]),o($Vk,[2,34]),o($Vm,$Vl),o($Va,[2,24]),o($Va,[2,11]),o($Va,[2,12]),o($Va,[2,13]),o($Va,[2,14]),{17:60,44:$V7},o($Va,[2,42]),o($Va,$Vn,{34:[1,61]}),o($Va,[2,7]),{40:[1,62]},{40:[2,29]},{40:[2,30]},{17:43,18:15,22:$V2,30:54,31:55,32:$V3,33:63,43:$V6,44:$V7},{6:65,13:64,17:43,18:15,22:$V2,30:10,31:11,32:$V3,43:$V6,44:$V7},o($Va,[2,36]),{4:66,6:4,7:$V0,10:$V1,12:7,13:8,14:9,17:12,18:15,22:$V2,30:10,31:11,32:$V3,35:$V4,41:$V5,43:$V6,44:$V7},o($Va,[2,15]),{43:[1,67]},o($Va,[2,38],{36:68,37:$Vp}),{40:[1,69]},o($Va,[2,35]),{21:24,22:$Vb,23:$Vc,24:$Vd,25:$Ve,26:$Vf,27:$Vg,28:$Vh,29:$Vi,34:$Vj},{8:$V8,9:$V9,38:[1,70]},o($Va,[2,45]),o($Va,[2,39]),o($Va,[2,40],{36:71,37:$Vp}),o($Va,[2,37]),o($Va,[2,41])],
	defaultActions: {3:[2,2],20:[2,1],54:[2,29],55:[2,30]},
	parseError: function parseError(str, hash) {
	    if (hash.recoverable) {
	        this.trace(str);
	    } else {
	        var error = new Error(str);
	        error.hash = hash;
	        throw error;
	    }
	},
	parse: function parse(input) {
	    var self = this, stack = [0], tstack = [], vstack = [null], lstack = [], table = this.table, yytext = '', yylineno = 0, yyleng = 0, recovering = 0, TERROR = 2, EOF = 1;
	    var args = lstack.slice.call(arguments, 1);
	    var lexer = Object.create(this.lexer);
	    var sharedState = { yy: {} };
	    for (var k in this.yy) {
	        if (Object.prototype.hasOwnProperty.call(this.yy, k)) {
	            sharedState.yy[k] = this.yy[k];
	        }
	    }
	    lexer.setInput(input, sharedState.yy);
	    sharedState.yy.lexer = lexer;
	    sharedState.yy.parser = this;
	    if (typeof lexer.yylloc == 'undefined') {
	        lexer.yylloc = {};
	    }
	    var yyloc = lexer.yylloc;
	    lstack.push(yyloc);
	    var ranges = lexer.options && lexer.options.ranges;
	    if (typeof sharedState.yy.parseError === 'function') {
	        this.parseError = sharedState.yy.parseError;
	    } else {
	        this.parseError = Object.getPrototypeOf(this).parseError;
	    }
	    function popStack(n) {
	        stack.length = stack.length - 2 * n;
	        vstack.length = vstack.length - n;
	        lstack.length = lstack.length - n;
	    }
	    _token_stack:
	        var lex = function () {
	            var token;
	            token = lexer.lex() || EOF;
	            if (typeof token !== 'number') {
	                token = self.symbols_[token] || token;
	            }
	            return token;
	        };
	    var symbol, preErrorSymbol, state, action, a, r, yyval = {}, p, len, newState, expected;
	    while (true) {
	        state = stack[stack.length - 1];
	        if (this.defaultActions[state]) {
	            action = this.defaultActions[state];
	        } else {
	            if (symbol === null || typeof symbol == 'undefined') {
	                symbol = lex();
	            }
	            action = table[state] && table[state][symbol];
	        }
	                    if (typeof action === 'undefined' || !action.length || !action[0]) {
	                var errStr = '';
	                expected = [];
	                for (p in table[state]) {
	                    if (this.terminals_[p] && p > TERROR) {
	                        expected.push('\'' + this.terminals_[p] + '\'');
	                    }
	                }
	                if (lexer.showPosition) {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ':\n' + lexer.showPosition() + '\nExpecting ' + expected.join(', ') + ', got \'' + (this.terminals_[symbol] || symbol) + '\'';
	                } else {
	                    errStr = 'Parse error on line ' + (yylineno + 1) + ': Unexpected ' + (symbol == EOF ? 'end of input' : '\'' + (this.terminals_[symbol] || symbol) + '\'');
	                }
	                this.parseError(errStr, {
	                    text: lexer.match,
	                    token: this.terminals_[symbol] || symbol,
	                    line: lexer.yylineno,
	                    loc: yyloc,
	                    expected: expected
	                });
	            }
	        if (action[0] instanceof Array && action.length > 1) {
	            throw new Error('Parse Error: multiple actions possible at state: ' + state + ', token: ' + symbol);
	        }
	        switch (action[0]) {
	        case 1:
	            stack.push(symbol);
	            vstack.push(lexer.yytext);
	            lstack.push(lexer.yylloc);
	            stack.push(action[1]);
	            symbol = null;
	            if (!preErrorSymbol) {
	                yyleng = lexer.yyleng;
	                yytext = lexer.yytext;
	                yylineno = lexer.yylineno;
	                yyloc = lexer.yylloc;
	                if (recovering > 0) {
	                    recovering--;
	                }
	            } else {
	                symbol = preErrorSymbol;
	                preErrorSymbol = null;
	            }
	            break;
	        case 2:
	            len = this.productions_[action[1]][1];
	            yyval.$ = vstack[vstack.length - len];
	            yyval._$ = {
	                first_line: lstack[lstack.length - (len || 1)].first_line,
	                last_line: lstack[lstack.length - 1].last_line,
	                first_column: lstack[lstack.length - (len || 1)].first_column,
	                last_column: lstack[lstack.length - 1].last_column
	            };
	            if (ranges) {
	                yyval._$.range = [
	                    lstack[lstack.length - (len || 1)].range[0],
	                    lstack[lstack.length - 1].range[1]
	                ];
	            }
	            r = this.performAction.apply(yyval, [
	                yytext,
	                yyleng,
	                yylineno,
	                sharedState.yy,
	                action[1],
	                vstack,
	                lstack
	            ].concat(args));
	            if (typeof r !== 'undefined') {
	                return r;
	            }
	            if (len) {
	                stack = stack.slice(0, -1 * len * 2);
	                vstack = vstack.slice(0, -1 * len);
	                lstack = lstack.slice(0, -1 * len);
	            }
	            stack.push(this.productions_[action[1]][0]);
	            vstack.push(yyval.$);
	            lstack.push(yyval._$);
	            newState = table[stack[stack.length - 2]][stack[stack.length - 1]];
	            stack.push(newState);
	            break;
	        case 3:
	            return true;
	        }
	    }
	    return true;
	}};
	
	  var astlib = __webpack_require__(2);
	  var ast = astlib.builders;
	  var evaluator = __webpack_require__(13);
	  var loc = __webpack_require__(9).loc;
	/* generated by jison-lex 0.3.4 */
	var lexer = (function(){
	var lexer = ({
	
	EOF:1,
	
	parseError:function parseError(str, hash) {
	        if (this.yy.parser) {
	            this.yy.parser.parseError(str, hash);
	        } else {
	            throw new Error(str);
	        }
	    },
	
	// resets the lexer, sets new input
	setInput:function (input, yy) {
	        this.yy = yy || this.yy || {};
	        this._input = input;
	        this._more = this._backtrack = this.done = false;
	        this.yylineno = this.yyleng = 0;
	        this.yytext = this.matched = this.match = '';
	        this.conditionStack = ['INITIAL'];
	        this.yylloc = {
	            first_line: 1,
	            first_column: 0,
	            last_line: 1,
	            last_column: 0
	        };
	        if (this.options.ranges) {
	            this.yylloc.range = [0,0];
	        }
	        this.offset = 0;
	        return this;
	    },
	
	// consumes and returns one char from the input
	input:function () {
	        var ch = this._input[0];
	        this.yytext += ch;
	        this.yyleng++;
	        this.offset++;
	        this.match += ch;
	        this.matched += ch;
	        var lines = ch.match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno++;
	            this.yylloc.last_line++;
	        } else {
	            this.yylloc.last_column++;
	        }
	        if (this.options.ranges) {
	            this.yylloc.range[1]++;
	        }
	
	        this._input = this._input.slice(1);
	        return ch;
	    },
	
	// unshifts one char (or a string) into the input
	unput:function (ch) {
	        var len = ch.length;
	        var lines = ch.split(/(?:\r\n?|\n)/g);
	
	        this._input = ch + this._input;
	        this.yytext = this.yytext.substr(0, this.yytext.length - len);
	        //this.yyleng -= len;
	        this.offset -= len;
	        var oldLines = this.match.split(/(?:\r\n?|\n)/g);
	        this.match = this.match.substr(0, this.match.length - 1);
	        this.matched = this.matched.substr(0, this.matched.length - 1);
	
	        if (lines.length - 1) {
	            this.yylineno -= lines.length - 1;
	        }
	        var r = this.yylloc.range;
	
	        this.yylloc = {
	            first_line: this.yylloc.first_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.first_column,
	            last_column: lines ?
	                (lines.length === oldLines.length ? this.yylloc.first_column : 0)
	                 + oldLines[oldLines.length - lines.length].length - lines[0].length :
	              this.yylloc.first_column - len
	        };
	
	        if (this.options.ranges) {
	            this.yylloc.range = [r[0], r[0] + this.yyleng - len];
	        }
	        this.yyleng = this.yytext.length;
	        return this;
	    },
	
	// When called from action, caches matched text and appends it on next action
	more:function () {
	        this._more = true;
	        return this;
	    },
	
	// When called from action, signals the lexer that this rule fails to match the input, so the next matching rule (regex) should be tested instead.
	reject:function () {
	        if (this.options.backtrack_lexer) {
	            this._backtrack = true;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	
	        }
	        return this;
	    },
	
	// retain first n characters of the match
	less:function (n) {
	        this.unput(this.match.slice(n));
	    },
	
	// displays already matched input, i.e. for error messages
	pastInput:function () {
	        var past = this.matched.substr(0, this.matched.length - this.match.length);
	        return (past.length > 20 ? '...':'') + past.substr(-20).replace(/\n/g, "");
	    },
	
	// displays upcoming input, i.e. for error messages
	upcomingInput:function () {
	        var next = this.match;
	        if (next.length < 20) {
	            next += this._input.substr(0, 20-next.length);
	        }
	        return (next.substr(0,20) + (next.length > 20 ? '...' : '')).replace(/\n/g, "");
	    },
	
	// displays the character position where the lexing error occurred, i.e. for error messages
	showPosition:function () {
	        var pre = this.pastInput();
	        var c = new Array(pre.length + 1).join("-");
	        return pre + this.upcomingInput() + "\n" + c + "^";
	    },
	
	// test the lexed token: return FALSE when not a match, otherwise return token
	test_match:function (match, indexed_rule) {
	        var token,
	            lines,
	            backup;
	
	        if (this.options.backtrack_lexer) {
	            // save context
	            backup = {
	                yylineno: this.yylineno,
	                yylloc: {
	                    first_line: this.yylloc.first_line,
	                    last_line: this.last_line,
	                    first_column: this.yylloc.first_column,
	                    last_column: this.yylloc.last_column
	                },
	                yytext: this.yytext,
	                match: this.match,
	                matches: this.matches,
	                matched: this.matched,
	                yyleng: this.yyleng,
	                offset: this.offset,
	                _more: this._more,
	                _input: this._input,
	                yy: this.yy,
	                conditionStack: this.conditionStack.slice(0),
	                done: this.done
	            };
	            if (this.options.ranges) {
	                backup.yylloc.range = this.yylloc.range.slice(0);
	            }
	        }
	
	        lines = match[0].match(/(?:\r\n?|\n).*/g);
	        if (lines) {
	            this.yylineno += lines.length;
	        }
	        this.yylloc = {
	            first_line: this.yylloc.last_line,
	            last_line: this.yylineno + 1,
	            first_column: this.yylloc.last_column,
	            last_column: lines ?
	                         lines[lines.length - 1].length - lines[lines.length - 1].match(/\r?\n?/)[0].length :
	                         this.yylloc.last_column + match[0].length
	        };
	        this.yytext += match[0];
	        this.match += match[0];
	        this.matches = match;
	        this.yyleng = this.yytext.length;
	        if (this.options.ranges) {
	            this.yylloc.range = [this.offset, this.offset += this.yyleng];
	        }
	        this._more = false;
	        this._backtrack = false;
	        this._input = this._input.slice(match[0].length);
	        this.matched += match[0];
	        token = this.performAction.call(this, this.yy, this, indexed_rule, this.conditionStack[this.conditionStack.length - 1]);
	        if (this.done && this._input) {
	            this.done = false;
	        }
	        if (token) {
	            return token;
	        } else if (this._backtrack) {
	            // recover context
	            for (var k in backup) {
	                this[k] = backup[k];
	            }
	            return false; // rule action called reject() implying the next rule should be tested instead.
	        }
	        return false;
	    },
	
	// return next match in input
	next:function () {
	        if (this.done) {
	            return this.EOF;
	        }
	        if (!this._input) {
	            this.done = true;
	        }
	
	        var token,
	            match,
	            tempMatch,
	            index;
	        if (!this._more) {
	            this.yytext = '';
	            this.match = '';
	        }
	        var rules = this._currentRules();
	        for (var i = 0; i < rules.length; i++) {
	            tempMatch = this._input.match(this.rules[rules[i]]);
	            if (tempMatch && (!match || tempMatch[0].length > match[0].length)) {
	                match = tempMatch;
	                index = i;
	                if (this.options.backtrack_lexer) {
	                    token = this.test_match(tempMatch, rules[i]);
	                    if (token !== false) {
	                        return token;
	                    } else if (this._backtrack) {
	                        match = false;
	                        continue; // rule action called reject() implying a rule MISmatch.
	                    } else {
	                        // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	                        return false;
	                    }
	                } else if (!this.options.flex) {
	                    break;
	                }
	            }
	        }
	        if (match) {
	            token = this.test_match(match, rules[index]);
	            if (token !== false) {
	                return token;
	            }
	            // else: this is a lexer rule which consumes input without producing a token (e.g. whitespace)
	            return false;
	        }
	        if (this._input === "") {
	            return this.EOF;
	        } else {
	            return this.parseError('Lexical error on line ' + (this.yylineno + 1) + '. Unrecognized text.\n' + this.showPosition(), {
	                text: "",
	                token: null,
	                line: this.yylineno
	            });
	        }
	    },
	
	// return next match that has a token
	lex:function lex() {
	        var r = this.next();
	        if (r) {
	            return r;
	        } else {
	            return this.lex();
	        }
	    },
	
	// activates a new lexer condition state (pushes the new lexer condition state onto the condition stack)
	begin:function begin(condition) {
	        this.conditionStack.push(condition);
	    },
	
	// pop the previously active lexer condition state off the condition stack
	popState:function popState() {
	        var n = this.conditionStack.length - 1;
	        if (n > 0) {
	            return this.conditionStack.pop();
	        } else {
	            return this.conditionStack[0];
	        }
	    },
	
	// produce the lexer rule set which is active for the currently active lexer condition state
	_currentRules:function _currentRules() {
	        if (this.conditionStack.length && this.conditionStack[this.conditionStack.length - 1]) {
	            return this.conditions[this.conditionStack[this.conditionStack.length - 1]].rules;
	        } else {
	            return this.conditions["INITIAL"].rules;
	        }
	    },
	
	// return the currently active lexer condition state; when an index argument is provided it produces the N-th previous condition state, if available
	topState:function topState(n) {
	        n = this.conditionStack.length - 1 - Math.abs(n || 0);
	        if (n >= 0) {
	            return this.conditionStack[n];
	        } else {
	            return "INITIAL";
	        }
	    },
	
	// alias for begin(condition)
	pushState:function pushState(condition) {
	        this.begin(condition);
	    },
	
	// return the number of states currently on the stack
	stateStackSize:function stateStackSize() {
	        return this.conditionStack.length;
	    },
	options: {},
	performAction: function anonymous(yy,yy_,$avoiding_name_collisions,YY_START) {
	var YYSTATE=YY_START;
	switch($avoiding_name_collisions) {
	case 0: /* whitespace no action */ 
	break;
	case 1: return 10; 
	break;
	case 2: return 11; 
	break;
	case 3: return 39; 
	break;
	case 4: return 40; 
	break;
	case 5: return 37; 
	break;
	case 6: return 38; 
	break;
	case 7: return 24; 
	break;
	case 8: return 25; 
	break;
	case 9: return 22; 
	break;
	case 10: return 23; 
	break;
	case 11: return 29; 
	break;
	case 12: return 27; 
	break;
	case 13: return 26; 
	break;
	case 14: return 28; 
	break;
	case 15: return 32; 
	break;
	case 16: return 35; 
	break;
	case 17: return 7; 
	break;
	case 18: return 8; 
	break;
	case 19: return 9; 
	break;
	case 20: return 42; 
	break;
	case 21: return 42; 
	break;
	case 22: return 43; 
	break;
	case 23: yy_.yytext = eval(yy_.yytext); return 44; 
	break;
	case 24: yy_.yytext = eval(yy_.yytext); return 44; 
	break;
	case 25: return 34; 
	break;
	case 26: return 44; 
	break;
	case 27: return 41; 
	break;
	case 28: return 20; 
	break;
	case 29: return 5; 
	break;
	}
	},
	rules: [/^(?:\s+)/,/^(?:\()/,/^(?:\))/,/^(?:\[)/,/^(?:\])/,/^(?:\{)/,/^(?:\})/,/^(?:=)/,/^(?:!=)/,/^(?:~)/,/^(?:!~)/,/^(?:<=)/,/^(?:>=)/,/^(?:>)/,/^(?:<)/,/^(?:\*)/,/^(?:#)/,/^(?:not\b)/,/^(?:and\b)/,/^(?:or\b)/,/^(?:true\b)/,/^(?:false\b)/,/^(?:-?\d+)/,/^(?:"(\\.|[^\\"])*")/,/^(?:'(\\.|[^\\'])*')/,/^(?:\.)/,/^(?:[-\w_:\?]+)/,/^(?:@@)/,/^(?:@)/,/^(?:$)/],
	conditions: {"INITIAL":{"rules":[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29],"inclusive":true}}
	});
	return lexer;
	})();
	parser.lexer = lexer;
	function Parser () {
	  this.yy = {};
	}
	Parser.prototype = parser;parser.Parser = Parser;
	return new Parser;
	})();
	
	
	if (true) {
	exports.parser = parser;
	exports.Parser = parser.Parser;
	exports.parse = function () { return parser.parse.apply(parser, arguments); };
	exports.main = function commonjsMain(args) {
	    if (!args[1]) {
	        console.log('Usage: '+args[0]+' FILE');
	        process.exit(1);
	    }
	    var source = __webpack_require__(15).readFileSync(__webpack_require__(16).normalize(args[1]), "utf8");
	    return exports.parser.parse(source);
	};
	if (typeof module !== 'undefined' && __webpack_require__.c[0] === module) {
	  exports.main(process.argv.slice(1));
	}
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11), __webpack_require__(12)(module)))

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};
	
	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.
	
	var cachedSetTimeout;
	var cachedClearTimeout;
	
	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }
	
	
	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }
	
	
	
	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;
	
	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}
	
	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;
	
	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	
	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};
	
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};
	
	function noop() {}
	
	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;
	
	process.listeners = function (name) { return [] }
	
	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};
	
	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 12 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _timespec = __webpack_require__(14);
	
	var _timespec2 = _interopRequireDefault(_timespec);
	
	var _ast = __webpack_require__(2);
	
	var _util = __webpack_require__(9);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var comparison = function comparison(operator, left, right) {
	  if (operator === '!=' || operator === '!~') {
	    return ['not', [operator[1], left, right]];
	  }
	  return [operator, left, right];
	};
	
	exports.default = function (ast) {
	  var mode = ['fact'];
	  return (0, _ast.visit)(ast, {
	    visitComparison: function visitComparison(path) {
	      this.traverse(path);
	      // Function to handle negating comparisons
	      if (mode[0] === 'fact') {
	        return ['in', 'certname', ['extract', 'certname', ['select_fact_contents', ['and', path.node.left, comparison(path.node.operator, 'value', path.node.right)]]]];
	      } else if (mode[0] === 'subquery') {
	        var left = void 0;
	        if (path.node.left.length === 1) {
	          left = path.node.left[0];
	        } else {
	          left = path.node.left;
	        }
	        return comparison(path.node.operator, left, path.node.right);
	      } else if (mode[0] === 'resource') {
	        if (path.node.left[0] === 'tag') {
	          return comparison(path.node.operator, path.node.left[0], path.node.right);
	        }
	        return comparison(path.node.operator, ['parameter', path.node.left[0]], path.node.right);
	      }
	      throw Error('Unknown mode ' + mode);
	    },
	    visitBoolean: function visitBoolean(path) {
	      // returning false to use it as a replacement doesn't work
	      path.replace(path.node.value);
	      return false;
	    },
	    visitString: function visitString(path) {
	      return path.node.value;
	    },
	    visitNumber: function visitNumber(path) {
	      return path.node.value;
	    },
	    visitDate: function visitDate(path) {
	      try {
	        return _timespec2.default.parse(path.node.value).toISOString();
	      } catch (error) {
	        var loc = (0, _util.formatLocation)(path.node);
	        throw new Error('Failed to parse date: "' + path.node.value + '" at ' + loc);
	      }
	    },
	    visitAndExpression: function visitAndExpression(path) {
	      this.traverse(path);
	      return ['and', path.node.left, path.node.right];
	    },
	    visitOrExpression: function visitOrExpression(path) {
	      this.traverse(path);
	      return ['or', path.node.left, path.node.right];
	    },
	    visitNotExpression: function visitNotExpression(path) {
	      this.traverse(path);
	      return ['not', path.node.expression];
	    },
	    visitQuery: function visitQuery(path) {
	      this.traverse(path);
	      return path.node.expression;
	    },
	    visitParentesizedExpression: function visitParentesizedExpression(path) {
	      this.traverse(path);
	      return path.node.expression;
	    },
	    visitBlockExpression: function visitBlockExpression(path) {
	      this.traverse(path);
	      return path.node.expression;
	    },
	    visitSubquery: function visitSubquery(path) {
	      mode.unshift('subquery');
	      this.traverse(path);
	      mode.shift();
	      return ['in', 'certname', ['extract', 'certname', ['select_' + path.node.endpoint + 's', path.node.expression]]];
	    },
	    visitRegexpNodeMatch: function visitRegexpNodeMatch(path) {
	      mode.unshift('regexp');
	      this.traverse(path);
	      mode.shift();
	      return ['~', 'certname', (0, _util.regexpEscape)(path.node.value.join('.'))];
	    },
	    visitIdentifierPath: function visitIdentifierPath(path) {
	      this.traverse(path);
	      if (mode[0] === 'fact') {
	        return [path.node.regexp ? '~>' : '=', 'path', path.node.components];
	      }
	      return path.node.components;
	    },
	    visitRegexpIdentifier: function visitRegexpIdentifier(path) {
	      return path.node.name;
	    },
	    visitIdentifier: function visitIdentifier(path) {
	      if (path.parentPath.node.regexp) {
	        return (0, _util.regexpEscape)(path.node.name);
	      }
	      return path.node.name;
	    },
	    visitResource: function visitResource(path) {
	      var regexp = path.node.title.type === 'RegexpIdentifier';
	      mode.unshift('resource');
	      this.traverse(path);
	      mode.shift();
	      var title = path.node.title;
	
	      if (!regexp && (0, _util.capitalize)(path.node.res_type) === 'Class') {
	        title = (0, _util.capitalizeClass)(title);
	      }
	      var andExpr = ['and', ['=', 'type', (0, _util.capitalizeClass)(path.node.res_type)], [regexp ? '~' : '=', 'title', title], ['=', 'exported', path.node.exported]];
	      if (path.node.parameters) {
	        andExpr.push(path.node.parameters);
	      }
	      return ['in', 'certname', ['extract', 'certname', ['select_resources', andExpr]]];
	    }
	  });
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	module.exports = (function(){
	  /*
	   * Generated by PEG.js 0.7.0.
	   *
	   * http://pegjs.majda.cz/
	   */
	  
	  function quote(s) {
	    /*
	     * ECMA-262, 5th ed., 7.8.4: All characters may appear literally in a
	     * string literal except for the closing quote character, backslash,
	     * carriage return, line separator, paragraph separator, and line feed.
	     * Any character may appear in the form of an escape sequence.
	     *
	     * For portability, we also escape escape all control and non-ASCII
	     * characters. Note that "\0" and "\v" escape sequences are not used
	     * because JSHint does not like the first and IE the second.
	     */
	     return '"' + s
	      .replace(/\\/g, '\\\\')  // backslash
	      .replace(/"/g, '\\"')    // closing quote character
	      .replace(/\x08/g, '\\b') // backspace
	      .replace(/\t/g, '\\t')   // horizontal tab
	      .replace(/\n/g, '\\n')   // line feed
	      .replace(/\f/g, '\\f')   // form feed
	      .replace(/\r/g, '\\r')   // carriage return
	      .replace(/[\x00-\x07\x0B\x0E-\x1F\x80-\uFFFF]/g, escape)
	      + '"';
	  }
	  
	  var result = {
	    /*
	     * Parses the input with a generated parser. If the parsing is successfull,
	     * returns a value explicitly or implicitly specified by the grammar from
	     * which the parser was generated (see |PEG.buildParser|). If the parsing is
	     * unsuccessful, throws |PEG.parser.SyntaxError| describing the error.
	     */
	    parse: function(input, startRule) {
	      var parseFunctions = {
	        "timespec": parse_timespec,
	        "spec_base": parse_spec_base,
	        "time_base": parse_time_base,
	        "hr24clock_hr_min": parse_hr24clock_hr_min,
	        "time_hour": parse_time_hour,
	        "time_hour_min": parse_time_hour_min,
	        "am_pm": parse_am_pm,
	        "timezone_name": parse_timezone_name,
	        "date": parse_date,
	        "concatenated_date": parse_concatenated_date,
	        "month_name": parse_month_name,
	        "year_number": parse_year_number,
	        "day_of_week": parse_day_of_week,
	        "inc_or_dec": parse_inc_or_dec,
	        "increment": parse_increment,
	        "decrement": parse_decrement,
	        "inc_dec_period": parse_inc_dec_period,
	        "int1_2digit": parse_int1_2digit,
	        "int2_or_4digit": parse_int2_or_4digit,
	        "str5_8digit": parse_str5_8digit,
	        "integer": parse_integer,
	        "_": parse__
	      };
	      
	      if (startRule !== undefined) {
	        if (parseFunctions[startRule] === undefined) {
	          throw new Error("Invalid rule name: " + quote(startRule) + ".");
	        }
	      } else {
	        startRule = "timespec";
	      }
	      
	      var pos = 0;
	      var reportFailures = 0;
	      var rightmostFailuresPos = 0;
	      var rightmostFailuresExpected = [];
	      
	      function padLeft(input, padding, length) {
	        var result = input;
	        
	        var padLength = length - input.length;
	        for (var i = 0; i < padLength; i++) {
	          result = padding + result;
	        }
	        
	        return result;
	      }
	      
	      function escape(ch) {
	        var charCode = ch.charCodeAt(0);
	        var escapeChar;
	        var length;
	        
	        if (charCode <= 0xFF) {
	          escapeChar = 'x';
	          length = 2;
	        } else {
	          escapeChar = 'u';
	          length = 4;
	        }
	        
	        return '\\' + escapeChar + padLeft(charCode.toString(16).toUpperCase(), '0', length);
	      }
	      
	      function matchFailed(failure) {
	        if (pos < rightmostFailuresPos) {
	          return;
	        }
	        
	        if (pos > rightmostFailuresPos) {
	          rightmostFailuresPos = pos;
	          rightmostFailuresExpected = [];
	        }
	        
	        rightmostFailuresExpected.push(failure);
	      }
	      
	      function parse_timespec() {
	        var result0, result1, result2;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse_spec_base();
	        if (result0 !== null) {
	          pos2 = pos;
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_inc_or_dec();
	            if (result2 !== null) {
	              result1 = [result1, result2];
	            } else {
	              result1 = null;
	              pos = pos2;
	            }
	          } else {
	            result1 = null;
	            pos = pos2;
	          }
	          result1 = result1 !== null ? result1 : "";
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, base, tail) {
	            if (typeof(tail) === 'object') {
	              var count = tail[1]['count'];
	              var amount = tail[1]['amount'];
	        
	              base.setFullYear(base.getFullYear() + (amount.y * count));
	              base.setMonth(base.getMonth() + (amount.m * count));
	              base.setDate(base.getDate() + (amount.d * count));
	              base.setHours(base.getHours() + (amount.h * count));
	              base.setMinutes(base.getMinutes() + (amount.i * count));
	            }
	        
	            return base;
	          })(pos0, result0[0], result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_spec_base() {
	        var result0, result1, result2, result3;
	        var pos0, pos1, pos2, pos3;
	        
	        result0 = parse_date();
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          result0 = parse_time_base();
	          if (result0 !== null) {
	            pos2 = pos;
	            pos3 = pos;
	            result1 = parse__();
	            if (result1 !== null) {
	              result2 = parse_timezone_name();
	              if (result2 !== null) {
	                result1 = [result1, result2];
	              } else {
	                result1 = null;
	                pos = pos3;
	              }
	            } else {
	              result1 = null;
	              pos = pos3;
	            }
	            result1 = result1 !== null ? result1 : "";
	            if (result1 !== null) {
	              pos3 = pos;
	              result2 = parse__();
	              if (result2 !== null) {
	                result3 = parse_date();
	                if (result3 !== null) {
	                  result2 = [result2, result3];
	                } else {
	                  result2 = null;
	                  pos = pos3;
	                }
	              } else {
	                result2 = null;
	                pos = pos3;
	              }
	              result2 = result2 !== null ? result2 : "";
	              if (result2 !== null) {
	                result1 = [result1, result2];
	              } else {
	                result1 = null;
	                pos = pos2;
	              }
	            } else {
	              result1 = null;
	              pos = pos2;
	            }
	            result1 = result1 !== null ? result1 : "";
	            if (result1 !== null) {
	              result0 = [result0, result1];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset, t, tail) {
	              var utc = false;
	              var date = null;
	              if (typeof(tail) === 'object') {
	                if (typeof(tail[0]) === 'object') {
	                  utc = true;
	                }
	                if (typeof(tail[1]) === 'object') {
	                  date = tail[1][1];
	                }
	              }
	          
	              if (utc) {
	                t = new Date(Date.UTC(
	                  t.getFullYear(),
	                  t.getMonth(),
	                  t.getDate(),
	                  t.getHours(),
	                  t.getMinutes(),
	                  t.getSeconds(),
	                  t.getMilliseconds()));
	              }
	          
	              if (date) {
	                if (utc) {
	                  t.setUTCFullYear(date.getFullYear());
	                  t.setUTCMonth(date.getMonth());
	                  t.setUTCDate(date.getDate());
	                }
	                else {
	                  t.setFullYear(date.getFullYear());
	                  t.setMonth(date.getMonth());
	                  t.setDate(date.getDate());
	                }
	              }
	              else {
	                /* If no date is specified and the time has already passed, follow
	                 * the behavior of 'at' and pick the same time tomorrow.
	                 */
	                var now = new Date();
	                if (t < now) {
	                  t.setDate(t.getDate() + 1);
	                }
	              }
	          
	              return t;
	            })(pos0, result0[0], result0[1]);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            if (input.substr(pos, 3).toLowerCase() === "now") {
	              result0 = input.substr(pos, 3);
	              pos += 3;
	            } else {
	              result0 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"NOW\"");
	              }
	            }
	            if (result0 !== null) {
	              result0 = (function(offset) {
	                return new Date();
	              })(pos0);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	          }
	        }
	        return result0;
	      }
	      
	      function parse_time_base() {
	        var result0, result1, result2;
	        var pos0, pos1, pos2;
	        
	        result0 = parse_hr24clock_hr_min();
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          result0 = parse_time_hour();
	          if (result0 !== null) {
	            result1 = parse__();
	            if (result1 !== null) {
	              result2 = parse_am_pm();
	              if (result2 !== null) {
	                result0 = [result0, result1, result2];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset, t, offset) {
	              t.setHours(t.getHours() + offset);
	          
	              return t;
	            })(pos0, result0[0], result0[2]);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            pos1 = pos;
	            result0 = parse_time_hour_min();
	            if (result0 !== null) {
	              pos2 = pos;
	              result1 = parse__();
	              if (result1 !== null) {
	                result2 = parse_am_pm();
	                if (result2 !== null) {
	                  result1 = [result1, result2];
	                } else {
	                  result1 = null;
	                  pos = pos2;
	                }
	              } else {
	                result1 = null;
	                pos = pos2;
	              }
	              result1 = result1 !== null ? result1 : "";
	              if (result1 !== null) {
	                result0 = [result0, result1];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	            if (result0 !== null) {
	              result0 = (function(offset, t, tail) {
	                if (typeof(tail) === 'object') {
	                  t.setHours(t.getHours() + tail[1]);
	                }
	            
	                return t;
	              })(pos0, result0[0], result0[1]);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	            if (result0 === null) {
	              pos0 = pos;
	              if (input.substr(pos, 4).toLowerCase() === "noon") {
	                result0 = input.substr(pos, 4);
	                pos += 4;
	              } else {
	                result0 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"NOON\"");
	                }
	              }
	              if (result0 !== null) {
	                result0 = (function(offset) {
	                  var today = new Date();
	              
	                  today.setHours(12);
	                  today.setMinutes(0);
	                  today.setSeconds(0);
	                  today.setMilliseconds(0);
	              
	                  return today;
	                })(pos0);
	              }
	              if (result0 === null) {
	                pos = pos0;
	              }
	              if (result0 === null) {
	                pos0 = pos;
	                if (input.substr(pos, 8).toLowerCase() === "midnight") {
	                  result0 = input.substr(pos, 8);
	                  pos += 8;
	                } else {
	                  result0 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"MIDNIGHT\"");
	                  }
	                }
	                if (result0 !== null) {
	                  result0 = (function(offset) {
	                    var today = new Date();
	                
	                    today.setHours(0);
	                    today.setMinutes(0);
	                    today.setSeconds(0);
	                    today.setMilliseconds(0);
	                
	                    return today;
	                  })(pos0);
	                }
	                if (result0 === null) {
	                  pos = pos0;
	                }
	                if (result0 === null) {
	                  pos0 = pos;
	                  if (input.substr(pos, 7).toLowerCase() === "teatime") {
	                    result0 = input.substr(pos, 7);
	                    pos += 7;
	                  } else {
	                    result0 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("\"TEATIME\"");
	                    }
	                  }
	                  if (result0 !== null) {
	                    result0 = (function(offset) {
	                      var today = new Date();
	                  
	                      today.setHours(16);
	                      today.setMinutes(0);
	                      today.setSeconds(0);
	                      today.setMilliseconds(0);
	                  
	                      return today;
	                    })(pos0);
	                  }
	                  if (result0 === null) {
	                    pos = pos0;
	                  }
	                }
	              }
	            }
	          }
	        }
	        return result0;
	      }
	      
	      function parse_hr24clock_hr_min() {
	        var result0, result1, result2;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        pos2 = pos;
	        if (/^[0-9]/.test(input.charAt(pos))) {
	          result0 = input.charAt(pos);
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("[0-9]");
	          }
	        }
	        if (result0 !== null) {
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[0-9]");
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos2;
	          }
	        } else {
	          result0 = null;
	          pos = pos2;
	        }
	        if (result0 !== null) {
	          pos2 = pos;
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[0-9]");
	            }
	          }
	          if (result1 !== null) {
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result2 = input.charAt(pos);
	              pos++;
	            } else {
	              result2 = null;
	              if (reportFailures === 0) {
	                matchFailed("[0-9]");
	              }
	            }
	            if (result2 !== null) {
	              result1 = [result1, result2];
	            } else {
	              result1 = null;
	              pos = pos2;
	            }
	          } else {
	            result1 = null;
	            pos = pos2;
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, hour, minute) {
	            var today = new Date();
	        
	            today.setHours(parseInt(hour.join(''), 10));
	            today.setMinutes(parseInt(minute.join(''), 10));
	            today.setSeconds(0);
	            today.setMilliseconds(0);
	        
	            return today;
	          })(pos0, result0[0], result0[1]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_time_hour() {
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        result0 = parse_int1_2digit();
	        if (result0 !== null) {
	          result0 = (function(offset, hour) {
	            var today = new Date();
	        
	            today.setHours(hour);
	            today.setMinutes(0);
	            today.setSeconds(0);
	            today.setMilliseconds(0);
	        
	            return today;
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_time_hour_min() {
	        var result0, result1, result2, result3;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        pos2 = pos;
	        if (/^[012]/.test(input.charAt(pos))) {
	          result0 = input.charAt(pos);
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("[012]");
	          }
	        }
	        result0 = result0 !== null ? result0 : "";
	        if (result0 !== null) {
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[0-9]");
	            }
	          }
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos2;
	          }
	        } else {
	          result0 = null;
	          pos = pos2;
	        }
	        if (result0 !== null) {
	          if (/^[:'h,.]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[:'h,.]");
	            }
	          }
	          if (result1 !== null) {
	            pos2 = pos;
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result2 = input.charAt(pos);
	              pos++;
	            } else {
	              result2 = null;
	              if (reportFailures === 0) {
	                matchFailed("[0-9]");
	              }
	            }
	            if (result2 !== null) {
	              if (/^[0-9]/.test(input.charAt(pos))) {
	                result3 = input.charAt(pos);
	                pos++;
	              } else {
	                result3 = null;
	                if (reportFailures === 0) {
	                  matchFailed("[0-9]");
	                }
	              }
	              if (result3 !== null) {
	                result2 = [result2, result3];
	              } else {
	                result2 = null;
	                pos = pos2;
	              }
	            } else {
	              result2 = null;
	              pos = pos2;
	            }
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, hour, minute) {
	            var today = new Date();
	        
	            today.setHours(hour.join(''));
	            today.setMinutes(minute.join(''));
	            today.setSeconds(0);
	            today.setMilliseconds(0);
	        
	            return today;
	          })(pos0, result0[0], result0[2]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_am_pm() {
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        if (input.substr(pos, 2).toLowerCase() === "am") {
	          result0 = input.substr(pos, 2);
	          pos += 2;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"AM\"");
	          }
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return 12; })(pos0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          if (input.substr(pos, 2).toLowerCase() === "pm") {
	            result0 = input.substr(pos, 2);
	            pos += 2;
	          } else {
	            result0 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"PM\"");
	            }
	          }
	          if (result0 !== null) {
	            result0 = (function(offset) { return 0; })(pos0);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	        }
	        return result0;
	      }
	      
	      function parse_timezone_name() {
	        var result0;
	        
	        if (input.substr(pos, 3).toLowerCase() === "utc") {
	          result0 = input.substr(pos, 3);
	          pos += 3;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"UTC\"");
	          }
	        }
	        return result0;
	      }
	      
	      function parse_date() {
	        var result0, result1, result2, result3, result4, result5;
	        var pos0, pos1, pos2, pos3;
	        
	        pos0 = pos;
	        pos1 = pos;
	        result0 = parse_month_name();
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_int1_2digit();
	            if (result2 !== null) {
	              pos2 = pos;
	              pos3 = pos;
	              result3 = parse__();
	              result3 = result3 !== null ? result3 : "";
	              if (result3 !== null) {
	                if (input.charCodeAt(pos) === 44) {
	                  result4 = ",";
	                  pos++;
	                } else {
	                  result4 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\",\"");
	                  }
	                }
	                if (result4 !== null) {
	                  result3 = [result3, result4];
	                } else {
	                  result3 = null;
	                  pos = pos3;
	                }
	              } else {
	                result3 = null;
	                pos = pos3;
	              }
	              result3 = result3 !== null ? result3 : "";
	              if (result3 !== null) {
	                result4 = parse__();
	                if (result4 !== null) {
	                  result5 = parse_year_number();
	                  if (result5 !== null) {
	                    result3 = [result3, result4, result5];
	                  } else {
	                    result3 = null;
	                    pos = pos2;
	                  }
	                } else {
	                  result3 = null;
	                  pos = pos2;
	                }
	              } else {
	                result3 = null;
	                pos = pos2;
	              }
	              result3 = result3 !== null ? result3 : "";
	              if (result3 !== null) {
	                result0 = [result0, result1, result2, result3];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, month, day, tail) {
	            var now = null;
	        
	            if (typeof(tail) === 'object') {
	              now = new Date(tail[2], month, day);
	            }
	            else {
	              now = new Date(new Date().getFullYear(), month, day);
	            }
	        
	            return now;
	          })(pos0, result0[0], result0[2], result0[3]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          result0 = parse_day_of_week();
	          if (result0 !== null) {
	            result0 = (function(offset, day) {
	              var now = new Date();
	          
	              now.setDate(now.getDate() + (day - now.getDay()));
	          
	              return now;
	            })(pos0, result0);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            if (input.substr(pos, 5).toLowerCase() === "today") {
	              result0 = input.substr(pos, 5);
	              pos += 5;
	            } else {
	              result0 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"TODAY\"");
	              }
	            }
	            if (result0 !== null) {
	              result0 = (function(offset) {
	                var now = new Date();
	            
	                now.setHours(0);
	                now.setMinutes(0);
	                now.setSeconds(0);
	                now.setMilliseconds(0);
	            
	                return now;
	              })(pos0);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	            if (result0 === null) {
	              pos0 = pos;
	              if (input.substr(pos, 8).toLowerCase() === "tomorrow") {
	                result0 = input.substr(pos, 8);
	                pos += 8;
	              } else {
	                result0 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"TOMORROW\"");
	                }
	              }
	              if (result0 !== null) {
	                result0 = (function(offset) {
	                  var now = new Date();
	              
	                  now.setDate(now.getDate() + 1);
	              
	                  return now;
	                })(pos0);
	              }
	              if (result0 === null) {
	                pos = pos0;
	              }
	              if (result0 === null) {
	                pos0 = pos;
	                if (input.substr(pos, 9).toLowerCase() === "yesterday") {
	                  result0 = input.substr(pos, 9);
	                  pos += 9;
	                } else {
	                  result0 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"YESTERDAY\"");
	                  }
	                }
	                if (result0 !== null) {
	                  result0 = (function(offset) {
	                    var now = new Date();
	                
	                    now.setDate(now.getDate() - 1);
	                
	                    return now;
	                  })(pos0);
	                }
	                if (result0 === null) {
	                  pos = pos0;
	                }
	                if (result0 === null) {
	                  pos0 = pos;
	                  pos1 = pos;
	                  result0 = parse_year_number();
	                  if (result0 !== null) {
	                    if (/^[\-]/.test(input.charAt(pos))) {
	                      result1 = input.charAt(pos);
	                      pos++;
	                    } else {
	                      result1 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("[\\-]");
	                      }
	                    }
	                    if (result1 !== null) {
	                      result2 = parse_int1_2digit();
	                      if (result2 !== null) {
	                        if (/^[\-]/.test(input.charAt(pos))) {
	                          result3 = input.charAt(pos);
	                          pos++;
	                        } else {
	                          result3 = null;
	                          if (reportFailures === 0) {
	                            matchFailed("[\\-]");
	                          }
	                        }
	                        if (result3 !== null) {
	                          result4 = parse_int1_2digit();
	                          if (result4 !== null) {
	                            result0 = [result0, result1, result2, result3, result4];
	                          } else {
	                            result0 = null;
	                            pos = pos1;
	                          }
	                        } else {
	                          result0 = null;
	                          pos = pos1;
	                        }
	                      } else {
	                        result0 = null;
	                        pos = pos1;
	                      }
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                  if (result0 !== null) {
	                    result0 = (function(offset, year, month, date) {
	                      return new Date(year, month - 1, date);
	                    })(pos0, result0[0], result0[2], result0[4]);
	                  }
	                  if (result0 === null) {
	                    pos = pos0;
	                  }
	                  if (result0 === null) {
	                    pos0 = pos;
	                    pos1 = pos;
	                    result0 = parse_int1_2digit();
	                    if (result0 !== null) {
	                      if (/^[.]/.test(input.charAt(pos))) {
	                        result1 = input.charAt(pos);
	                        pos++;
	                      } else {
	                        result1 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("[.]");
	                        }
	                      }
	                      if (result1 !== null) {
	                        result2 = parse_int1_2digit();
	                        if (result2 !== null) {
	                          if (/^[.]/.test(input.charAt(pos))) {
	                            result3 = input.charAt(pos);
	                            pos++;
	                          } else {
	                            result3 = null;
	                            if (reportFailures === 0) {
	                              matchFailed("[.]");
	                            }
	                          }
	                          if (result3 !== null) {
	                            result4 = parse_year_number();
	                            if (result4 !== null) {
	                              result0 = [result0, result1, result2, result3, result4];
	                            } else {
	                              result0 = null;
	                              pos = pos1;
	                            }
	                          } else {
	                            result0 = null;
	                            pos = pos1;
	                          }
	                        } else {
	                          result0 = null;
	                          pos = pos1;
	                        }
	                      } else {
	                        result0 = null;
	                        pos = pos1;
	                      }
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                    if (result0 !== null) {
	                      result0 = (function(offset, date, month, year) {
	                        return new Date(year, month - 1, date);
	                      })(pos0, result0[0], result0[2], result0[4]);
	                    }
	                    if (result0 === null) {
	                      pos = pos0;
	                    }
	                    if (result0 === null) {
	                      pos0 = pos;
	                      pos1 = pos;
	                      result0 = parse_int1_2digit();
	                      if (result0 !== null) {
	                        result1 = parse__();
	                        if (result1 !== null) {
	                          result2 = parse_month_name();
	                          if (result2 !== null) {
	                            pos2 = pos;
	                            result3 = parse__();
	                            if (result3 !== null) {
	                              result4 = parse_year_number();
	                              if (result4 !== null) {
	                                result3 = [result3, result4];
	                              } else {
	                                result3 = null;
	                                pos = pos2;
	                              }
	                            } else {
	                              result3 = null;
	                              pos = pos2;
	                            }
	                            result3 = result3 !== null ? result3 : "";
	                            if (result3 !== null) {
	                              result0 = [result0, result1, result2, result3];
	                            } else {
	                              result0 = null;
	                              pos = pos1;
	                            }
	                          } else {
	                            result0 = null;
	                            pos = pos1;
	                          }
	                        } else {
	                          result0 = null;
	                          pos = pos1;
	                        }
	                      } else {
	                        result0 = null;
	                        pos = pos1;
	                      }
	                      if (result0 !== null) {
	                        result0 = (function(offset, date, month, tail) {
	                          var now = null;
	                      
	                          if (typeof(tail) === 'object') {
	                            now = new Date(tail[1], month, date);
	                          }
	                          else {
	                            now = new Date(new Date().getFullYear(), month, date);
	                          }
	                      
	                          return now;
	                        })(pos0, result0[0], result0[2], result0[3]);
	                      }
	                      if (result0 === null) {
	                        pos = pos0;
	                      }
	                      if (result0 === null) {
	                        pos0 = pos;
	                        pos1 = pos;
	                        result0 = parse_int1_2digit();
	                        if (result0 !== null) {
	                          if (input.charCodeAt(pos) === 47) {
	                            result1 = "/";
	                            pos++;
	                          } else {
	                            result1 = null;
	                            if (reportFailures === 0) {
	                              matchFailed("\"/\"");
	                            }
	                          }
	                          if (result1 !== null) {
	                            result2 = parse_int1_2digit();
	                            if (result2 !== null) {
	                              if (input.charCodeAt(pos) === 47) {
	                                result3 = "/";
	                                pos++;
	                              } else {
	                                result3 = null;
	                                if (reportFailures === 0) {
	                                  matchFailed("\"/\"");
	                                }
	                              }
	                              if (result3 !== null) {
	                                result4 = parse_year_number();
	                                if (result4 !== null) {
	                                  result0 = [result0, result1, result2, result3, result4];
	                                } else {
	                                  result0 = null;
	                                  pos = pos1;
	                                }
	                              } else {
	                                result0 = null;
	                                pos = pos1;
	                              }
	                            } else {
	                              result0 = null;
	                              pos = pos1;
	                            }
	                          } else {
	                            result0 = null;
	                            pos = pos1;
	                          }
	                        } else {
	                          result0 = null;
	                          pos = pos1;
	                        }
	                        if (result0 !== null) {
	                          result0 = (function(offset, month, date, year) {
	                            return new Date(year, month - 1, date);
	                          })(pos0, result0[0], result0[2], result0[4]);
	                        }
	                        if (result0 === null) {
	                          pos = pos0;
	                        }
	                        if (result0 === null) {
	                          result0 = parse_concatenated_date();
	                          if (result0 === null) {
	                            pos0 = pos;
	                            pos1 = pos;
	                            if (input.substr(pos, 4).toLowerCase() === "next") {
	                              result0 = input.substr(pos, 4);
	                              pos += 4;
	                            } else {
	                              result0 = null;
	                              if (reportFailures === 0) {
	                                matchFailed("\"NEXT\"");
	                              }
	                            }
	                            if (result0 !== null) {
	                              pos2 = pos;
	                              result1 = parse__();
	                              if (result1 !== null) {
	                                result2 = parse_integer();
	                                if (result2 !== null) {
	                                  result1 = [result1, result2];
	                                } else {
	                                  result1 = null;
	                                  pos = pos2;
	                                }
	                              } else {
	                                result1 = null;
	                                pos = pos2;
	                              }
	                              result1 = result1 !== null ? result1 : "";
	                              if (result1 !== null) {
	                                result2 = parse__();
	                                if (result2 !== null) {
	                                  result3 = parse_inc_dec_period();
	                                  if (result3 !== null) {
	                                    result0 = [result0, result1, result2, result3];
	                                  } else {
	                                    result0 = null;
	                                    pos = pos1;
	                                  }
	                                } else {
	                                  result0 = null;
	                                  pos = pos1;
	                                }
	                              } else {
	                                result0 = null;
	                                pos = pos1;
	                              }
	                            } else {
	                              result0 = null;
	                              pos = pos1;
	                            }
	                            if (result0 !== null) {
	                              result0 = (function(offset, c, amount) {
	                                var now = new Date();
	                                var count = 1;
	                            
	                                if (typeof(c) === 'object') {
	                                  count = c[1];
	                                }
	                            
	                                now.setFullYear(now.getFullYear() + (amount.y * count));
	                                now.setMonth(now.getMonth() + (amount.m * count));
	                                now.setDate(now.getDate() + (amount.d * count));
	                                now.setHours(now.getHours() + (amount.h * count));
	                                now.setMinutes(now.getMinutes() + (amount.i * count));
	                            
	                                return now;
	                              })(pos0, result0[1], result0[3]);
	                            }
	                            if (result0 === null) {
	                              pos = pos0;
	                            }
	                            if (result0 === null) {
	                              pos0 = pos;
	                              pos1 = pos;
	                              if (input.substr(pos, 4).toLowerCase() === "next") {
	                                result0 = input.substr(pos, 4);
	                                pos += 4;
	                              } else {
	                                result0 = null;
	                                if (reportFailures === 0) {
	                                  matchFailed("\"NEXT\"");
	                                }
	                              }
	                              if (result0 !== null) {
	                                result1 = parse__();
	                                if (result1 !== null) {
	                                  result2 = parse_day_of_week();
	                                  if (result2 !== null) {
	                                    result0 = [result0, result1, result2];
	                                  } else {
	                                    result0 = null;
	                                    pos = pos1;
	                                  }
	                                } else {
	                                  result0 = null;
	                                  pos = pos1;
	                                }
	                              } else {
	                                result0 = null;
	                                pos = pos1;
	                              }
	                              if (result0 !== null) {
	                                result0 = (function(offset, day) {
	                                  var now = new Date();
	                              
	                                  now.setDate(now.getDate() + (day - now.getDay()) + 7);
	                              
	                                  return now;
	                                })(pos0, result0[2]);
	                              }
	                              if (result0 === null) {
	                                pos = pos0;
	                              }
	                              if (result0 === null) {
	                                pos0 = pos;
	                                pos1 = pos;
	                                if (input.substr(pos, 4).toLowerCase() === "last") {
	                                  result0 = input.substr(pos, 4);
	                                  pos += 4;
	                                } else {
	                                  result0 = null;
	                                  if (reportFailures === 0) {
	                                    matchFailed("\"LAST\"");
	                                  }
	                                }
	                                if (result0 !== null) {
	                                  pos2 = pos;
	                                  result1 = parse__();
	                                  if (result1 !== null) {
	                                    result2 = parse_integer();
	                                    if (result2 !== null) {
	                                      result1 = [result1, result2];
	                                    } else {
	                                      result1 = null;
	                                      pos = pos2;
	                                    }
	                                  } else {
	                                    result1 = null;
	                                    pos = pos2;
	                                  }
	                                  result1 = result1 !== null ? result1 : "";
	                                  if (result1 !== null) {
	                                    result2 = parse__();
	                                    if (result2 !== null) {
	                                      result3 = parse_inc_dec_period();
	                                      if (result3 !== null) {
	                                        result0 = [result0, result1, result2, result3];
	                                      } else {
	                                        result0 = null;
	                                        pos = pos1;
	                                      }
	                                    } else {
	                                      result0 = null;
	                                      pos = pos1;
	                                    }
	                                  } else {
	                                    result0 = null;
	                                    pos = pos1;
	                                  }
	                                } else {
	                                  result0 = null;
	                                  pos = pos1;
	                                }
	                                if (result0 !== null) {
	                                  result0 = (function(offset, c, amount) {
	                                    var now = new Date();
	                                    var count = 1;
	                                
	                                    if (typeof(c) === 'object') {
	                                      count = c[1];
	                                    }
	                                
	                                    now.setFullYear(now.getFullYear() + (amount.y * -count));
	                                    now.setMonth(now.getMonth() + (amount.m * -count));
	                                    now.setDate(now.getDate() + (amount.d * -count));
	                                    now.setHours(now.getHours() + (amount.h * -count));
	                                    now.setMinutes(now.getMinutes() + (amount.i * -count));
	                                
	                                    return now;
	                                  })(pos0, result0[1], result0[3]);
	                                }
	                                if (result0 === null) {
	                                  pos = pos0;
	                                }
	                                if (result0 === null) {
	                                  pos0 = pos;
	                                  pos1 = pos;
	                                  if (input.substr(pos, 4).toLowerCase() === "last") {
	                                    result0 = input.substr(pos, 4);
	                                    pos += 4;
	                                  } else {
	                                    result0 = null;
	                                    if (reportFailures === 0) {
	                                      matchFailed("\"LAST\"");
	                                    }
	                                  }
	                                  if (result0 !== null) {
	                                    result1 = parse__();
	                                    if (result1 !== null) {
	                                      result2 = parse_day_of_week();
	                                      if (result2 !== null) {
	                                        result0 = [result0, result1, result2];
	                                      } else {
	                                        result0 = null;
	                                        pos = pos1;
	                                      }
	                                    } else {
	                                      result0 = null;
	                                      pos = pos1;
	                                    }
	                                  } else {
	                                    result0 = null;
	                                    pos = pos1;
	                                  }
	                                  if (result0 !== null) {
	                                    result0 = (function(offset, day) {
	                                      var now = new Date();
	                                  
	                                      if (now.getDay() === day) {
	                                        now.setDate(now.getDate() - 7);
	                                      }
	                                  
	                                      now.setDate(now.getDate() + (day - now.getDay()));
	                                  
	                                      return now;
	                                    })(pos0, result0[2]);
	                                  }
	                                  if (result0 === null) {
	                                    pos = pos0;
	                                  }
	                                }
	                              }
	                            }
	                          }
	                        }
	                      }
	                    }
	                  }
	                }
	              }
	            }
	          }
	        }
	        return result0;
	      }
	      
	      function parse_concatenated_date() {
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        result0 = parse_str5_8digit();
	        if (result0 !== null) {
	          result0 = (function(offset, digits) {
	            var year = 0;
	            var month = 0;
	            var day = 0;
	        
	            if (digits.length === 5 || digits.length === 6) { /* YearMonth */
	              year = parseInt(digits.slice(0, 4), 10);
	              month = parseInt(digits.slice(4), 10) - 1;
	            }
	            else if (digits.length === 7 || digits.length === 8) { /* YearMonthDay */
	              year = parseInt(digits.slice(0, 4), 10);
	              month = parseInt(digits.slice(4, 6), 10) - 1;
	              day = parseInt(digits.slice(6), 10);
	            }
	        
	            return new Date(year, month, day);
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_month_name() {
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 3).toLowerCase() === "jan") {
	          result0 = input.substr(pos, 3);
	          pos += 3;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"JAN\"");
	          }
	        }
	        if (result0 !== null) {
	          if (input.substr(pos, 4).toLowerCase() === "uary") {
	            result1 = input.substr(pos, 4);
	            pos += 4;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"UARY\"");
	            }
	          }
	          result1 = result1 !== null ? result1 : "";
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return 0; })(pos0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          if (input.substr(pos, 3).toLowerCase() === "feb") {
	            result0 = input.substr(pos, 3);
	            pos += 3;
	          } else {
	            result0 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"FEB\"");
	            }
	          }
	          if (result0 !== null) {
	            if (input.substr(pos, 5).toLowerCase() === "ruary") {
	              result1 = input.substr(pos, 5);
	              pos += 5;
	            } else {
	              result1 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"RUARY\"");
	              }
	            }
	            result1 = result1 !== null ? result1 : "";
	            if (result1 !== null) {
	              result0 = [result0, result1];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset) { return 1; })(pos0);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            pos1 = pos;
	            if (input.substr(pos, 3).toLowerCase() === "mar") {
	              result0 = input.substr(pos, 3);
	              pos += 3;
	            } else {
	              result0 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"MAR\"");
	              }
	            }
	            if (result0 !== null) {
	              if (input.substr(pos, 2).toLowerCase() === "ch") {
	                result1 = input.substr(pos, 2);
	                pos += 2;
	              } else {
	                result1 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"CH\"");
	                }
	              }
	              result1 = result1 !== null ? result1 : "";
	              if (result1 !== null) {
	                result0 = [result0, result1];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	            if (result0 !== null) {
	              result0 = (function(offset) { return 2; })(pos0);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	            if (result0 === null) {
	              pos0 = pos;
	              pos1 = pos;
	              if (input.substr(pos, 3).toLowerCase() === "apr") {
	                result0 = input.substr(pos, 3);
	                pos += 3;
	              } else {
	                result0 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"APR\"");
	                }
	              }
	              if (result0 !== null) {
	                if (input.substr(pos, 2).toLowerCase() === "il") {
	                  result1 = input.substr(pos, 2);
	                  pos += 2;
	                } else {
	                  result1 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"IL\"");
	                  }
	                }
	                result1 = result1 !== null ? result1 : "";
	                if (result1 !== null) {
	                  result0 = [result0, result1];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	              if (result0 !== null) {
	                result0 = (function(offset) { return 3; })(pos0);
	              }
	              if (result0 === null) {
	                pos = pos0;
	              }
	              if (result0 === null) {
	                pos0 = pos;
	                if (input.substr(pos, 3).toLowerCase() === "may") {
	                  result0 = input.substr(pos, 3);
	                  pos += 3;
	                } else {
	                  result0 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"MAY\"");
	                  }
	                }
	                if (result0 !== null) {
	                  result0 = (function(offset) { return 4; })(pos0);
	                }
	                if (result0 === null) {
	                  pos = pos0;
	                }
	                if (result0 === null) {
	                  pos0 = pos;
	                  pos1 = pos;
	                  if (input.substr(pos, 3).toLowerCase() === "jun") {
	                    result0 = input.substr(pos, 3);
	                    pos += 3;
	                  } else {
	                    result0 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("\"JUN\"");
	                    }
	                  }
	                  if (result0 !== null) {
	                    if (input.substr(pos, 1).toLowerCase() === "e") {
	                      result1 = input.substr(pos, 1);
	                      pos++;
	                    } else {
	                      result1 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("\"E\"");
	                      }
	                    }
	                    result1 = result1 !== null ? result1 : "";
	                    if (result1 !== null) {
	                      result0 = [result0, result1];
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                  if (result0 !== null) {
	                    result0 = (function(offset) { return 5; })(pos0);
	                  }
	                  if (result0 === null) {
	                    pos = pos0;
	                  }
	                  if (result0 === null) {
	                    pos0 = pos;
	                    pos1 = pos;
	                    if (input.substr(pos, 3).toLowerCase() === "jul") {
	                      result0 = input.substr(pos, 3);
	                      pos += 3;
	                    } else {
	                      result0 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("\"JUL\"");
	                      }
	                    }
	                    if (result0 !== null) {
	                      if (input.substr(pos, 1).toLowerCase() === "y") {
	                        result1 = input.substr(pos, 1);
	                        pos++;
	                      } else {
	                        result1 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("\"Y\"");
	                        }
	                      }
	                      result1 = result1 !== null ? result1 : "";
	                      if (result1 !== null) {
	                        result0 = [result0, result1];
	                      } else {
	                        result0 = null;
	                        pos = pos1;
	                      }
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                    if (result0 !== null) {
	                      result0 = (function(offset) { return 6; })(pos0);
	                    }
	                    if (result0 === null) {
	                      pos = pos0;
	                    }
	                    if (result0 === null) {
	                      pos0 = pos;
	                      pos1 = pos;
	                      if (input.substr(pos, 3).toLowerCase() === "aug") {
	                        result0 = input.substr(pos, 3);
	                        pos += 3;
	                      } else {
	                        result0 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("\"AUG\"");
	                        }
	                      }
	                      if (result0 !== null) {
	                        if (input.substr(pos, 3).toLowerCase() === "ust") {
	                          result1 = input.substr(pos, 3);
	                          pos += 3;
	                        } else {
	                          result1 = null;
	                          if (reportFailures === 0) {
	                            matchFailed("\"UST\"");
	                          }
	                        }
	                        result1 = result1 !== null ? result1 : "";
	                        if (result1 !== null) {
	                          result0 = [result0, result1];
	                        } else {
	                          result0 = null;
	                          pos = pos1;
	                        }
	                      } else {
	                        result0 = null;
	                        pos = pos1;
	                      }
	                      if (result0 !== null) {
	                        result0 = (function(offset) { return 7; })(pos0);
	                      }
	                      if (result0 === null) {
	                        pos = pos0;
	                      }
	                      if (result0 === null) {
	                        pos0 = pos;
	                        pos1 = pos;
	                        if (input.substr(pos, 3).toLowerCase() === "sep") {
	                          result0 = input.substr(pos, 3);
	                          pos += 3;
	                        } else {
	                          result0 = null;
	                          if (reportFailures === 0) {
	                            matchFailed("\"SEP\"");
	                          }
	                        }
	                        if (result0 !== null) {
	                          if (input.substr(pos, 6).toLowerCase() === "tember") {
	                            result1 = input.substr(pos, 6);
	                            pos += 6;
	                          } else {
	                            result1 = null;
	                            if (reportFailures === 0) {
	                              matchFailed("\"TEMBER\"");
	                            }
	                          }
	                          result1 = result1 !== null ? result1 : "";
	                          if (result1 !== null) {
	                            result0 = [result0, result1];
	                          } else {
	                            result0 = null;
	                            pos = pos1;
	                          }
	                        } else {
	                          result0 = null;
	                          pos = pos1;
	                        }
	                        if (result0 !== null) {
	                          result0 = (function(offset) { return 8; })(pos0);
	                        }
	                        if (result0 === null) {
	                          pos = pos0;
	                        }
	                        if (result0 === null) {
	                          pos0 = pos;
	                          pos1 = pos;
	                          if (input.substr(pos, 3).toLowerCase() === "oct") {
	                            result0 = input.substr(pos, 3);
	                            pos += 3;
	                          } else {
	                            result0 = null;
	                            if (reportFailures === 0) {
	                              matchFailed("\"OCT\"");
	                            }
	                          }
	                          if (result0 !== null) {
	                            if (input.substr(pos, 4).toLowerCase() === "ober") {
	                              result1 = input.substr(pos, 4);
	                              pos += 4;
	                            } else {
	                              result1 = null;
	                              if (reportFailures === 0) {
	                                matchFailed("\"OBER\"");
	                              }
	                            }
	                            result1 = result1 !== null ? result1 : "";
	                            if (result1 !== null) {
	                              result0 = [result0, result1];
	                            } else {
	                              result0 = null;
	                              pos = pos1;
	                            }
	                          } else {
	                            result0 = null;
	                            pos = pos1;
	                          }
	                          if (result0 !== null) {
	                            result0 = (function(offset) { return 9; })(pos0);
	                          }
	                          if (result0 === null) {
	                            pos = pos0;
	                          }
	                          if (result0 === null) {
	                            pos0 = pos;
	                            pos1 = pos;
	                            if (input.substr(pos, 3).toLowerCase() === "nov") {
	                              result0 = input.substr(pos, 3);
	                              pos += 3;
	                            } else {
	                              result0 = null;
	                              if (reportFailures === 0) {
	                                matchFailed("\"NOV\"");
	                              }
	                            }
	                            if (result0 !== null) {
	                              if (input.substr(pos, 5).toLowerCase() === "ember") {
	                                result1 = input.substr(pos, 5);
	                                pos += 5;
	                              } else {
	                                result1 = null;
	                                if (reportFailures === 0) {
	                                  matchFailed("\"EMBER\"");
	                                }
	                              }
	                              result1 = result1 !== null ? result1 : "";
	                              if (result1 !== null) {
	                                result0 = [result0, result1];
	                              } else {
	                                result0 = null;
	                                pos = pos1;
	                              }
	                            } else {
	                              result0 = null;
	                              pos = pos1;
	                            }
	                            if (result0 !== null) {
	                              result0 = (function(offset) { return 10; })(pos0);
	                            }
	                            if (result0 === null) {
	                              pos = pos0;
	                            }
	                            if (result0 === null) {
	                              pos0 = pos;
	                              pos1 = pos;
	                              if (input.substr(pos, 3).toLowerCase() === "dec") {
	                                result0 = input.substr(pos, 3);
	                                pos += 3;
	                              } else {
	                                result0 = null;
	                                if (reportFailures === 0) {
	                                  matchFailed("\"DEC\"");
	                                }
	                              }
	                              if (result0 !== null) {
	                                if (input.substr(pos, 5).toLowerCase() === "ember") {
	                                  result1 = input.substr(pos, 5);
	                                  pos += 5;
	                                } else {
	                                  result1 = null;
	                                  if (reportFailures === 0) {
	                                    matchFailed("\"EMBER\"");
	                                  }
	                                }
	                                result1 = result1 !== null ? result1 : "";
	                                if (result1 !== null) {
	                                  result0 = [result0, result1];
	                                } else {
	                                  result0 = null;
	                                  pos = pos1;
	                                }
	                              } else {
	                                result0 = null;
	                                pos = pos1;
	                              }
	                              if (result0 !== null) {
	                                result0 = (function(offset) { return 11; })(pos0);
	                              }
	                              if (result0 === null) {
	                                pos = pos0;
	                              }
	                            }
	                          }
	                        }
	                      }
	                    }
	                  }
	                }
	              }
	            }
	          }
	        }
	        return result0;
	      }
	      
	      function parse_year_number() {
	        var result0;
	        var pos0;
	        
	        pos0 = pos;
	        result0 = parse_int2_or_4digit();
	        if (result0 !== null) {
	          result0 = (function(offset, year) {
	            if (year < 100) {
	              return year + 2000;
	            }
	        
	            return year;
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_day_of_week() {
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 3).toLowerCase() === "sun") {
	          result0 = input.substr(pos, 3);
	          pos += 3;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"SUN\"");
	          }
	        }
	        if (result0 !== null) {
	          if (input.substr(pos, 3).toLowerCase() === "day") {
	            result1 = input.substr(pos, 3);
	            pos += 3;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"DAY\"");
	            }
	          }
	          result1 = result1 !== null ? result1 : "";
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return 0; })(pos0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          if (input.substr(pos, 3).toLowerCase() === "mon") {
	            result0 = input.substr(pos, 3);
	            pos += 3;
	          } else {
	            result0 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"MON\"");
	            }
	          }
	          if (result0 !== null) {
	            if (input.substr(pos, 3).toLowerCase() === "day") {
	              result1 = input.substr(pos, 3);
	              pos += 3;
	            } else {
	              result1 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"DAY\"");
	              }
	            }
	            result1 = result1 !== null ? result1 : "";
	            if (result1 !== null) {
	              result0 = [result0, result1];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset) { return 1; })(pos0);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            pos1 = pos;
	            if (input.substr(pos, 3).toLowerCase() === "tue") {
	              result0 = input.substr(pos, 3);
	              pos += 3;
	            } else {
	              result0 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"TUE\"");
	              }
	            }
	            if (result0 !== null) {
	              if (input.substr(pos, 4).toLowerCase() === "sday") {
	                result1 = input.substr(pos, 4);
	                pos += 4;
	              } else {
	                result1 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"SDAY\"");
	                }
	              }
	              result1 = result1 !== null ? result1 : "";
	              if (result1 !== null) {
	                result0 = [result0, result1];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	            if (result0 !== null) {
	              result0 = (function(offset) { return 2; })(pos0);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	            if (result0 === null) {
	              pos0 = pos;
	              pos1 = pos;
	              if (input.substr(pos, 3).toLowerCase() === "wed") {
	                result0 = input.substr(pos, 3);
	                pos += 3;
	              } else {
	                result0 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"WED\"");
	                }
	              }
	              if (result0 !== null) {
	                if (input.substr(pos, 6).toLowerCase() === "nesday") {
	                  result1 = input.substr(pos, 6);
	                  pos += 6;
	                } else {
	                  result1 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"NESDAY\"");
	                  }
	                }
	                result1 = result1 !== null ? result1 : "";
	                if (result1 !== null) {
	                  result0 = [result0, result1];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	              if (result0 !== null) {
	                result0 = (function(offset) { return 3; })(pos0);
	              }
	              if (result0 === null) {
	                pos = pos0;
	              }
	              if (result0 === null) {
	                pos0 = pos;
	                pos1 = pos;
	                if (input.substr(pos, 3).toLowerCase() === "thu") {
	                  result0 = input.substr(pos, 3);
	                  pos += 3;
	                } else {
	                  result0 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"THU\"");
	                  }
	                }
	                if (result0 !== null) {
	                  if (input.substr(pos, 5).toLowerCase() === "rsday") {
	                    result1 = input.substr(pos, 5);
	                    pos += 5;
	                  } else {
	                    result1 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("\"RSDAY\"");
	                    }
	                  }
	                  result1 = result1 !== null ? result1 : "";
	                  if (result1 !== null) {
	                    result0 = [result0, result1];
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	                if (result0 !== null) {
	                  result0 = (function(offset) { return 4; })(pos0);
	                }
	                if (result0 === null) {
	                  pos = pos0;
	                }
	                if (result0 === null) {
	                  pos0 = pos;
	                  pos1 = pos;
	                  if (input.substr(pos, 3).toLowerCase() === "fri") {
	                    result0 = input.substr(pos, 3);
	                    pos += 3;
	                  } else {
	                    result0 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("\"FRI\"");
	                    }
	                  }
	                  if (result0 !== null) {
	                    if (input.substr(pos, 3).toLowerCase() === "day") {
	                      result1 = input.substr(pos, 3);
	                      pos += 3;
	                    } else {
	                      result1 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("\"DAY\"");
	                      }
	                    }
	                    result1 = result1 !== null ? result1 : "";
	                    if (result1 !== null) {
	                      result0 = [result0, result1];
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                  if (result0 !== null) {
	                    result0 = (function(offset) { return 5; })(pos0);
	                  }
	                  if (result0 === null) {
	                    pos = pos0;
	                  }
	                  if (result0 === null) {
	                    pos0 = pos;
	                    pos1 = pos;
	                    if (input.substr(pos, 3).toLowerCase() === "sat") {
	                      result0 = input.substr(pos, 3);
	                      pos += 3;
	                    } else {
	                      result0 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("\"SAT\"");
	                      }
	                    }
	                    if (result0 !== null) {
	                      if (input.substr(pos, 5).toLowerCase() === "urday") {
	                        result1 = input.substr(pos, 5);
	                        pos += 5;
	                      } else {
	                        result1 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("\"URDAY\"");
	                        }
	                      }
	                      result1 = result1 !== null ? result1 : "";
	                      if (result1 !== null) {
	                        result0 = [result0, result1];
	                      } else {
	                        result0 = null;
	                        pos = pos1;
	                      }
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                    if (result0 !== null) {
	                      result0 = (function(offset) { return 6; })(pos0);
	                    }
	                    if (result0 === null) {
	                      pos = pos0;
	                    }
	                  }
	                }
	              }
	            }
	          }
	        }
	        return result0;
	      }
	      
	      function parse_inc_or_dec() {
	        var result0;
	        
	        result0 = parse_increment();
	        if (result0 === null) {
	          result0 = parse_decrement();
	        }
	        return result0;
	      }
	      
	      function parse_increment() {
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 43) {
	          result0 = "+";
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"+\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_integer();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                result4 = parse_inc_dec_period();
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, count, amount) {
	            return { 'count': count, 'amount': amount };
	          })(pos0, result0[2], result0[4]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_decrement() {
	        var result0, result1, result2, result3, result4;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.charCodeAt(pos) === 45) {
	          result0 = "-";
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"-\"");
	          }
	        }
	        if (result0 !== null) {
	          result1 = parse__();
	          if (result1 !== null) {
	            result2 = parse_integer();
	            if (result2 !== null) {
	              result3 = parse__();
	              if (result3 !== null) {
	                result4 = parse_inc_dec_period();
	                if (result4 !== null) {
	                  result0 = [result0, result1, result2, result3, result4];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, count, amount) {
	            return { 'count': count * -1, 'amount': amount };
	          })(pos0, result0[2], result0[4]);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_inc_dec_period() {
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (input.substr(pos, 6).toLowerCase() === "minute") {
	          result0 = input.substr(pos, 6);
	          pos += 6;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("\"MINUTE\"");
	          }
	        }
	        if (result0 !== null) {
	          if (input.substr(pos, 1).toLowerCase() === "s") {
	            result1 = input.substr(pos, 1);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"S\"");
	            }
	          }
	          result1 = result1 !== null ? result1 : "";
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset) { return {'y': 0, 'm': 0, 'd': 0, 'h': 0, 'i': 1}; })(pos0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        if (result0 === null) {
	          pos0 = pos;
	          pos1 = pos;
	          if (input.substr(pos, 4).toLowerCase() === "hour") {
	            result0 = input.substr(pos, 4);
	            pos += 4;
	          } else {
	            result0 = null;
	            if (reportFailures === 0) {
	              matchFailed("\"HOUR\"");
	            }
	          }
	          if (result0 !== null) {
	            if (input.substr(pos, 1).toLowerCase() === "s") {
	              result1 = input.substr(pos, 1);
	              pos++;
	            } else {
	              result1 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"S\"");
	              }
	            }
	            result1 = result1 !== null ? result1 : "";
	            if (result1 !== null) {
	              result0 = [result0, result1];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	          if (result0 !== null) {
	            result0 = (function(offset) { return {'y': 0, 'm': 0, 'd': 0, 'h': 1, 'i': 0}; })(pos0);
	          }
	          if (result0 === null) {
	            pos = pos0;
	          }
	          if (result0 === null) {
	            pos0 = pos;
	            pos1 = pos;
	            if (input.substr(pos, 3).toLowerCase() === "day") {
	              result0 = input.substr(pos, 3);
	              pos += 3;
	            } else {
	              result0 = null;
	              if (reportFailures === 0) {
	                matchFailed("\"DAY\"");
	              }
	            }
	            if (result0 !== null) {
	              if (input.substr(pos, 1).toLowerCase() === "s") {
	                result1 = input.substr(pos, 1);
	                pos++;
	              } else {
	                result1 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"S\"");
	                }
	              }
	              result1 = result1 !== null ? result1 : "";
	              if (result1 !== null) {
	                result0 = [result0, result1];
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	            if (result0 !== null) {
	              result0 = (function(offset) { return {'y': 0, 'm': 0, 'd': 1, 'h': 0, 'i': 0}; })(pos0);
	            }
	            if (result0 === null) {
	              pos = pos0;
	            }
	            if (result0 === null) {
	              pos0 = pos;
	              pos1 = pos;
	              if (input.substr(pos, 4).toLowerCase() === "week") {
	                result0 = input.substr(pos, 4);
	                pos += 4;
	              } else {
	                result0 = null;
	                if (reportFailures === 0) {
	                  matchFailed("\"WEEK\"");
	                }
	              }
	              if (result0 !== null) {
	                if (input.substr(pos, 1).toLowerCase() === "s") {
	                  result1 = input.substr(pos, 1);
	                  pos++;
	                } else {
	                  result1 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"S\"");
	                  }
	                }
	                result1 = result1 !== null ? result1 : "";
	                if (result1 !== null) {
	                  result0 = [result0, result1];
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	              if (result0 !== null) {
	                result0 = (function(offset) { return {'y': 0, 'm': 0, 'd': 7, 'h': 0, 'i': 0}; })(pos0);
	              }
	              if (result0 === null) {
	                pos = pos0;
	              }
	              if (result0 === null) {
	                pos0 = pos;
	                pos1 = pos;
	                if (input.substr(pos, 5).toLowerCase() === "month") {
	                  result0 = input.substr(pos, 5);
	                  pos += 5;
	                } else {
	                  result0 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("\"MONTH\"");
	                  }
	                }
	                if (result0 !== null) {
	                  if (input.substr(pos, 1).toLowerCase() === "s") {
	                    result1 = input.substr(pos, 1);
	                    pos++;
	                  } else {
	                    result1 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("\"S\"");
	                    }
	                  }
	                  result1 = result1 !== null ? result1 : "";
	                  if (result1 !== null) {
	                    result0 = [result0, result1];
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	                if (result0 !== null) {
	                  result0 = (function(offset) { return {'y': 0, 'm': 1, 'd': 0, 'h': 0, 'i': 0}; })(pos0);
	                }
	                if (result0 === null) {
	                  pos = pos0;
	                }
	                if (result0 === null) {
	                  pos0 = pos;
	                  pos1 = pos;
	                  if (input.substr(pos, 4).toLowerCase() === "year") {
	                    result0 = input.substr(pos, 4);
	                    pos += 4;
	                  } else {
	                    result0 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("\"YEAR\"");
	                    }
	                  }
	                  if (result0 !== null) {
	                    if (input.substr(pos, 1).toLowerCase() === "s") {
	                      result1 = input.substr(pos, 1);
	                      pos++;
	                    } else {
	                      result1 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("\"S\"");
	                      }
	                    }
	                    result1 = result1 !== null ? result1 : "";
	                    if (result1 !== null) {
	                      result0 = [result0, result1];
	                    } else {
	                      result0 = null;
	                      pos = pos1;
	                    }
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                  if (result0 !== null) {
	                    result0 = (function(offset) { return {'y': 1, 'm': 0, 'd': 0, 'h': 0, 'i': 0}; })(pos0);
	                  }
	                  if (result0 === null) {
	                    pos = pos0;
	                  }
	                }
	              }
	            }
	          }
	        }
	        return result0;
	      }
	      
	      function parse_int1_2digit() {
	        var result0, result1;
	        var pos0, pos1;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (/^[0-9]/.test(input.charAt(pos))) {
	          result0 = input.charAt(pos);
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("[0-9]");
	          }
	        }
	        if (result0 !== null) {
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[0-9]");
	            }
	          }
	          result1 = result1 !== null ? result1 : "";
	          if (result1 !== null) {
	            result0 = [result0, result1];
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, digits) {
	            return parseInt(digits.join(''), 10);
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_int2_or_4digit() {
	        var result0, result1, result2, result3;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (/^[0-9]/.test(input.charAt(pos))) {
	          result0 = input.charAt(pos);
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("[0-9]");
	          }
	        }
	        if (result0 !== null) {
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[0-9]");
	            }
	          }
	          if (result1 !== null) {
	            pos2 = pos;
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result2 = input.charAt(pos);
	              pos++;
	            } else {
	              result2 = null;
	              if (reportFailures === 0) {
	                matchFailed("[0-9]");
	              }
	            }
	            if (result2 !== null) {
	              if (/^[0-9]/.test(input.charAt(pos))) {
	                result3 = input.charAt(pos);
	                pos++;
	              } else {
	                result3 = null;
	                if (reportFailures === 0) {
	                  matchFailed("[0-9]");
	                }
	              }
	              if (result3 !== null) {
	                result2 = [result2, result3];
	              } else {
	                result2 = null;
	                pos = pos2;
	              }
	            } else {
	              result2 = null;
	              pos = pos2;
	            }
	            result2 = result2 !== null ? result2 : "";
	            if (result2 !== null) {
	              result0 = [result0, result1, result2];
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, digits) {
	            var value = digits.slice(0, 2).join('');
	        
	            if (typeof(digits[2]) === 'object') {
	              value += digits[2].join('');
	            }
	        
	            return parseInt(value, 10);
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_str5_8digit() {
	        var result0, result1, result2, result3, result4, result5, result6, result7;
	        var pos0, pos1, pos2;
	        
	        pos0 = pos;
	        pos1 = pos;
	        if (/^[0-9]/.test(input.charAt(pos))) {
	          result0 = input.charAt(pos);
	          pos++;
	        } else {
	          result0 = null;
	          if (reportFailures === 0) {
	            matchFailed("[0-9]");
	          }
	        }
	        if (result0 !== null) {
	          if (/^[0-9]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[0-9]");
	            }
	          }
	          if (result1 !== null) {
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result2 = input.charAt(pos);
	              pos++;
	            } else {
	              result2 = null;
	              if (reportFailures === 0) {
	                matchFailed("[0-9]");
	              }
	            }
	            if (result2 !== null) {
	              if (/^[0-9]/.test(input.charAt(pos))) {
	                result3 = input.charAt(pos);
	                pos++;
	              } else {
	                result3 = null;
	                if (reportFailures === 0) {
	                  matchFailed("[0-9]");
	                }
	              }
	              if (result3 !== null) {
	                if (/^[0-9]/.test(input.charAt(pos))) {
	                  result4 = input.charAt(pos);
	                  pos++;
	                } else {
	                  result4 = null;
	                  if (reportFailures === 0) {
	                    matchFailed("[0-9]");
	                  }
	                }
	                if (result4 !== null) {
	                  pos2 = pos;
	                  if (/^[0-9]/.test(input.charAt(pos))) {
	                    result5 = input.charAt(pos);
	                    pos++;
	                  } else {
	                    result5 = null;
	                    if (reportFailures === 0) {
	                      matchFailed("[0-9]");
	                    }
	                  }
	                  if (result5 !== null) {
	                    if (/^[0-9]/.test(input.charAt(pos))) {
	                      result6 = input.charAt(pos);
	                      pos++;
	                    } else {
	                      result6 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("[0-9]");
	                      }
	                    }
	                    if (result6 !== null) {
	                      if (/^[0-9]/.test(input.charAt(pos))) {
	                        result7 = input.charAt(pos);
	                        pos++;
	                      } else {
	                        result7 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("[0-9]");
	                        }
	                      }
	                      if (result7 !== null) {
	                        result5 = [result5, result6, result7];
	                      } else {
	                        result5 = null;
	                        pos = pos2;
	                      }
	                    } else {
	                      result5 = null;
	                      pos = pos2;
	                    }
	                  } else {
	                    result5 = null;
	                    pos = pos2;
	                  }
	                  if (result5 === null) {
	                    pos2 = pos;
	                    if (/^[0-9]/.test(input.charAt(pos))) {
	                      result5 = input.charAt(pos);
	                      pos++;
	                    } else {
	                      result5 = null;
	                      if (reportFailures === 0) {
	                        matchFailed("[0-9]");
	                      }
	                    }
	                    if (result5 !== null) {
	                      if (/^[0-9]/.test(input.charAt(pos))) {
	                        result6 = input.charAt(pos);
	                        pos++;
	                      } else {
	                        result6 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("[0-9]");
	                        }
	                      }
	                      if (result6 !== null) {
	                        result5 = [result5, result6];
	                      } else {
	                        result5 = null;
	                        pos = pos2;
	                      }
	                    } else {
	                      result5 = null;
	                      pos = pos2;
	                    }
	                    if (result5 === null) {
	                      if (/^[0-9]/.test(input.charAt(pos))) {
	                        result5 = input.charAt(pos);
	                        pos++;
	                      } else {
	                        result5 = null;
	                        if (reportFailures === 0) {
	                          matchFailed("[0-9]");
	                        }
	                      }
	                    }
	                  }
	                  result5 = result5 !== null ? result5 : "";
	                  if (result5 !== null) {
	                    result0 = [result0, result1, result2, result3, result4, result5];
	                  } else {
	                    result0 = null;
	                    pos = pos1;
	                  }
	                } else {
	                  result0 = null;
	                  pos = pos1;
	                }
	              } else {
	                result0 = null;
	                pos = pos1;
	              }
	            } else {
	              result0 = null;
	              pos = pos1;
	            }
	          } else {
	            result0 = null;
	            pos = pos1;
	          }
	        } else {
	          result0 = null;
	          pos = pos1;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, digits) {
	            var value = digits.slice(0, 5).join('');
	        
	            if (typeof(digits[5]) === 'object') {
	              value += digits[5].join('');
	            }
	            else {
	              value += digits[5];
	            }
	        
	            return value;
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse_integer() {
	        var result0, result1;
	        var pos0;
	        
	        pos0 = pos;
	        if (/^[0-9]/.test(input.charAt(pos))) {
	          result1 = input.charAt(pos);
	          pos++;
	        } else {
	          result1 = null;
	          if (reportFailures === 0) {
	            matchFailed("[0-9]");
	          }
	        }
	        if (result1 !== null) {
	          result0 = [];
	          while (result1 !== null) {
	            result0.push(result1);
	            if (/^[0-9]/.test(input.charAt(pos))) {
	              result1 = input.charAt(pos);
	              pos++;
	            } else {
	              result1 = null;
	              if (reportFailures === 0) {
	                matchFailed("[0-9]");
	              }
	            }
	          }
	        } else {
	          result0 = null;
	        }
	        if (result0 !== null) {
	          result0 = (function(offset, digits) {
	            return parseInt(digits.join(''), 10);
	          })(pos0, result0);
	        }
	        if (result0 === null) {
	          pos = pos0;
	        }
	        return result0;
	      }
	      
	      function parse__() {
	        var result0, result1;
	        
	        result0 = [];
	        if (/^[\t\n\r _]/.test(input.charAt(pos))) {
	          result1 = input.charAt(pos);
	          pos++;
	        } else {
	          result1 = null;
	          if (reportFailures === 0) {
	            matchFailed("[\\t\\n\\r _]");
	          }
	        }
	        while (result1 !== null) {
	          result0.push(result1);
	          if (/^[\t\n\r _]/.test(input.charAt(pos))) {
	            result1 = input.charAt(pos);
	            pos++;
	          } else {
	            result1 = null;
	            if (reportFailures === 0) {
	              matchFailed("[\\t\\n\\r _]");
	            }
	          }
	        }
	        return result0;
	      }
	      
	      
	      function cleanupExpected(expected) {
	        expected.sort();
	        
	        var lastExpected = null;
	        var cleanExpected = [];
	        for (var i = 0; i < expected.length; i++) {
	          if (expected[i] !== lastExpected) {
	            cleanExpected.push(expected[i]);
	            lastExpected = expected[i];
	          }
	        }
	        return cleanExpected;
	      }
	      
	      function computeErrorPosition() {
	        /*
	         * The first idea was to use |String.split| to break the input up to the
	         * error position along newlines and derive the line and column from
	         * there. However IE's |split| implementation is so broken that it was
	         * enough to prevent it.
	         */
	        
	        var line = 1;
	        var column = 1;
	        var seenCR = false;
	        
	        for (var i = 0; i < Math.max(pos, rightmostFailuresPos); i++) {
	          var ch = input.charAt(i);
	          if (ch === "\n") {
	            if (!seenCR) { line++; }
	            column = 1;
	            seenCR = false;
	          } else if (ch === "\r" || ch === "\u2028" || ch === "\u2029") {
	            line++;
	            column = 1;
	            seenCR = true;
	          } else {
	            column++;
	            seenCR = false;
	          }
	        }
	        
	        return { line: line, column: column };
	      }
	      
	      
	      var result = parseFunctions[startRule]();
	      
	      /*
	       * The parser is now in one of the following three states:
	       *
	       * 1. The parser successfully parsed the whole input.
	       *
	       *    - |result !== null|
	       *    - |pos === input.length|
	       *    - |rightmostFailuresExpected| may or may not contain something
	       *
	       * 2. The parser successfully parsed only a part of the input.
	       *
	       *    - |result !== null|
	       *    - |pos < input.length|
	       *    - |rightmostFailuresExpected| may or may not contain something
	       *
	       * 3. The parser did not successfully parse any part of the input.
	       *
	       *   - |result === null|
	       *   - |pos === 0|
	       *   - |rightmostFailuresExpected| contains at least one failure
	       *
	       * All code following this comment (including called functions) must
	       * handle these states.
	       */
	      if (result === null || pos !== input.length) {
	        var offset = Math.max(pos, rightmostFailuresPos);
	        var found = offset < input.length ? input.charAt(offset) : null;
	        var errorPosition = computeErrorPosition();
	        
	        throw new this.SyntaxError(
	          cleanupExpected(rightmostFailuresExpected),
	          found,
	          offset,
	          errorPosition.line,
	          errorPosition.column
	        );
	      }
	      
	      return result;
	    },
	    
	    /* Returns the parser source code. */
	    toSource: function() { return this._source; }
	  };
	  
	  /* Thrown when a parser encounters a syntax error. */
	  
	  result.SyntaxError = function(expected, found, offset, line, column) {
	    function buildMessage(expected, found) {
	      var expectedHumanized, foundHumanized;
	      
	      switch (expected.length) {
	        case 0:
	          expectedHumanized = "end of input";
	          break;
	        case 1:
	          expectedHumanized = expected[0];
	          break;
	        default:
	          expectedHumanized = expected.slice(0, expected.length - 1).join(", ")
	            + " or "
	            + expected[expected.length - 1];
	      }
	      
	      foundHumanized = found ? quote(found) : "end of input";
	      
	      return "Expected " + expectedHumanized + " but " + foundHumanized + " found.";
	    }
	    
	    this.name = "SyntaxError";
	    this.expected = expected;
	    this.found = found;
	    this.message = buildMessage(expected, found);
	    this.offset = offset;
	    this.line = line;
	    this.column = column;
	  };
	  
	  result.SyntaxError.prototype = Error.prototype;
	  
	  return result;
	})();


/***/ }),
/* 15 */
/***/ (function(module, exports) {



/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// resolves . and .. elements in a path array with directory names there
	// must be no slashes, empty elements, or device names (c:\) in the array
	// (so also no leading and trailing slashes - it does not distinguish
	// relative and absolute paths)
	function normalizeArray(parts, allowAboveRoot) {
	  // if the path tries to go above the root, `up` ends up > 0
	  var up = 0;
	  for (var i = parts.length - 1; i >= 0; i--) {
	    var last = parts[i];
	    if (last === '.') {
	      parts.splice(i, 1);
	    } else if (last === '..') {
	      parts.splice(i, 1);
	      up++;
	    } else if (up) {
	      parts.splice(i, 1);
	      up--;
	    }
	  }
	
	  // if the path is allowed to go above the root, restore leading ..s
	  if (allowAboveRoot) {
	    for (; up--; up) {
	      parts.unshift('..');
	    }
	  }
	
	  return parts;
	}
	
	// Split a filename into [root, dir, basename, ext], unix version
	// 'root' is just a slash, or nothing.
	var splitPathRe =
	    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
	var splitPath = function(filename) {
	  return splitPathRe.exec(filename).slice(1);
	};
	
	// path.resolve([from ...], to)
	// posix version
	exports.resolve = function() {
	  var resolvedPath = '',
	      resolvedAbsolute = false;
	
	  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
	    var path = (i >= 0) ? arguments[i] : process.cwd();
	
	    // Skip empty and invalid entries
	    if (typeof path !== 'string') {
	      throw new TypeError('Arguments to path.resolve must be strings');
	    } else if (!path) {
	      continue;
	    }
	
	    resolvedPath = path + '/' + resolvedPath;
	    resolvedAbsolute = path.charAt(0) === '/';
	  }
	
	  // At this point the path should be resolved to a full absolute path, but
	  // handle relative paths to be safe (might happen when process.cwd() fails)
	
	  // Normalize the path
	  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
	    return !!p;
	  }), !resolvedAbsolute).join('/');
	
	  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
	};
	
	// path.normalize(path)
	// posix version
	exports.normalize = function(path) {
	  var isAbsolute = exports.isAbsolute(path),
	      trailingSlash = substr(path, -1) === '/';
	
	  // Normalize the path
	  path = normalizeArray(filter(path.split('/'), function(p) {
	    return !!p;
	  }), !isAbsolute).join('/');
	
	  if (!path && !isAbsolute) {
	    path = '.';
	  }
	  if (path && trailingSlash) {
	    path += '/';
	  }
	
	  return (isAbsolute ? '/' : '') + path;
	};
	
	// posix version
	exports.isAbsolute = function(path) {
	  return path.charAt(0) === '/';
	};
	
	// posix version
	exports.join = function() {
	  var paths = Array.prototype.slice.call(arguments, 0);
	  return exports.normalize(filter(paths, function(p, index) {
	    if (typeof p !== 'string') {
	      throw new TypeError('Arguments to path.join must be strings');
	    }
	    return p;
	  }).join('/'));
	};
	
	
	// path.relative(from, to)
	// posix version
	exports.relative = function(from, to) {
	  from = exports.resolve(from).substr(1);
	  to = exports.resolve(to).substr(1);
	
	  function trim(arr) {
	    var start = 0;
	    for (; start < arr.length; start++) {
	      if (arr[start] !== '') break;
	    }
	
	    var end = arr.length - 1;
	    for (; end >= 0; end--) {
	      if (arr[end] !== '') break;
	    }
	
	    if (start > end) return [];
	    return arr.slice(start, end - start + 1);
	  }
	
	  var fromParts = trim(from.split('/'));
	  var toParts = trim(to.split('/'));
	
	  var length = Math.min(fromParts.length, toParts.length);
	  var samePartsLength = length;
	  for (var i = 0; i < length; i++) {
	    if (fromParts[i] !== toParts[i]) {
	      samePartsLength = i;
	      break;
	    }
	  }
	
	  var outputParts = [];
	  for (var i = samePartsLength; i < fromParts.length; i++) {
	    outputParts.push('..');
	  }
	
	  outputParts = outputParts.concat(toParts.slice(samePartsLength));
	
	  return outputParts.join('/');
	};
	
	exports.sep = '/';
	exports.delimiter = ':';
	
	exports.dirname = function(path) {
	  var result = splitPath(path),
	      root = result[0],
	      dir = result[1];
	
	  if (!root && !dir) {
	    // No dirname whatsoever
	    return '.';
	  }
	
	  if (dir) {
	    // It has a dirname, strip trailing slash
	    dir = dir.substr(0, dir.length - 1);
	  }
	
	  return root + dir;
	};
	
	
	exports.basename = function(path, ext) {
	  var f = splitPath(path)[2];
	  // TODO: make this comparison case-insensitive on windows?
	  if (ext && f.substr(-1 * ext.length) === ext) {
	    f = f.substr(0, f.length - ext.length);
	  }
	  return f;
	};
	
	
	exports.extname = function(path) {
	  return splitPath(path)[3];
	};
	
	function filter (xs, f) {
	    if (xs.filter) return xs.filter(f);
	    var res = [];
	    for (var i = 0; i < xs.length; i++) {
	        if (f(xs[i], i, xs)) res.push(xs[i]);
	    }
	    return res;
	}
	
	// String.prototype.substr - negative index don't work in IE8
	var substr = 'ab'.substr(-1) === 'b'
	    ? function (str, start, len) { return str.substr(start, len) }
	    : function (str, start, len) {
	        if (start < 0) start = str.length + start;
	        return str.substr(start, len);
	    }
	;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(11)))

/***/ })
/******/ ])));
//# sourceMappingURL=main.js.map