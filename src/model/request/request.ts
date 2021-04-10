
export interface Request {
    path: string;
    method: string;
    body: string | undefined;
    contentType: string | string[] | undefined;
    scheme: string;
    protocol: string;
    userAgent: string | string[] | undefined;
}
