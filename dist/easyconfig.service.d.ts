import { Config } from './config.interface';
import * as debug from 'debug';
export declare class EasyconfigService {
    readonly envConfig: {
        [key: string]: string;
    };
    readonly errorLog: debug.Debugger;
    readonly sampleFile: string;
    constructor(config?: Config);
    get(key: string): any;
    safeCheck: (userEnvFile: any, config: any) => void;
}
