# NovaOS

A stunning macOS-inspired web-based operating system with advanced window management, beautiful animations, and a complete desktop environment.

![NovaOS](https://img.shields.io/badge/NovaOS-25U11-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

## Features

### System Features
- **macOS-Inspired Design** - Beautiful frosted glass effects and system aesthetics
- **Traffic Light Window Controls** - Iconic red, yellow, green circular buttons
- **Animated Boot Sequence** - Realistic BIOS/POST screen with glowing logo effects
- **User Authentication** - Multi-user support with password protection
- **Persistent Storage** - All data saved to browser localStorage
- **Dynamic Wallpaper** - Animated gradient background with smooth color transitions
- **Advanced Window Management**:
  - Drag windows by titlebar
  - Resize from edges and corners
  - Minimize, Maximize, Close with smooth animations
  - Window opening/closing animations
  - Auto-focus management
- **Dock-Style Taskbar** - macOS-like dock with hover effects and active indicators
- **Start Menu** - Quick access launcher with springy animations

### Built-in Applications

#### 📁 File Explorer
- Browse the virtual file system
- Create files and folders
- Navigate directory tree
- Open files in Text Editor

#### ⌘ Terminal
- Command-line interface
- Built-in commands: `help`, `ls`, `cat`, `date`, `whoami`, `uname`, `neofetch`, `echo`, `clear`
- Real-time command execution
- Retro terminal styling

#### 📝 Text Editor
- Create and edit text files
- Save to virtual file system
- Clean, distraction-free interface
- Monospace font for coding

#### 🔢 Calculator
- Basic arithmetic operations
- Clean, modern interface
- Keyboard and mouse input support

#### ⚙️ Settings
- View system information
- Check storage usage
- User management details
- About information

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd novaos
```

2. Open `index.html` in your web browser:
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server

# Or simply open index.html in your browser
```

3. Navigate to `http://localhost:8000` (if using a server)

### First Boot

1. **Boot Sequence** - Watch the animated boot sequence as NovaOS initializes
2. **Login Screen** - Select the default "Guest" user (no password) or create a new user
3. **Desktop** - Explore the desktop environment and built-in applications

## Usage

### Creating a New User
1. Click "Create User" on the login screen
2. Enter a username and password
3. Confirm your password
4. Click "Create Account"

### Opening Applications
- **Double-click** desktop icons
- **Click** the Start button and select from the menu

### Window Management
- **Drag** titlebar to move windows anywhere
- **Resize** windows by dragging edges or bottom-right corner
- **Traffic Light Controls**:
  - Red button: Close window (with smooth animation)
  - Yellow button: Minimize to dock
  - Green button: Maximize/restore
- **Hover Effects** - Controls show symbols on hover
- **Animations** - Smooth opening and closing transitions

### File System
The virtual file system is organized as:
```
/
├── Documents/
├── Downloads/
├── Pictures/
└── Welcome.txt
```

Create new files and folders using the File Explorer or Terminal.

## Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Advanced styling features:
  - Backdrop filters for frosted glass effects
  - CSS Custom Properties for theming
  - Keyframe animations
  - Cubic-bezier timing functions for macOS-like motion
  - CSS Grid and Flexbox layouts
- **Vanilla JavaScript (ES6+)** - No frameworks or dependencies
  - Object-oriented architecture
  - Event-driven programming
  - Dynamic DOM manipulation
- **localStorage API** - Client-side persistent storage
- **System Fonts** - -apple-system, SF Pro Display for authentic macOS typography

## Architecture

### Class Structure

#### `NovaOS`
Main operating system class that manages:
- Boot sequence
- User authentication
- Desktop environment
- Window management
- Application lifecycle

#### `FileSystem`
Virtual file system implementation:
- Directory navigation
- File creation/reading
- Data persistence via localStorage

### Data Structure

#### Users
```javascript
{
  "username": {
    "username": "string",
    "password": "string",
    "createdAt": timestamp
  }
}
```

#### File System
```javascript
{
  "/": {
    "type": "directory",
    "contents": {
      "filename": {
        "type": "file",
        "content": "string",
        "modified": timestamp
      }
    }
  }
}
```

## Visual Design

NovaOS features a premium macOS-inspired design system:

### Design Elements
- **Frosted Glass Effects** - Backdrop blur with saturation on windows, dock, and menus
- **Traffic Light Window Controls** - Authentic circular buttons (red, yellow, green)
- **Smooth Animations** - Cubic-bezier timing functions matching macOS motion
- **Dynamic Wallpaper** - Subtle animated gradients with color shifting
- **Depth & Shadows** - Layered shadow system for visual hierarchy
- **Hover States** - Interactive feedback on all clickable elements
- **Icon Bounce** - Dock icons scale and lift on hover
- **Spring Animations** - Bouncy, elastic transitions throughout

### Typography
- System font stack: `-apple-system, BlinkMacSystemFont, 'SF Pro Display'`
- Optimized font smoothing for crisp text rendering
- Careful letter-spacing and weights for readability

## Customization

### Changing Colors
Edit CSS variables in `styles.css` for the macOS-inspired theme:
```css
:root {
    --primary-color: #007AFF;      /* macOS blue */
    --secondary-color: #5856D6;    /* macOS purple */
    --accent-color: #FF9500;       /* macOS orange */
    --close-btn: #FF5F57;          /* Traffic light red */
    --minimize-btn: #FFBD2E;       /* Traffic light yellow */
    --maximize-btn: #28C840;       /* Traffic light green */
}
```

### Adding New Applications
1. Add app definition in `script.js`:
```javascript
const apps = {
    'my-app': {
        title: 'My App',
        icon: '🎨',
        content: this.createMyApp()
    }
}
```

2. Create app content method:
```javascript
createMyApp() {
    return `<div>My App Content</div>`;
}
```

3. Add desktop icon and start menu item in `index.html`

## Browser Compatibility

NovaOS works best in modern browsers:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

## Storage Limits

Browser localStorage typically allows 5-10MB of storage. NovaOS uses minimal space for:
- User data
- File system
- Application state

## Known Limitations

- No file upload/download to real file system (virtual only)
- localStorage data is domain-specific
- Clearing browser data will reset NovaOS
- Single-tab sessions (no multi-tab sync)

## Future Enhancements

- [ ] Music/Video player
- [ ] Image viewer/editor
- [ ] Web browser app
- [ ] Note-taking app
- [ ] Theme customization
- [ ] File import/export
- [ ] Multi-window tab support
- [ ] Notification system
- [ ] Context menus (right-click)

## License

**PROPRIETARY SOFTWARE** - Copyright (c) 2025 NovaOS. All Rights Reserved.

This is proprietary software. No license is granted for use, modification, or distribution without explicit written permission from NovaOS.

## Credits

NovaOS 25U11 Update - November 17, 2025

---

**NovaOS** - A modern web-based operating system experience.
