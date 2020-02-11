"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const dotenvParseVariables = require("dotenv-parse-variables");
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
const easyconfig_error_1 = require("./easyconfig.error");
class EasyconfigService {
    constructor(config) {
        this.sampleFile = '.env.sample';
        this.safeCheck = (userEnvFile, config) => {
            const src = Object.keys(dotenv.parse(fs.readFileSync(path.resolve(config))));
            const missingKeys = src
                .filter(x => !userEnvFile.includes(x))
                .concat(userEnvFile.filter(x => !src.includes(x)));
            if (missingKeys.length !== 0) {
                this.logger
                    .error(`MissingEnvVarsError: ${missingKeys} were defined in .env.example but are not present in the environment:
        This may cause the app to misbehave.`);
            }
            else {
                this.logger.debug('Config looks good :) ');
            }
        };
        this.tryGetConfigFromEnv = (config) => {
            const sampleFile = config.sampleFilePath ? path.resolve(config.sampleFilePath) : this.sampleFile;
            try {
                if (!config.path && process.env.NODE_ENV) {
                    this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)));
                }
                else if (!config.path && !process.env.NODE_ENV) {
                    throw new Error('Failed to load configs. Either pass file or NODE_ENV :(');
                }
                else {
                    this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(config.path)));
                }
                if (config.safe) {
                    this.safeCheck(Object.keys(this.envConfig), sampleFile);
                }
                this.envConfig = dotenvParseVariables(this.envConfig);
            }
            catch (err) {
                throw new easyconfig_error_1.EasyconfigError(err);
            }
        };
        this.logger = config.logger || new common_1.Logger(EasyconfigService.name);
        this.tryGetConfigFromEnv(config);
        dotenv.config({ debug: config.debug, encoding: config.encoding });
    }
    get(key) {
        const configExists = key in this.envConfig;
        if (!configExists) {
            this.logger.warn('The key was not found in config file 😕');
            return;
        }
        return this.envConfig[key];
    }
}
exports.EasyconfigService = EasyconfigService;
