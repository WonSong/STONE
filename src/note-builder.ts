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
    this.mdEngine = new MarkdownIt({
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (__) { }
        }
        return '';
      }
    });
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
    this.note = this.note.replace('{content}', this.mdEngine.render(content));
  }

  addCodeContent(language: string, codeContent: string) {
    let tokenized = hljs.highlight(language, codeContent).value;
    this.note = this.note.replace('{content}', '<pre>' + tokenized + '</pre>');
  }

  applyStyle(colorTheme) {
    this.note =
      this.note
        .replace(/class="hljs-meta"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.meta || colorTheme.default};"`)
        .replace(/class="hljs-comment"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.comment || colorTheme.default};"`)
        .replace(/class="hljs-string"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.string || colorTheme.default};"`)
        .replace(/class="hljs-variable"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.variable || colorTheme.default};"`)
        .replace(/class="hljs-template-variable"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.templateVariable || colorTheme.default};"`)
        .replace(/class="hljs-strong"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; : ${colorTheme.strong || colorTheme.default};`)
        .replace(/class="hljs-emphasis"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.emphasis || colorTheme.default};`)
        .replace(/class="hljs-quote"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.quote || colorTheme.default};"`)
        .replace(/class="hljs-keyword"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.keyword || colorTheme.default};"`)
        .replace(/class="hljs-selector-tag"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.selectorTag || colorTheme.default};"`)
        .replace(/class="hljs-type"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.type || colorTheme.default};"`)
        .replace(/class="hljs-literal"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.literal || colorTheme.default};"`)
        .replace(/class="hljs-symbol"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.symbol || colorTheme.default};"`)
        .replace(/class="hljs-bullet"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.bullet || colorTheme.default};"`)
        .replace(/class="hljs-attribute"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.attribute || colorTheme.default};"`)
        .replace(/class="hljs-section"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.section || colorTheme.default};"`)
        .replace(/class="hljs-name"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.name || colorTheme.default};"`)
        .replace(/class="hljs-tag"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.tag || colorTheme.default};"`)
        .replace(/class="hljs-title"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.title || colorTheme.default};"`)
        .replace(/class="hljs-attr"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.attr || colorTheme.default};"`)
        .replace(/class="hljs-selector-id"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.selectorId || colorTheme.default};"`)
        .replace(/class="hljs-selector-class"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.selectorClass || colorTheme.default};"`)
        .replace(/class="hljs-selector-attr"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.selectorAttr || colorTheme.default};"`)
        .replace(/class="hljs-selector-pseudo"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.selectorPseudo || colorTheme.default};"`)
        .replace(/class="hljs-.*?"/g, `style="font-family: ${colorTheme.fontFamily}; font-size: ${colorTheme.fontSize}px; color: ${colorTheme.default};"`);
  }

  create() {

    const note = this.note;
    const app = express();
    app.get('/', function (req, res) {
      const styles = fs.readFileSync(path.join(__dirname, 'client.css'));
      const scripts = fs.readFileSync(path.join(__dirname, 'client.js'));
      const html = [
        '<html>',
        '  <head>',
        `    <style>${styles}</style>`,
        '  </head>',
        '  <body>',
        '    <div class="header">',
        '      <div class="brand">Project S.T.O.N.E</div>',
        '      <ul class="menus">',
        '        <li><a id="app-link">Open in App</a></li>',
        '      </ul>',
        '    </div>',
        '    <div id="preview"></div>',
        `    <input type="hidden" id="payload" value="${encodeURIComponent(note)}" />`,
        `    <script>${scripts}</script>`,
        '  </body>',
        '</html>'
      ]
      res.send(html.join(''));
      server.close();
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