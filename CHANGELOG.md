# Changelog

All notable changes to NovaOS will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [25U11.3] - 2025-11-19

### Added
- **Complete Top Bar Functionality**: Full macOS-style menu bar with all interactive menus
  - **Apple Menu**: About This Mac, System Preferences, Force Quit, Sleep, Restart, Shutdown, Lock Screen, Log Out
  - **Dynamic App Menus**: File, Edit, View, Go, Window, Help menus with keyboard shortcuts
  - **Control Center**: WiFi, Bluetooth, AirDrop, Focus toggles with brightness/volume sliders
  - **Spotlight Search**: Search apps, files, and system functions with Cmd+Space shortcut
  - **Calendar Popup**: Click time to show calendar with month navigation
  - **WiFi Menu**: Network list with connection status and toggle
  - **Battery Menu**: Battery percentage, power source, and app usage stats
- **About This Mac Window**: Comprehensive system info dialog (winver-like)
  - NovaOS logo and version display
  - System specs (Chip, Memory, Storage, Serial Number)
  - More Info, System Report, and Software Update buttons
  - Copyright and license information
- **Force Quit Applications**: Dialog to force quit unresponsive apps
- **Icon Pack System**: Choose from 5 Phosphor icon styles
  - Phosphor (Default), Filled, Bold, Duotone, Thin
  - Live preview in Settings
  - System-wide icon style switching

### Changed
- Top bar icons now show battery percentage
- Menu items are now fully interactive with proper dropdown menus
- Improved keyboard shortcuts (added Cmd+Space for Spotlight, F4 for Launchpad)
- Updated Settings with new Icon Pack tab and Spotlight shortcut reference

### Technical
- Global menu management system with closeAllMenus()
- Calendar rendering with proper month/year navigation
- Spotlight search with real-time filtering
- Icon pack application via CSS class manipulation

## [25U11.1] - 2025-11-18

### Added
- **Phosphor Icons Integration**: Professional icon library replacing all emoji icons throughout the system
- **New Applications**:
  - **Image Viewer**: View and manipulate images with zoom, pan, and rotation features
  - **Universal File Viewer (UFV)**: Support for viewing PDFs, videos (MP4, WebM), audio (MP3, WAV, OGG), and text files
  - **Mini Web Browser**: Browse websites with navigation controls and address bar
- **Window Management**: 5-window limit to conserve system resources with user-friendly notification system
- **Notification System**: Toast-style notifications for system alerts and warnings
- **Comprehensive Settings App**:
  - **Appearance Tab**: Theme selection (Dark, Light, Auto), Font selection (4 options with live preview)
  - **Preferences Tab**: Toggle animations, blur effects, and wallpaper selection (4 options)
  - **System Tab**: Detailed system information and storage stats
  - **Keyboard Shortcuts Tab**: Complete reference guide
  - **Changelog Tab**: Integrated markdown viewer
- **Desktop Enhancements**:
  - Draggable desktop icons with position persistence
  - Right-click context menu with system actions
  - Multiple wallpaper options
  - Functional desktop interactions
- **File System Integration**: Upload and view local files from user's computer
- **Theme System**: Dark mode, Light mode, and Auto (system preference) with full color scheme switching
- **Font System**: 4 professional fonts (SF Pro, Inter, Roboto, SF Mono) with system-wide application
- **localStorage Persistence**: All user preferences saved and restored across sessions

### Changed
- Updated Settings app with tabbed interface and comprehensive options
- Improved markdown parser for better changelog rendering
- Enhanced notification system with auto-dismiss and animations
- Desktop icons now use modern Phosphor Icons instead of emojis
- Start menu updated with new app entries and Phosphor Icons

### Improved
- Better user experience with window limit notifications
- Smoother desktop icon dragging
- More intuitive context menu actions
- Enhanced visual consistency across all UI elements
- Better organization of settings into logical categories

### Technical
- Modular app architecture with new ImageViewer, FileViewer, and Browser classes
- Notification container system with auto-cleanup
- Desktop dragging implementation with proper z-index management
- Context menu system with event delegation
- Settings persistence layer with localStorage integration
- Theme application system with CSS custom properties

## [25U11] - 2025-11-17

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

## [1.0.0] - 2025-11-17

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
