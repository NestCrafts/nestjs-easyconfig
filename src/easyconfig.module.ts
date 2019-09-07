import { Module, DynamicModule } from '@nestjs/common';
import { EasyconfigService } from './easyconfig.service';
import { Config } from './config.interface';

@Module({})
export class EasyconfigModule {
  static register(options?: Config): DynamicModule {
    return {
      module: EasyconfigModule,
      providers: [
        {
          provide: EasyconfigService,
          useValue: new EasyconfigService(options),
        },
      ],
      exports: [EasyconfigService],
    };
  }
}
