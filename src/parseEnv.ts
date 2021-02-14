/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@nestjs/common';

const DEFAULT_OPTIONS = {
	assignToProcessEnv: true,
	overrideProcessEnv: false,
	parseLog: false,
	ignoreFunctions: true,
};

interface options {
	assignToProcessEnv?: boolean;
	overrideProcessEnv?: boolean;
	parseLog?: boolean;
	ignoreFunctions?: boolean;
}

function logger(msg: string, parseLog: boolean) {
	if (parseLog) {
		Logger.log(msg, 'ParseService');
	}
}

function isStringBlank(str: string): boolean {
	const l = str.length;
	let a: number;
	for (let i = 0; i < l; i++) {
		a = str.charCodeAt(i);
		if (
			(a < 9 || a > 13) &&
			a !== 32 &&
			a !== 133 &&
			a !== 160 &&
			a !== 5760 &&
			a !== 6158 &&
			(a < 8192 || a > 8205) &&
			a !== 8232 &&
			a !== 8233 &&
			a !== 8239 &&
			a !== 8287 &&
			a !== 8288 &&
			a !== 12288 &&
			a !== 65279
		) {
			return false;
		}
	}
	return true;
}

function isSANB(val: any): boolean {
	return typeof val === 'string' && !isStringBlank(val);
}

export default (
	env: { [key: string]: string },
	options: options = DEFAULT_OPTIONS,
): { [key: string]: string } => {
	const envOptions = { ...DEFAULT_OPTIONS, ...(options || {}) };

	const parsed = {};

	for (const key of Object.keys(env)) {
		// logger(`key "${key}" before type was ${typeof env[key]}`,	envOptions.parseLog );
		if (env[key]) {
			if (envOptions.ignoreFunctions && typeof env[key] === 'function') {
				//			logger(`key "${key}" was a function so it is being ignored due to ignoreFunctions: true`,envOptions.parseLog	);
				continue;
			}

			parsed[key] = parseKey(env[key], key, envOptions);
			// logger(
			// 	`key "${key}" after type was ${typeof parsed[key]}`,
			// 	envOptions.parseLog,
			// );
			if (envOptions.assignToProcessEnv === true) {
				if (envOptions.overrideProcessEnv === true) {
					process.env[key] = parsed[key] || process.env[key];
				} else {
					process.env[key] = process.env[key] || parsed[key];
				}
			}
		}
	}

	return parsed;
};

function parseKey(value: any, key: string, options: options) {
	logger(`parsing key ${key} with value ${value}`, options.parseLog);

	// if the value is wrapped in bacticks e.g. (`value`) then just return its value
	if (
		value.toString().indexOf('`') === 0 &&
		value.toString().lastIndexOf('`') === value.toString().length - 1
	) {
		logger(
			`key ${key} is wrapped in bacticks and will be ignored from parsing`,
			options.parseLog,
		);
		return value.toString().substring(1, value.toString().length - 1);
	}

	// if the value ends in an asterisk then just return its value
	if (
		value.toString().lastIndexOf('*') === value.toString().length - 1 &&
		value.toString().indexOf(',') === -1
	) {
		logger(
			`key ${key} ended in * and will be ignored from parsing`,
			options.parseLog,
		);
		return value.toString().substring(0, value.toString().length - 1);
	}

	// Boolean
	if (
		value.toString().toLowerCase() === 'true' ||
		value.toString().toLowerCase() === 'false'
	) {
		logger(`key ${key} parsed as a Boolean`, options.parseLog);
		return value.toString().toLowerCase() === 'true';
	}

	// Number
	if (isSANB(value) && !Number.isNaN(Number(value))) {
		//logger(`key ${key} parsed as a Number`);
		return Number(value);
	}

	// Array
	if (typeof value.includes === 'function' && value.includes(',')) {
		//logger(`key ${key} parsed as an Array`);
		return value
			.split(',')
			.filter(function (str: string) {
				return str !== '';
			})
			.map(parseKey);
	}

	return value;
}
