import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";
import type { LoggerService } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import dotenvParseVariables from "./parseEnvironment";
import type { Config } from "./config.interface";
import { EasyconfigError } from "./easyconfig.error";

/**
 *
 *
 * @export
 * @class EasyconfigService
 */
export class EasyconfigService {
  readonly sampleFile: string = ".env.sample";

  private envConfig: { [key: string]: string };
  private readonly logger: LoggerService;

  constructor(config?: Config) {
    this.logger = config.logger || new Logger(EasyconfigService.name);
    this.tryGetConfigFromEnv(config);
  }

  /**
   *
   * @param {Config} config
   * @memberof EasyconfigService
   * @returns {Record<string, any>} - parsed env variables
   */
  returnEnvs(config: Config): Record<string, string> {
    const environment = dotenv.config({
      debug: config.debug,
      encoding: config.encoding,
      path: config.path,
    });

    if (config?.expand)
      return dotenvExpand.expand(environment).parsed;

    return environment.parsed;
  }


/**
 * The function retrieves a value from the environment configuration based on a given key.
 * @param {string} key - A string representing the key to retrieve from the environment configuration.
 * @returns The value associated with the given key in the `envConfig` object.
 */
  get(key: string): string {
    const configExists = key in this.envConfig;

    if (!configExists) {
      this.logger.warn("The key was not found in config file 😕");
      return;
    }

    return this.envConfig[key];
  }

  /**
   *
   * checks whether the used env file missed some keys
   *
   * @param {string[]} userEnvironmentFile
   * @param {string} config
   * @memberof EasyconfigService
   */
  safeCheck(userEnvironmentFile: string[], config: string): void {
    const source = Object.keys(
      dotenv.parse(readFileSync(resolve(config))),
    );

    const missingKeys = source
      .filter(x => !userEnvironmentFile.includes(x))
      .concat(userEnvironmentFile.filter(x => !source.includes(x)));

    if (missingKeys.length !== 0) {
      this.logger
        .error(`MissingEnvVarsError: ${missingKeys.join(",")} were defined in .env.example but are not present in the environment:
        This may cause the app to misbehave.`);
    }
    else {
      this.logger.debug("Config looks good :) ");
    }
  }

  /**
   *
   *
   * @private
   * @memberof EasyconfigService
   */
  private tryGetConfigFromEnv = (config?: Config) => {
    const sampleFile: string = config.sampleFilePath
      ? resolve(config.sampleFilePath)
      : this.sampleFile;

    try {
      if (!config.path && process.env.NODE_ENV) {
        this.envConfig = this.returnEnvs({
          ...config,
          path: resolve(`.env.${process.env.NODE_ENV}`),
        });
      }
      else if (!config.path && !process.env.NODE_ENV) {
        throw new Error(
          "Failed to load configs. Either pass file or NODE_ENV :(",
        );
      }
      else {
        if (config.path) {
          this.envConfig = this.returnEnvs({
            ...config,
            path: resolve(config.path as string),
          });
        }
      }

      if (config.safe)
        this.safeCheck(Object.keys(this.envConfig), sampleFile);

      this.envConfig = dotenvParseVariables(this.envConfig, config);
    }
    catch (error) {
      if(error instanceof Error)
      throw new EasyconfigError(error);
    }
  };
}
