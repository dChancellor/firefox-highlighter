browser.contextMenus.create({
  id: "save-highlight",
  type: "normal",
  title: "Save highlight",
  contexts: ["all"],
});

browser.contextMenus.onClicked.addListener(function (info, tab) {
  console.log(info);
  console.log(tab);
  switch (info.menuItemId) {
    case "save-highlight":
      browser.tabs.insertCSS(tab.id, { file: "style.css" });
      browser.tabs.insertCSS(tab.id, { file: "/tagify/tagify.css" });
      browser.tabs.sendMessage(tab.id, {
        highlight: info.selectionText,
        website: info.pageUrl,
        tab: tab.id,
      });
  }
});

function handleMessage(message) {
  browser.tabs.removeCSS(message.tab, { file: "style.css" });
  browser.tabs.removeCSS(message.tab, { file: "/tagify/tagify.css" });
}

browser.runtime.onMessage.addListener(handleMessage);
