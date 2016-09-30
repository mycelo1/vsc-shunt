'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {

    const commandShuntLeft = vscode.commands.registerTextEditorCommand('extension.shunt_left', (textEditor, edit) => {
        doShuntLeft(textEditor, edit);
    });

    const commandShuntRight = vscode.commands.registerTextEditorCommand('extension.shunt_right', (textEditor, edit) => {
        doShuntRight(textEditor, edit);
    });

    const commandShuntSelect = vscode.commands.registerTextEditorCommand('extension.shunt_select', (textEditor, edit) => {
        doShuntSelect(textEditor, edit);
    });

    context.subscriptions.push(commandShuntLeft);
    context.subscriptions.push(commandShuntRight);
    context.subscriptions.push(commandShuntSelect);
}

export function deactivate() {
}

function doShuntLeft(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    const document = textEditor.document;
    const tabSize = checkTabSize(textEditor);
    const arrSelection: vscode.Selection[] = [];

    textEditor.edit(editBuilder => {

        textEditor.selections.forEach(selection => {

            let minSpaces = Number.MAX_SAFE_INTEGER;
            const arrLineLayout: { numLine: number, textLine: vscode.TextLine, firstNonSpace: number }[] = [];

            for (let lineIndex = selection.start.line; lineIndex <= selection.end.line; lineIndex++) {

                const lineAt = document.lineAt(lineIndex);
                const lineRange = lineAt.range;
                const lineLength = lineAt.text.length;

                if ((lineIndex < selection.end.line) || (lineRange.end.isBeforeOrEqual(selection.end) && (lineLength > 0))) {

                    const firstNonSpace = lineAt.text.search(/\S/);

                    if ((firstNonSpace >= 0) && (firstNonSpace < lineLength)) {

                        const numSpaces = calcLineSize(lineAt.text.substring(0, firstNonSpace), tabSize);

                        if (numSpaces < minSpaces) {
                            minSpaces = numSpaces;
                        }
                    }

                    arrLineLayout.push({
                        numLine: lineIndex,
                        textLine: lineAt,
                        firstNonSpace: firstNonSpace
                    });
                }
            }

            if (minSpaces < Number.MAX_SAFE_INTEGER) {

                const spaces = buildSpaces(minSpaces, tabSize);

                arrLineLayout.forEach(layout => {

                    const lineRange = layout.textLine.range;

                    if (layout.firstNonSpace < 0) {

                        if (layout.textLine.text.length > 0) {
                            editBuilder.delete(lineRange);
                        }

                        editBuilder.insert(lineRange.start, spaces);
                        arrSelection.push(new vscode.Selection(lineRange.start.translate(0, spaces.length), lineRange.start.translate(0, spaces.length)));
                    }
                    else {
                        const lineIndex = calcLineIndex(layout.textLine.text, minSpaces, tabSize);
                        arrSelection.push(new vscode.Selection(lineRange.start.translate(0, lineIndex), lineRange.start.translate(0, lineIndex)));
                    }
                });
            }
        });
    }).then(() => {

        textEditor.selections
        textEditor.selections = arrSelection;

    });
}

