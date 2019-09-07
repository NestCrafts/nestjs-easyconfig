"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const debug = require("debug");
class EasyconfigService {
    constructor(config) {
        this.errorLog = debug('warning');
        this.sampleFile = '.env.sample';
        this.safeCheck = (userEnvFile, config) => {
            const src = Object.keys(dotenv.parse(fs.readFileSync(path.resolve(config))));
            const missingKeys = src
                .filter(x => !userEnvFile.includes(x))
                .concat(userEnvFile.filter(x => !src.includes(x)));
            this
                .errorLog(`MissingEnvVarsError: ${missingKeys} were defined in .env.example but are not present in the environment:
        This may cause the app to misbehave.`);
        };
        debug.enable('warning');
        if (!config.path && process.env.NODE_ENV) {
            this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)));
        }
        else if (!config.path && !process.env.NODE_ENV) {
            this.errorLog('Failed to load configs. Either pass file or NODE_ENV :(');
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
            this.errorLog('The key was not found in config file :(');
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
