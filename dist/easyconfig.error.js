"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EasyconfigError = void 0;
class EasyconfigError extends Error {
    constructor(err) {
        super(`Failed to load config ${err.message} ${err.stack}`);
    }
}
exports.EasyconfigError = EasyconfigError;
