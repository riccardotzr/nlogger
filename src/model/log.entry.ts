import { Http } from './http';
import { Host } from './host';

export interface LogEntry {
    level: string;
    time: Date,
    correlationId: string;
    message: string;
    error: any;
    http?: Http;
    host?: Host;
}