/* eslint-disable ts/no-explicit-any */
import { Logger } from "@nestjs/common";

const DEFAULT_OPTIONS = {
  assignToProcessEnv: true,
  overrideProcessEnv: false,
  parseLog: false,
  ignoreFunctions: true,
};

interface options {
  assignToProcessEnv?: boolean
  overrideProcessEnv?: boolean
  parseLog?: boolean
  ignoreFunctions?: boolean
}

function logger(message: string, parseLog: boolean) {
  if (parseLog)
    Logger.log(message, "ParseService");
}

function isStringBlank(string_: string): boolean {
  const l = string_.length;
  let a: number;
  for (let index = 0; index < l; index++) {
    a = string_.charCodeAt(index);
    if (
      (a < 9 || a > 13)
			&& a !== 32
			&& a !== 133
			&& a !== 160
			&& a !== 5760
			&& a !== 6158
			&& (a < 8192 || a > 8205)
			&& a !== 8232
			&& a !== 8233
			&& a !== 8239
			&& a !== 8287
			&& a !== 8288
			&& a !== 12288
			&& a !== 65279
    )
      return false;
  }
  return true;
}

function isSANB(value: any): boolean {
  return typeof value === "string" && !isStringBlank(value);
}

export default (
  environment: { [key: string]: string },
  options: options = DEFAULT_OPTIONS,
): { [key: string]: string } => {
  const environmentOptions = { ...DEFAULT_OPTIONS, ...(options || {}) };

  const parsed = {};

  for (const key of Object.keys(environment)) {
    if (environment[key]) {
      if (environmentOptions.ignoreFunctions && typeof environment[key] === "function")
        continue;

      parsed[key] = parseKey(environment[key], key, environmentOptions);
      if (environmentOptions.assignToProcessEnv === true) {
        if (environmentOptions.overrideProcessEnv === true)
          process.env[key] = parsed[key] || process.env[key];
				 else
          process.env[key] = process.env[key] || parsed[key];
      }
    }
  }

  return parsed;
};

function parseKey(value: string, key: string, options: options) {
  logger(`parsing key ${key} with value ${value}`, options.parseLog);

  // if the value is wrapped in bacticks e.g. (`value`) then just return its value
  if (
    value.toString().indexOf("`") === 0
		&& value.toString().lastIndexOf("`") === value.toString().length - 1
  ) {
    logger(
			`key ${key} is wrapped in backticks and will be ignored from parsing`,
			options.parseLog,
    );
    return value.toString().substring(1, value.toString().length - 1);
  }

  // if the value ends in an asterisk then just return its value
  if (
    value.toString().lastIndexOf("*") === value.toString().length - 1
		&& !value.toString().includes(",")
  ) {
    logger(
			`key ${key} ended in * and will be ignored from parsing`,
			options.parseLog,
    );
    return value.toString().substring(0, value.toString().length - 1);
  }

  // Boolean
  if (
    value.toString().toLowerCase() === "true"
		|| value.toString().toLowerCase() === "false"
  ) {
    logger(`key ${key} parsed as a Boolean`, options.parseLog);
    return value.toString().toLowerCase() === "true";
  }

  // Number
  if (isSANB(value) && !Number.isNaN(Number(value)))
    return Number(value);

  // Array
  if (typeof value.includes === "function" && value.includes(",")) {
    // eslint-disable-next-line ts/no-unsafe-return
    return value
      .split(",")
      .filter((string_: string) => {
        return string_ !== "";
      })
      // eslint-disable-next-line ts/no-unsafe-return
      .map(element => parseKey(element, key, {}));
  }

  return value;
}
