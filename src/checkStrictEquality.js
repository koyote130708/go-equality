var areEqualObjects = require("./areEqualObjects");

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