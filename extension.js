const vscode = require('vscode');
const { exec } = require('child_process');

function activate(context) {
    let diagnosticCollection = vscode.languages.createDiagnosticCollection("securityAnalyzer");

    vscode.workspace.onDidOpenTextDocument(analyzeDocument);
    vscode.workspace.onDidChangeTextDocument(event => analyzeDocument(event.document));

    function analyzeDocument(document) {
        if (document.languageId !== "javascript") return;  // Scan only JavaScript files

        let diagnostics = [];
        let text = document.getText();

        let rules = [
            { regex: /(["'`])\s*\+\s*[\w\d_$]+\s*\+\s*\1/g, message: "⚠️ Potential SQL Injection detected. Use parameterized queries." },
            { regex: /innerHTML\s*=\s*[^;]+;/g, message: "⚠️ Potential XSS detected. Use textContent instead of innerHTML." }
        ];
        

        rules.forEach(({ regex, message }) => {
            let match;
            while ((match = regex.exec(text)) !== null) {
                let range = new vscode.Range(
                    document.positionAt(match.index),
                    document.positionAt(match.index + match[0].length)
                );
                let diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Warning);
                diagnostics.push(diagnostic);
            }
        });

        diagnosticCollection.set(document.uri, diagnostics);
    }

    vscode.languages.registerCodeActionsProvider("javascript", {
        provideCodeActions(document, range, context, token) {
            let fixActions = [];

            context.diagnostics.forEach(diagnostic => {
                if (diagnostic.message.includes("SQL Injection")) {
                    let fix = new vscode.CodeAction("💡 Use parameterized queries", vscode.CodeActionKind.QuickFix);
                    fix.edit = new vscode.WorkspaceEdit();
                    fix.edit.replace(document.uri, range, "db.query('SELECT * FROM users WHERE id = ?', [userId])");
                    fixActions.push(fix);
                }

                if (diagnostic.message.includes("XSS")) {
                    let fix = new vscode.CodeAction("💡 Use textContent instead of innerHTML", vscode.CodeActionKind.QuickFix);
                    fix.edit = new vscode.WorkspaceEdit();
                    fix.edit.replace(document.uri, range, "element.textContent = userInput;");
                    fixActions.push(fix);
                }
            });

            return fixActions;
        }
    });

    let scanCommand = vscode.commands.registerCommand("extension.runSecurityScan", () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            analyzeDocument(editor.document);
            vscode.window.showInformationMessage("✅ Security scan completed.");
        }
    });

    let dependencyCheckCommand = vscode.commands.registerCommand("extension.checkDependencies", () => {
        exec('npm audit --json', (err, stdout, stderr) => {
            if (err) {
                vscode.window.showErrorMessage("❌ Error running dependency check.");
                return;
            }

            try {
                const vulnerabilities = JSON.parse(stdout).vulnerabilities;
                if (Object.keys(vulnerabilities).length > 0) {
                    vscode.window.showWarningMessage("⚠️ Vulnerabilities found in dependencies!");
                } else {
                    vscode.window.showInformationMessage("✅ No vulnerabilities found.");
                }
            } catch (error) {
                vscode.window.showErrorMessage("❌ Failed to parse npm audit results.");
            }
        });
    });

    context.subscriptions.push(scanCommand, dependencyCheckCommand);
}

function deactivate() {}

module.exports = { activate, deactivate };