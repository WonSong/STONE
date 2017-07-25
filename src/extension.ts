'use strict';

import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import NoteBuilder from './note-builder';

export function activate(context: vscode.ExtensionContext) {

  let disposable = vscode.commands.registerCommand('extension.sayHello', () => {

    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    const noteBuilder = new NoteBuilder();
    noteBuilder.addTitle('My Test Note');
    noteBuilder.addContent(selectedText);
    noteBuilder.create();

  });

  context.subscriptions.push(disposable);

}

export function deactivate() {
}