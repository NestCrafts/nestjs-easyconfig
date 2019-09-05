import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Config } from './config.interface';
import * as path from 'path';

export class EasyconfigService {
  private readonly envConfig: { [key: string]: string };

  constructor(filePath: Config) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath.path));
  }

  get(key: string): any {
    const val = this.envConfig[key];

    if (/^\d+$/.test(val)) {
      return Number(val);
    } else if (/true|false$/.test(val.toLowerCase())) {
      return JSON.parse(val);
    } else {
      return val;
    }
  }
}
