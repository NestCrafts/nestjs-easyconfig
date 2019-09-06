"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
class EasyconfigService {
    constructor(filePath) {
        this.envConfig = dotenv.parse(fs.readFileSync(path.resolve(filePath.path)));
    }
    get(key) {
        const val = this.envConfig[key];
        if (!val) {
            throw new Error('The key was not found in config file :(');
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
