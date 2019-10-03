import { EasyconfigModule } from './easyconfig.module';

describe('Easyconfig module', () => {
  it('should be defined', () => {
    expect(EasyconfigModule.register({})).toBeDefined();
  });
});
