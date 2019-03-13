import { Exception } from "signs-js";
import { injectable } from "inversify";
import fetch, { Headers } from "node-fetch";
import { merge, Dictionary } from "lodash";
import { IncomingHttpHeaders } from "http";

import { IHttpClient, HttpResponse } from "./IHttpClient";

@injectable()
export class HttpClient implements IHttpClient {

    get(url: string, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.performNetworkCall(url, "get", undefined, headers);
    }

    post(url: string, body: {}, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.performNetworkCall(url, "post", this.getJsonBody(body), this.addJsonHeaders(headers));
    }

    put(url: string, body: {}, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.performNetworkCall(url, "put", this.getJsonBody(body), this.addJsonHeaders(headers));
    }

    delete(url: string, headers?: Dictionary<string>): Promise<HttpResponse> {
        return this.performNetworkCall(url, "delete", undefined, headers);
    }

    private getJsonBody(body: {}) {
        return JSON.stringify(body);
    }

    private addJsonHeaders(headers: IncomingHttpHeaders) {
        return merge({}, {
            "Accept": "application/json",
            "Content-Type": "application/json"
        }, headers);
    };

    private async performNetworkCall(url: string, method: string, body?: any, headers?: Dictionary<string>): Promise<HttpResponse> {
        let response = await fetch(url, { method, body, headers });
        let responseHeaders = this.mapFrom(response.headers);

        let text = await response.text();
        let contentType = responseHeaders["content-type"] || "";
        let payload = contentType.match("application/json") ? JSON.parse(text) : text;

        if (response.status >= 400) throw new Exception(payload, response.status);
        else return new HttpResponse(payload, response.status, responseHeaders);;
    }

    private mapFrom(headers: Headers): Dictionary<string> {
        let mapped: Dictionary<string> = {};
        headers.forEach((v, n) => mapped[n] = v);
        return mapped;
    }
}

