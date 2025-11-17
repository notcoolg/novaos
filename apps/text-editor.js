// Text Editor Application
const TextEditorApp = {
    name: 'text-editor',
    title: 'Text Editor',
    icon: '📝',

    createContent() {
        return `
            <div class="text-editor-toolbar">
                <button class="toolbar-btn" onclick="novaOS.saveTextFile()">💾 Save</button>
                <button class="toolbar-btn" onclick="novaOS.clearTextEditor()">🗑️ Clear</button>
            </div>
            <textarea class="text-editor-area" id="text-editor-content" placeholder="Start typing..."></textarea>
        `;
    },

    init(windowEl, os) {
        // Nothing special needed for initialization
    },

    save(os) {
        const textarea = document.getElementById('text-editor-content');
        if (!textarea) return;

        let filename = textarea.dataset.currentFile;
        if (!filename) {
            filename = prompt('Enter filename:');
            if (!filename) return;
            if (!filename.startsWith('/')) filename = '/' + filename;
        }

        os.fileSystem.createFile(filename, textarea.value);
        alert('File saved successfully!');
        textarea.dataset.currentFile = filename;
    },

    clear() {
        const textarea = document.getElementById('text-editor-content');
        if (textarea) {
            textarea.value = '';
            delete textarea.dataset.currentFile;
        }
    }
};
