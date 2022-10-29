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