chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "smart-bookmark",
    title: "Create Smart Bookmark",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "smart-bookmark") {
    const tags = tab.title.split(/\s+/).filter(word => word.length > 4).slice(0, 3);
    const bookmark = { url: tab.url, title: tab.title, tags: tags, date: new Date().toISOString() };

    chrome.storage.sync.get({ bookmarks: [] }, (result) => {
      const bookmarks = result.bookmarks;
      
      // Duplicate prevention
      if (bookmarks.some(b => b.url === tab.url)) {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Bookmark Already Exists!",
          message: `The bookmark for '${tab.title}' is already saved.`
        });
        return;
      }

      bookmarks.push(bookmark);
      chrome.storage.sync.set({ bookmarks: bookmarks }, () => {
        chrome.notifications.create({
          type: "basic",
          iconUrl: "icon.png",
          title: "Bookmark Saved!",
          message: `Saved '${tab.title}' with tags: ${tags.join(", ")}`
        });
      });
    });
  }
});
