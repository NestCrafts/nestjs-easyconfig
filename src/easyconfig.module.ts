import type { DynamicModule } from "@nestjs/common";
import { Global, Module } from "@nestjs/common";
import { EasyconfigService } from "./easyconfig.service";
import type { Config } from "./config.interface";

@Global()
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
