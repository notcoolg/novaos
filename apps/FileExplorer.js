// File Explorer Application
class FileExplorer {
    constructor(os) {
        this.os = os;
        this.currentPath = '/';
    }

    getAppInfo() {
        return {
            title: 'File Explorer',
            icon: '📁',
            content: this.createContent()
        };
    }

    createContent() {
        return `
            <div class="file-explorer-toolbar">
                <button class="toolbar-btn" onclick="novaOS.apps.fileExplorer.newFolder()">📁 New Folder</button>
                <button class="toolbar-btn" onclick="novaOS.apps.fileExplorer.newFile()">📄 New File</button>
                <button class="toolbar-btn" onclick="novaOS.apps.fileExplorer.refresh()">🔄 Refresh</button>
            </div>
            <div id="file-explorer-path" style="margin-bottom: 15px; color: #94a3b8; font-size: 13px;">/</div>
            <div class="file-list" id="file-list"></div>
        `;
    }

    init(windowEl) {
        this.currentPath = '/';
        this.refreshFileList();
    }

    refreshFileList() {
        const fileList = document.getElementById('file-list');
        if (!fileList) return;

        const files = this.os.fileSystem.listDirectory(this.currentPath);
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

    newFolder() {
        const name = prompt('Enter folder name:');
        if (name) {
            this.os.fileSystem.createDirectory(this.currentPath + '/' + name);
            this.refreshFileList();
        }
    }

    newFile() {
        const name = prompt('Enter file name:');
        if (name) {
            this.os.fileSystem.createFile(this.currentPath + '/' + name, '');
            this.refreshFileList();
        }
    }

    refresh() {
        this.refreshFileList();
    }

    openFileInTextEditor(path) {
        const content = this.os.fileSystem.readFile(path);
        if (content !== null) {
            this.os.openApp('text-editor');
            setTimeout(() => {
                const textarea = document.getElementById('text-editor-content');
                if (textarea) {
                    textarea.value = content;
                    textarea.dataset.currentFile = path;
                }
            }, 100);
        }
    }
}
