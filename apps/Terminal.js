// Terminal Application
class Terminal {
    constructor(os) {
        this.os = os;
    }

    getAppInfo() {
        return {
            title: 'Terminal',
            icon: '⌘',
            content: this.createContent()
        };
    }

    createContent() {
        return `
            <div class="terminal-content" id="terminal-output">
                <div class="terminal-line">NovaOS Terminal 25U11</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line"><span class="terminal-prompt">user@novaos:~$</span> <input type="text" class="terminal-input" id="terminal-input"></div>
            </div>
        `;
    }

    init(windowEl) {
        const input = windowEl.querySelector('#terminal-input');
        input.focus();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                this.executeCommand(command, windowEl);
                input.value = '';
            }
        });
    }

    executeCommand(command, windowEl) {
        const output = windowEl.querySelector('#terminal-output');
        const commandLine = document.createElement('div');
        commandLine.className = 'terminal-line';
        commandLine.innerHTML = `<span class="terminal-prompt">user@novaos:~$</span> ${command}`;
        output.insertBefore(commandLine, output.lastElementChild);

        const result = document.createElement('div');
        result.className = 'terminal-line';

        const commands = {
            help: 'Available commands: help, clear, date, echo, ls, cat, whoami, uname, neofetch',
            clear: () => {
                output.innerHTML = '<div class="terminal-line"><span class="terminal-prompt">user@novaos:~$</span> <input type="text" class="terminal-input" id="terminal-input"></div>';
                this.init(windowEl);
                return null;
            },
            date: new Date().toString(),
            whoami: this.os.currentUser,
            uname: 'NovaOS 25U11 (Build 2025.11.17)',
            ls: this.os.fileSystem.listDirectory('/').map(f => f.name).join('  '),
            neofetch: `
                   ___<br>
                  /   \\     user@novaos<br>
                 |  O  |    OS: NovaOS 25U11<br>
                 |  _  |    Build: 2025.11.17<br>
                  \\___/     Shell: novash<br>
                            Terminal: NovaTerminal<br>
            `
        };

        if (command.startsWith('echo ')) {
            result.innerHTML = command.substring(5);
        } else if (command.startsWith('cat ')) {
            const filename = command.substring(4);
            const content = this.os.fileSystem.readFile('/' + filename);
            result.innerHTML = content !== null ? content.replace(/\n/g, '<br>') : `cat: ${filename}: No such file`;
        } else if (commands[command]) {
            const res = typeof commands[command] === 'function' ? commands[command]() : commands[command];
            if (res !== null) result.innerHTML = res;
        } else if (command) {
            result.innerHTML = `Command not found: ${command}`;
        }

        if (result.innerHTML) {
            output.insertBefore(result, output.lastElementChild);
        }

        output.scrollTop = output.scrollHeight;
        windowEl.querySelector('#terminal-input').focus();
    }
}
