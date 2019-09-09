import { Config } from './config.interface';
export declare class EasyconfigService {
    readonly envConfig: {
        [key: string]: string;
    };
    readonly sampleFile: string;
    private readonly logger;
    constructor(config?: Config);
    get(key: string): any;
    safeCheck: (userEnvFile: string[], config: string) => void;
}
