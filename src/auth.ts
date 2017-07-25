import * as request from 'request';
import * as opn from 'opn';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';

export default class LiveConnectClient {

  clientId: string;
  redirectUrl: string;
  oAuthAuthroizeUrl: string;
  oAuthTokenUrl: string;

  constructor() {
    this.oAuthAuthroizeUrl = 'https://login.live.com/oauth20_authorize.srf';
    this.oAuthTokenUrl = 'https://login.live.com/oauth20_token.srf';
    this.clientId = 'ad4f3512-b60e-47f8-96d8-5d52faeebd35';
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
      'response_type': 'token'
    });
    return this.oAuthAuthroizeUrl + "?" + query;
  }

  getAccessToken(htmlPayLoad) {

    return new Promise<string>((resolve, reject) => {
      const app = express();
      app.get('/', function (req, res) {
        fs.readFile(path.join(__dirname, '..', '..', 'src', 'client.js'), (err, data) => {
          res.send( `<html><head><input id="payload" type="hidden" value="${encodeURIComponent(htmlPayLoad)}" /><script>${data}</script></head><html>`);
        });
      }).listen(1337, function () {
        opn(this.getAuthUrl());
      }.bind(this));
    });

  }

}