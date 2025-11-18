// Settings Application
class Settings {
    constructor(os) {
        this.os = os;
        this.settings = this.loadSettings();
    }

    loadSettings() {
        const defaults = {
            theme: 'dark',
            font: 'system',
            animations: true,
            blur: true,
            wallpaper: 'default',
            accentColor: 'blue'
        };

        const saved = localStorage.getItem('novaos_settings');
        return saved ? { ...defaults, ...JSON.parse(saved) } : defaults;
    }

    saveSettings() {
        localStorage.setItem('novaos_settings', JSON.stringify(this.settings));
    }

    getAppInfo() {
        return {
            title: 'Settings',
            icon: '<i class="ph ph-gear"></i>',
            content: this.createContent()
        };
    }

    createContent() {
        const users = JSON.parse(localStorage.getItem('novaos_users'));
        const userCount = Object.keys(users).length;
        const fsSize = new Blob([localStorage.getItem('novaos_filesystem')]).size;

        return `
            <div class="settings-tabs">
                <div class="settings-tab active" data-tab="appearance"><i class="ph ph-palette"></i> Appearance</div>
                <div class="settings-tab" data-tab="preferences"><i class="ph ph-sliders"></i> Preferences</div>
                <div class="settings-tab" data-tab="system"><i class="ph ph-info"></i> System</div>
                <div class="settings-tab" data-tab="keyboard"><i class="ph ph-keyboard"></i> Shortcuts</div>
                <div class="settings-tab" data-tab="changelog"><i class="ph ph-clock-counter-clockwise"></i> Changelog</div>
            </div>
            <div class="settings-content">
                <!-- Appearance Tab -->
                <div class="settings-tab-content active" data-content="appearance">
                    <div class="settings-section">
                        <div class="settings-section-title">Theme</div>
                        <div class="settings-option">
                            <div>
                                <div class="settings-option-label">Color Scheme</div>
                                <div class="settings-option-description">Choose your preferred color scheme</div>
                            </div>
                            <select class="settings-select" id="theme-select">
                                <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                                <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Light</option>
                                <option value="auto" ${this.settings.theme === 'auto' ? 'selected' : ''}>Auto (System)</option>
                            </select>
                        </div>
                        <div class="settings-option">
                            <div>
                                <div class="settings-option-label">Accent Color</div>
                                <div class="settings-option-description">Choose your preferred accent color</div>
                            </div>
                            <select class="settings-select" id="accent-select">
                                <option value="blue" ${this.settings.accentColor === 'blue' ? 'selected' : ''}>Blue</option>
                                <option value="purple" ${this.settings.accentColor === 'purple' ? 'selected' : ''}>Purple</option>
                                <option value="pink" ${this.settings.accentColor === 'pink' ? 'selected' : ''}>Pink</option>
                                <option value="red" ${this.settings.accentColor === 'red' ? 'selected' : ''}>Red</option>
                                <option value="orange" ${this.settings.accentColor === 'orange' ? 'selected' : ''}>Orange</option>
                                <option value="green" ${this.settings.accentColor === 'green' ? 'selected' : ''}>Green</option>
                                <option value="teal" ${this.settings.accentColor === 'teal' ? 'selected' : ''}>Teal</option>
                            </select>
                        </div>
                    </div>

                    <div class="settings-section">
                        <div class="settings-section-title">Font Family</div>
                        <div class="settings-option">
                            <div>
                                <div class="settings-option-label">System Font</div>
                                <div class="settings-option-description">Choose your preferred font</div>
                            </div>
                            <select class="settings-select" id="font-select">
                                <option value="system" ${this.settings.font === 'system' ? 'selected' : ''}>SF Pro (System)</option>
                                <option value="inter" ${this.settings.font === 'inter' ? 'selected' : ''}>Inter</option>
                                <option value="roboto" ${this.settings.font === 'roboto' ? 'selected' : ''}>Roboto</option>
                                <option value="mono" ${this.settings.font === 'mono' ? 'selected' : ''}>SF Mono</option>
                            </select>
                        </div>
                        <div class="font-preview" id="font-preview">
                            The quick brown fox jumps over the lazy dog.
                            <br>0123456789 !@#$%^&*()
                        </div>
                    </div>
                </div>

                <!-- Preferences Tab -->
                <div class="settings-tab-content" data-content="preferences">
                    <div class="settings-section">
                        <div class="settings-section-title">Visual Effects</div>
                        <div class="settings-option">
                            <div>
                                <div class="settings-option-label">Animations</div>
                                <div class="settings-option-description">Enable window animations and transitions</div>
                            </div>
                            <div class="settings-toggle ${this.settings.animations ? 'active' : ''}" id="animations-toggle">
                                <div class="settings-toggle-slider"></div>
                            </div>
                        </div>
                        <div class="settings-option">
                            <div>
                                <div class="settings-option-label">Blur Effects</div>
                                <div class="settings-option-description">Enable glassmorphism blur effects</div>
                            </div>
                            <div class="settings-toggle ${this.settings.blur ? 'active' : ''}" id="blur-toggle">
                                <div class="settings-toggle-slider"></div>
                            </div>
                        </div>
                    </div>

                    <div class="settings-section">
                        <div class="settings-section-title">Desktop</div>
                        <div class="settings-option">
                            <div>
                                <div class="settings-option-label">Wallpaper</div>
                                <div class="settings-option-description">Choose desktop wallpaper style</div>
                            </div>
                            <select class="settings-select" id="wallpaper-select">
                                <option value="default" ${this.settings.wallpaper === 'default' ? 'selected' : ''}>Purple Wave</option>
                                <option value="neon" ${this.settings.wallpaper === 'neon' ? 'selected' : ''}>Neon Lights</option>
                                <option value="aurora" ${this.settings.wallpaper === 'aurora' ? 'selected' : ''}>Aurora Borealis</option>
                                <option value="sunset" ${this.settings.wallpaper === 'sunset' ? 'selected' : ''}>Miami Sunset</option>
                                <option value="ocean" ${this.settings.wallpaper === 'ocean' ? 'selected' : ''}>Deep Ocean</option>
                                <option value="forest" ${this.settings.wallpaper === 'forest' ? 'selected' : ''}>Emerald Forest</option>
                                <option value="fire" ${this.settings.wallpaper === 'fire' ? 'selected' : ''}>Fire & Ice</option>
                                <option value="cyberpunk" ${this.settings.wallpaper === 'cyberpunk' ? 'selected' : ''}>Cyberpunk</option>
                                <option value="galaxy" ${this.settings.wallpaper === 'galaxy' ? 'selected' : ''}>Galaxy</option>
                                <option value="minimal-dark" ${this.settings.wallpaper === 'minimal-dark' ? 'selected' : ''}>Minimal Dark</option>
                                <option value="minimal-light" ${this.settings.wallpaper === 'minimal-light' ? 'selected' : ''}>Minimal Light</option>
                            </select>
                        </div>
                    </div>
                </div>

                <!-- System Tab -->
                <div class="settings-tab-content" data-content="system">
                    <div class="settings-section">
                        <div class="settings-section-title">System Information</div>
                        <div class="settings-option">
                            <div class="settings-option-label">Operating System</div>
                            <div class="setting-value">NovaOS 25U11.2</div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">Current User</div>
                            <div class="setting-value">${this.os.currentUser}</div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">Total Users</div>
                            <div class="setting-value">${userCount}</div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title">Storage</div>
                        <div class="settings-option">
                            <div class="settings-option-label">File System Size</div>
                            <div class="setting-value">${(fsSize / 1024).toFixed(2)} KB</div>
                        </div>
                    </div>
                    <div class="settings-section">
                        <div class="settings-section-title">About</div>
                        <div class="settings-option">
                            <div class="settings-option-label">Version</div>
                            <div class="setting-value">25U11.2</div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">Build Date</div>
                            <div class="setting-value">2025-11-18</div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">Release Notes</div>
                            <div class="setting-value">macOS UI Update</div>
                        </div>
                        <div class="settings-option">
                            <div class="settings-option-label">Codename</div>
                            <div class="setting-value">Nova</div>
                        </div>
                    </div>
                </div>

                <!-- Keyboard Tab -->
                <div class="settings-tab-content" data-content="keyboard">
                    <div class="settings-section">
                        <div class="settings-section-title">Keyboard Shortcuts</div>
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

                <!-- Changelog Tab -->
                <div class="settings-tab-content" data-content="changelog">
                    <div id="changelog-viewer" class="changelog-viewer">Loading changelog...</div>
                </div>
            </div>
        `;
    }

