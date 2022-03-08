/**
 * @param {{name: value}} values Example: { varName: "value", ... } or { varName, ... }
 * @param {any} types Single/array of class type(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion, asserts none of the value(s) are of any of the defined type(s)
 */
export default function assertType(values: {}, types: any, invert?: boolean): void;