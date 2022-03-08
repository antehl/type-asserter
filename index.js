/**
 * @returns {void}
 */
const format = value =>
	typeof value === "string"
		? `'${value}'`
		: typeof value === "bigint"
		? `${value}n`
		: typeof value === "symbol"
		? value.toString()
		: value?.name ||
		  // JSON.stringify sometimes returns "null" or undefined e.g. JSON.stringify(NaN)
		  // JSON.parse trying to parse undefined throws an error
		  (JSON.stringify(value) && JSON.parse(JSON.stringify(value))
				? JSON.stringify(value)
				: `${value}`);

/**
 * @param {any[]} types
 * @param {boolean} invert
 * @returns {void}
 */
const sendError = (value, name, types, invert) => {
	const formattedValue = format(value);
	const formattedTypes = types.map(type => format(type)).join(" | ");
	const invalidPrefix = invert ? "non-" : "";
	throw new TypeError(
		`Invalid value ${formattedValue} assigned to {${name}}, ${invalidPrefix}valid types being [ ${formattedTypes} ].`
	);
};

// 1 instanceof Number ............ -> false
// typeof 1	....................... -> "number"

// new Number(0) instanceof Number  -> true
// typeof new Number(0) ........... -> "object"

// (()=>{}) instanceof Object ..... -> true
// typeof (()=>{}) ................ -> "function"

// checks for these inputs (vvv) will be through typeof to fix javascript type weirdness
const primitives = [Object, String, Number, Boolean, BigInt, Symbol];

/**
 * @param {{name: value}} values Example: { varName: "value", ... } or { varName, ... }
 * @param {any} types Single/array of class type(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion, asserts none of the value(s) are of any of the defined type(s)
 * @returns {void}
 */
export default function assertType(values, types, invert = false) {
	(values && typeof values === "object" && !(values instanceof Array)) ||
		sendError(values, "values", [Object], false);
	types || sendError(types, "types", [Array], false);
	typeof invert === "boolean" || sendError(invert, "invert", [Boolean], false);

	if (!Array.isArray(types)) types = [types];
	const objectTypes = types.filter(e => e instanceof Function);
	const literalTypes = types.filter(e => !(e instanceof Function));

	for (const valueIndex in values) {
		const value = values[valueIndex];

		literalTypes.length === 0 ||
			literalTypes.includes(value) ^ invert ||
			sendError(value, valueIndex, types, invert);

		objectTypes.length === 0 ||
			+!!objectTypes.filter(type =>
				primitives.includes(type)
					? typeof value === type.name.toLowerCase()
					: value instanceof type
			).length ^ invert ||
			sendError(value, valueIndex, types, invert);
	}
}
