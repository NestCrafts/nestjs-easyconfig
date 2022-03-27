import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import dotenvParseVariables from './parseEnv';
import * as fs from 'fs';
import { Config } from './config.interface';
import * as path from 'path';
import { Logger, LoggerService } from '@nestjs/common';
import { EasyconfigError } from './easyconfig.error';

/**
 *
 *
 * @export
 * @class EasyconfigService
 */
export class EasyconfigService {
	readonly sampleFile: string = '.env.sample';

	private envConfig: { [key: string]: string };
	private readonly logger: LoggerService;

	constructor(config?: Config) {
		this.logger = config.logger || new Logger(EasyconfigService.name);
		this.tryGetConfigFromEnv(config);
	}

	/**
	 *
	 *
	 * @param {Config} config
	 * @returns {Record<string, any>}
	 * @memberof EasyconfigService
	 */
	returnEnvs(config: Config): Record<string, string> {
		const thisEnv = dotenv.config({
			debug: config.debug,
			encoding: config.encoding,
			path: config.path,
		});

		if (config.expand) {
			return dotenvExpand.expand(thisEnv).parsed;
		}

		return thisEnv.parsed;
	}

	/**
	 *
	 *
	 * @param {string} key
	 * @returns {string}
	 * @memberof EasyconfigService
	 */
	get(key: string): string {
		const configExists = key in this.envConfig;

		if (!configExists) {
			this.logger.warn('The key was not found in config file 😕');
			return;
		}

		return this.envConfig[key];
	}

	/**
	 *
	 * checks whether the used env file missed some keys
	 *
	 * @param {string[]} userEnvFile
	 * @param {string} config
	 * @memberof EasyconfigService
	 */
	safeCheck(userEnvFile: string[], config: string): void {
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

	/**
	 *
	 *
	 * @private
	 * @memberof EasyconfigService
	 */
	private tryGetConfigFromEnv = (config?: Config) => {
		const sampleFile: string = config.sampleFilePath
			? path.resolve(config.sampleFilePath)
			: this.sampleFile;

		try {
			if (!config.path && process.env.NODE_ENV) {
				this.envConfig = this.returnEnvs({
					...config,
					path: path.resolve(`.env.${process.env.NODE_ENV}`),
				});
			} else if (!config.path && !process.env.NODE_ENV) {
				throw new Error(
					'Failed to load configs. Either pass file or NODE_ENV :(',
				);
			} else {
				this.envConfig = this.returnEnvs({
					...config,
					path: path.resolve(config.path),
				});
			}

			if (config.safe) {
				this.safeCheck(Object.keys(this.envConfig), sampleFile);
			}

			this.envConfig = dotenvParseVariables(this.envConfig, config);
		} catch (err) {
			throw new EasyconfigError(err);
		}
	};
}
