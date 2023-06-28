import { Router, Request, Response } from 'express';
const router: Router = Router();
import authorize from '../../middleware/authorize';
import { loginLimiter } from '../../middleware/rateLimiter';
import validator from '../../middleware/validator';
import * as joi from 'joi';
import accountService from './services/account.service';
import userService from '../User/user.service';
import socialLoginService from './services/social-login.service';

export class AccountController {
  public router = router;
  private accountService = accountService;
  private userService = userService;
  private socialLoginService = socialLoginService;
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      '/login',
      loginLimiter,
      validator(
        joi.object({
          email: joi.string().required(),
          password: joi.string().required()
        })
      ),
      this.login
    );
    this.router.post(
      '/refresh',
      validator(
        joi.object({
          refresh_token: joi.string().required()
        })
      ),
      this.refresh
    );
    this.router.post('/logout', authorize(), this.logout);
    this.router.post('/login-google', this.loginGoogle);
    this.router.post('/login-social', this.loginSocial);
    this.router.post('/login-facebook', this.loginFacebook);
    this.router.get('/create-twitter-url', this.generateTwitterUrl);
    this.router.post('/login-twitter-callback', this.loginWithTwitter);
    this.router.get('/get-access-tokens', authorize(), this.getAccessToken);
    this.router.get('/me', authorize(), this.getMyProfile);
    this.router.post('/register', this.createAccount);
    this.router.get('/invitation/:token', this.getAccountInvitation);
  }

  /**
   * @apiDefine LoginSocial
   * @apiBody {String} provider
   * @apiBody {Object} user
   * @apiBody {String} user.given_name
   * @apiBody {String} user.family_name
   * @apiBody {String} user.email
   * @apiBody {String} user.name
   * @apiBody {String} user.scope
   * @apiBody {Boolean} user.email_verified
   *
   */

  /**
   * @api {post} /api/account/login-social Login with socials
   * @apiDescription Login with socials
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-social
   * @apiUse LoginSocial
   *
   */
  private loginSocial = this.socialLoginService.loginThirdParties;

  /**
   * @api {post} /api/account/register Create account
   * @apiDescription Register
   * @apiGroup Account
   * @apiSampleRequest /api/account/register
   * @apiBody {string} first_name
   * @apiBody {string} last_name
   * @apiBody {string} email
   * @apiBody {string} password
   *
   */
  private createAccount = this.userService.createUser;

  /**
   * @api {get} /api/account/invitation/:token Get invitation by token
   * @apiDescription Get Invitation by token
   * @apiGroup Account
   * @apiSampleRequest /api/account/invitation/:token
   *
   * @apiParam token user token
   */
  private getAccountInvitation = this.accountService.getAccountInvitation;

  /**
   * @api {get} /api/account/me Get my profile
   * @apiDescription Get my profile
   * @apiGroup Account
   * @apiSampleRequest /api/account/me
   *
   *
   * @apiPermission bearer token
   */
  private getMyProfile = this.accountService.getMyProfile;

  /**
   * @api {get} /api/account/get-access-tokens Get Tokens
   * @apiDescription Get tokens
   * @apiGroup Account
   * @apiSampleRequest /api/account/get-access-tokens
   *
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private getAccessToken = this.accountService.getAccessToken;

  /**
   * @api {post} /api/account/login Login
   * @apiDescription Login user
   * @apiGroup Account
   * @apiSampleRequest /api/account/login
   *
   * @apiBody {string} username
   * @apiBody {string} password
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private login = this.accountService.login;

  /**
   * @api {post} /api/account/login-google Login Google
   * @apiDescription Login user with google
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-google
   *
   * @apiBody {string} code
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private loginGoogle = this.socialLoginService.loginGoogle;

  /**
   * @api {post} /api/account/login-google Login Facebook
   * @apiDescription Login user with facebook
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-facebook
   *
   * @apiBody {string} token
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private loginFacebook = this.socialLoginService.loginFacebook;

  /**
   * @api {post} /api/account/login-twitter-callback Login Twitter callback
   * @apiDescription Login user with twitter callback
   * @apiGroup Account
   * @apiSampleRequest /api/account/login-twitter-callback
   *
   * @apiQuery {string} code
   * @apiQuery {string} state
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private loginWithTwitter = this.socialLoginService.loginWithTwitter;

  /**
   * @api {get} /api/account/create-twitter-url Login Twitter generate url
   * @apiDescription Login user with twitter
   * @apiGroup Account
   * @apiSampleRequest /api/account/create-twitter-url
   *
   * @apiPermission anonymous
   * @apiSuccess {String} token_type
   * @apiSuccess {String} access_token
   * @apiSuccess {String} expires_in
   * @apiSuccess {String} refresh_token
   */
  private generateTwitterUrl = this.socialLoginService.generateTwitterUrl;

  /**
   * @api {post} /api/account/refresh Refresh
   * @apiDescription Refresh access_token
   * @apiGroup Account
   * @apiSampleRequest /api/account/refresh
   *
   * @apiBody {string} refresh_token
   *
   * @apiUse bearer
   */
  private refresh = this.accountService.refreshToken;

  /**
   * @api {post} /api/account/logout Logout
   * @apiDescription Logout user and revoke access_token
   * @apiGroup Account
   * @apiSampleRequest /api/account/logout
   *
   * @apiPermission authorize
   * @apiUse bearer
   */
  private logout = this.accountService.logout;
}
