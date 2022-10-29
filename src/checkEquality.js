var areEqualObjects = require("./areEqualObjects");
var unwrap = require("./unwrap");

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