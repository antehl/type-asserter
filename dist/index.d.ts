declare type LiteralObject = {
    [key: string | number | symbol]: any;
};
/**
 * @param {LiteralObject} values Example: { variableName: "value", ... } or { variableName, ... }
 * @param {any} types Single/array of type object(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion, asserts none of the value(s) are of any of the defined type(s)
 */
export default function assertType(values: LiteralObject, types: any, invert?: boolean): void;
export {};
