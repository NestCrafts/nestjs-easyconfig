import { Config } from './config.interface';
export declare class EasyconfigService {
    readonly sampleFile: string;
    private envConfig;
    private readonly logger;
    constructor(config?: Config);
    get(key: string): any;
    safeCheck: (userEnvFile: string[], config: string) => void;
    private tryGetConfigFromEnv;
}
