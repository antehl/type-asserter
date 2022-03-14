/**
 * @param {{[varname: string]: any}} values Array/single variable name(s): { varname1, varname2 }
 * @param types Array/single class type(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion - asserts none of the values are of any of the defined type(s)
 */
export default function assertType(values: {[varname: string]: any}, types: any, invert?: boolean): void;
