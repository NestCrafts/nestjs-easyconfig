"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const common_1 = require("@nestjs/common");
class EasyconfigService {
    constructor(config) {
        this.sampleFile = '.env.sample';
        this.logger = new common_1.Logger(EasyconfigService.name);
        this.safeCheck = (userEnvFile, config) => {
            const src = Object.keys(dotenv.parse(fs.readFileSync(path.resolve(config))));
            const missingKeys = src
                .filter(x => !userEnvFile.includes(x))
                .concat(userEnvFile.filter(x => !src.includes(x)));
            if (missingKeys.length !== 0) {
                this.logger.error(`MissingEnvVarsError: ${missingKeys} were defined in .env.example but are not present in the environment:
        This may cause the app to misbehave.`);
            }
            else {
                this.logger.debug('Config looks good :) ');
            }
        };
        if (!config.path && process.env.NODE_ENV) {
            this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)));
        }
        else if (!config.path && !process.env.NODE_ENV) {
            this.logger.error('Failed to load configs. Either pass file or NODE_ENV :(');
            return;
        }
        else {
            this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(config.path)));
        }
        if (config.safe) {
            this.safeCheck(Object.keys(this.envConfig), this.sampleFile);
        }
    }
    get(key) {
        const val = this.envConfig[key];
        if (!val) {
            this.logger.warn('The key was not found in config file :(');
            return;
        }
        if (/^\d+$/.test(val)) {
            return Number(val);
        }
        else if (/true|false$/.test(val.toLowerCase())) {
            return JSON.parse(val);
        }
        else {
            return val;
        }
    }
}
exports.EasyconfigService = EasyconfigService;
