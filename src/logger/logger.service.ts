import { Injectable, Logger as FrameworkLogger, Scope } from '@nestjs/common';
import { Logger, createLogger } from 'winston';

import { TracingService, LoggerOptions } from '../logger';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService extends FrameworkLogger {
	private static tracingIdKey = 'CorrelationId';

	/**
	 *
	 * @param logger
	 */
	public constructor(
		private readonly logger: Logger,
		private readonly tracingService: TracingService,
	) {
		super();
	}

	/**
	 *
	 * @param message
	 * @param context
	 */
	public log(message: string, metadata?: any): void {
		if (this.logger.isInfoEnabled()) {
			this.logger.info(message, this.getCompleteMetadata(metadata));
		}
	}

	/**
	 *
	 * @param message
	 * @param trace
	 * @param context
	 */
	public error(message: string, trace?: any): void {
		this.logger.error(message, this.getCompleteMetadata(trace));
	}

	/**
	 *
	 * @param message
	 * @param context
	 */
	public warn(message: string, metadata?: any): void {
		if (this.logger.isWarnEnabled()) {
			this.logger.warn(message, this.getCompleteMetadata(metadata));
		}
	}

	/**
	 *
	 * @param message
	 * @param context
	 */
	public debug(message: string, metedata?: any): void {
		if (this.logger.isDebugEnabled()) {
			this.logger.debug(message, this.getCompleteMetadata(metedata));
		}
	}

	/**
	 *
	 * @param message
	 * @param context
	 */
	public verbose(message: string, metadata?: any): void {
		if (this.logger.isVerboseEnabled()) {
			this.logger.verbose(message, this.getCompleteMetadata(metadata));
		}
	}

	private getCompleteMetadata(metadata?: any): any {
		const tracingId = this.tracingService.context
			? this.tracingService.context.tracingId
			: undefined;
		const additional = metadata;
		const result = { additional, CorrelationId: tracingId };

		return result;
	}
}
