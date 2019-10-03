import * as dotenv from 'dotenv';
import * as dotenvParseVariables from 'dotenv-parse-variables';
import * as fs from 'fs';
import { Config } from './config.interface';
import * as path from 'path';
import { Logger } from '@nestjs/common';

export class EasyconfigService {
  readonly sampleFile: string = '.env.sample';

  private envConfig: { [key: string]: string };
  private readonly logger = new Logger(EasyconfigService.name);

  constructor(config?: Config) {
    this.tryGetConfigFromEnv(config);

    if (config.safe) {
      this.safeCheck(Object.keys(this.envConfig), this.sampleFile);
    }
  }

  get(key: string): any {
    const val = this.envConfig[key];

    if (!val) {
      this.logger.warn('The key was not found in config file :(');
      return;
    }

    return val;
  }

  /**
   *  checks whether the used env file missed some keys
   */

  safeCheck = (userEnvFile: string[], config: string) => {
    const src = Object.keys(
      dotenv.parse(fs.readFileSync(path.resolve(config))),
    );

    const missingKeys = src
      .filter(x => !userEnvFile.includes(x))
      .concat(userEnvFile.filter(x => !src.includes(x)));

    if (missingKeys.length !== 0) {
      this.logger
        .error(`MissingEnvVarsError: ${missingKeys} were defined in .env.example but are not present in the environment:
        This may cause the app to misbehave.`);
    } else {
      this.logger.debug('Config looks good :) ');
    }
  }

  private tryGetConfigFromEnv = (config?: Config) => {
    try {
      if (!config.path && process.env.NODE_ENV) {
        this.envConfig = dotenv.parse(
          fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)),
        );
      } else if (!config.path && !process.env.NODE_ENV) {
        this.logger.error(
          'Failed to load configs. Either pass file or NODE_ENV :(',
        );

        return;
      } else {
        this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(config.path)));
      }

      this.envConfig = dotenvParseVariables(this.envConfig);
    } catch (err) {
      this.logger.error(
        'Failed to load configs.',
        err.message,
      );
    }

  }
}

// console.log(new EasyconfigService({ safe: true }));
