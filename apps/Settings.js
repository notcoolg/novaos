// Settings Application
class Settings {
    constructor(os) {
        this.os = os;
    }

    getAppInfo() {
        return {
            title: 'Settings',
            icon: '⚙️',
            content: this.createContent()
        };
    }

    createContent() {
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
                            <div class="setting-value">${this.os.currentUser}</div>
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

    init(windowEl) {
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
}
