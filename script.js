// NovaOS - Operating System Interface
class NovaOS {
    constructor() {
        this.currentUser = null;
        this.windows = new Map();
        this.windowZIndex = 100;
        this.fileSystem = null;
        this.apps = {};
        this.init();
    }

    registerApp(app) {
        this.apps.set(app.name, app);
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

    initApps() {
        // Initialize all application modules
        this.apps.fileExplorer = new FileExplorer(this);
        this.apps.terminal = new Terminal(this);
        this.apps.textEditor = new TextEditor(this);
        this.apps.calculator = new Calculator(this);
        this.apps.settings = new Settings(this);
    }

    initDesktop() {
        this.fileSystem = new FileSystem();

        // Initialize apps
        this.initApps();

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

        // Map app names to app instances
        const appMap = {
            'file-explorer': this.apps.fileExplorer,
            'terminal': this.apps.terminal,
            'text-editor': this.apps.textEditor,
            'calculator': this.apps.calculator,
            'settings': this.apps.settings
        };

        const appInstance = appMap[appName];
        if (!appInstance) return;

        const appInfo = appInstance.getAppInfo();
        this.createWindow(appName, appInfo.title, appInfo.icon, appInfo.content, appInstance);
    }

    createWindow(id, title, icon, content, appInstance) {
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

        // Initialize app using the app instance
        if (appInstance && typeof appInstance.init === 'function') {
            appInstance.init(windowEl);
        }
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

// Register apps (loaded from external files)
// Apps will be registered once their scripts are loaded
window.addEventListener('DOMContentLoaded', () => {
    // Apps are registered via their own script tags
    if (typeof FileExplorerApp !== 'undefined') novaOS.registerApp(FileExplorerApp);
    if (typeof TerminalApp !== 'undefined') novaOS.registerApp(TerminalApp);
    if (typeof TextEditorApp !== 'undefined') novaOS.registerApp(TextEditorApp);
    if (typeof CalculatorApp !== 'undefined') novaOS.registerApp(CalculatorApp);
    if (typeof SettingsApp !== 'undefined') novaOS.registerApp(SettingsApp);
});
