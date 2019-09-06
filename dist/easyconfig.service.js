"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const debug = require("debug");
class EasyconfigService {
    constructor(filePath) {
        this.errorLog = debug('warning');
        debug.enable('warning');
        if (!filePath && process.env.NODE_ENV) {
            this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(`.env.${process.env.NODE_ENV}`)));
        }
        else if (!filePath && !process.env.NODE_ENV) {
            this.errorLog('Failed to load configs. Either pass file or NODE_ENV :(');
            return;
        }
        else {
            this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(filePath.path)));
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
