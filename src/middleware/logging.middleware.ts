import { Injectable, Inject, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

import { HttpInformationLog } from '../model';
import {
	LoggerService,
	TracingService,
	TRACING_SERVICE_PROVIDER,
	WINSTON_MODULE_NEST_PROVIDER,
} from '../logger';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
	private static contentTypeKey = 'content-type';
	private static userAgentKey = 'user-agent';
	private static forwardedHostnameKey = 'x-forwarded-host';
	private static tracingIdKey = 'x-correlation-id';

	constructor(
		@Inject(TRACING_SERVICE_PROVIDER) private readonly service: TracingService,
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
	) {}

	use(req: Request, res: Response, next: NextFunction) {
		let correlationId = req.headers['x-correlation-id'] as string;

		if (!correlationId) {
			correlationId = uuid();
		}

		this.service.context = { tracingId: correlationId };

		const startTime = process.hrtime();

		const logEntry: HttpInformationLog = {
			request: {
				path: req.originalUrl,
				method: req.method,
				body: Object.keys(req.body).length > 0 ? req.body : undefined,
				contentType: req.headers[LoggingMiddleware.contentTypeKey]
					? req.headers[LoggingMiddleware.contentTypeKey]
					: undefined,
				scheme: req.protocol,
				protocol: `${req.protocol.toUpperCase()}/${req.httpVersion}`,
				userAgent: req.headers[LoggingMiddleware.userAgentKey]
					? req.headers[LoggingMiddleware.userAgentKey]
					: undefined,
			},
			host: {
				hostname: req.hostname,
				forwardedHostname: req.headers[LoggingMiddleware.forwardedHostnameKey]
					? (req.headers[LoggingMiddleware.forwardedHostnameKey] as string)
					: undefined,
				ip: req.ip,
			},
		};

		this.logger.log('Incoming Request', logEntry);

		res.on('finish', () => {
			const elapsedTime = process.hrtime(startTime);
			const elapsedTimeInMs = elapsedTime[0] * 1e3 + elapsedTime[1] * 1e-6;

			logEntry.response = {
				statusCode: res.statusCode,
				responseTime: elapsedTimeInMs,
				bytes:
					parseInt(res.getHeader('content-length') as string, 10) || undefined,
			};

			this.logger.log('Completed Request', logEntry);
		});

		next();
	}
}
