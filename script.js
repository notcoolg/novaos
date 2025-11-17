// NovaOS - Operating System Interface
class NovaOS {
    constructor() {
        this.currentUser = null;
        this.windows = new Map();
        this.windowZIndex = 100;
        this.fileSystem = null;
        this.init();
    }

    init() {
        this.initStorage();
        this.requestFullscreen();
        this.initKeyboardShortcuts();
        this.startBootSequence();
    }

    requestFullscreen() {
        // Auto-request fullscreen on first interaction
        const tryFullscreen = () => {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                elem.requestFullscreen().catch(() => {});
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
            document.removeEventListener('click', tryFullscreen);
        };
        document.addEventListener('click', tryFullscreen, { once: true });
    }

    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Cmd/Ctrl + W - Close active window
            if ((e.metaKey || e.ctrlKey) && e.key === 'w') {
                e.preventDefault();
                const activeWindow = Array.from(this.windows.values())
                    .map(w => ({ ...w, z: parseInt(w.element.style.zIndex) }))
                    .sort((a, b) => b.z - a.z)[0];
                if (activeWindow) {
                    this.closeWindow(activeWindow.element.dataset.id, activeWindow.element);
                }
            }

            // Cmd/Ctrl + M - Minimize active window
            if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
                e.preventDefault();
                const activeWindow = Array.from(this.windows.values())
                    .map(w => ({ ...w, z: parseInt(w.element.style.zIndex) }))
                    .sort((a, b) => b.z - a.z)[0];
                if (activeWindow) {
                    this.minimizeWindow(activeWindow.element);
                }
            }

            // Cmd/Ctrl + N - New Finder window
            if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
                e.preventDefault();
                this.openApp('file-explorer');
            }

            // Cmd/Ctrl + T - New Terminal
            if ((e.metaKey || e.ctrlKey) && e.key === 't') {
                e.preventDefault();
                this.openApp('terminal');
            }

            // Cmd/Ctrl + , - Settings
            if ((e.metaKey || e.ctrlKey) && e.key === ',') {
                e.preventDefault();
                this.openApp('settings');
            }

            // Escape - Close start menu
            if (e.key === 'Escape') {
                const startMenu = document.getElementById('start-menu');
                if (!startMenu.classList.contains('hidden')) {
                    startMenu.classList.add('hidden');
                }
            }
        });
    }

    initStorage() {
        // Initialize localStorage structure
        if (!localStorage.getItem('novaos_users')) {
            const defaultUsers = {
                guest: { username: 'guest', password: '', createdAt: Date.now() }
            };
            localStorage.setItem('novaos_users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('novaos_filesystem')) {
            const defaultFS = {
                '/': {
                    type: 'directory',
                    contents: {
                        'Documents': { type: 'directory', contents: {} },
                        'Downloads': { type: 'directory', contents: {} },
                        'Pictures': { type: 'directory', contents: {} },
                        'Welcome.txt': {
                            type: 'file',
                            content: 'Welcome to NovaOS!\n\nThis is a modern, web-based operating system interface.\n\nFeatures:\n- File Explorer\n- Terminal\n- Text Editor\n- Calculator\n- Settings\n\nEnjoy exploring!',
                            modified: Date.now()
                        }
                    }
                }
            };
            localStorage.setItem('novaos_filesystem', JSON.stringify(defaultFS));
        }
    }

    startBootSequence() {
        const progressBar = document.getElementById('boot-progress-bar');
        let progress = 0;

        // Simple, clean boot animation like macOS
        const bootInterval = setInterval(() => {
            progress += 2;
            progressBar.style.width = progress + '%';

            if (progress >= 100) {
                clearInterval(bootInterval);
                setTimeout(() => this.showLoginScreen(), 500);
            }
        }, 30);
    }

    showLoginScreen() {
        document.getElementById('boot-screen').classList.remove('active');
        setTimeout(() => {
            document.getElementById('login-screen').classList.add('active');
            this.initLoginScreen();
        }, 300);
    }

    initLoginScreen() {
        this.updateLoginTime();
        setInterval(() => this.updateLoginTime(), 1000);

        // Load users
        this.loadUserCards();

        // Event listeners
        document.querySelectorAll('.user-card:not(.new-user)').forEach(card => {
            card.addEventListener('click', (e) => this.selectUser(e.currentTarget.dataset.username));
        });

        document.getElementById('new-user-btn').addEventListener('click', () => this.showCreateUser());
        document.getElementById('login-btn').addEventListener('click', () => this.attemptLogin());
        document.getElementById('back-btn').addEventListener('click', () => this.backToUserSelect());
        document.getElementById('create-btn').addEventListener('click', () => this.createUser());
        document.getElementById('cancel-btn').addEventListener('click', () => this.backToUserSelect());

        document.getElementById('password-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.attemptLogin();
        });
    }

    loadUserCards() {
        const users = JSON.parse(localStorage.getItem('novaos_users'));
        const userSelect = document.getElementById('user-select');

        // Clear existing user cards except the new user button
        const newUserBtn = document.getElementById('new-user-btn');
        userSelect.innerHTML = '';

        // Add user cards
        Object.values(users).forEach(user => {
            const card = document.createElement('div');
            card.className = 'user-card';
            card.dataset.username = user.username;
            card.innerHTML = `
                <div class="user-avatar">
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="50" cy="50" r="50" fill="#6366f1"/>
                        <circle cx="50" cy="40" r="20" fill="#fff"/>
                        <ellipse cx="50" cy="85" rx="30" ry="20" fill="#fff"/>
                    </svg>
                </div>
                <div class="user-name">${user.username}</div>
            `;
            card.addEventListener('click', () => this.selectUser(user.username));
            userSelect.appendChild(card);
        });

        userSelect.appendChild(newUserBtn);
    }

    updateLoginTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        const loginTime = document.getElementById('login-time');
        if (loginTime) {
            loginTime.textContent = timeStr;
        }
    }

    selectUser(username) {
        this.currentUser = username;
        document.getElementById('user-select').classList.add('hidden');
        document.getElementById('login-form').classList.remove('hidden');
        document.getElementById('password-input').focus();
    }

    showCreateUser() {
        document.getElementById('user-select').classList.add('hidden');
        document.getElementById('create-user-form').classList.remove('hidden');
        document.getElementById('new-username').focus();
    }

    backToUserSelect() {
        document.getElementById('login-form').classList.add('hidden');
        document.getElementById('create-user-form').classList.add('hidden');
        document.getElementById('user-select').classList.remove('hidden');
        document.getElementById('password-input').value = '';
        this.currentUser = null;
    }

    attemptLogin() {
        const password = document.getElementById('password-input').value;
        const users = JSON.parse(localStorage.getItem('novaos_users'));

        if (users[this.currentUser] && users[this.currentUser].password === password) {
            this.login();
        } else {
            alert('Incorrect password!');
            document.getElementById('password-input').value = '';
        }
    }

    createUser() {
        const username = document.getElementById('new-username').value.trim();
        const password = document.getElementById('new-password').value;
        const confirm = document.getElementById('confirm-password').value;

        if (!username) {
            alert('Please enter a username');
            return;
        }

        if (password !== confirm) {
            alert('Passwords do not match');
            return;
        }

        const users = JSON.parse(localStorage.getItem('novaos_users'));

        if (users[username]) {
            alert('Username already exists');
            return;
        }

        users[username] = { username, password, createdAt: Date.now() };
        localStorage.setItem('novaos_users', JSON.stringify(users));

        // Clear form
        document.getElementById('new-username').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';

        // Reload user cards and go back
        this.loadUserCards();
        this.backToUserSelect();
        alert('User created successfully!');
    }

    login() {
        document.getElementById('login-screen').classList.remove('active');
        setTimeout(() => {
            document.getElementById('desktop').classList.add('active');
            this.initDesktop();
        }, 300);
    }

    initDesktop() {
        this.fileSystem = new FileSystem();

        // Update current user name
        document.getElementById('current-user-name').textContent = this.currentUser;

        // Update time
        this.updateDesktopTime();
        setInterval(() => this.updateDesktopTime(), 1000);

        // Event listeners
        document.getElementById('start-button').addEventListener('click', () => this.toggleStartMenu());

        document.querySelectorAll('.desktop-icon').forEach(icon => {
            icon.addEventListener('dblclick', (e) => {
                const appName = e.currentTarget.dataset.app;
                this.openApp(appName);
            });
        });

        document.querySelectorAll('.start-menu-item:not(.power)').forEach(item => {
            item.addEventListener('click', (e) => {
                const appName = e.currentTarget.dataset.app;
                this.openApp(appName);
                this.toggleStartMenu();
            });
        });

        document.getElementById('logout-btn').addEventListener('click', () => this.logout());
        document.getElementById('shutdown-btn').addEventListener('click', () => this.shutdown());

        // Close start menu when clicking outside
        document.addEventListener('click', (e) => {
            const startMenu = document.getElementById('start-menu');
            const startButton = document.getElementById('start-button');
            if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
                startMenu.classList.add('hidden');
            }
        });
    }

    updateDesktopTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        document.getElementById('tray-time').textContent = timeStr;
    }

    toggleStartMenu() {
        document.getElementById('start-menu').classList.toggle('hidden');
    }

    openApp(appName) {
        // Check if app is already open
        if (this.windows.has(appName)) {
            const window = this.windows.get(appName);
            window.element.classList.remove('minimized');
            this.focusWindow(window.element);
            return;
        }

        const apps = {
            'file-explorer': { title: 'File Explorer', icon: '📁', content: this.createFileExplorer() },
            'terminal': { title: 'Terminal', icon: '⌘', content: this.createTerminal() },
            'text-editor': { title: 'Text Editor', icon: '📝', content: this.createTextEditor() },
            'calculator': { title: 'Calculator', icon: '🔢', content: this.createCalculator() },
            'settings': { title: 'Settings', icon: '⚙️', content: this.createSettings() }
        };

        const app = apps[appName];
        if (!app) return;

        this.createWindow(appName, app.title, app.icon, app.content);
    }

    createWindow(id, title, icon, content) {
        const windowEl = document.createElement('div');
        windowEl.className = 'window';
        windowEl.dataset.id = id;
        windowEl.style.zIndex = this.windowZIndex++;

        // Random position for new windows
        const maxX = window.innerWidth - 500;
        const maxY = window.innerHeight - 400;
        const randomX = Math.max(50, Math.random() * maxX);
        const randomY = Math.max(50, Math.random() * maxY);

        windowEl.style.left = randomX + 'px';
        windowEl.style.top = randomY + 'px';
        windowEl.style.width = '600px';
        windowEl.style.height = '400px';

        windowEl.innerHTML = `
            <div class="window-titlebar">
                <div class="window-controls">
                    <div class="window-control close"></div>
                    <div class="window-control minimize"></div>
                    <div class="window-control maximize"></div>
                </div>
                <div class="window-title">
                    <span class="icon">${icon}</span>
                    <span>${title}</span>
                </div>
            </div>
            <div class="window-content">${content}</div>
            <div class="window-resize-handle resize-right"></div>
            <div class="window-resize-handle resize-bottom"></div>
            <div class="window-resize-handle resize-corner"></div>
        `;

        document.getElementById('windows-container').appendChild(windowEl);

        // Window controls
        const titlebar = windowEl.querySelector('.window-titlebar');
        const minimizeBtn = windowEl.querySelector('.minimize');
        const maximizeBtn = windowEl.querySelector('.maximize');
        const closeBtn = windowEl.querySelector('.close');

        // Dragging
        this.makeWindowDraggable(windowEl, titlebar);

        // Resizing
        this.makeWindowResizable(windowEl);

        // Controls
        minimizeBtn.addEventListener('click', () => this.minimizeWindow(windowEl));
        maximizeBtn.addEventListener('click', () => this.toggleMaximize(windowEl));
        closeBtn.addEventListener('click', () => this.closeWindow(id, windowEl));

        // Focus on click
        windowEl.addEventListener('mousedown', () => this.focusWindow(windowEl));

        // Add to taskbar
        this.addToTaskbar(id, title, icon, windowEl);

        // Store window
        this.windows.set(id, { element: windowEl, title, icon });

        // Initialize app-specific features
        if (id === 'terminal') this.initTerminal(windowEl);
        if (id === 'calculator') this.initCalculator(windowEl);
        if (id === 'text-editor') this.initTextEditor(windowEl);
        if (id === 'file-explorer') this.initFileExplorer(windowEl);
        if (id === 'settings') this.initSettings(windowEl);
    }

    initSettings(windowEl) {
        // Handle tab switching
        const tabs = windowEl.querySelectorAll('.settings-tab');
        const contents = windowEl.querySelectorAll('.settings-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Update active content
                contents.forEach(c => c.classList.remove('active'));
                const content = windowEl.querySelector(`[data-content="${tabName}"]`);
                if (content) content.classList.add('active');

                // Load changelog if changelog tab
                if (tabName === 'changelog') {
                    this.loadChangelog(windowEl);
                }
            });
        });
    }

    async loadChangelog(windowEl) {
        const viewer = windowEl.querySelector('#changelog-viewer');
        if (!viewer) return;

        try {
            const response = await fetch('CHANGELOG.md');
            const text = await response.text();
            viewer.innerHTML = this.parseMarkdown(text);
        } catch (error) {
            viewer.innerHTML = '<p style="color: var(--danger);">Error loading changelog.</p>';
        }
    }

    parseMarkdown(md) {
        // Simple markdown parser
        let html = md
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
            // Lists
            .replace(/^\- (.*$)/gim, '<li>$1</li>')
            // Links
            .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>')
            // Line breaks
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n/g, '<br>');

        // Wrap in paragraphs
        html = '<p>' + html + '</p>';

        // Fix list items
        html = html.replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>');
        html = html.replace(/<\/ul><br><ul>/g, '');

        return html;
    }

    makeWindowDraggable(windowEl, handle) {
        let isDragging = false;
        let currentX, currentY, initialX, initialY;
        let rafId;

        const updatePosition = () => {
            if (isDragging) {
                windowEl.style.left = currentX + 'px';
                windowEl.style.top = currentY + 'px';
            }
        };

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;
            if (windowEl.classList.contains('maximized')) return;

            isDragging = true;
            initialX = e.clientX - windowEl.offsetLeft;
            initialY = e.clientY - windowEl.offsetTop;
            windowEl.style.willChange = 'left, top';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            // Use RAF for smooth updates
            if (rafId) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updatePosition);
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                windowEl.style.willChange = 'auto';
                if (rafId) cancelAnimationFrame(rafId);
            }
        });
    }

    makeWindowResizable(windowEl) {
        const resizeHandles = windowEl.querySelectorAll('.window-resize-handle');

        resizeHandles.forEach(handle => {
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startLeft, startTop;

            handle.addEventListener('mousedown', (e) => {
                if (windowEl.classList.contains('maximized')) return;

                e.preventDefault();
                e.stopPropagation();
                isResizing = true;

                startX = e.clientX;
                startY = e.clientY;
                startWidth = parseInt(window.getComputedStyle(windowEl).width, 10);
                startHeight = parseInt(window.getComputedStyle(windowEl).height, 10);
                startLeft = windowEl.offsetLeft;
                startTop = windowEl.offsetTop;

                document.body.style.cursor = handle.style.cursor;
            });

            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;

                e.preventDefault();

                const minWidth = 400;
                const minHeight = 300;
                const maxWidth = window.innerWidth - startLeft;
                const maxHeight = window.innerHeight - startTop - 80; // Account for dock

                if (handle.classList.contains('resize-right') || handle.classList.contains('resize-corner')) {
                    const width = Math.min(Math.max(minWidth, startWidth + (e.clientX - startX)), maxWidth);
                    windowEl.style.width = width + 'px';
                }

                if (handle.classList.contains('resize-bottom') || handle.classList.contains('resize-corner')) {
                    const height = Math.min(Math.max(minHeight, startHeight + (e.clientY - startY)), maxHeight);
                    windowEl.style.height = height + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isResizing) {
                    isResizing = false;
                    document.body.style.cursor = '';
                }
            });
        });
    }

    focusWindow(windowEl) {
        windowEl.style.zIndex = this.windowZIndex++;

        // Update taskbar
        document.querySelectorAll('.taskbar-app').forEach(app => app.classList.remove('active'));
        const taskbarApp = document.querySelector(`.taskbar-app[data-id="${windowEl.dataset.id}"]`);
        if (taskbarApp) taskbarApp.classList.add('active');
    }

    minimizeWindow(windowEl) {
        windowEl.classList.add('minimized');
    }

    toggleMaximize(windowEl) {
        windowEl.classList.toggle('maximized');
    }

    closeWindow(id, windowEl) {
        windowEl.classList.add('closing');
        setTimeout(() => {
            windowEl.remove();
            this.windows.delete(id);

            // Remove from taskbar
            const taskbarApp = document.querySelector(`.taskbar-app[data-id="${id}"]`);
            if (taskbarApp) taskbarApp.remove();
        }, 300);
    }

    addToTaskbar(id, title, icon, windowEl) {
        const taskbarApps = document.getElementById('taskbar-apps');
        const appEl = document.createElement('div');
        appEl.className = 'taskbar-app active';
        appEl.dataset.id = id;
        appEl.innerHTML = `
            <div class="icon">${icon}</div>
            <div class="label">${title}</div>
        `;

        appEl.addEventListener('click', () => {
            if (windowEl.classList.contains('minimized')) {
                windowEl.classList.remove('minimized');
                this.focusWindow(windowEl);
            } else if (windowEl.style.zIndex == this.windowZIndex - 1) {
                this.minimizeWindow(windowEl);
            } else {
                this.focusWindow(windowEl);
            }
        });

        taskbarApps.appendChild(appEl);
    }

    createFileExplorer() {
        return `
            <div class="file-explorer-toolbar">
                <button class="toolbar-btn" onclick="novaOS.fileExplorerNewFolder()">📁 New Folder</button>
                <button class="toolbar-btn" onclick="novaOS.fileExplorerNewFile()">📄 New File</button>
                <button class="toolbar-btn" onclick="novaOS.fileExplorerRefresh()">🔄 Refresh</button>
            </div>
            <div id="file-explorer-path" style="margin-bottom: 15px; color: #94a3b8; font-size: 13px;">/</div>
            <div class="file-list" id="file-list"></div>
        `;
    }

    initFileExplorer(windowEl) {
        this.currentPath = '/';
        this.refreshFileList();
    }

    refreshFileList() {
        const fileList = document.getElementById('file-list');
        if (!fileList) return;

        const files = this.fileSystem.listDirectory(this.currentPath);
        fileList.innerHTML = '';

        if (this.currentPath !== '/') {
            const backItem = document.createElement('div');
            backItem.className = 'file-item';
            backItem.innerHTML = '<span class="file-icon">⬆️</span><span>..</span>';
            backItem.addEventListener('dblclick', () => {
                const parts = this.currentPath.split('/').filter(p => p);
                parts.pop();
                this.currentPath = '/' + parts.join('/');
                if (this.currentPath === '/') this.currentPath = '/';
                this.refreshFileList();
            });
            fileList.appendChild(backItem);
        }

        files.forEach(file => {
            const item = document.createElement('div');
            item.className = 'file-item';
            const icon = file.type === 'directory' ? '📁' : '📄';
            item.innerHTML = `<span class="file-icon">${icon}</span><span>${file.name}</span>`;

            item.addEventListener('dblclick', () => {
                if (file.type === 'directory') {
                    this.currentPath = this.currentPath === '/' ? '/' + file.name : this.currentPath + '/' + file.name;
                    this.refreshFileList();
                    document.getElementById('file-explorer-path').textContent = this.currentPath;
                } else {
                    this.openFileInTextEditor(this.currentPath + '/' + file.name);
                }
            });

            fileList.appendChild(item);
        });

        document.getElementById('file-explorer-path').textContent = this.currentPath;
    }

    fileExplorerNewFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            this.fileSystem.createDirectory(this.currentPath + '/' + name);
            this.refreshFileList();
        }
    }

    fileExplorerNewFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.fileSystem.createFile(this.currentPath + '/' + name, '');
            this.refreshFileList();
        }
    }

    fileExplorerRefresh() {
        this.refreshFileList();
    }

    openFileInTextEditor(path) {
        const content = this.fileSystem.readFile(path);
        if (content !== null) {
            this.openApp('text-editor');
            setTimeout(() => {
                const textarea = document.getElementById('text-editor-content');
                if (textarea) {
                    textarea.value = content;
                    textarea.dataset.currentFile = path;
                }
            }, 100);
        }
    }

    createTerminal() {
        return `
            <div class="terminal-content" id="terminal-output">
                <div class="terminal-line">NovaOS Terminal 25U11</div>
                <div class="terminal-line">Type 'help' for available commands</div>
                <div class="terminal-line"><span class="terminal-prompt">user@novaos:~$</span> <input type="text" class="terminal-input" id="terminal-input"></div>
            </div>
        `;
    }

    initTerminal(windowEl) {
        const input = windowEl.querySelector('#terminal-input');
        input.focus();

        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = input.value.trim();
                this.executeTerminalCommand(command, windowEl);
                input.value = '';
            }
        });
    }

    executeTerminalCommand(command, windowEl) {
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
                this.initTerminal(windowEl);
                return null;
            },
            date: new Date().toString(),
            whoami: this.currentUser,
            uname: 'NovaOS 25U11 (Build 2025.11.17)',
            ls: this.fileSystem.listDirectory('/').map(f => f.name).join('  '),
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
            const content = this.fileSystem.readFile('/' + filename);
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

    createTextEditor() {
        return `
            <div class="text-editor-toolbar">
                <button class="toolbar-btn" onclick="novaOS.saveTextFile()">💾 Save</button>
                <button class="toolbar-btn" onclick="novaOS.clearTextEditor()">🗑️ Clear</button>
            </div>
            <textarea class="text-editor-area" id="text-editor-content" placeholder="Start typing..."></textarea>
        `;
    }

    initTextEditor(windowEl) {
        // Nothing special needed for initialization
    }

    saveTextFile() {
        const textarea = document.getElementById('text-editor-content');
        if (!textarea) return;

        let filename = textarea.dataset.currentFile;
        if (!filename) {
            filename = prompt('Enter filename:');
            if (!filename) return;
            if (!filename.startsWith('/')) filename = '/' + filename;
        }

        this.fileSystem.createFile(filename, textarea.value);
        alert('File saved successfully!');
        textarea.dataset.currentFile = filename;
    }

    clearTextEditor() {
        const textarea = document.getElementById('text-editor-content');
        if (textarea) {
            textarea.value = '';
            delete textarea.dataset.currentFile;
        }
    }

    createCalculator() {
        return `
            <div class="calculator-display" id="calc-display">0</div>
            <div class="calculator-buttons" id="calc-buttons">
                <button class="calc-btn" data-value="7">7</button>
                <button class="calc-btn" data-value="8">8</button>
                <button class="calc-btn" data-value="9">9</button>
                <button class="calc-btn operator" data-value="/">÷</button>
                <button class="calc-btn" data-value="4">4</button>
                <button class="calc-btn" data-value="5">5</button>
                <button class="calc-btn" data-value="6">6</button>
                <button class="calc-btn operator" data-value="*">×</button>
                <button class="calc-btn" data-value="1">1</button>
                <button class="calc-btn" data-value="2">2</button>
                <button class="calc-btn" data-value="3">3</button>
                <button class="calc-btn operator" data-value="-">−</button>
                <button class="calc-btn" data-value="0">0</button>
                <button class="calc-btn" data-value=".">.</button>
                <button class="calc-btn operator" data-value="=">=</button>
                <button class="calc-btn operator" data-value="+">+</button>
            </div>
            <button class="calc-btn" data-value="C" style="margin-top: 10px; grid-column: 1 / -1;">Clear</button>
        `;
    }

    initCalculator(windowEl) {
        let currentValue = '0';
        let previousValue = null;
        let operation = null;

        const display = windowEl.querySelector('#calc-display');
        const buttons = windowEl.querySelectorAll('.calc-btn');

        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const value = btn.dataset.value;

                if (value === 'C') {
                    currentValue = '0';
                    previousValue = null;
                    operation = null;
                    display.textContent = currentValue;
                } else if (['+', '-', '*', '/'].includes(value)) {
                    if (previousValue !== null && operation !== null) {
                        currentValue = this.calculate(previousValue, currentValue, operation);
                        display.textContent = currentValue;
                    }
                    previousValue = currentValue;
                    currentValue = '0';
                    operation = value;
                } else if (value === '=') {
                    if (previousValue !== null && operation !== null) {
                        currentValue = this.calculate(previousValue, currentValue, operation);
                        display.textContent = currentValue;
                        previousValue = null;
                        operation = null;
                    }
                } else {
                    if (currentValue === '0' && value !== '.') {
                        currentValue = value;
                    } else {
                        currentValue += value;
                    }
                    display.textContent = currentValue;
                }
            });
        });
    }

    calculate(a, b, op) {
        const num1 = parseFloat(a);
        const num2 = parseFloat(b);

        switch(op) {
            case '+': return String(num1 + num2);
            case '-': return String(num1 - num2);
            case '*': return String(num1 * num2);
            case '/': return String(num1 / num2);
            default: return b;
        }
    }

    createSettings() {
        const users = JSON.parse(localStorage.getItem('novaos_users'));
        const userCount = Object.keys(users).length;
        const fsSize = new Blob([localStorage.getItem('novaos_filesystem')]).size;

        return `
            <div class="settings-tabs">
                <div class="settings-tab active" data-tab="general">General</div>
                <div class="settings-tab" data-tab="keyboard">Keyboard Shortcuts</div>
                <div class="settings-tab" data-tab="changelog">Changelog</div>
            </div>
            <div class="settings-content">
                <div class="settings-tab-content active" data-content="general">
                    <div class="settings-section">
                        <h3>System Information</h3>
                        <div class="setting-item">
                            <div class="setting-label">Operating System</div>
                            <div class="setting-value">NovaOS 25U11</div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">Current User</div>
                            <div class="setting-value">${this.currentUser}</div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">Total Users</div>
                            <div class="setting-value">${userCount}</div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>Storage</h3>
                        <div class="setting-item">
                            <div class="setting-label">File System Size</div>
                            <div class="setting-value">${(fsSize / 1024).toFixed(2)} KB</div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <h3>About</h3>
                        <div class="setting-item">
                            <div class="setting-label">Version</div>
                            <div class="setting-value">25U11</div>
                        </div>
                        <div class="setting-item">
                            <div class="setting-label">Build</div>
                            <div class="setting-value">2025.11.17</div>
                        </div>
                    </div>
                </div>
                <div class="settings-tab-content" data-content="keyboard">
                    <div class="settings-section">
                        <h3>Keyboard Shortcuts</h3>
                        <div class="shortcuts-list">
                            <div class="shortcut-item">
                                <span class="shortcut-keys"><kbd>⌘/Ctrl</kbd> + <kbd>W</kbd></span>
                                <span class="shortcut-desc">Close active window</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-keys"><kbd>⌘/Ctrl</kbd> + <kbd>M</kbd></span>
                                <span class="shortcut-desc">Minimize active window</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-keys"><kbd>⌘/Ctrl</kbd> + <kbd>N</kbd></span>
                                <span class="shortcut-desc">New Files window</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-keys"><kbd>⌘/Ctrl</kbd> + <kbd>T</kbd></span>
                                <span class="shortcut-desc">New Terminal window</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-keys"><kbd>⌘/Ctrl</kbd> + <kbd>,</kbd></span>
                                <span class="shortcut-desc">Open Settings</span>
                            </div>
                            <div class="shortcut-item">
                                <span class="shortcut-keys"><kbd>Esc</kbd></span>
                                <span class="shortcut-desc">Close start menu</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="settings-tab-content" data-content="changelog">
                    <div id="changelog-viewer" class="changelog-viewer">Loading changelog...</div>
                </div>
            </div>
        `;
    }

    logout() {
        this.currentUser = null;
        this.windows.clear();
        document.getElementById('desktop').classList.remove('active');
        document.getElementById('windows-container').innerHTML = '';
        document.getElementById('taskbar-apps').innerHTML = '';
        setTimeout(() => {
            document.getElementById('login-screen').classList.add('active');
            this.backToUserSelect();
        }, 300);
    }

    shutdown() {
        document.getElementById('desktop').classList.remove('active');
        setTimeout(() => {
            document.body.innerHTML = `
                <div style="width: 100%; height: 100vh; background: #000; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 24px;">
                    NovaOS has been shut down.
                    <br><br>
                    <button onclick="location.reload()" style="padding: 15px 30px; font-size: 16px; background: var(--primary-color); border: none; border-radius: 8px; color: white; cursor: pointer;">Restart</button>
                </div>
            `;
        }, 500);
    }
}

