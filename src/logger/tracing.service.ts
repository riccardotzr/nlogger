import { Injectable, Scope } from "@nestjs/common";

import { TracingContext } from '../model';

@Injectable({ scope: Scope.REQUEST})
export class TracingService {

    private _context: TracingContext | undefined;

    public constructor() {
        this._context = undefined;
    }

    get context(): TracingContext {
        return this.context;
    }

    set context(context: TracingContext) {
        this._context = context;
    }
}