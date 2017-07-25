'use strict';

import * as vscode from 'vscode';
import * as MarkdownIt from 'markdown-it';
import NoteBuilder from './note-builder';

export function activate(context: vscode.ExtensionContext) {

  let noteBuilder = null;

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.sendPageToOneNote',
      () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("You must have a document open to send to OneNote.");
          return;
        }

        noteBuilder = new NoteBuilder();
        noteBuilder.addTitle('Sent from Visual Studio Code: ' + editor.document.fileName.replace(/^.*[\\\/]/, ''));
        noteBuilder.addCodeContent(editor.document.languageId, editor.document.getText())
        noteBuilder.applyStyle();
        noteBuilder.create();

      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('extension.sendSelectionToOneNote',
      () => {

        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("You must have a document open to send to OneNote.");
          return;
        }

        const selection = editor.selection;
        const selectedText = editor.document.getText(selection);

        if (selectedText.length === 0) {
          vscode.window.showErrorMessage("You must have text selected to send to OneNote.");
          return;
        }

        noteBuilder = new NoteBuilder();
        noteBuilder.addTitle('Sent from Visual Studio Code: Part of ' + editor.document.fileName.replace(/^.*[\\\/]/, ''));
        noteBuilder.addCodeContent(editor.document.languageId, selectedText);
        noteBuilder.applyStyle();
        noteBuilder.create();

      }
    )
  );

}

export function deactivate() {
}