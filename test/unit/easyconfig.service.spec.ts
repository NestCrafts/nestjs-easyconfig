import { EasyconfigService } from '../../src/easyconfig.service';
import { EasyconfigError } from '../../src/easyconfig.error';
import { Logger, LoggerService } from '@nestjs/common';

describe('EasyconfigService', () => {
	const service: EasyconfigService = new EasyconfigService({
		path: '.env.dev',
		safe: true,
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should be return int', () => {
		expect(service.get('KEYINT')).toEqual(100);
	});

	it('should be return a true boolean', () => {
		expect(service.get('KEYBOOLTRUE')).toEqual(true);
	});

	it('should be return a false boolean', () => {
		expect(service.get('KEYBOOLFALSE')).toEqual(false);
	});

	it('should be return string', () => {
		expect(service.get('KEYSTR')).toEqual('hello');
	});

	it('should be return array', () => {
		expect(service.get('ARR')).toEqual([1, 'foo', true, false]);
	});

	it('should throw error when something goes wrong', () => {
		try {
			const anotherService: EasyconfigService = new EasyconfigService({
				path: '.env.dev',
				safe: true,
			});

			Logger.log(anotherService.get('KEYSTR'))
		} catch (err) {
			expect(err).toBeInstanceOf(EasyconfigError);
		}
	});
});

describe('EasyconfigService with NODE_ENV', () => {
	process.env.NODE_ENV = 'dev';
	const service: EasyconfigService = new EasyconfigService({});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});

describe('EasyconfigService without NODE_ENV', () => {
	const service: EasyconfigService = new EasyconfigService({});

	it('should not be defined', () => {
		expect(service).toBeDefined();
	});
});

describe('it should work with the logger option', () => {
	it.each([
		new Logger(EasyconfigService.name)
	])('it should work with any logger', (logger: LoggerService) => {
		const service = new EasyconfigService({ logger, path: '.env.dev', safe: true });
		expect(service).toBeDefined();
	});
});
