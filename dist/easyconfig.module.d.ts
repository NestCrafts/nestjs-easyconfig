import { DynamicModule } from '@nestjs/common';
import { FileConfig } from './config.interface';
export declare class EasyconfigModule {
    static register(options?: FileConfig): DynamicModule;
}
