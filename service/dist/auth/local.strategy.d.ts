import { Strategy } from 'passport-local';
import { ModuleRef } from '@nestjs/core';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private moduleRef;
    constructor(moduleRef: ModuleRef);
    validate(request: Request, username: string, password: string): Promise<any>;
}
export {};
