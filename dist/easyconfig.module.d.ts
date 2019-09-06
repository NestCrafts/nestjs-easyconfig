import { DynamicModule } from '@nestjs/common';
import { Config } from './config.interface';
export declare class EasyconfigModule {
    static register(options?: Config): DynamicModule;
}
