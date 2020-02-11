import { LoggerService } from '@nestjs/common';
export interface Config {
    path?: string;
    sampleFilePath?: string;
    safe?: boolean;
    debug?: boolean;
    encoding?: string;
    logger?: LoggerService;
}
