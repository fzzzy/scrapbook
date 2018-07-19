

browser.browserAction.onClicked.addListener(() => {
  browser.sidebarAction.open();
  browser.tabs.executeScript({file: "content.js"});
});

