/**
 * @returns {string | undefined}
 */
const valueFormat = value => {
	const type = typeof value;
	if (type === "string") return `'${value}'`;
	if (type === "bigint") return `${value}n`;
	if (type === "symbol") return value.toString();
	if (value instanceof RegExp) return value.toString();
	if (value?.name) return `<${value?.name}>`;
	return;
};

/**
 * @returns {string | undefined}
 */
const jsonFormat = value => {
	let stringified = JSON.stringify(value, null, 1);
	// JSON.stringify sometimes returns "null" or undefined e.g. JSON.stringify(NaN)
	// JSON.parse trying to parse undefined throws an error
	try {
		JSON.parse(stringified);
	} catch {
		return;
	}
	stringified = stringified
		// condense newlines but keep spacing
		.replaceAll(/\n\s*/g, " ")
		// remove quotes from keys
		.replaceAll(/\"(\w+)\":/g, "$1:")
		// shorten json if over 50 chars
		.replaceAll(/(.{50}).*/g, "$1 ... }");
	if (value?.constructor && value.constructor !== Object)
		return `<${value.constructor.name} ${stringified}>`;
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
		`Invalid value ${formattedValue} assigned to { ${name} }, ${invalidPrefix}valid types being [ ${formattedTypes} ].`
	);
};

/**
 * @param {{[varname: string]: any}} values Array/single variable name(s): { varname1, varname2 }
 * @param types Array/single class type(s) and/or literal value(s)
 */
export const isType = (values, types) => {
	if (!Array.isArray(values)) values = [values];
	if (!Array.isArray(types)) types = [types];

	const classes = types.filter(e => e?.constructor === Function);
	const literals = types.filter(e => e?.constructor !== Function);

	for (const value of values) {
		if (!classes.includes(value?.constructor) && !literals.includes(value))
			return false;
	}
	return true;
};

/**
 * @param {{[varname: string]: any}} values Array/single variable name(s): { varname1, varname2 }
 * @param types Array/single class type(s) and/or literal value(s)
 * @param {boolean} invert Flips the assertion - asserts none of the values are of any of the defined type(s)
 */
export const assertType = (values, types, invert = false) => {
	if (typeof invert !== "boolean") sendError({ invert }, [Boolean]);
	if (!isType(values, types) ^ invert) {
		if (!Array.isArray(types)) types = [types];
		sendError(values, types, invert);
	}
};
