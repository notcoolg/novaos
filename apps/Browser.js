class Browser {
    constructor(os) {
        this.os = os;
        this.history = [];
        this.currentIndex = -1;
    }

    getAppInfo() {
        return {
            title: 'Browser',
            icon: '<i class="ph ph-globe"></i>',
            content: this.createContent()
        };
    }

    createContent() {
        return `
            <div class="browser-container">
                <div class="browser-toolbar">
                    <button class="browser-nav-btn" id="browser-back-btn" disabled>
                        <i class="ph ph-arrow-left"></i>
                    </button>
                    <button class="browser-nav-btn" id="browser-forward-btn" disabled>
                        <i class="ph ph-arrow-right"></i>
                    </button>
                    <button class="browser-nav-btn" id="browser-refresh-btn">
                        <i class="ph ph-arrow-clockwise"></i>
                    </button>
                    <button class="browser-nav-btn" id="browser-home-btn">
                        <i class="ph ph-house"></i>
                    </button>
                    <input type="text" class="browser-address-bar" id="browser-address-bar" placeholder="Enter URL or search...">
                    <button class="browser-nav-btn" id="browser-go-btn">
                        <i class="ph ph-arrow-right"></i>
                    </button>
                </div>
                <div class="browser-content" id="browser-content">
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #333;">
                        <i class="ph ph-globe" style="font-size: 64px; color: #999; margin-bottom: 16px;"></i>
                        <div style="font-size: 18px; margin-bottom: 8px;">Welcome to NovaOS Browser</div>
                        <div style="font-size: 13px; color: #666; text-align: center; max-width: 500px;">
                            Enter a URL in the address bar to browse the web.<br>
                            Note: Some sites may not load due to iframe restrictions.
                        </div>
                        <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
                            <button onclick="document.getElementById('browser-address-bar').value='https://example.com'; document.getElementById('browser-go-btn').click();"
                                style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                Example.com
                            </button>
                            <button onclick="document.getElementById('browser-address-bar').value='https://www.wikipedia.org'; document.getElementById('browser-go-btn').click();"
                                style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 6px; cursor: pointer;">
                                Wikipedia
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    init(windowEl) {
        this.windowEl = windowEl;
        this.contentEl = windowEl.querySelector('#browser-content');
        this.addressBar = windowEl.querySelector('#browser-address-bar');
        this.backBtn = windowEl.querySelector('#browser-back-btn');
        this.forwardBtn = windowEl.querySelector('#browser-forward-btn');
        this.refreshBtn = windowEl.querySelector('#browser-refresh-btn');
        this.homeBtn = windowEl.querySelector('#browser-home-btn');
        this.goBtn = windowEl.querySelector('#browser-go-btn');

        // Navigation buttons
        this.backBtn.addEventListener('click', () => this.goBack());
        this.forwardBtn.addEventListener('click', () => this.goForward());
        this.refreshBtn.addEventListener('click', () => this.refresh());
        this.homeBtn.addEventListener('click', () => this.goHome());
        this.goBtn.addEventListener('click', () => this.navigate());

        // Address bar
        this.addressBar.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigate();
            }
        });
    }

    navigate() {
        let url = this.addressBar.value.trim();

        if (!url) return;

        // Add https:// if no protocol specified
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }

        // Update history
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        this.history.push(url);
        this.currentIndex++;

        this.loadURL(url);
        this.updateButtons();
    }

    loadURL(url) {
        this.addressBar.value = url;
        this.contentEl.innerHTML = `<iframe src="${url}" class="browser-iframe" sandbox="allow-scripts allow-same-origin allow-forms allow-popups"></iframe>`;
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.loadURL(this.history[this.currentIndex]);
            this.updateButtons();
        }
    }

    goForward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.loadURL(this.history[this.currentIndex]);
            this.updateButtons();
        }
    }

    refresh() {
        if (this.currentIndex >= 0 && this.history[this.currentIndex]) {
            this.loadURL(this.history[this.currentIndex]);
        }
    }

    goHome() {
        this.addressBar.value = '';
        this.contentEl.innerHTML = `
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; background: #f5f5f5; color: #333;">
                <i class="ph ph-globe" style="font-size: 64px; color: #999; margin-bottom: 16px;"></i>
                <div style="font-size: 18px; margin-bottom: 8px;">Welcome to NovaOS Browser</div>
                <div style="font-size: 13px; color: #666; text-align: center; max-width: 500px;">
                    Enter a URL in the address bar to browse the web.<br>
                    Note: Some sites may not load due to iframe restrictions.
                </div>
                <div style="margin-top: 24px; display: flex; gap: 12px; flex-wrap: wrap;">
                    <button onclick="document.getElementById('browser-address-bar').value='https://example.com'; document.getElementById('browser-go-btn').click();"
                        style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Example.com
                    </button>
                    <button onclick="document.getElementById('browser-address-bar').value='https://www.wikipedia.org'; document.getElementById('browser-go-btn').click();"
                        style="padding: 8px 16px; background: #007AFF; color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Wikipedia
                    </button>
                </div>
            </div>
        `;
    }

    updateButtons() {
        this.backBtn.disabled = this.currentIndex <= 0;
        this.forwardBtn.disabled = this.currentIndex >= this.history.length - 1;
    }
}
