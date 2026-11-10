import { ConfigService } from '@nestjs/config';
import { Profile, Strategy } from 'passport-google-oauth20';
export type GoogleUser = {
    googleId: string;
    email?: string;
    emailVerified: boolean;
    username?: string;
    avatarUrl?: string;
};
declare const GoogleStrategy_base: new (...args: [options: import("passport-google-oauth20").StrategyOptionsWithRequest] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptions] | [options: import("passport-google-oauth20").StrategyOptionsWithRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class GoogleStrategy extends GoogleStrategy_base {
    constructor(config: ConfigService);
    validate(_accessToken: string, _refreshToken: string, profile: Profile): GoogleUser;
}
export {};
