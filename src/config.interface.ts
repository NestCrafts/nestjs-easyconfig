import { LoggerService } from '@nestjs/common';
import { DotenvConfigOptions } from 'dotenv';

export interface Config extends DotenvConfigOptions {
	/**
	 *
	 * path of the file to check the keys against when safe option is set to true.
	 * Defaults to .env.sample
	 *
	 */

	sampleFilePath?: string;

	/**
	 * checks whether the used env file is missing some keys.
	 *
	 * For example, if the given `.env` file has the following content:
	 * ```
	 * VAR=true
	 * ```
	 *
	 * and the `.env.sample` file has the following:
	 * ```
	 * VAR=true
	 * VAR2=sample value
	 * ```
	 *
	 * the following error log will be printed:
	 * ```
	 * MissingEnvVarsError: [VAR2] were defined in .env.example but are not present in the environment:
	 *     This may cause the app to misbehave.
	 * ```
	 */

	safe?: boolean;

	/**
	 * This turns on parse logs which help debug how keys are being parsed.
	 *
	 * default : false
	 */

	parseLog?: boolean;

	/**
	 *
	 * This option allows you to pass in a pre-defined logger instance.
	 * The logger must implement the NestJS LoggerService interface
	 *
	 */

	logger?: LoggerService;

	/**
	 *
	 * This option allows you assign the values to process.env . Defaults to true
	 *
	 */

	assignToProcessEnv?: boolean;

	/**
	 *
	 * This option allows you overide a value on process.env if its alreadt set . Defaults to false
	 *
	 */

	overrideProcessEnv?: boolean;
}
