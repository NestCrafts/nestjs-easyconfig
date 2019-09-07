import { Module, DynamicModule } from '@nestjs/common';
import { EasyconfigService } from './easyconfig.service';
import { FileConfig } from './fileconfig.interface';

@Module({})
export class EasyconfigModule {
  static register(options?: FileConfig): DynamicModule {
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
