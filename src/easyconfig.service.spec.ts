import { Test, TestingModule } from '@nestjs/testing';
import { EasyconfigService } from './easyconfig.service';

describe('EasyconfigService', () => {
  let service: EasyconfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EasyconfigService],
    }).compile();

    service = module.get<EasyconfigService>(EasyconfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
