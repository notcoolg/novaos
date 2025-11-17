# NovaOS

A beautiful, modern web-based operating system interface with a complete desktop environment, window management, and built-in applications.

![NovaOS](https://img.shields.io/badge/NovaOS-v1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## Features

### System Features
- **Animated Boot Sequence** - Realistic BIOS/POST screen with system initialization
- **User Authentication** - Multi-user support with password protection
- **Persistent Storage** - All data saved to browser localStorage
- **Desktop Environment** - Beautiful gradient-based UI with modern design
- **Window Management** - Draggable, resizable, minimizable windows
- **Taskbar & Start Menu** - Quick access to applications and system controls

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
- **Drag** titlebar to move windows
- **Minimize** - Hide window to taskbar
- **Maximize** - Full screen mode
- **Close** - Close the application

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

- **HTML5** - Structure and semantics
- **CSS3** - Modern styling with gradients, animations, and glassmorphism
- **Vanilla JavaScript** - No frameworks, pure ES6+
- **localStorage API** - Persistent data storage

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

## Customization

### Changing Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    --dark-bg: #0f172a;
    --darker-bg: #020617;
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

## Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## License

MIT License - feel free to use this project for learning and experimentation.

## Credits

Created with ❤️ using modern web technologies.

---

**NovaOS** - A modern web-based operating system experience.
