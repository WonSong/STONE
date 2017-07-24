import * as request from 'request';
import * as opn from 'opn';
import * as express from 'express';

export default class LiveConnectClient {

  clientId: string;
  clientSecret: String;
  redirectUrl: string;
  oAuthAuthroizeUrl: string;
  oAuthTokenUrl: string;

  constructor() {
    this.oAuthAuthroizeUrl = 'https://login.live.com/oauth20_authorize.srf';
    this.oAuthTokenUrl = 'https://login.live.com/oauth20_token.srf';
    this.clientId = 'ad4f3512-b60e-47f8-96d8-5d52faeebd35';
    this.clientSecret = '5FcP3xrekMYohDbKW3Xm5aa';
    this.redirectUrl = 'http://localhost:1337';
  }

  toQueryString(obj) {
    var str = [];
    for (var p in obj)
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
      }
    return str.join("&");
  }

  getAuthUrl() {
    var scopes = ['wl.signin', 'office.onenote_create'];
    var query = this.toQueryString({
      'client_id': this.clientId,
      'scope': scopes.join(' '),
      'redirect_uri': this.redirectUrl,
      'response_type': 'code'
    });
    return this.oAuthAuthroizeUrl + "?" + query;
  }

  getAuthCode() {

    return new Promise<string>((resolve, reject) => {
      const app = express();
      app.get('/', function (req, res) {
        resolve(req.query.code);
        res.send('You may close this window.')
      }).listen(1337, function () {
        opn(this.getAuthUrl());
      }.bind(this));
    });

  }

  getAccessToken(code) {

    return new Promise<object>((resolve, reject) => {
      request.post({
        url: this.oAuthTokenUrl,
        form: {
          'client_id': this.clientId,
          'client_secret': this.clientSecret,
          'redirect_uri': this.redirectUrl,
          'code': code,
          'grant_type': 'authorization_code'
        }
      }, function (error, response, body) {
        if (error) {
          reject(error);
        } else {
          resolve(JSON.parse(body));
        }
      });
    });

  }

}