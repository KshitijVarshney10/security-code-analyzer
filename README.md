# Security Code Analyzer (VS Code Extension)

Security Code Analyzer is a VS Code extension that scans JavaScript files in real-time to detect potential security vulnerabilities like SQL Injection and XSS. It provides inline warnings, quick fix suggestions, and allows manual security scans to enhance code security.

## Features
- ✅ Real-time scanning of JavaScript files
- ⚠️ Detects SQL Injection & XSS vulnerabilities
- 🔧 Provides quick fix suggestions
- 🛡️ Runs manual security scans via Command Palette
- 📦 Checks npm dependencies for vulnerabilities

## How to Use
1. Install the extension.
2. Open a JavaScript file.
3. Press `Ctrl + Shift + P` → Select `Run Security Scan`
4. Fix security warnings with quick fixes.

## Commands
- **Run Security Scan** (`Ctrl + Shift + P → Run Security Scan`)
- **Check Dependencies** (`Ctrl + Shift + P → Check Dependencies`)

## Installation
To install manually:
```sh
vsce package
code --install-extension security-code-analyzer.vsix
