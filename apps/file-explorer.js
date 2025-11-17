// File Explorer Application
const FileExplorerApp = {
    name: 'file-explorer',
    title: 'File Explorer',
    icon: '📁',

    createContent() {
        return `
            <div class="file-explorer-toolbar">
                <button class="toolbar-btn" onclick="novaOS.fileExplorerNewFolder()">📁 New Folder</button>
                <button class="toolbar-btn" onclick="novaOS.fileExplorerNewFile()">📄 New File</button>
                <button class="toolbar-btn" onclick="novaOS.fileExplorerRefresh()">🔄 Refresh</button>
            </div>
            <div id="file-explorer-path" style="margin-bottom: 15px; color: #94a3b8; font-size: 13px;">/</div>
            <div class="file-list" id="file-list"></div>
        `;
    },

    init(windowEl, os) {
        os.currentPath = '/';
        this.refreshFileList(os);
    },

    refreshFileList(os) {
        const fileList = document.getElementById('file-list');
        if (!fileList) return;

        const files = os.fileSystem.listDirectory(os.currentPath);
        fileList.innerHTML = '';

        if (os.currentPath !== '/') {
            const backItem = document.createElement('div');
            backItem.className = 'file-item';
            backItem.innerHTML = '<span class="file-icon">⬆️</span><span>..</span>';
            backItem.addEventListener('dblclick', () => {
                const parts = os.currentPath.split('/').filter(p => p);
                parts.pop();
                os.currentPath = '/' + parts.join('/');
                if (os.currentPath === '/') os.currentPath = '/';
                this.refreshFileList(os);
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
                    os.currentPath = os.currentPath === '/' ? '/' + file.name : os.currentPath + '/' + file.name;
                    this.refreshFileList(os);
                    document.getElementById('file-explorer-path').textContent = os.currentPath;
                } else {
                    os.openFileInTextEditor(os.currentPath + '/' + file.name);
                }
            });

            fileList.appendChild(item);
        });

        document.getElementById('file-explorer-path').textContent = os.currentPath;
    },

    newFolder(os) {
        const name = prompt('Enter folder name:');
        if (name) {
            os.fileSystem.createDirectory(os.currentPath + '/' + name);
            this.refreshFileList(os);
        }
    },

    newFile(os) {
        const name = prompt('Enter file name:');
        if (name) {
            os.fileSystem.createFile(os.currentPath + '/' + name, '');
            this.refreshFileList(os);
        }
    },

    refresh(os) {
        this.refreshFileList(os);
    }
};
