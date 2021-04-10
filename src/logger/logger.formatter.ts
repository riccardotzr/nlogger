import { format } from 'winston';

import { LogEntry, Host, Request, Response } from '../model';

export const jsonFormatter = format.printf(({ level, message, metadata }) => {
	const logEntry: LogEntry = {
		level: level,
		time: metadata.timestamp,
		correlationId: metadata.CorrelationId,
		message: message,
		error: metadata.additional.stack,
	};

	if (metadata.additional.request) {
		const request: Request = metadata.additional.request;
		const host: Host = metadata.additional.host;

		logEntry.http = { request: request };
		logEntry.host = host;

		if (metadata.additional.response) {
			const response: Response = metadata.additional.response;
			logEntry.http = { request: request, response: response };
		}
	}

	return JSON.stringify(logEntry, (key: string, value: any) => {
		return value === undefined ? null : value;
	});
});
