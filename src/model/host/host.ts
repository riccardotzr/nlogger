export interface Host {
    hostname: string;
    forwardedHostname: string | undefined;
    ip: string;
}