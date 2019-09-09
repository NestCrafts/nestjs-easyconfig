"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const easyconfig_service_1 = require("./easyconfig.service");
describe('EasyconfigService', () => {
    const service = new easyconfig_service_1.EasyconfigService({ path: '.env.dev', safe: true });
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
    it('should be return int', () => {
        expect(service.get('KEYINT')).toEqual(100);
    });
    it('should be return boolean', () => {
        expect(service.get('KEYBOOL')).toEqual(true);
    });
    it('should be return string', () => {
        expect(service.get('KEYSTR')).toEqual('hello');
    });
});
describe('EasyconfigService with NODE_ENV', () => {
    process.env.NODE_ENV = 'dev';
    const service = new easyconfig_service_1.EasyconfigService({});
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
describe('EasyconfigService without NODE_ENV', () => {
    const service = new easyconfig_service_1.EasyconfigService({});
    it('should not be defined', () => {
        expect(service).toBeDefined();
    });
});
