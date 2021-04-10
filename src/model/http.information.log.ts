import { Request, Response, Host } from '../model';

export interface HttpInformationLog {
	host: Host;
	request: Request;
	response?: Response;
}
