declare module 'passport-twitter' {
  import passport from 'passport';
  import express from 'express';

  interface StrategyOption {
    consumerKey: string;
    consumerSecret: string;
    callbackURL: string;
    includeEmail?: boolean;
  }

  interface StrategyOptionWithRequest extends StrategyOption {
    passReqToCallback: true;
  }

  type VerifyFunction = (
    accessToken: string,
    tokenSecret: string,
    profile: any,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  interface StrategyInstance extends passport.Strategy {
    name: string;
  }

  class Strategy implements StrategyInstance {
    constructor(options: StrategyOption, verify: VerifyFunction);
    constructor(
      options: StrategyOptionWithRequest,
      verify: (
        req: express.Request,
        accessToken: string,
        tokenSecret: string,
        profile: any,
        done: (error: any, user?: any, info?: any) => void
      ) => void
    );
    name: string;
  }
}
