# Smart Bookmark Chrome Extension📱✨

A premium Google Chrome Extension that transforms your bookmarks into a stunning, native iOS 26 / VisionOS experience right inside your browser.
## 📸 Preview
<img width="1900" height="977" alt="Screenshot 2026-06-21 025746" src="https://github.com/user-attachments/assets/6004aa3a-a2ab-42e7-b1d7-47aa6e5600e5" />
<div align="center">

<img width="532" height="805" alt="Screenshot 2026-06-21 025830" src="https://github.com/user-attachments/assets/145e6bdc-4a72-4952-a7c7-4284edd21ba2" />


  <img width="500" height="747" alt="Screenshot 2026-06-21 025901" src="https://github.com/user-attachments/assets/cf7dfb95-babd-47c2-8309-d5ed06c0ad62" />
  
</div>
## Features

*   **Liquid Glass UI:** Features authentic `backdrop-filter` blurring, soft drop shadows, and deep spatial gradient backgrounds that perfectly mimic Apple's modern design language.
*   **Dynamic Island:** A sleek, interactive pill at the top of the screen that smoothly expands into a full search bar on hover using fluid spring animations.
*   **App Grid Layout:** Say goodbye to boring lists. Your bookmarks are rendered exactly like iPhone Home Screen apps, complete with centered favicons and bouncing hover physics.
*   **Smart Folders:** Bookmarks sharing the same tags are automatically grouped into native Apple-style folders. Clicking a folder opens a beautiful frosted-glass overlay.
*   **Context Menus:** Right-click any app icon to reveal a blurred glass context menu where you can instantly Favorite or Delete the bookmark.
*   **Floating Dock:** A permanently fixed, heavily frosted bottom navigation bar that lets you switch between all apps, favorites, and trigger Imports/Exports.
*   **Intelligent Syncing:** Uses `chrome.storage.sync` to keep your bookmarks backed up. Built-in duplicate prevention ensures you never save the same link twice.

## Installation

1. Clone or download this repository.
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** using the toggle in the top right corner.
4. Click **Load unpacked** and select the folder containing these project files.
5. Pin the extension to your toolbar for easy access!

## Usage

*   **Saving a Bookmark:** Right-click anywhere on a webpage and select "Create Smart Bookmark" from the context menu. The extension will automatically extract tags from the page title.
*   **Searching:** Hover over the Dynamic Island at the top of the popup to expand the search bar and filter your apps instantly.
*   **Import/Export:** Use the floating bottom dock to easily backup your bookmarks to a JSON file or import an existing backup.

## Tech Stack

*   Vanilla JavaScript (ES6+)
*   HTML5
*   CSS3 (Advanced Glassmorphism & Custom Spring Animations)
*   Chrome Extension Manifest V3
