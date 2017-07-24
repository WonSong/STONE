'use strict';

import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import LiveConnectClient from './liveconnect-client';

export function activate(context: vscode.ExtensionContext) {

    const liveConnectClient = new LiveConnectClient();
    const mdEngine = new MarkdownIt();

    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);
        const rendered = mdEngine.render(selectedText);

        liveConnectClient.requestAccessToken({}, (response) => {
            vscode.window.showInformationMessage(response);
        });




    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}