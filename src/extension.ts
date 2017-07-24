'use strict';

import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import Auth from './auth';
import OneNote from './onenote';

export function activate(context: vscode.ExtensionContext) {

    const auth = new Auth();
    const oneNote = new OneNote();
    const mdEngine = new MarkdownIt();

    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const rendered = mdEngine.render(selectedText);

        auth
            .getAuthCode()
            .then(auth.getAccessToken.bind(auth))
            .then((token) => {
                vscode.window.showInformationMessage(token.toString());


                var htmlPayload =
                    "<!DOCTYPE html>" +
                    "<html>" +
                    "<head>" +
                    "    <title>A page created from basic HTML-formatted text (Node.js Sample)</title>" +
                    "    <meta name=\"created\" content=\"" + new Date().toISOString() + "\">" +
                    "</head>" +
                    "<body>" +
                    "    <p>This is a page that just contains some simple <i>formatted</i>" +
                    "    <b>text</b></p>" +
                    "</body>" +
                    "</html>";

                oneNote.sendToOneNote.call(oneNote, token['access_token'], htmlPayload);

            });

    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}