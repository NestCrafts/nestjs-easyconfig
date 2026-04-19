import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';
import dotenvParseVariables from './parseEnv';
import { readFileSync } from 'fs';
import { Config } from './config.interface';
import { resolve } from 'path';
import { Logger, LoggerService } from '@nestjs/common';
import { EasyconfigError } from './easyconfig.error';

interface ResolvedConfig extends Config {
	sampleFilePath: string;
	expand: boolean;
	safe: boolean;
	parseLog: boolean;
	assignToProcessEnv: boolean;
	overrideProcessEnv: boolean;
}

/**
 *
 *
 * @export
 * @class EasyconfigService
 */
export class EasyconfigService {
	private envConfig: { [key: string]: any } = {};
	private readonly logger: LoggerService;

	constructor(config?: Config) {
		const resolvedConfig = this.resolveConfig(config);
		this.logger = resolvedConfig.logger || new Logger(EasyconfigService.name);
		this.tryGetConfigFromEnv(resolvedConfig);
	}

	private resolveConfig(config?: Config): ResolvedConfig {
		const suppliedConfig: Config = config ?? {};

		return {
			...suppliedConfig,
			sampleFilePath: suppliedConfig.sampleFilePath ?? '.env.sample',
			expand: suppliedConfig.expand ?? false,
			safe: suppliedConfig.safe ?? false,
			parseLog: suppliedConfig.parseLog ?? false,
			assignToProcessEnv: suppliedConfig.assignToProcessEnv ?? true,
			overrideProcessEnv: suppliedConfig.overrideProcessEnv ?? false,
		};
	}

	/**
	 *
	 *
	 * @param {Config} config
	 * @returns {Record<string, any>}
	 * @memberof EasyconfigService
	 */
	returnEnvs(config: Config): Record<string, any> {
		const env = dotenv.config({
			debug: config.debug,
			encoding: config.encoding,
			path: config.path,
		});

		if (config?.expand) {
			return dotenvExpand.expand(env).parsed ?? {};
		}

		return env.parsed ?? {};
	}

	/**
	 *
	 * @param {string} key
	 * @returns {string | undefined}
	 * @memberof EasyconfigService
	 */
	get(key: string): any {
		const configExists = key in this.envConfig;

		if (!configExists) {
			this.logger.warn('The key was not found in config file 😕');
			return undefined;
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
		const src = Object.keys(dotenv.parse(readFileSync(resolve(config))));

		const missingKeys = src
			.filter(x => !userEnvFile.includes(x))
			.concat(userEnvFile.filter(x => !src.includes(x)));

		if (missingKeys.length !== 0) {
			this.logger
				.error(`MissingEnvVarsError: ${missingKeys.join(',')} were defined in .env.example but are not present in the environment:
        This may cause the app to misbehave.`);
		} else {
			this.logger.debug?.('Config looks good :) ');
		}
	}

	/**
	 *
	 *
	 * @private
	 * @memberof EasyconfigService
	 */
	private tryGetConfigFromEnv = (config: ResolvedConfig) => {
		const sampleFile: string = resolve(config.sampleFilePath);

		try {
			if (!config.path && process.env.NODE_ENV) {
				this.envConfig = this.returnEnvs({
					...config,
					path: resolve(`.env.${process.env.NODE_ENV}`),
				});
			} else if (!config.path && !process.env.NODE_ENV) {
				throw new Error('Failed to load configs. Either pass file or NODE_ENV :(');
			} else {
				if (config.path) {
					this.envConfig = this.returnEnvs({
						...config,
						path: resolve(config.path as string),
					});
				}
			}

			if (config.safe) {
				this.safeCheck(Object.keys(this.envConfig), sampleFile);
			}

			this.envConfig = dotenvParseVariables(this.envConfig, config);
		} catch (err) {
			const unknownErr = err as { message?: string; stack?: string };
			throw new EasyconfigError({
				message: unknownErr.message || 'Unknown easyconfig error',
				stack: unknownErr.stack || '',
			});
		}
	};
}
