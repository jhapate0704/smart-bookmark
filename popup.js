document.addEventListener('DOMContentLoaded', () => {
  const dynamicIsland = document.getElementById('dynamic-island');
  const islandDefault = document.getElementById('island-default');
  const islandExpanded = document.getElementById('island-expanded');
  const searchInput = document.getElementById('island-search');
  const islandCount = document.getElementById('island-count');
  

  const appGrid = document.getElementById('app-grid');
  
  const contextMenu = document.getElementById('context-menu');
  const ctxFav = document.getElementById('ctx-fav');
  const ctxDel = document.getElementById('ctx-del');
  
  const folderOverlay = document.getElementById('folder-overlay');
  const folderTitle = document.getElementById('folder-title');
  const folderGrid = document.getElementById('folder-grid');
  
  const dockHome = document.getElementById('dock-home');
  const dockFav = document.getElementById('dock-fav');
  const importBtn = document.getElementById('dock-import');
  const exportBtn = document.getElementById('dock-export');
  const importFile = document.getElementById('import-file');

  let allBookmarks = [];
  let currentFilter = 'All';
  let activeContextMenuTarget = null;
  let pressTimer;

  // Dynamic Island Logic
  let islandFocused = false;

  dynamicIsland.addEventListener('mouseenter', () => {
    dynamicIsland.classList.remove('island-collapsed');
    dynamicIsland.classList.add('island-expanded');
    islandDefault.style.display = 'none';
    islandExpanded.style.display = 'flex';
  });

  dynamicIsland.addEventListener('mouseleave', () => {
    if (!islandFocused) {
      collapseIsland();
    }
  });

  searchInput.addEventListener('focus', () => { islandFocused = true; });
  searchInput.addEventListener('blur', () => { 
    islandFocused = false; 
    if(!dynamicIsland.matches(':hover')) collapseIsland();
  });
  
  searchInput.addEventListener('input', () => { renderGrid(); });

  function collapseIsland() {
    dynamicIsland.classList.remove('island-expanded');
    dynamicIsland.classList.add('island-collapsed');
    islandExpanded.style.display = 'none';
    islandDefault.style.display = 'flex';
  }

  // Hide context menu and folders on background click
  document.addEventListener('click', (e) => {
    if(!contextMenu.contains(e.target)) contextMenu.classList.add('hidden');
  });
  folderOverlay.addEventListener('click', (e) => {
    if(e.target === folderOverlay) folderOverlay.classList.add('hidden');
  });

  // Render Grid
  function renderGrid(bookmarksToRender = null, container = appGrid, insideFolder = false) {
    container.innerHTML = '';
    
    let filtered = allBookmarks;
    if(!bookmarksToRender) {
      const query = searchInput.value.toLowerCase();
      filtered = allBookmarks.filter(b => b.title.toLowerCase().includes(query) || b.url.toLowerCase().includes(query));
      
      if (currentFilter === 'Favorites') {
        filtered = filtered.filter(b => b.isFavorite);
      } else if (currentFilter !== 'All') {
        filtered = filtered.filter(b => b.tags && b.tags.some(t => t.toLowerCase() === currentFilter.toLowerCase()));
      }
    } else {
      filtered = bookmarksToRender;
    }

    if(!insideFolder) {
      if (currentFilter === 'Favorites') {
        islandCount.textContent = `${filtered.length} Favorites`;
      } else {
        islandCount.textContent = `${filtered.length} Apps`;
      }
    }

    // Grouping logic for "Folders" if not searching and current filter is ALL
    if(!bookmarksToRender && searchInput.value === '' && currentFilter === 'All' && !insideFolder) {
      const groups = {};
      const looseApps = [];
      
      filtered.forEach(b => {
        if(b.tags && b.tags.length > 0) {
          const mainTag = b.tags[0];
          if(!groups[mainTag]) groups[mainTag] = [];
          groups[mainTag].push(b);
        } else {
          looseApps.push(b);
        }
      });

      // Render Folders
      Object.keys(groups).forEach(tag => {
        if(groups[tag].length > 1) {
           createFolderIcon(tag, groups[tag], container);
        } else {
           groups[tag].forEach(b => looseApps.push(b));
        }
      });

      // Render Loose Apps
      looseApps.forEach(b => createAppIcon(b, container));
    } else {
      // Just render apps
      filtered.forEach(b => createAppIcon(b, container));
    }
  }

  function createFolderIcon(name, bookmarks, container) {
    const wrap = document.createElement('div');
    wrap.className = 'app-icon-wrapper';
    
    const icon = document.createElement('div');
    icon.className = 'app-icon folder-icon';
    
    // add up to 4 mini icons
    bookmarks.slice(0,4).forEach(b => {
      const img = document.createElement('img');
      try { img.src = `https://www.google.com/s2/favicons?sz=32&domain=${new URL(b.url).hostname}`; } 
      catch(e) { img.src = 'icon.png'; }
      icon.appendChild(img);
    });

    const title = document.createElement('div');
    title.className = 'app-name';
    title.textContent = name;

    wrap.appendChild(icon);
    wrap.appendChild(title);

    wrap.addEventListener('click', () => {
      folderTitle.textContent = name;
      renderGrid(bookmarks, folderGrid, true);
      folderOverlay.classList.remove('hidden');
    });

    container.appendChild(wrap);
  }

  function createAppIcon(bookmark, container) {
    const wrap = document.createElement('div');
    wrap.className = 'app-icon-wrapper';
    
    const icon = document.createElement('div');
    icon.className = 'app-icon';
    
    if(bookmark.isFavorite) {
      const badge = document.createElement('div');
      badge.className = 'fav-badge';
      badge.textContent = '★';
      icon.appendChild(badge);
    }

    const img = document.createElement('img');
    try { img.src = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(bookmark.url).hostname}`; } 
    catch(e) { img.src = 'icon.png'; }
    icon.appendChild(img);

    const title = document.createElement('div');
    title.className = 'app-name';
    title.textContent = bookmark.title;

    wrap.appendChild(icon);
    wrap.appendChild(title);

    // Open link
    wrap.addEventListener('click', (e) => {
      window.open(bookmark.url, '_blank');
    });

    // Context Menu via Right Click
    wrap.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      showContextMenu(e, bookmark);
    });

    container.appendChild(wrap);
  }

  function showContextMenu(e, bookmark) {
    activeContextMenuTarget = bookmark;
    
    // Prevent right edge overflow
    if (e.pageX + 220 > window.innerWidth) {
      contextMenu.style.left = `${window.innerWidth - 230}px`;
    } else {
      contextMenu.style.left = `${e.pageX}px`;
    }
    
    // Prevent bottom edge overflow
    if(e.pageY + 100 > window.innerHeight) {
      contextMenu.style.top = `${e.pageY - 100}px`;
    } else {
      contextMenu.style.top = `${e.pageY}px`;
    }
    
    ctxFav.querySelector('span').textContent = bookmark.isFavorite ? 'Unfavorite' : 'Favorite';
    contextMenu.classList.remove('hidden');
  }

  // Context Menu Actions
  ctxFav.addEventListener('click', (e) => {
    e.stopPropagation();
    if(activeContextMenuTarget) {
      const idx = allBookmarks.findIndex(b => b.url === activeContextMenuTarget.url);
      if(idx > -1) {
        allBookmarks[idx].isFavorite = !allBookmarks[idx].isFavorite;
        saveBookmarks(allBookmarks);
      }
    }
    contextMenu.classList.add('hidden');
  });

  ctxDel.addEventListener('click', (e) => {
    e.stopPropagation();
    if(activeContextMenuTarget) {
      const idx = allBookmarks.findIndex(b => b.url === activeContextMenuTarget.url);
      if(idx > -1) {
        allBookmarks.splice(idx, 1);
        saveBookmarks(allBookmarks);
      }
    }
    contextMenu.classList.add('hidden');
    folderOverlay.classList.add('hidden'); // close folder if open
  });

  const saveBookmarks = (bookmarks) => {
    chrome.storage.sync.set({ bookmarks: bookmarks }, () => {
      loadBookmarks();
    });
  };

  const loadBookmarks = () => {
    chrome.storage.sync.get({ bookmarks: [] }, (result) => {
      allBookmarks = result.bookmarks;
      renderGrid();
    });
  };


  // Dock Logic
  dockHome.addEventListener('click', () => {
    dockFav.classList.remove('active');
    dockHome.classList.add('active');
    currentFilter = 'All';
    renderGrid();
  });

  dockFav.addEventListener('click', () => {
    dockHome.classList.remove('active');
    dockFav.classList.add('active');
    currentFilter = 'Favorites';
    renderGrid();
  });

  // Import/Export
  exportBtn.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allBookmarks));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "smart-bookmarks-export.json");
    document.body.appendChild(downloadAnchorNode); 
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

  importBtn.addEventListener('click', () => { importFile.click(); });
  importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          chrome.storage.sync.get({ bookmarks: [] }, (result) => {
            const existingUrls = new Set(result.bookmarks.map(b => b.url));
            const newBookmarks = imported.filter(b => b.url && b.title && !existingUrls.has(b.url));
            const updated = result.bookmarks.concat(newBookmarks);
            saveBookmarks(updated);
          });
        }
      } catch (err) { alert("Invalid JSON file."); }
    };
    reader.readAsText(file);
    importFile.value = '';
  });

  loadBookmarks();
});