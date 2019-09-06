import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Config } from './config.interface';
import * as path from 'path';
import * as debug from 'debug';

export class EasyconfigService {
  readonly envConfig: { [key: string]: string };
  readonly errorLog = debug('warning');

  constructor(filePath?: Config) {
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
}

console.log(new EasyconfigService().get('TEST'));
