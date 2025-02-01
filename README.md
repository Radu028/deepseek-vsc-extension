# Deepseek VSCode Chat Extension

Deepseek-VSC-Extension is a Visual Studio Code extension that provides an integrated chat interface for interacting with the Deepseek model. It utilizes the [ollama](https://www.npmjs.com/package/ollama) package to send chat messages to the Deepseek model and stream responses back to the user in real-time.

## Features

- **Interactive Chat:** Send chat commands and receive real-time responses directly within VS Code.
- **Streamed Responses:** Watch as the model's response is incrementally built and displayed.
- **Modern, Dark Mode UI:** Enjoy a sleek, dark-themed interface optimized for ease of use.
- **Command Palette Integration:** Activate the chat using the command `Deepseek: Start Chat` from the Command Palette.

## Requirements

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js](https://nodejs.org/) (required for compiling and running the extension)
- The [ollama](https://www.npmjs.com/package/ollama) package is included as a dependency in [`package.json`](package.json)