    init(windowEl) {
        // Handle tab switching
        const tabs = windowEl.querySelectorAll('.settings-tab');
        const contents = windowEl.querySelectorAll('.settings-tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;

                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                contents.forEach(c => c.classList.remove('active'));
                const content = windowEl.querySelector(`[data-content="${tabName}"]`);
                if (content) content.classList.add('active');

                if (tabName === 'changelog') {
                    this.loadChangelog(windowEl);
                }
            });
        });

        // Theme selector
        const themeSelect = windowEl.querySelector('#theme-select');
        if (themeSelect) {
            themeSelect.addEventListener('change', (e) => {
                this.settings.theme = e.target.value;
                this.saveSettings();
                this.applyTheme();
            });
        }

        // Font selector
        const fontSelect = windowEl.querySelector('#font-select');
        const fontPreview = windowEl.querySelector('#font-preview');
        if (fontSelect) {
            fontSelect.addEventListener('change', (e) => {
                this.settings.font = e.target.value;
                this.saveSettings();
                this.applyFont();
                this.updateFontPreview(fontPreview);
            });
            this.updateFontPreview(fontPreview);
        }

        // Animations toggle
        const animationsToggle = windowEl.querySelector('#animations-toggle');
        if (animationsToggle) {
            animationsToggle.addEventListener('click', () => {
                this.settings.animations = !this.settings.animations;
                animationsToggle.classList.toggle('active');
                this.saveSettings();
                this.applyAnimations();
            });
        }

        // Blur toggle
        const blurToggle = windowEl.querySelector('#blur-toggle');
        if (blurToggle) {
            blurToggle.addEventListener('click', () => {
                this.settings.blur = !this.settings.blur;
                blurToggle.classList.toggle('active');
                this.saveSettings();
                this.applyBlur();
            });
        }

        // Wallpaper selector
        const wallpaperSelect = windowEl.querySelector('#wallpaper-select');
        if (wallpaperSelect) {
            wallpaperSelect.addEventListener('change', (e) => {
                this.settings.wallpaper = e.target.value;
                this.saveSettings();
                this.applyWallpaper();
            });
        }

        // Accent color selector
        const accentSelect = windowEl.querySelector('#accent-select');
        if (accentSelect) {
            accentSelect.addEventListener('change', (e) => {
                this.settings.accentColor = e.target.value;
                this.saveSettings();
                this.applyAccentColor();
            });
        }

        // Apply settings on init
        this.applyTheme();
        this.applyFont();
        this.applyAnimations();
        this.applyBlur();
        this.applyWallpaper();
        this.applyAccentColor();
    }

    applyTheme() {
        if (this.settings.theme === 'light') {
            document.body.setAttribute('data-theme', 'light');
        } else if (this.settings.theme === 'dark') {
            document.body.setAttribute('data-theme', 'dark');
        } else {
            // Auto - use system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        }
    }

    applyFont() {
        const fonts = {
            system: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
            inter: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            roboto: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
            mono: '"SF Mono", Monaco, "Courier New", monospace'
        };
        document.body.style.fontFamily = fonts[this.settings.font] || fonts.system;
    }

    updateFontPreview(preview) {
        if (!preview) return;
        const fonts = {
            system: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", system-ui, sans-serif',
            inter: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
            roboto: '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
            mono: '"SF Mono", Monaco, "Courier New", monospace'
        };
        preview.style.fontFamily = fonts[this.settings.font] || fonts.system;
    }

    applyAnimations() {
        if (this.settings.animations) {
            document.body.classList.remove('no-animations');
        } else {
            document.body.classList.add('no-animations');
        }
    }

    applyBlur() {
        if (this.settings.blur) {
            document.body.classList.remove('no-blur');
        } else {
            document.body.classList.add('no-blur');
        }
    }

    applyWallpaper() {
        const desktop = document.querySelector('.desktop-background');
        if (!desktop) return;

        const wallpapers = {
            'default': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'neon': 'linear-gradient(45deg, #ff0080 0%, #ff8c00 30%, #40e0d0 60%, #9d00ff 100%)',
            'aurora': 'linear-gradient(180deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            'sunset': 'linear-gradient(135deg, #fa709a 0%, #fee140 50%, #30cfd0 100%)',
            'ocean': 'linear-gradient(180deg, #000428 0%, #004e92 50%, #1a7fa0 100%)',
            'forest': 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
            'fire': 'linear-gradient(135deg, #f12711 0%, #f5af19 50%, #00d2ff 100%)',
            'cyberpunk': 'linear-gradient(135deg, #ff006e 0%, #8338ec 33%, #3a86ff 66%, #06ffa5 100%)',
            'galaxy': 'radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%), linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            'minimal-dark': 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
            'minimal-light': 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)'
        };

        desktop.style.background = wallpapers[this.settings.wallpaper] || wallpapers.default;
    }

    applyAccentColor() {
        const accentColors = {
            blue: '#007AFF',
            purple: '#5856D6',
            pink: '#FF2D55',
            red: '#FF3B30',
            orange: '#FF9500',
            green: '#34C759',
            teal: '#5AC8FA'
        };

        const color = accentColors[this.settings.accentColor] || accentColors.blue;
        document.documentElement.style.setProperty('--primary-color', color);
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
        let html = md;

        // Parse headers
        html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
        html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
        html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

        // Parse bold
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

        // Parse links
        html = html.replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Parse lists
        const lines = html.split('\n');
        let inList = false;
        let result = [];

        for (let line of lines) {
            if (line.match(/^- /)) {
                if (!inList) {
                    result.push('<ul>');
                    inList = true;
                }
                result.push('<li>' + line.substring(2) + '</li>');
            } else {
                if (inList) {
                    result.push('</ul>');
                    inList = false;
                }
                result.push(line);
            }
        }

        if (inList) {
            result.push('</ul>');
        }

        html = result.join('\n');

        // Parse paragraphs
        html = html.replace(/\n\n/g, '</p><p>');
        html = '<div>' + html + '</div>';

        return html;
    }
}
