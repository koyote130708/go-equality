(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["Equality"] = factory();
	else
		root["Equality"] = factory();
})(this, () => {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */,
/* 1 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var checkEquality = __webpack_require__(2);

/**
 * Determines whether two values are equal.
 * 
 * Two values are considered equal if they are:
 * - Primitive values whose types and values are the same
 * - Identical objects (comparing against itself)
 * - One of them is a primitive wrapper object whose value is the same as the other value
 * - Objects that have the same property names and equal values (including non-enumerable properties)
 * - Objects that have the <code>equals</code> method and both return <code>true</code> when tested against each other
 * - <code>NaN</code> values
 * 
 * These values are considered not equal:
 * - Primitive values whose types or values are different
 * - Objects that have a different constructor or property name or value (including non-enumerable properties)
 * - One of the objects has the equals method and it returns <code>false</code> when tested against the other value
 * - Functions
 * - <code>Symbol</code> values
 * @param {*} value The value to compare
 * @param {*} other The other value to compare with
 * @returns {boolean} <code>true</code> if the two values are considered equal; <code>false</code> otherwise.
 * @example <caption>Equal values</caption>
 * // returns true
 * isEqual(1, 1);
 * isEqual(1, new Number(1));
 * isEqual([1, 2, 3], [1, 2, 3]);
 * isEqual({name: "foo", value: 10}, {value: 10, name: "foo"});
 * isEqual(NaN, NaN);
 * @example <caption>Not equal values</caption>
 * // returns false
 * isEqual(1, "1");
 * isEqual(null, undefined);
 * isEqual({}, {a: undefined});
 * isEqual([1, 2, 3], [2, 3, 1]);
 * isEqual(function() {}, function() {});
 * isEqual(Symbol("abc"), Symbol("abc"));
 * @since 1.0.0
 */
module.exports = function (value, other) {
    return checkEquality(value, other);
};

/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var areEqualObjects = __webpack_require__(3);
var unwrap = __webpack_require__(4);

module.exports = function checkEquality(value, other, stack) {
    value = value instanceof Object ? unwrap(value) : value;
    other = other instanceof Object ? unwrap(other) : other;

    if (value === other) {
        return true;
    } else if (value instanceof Object) {

        if (other instanceof Object) {

            return areEqualObjects(value, other, stack || [], checkEquality, true);
        }
    } else if (typeof value === "number" && typeof other === "number" && isNaN(value) && isNaN(other)) {
        return true;
    }

    return false;
};

/***/ }),
/* 3 */
/***/ ((module) => {

module.exports = function (obj, otherObj, stack, equalityChecker, checkConstructor) {
    if (obj === otherObj) {
        return true;
    }

    var equality = 0;

    if (typeof obj.equals === "function") {
        if (!obj.equals(otherObj)) {
            return false;
        }
        ++equality;
    }

    if (typeof otherObj.equals === "function") {
        if (!otherObj.equals(obj)) {
            return false;
        }
        ++equality;
    }

    if (equality === 2) {
        return true;
    }

    if (typeof obj === "function" && typeof otherObj === "function") {
        return false;
    }

    if (checkConstructor && obj.constructor !== otherObj.constructor) {
        return false;
    }

    var props1 = Object.getOwnPropertyNames(obj).sort();
    var props2 = Object.getOwnPropertyNames(otherObj).sort();

    if (props1.length !== props2.length) {
        return false;
    }

    // check if the keys are equal
    for (var i = 0; i < props1.length; i++) {
        if (props1[i] !== props2[i]) {
            return false;
        }
    }

    // check if the values are equal
    var val1, val2, seenVal1, seenVal2;

    for (var i = 0; i < props1.length; i++) {
        val1 = obj[props1[i]];
        val2 = otherObj[props2[i]];

        seenVal1 = false;
        seenVal2 = false;

        if (val1 instanceof Object) {
            if (stack.indexOf(val1) === -1) {
                stack.push(val1);
            } else {
                seenVal1 = true;
            }
        }

        if (val2 instanceof Object) {
            if (stack.indexOf(val2) === -1) {
                stack.push(val2);
            } else {
                seenVal2 = true;
            }
        }

        // only compare the objects if both of them have not been seen already 
        // to prevent endless looping when there is a circular reference.
        if ((!seenVal1 || !seenVal2) && !equalityChecker(val1, val2, stack)) {
            return false;
        }
    }

    return true;
};

/***/ }),
/* 4 */
/***/ ((module) => {

module.exports = function (value) {
    if (value instanceof Number || value instanceof String || value instanceof Boolean) {
        return value.valueOf();
    }
    return value;
};

/***/ }),
/* 5 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var checkLooseEquality = __webpack_require__(6);

/**
 * Determines whether two values are loosely equal.
 * 
 * Two values are considered loosely equal if they are:
 * - Primitive values whose types are the same or compatible and the values are equal (after conversion if required)
 * - Identical objects (comparing against itself)
 * - One of them is a primitive wrapper object whose value is the same as the other value
 * - Objects that have the same property names and loosely equal values (including non-enumerable properties)
 * - Objects that have the <code>equals</code> method and both return <code>true</code> when tested against each other
 * - <code>NaN</code> values
 * 
 * These values are considered not equal:
 * - Primitive values whose types are not compatible or values are different
 * - Objects that have a different property name or value (including non-enumerable properties)
 * - One of the objects has the equals method and it returns <code>false</code> when tested against the other value
 * - Functions
 * - <code>Symbol</code> values
 * @param {*} value The value to compare
 * @param {*} other The other value to compare with
 * @returns {boolean} <code>true</code> if the two values are loosely equal; <code>false</code> otherwise.
 * @example <caption>Equal values</caption>
 * // returns true
 * isLooseEqual(null, undefined);
 * isLooseEqual(1, "1");
 * isLooseEqual(1, new Number(1));
 * isLooseEqual(1, BigInt(1));
 * isLooseEqual(1, true);
 * isLooseEqual(NaN, NaN);
 * @example <caption>Not equal values</caption>
 * // returns false
 * isLooseEqual(true, "true");
 * isLooseEqual(false, undefined);
 * isLooseEqual({}, {a: undefined});
 * isLooseEqual("abc", ["a", "b", "c"]);
 * isLooseEqual([1, 2, 3], [2, 3, 1]);
 * isLooseEqual(function() {}, function() {});
 * isLooseEqual(Symbol("abc"), Symbol("abc"));
 * @since 1.0.0
 */
