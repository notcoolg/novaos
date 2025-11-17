// Text Editor Application
class TextEditor {
    constructor(os) {
        this.os = os;
    }

    getAppInfo() {
        return {
            title: 'Text Editor',
            icon: '📝',
            content: this.createContent()
        };
    }

    createContent() {
        return `
            <div class="text-editor-toolbar">
                <button class="toolbar-btn" onclick="novaOS.apps.textEditor.saveFile()">💾 Save</button>
                <button class="toolbar-btn" onclick="novaOS.apps.textEditor.clear()">🗑️ Clear</button>
            </div>
            <textarea class="text-editor-area" id="text-editor-content" placeholder="Start typing..."></textarea>
        `;
    }

    init(windowEl) {
        // Nothing special needed for initialization
    }

    saveFile() {
        const textarea = document.getElementById('text-editor-content');
        if (!textarea) return;

        let filename = textarea.dataset.currentFile;
        if (!filename) {
            filename = prompt('Enter filename:');
            if (!filename) return;
            if (!filename.startsWith('/')) filename = '/' + filename;
        }

        this.os.fileSystem.createFile(filename, textarea.value);
        alert('File saved successfully!');
        textarea.dataset.currentFile = filename;
    }

    clear() {
        const textarea = document.getElementById('text-editor-content');
        if (textarea) {
            textarea.value = '';
            delete textarea.dataset.currentFile;
        }
    }
}
