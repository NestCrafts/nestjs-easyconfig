import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { FileConfig } from './fileconfig.interface';
import * as path from 'path';
import * as debug from 'debug';

export class EasyconfigService {
  readonly envConfig: { [key: string]: string };
  readonly errorLog = debug('warning');
  readonly sampleFile: string = '.env.sample';

  constructor(filePath?: FileConfig) {
    debug.enable('warning');

    if (!filePath && process.env.NODE_ENV) {
      this.envConfig = dotenv.parse(
        fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)),
      );
    } else if (!filePath && !process.env.NODE_ENV) {
      this.errorLog('Failed to load configs. Either pass file or NODE_ENV :(');
      return;
    } else {
      this.envConfig = dotenv.parse(
        fs.readFileSync(path.resolve(filePath.path)),
      );
    }
    this.safeCheck(Object.keys(this.envConfig), this.sampleFile);
  }

  get(key: string): any {
    const val = this.envConfig[key];
    if (!val) {
      this.errorLog('The key was not found in config file :(');
      return;
    }

    if (/^\d+$/.test(val)) {
      return Number(val);
    } else if (/true|false$/.test(val.toLowerCase())) {
      return JSON.parse(val);
    } else {
      return val;
    }
  }

  /**
   *  checks whether the used env file missed some keys
   */

  safeCheck = (userEnvFile, filepath) => {
    const src = Object.keys(
      dotenv.parse(fs.readFileSync(path.resolve(filepath))),
    );
    const missingKeys = src
      .filter(x => !userEnvFile.includes(x))
      .concat(userEnvFile.filter(x => !src.includes(x)));

    this
      .errorLog(`MissingEnvVarsError: ${missingKeys} were defined in .env.example but are not present in the environment:
        Make sure to add them to the environment.`);
  }
}


//console.log(new EasyconfigService());
