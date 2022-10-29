var areEqualObjects = require("./areEqualObjects");

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