"use strict";

const PERM = {permissions: ["tabs"]};

const scrollNode = document.querySelector("input[name=suppWheel]");
const permNode = document.querySelector("input[name=hasTabsPerm]");

chrome.permissions.contains(PERM, has => {
  permNode.checked = has;
});

chrome.storage.local.get("noScroll", data => {
  scrollNode.checked = !data.noScroll;
});

permNode.onclick = () => {
  if(permNode.checked) {
    chrome.permissions.request(PERM, granted => {
      if(chrome.runtime.lastError) return openInTab();
      permNode.checked = granted;

      chrome.runtime.sendMessage({permChanged: true});

    });
  } else {
    chrome.permissions.remove(PERM);
    chrome.runtime.sendMessage({permChanged: true});
  }
};

scrollNode.onclick = () => {
  if(scrollNode.checked) {
    chrome.storage.local.remove("noScroll");
  } else {
    chrome.storage.local.set({noScroll: true});
  }
};

function openInTab() {  //Firefox bug 1382953
  permNode.checked = false;
  chrome.tabs.query({currentWindow: true, active: true}, tabs => {
    chrome.tabs.create({
      url: chrome.extension.getURL("options.htm"),
      openerTabId: tabs[0].id
    });
  });
}

document.querySelector("#demo").onclick = e => {
  e.preventDefault();
  chrome.tabs.create({url: chrome.runtime.getURL("welcome.htm")});
};

document.querySelectorAll("*[i18n]").forEach(n => {
  n[n.getAttribute("i18n")] = chrome.i18n.getMessage(n.textContent);
});