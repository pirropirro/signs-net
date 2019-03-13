import { IncomingHttpHeaders } from "http";

export interface IHttpClient {
    get<T = any>(url: string, headers?: object): Promise<HttpResponse<T>>;
    post<T = any>(url: string, body: {}, headers?: object): Promise<HttpResponse<T>>;
    put<T = any>(url: string, body: {}, headers?: object): Promise<HttpResponse<T>>;
    delete<T = any>(url: string, headers?: object): Promise<HttpResponse<T>>;
}

export class HttpResponse<T = any> {
    constructor(public response: T, public status: number, public headers?: IncomingHttpHeaders) { }
}