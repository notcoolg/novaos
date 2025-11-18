class FileViewer {
    constructor(os) {
        this.os = os;
        this.currentFile = null;
    }

    getAppInfo() {
        return {
            title: 'Universal File Viewer',
            icon: '<i class="ph ph-files"></i>',
            content: this.createContent()
        };
    }

    createContent() {
        return `
            <div class="file-viewer-container">
                <div class="file-viewer-toolbar">
                    <button class="image-viewer-btn" id="fv-open-btn">
                        <i class="ph ph-folder-open"></i>
                        Open File
                    </button>
                    <span id="fv-file-info" style="margin-left: 12px; font-size: 12px; color: var(--gray-text);"></span>
                </div>
                <div class="file-viewer-content" id="fv-content">
                    <div class="file-viewer-placeholder">
                        <i class="ph ph-files"></i>
                        <div style="margin-top: 12px; font-size: 16px;">Universal File Viewer</div>
                        <div style="font-size: 13px; margin-top: 8px; color: var(--gray-text);">
                            Supports: PDF, Video (MP4, WebM), Audio (MP3, WAV, OGG), Text files
                        </div>
                        <div style="font-size: 12px; margin-top: 12px; color: var(--gray-text);">
                            Click "Open File" to select a file
                        </div>
                    </div>
                </div>
                <input type="file" id="fv-file-input" accept=".pdf,.mp4,.webm,.mp3,.wav,.ogg,.txt,.md,.json,.xml,.html,.css,.js" style="display: none;">
            </div>
        `;
    }

    init(windowEl) {
        this.windowEl = windowEl;
        this.contentEl = windowEl.querySelector('#fv-content');
        this.infoEl = windowEl.querySelector('#fv-file-info');
        this.fileInput = windowEl.querySelector('#fv-file-input');

        // Open button
        windowEl.querySelector('#fv-open-btn').addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadFile(file);
            }
        });
    }

    loadFile(file) {
        this.currentFile = {
            name: file.name,
            size: file.size,
            type: file.type
        };

        this.updateInfo();

        const reader = new FileReader();
        const fileExt = file.name.split('.').pop().toLowerCase();

        if (file.type === 'application/pdf' || fileExt === 'pdf') {
            this.loadPDF(file);
        } else if (file.type.startsWith('video/') || ['mp4', 'webm', 'ogg'].includes(fileExt)) {
            this.loadVideo(file);
        } else if (file.type.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a'].includes(fileExt)) {
            this.loadAudio(file);
        } else if (file.type.startsWith('text/') || ['txt', 'md', 'json', 'xml', 'html', 'css', 'js'].includes(fileExt)) {
            reader.onload = (e) => this.loadText(e.target.result);
            reader.readAsText(file);
        } else {
            this.contentEl.innerHTML = `
                <div class="file-viewer-placeholder">
                    <i class="ph ph-file-x"></i>
                    <div style="margin-top: 12px;">Unsupported file type</div>
                    <div style="font-size: 12px; margin-top: 8px; color: var(--gray-text);">
                        ${file.name} (${file.type || 'unknown type'})
                    </div>
                </div>
            `;
        }
    }

    loadPDF(file) {
        const url = URL.createObjectURL(file);
        this.contentEl.innerHTML = `
            <iframe src="${url}" class="file-viewer-iframe"></iframe>
        `;
    }

    loadVideo(file) {
        const url = URL.createObjectURL(file);
        this.contentEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #000;">
                <video controls class="file-viewer-video">
                    <source src="${url}" type="${file.type}">
                    Your browser does not support the video tag.
                </video>
            </div>
        `;
    }

    loadAudio(file) {
        const url = URL.createObjectURL(file);
        this.contentEl.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; flex-direction: column; gap: 20px;">
                <i class="ph ph-music-notes" style="font-size: 80px; color: var(--primary-color);"></i>
                <div style="font-size: 16px;">${file.name}</div>
                <audio controls class="file-viewer-audio">
                    <source src="${url}" type="${file.type}">
                    Your browser does not support the audio tag.
                </audio>
            </div>
        `;
    }

    loadText(content) {
        const escapedContent = content
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        this.contentEl.innerHTML = `
            <pre style="font-family: 'SF Mono', Monaco, 'Courier New', monospace; font-size: 13px; line-height: 1.6; white-space: pre-wrap; word-wrap: break-word; padding: 0;">${escapedContent}</pre>
        `;
    }

    updateInfo() {
        if (this.currentFile) {
            const sizeKB = (this.currentFile.size / 1024).toFixed(1);
            const sizeMB = (this.currentFile.size / (1024 * 1024)).toFixed(2);
            const sizeDisplay = this.currentFile.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;
            this.infoEl.textContent = `${this.currentFile.name} • ${sizeDisplay}`;
        } else {
            this.infoEl.textContent = '';
        }
    }
}