function doShuntRight(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    const document = textEditor.document;
    const tabSize = checkTabSize(textEditor);
    const arrSelection: vscode.Selection[] = [];

    textEditor.edit(editBuilder => {

        textEditor.selections.forEach(selection => {

            let maxLineLength = -1;
            const arrLineLayout: { numLine: number, length: number, lastCharPos: vscode.Position }[] = [];

            for (let lineIndex = selection.start.line; lineIndex <= selection.end.line; lineIndex++) {

                const lineAt = document.lineAt(lineIndex);
                const lineText = lineAt.text;
                const charactersInLine = lineAt.range.end.character - lineAt.range.start.character;
                const documentPos = lineAt.range.end;

                if ((lineIndex < selection.end.line) || (lineAt.range.end.isBeforeOrEqual(selection.end) && (charactersInLine > 0))) {

                    let lineColumns = calcLineSize(lineText, tabSize);

                    if (lineColumns > maxLineLength) {
                        maxLineLength = lineColumns;
                    }

                    arrLineLayout.push({
                        numLine: lineIndex,
                        length: lineColumns,
                        lastCharPos: documentPos
                    })
                }
            }

            arrLineLayout.forEach(layout => {

                if (layout.length < maxLineLength) {
                    let spaces = buildSpaces(maxLineLength - layout.length, tabSize, layout.length);
                    editBuilder.insert(layout.lastCharPos, spaces);
                }

                arrSelection.push(new vscode.Selection(new vscode.Position(layout.numLine, maxLineLength), new vscode.Position(layout.numLine, maxLineLength)));
            })
        });

    }).then(() => {

        textEditor.selections
        textEditor.selections = arrSelection;

    });
}

function doShuntSelect(textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) {

    const document = textEditor.document;
    const arrSelection: vscode.Selection[] = [];

    textEditor.edit(editBuilder => {

        textEditor.selections.forEach(selection => {

            for (let lineIndex = selection.start.line; lineIndex <= selection.end.line; lineIndex++) {

                const lineAt = document.lineAt(lineIndex);

                if ((lineIndex < selection.end.line) || (lineAt.range.end.isBeforeOrEqual(selection.end) && (lineAt.text.length > 0))) {
                    if (!lineAt.isEmptyOrWhitespace) {
                        arrSelection.push(new vscode.Selection(lineAt.range.start.translate(0, lineAt.firstNonWhitespaceCharacterIndex), lineAt.range.end));
                    }
                }
            }
        });

    }).then(() => {

        textEditor.selections
        textEditor.selections = arrSelection;

    });
}

function calcLineSize(text: string, tabSize: number): number {

    const charactersInLine = text.length;
    let lineColumns = 0;

    if (tabSize > 1) {

        let lineChar = 0;

        while (true) {

            let prevIndex = lineChar;
            lineChar = text.indexOf("\t", prevIndex);

            if (lineChar >= 0) {
                lineColumns += lineChar - prevIndex;
                lineColumns += tabSize - (lineColumns % tabSize);
                lineChar++;
            }
            else {
                lineColumns += charactersInLine - prevIndex;
                break;
            }
        }
    }
    else {
        lineColumns = charactersInLine;
    }

    return lineColumns;
}

function calcLineIndex(text: string, position: number, tabSize: number): number {

    if (tabSize > 1) {

        let lineColumns = 0;

        for (let textIndex = 0; textIndex < text.length; textIndex++) {

            if (text.charAt(textIndex) == "\t") {
                lineColumns += tabSize - (lineColumns % tabSize);
            }
            else {
                lineColumns++;
            }

            if (lineColumns == position) {
                return textIndex + 1;
            }
            else if (lineColumns > position) {
                return textIndex;
            }
        }

        return text.length;
    }
    else {
        return position;
    }
}

function buildSpaces(size: number, tabSize: number, startColumn: number = 0): string {

    if (!isNaN(tabSize) && (tabSize > 1)) {

        if ((startColumn % 4) > 0) {
            if (size < tabSize) {
                return ' '.repeat(size);
            }
            else {
                let remainder = size - (4 - (startColumn % 4))
                return "\t" + "\t".repeat(Math.trunc(remainder / tabSize)) + ' '.repeat(remainder % tabSize);
            }
        }
        else {
            return "\t".repeat(Math.trunc(size / tabSize)) + ' '.repeat(size % tabSize);
        }
    }
    else {
        return ' '.repeat(size);
    }
}

function checkTabSize(textEditor: vscode.TextEditor): number {

    if (textEditor.options.insertSpaces == true) {
        return 1;
    }
    else if ((!isNaN(Number(textEditor.options.tabSize))) && (textEditor.options.tabSize > 1)) {
        return Number(textEditor.options.tabSize);
    }
    else {
        return 1;
    }
}
