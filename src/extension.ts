// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from "stream/consumers";
import * as vscode from "vscode";
import ollama from "ollama"; // Make sure to install the ollama package if not already installed

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('"deepseek-r1" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    const disposable = vscode.commands.registerCommand("deepseek-r1.start", () => {
        const panel = vscode.window.createWebviewPanel(
            "deepchat",
            "Deepseek Chat",
            vscode.ViewColumn.One,
            {
                enableScripts: true,
            }
        );

        panel.webview.html = getWebviewContent();

        panel.webview.onDidReceiveMessage(async (message: any) => {
            if (message.command === "chat") {
                const userPrompt = message.text;
                let responseText = "";

                try {
                    const streamResponse = await ollama.chat({
                        model: "deepseek-r1:latest",
                        messages: [{ role: "user", content: userPrompt }],
                        stream: true,
                    });

                    for await (const part of streamResponse) {
                        responseText += part.message.content;
                        panel.webview.postMessage({
                            command: "chatResponse",
                            text: responseText,
                        });
                    }
                } catch (err) {
                    panel.webview.postMessage({
                        command: "chatResponse",
                        text: `Error: ${String((err as Error).message)}`,
                    });
                }
            }
        });
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 1rem;
            }

            #prompt {
                width: 100%;
                box-sizing: border-box;
            }

            #response {
                border: 1px solid #ccc;
                margin-top: 1rem;
                padding: 0.5rem;
                min-height: 100px;
            }
        </style>
    </head>
    <body>
        <h2>Deepseek VS Code Chat</h2>
        <textarea id="prompt" rows="3" placeholder="Type a message"></textarea><br />
        <button id="askBtn">Ask</button>
        <div id="response"></div>

        <script>
            const vscode = acquireVsCodeApi();

            document.getElementById('askBtn').addEventListener('click', () => {
                const text = document.getElementById('prompt').value;
                vscode.postMessage({
                    command: 'chat',
                    text
                });
            });

            window.addEventListener('message', event => {
                const message = event.data;
                if (message.command === 'chatResponse') {
                    document.getElementById('response').innerText = message.text;
                }
            });
        </script>
    </body>
    </html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