module.exports = function (value, other) {
    return checkLooseEquality(value, other);
};

/***/ }),
/* 6 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var areEqualObjects = __webpack_require__(3);

module.exports = function checkLooseEquality(value, other, stack) {
    if (value == other) {
        return true;
    } else if (value instanceof Object) {

        if (other instanceof Object) {

            return areEqualObjects(value, other, stack || [], checkLooseEquality, false);
        }
    } else if (
            (typeof value === "number" || value instanceof Number) &&
            (typeof other === "number" || other instanceof Number) &&
            isNaN(value) &&
            isNaN(other)
            ) {
        return true;
    }

    return false;
};

/***/ }),
/* 7 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var checkStrictEquality = __webpack_require__(8);

/**
 * Determines whether two values are strictly equal.
 * 
 * Two values are considered strictly equal if they are:
 * - Primitive values whose types and values are the same
 * - Identical objects (comparing against itself)
 * - Objects that have the <code>equals</code> method and both return <code>true</code> when tested against each other
 * - Objects that have the same constructor and the same property names and values (including non-enumerable properties)
 * - Primitive <code>NaN</code> values or Number objects that represent <code>NaN</code>
 * 
 * These values are considered not equal:
 * - Primitive values whose types or values are different
 * - Objects that have a different constructor or property name or value (including non-enumerable properties)
 * - One of the objects has the equals method and it returns <code>false</code> when tested against the other value
 * - Functions
 * - <code>Symbol</code> values
 * @param {*} value The value to compare
 * @param {*} other The other value to compare with
 * @returns {boolean} <code>true</code> if the two values are strictly equal; <code>false</code> otherwise.
 * @example <caption>Equal values</caption>
 * // returns true
 * isStrictEqual(1, 1);
 * isStrictEqual([1, 2, 3], [1, 2, 3]);
 * isStrictEqual({name: "foo", value: 10}, {value: 10, name: "foo"});
 * isStrictEqual(NaN, NaN);
 * @example <caption>Not equal values</caption>
 * // returns false
 * isStrictEqual(1, "1");
 * isStrictEqual(1, new Number(1));
 * isStrictEqual(null, undefined);
 * isStrictEqual({}, {a: undefined});
 * isStrictEqual(function() {}, function() {});
 * isStrictEqual(Symbol("abc"), Symbol("abc"));
 * @since 1.0.0
 */
module.exports = function (value, other) {
    return checkStrictEquality(value, other);
};

/***/ }),
/* 8 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var areEqualObjects = __webpack_require__(3);

module.exports = function checkStrictEquality(value, other, stack) {
    if (value === other) {
        return true;
    } else if (value instanceof Object) {

        if (other instanceof Object) {
            return areEqualObjects(value, other, stack || [], checkStrictEquality, true);
        }

    } else if (typeof value === "number" && typeof other === "number" && isNaN(value) && isNaN(other)) {
        return true;
    }
    return false;
};

/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
var exports = __webpack_exports__;
exports.isEqual = __webpack_require__(1);
exports.isLooseEqual = __webpack_require__(5);
exports.isStrictEqual = __webpack_require__(7);
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});