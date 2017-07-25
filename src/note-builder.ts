import * as opn from 'opn';
import * as express from 'express';
import * as path from 'path';
import * as fs from 'fs';
import * as MarkdownIt from 'markdown-it';
import * as hljs from 'highlightjs';
import { toQueryString } from './util';

export default class NoteBuilder {

  clientId: string;
  redirectUrl: string;
  oAuthAuthroizeUrl: string;
  note: string;
  _title: string;
  _content: Array<string>;
  mdEngine: any; 

  constructor() {

    this.oAuthAuthroizeUrl = 'https://login.live.com/oauth20_authorize.srf';
    this.clientId = 'ad4f3512-b60e-47f8-96d8-5d52faeebd35';
    this.redirectUrl = 'http://localhost:1337';
    this.mdEngine = new MarkdownIt();
    this.note = [
      "<!DOCTYPE html>",
      "<html>",
      "<head>",
      "<title>{title}</title>",
      "<meta name=\"created\" content=\"" + new Date().toISOString() + "\">",
      "</head>",
      "<body>{content}</body>",
      "</html>"
    ].join('');

  }

  addTitle(title: string) {
    this.note = this.note.replace('{title}', title);
  }

  addContent(content: string) {
    let test = hljs.highlight('javascript', content).value;
    test = test.replace('class="hljs-keyword"', 'style="color: red"');
    this.note = this.note.replace('{content}', '<pre>' + test + '</pre>');
  }

  addMarkDownContent(content: string) {

  }

  addCodeContent(language: string, codeContent: string) {
    
  }

  create() {

    const note = this.note;
    const app = express();
    app.get('/', function (req, res) {
      fs.readFile(path.join(__dirname, '..', '..', 'src', 'client.js'), (err, data) => {
        res.send(`<html><head><input id="payload" type="hidden" value="${encodeURIComponent(note)}" /><script>${data}</script></head><html>`);
      });
    }).listen(1337, function () {
      var scopes = ['wl.signin', 'office.onenote_create'];
      var query = toQueryString({
        'client_id': this.clientId,
        'scope': scopes.join(' '),
        'redirect_uri': this.redirectUrl,
        'response_type': 'token'
      });
      opn(this.oAuthAuthroizeUrl + "?" + query);
    }.bind(this));

  }

}