"use strict";
exports.__esModule = true;
var format = function (value) {
    return typeof value === "string"
        ? "'" + value + "'"
        : typeof value === "bigint"
            ? value + "n"
            : // JSON.stringify sometimes returns "null" (as a string) e.g. JSON.stringify(NaN)
                (value === null || value === void 0 ? void 0 : value.name) || JSON.parse(JSON === null || JSON === void 0 ? void 0 : JSON.stringify(value))
                    ? JSON.stringify(value)
                    : "" + value;
};
var sendError = function (value, name, types, invert) {
    var formattedValue = format(value);
    var formattedTypes = types.map(function (type) { return format(type); }).join(" | ");
    var invalidPrefix = invert ? "non-" : "";
    throw new TypeError("Invalid value " + formattedValue + " assigned to {" + name + "}, " + invalidPrefix + "valid types being [ " + formattedTypes + " ].");
};
// 1 instanceof Number ............ -> false
// typeof 1	....................... -> "number"
// new Number(0) instanceof Number  -> true
// typeof new Number(0) ........... -> "object"
// (()=>{}) instanceof Object ..... -> true
// typeof (()=>{}) ................ -> "function"
// checks for these inputs (vvv) will be through typeof to fix javascript type weirdness
var primitives = [Object, String, Number, Boolean, BigInt, Symbol];
/**
 * @param {{name: value}} values Example: { variableName: "value", ... } or { variableName, ... }
 * @param {any} types Single/array of type object(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion, asserts none of the value(s) are of any of the defined type(s)
 */
function assertType(values, types, invert) {
    if (invert === void 0) { invert = false; }
    (values && typeof values === "object" && !(values instanceof Array)) ||
        sendError(values, "values", [Object], false);
    types || sendError(values, "values", [Array], false);
    typeof invert === "boolean" || sendError(values, "values", [Boolean], false);
    if (!Array.isArray(types))
        types = [types];
    var objectTypes = types.filter(function (e) { return e instanceof Function; });
    var literalTypes = types.filter(function (e) { return !(e instanceof Function); });
    var _loop_1 = function (valueIndex) {
        var value = values[valueIndex];
        literalTypes.length === 0 ||
            literalTypes.includes(value) ^ +invert ||
            sendError(value, valueIndex, types, invert);
        objectTypes.length === 0 ||
            objectTypes.filter(function (type) {
                return primitives.includes(type)
                    ? typeof value === type.name.toLowerCase()
                    : value instanceof type;
            }).length ^ +invert ||
            sendError(value, valueIndex, types, invert);
    };
    for (var valueIndex in values) {
        _loop_1(valueIndex);
    }
}
exports["default"] = assertType;
