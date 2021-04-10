import { DynamicModule, Module } from '@nestjs/common';

import { LoggerOptions, createLoggerProvider } from '../logger';

@Module({})
export class LoggerModule {
    static forRoot(options: LoggerOptions): DynamicModule {
        const providers = createLoggerProvider(options);
        
        return {
            module: LoggerModule,
            providers: providers,
            exports: providers
        }
    }
}
