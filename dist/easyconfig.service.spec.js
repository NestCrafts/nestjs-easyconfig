"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const easyconfig_service_1 = require("./easyconfig.service");
describe('EasyconfigService', () => {
    let service;
    beforeEach(() => __awaiter(this, void 0, void 0, function* () {
        const module = yield testing_1.Test.createTestingModule({
            providers: [easyconfig_service_1.EasyconfigService],
        }).compile();
        service = module.get(easyconfig_service_1.EasyconfigService);
    }));
    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