// File System
class FileSystem {
    constructor() {
        this.fs = JSON.parse(localStorage.getItem('novaos_filesystem'));
    }

    save() {
        localStorage.setItem('novaos_filesystem', JSON.stringify(this.fs));
    }

    listDirectory(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fs['/'];

        for (const part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return [];
            }
        }

        if (current.type === 'directory' && current.contents) {
            return Object.entries(current.contents).map(([name, item]) => ({
                name,
                type: item.type,
                modified: item.modified
            }));
        }

        return [];
    }

    createDirectory(path) {
        const parts = path.split('/').filter(p => p);
        const name = parts.pop();
        let current = this.fs['/'];

        for (const part of parts) {
            if (!current.contents[part]) {
                current.contents[part] = { type: 'directory', contents: {} };
            }
            current = current.contents[part];
        }

        current.contents[name] = { type: 'directory', contents: {} };
        this.save();
    }

    createFile(path, content) {
        const parts = path.split('/').filter(p => p);
        const name = parts.pop();
        let current = this.fs['/'];

        for (const part of parts) {
            if (!current.contents[part]) {
                current.contents[part] = { type: 'directory', contents: {} };
            }
            current = current.contents[part];
        }

        current.contents[name] = {
            type: 'file',
            content: content,
            modified: Date.now()
        };
        this.save();
    }

    readFile(path) {
        const parts = path.split('/').filter(p => p);
        let current = this.fs['/'];

        for (const part of parts) {
            if (current.contents && current.contents[part]) {
                current = current.contents[part];
            } else {
                return null;
            }
        }

        return current.type === 'file' ? current.content : null;
    }
}

// Initialize NovaOS
const novaOS = new NovaOS();
