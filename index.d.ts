/**
 * @param {{[label: string]: any}} values Any amount of labels with values: { label1, label2 }
 * @param {any | any[]} types Any combination of types, classes and literal values
 * @param {boolean} invert Flips the assertion: asserts none of the values are of any of the specified types
 */
export function assertType(values: {[label: string]: any}, types: any | any[], invert?: boolean): void;

/**
 * @param {any | any[]} values Any amount of values
 * @param {any | any[]} types Any combination of types, classes and literal values
 */
export function isType(values: any | any[], types: any | any[]): boolean;