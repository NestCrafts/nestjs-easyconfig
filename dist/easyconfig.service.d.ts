import { Config } from './config.interface';
import * as debug from 'debug';
export declare class EasyconfigService {
    readonly envConfig: {
        [key: string]: string;
    };
    readonly errorLog: debug.Debugger;
    constructor(filePath?: Config);
    get(key: string): any;
}
