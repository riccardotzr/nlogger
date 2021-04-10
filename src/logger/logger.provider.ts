import { Provider } from '@nestjs/common';
import { Logger, createLogger } from 'winston';

import {
    LoggerOptions, 
    LoggerService,
    TracingService,
    WINSTON_MODULE_OPTIONS, 
    WINSTON_MODULE_PROVIDER, 
    TRACING_SERVICE_PROVIDER,
    WINSTON_MODULE_NEST_PROVIDER 
} from '../logger';

export function createLoggerProvider(options: LoggerOptions): Provider[] {
    return [
        {
            provide: WINSTON_MODULE_PROVIDER,
            useFactory: () => createLogger(options)
        },
        {
            provide: TRACING_SERVICE_PROVIDER,
            useFactory: () => new TracingService()
        },
        {
            provide: WINSTON_MODULE_NEST_PROVIDER,
            useFactory: (logger: Logger, tracingService: TracingService) => {
                return new LoggerService(logger, tracingService);
            },
            inject: [WINSTON_MODULE_PROVIDER, TRACING_SERVICE_PROVIDER]
        },
    ];
}