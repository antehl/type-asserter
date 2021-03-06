/**
 * @returns {string | undefined}
 */
const valueFormat = value => {
	const type = value.constructor;
	if (type === Number) return value;
	if (type === String) return `'${value}'`;
	if (type === BigInt) return `${value}n`;
	if (type === Symbol) return value.toString();
	if (type === RegExp) return value.toString();
	if (value?.name) return `${value?.name}`;
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
 * @param {{[label: string]: any}} values
 * @param {any[]} types
 * @param {boolean} invert
 */
const sendError = (values, types, invert = false) => {
	const [name, value] = Object.entries(values)[0];
	const formattedValue = format(value);
	const formattedTypes = types.map(type => format(type)).join(" | ");
	const invalidPrefix = invert ? "non-" : "";
	throw new TypeError(
		`Invalid value ${formattedValue} for {${name}}, ${invalidPrefix}valid types being [ ${formattedTypes} ].`
	);
};

/**
 * @param {any | any[]} values Any amount of values
 * @param {any | any[]} types Any combination of types, classes and literal values
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
 * @param {{[label: string]: any}} values Any amount of labels with values: { label1: 123, label2, ... }
 * @param {any | any[]} types Any combination of types, classes and literal values
 * @param {boolean} invert Flips the assertion: asserts none of the values are of any of the specified types
 */
export const assertType = (values, types, invert = false) => {
	if (!Array.isArray(types)) types = [types];
	if (typeof invert !== "boolean") sendError({ invert }, [Boolean]);

	for (const name in values) {
		if (isType(values[name], types) ^ invert) continue;
		sendError({ [name]: values[name] }, types, invert);
	}
};
