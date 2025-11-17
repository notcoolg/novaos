// Terminal Application
const TerminalApp = {
    name: 'terminal',
    title: 'Terminal',
    icon: '⌘',

    createContent() {
        return `
            <div class="terminal-content" id="terminal-output">
                <div class="terminal-line">NovaOS Terminal v1.0</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line"><span class="terminal-prompt">user@novaos:~$</span> <input type="text" class="terminal-input" id="terminal-input"></div>
            </div>
        `;
    },

    init(windowEl, os) {
        const input = windowEl.querySelector('#terminal-input');
        input.focus();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                this.executeCommand(command, windowEl, os);
                input.value = '';
            }
        });
    },

    executeCommand(command, windowEl, os) {
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
                this.init(windowEl, os);
                return null;
            },
            date: new Date().toString(),
            whoami: os.currentUser,
            uname: 'NovaOS 1.0 (Web Edition)',
            ls: os.fileSystem.listDirectory('/').map(f => f.name).join('  '),
            neofetch: `
                   ___<br>
                  /   \\     user@novaos<br>
                 |  O  |    OS: NovaOS 1.0<br>
                 |  _  |    Kernel: Nova 5.15<br>
                  \\___/     Shell: novash<br>
                            Terminal: NovaTerminal<br>
            `
        };

        if (command.startsWith('echo ')) {
            result.innerHTML = command.substring(5);
        } else if (command.startsWith('cat ')) {
            const filename = command.substring(4);
            const content = os.fileSystem.readFile('/' + filename);
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
};
