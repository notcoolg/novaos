// NovaOS - Operating System Interface
class NovaOS {
    constructor() {
        this.currentUser = null;
        this.windows = new Map();
        this.windowZIndex = 100;
        this.fileSystem = null;
        this.apps = {};
        this.maxWindows = 5;
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
        this.apps.imageViewer = new ImageViewer(this);
        this.apps.fileViewer = new FileViewer(this);
        this.apps.browser = new Browser(this);
        this.apps.settings = new Settings(this);
    }

    initDesktop() {
        this.fileSystem = new FileSystem();

        // Initialize apps
        this.initApps();

        // Create notification container
        this.createNotificationContainer();

        // Initialize context menu
        this.initContextMenu();

        // Initialize user menu
        this.initUserMenu();

        // Initialize dock
        this.initDock();

        // Initialize launchpad
        this.initLaunchpad();

        // Initialize top bar menus
        this.initTopBarMenus();

        // Update current user name
        document.getElementById('current-user-name').textContent = this.currentUser;

        // Update time
        this.updateDesktopTime();
        setInterval(() => this.updateDesktopTime(), 1000);

        // Event listeners
        const startButton = document.getElementById('start-button');
        if (startButton) {
            startButton.addEventListener('click', () => this.toggleStartMenu());
        }

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
            if (!startMenu.contains(e.target) && (!startButton || !startButton.contains(e.target))) {
                startMenu.classList.add('hidden');
            }
        });

        // Global click handler to close all menus
        document.addEventListener('click', (e) => {
            // Close menus if clicking outside
            const menus = [
                'apple-menu', 'control-center', 'calendar-popup',
                'wifi-menu', 'battery-menu'
            ];

            menus.forEach(menuId => {
                const menu = document.getElementById(menuId);
                if (menu && !menu.contains(e.target)) {
                    const trigger = document.querySelector(`[id$="${menuId.replace('-menu', '-icon')}"], [id$="${menuId.replace('-popup', '')}"], #apple-menu-btn, #top-bar-time`);
                    if (!trigger || !trigger.contains(e.target)) {
                        menu.classList.add('hidden');
                    }
                }
            });

            // Remove dropdown menus
            const dropdown = document.querySelector('.dropdown-menu');
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.remove();
            }
        });
    }

    updateDesktopTime() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const dateStr = now.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });

        // Update top bar time
        const topBarTime = document.getElementById('top-bar-time');
        if (topBarTime) {
            topBarTime.textContent = `${dateStr} ${timeStr}`;
        }

        // Keep old taskbar time for compatibility
        const trayTime = document.getElementById('tray-time');
        if (trayTime) {
            trayTime.textContent = timeStr;
        }
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

        // Check window limit
        if (this.windows.size >= this.maxWindows) {
            this.showNotification(
                'Window Limit Reached',
                `Maximum of ${this.maxWindows} windows can be open at once. Close some windows to open more.`,
                'warning'
            );
            return;
        }

        // Map app names to app instances
        const appMap = {
            'file-explorer': this.apps.fileExplorer,
            'terminal': this.apps.terminal,
            'text-editor': this.apps.textEditor,
            'calculator': this.apps.calculator,
            'image-viewer': this.apps.imageViewer,
            'file-viewer': this.apps.fileViewer,
            'browser': this.apps.browser,
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

        // Get app menus if available
        const appMenus = (appInstance && typeof appInstance.getMenus === 'function')
            ? appInstance.getMenus()
            : null;

        // Store window
        this.windows.set(id, { element: windowEl, title, icon, appMenus, appInstance });

        // Initialize app using the app instance
        if (appInstance && typeof appInstance.init === 'function') {
            appInstance.init(windowEl);
        }

        // Update top bar for this window
        this.updateTopBarForApp(title, appMenus);
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

        // Update top bar with app name and menus
        const windowData = this.windows.get(windowEl.dataset.id);
        if (windowData) {
            this.updateTopBarForApp(windowData.title, windowData.appMenus);
        }
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

            // Remove from dock
            this.removeFromDock(id);

            // Remove from taskbar (legacy)
            const taskbarApp = document.querySelector(`.taskbar-app[data-id="${id}"]`);
            if (taskbarApp) taskbarApp.remove();
        }, 300);
    }

    initDock() {
        // Add click handlers for dock items
        document.querySelectorAll('.dock-item').forEach(item => {
            const appName = item.dataset.app;
            if (appName) {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();

                    // Special handling for launchpad
                    if (appName === 'launchpad') {
                        this.toggleLaunchpad();
                        return;
                    }

                    // If window ref exists and window is open, toggle minimize
                    if (item._windowRef && !item._windowRef.classList.contains('closing')) {
                        const win = item._windowRef;
                        if (win.classList.contains('minimized')) {
                            win.classList.remove('minimized');
                            this.focusWindow(win);
                        } else if (win.style.zIndex == this.windowZIndex - 1) {
                            this.minimizeWindow(win);
                        } else {
                            this.focusWindow(win);
                        }
                    } else {
                        // Otherwise open new window
                        this.openApp(appName);
                    }
                });
            }
        });
    }

    initLaunchpad() {
        const launchpad = document.getElementById('launchpad');
        const launchpadGrid = document.getElementById('launchpad-grid');
        const searchInput = document.getElementById('launchpad-search-input');

        // Populate launchpad with all apps
        const allApps = [
            { id: 'file-explorer', name: 'Files', icon: '<i class="ph ph-folder"></i>' },
            { id: 'terminal', name: 'Terminal', icon: '<i class="ph ph-terminal-window"></i>' },
            { id: 'text-editor', name: 'TextEdit', icon: '<i class="ph ph-note-pencil"></i>' },
            { id: 'calculator', name: 'Calculator', icon: '<i class="ph ph-calculator"></i>' },
            { id: 'image-viewer', name: 'Images', icon: '<i class="ph ph-image"></i>' },
            { id: 'file-viewer', name: 'Viewer', icon: '<i class="ph ph-files"></i>' },
            { id: 'browser', name: 'Browser', icon: '<i class="ph ph-globe"></i>' },
            { id: 'settings', name: 'Settings', icon: '<i class="ph ph-gear"></i>' }
        ];

        launchpadGrid.innerHTML = allApps.map(app => `
            <div class="launchpad-app" data-app="${app.id}">
                <div class="launchpad-app-icon">${app.icon}</div>
                <div class="launchpad-app-name">${app.name}</div>
            </div>
        `).join('');

        // Add click handlers
        launchpadGrid.querySelectorAll('.launchpad-app').forEach(app => {
            app.addEventListener('click', () => {
                this.openApp(app.dataset.app);
                this.toggleLaunchpad();
            });
        });

        // Search functionality
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            launchpadGrid.querySelectorAll('.launchpad-app').forEach(app => {
                const name = app.querySelector('.launchpad-app-name').textContent.toLowerCase();
                app.style.display = name.includes(query) ? 'flex' : 'none';
            });
        });

        // Close on background click
        launchpad.addEventListener('click', (e) => {
            if (e.target.classList.contains('launchpad-background') || e.target.id === 'launchpad') {
                this.toggleLaunchpad();
            }
        });

        // Keyboard shortcut - F4 or Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F4' && !launchpad.classList.contains('hidden')) {
                this.toggleLaunchpad();
            } else if (e.key === 'F4') {
                this.toggleLaunchpad();
            } else if (e.key === 'Escape' && !launchpad.classList.contains('hidden')) {
                this.toggleLaunchpad();
            }
        });
    }

    toggleLaunchpad() {
        const launchpad = document.getElementById('launchpad');
        const searchInput = document.getElementById('launchpad-search-input');

        launchpad.classList.toggle('hidden');

        if (!launchpad.classList.contains('hidden')) {
            searchInput.value = '';
            searchInput.focus();
            // Reset search
            document.querySelectorAll('.launchpad-app').forEach(app => {
                app.style.display = 'flex';
            });
        }
    }

    initTopBarMenus() {
        this.currentAppMenus = null;
        this.calendarDate = new Date();
        this.updateTopBarForApp('NovaOS', null);

        // Initialize Apple Menu
        this.initAppleMenu();

        // Initialize Control Center
        this.initControlCenter();

        // Initialize Spotlight
        this.initSpotlight();

        // Initialize Calendar
        this.initCalendar();

        // Initialize WiFi Menu
        this.initWifiMenu();

        // Initialize Battery Menu
        this.initBatteryMenu();

        // Initialize About This Mac
        this.initAboutMac();

        // Initialize Force Quit
        this.initForceQuit();

        // Initialize dropdown menus
        this.initDropdownMenus();
    }

    initAppleMenu() {
        const appleBtn = document.getElementById('apple-menu-btn');
        const appleMenu = document.getElementById('apple-menu');
        if (!appleBtn || !appleMenu) return;

        appleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeAllMenus();
            appleMenu.classList.toggle('hidden');
            document.getElementById('apple-menu-username').textContent = this.currentUser;
        });

        // Handle menu items
        appleMenu.querySelectorAll('.apple-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                appleMenu.classList.add('hidden');

                switch(action) {
                    case 'about':
                        this.showAboutMac();
                        break;
                    case 'preferences':
                        this.openApp('settings');
                        break;
                    case 'app-store':
                        this.showNotification('App Store', 'App Store coming soon!', 'info');
                        break;
                    case 'force-quit':
                        this.showForceQuit();
                        break;
                    case 'sleep':
                        this.showNotification('Sleep', 'Sleep mode coming soon!', 'info');
                        break;
                    case 'restart':
                        location.reload();
                        break;
                    case 'shutdown':
                        this.shutdown();
                        break;
                    case 'lock':
                        this.showNotification('Lock Screen', 'Lock screen coming soon!', 'info');
                        break;
                    case 'logout':
                        this.logout();
                        break;
                }
            });
        });
    }

    initControlCenter() {
        const ccBtn = document.getElementById('control-center-icon');
        const cc = document.getElementById('control-center');
        if (!ccBtn || !cc) return;

        ccBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeAllMenus();
            cc.classList.toggle('hidden');
        });

        // Toggle tiles
        cc.querySelectorAll('.control-tile').forEach(tile => {
            tile.addEventListener('click', () => {
                tile.classList.toggle('active');
                const status = tile.querySelector('.tile-status');
                if (status) {
                    status.textContent = tile.classList.contains('active') ? 'On' : 'Off';
                }
            });
        });

        // Sliders
        const brightnessTrack = cc.querySelector('#brightness-fill')?.parentElement;
        const volumeTrack = cc.querySelector('#volume-fill')?.parentElement;

        [brightnessTrack, volumeTrack].forEach(track => {
            if (!track) return;
            track.addEventListener('click', (e) => {
                const rect = track.getBoundingClientRect();
                const percent = ((e.clientX - rect.left) / rect.width) * 100;
                const fill = track.querySelector('.slider-fill');
                if (fill) fill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
            });
        });
    }

    initSpotlight() {
        const spotlightBtn = document.getElementById('spotlight-icon');
        const spotlightOverlay = document.getElementById('spotlight-overlay');
        const spotlightInput = document.getElementById('spotlight-input');
        if (!spotlightBtn || !spotlightOverlay || !spotlightInput) return;

        const apps = [
            { id: 'file-explorer', name: 'Files', icon: 'ph-folder', type: 'app' },
            { id: 'terminal', name: 'Terminal', icon: 'ph-terminal-window', type: 'app' },
            { id: 'text-editor', name: 'TextEdit', icon: 'ph-note-pencil', type: 'app' },
            { id: 'calculator', name: 'Calculator', icon: 'ph-calculator', type: 'app' },
            { id: 'image-viewer', name: 'Images', icon: 'ph-image', type: 'app' },
            { id: 'file-viewer', name: 'Viewer', icon: 'ph-files', type: 'app' },
            { id: 'browser', name: 'Browser', icon: 'ph-globe', type: 'app' },
            { id: 'settings', name: 'Settings', icon: 'ph-gear', type: 'app' }
        ];

        const systemItems = [
            { id: 'about', name: 'About This Mac', icon: 'ph-info', action: () => this.showAboutMac() },
            { id: 'preferences', name: 'System Preferences', icon: 'ph-gear', action: () => this.openApp('settings') },
            { id: 'lock', name: 'Lock Screen', icon: 'ph-lock', action: () => this.showNotification('Lock', 'Lock coming soon', 'info') },
            { id: 'logout', name: 'Log Out', icon: 'ph-sign-out', action: () => this.logout() }
        ];

        const showSpotlight = () => {
            this.closeAllMenus();
            spotlightOverlay.classList.remove('hidden');
            spotlightInput.value = '';
            spotlightInput.focus();
            this.updateSpotlightResults('', apps, systemItems);
        };

        const hideSpotlight = () => {
            spotlightOverlay.classList.add('hidden');
        };

        spotlightBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSpotlight();
        });

        // Cmd+Space shortcut
        document.addEventListener('keydown', (e) => {
            if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
                e.preventDefault();
                if (spotlightOverlay.classList.contains('hidden')) {
                    showSpotlight();
                } else {
                    hideSpotlight();
                }
            }
        });

        spotlightOverlay.addEventListener('click', (e) => {
            if (e.target === spotlightOverlay) {
                hideSpotlight();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !spotlightOverlay.classList.contains('hidden')) {
                hideSpotlight();
            }
        });

        spotlightInput.addEventListener('input', (e) => {
            this.updateSpotlightResults(e.target.value, apps, systemItems);
        });

        spotlightInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const selected = document.querySelector('.spotlight-item.selected') ||
                                 document.querySelector('.spotlight-item');
                if (selected) selected.click();
            }
        });
    }

    updateSpotlightResults(query, apps, systemItems) {
        const appsContainer = document.getElementById('spotlight-apps');
        const filesContainer = document.getElementById('spotlight-files');
        const systemContainer = document.getElementById('spotlight-system');
        if (!appsContainer || !filesContainer || !systemContainer) return;

        const q = query.toLowerCase();

        // Filter apps
        const filteredApps = apps.filter(app =>
            app.name.toLowerCase().includes(q)
        );

        appsContainer.innerHTML = filteredApps.map((app, i) => `
            <div class="spotlight-item ${i === 0 && q ? 'selected' : ''}" data-app="${app.id}">
                <div class="spotlight-item-icon"><i class="ph ${app.icon}"></i></div>
                <div class="spotlight-item-info">
                    <div class="spotlight-item-name">${app.name}</div>
                    <div class="spotlight-item-path">Application</div>
                </div>
            </div>
        `).join('');

        // Filter files
        const files = this.fileSystem ? this.fileSystem.listDirectory('/') : [];
        const filteredFiles = files.filter(file =>
            file.name.toLowerCase().includes(q)
        );

        filesContainer.innerHTML = filteredFiles.slice(0, 5).map(file => `
            <div class="spotlight-item" data-file="/${file.name}">
                <div class="spotlight-item-icon"><i class="ph ${file.type === 'directory' ? 'ph-folder' : 'ph-file'}"></i></div>
                <div class="spotlight-item-info">
                    <div class="spotlight-item-name">${file.name}</div>
                    <div class="spotlight-item-path">/${file.name}</div>
                </div>
            </div>
        `).join('');

        // Filter system items
        const filteredSystem = systemItems.filter(item =>
            item.name.toLowerCase().includes(q)
        );

        systemContainer.innerHTML = filteredSystem.map(item => `
            <div class="spotlight-item" data-system="${item.id}">
                <div class="spotlight-item-icon"><i class="ph ${item.icon}"></i></div>
                <div class="spotlight-item-info">
                    <div class="spotlight-item-name">${item.name}</div>
                    <div class="spotlight-item-path">System</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.spotlight-item').forEach(item => {
            item.addEventListener('click', () => {
                const appId = item.dataset.app;
                const systemId = item.dataset.system;

                if (appId) {
                    this.openApp(appId);
                } else if (systemId) {
                    const systemItem = systemItems.find(s => s.id === systemId);
                    if (systemItem) systemItem.action();
                }

                document.getElementById('spotlight-overlay').classList.add('hidden');
            });
        });
    }

    initCalendar() {
        const timeEl = document.getElementById('top-bar-time');
        const calendarPopup = document.getElementById('calendar-popup');
        if (!timeEl || !calendarPopup) return;

        timeEl.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeAllMenus();
            calendarPopup.classList.toggle('hidden');
            this.renderCalendar();
        });

        document.getElementById('cal-prev')?.addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() - 1);
            this.renderCalendar();
        });

        document.getElementById('cal-next')?.addEventListener('click', () => {
            this.calendarDate.setMonth(this.calendarDate.getMonth() + 1);
            this.renderCalendar();
        });
    }

    renderCalendar() {
        const monthEl = document.getElementById('calendar-month');
        const daysEl = document.getElementById('calendar-days');
        const timeEl = document.getElementById('calendar-time');
        if (!monthEl || !daysEl) return;

        const now = new Date();
        const year = this.calendarDate.getFullYear();
        const month = this.calendarDate.getMonth();

        monthEl.textContent = this.calendarDate.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        let html = '';

        // Previous month days
        for (let i = firstDay - 1; i >= 0; i--) {
            html += `<div class="calendar-day other-month">${daysInPrevMonth - i}</div>`;
        }

        // Current month days
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === now.getDate() &&
                           month === now.getMonth() &&
                           year === now.getFullYear();
            html += `<div class="calendar-day ${isToday ? 'today' : ''}">${i}</div>`;
        }

        // Next month days
        const totalCells = firstDay + daysInMonth;
        const remaining = 42 - totalCells;
        for (let i = 1; i <= remaining; i++) {
            html += `<div class="calendar-day other-month">${i}</div>`;
        }

        daysEl.innerHTML = html;

        if (timeEl) {
            timeEl.textContent = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        }
    }

    initWifiMenu() {
        const wifiBtn = document.getElementById('wifi-icon');
        const wifiMenu = document.getElementById('wifi-menu');
        if (!wifiBtn || !wifiMenu) return;

        wifiBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeAllMenus();
            wifiMenu.classList.toggle('hidden');
        });

        const toggle = document.getElementById('wifi-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => {
                toggle.classList.toggle('active');
            });
        }
    }

    initBatteryMenu() {
        const batteryBtn = document.getElementById('battery-icon');
        const batteryMenu = document.getElementById('battery-menu');
        if (!batteryBtn || !batteryMenu) return;

        batteryBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeAllMenus();
            batteryMenu.classList.toggle('hidden');
        });
    }

    initAboutMac() {
        const overlay = document.getElementById('about-mac-overlay');
        const closeBtn = document.getElementById('about-mac-close');
        if (!overlay || !closeBtn) return;

        closeBtn.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });

        document.getElementById('about-more-info')?.addEventListener('click', () => {
            this.openApp('settings');
            overlay.classList.add('hidden');
        });

        document.getElementById('about-system-report')?.addEventListener('click', () => {
            this.showNotification('System Report', 'System Report coming soon!', 'info');
        });

        document.getElementById('about-software-update')?.addEventListener('click', () => {
            this.showNotification('Software Update', 'NovaOS is up to date!', 'success');
        });
    }

    showAboutMac() {
        const overlay = document.getElementById('about-mac-overlay');
        if (overlay) {
            // Update storage info
            const storageEl = document.getElementById('about-storage');
            if (storageEl && this.fileSystem) {
                const size = JSON.stringify(this.fileSystem.fs).length;
                storageEl.textContent = `${(size / 1024).toFixed(2)} KB used`;
            }
            overlay.classList.remove('hidden');
        }
    }

    initForceQuit() {
        const overlay = document.getElementById('force-quit-overlay');
        const list = document.getElementById('force-quit-list');
        const cancelBtn = document.getElementById('force-quit-cancel');
        const quitBtn = document.getElementById('force-quit-btn');
        if (!overlay || !list) return;

        cancelBtn?.addEventListener('click', () => {
            overlay.classList.add('hidden');
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.add('hidden');
            }
        });

        quitBtn?.addEventListener('click', () => {
            const selected = list.querySelector('.force-quit-app.selected');
            if (selected) {
                const appId = selected.dataset.app;
                const window = this.windows.get(appId);
                if (window) {
                    this.closeWindow(appId, window.element);
                }
            }
            overlay.classList.add('hidden');
        });
    }

    showForceQuit() {
        const overlay = document.getElementById('force-quit-overlay');
        const list = document.getElementById('force-quit-list');
        if (!overlay || !list) return;

        const icons = {
            'file-explorer': 'ph-folder',
            'terminal': 'ph-terminal-window',
            'text-editor': 'ph-note-pencil',
            'calculator': 'ph-calculator',
            'image-viewer': 'ph-image',
            'file-viewer': 'ph-files',
            'browser': 'ph-globe',
            'settings': 'ph-gear'
        };

        list.innerHTML = '';
        this.windows.forEach((win, id) => {
            const app = document.createElement('div');
            app.className = 'force-quit-app';
            app.dataset.app = id;
            app.innerHTML = `
                <div class="force-quit-app-icon"><i class="ph ${icons[id] || 'ph-app-window'}"></i></div>
                <div class="force-quit-app-name">${win.title}</div>
            `;
            app.addEventListener('click', () => {
                list.querySelectorAll('.force-quit-app').forEach(a => a.classList.remove('selected'));
                app.classList.add('selected');
            });
            list.appendChild(app);
        });

        if (list.children.length === 0) {
            list.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--gray-text);">No apps running</div>';
        }

        overlay.classList.remove('hidden');
    }

    initDropdownMenus() {
        // File, Edit, View, Go, Window, Help menus
        const menuIds = ['menu-file', 'menu-edit', 'menu-view', 'menu-go', 'menu-window', 'menu-help'];

        menuIds.forEach(menuId => {
            const menuItem = document.getElementById(menuId);
            if (!menuItem) return;

            menuItem.addEventListener('click', (e) => {
                e.stopPropagation();
                this.closeAllMenus();

                // Show relevant menu items
                const menuType = menuId.replace('menu-', '');
                this.showDropdownMenu(menuItem, menuType);
            });
        });
    }

    showDropdownMenu(trigger, type) {
        // Remove existing dropdown
        document.querySelector('.dropdown-menu')?.remove();

        const menus = {
            file: [
                { label: 'New Window', shortcut: '⌘N', action: () => this.openApp('file-explorer') },
                { label: 'New Tab', shortcut: '⌘T', disabled: true },
                { separator: true },
                { label: 'Open...', shortcut: '⌘O', disabled: true },
                { label: 'Close Window', shortcut: '⌘W', action: () => {
                    const active = this.getActiveWindow();
                    if (active) this.closeWindow(active.dataset.id, active);
                }},
            ],
            edit: [
                { label: 'Undo', shortcut: '⌘Z', disabled: true },
                { label: 'Redo', shortcut: '⇧⌘Z', disabled: true },
                { separator: true },
                { label: 'Cut', shortcut: '⌘X', disabled: true },
                { label: 'Copy', shortcut: '⌘C', disabled: true },
                { label: 'Paste', shortcut: '⌘V', disabled: true },
                { label: 'Select All', shortcut: '⌘A', disabled: true },
            ],
            view: [
                { label: 'Show Toolbar', disabled: true },
                { label: 'Show Sidebar', disabled: true },
                { separator: true },
                { label: 'Enter Full Screen', shortcut: '⌃⌘F', action: () => {
                    document.documentElement.requestFullscreen?.();
                }},
            ],
            go: [
                { label: 'Back', shortcut: '⌘[', disabled: true },
                { label: 'Forward', shortcut: '⌘]', disabled: true },
                { separator: true },
                { label: 'Home', action: () => this.openApp('file-explorer') },
                { label: 'Documents', disabled: true },
                { label: 'Downloads', disabled: true },
            ],
            window: [
                { label: 'Minimize', shortcut: '⌘M', action: () => {
                    const active = this.getActiveWindow();
                    if (active) this.minimizeWindow(active);
                }},
                { label: 'Zoom', action: () => {
                    const active = this.getActiveWindow();
                    if (active) this.toggleMaximize(active);
                }},
                { separator: true },
                { label: 'Bring All to Front', disabled: true },
            ],
            help: [
                { label: 'NovaOS Help', disabled: true },
                { separator: true },
                { label: 'About NovaOS', action: () => this.showAboutMac() },
            ]
        };

        const items = menus[type] || [];
        const dropdown = document.createElement('div');
        dropdown.className = 'dropdown-menu';

        const rect = trigger.getBoundingClientRect();
        dropdown.style.left = `${rect.left}px`;

        dropdown.innerHTML = items.map(item => {
            if (item.separator) {
                return '<div class="dropdown-separator"></div>';
            }
            return `
                <div class="dropdown-item ${item.disabled ? 'disabled' : ''}" data-action="${item.label}">
                    <span>${item.label}</span>
                    ${item.shortcut ? `<kbd>${item.shortcut}</kbd>` : ''}
                </div>
            `;
        }).join('');

        document.body.appendChild(dropdown);

        // Add click handlers
        dropdown.querySelectorAll('.dropdown-item:not(.disabled)').forEach((el, i) => {
            const item = items.filter(it => !it.separator)[i];
            if (item && item.action) {
                el.addEventListener('click', () => {
                    item.action();
                    dropdown.remove();
                });
            }
        });

        // Show after adding to DOM
        requestAnimationFrame(() => dropdown.classList.remove('hidden'));
    }

    getActiveWindow() {
        const windows = Array.from(this.windows.values());
        if (windows.length === 0) return null;

        return windows
            .map(w => ({ el: w.element, z: parseInt(w.element.style.zIndex) }))
            .sort((a, b) => b.z - a.z)[0]?.el || null;
    }

    closeAllMenus() {
        document.getElementById('apple-menu')?.classList.add('hidden');
        document.getElementById('control-center')?.classList.add('hidden');
        document.getElementById('calendar-popup')?.classList.add('hidden');
        document.getElementById('wifi-menu')?.classList.add('hidden');
        document.getElementById('battery-menu')?.classList.add('hidden');
        document.querySelector('.dropdown-menu')?.remove();
    }

    updateTopBarForApp(appName, appMenus) {
        const appMenuTitle = document.getElementById('app-menu-title');
        if (appMenuTitle) {
            appMenuTitle.textContent = appName;
        }

        this.currentAppMenus = appMenus;
    }

    addToDock(id, title, icon, windowEl) {
        // Mark the dock item as running
        const dockItem = document.querySelector(`.dock-item[data-app="${id}"]`);
        if (dockItem) {
            dockItem.classList.add('running');
            // Store reference to window for click handler
            dockItem._windowRef = windowEl;
        } else {
            // For apps not in the permanent dock, add to running apps section
            const runningApps = document.getElementById('dock-running-apps');
            if (runningApps) {
                const appEl = document.createElement('div');
                appEl.className = 'dock-item running';
                appEl.dataset.id = id;
                appEl.innerHTML = icon;
                appEl._windowRef = windowEl;

                appEl.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const win = appEl._windowRef;
                    if (win.classList.contains('minimized')) {
                        win.classList.remove('minimized');
                        this.focusWindow(win);
                    } else if (win.style.zIndex == this.windowZIndex - 1) {
                        this.minimizeWindow(win);
                    } else {
                        this.focusWindow(win);
                    }
                });

                runningApps.appendChild(appEl);
            }
        }
    }

    removeFromDock(id) {
        // Remove running indicator from permanent dock item
        const dockItem = document.querySelector(`.dock-item[data-app="${id}"]`);
        if (dockItem) {
            dockItem.classList.remove('running');
            dockItem._windowRef = null;
        }

        // Remove from running apps section if present
        const runningApp = document.querySelector(`#dock-running-apps .dock-item[data-id="${id}"]`);
        if (runningApp) {
            runningApp.remove();
        }
    }

    addToTaskbar(id, title, icon, windowEl) {
        // Use the new dock system
        this.addToDock(id, title, icon, windowEl);

        // Keep old taskbar for compatibility (if it exists)
        const taskbarApps = document.getElementById('taskbar-apps');
        if (taskbarApps) {
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
    }

    createNotificationContainer() {
        if (!document.querySelector('.notification-container')) {
            const container = document.createElement('div');
            container.className = 'notification-container';
            document.body.appendChild(container);
        }
    }

    showNotification(title, message, type = 'info') {
        const container = document.querySelector('.notification-container');
        if (!container) return;

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;

        const iconMap = {
            info: 'ph-info',
            warning: 'ph-warning',
            error: 'ph-x-circle',
            success: 'ph-check-circle'
        };

        notification.innerHTML = `
            <i class="ph ${iconMap[type] || iconMap.info} notification-icon"></i>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
        `;

        container.appendChild(notification);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.classList.add('closing');
            setTimeout(() => notification.remove(), 300);
        }, 4000);
    }

    initUserMenu() {
        const userIcon = document.getElementById('user-menu-icon');
        if (!userIcon) return;

        // Create user menu
        const userMenu = document.createElement('div');
        userMenu.className = 'user-menu hidden';
        userMenu.innerHTML = `
            <div class="user-menu-header">
                <div class="user-menu-avatar">
                    <i class="ph ph-user-circle"></i>
                </div>
                <div class="user-menu-info">
                    <div class="user-menu-name" id="user-menu-name">${this.currentUser}</div>
                    <div class="user-menu-subtitle">NovaOS User</div>
                </div>
            </div>
            <div class="user-menu-divider"></div>
            <div class="user-menu-items">
                <div class="user-menu-item" data-action="profile">
                    <i class="ph ph-user"></i>
                    <span>Profile Settings</span>
                </div>
                <div class="user-menu-item" data-action="preferences">
                    <i class="ph ph-gear"></i>
                    <span>System Preferences</span>
                </div>
                <div class="user-menu-item" data-action="appearance">
                    <i class="ph ph-palette"></i>
                    <span>Appearance</span>
                </div>
            </div>
            <div class="user-menu-divider"></div>
            <div class="user-menu-items">
                <div class="user-menu-item" data-action="lock">
                    <i class="ph ph-lock"></i>
                    <span>Lock Screen</span>
                </div>
                <div class="user-menu-item" data-action="logout">
                    <i class="ph ph-sign-out"></i>
                    <span>Log Out</span>
                </div>
                <div class="user-menu-item danger" data-action="shutdown">
                    <i class="ph ph-power"></i>
                    <span>Shut Down</span>
                </div>
            </div>
        `;
        document.body.appendChild(userMenu);

        // Toggle user menu
        userIcon.addEventListener('click', (e) => {
            e.stopPropagation();
            const rect = userIcon.getBoundingClientRect();
            userMenu.style.top = `${rect.bottom + 8}px`;
            userMenu.style.right = `${window.innerWidth - rect.right}px`;
            userMenu.classList.toggle('hidden');
        });

        // Close user menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenu.contains(e.target) && !userIcon.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });

        // Handle user menu actions
        userMenu.querySelectorAll('.user-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                userMenu.classList.add('hidden');

                switch(action) {
                    case 'profile':
                    case 'preferences':
                    case 'appearance':
                        this.openApp('settings');
                        break;
                    case 'lock':
                        this.showNotification('Lock Screen', 'Screen lock feature coming soon!', 'info');
                        break;
                    case 'logout':
                        this.logout();
                        break;
                    case 'shutdown':
                        this.shutdown();
                        break;
                }
            });
        });
    }

    initContextMenu() {
        // Create context menu
        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-section">
                <div class="context-menu-title">Applications</div>
                <div class="context-menu-item" data-action="new-file-explorer">
                    <i class="ph ph-folder"></i>
                    <div class="context-menu-item-content">
                        <span>New File Explorer</span>
                        <kbd class="context-menu-shortcut">⌘N</kbd>
                    </div>
                </div>
                <div class="context-menu-item" data-action="new-terminal">
                    <i class="ph ph-terminal-window"></i>
                    <div class="context-menu-item-content">
                        <span>New Terminal</span>
                        <kbd class="context-menu-shortcut">⌘T</kbd>
                    </div>
                </div>
                <div class="context-menu-item" data-action="browser">
                    <i class="ph ph-globe"></i>
                    <div class="context-menu-item-content">
                        <span>Open Browser</span>
                    </div>
                </div>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-section">
                <div class="context-menu-title">View</div>
                <div class="context-menu-item" data-action="wallpaper">
                    <i class="ph ph-image"></i>
                    <div class="context-menu-item-content">
                        <span>Change Wallpaper</span>
                    </div>
                </div>
                <div class="context-menu-item" data-action="refresh">
                    <i class="ph ph-arrow-clockwise"></i>
                    <div class="context-menu-item-content">
                        <span>Refresh</span>
                    </div>
                </div>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-section">
                <div class="context-menu-item" data-action="settings">
                    <i class="ph ph-gear"></i>
                    <div class="context-menu-item-content">
                        <span>System Preferences</span>
                        <kbd class="context-menu-shortcut">⌘,</kbd>
                    </div>
                </div>
                <div class="context-menu-item" data-action="about">
                    <i class="ph ph-info"></i>
                    <div class="context-menu-item-content">
                        <span>About NovaOS</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(contextMenu);

        // Show context menu on right-click
        const desktop = document.querySelector('.desktop-background');
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            contextMenu.classList.add('active');
        });

        // Hide context menu on click
        document.addEventListener('click', (e) => {
            if (!contextMenu.contains(e.target)) {
                contextMenu.classList.remove('active');
            }
        });

        // Handle context menu actions
        contextMenu.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', () => {
                const action = item.dataset.action;
                contextMenu.classList.remove('active');

                switch(action) {
                    case 'new-file-explorer':
                        this.openApp('file-explorer');
                        break;
                    case 'new-terminal':
                        this.openApp('terminal');
                        break;
                    case 'browser':
                        this.openApp('browser');
                        break;
                    case 'wallpaper':
                        this.openApp('settings');
                        break;
                    case 'refresh':
                        location.reload();
                        break;
                    case 'settings':
                        this.openApp('settings');
                        break;
                    case 'about':
                        this.showNotification(
                            'NovaOS 25U11.2',
                            'A modern web-based operating system with macOS-style UI. Built with vanilla JavaScript.',
                            'info'
                        );
                        break;
                }
            });
        });
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
