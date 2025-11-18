class ImageViewer {
    constructor(os) {
        this.os = os;
        this.currentImage = null;
        this.zoom = 1;
        this.rotation = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
    }

    getAppInfo() {
        return {
            title: 'Image Viewer',
            icon: '<i class="ph ph-image"></i>',
            content: this.createContent()
        };
    }

    createContent() {
        return `
            <div class="image-viewer-container">
                <div class="image-viewer-toolbar">
                    <button class="image-viewer-btn" id="iv-open-btn">
                        <i class="ph ph-folder-open"></i>
                        Open Image
                    </button>
                    <div style="width: 1px; height: 20px; background: var(--border-color);"></div>
                    <button class="image-viewer-btn" id="iv-zoom-in-btn">
                        <i class="ph ph-magnifying-glass-plus"></i>
                    </button>
                    <button class="image-viewer-btn" id="iv-zoom-out-btn">
                        <i class="ph ph-magnifying-glass-minus"></i>
                    </button>
                    <button class="image-viewer-btn" id="iv-zoom-reset-btn">
                        <i class="ph ph-arrows-out"></i>
                        Reset
                    </button>
                    <div style="width: 1px; height: 20px; background: var(--border-color);"></div>
                    <button class="image-viewer-btn" id="iv-rotate-left-btn">
                        <i class="ph ph-arrow-counter-clockwise"></i>
                    </button>
                    <button class="image-viewer-btn" id="iv-rotate-right-btn">
                        <i class="ph ph-arrow-clockwise"></i>
                    </button>
                    <div style="flex: 1;"></div>
                    <span id="iv-image-info" style="font-size: 12px; color: var(--gray-text);"></span>
                </div>
                <div class="image-viewer-content" id="iv-content">
                    <div class="image-viewer-placeholder">
                        <i class="ph ph-image"></i>
                        <div>No image loaded</div>
                        <div style="font-size: 12px; margin-top: 8px;">Click "Open Image" to select an image</div>
                    </div>
                </div>
                <input type="file" id="iv-file-input" accept="image/*" style="display: none;">
            </div>
        `;
    }

    init(windowEl) {
        this.windowEl = windowEl;
        this.contentEl = windowEl.querySelector('#iv-content');
        this.infoEl = windowEl.querySelector('#iv-image-info');
        this.fileInput = windowEl.querySelector('#iv-file-input');

        // Open button
        windowEl.querySelector('#iv-open-btn').addEventListener('click', () => {
            this.fileInput.click();
        });

        // File input
        this.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                this.loadImage(file);
            }
        });

        // Zoom buttons
        windowEl.querySelector('#iv-zoom-in-btn').addEventListener('click', () => {
            this.zoom = Math.min(this.zoom + 0.25, 5);
            this.updateTransform();
            this.updateInfo();
        });

        windowEl.querySelector('#iv-zoom-out-btn').addEventListener('click', () => {
            this.zoom = Math.max(this.zoom - 0.25, 0.25);
            this.updateTransform();
            this.updateInfo();
        });

        windowEl.querySelector('#iv-zoom-reset-btn').addEventListener('click', () => {
            this.zoom = 1;
            this.rotation = 0;
            this.translateX = 0;
            this.translateY = 0;
            this.updateTransform();
            this.updateInfo();
        });

        // Rotate buttons
        windowEl.querySelector('#iv-rotate-left-btn').addEventListener('click', () => {
            this.rotation -= 90;
            this.updateTransform();
        });

        windowEl.querySelector('#iv-rotate-right-btn').addEventListener('click', () => {
            this.rotation += 90;
            this.updateTransform();
        });

        // Drag support
        this.contentEl.addEventListener('mousedown', (e) => {
            if (this.currentImage && e.target.tagName === 'IMG') {
                this.isDragging = true;
                this.startX = e.clientX - this.translateX;
                this.startY = e.clientY - this.translateY;
                e.target.style.cursor = 'grabbing';
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                this.translateX = e.clientX - this.startX;
                this.translateY = e.clientY - this.startY;
                this.updateTransform();
            }
        });

        document.addEventListener('mouseup', () => {
            if (this.isDragging) {
                this.isDragging = false;
                const img = this.contentEl.querySelector('img');
                if (img) img.style.cursor = 'move';
            }
        });

        // Wheel zoom
        this.contentEl.addEventListener('wheel', (e) => {
            if (this.currentImage) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.1 : 0.1;
                this.zoom = Math.max(0.25, Math.min(5, this.zoom + delta));
                this.updateTransform();
                this.updateInfo();
            }
        });
    }

    loadImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            this.currentImage = {
                src: e.target.result,
                name: file.name,
                size: file.size,
                type: file.type
            };

            this.zoom = 1;
            this.rotation = 0;
            this.translateX = 0;
            this.translateY = 0;

            this.contentEl.innerHTML = `
                <img src="${this.currentImage.src}" alt="${this.currentImage.name}" class="image-viewer-image">
            `;

            this.updateInfo();
            this.updateTransform();
        };
        reader.readAsDataURL(file);
    }

    updateTransform() {
        const img = this.contentEl.querySelector('img');
        if (img) {
            img.style.transform = `
                translate(${this.translateX}px, ${this.translateY}px)
                scale(${this.zoom})
                rotate(${this.rotation}deg)
            `;
        }
    }

    updateInfo() {
        if (this.currentImage) {
            const sizeKB = (this.currentImage.size / 1024).toFixed(1);
            this.infoEl.textContent = `${this.currentImage.name} • ${sizeKB} KB • Zoom: ${(this.zoom * 100).toFixed(0)}%`;
        } else {
            this.infoEl.textContent = '';
        }
    }
}
