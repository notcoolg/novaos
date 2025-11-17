# Changelog

All notable changes to NovaOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Fullscreen Mode**: Automatic fullscreen on first interaction for immersive experience
- **Keyboard Shortcuts**: Complete keyboard navigation support
  - ⌘/Ctrl + W: Close active window
  - ⌘/Ctrl + M: Minimize active window
  - ⌘/Ctrl + N: New Files window
  - ⌘/Ctrl + T: New Terminal window
  - ⌘/Ctrl + ,: Open Settings
  - Esc: Close start menu
- **Professional SVG Icons**: Replaced all emoji icons with beautiful gradient SVG icons
  - Files (blue folder icon)
  - Terminal (dark terminal with green prompt)
  - TextEdit (white document with blue header)
  - Calculator (orange calculator with display)
  - Settings (gray gear icon)
- **Settings Enhancements**:
  - Tabbed interface (General, Keyboard Shortcuts, Changelog)
  - Built-in markdown changelog viewer
  - Keyboard shortcuts reference
  - System information dashboard
- **macOS-Style Boot Screen**: Clean, minimal boot animation
  - Simple white logo on black background
  - Smooth progress bar
  - No verbose text output
  - Professional fade animation
- Window resizing functionality with drag handles
- macOS-inspired design system with frosted glass effects
- Enhanced animations throughout the interface
- Smooth window transitions and hover effects
- Traffic light window controls (red, yellow, green)
- Dock-style taskbar with app icons
- Better shadow effects and depth perception

### Changed
- Boot sequence simplified to match macOS style
- Icon sizes optimized (64x64px for desktop icons)
- Updated color scheme to match macOS aesthetic
- Redesigned window controls with circular buttons
- Enhanced glassmorphism effects with backdrop blur
- Improved typography and spacing
- Smoother transitions and animations
- Updated version number to 2.0.0

### Improved
- Window dragging performance with requestAnimationFrame optimization
- Reduced lag and stuttering when moving windows
- Added will-change hints for better GPU acceleration
- Window management system
- Desktop icon appearance with professional shadows
- Start menu design
- Application window styling
- Overall user experience

## [1.0.0] - 2024-11-17

### Added
- Initial release of NovaOS
- Animated boot sequence with BIOS/POST screens
- Multi-user authentication system
- Login screen with user creation
- Desktop environment with modern UI
- Window management (drag, minimize, maximize, close)
- Taskbar with active window tracking
- Start menu with application launcher
- File Explorer application
- Terminal application with built-in commands
- Text Editor application
- Calculator application
- Settings application
- localStorage-based file system
- Persistent data storage
- Complete documentation

### Technical
- Pure vanilla JavaScript implementation
- Modern CSS with gradients and animations
- Object-oriented architecture
- FileSystem class for virtual file management
- NovaOS main system class

[Unreleased]: https://github.com/yourusername/novaos/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/yourusername/novaos/releases/tag/v1.0.0
