/* eslint-disable @typescript-eslint/no-explicit-any */
import { Logger } from '@nestjs/common';

const DEFAULT_OPTIONS = {
  assignToProcessEnv: true,
  overrideProcessEnv: false,
  parseLog: false
};

interface options {
  assignToProcessEnv?: boolean;
  overrideProcessEnv?: boolean;
  parseLog?: boolean
}

function logger(msg: string, parseLog: boolean) {

  if (parseLog) {

    Logger.log(msg, 'ParseService')

  }

}



export default (
  env: { [key: string]: string },
  envOptions: options = DEFAULT_OPTIONS,
): { [key: string]: string } => {
  Object.keys(env).forEach(key => {
    //logger(`key "${key}" before type was ${typeof env[key]}`,envOptions.parseLog);
    if (env[key]) {
      env[key] = parseKey(env[key], key, envOptions);
      //logger(`key "${key}" after type was ${typeof env[key]}`,envOptions.parseLog);
      if (envOptions.assignToProcessEnv === true) {
        if (envOptions.overrideProcessEnv === true) {
          process.env[key] = env[key] || process.env[key];
        } else {
          process.env[key] = process.env[key] || env[key];
        }
      }
    }
  });

  return env;
};

function parseKey(value: any, key: string, options: options) {
  logger(`parsing key ${key} with value ${value}`, options.parseLog);

  // if the value is wrapped in bacticks e.g. (`value`) then just return its value
  if (
    value.toString().indexOf('`') === 0 &&
    value.toString().lastIndexOf('`') === value.toString().length - 1
  ) {
    logger(`key ${key} is wrapped in bacticks and will be ignored from parsing`, options.parseLog);
    return value.toString().substring(1, value.toString().length - 1);
  }

  // if the value ends in an asterisk then just return its value
  if (
    value.toString().lastIndexOf('*') === value.toString().length - 1 &&
    value.toString().indexOf(',') === -1
  ) {
    logger(`key ${key} ended in * and will be ignored from parsing`, options.parseLog);
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
  if (!isNaN(value)) {
    //logger(`key ${key} parsed as a Number`);
    return Number(value);
  }

  // Array
  if (value.indexOf(',') !== -1) {
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
