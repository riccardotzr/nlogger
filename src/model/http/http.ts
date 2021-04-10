import { Request } from '../request';
import { Response } from '../response';

export interface Http {

    request: Request;
    
    response?: Response
}