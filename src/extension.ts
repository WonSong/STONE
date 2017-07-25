'use strict';

import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import Auth from './auth';

export function activate(context: vscode.ExtensionContext) {

  const auth = new Auth();
  const mdEngine = new MarkdownIt();

  let disposable = vscode.commands.registerCommand('extension.sayHello', () => {

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);
    const rendered = mdEngine.render(selectedText);

    var htmlPayload =
      "<!DOCTYPE html>" +
      "<html>" +
      "<head>" +
      "    <title>A page created from basic HTML-formatted text (Node.js Sample)</title>" +
      "    <meta name=\"created\" content=\"" + new Date().toISOString() + "\">" +
      "</head>" +
      "<body>" + rendered + "</body>" +
      "</html>";
    auth.getAccessToken(htmlPayload);

});

context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}