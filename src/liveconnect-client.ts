import * as request from 'request';

export default class LiveConnectClient {

  clientId: string;
  redirectUrl: string;
  oAuthAuthroizeUrl: string;
  oAuthTokenUrl: string;

  constructor() {
    this.oAuthAuthroizeUrl = 'https://login.microsoftonline.com/common/oauth2/nativeclient',
    this.oAuthTokenUrl = 'https://login.live.com/oauth20_token.srf';
    this.clientId = 'ad4f3512-b60e-47f8-96d8-5d52faeebd35';
    this.redirectUrl = 'urn:ietf:wg:oauth:2.0:oob';
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
    var scopes = ['wl.signin', 'wl.basic', 'office.onenote_create'];
    var query = this.toQueryString({
      'client_id': this.clientId,
      'scope': scopes.join(' '),
      'redirect_uri': this.redirectUrl,
      'display': 'popup',
      'locale': 'en',
      'response_type': 'code'
    });
    return this.oAuthAuthroizeUrl + "?" + query;
  }

  requestAccessToken(data, callback) {
    request.get(this.getAuthUrl(), (error, response, body) => {
      callback(body);
    });
  }

}