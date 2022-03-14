/**
 * @returns {string | undefined}
 */
const valueFormat = value => {
	const type = typeof value;
	if (type === "string") return `'${value}'`;
	if (type === "bigint") return `${value}n`;
	if (type === "symbol") return value.toString();

	if (value instanceof RegExp) return value.toString();

	return value.name;
};

/**
 * @returns {string | undefined}
 */
const jsonFormat = value => {
	let stringified = JSON.stringify(value);
	// JSON.stringify sometimes returns "null" or undefined e.g. JSON.stringify(NaN)
	// JSON.parse trying to parse undefined throws an error
	if (stringified && JSON.parse(stringified)) return stringified;
};

const format = value => valueFormat(value) || jsonFormat(value) || `${value}`;

/**
 * @param {{[varname: string]: any}} values
 * @param {any[]} types
 * @param {boolean} invert
 */
const sendError = (values, types, invert = false) => {
	const [name, value] = Object.entries(values)[0];
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
 * @param {{[varname: string]: any}} values Array/single variable name(s): { varname1, varname2 }
 * @param types Array/single class type(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion - asserts none of the values are of any of the defined type(s)
 */
export default function assertType(values, types, invert = false) {
	if (!values || typeof values !== "object" || values instanceof Array)
		sendError({ values }, [Object]);
	if (!types) sendError({ types }, [Array]);
	if (typeof invert !== "boolean") sendError({ invert }, [Boolean]);

	if (!Array.isArray(types)) types = [types];
	const objectTypes = types.filter(e => e instanceof Function);
	const literalTypes = types.filter(e => !(e instanceof Function));

	for (const name in values) {
		const value = values[name];
		const objectTypesMatching = objectTypes.filter(type =>
			primitives.includes(type)
				? typeof value === type.name.toLowerCase()
				: value instanceof type
		);
		const doesMatch =
			objectTypesMatching.length !== 0 || literalTypes.includes(value);

		if (!doesMatch ^ invert) sendError({ [name]: value }, types, invert);
	}
}
