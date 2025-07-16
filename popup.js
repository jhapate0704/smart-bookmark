document.addEventListener('DOMContentLoaded', () => {
  const bookmarksList = document.getElementById('bookmarks-list');
  const themeSwitch = document.getElementById('checkbox');

  const renderBookmarks = () => {
    chrome.storage.local.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      bookmarksList.innerHTML = ''; // Clear the list

      if (bookmarks.length > 0) {
        bookmarks.forEach((bookmark, index) => {
          const bookmarkEl = document.createElement('div');
          bookmarkEl.className = 'bookmark';

          const titleEl = document.createElement('a');
          titleEl.href = bookmark.url;
          titleEl.target = '_blank';
          titleEl.textContent = bookmark.title;
          bookmarkEl.appendChild(titleEl);

          if (bookmark.tags && bookmark.tags.length > 0) {
            const tagsEl = document.createElement('div');
            tagsEl.className = 'tags';
            tagsEl.textContent = `Tags: ${bookmark.tags.join(', ')}`;
            bookmarkEl.appendChild(tagsEl);
          }

          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.textContent = 'Delete';
          deleteBtn.addEventListener('click', () => {
            bookmarks.splice(index, 1);
            chrome.storage.local.set({ bookmarks: bookmarks }, () => {
              renderBookmarks(); // Re-render the list
            });
          });
          bookmarkEl.appendChild(deleteBtn);

          bookmarksList.appendChild(bookmarkEl);
        });
      } else {
        bookmarksList.textContent = 'No bookmarks saved yet.';
      }
    });
  };

  const applyTheme = (theme) => {
    document.body.className = theme;
  };

  themeSwitch.addEventListener('change', () => {
    const theme = themeSwitch.checked ? 'dark' : 'light';
    chrome.storage.local.set({ theme: theme }, () => {
      applyTheme(theme);
    });
  });

  chrome.storage.local.get({ theme: 'light' }, (result) => {
    themeSwitch.checked = result.theme === 'dark';
    applyTheme(result.theme);
  });

  renderBookmarks();
});