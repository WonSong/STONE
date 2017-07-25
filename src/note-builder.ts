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

  addMarkDownContent(content: string) {

  }

  addCodeContent(language: string, codeContent: string) {
    let tokenized = hljs.highlight(language, codeContent).value;
    this.note = this.note.replace('{content}', '<pre>' + tokenized + '</pre>');
  }

  applyStyle() {
    this.note = this.note.replace(/class="hljs-meta"/g, 'style="color: #969896"');
    this.note = this.note.replace(/class="hljs-comment"/g, 'style="color: #969896"');

    this.note = this.note.replace(/class="hljs-string"/g, 'style="color: #df5000"');
    this.note = this.note.replace(/class="hljs-variable"/g, 'style="color: #df5000"');
    this.note = this.note.replace(/class="hljs-template-variable"/g, 'style="color: #df5000"');
    this.note = this.note.replace(/class="hljs-strong"/g, 'style="color: #df5000"');
    this.note = this.note.replace(/class="hljs-emphasis"/g, 'style="color: #df5000"');
    this.note = this.note.replace(/class="hljs-quote"/g, 'style="color: #df5000"');

    this.note = this.note.replace(/class="hljs-keyword"/g, 'style="color: #a71d5d"');
    this.note = this.note.replace(/class="hljs-selector-tag"/g, 'style="color: #a71d5d"');
    this.note = this.note.replace(/class="hljs-type"/g, 'style="color: #a71d5d"');

    this.note = this.note.replace(/class="hljs-literal"/g, 'style="color: #0086b3"');
    this.note = this.note.replace(/class="hljs-symbol"/g, 'style="color: #0086b3"');
    this.note = this.note.replace(/class="hljs-bullet"/g, 'style="color: #0086b3"');
    this.note = this.note.replace(/class="hljs-attribute"/g, 'style="color: #0086b3"');

    this.note = this.note.replace(/class="hljs-section"/g, 'style="color: #63a35c"');
    this.note = this.note.replace(/class="hljs-name"/g, 'style="color: #63a35c"');

    this.note = this.note.replace(/class="hljs-tag"/g, 'style="color: #333333"');

    this.note = this.note.replace(/class="hljs-title"/g, 'style="color: #795da3"');
    this.note = this.note.replace(/class="hljs-attr"/g, 'style="color: #795da3"');
    this.note = this.note.replace(/class="hljs-selector-id"/g, 'style="color: #795da3"');
    this.note = this.note.replace(/class="hljs-selector-class"/g, 'style="color: #795da3"');
    this.note = this.note.replace(/class="hljs-selector-attr"/g, 'style="color: #795da3"');
    this.note = this.note.replace(/class="hljs-selector-pseudo"/g, 'style="color: #795da3"');
  }

  create() {

    const note = this.note;
    const app = express();
    app.get('/', function (req, res) {
      fs.readFile(path.join(__dirname, '..', '..', 'src', 'client.js'), (err, data) => {
        res.send(`<html><head><input id="payload" type="hidden" value="${encodeURIComponent(note)}" /><script>${data}</script></head><html>`);
        server.close();
      });
    });
    const server = app.listen(1337, function () {
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