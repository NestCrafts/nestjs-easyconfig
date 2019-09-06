import { Config } from './config.interface';
export declare class EasyconfigService {
    readonly envConfig: {
        [key: string]: string;
    };
    constructor(filePath: Config);
    get(key: string): any;
}
