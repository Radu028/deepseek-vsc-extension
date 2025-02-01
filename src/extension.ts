// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { text } from 'stream/consumers';
import * as vscode from 'vscode';
import ollama from 'ollama'; // Make sure to install the ollama package if not already installed

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('"deepseek-r1" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    'deepseek-r1.start',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'deepchat',
        'Deepseek Chat',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        }
      );

      panel.webview.html = getWebviewContent();

      panel.webview.onDidReceiveMessage(async (message: any) => {
        if (message.command === 'chat') {
          const userPrompt = message.text;
          let responseText = '';

          try {
            const streamResponse = await ollama.chat({
              model: 'deepseek-r1:32b',
              messages: [{ role: 'user', content: userPrompt }],
              stream: true,
            });

            for await (const part of streamResponse) {
              responseText += part.message.content;
              panel.webview.postMessage({
                command: 'chatResponse',
                text: responseText,
              });
            }
          } catch (err) {
            panel.webview.postMessage({
              command: 'chatResponse',
              text: `Error: ${String((err as Error).message)}`,
            });
          }
        }
      });
    }
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent() {
  return /*html*/ `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <style>
        /* Dark mode base styles */
        body, html {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: #1e1e1e;
          color: #d4d4d4;
        }
        .container {
          display: flex;
          flex-direction: column;
          max-width: 800px;
          margin: 2rem auto;
          background: #252526;
          border-radius: 8px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
          overflow: hidden;
        }
        header {
          background: linear-gradient(135deg, #6a11cb, #2575fc);
          color: #fff;
          padding: 1rem;
          text-align: center;
          position: relative;
        }
        .chat-area {
          padding: 1rem;
        }
        textarea {
          width: 100%;
          padding: 0.75rem;
          box-sizing: border-box;
          border: 1px solid #555;
          border-radius: 4px;
          resize: vertical;
          font-size: 1rem;
          background: #1e1e1e;
          color: #d4d4d4;
        }
        button {
          background-color: #2575fc;
          color: #fff;
          border: none;
          padding: 0.75rem 1.5rem;
          margin-top: 0.75rem;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #1a5bb8;
        }
        #response {
          border: 1px solid #555;
          padding: 0.75rem;
          margin-top: 1rem;
          border-radius: 4px;
          min-height: 100px;
          background: #1e1e1e;
          font-family: monospace;
          white-space: pre-wrap;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <h2>Deepseek VS Code Chat</h2>
        </header>
        <div class="chat-area">
          <textarea id="prompt" rows="3" placeholder="Type a message"></textarea>
          <button id="askBtn">Ask</button>
          <div id="response"></div>
        </div>
      </div>

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
