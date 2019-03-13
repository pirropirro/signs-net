import { IModule } from "signs-js";
import { interfaces } from "inversify";

import { HttpClient } from "./HttpClient";
import { IHttpClient } from "./IHttpClient";

export class NetModule implements IModule {
    modules(container: interfaces.Container): void {
        container.bind<IHttpClient>("IHttpClient").to(HttpClient);
    }
}
