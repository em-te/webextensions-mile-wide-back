"use strict";

const GO_BACK = !!chrome.tabs.goBack;

let lastWheel = 0;
let queryParam = {currentWindow: true};
let noScroll = false;

chrome.runtime.onMessage.addListener(
  (msg, {tab, id}) => {
    if(id !== chrome.runtime.id) return;

    if(msg.scrollAction >= -1 && !noScroll) {
      const before = (msg.scrollAction === -1);  //up

      //prevent click action if we recently scrolled
      lastWheel = Date.now();

      chrome.tabs.query(queryParam, tabs => {
        const last = tabs.length - 1;
        if(last === 0) return;

        let i = last;
        let target = null;

        while(i >= 0) {
          if(tabs[i].active) {
            if(tabs[i].id !== tab.id) break;  //only the active tab can flip tabs

            if(before) {
              target = tabs[(i === 0) ? last : i - 1];
            } else {
              target = tabs[(i === last) ? 0 : i + 1];
            }

            lastWheel = Date.now();
            chrome.tabs.update(target.id, {active: true});
            break;
          }
          i--;
        }
      });

    } else if(msg.clickAction >= 0) {

      //prevent click action if we recently scrolled
      if(lastWheel !== 0 && Date.now() - lastWheel < 400) {
        return;
      }
      lastWheel = 0;

      if(msg.clickAction === 3) {
        chrome.tabs.create({
          active: true,
          index: tab.index + 1,
          openerTabId: tab.id
        });
      
      } else if(msg.clickAction === 1) {
        chrome.tabs.remove(tab.id);

      } else {
        if(GO_BACK) {
          if(msg.clickAction === 0) {
            chrome.tabs.goBack(tab.id);
          } else {
            chrome.tabs.goForward(tab.id);
          }
        } else {
          chrome.tabs.executeScript(tab.id, {
            code: "history.go(" + (msg.clickAction === 0 ? -1 : 1) + ");",
            matchAboutBlank: true,
            runAt: "document_start"
          });
        }
      }
    } else if(msg.permChanged) {
      permCheck();
    }
  }
);

chrome.runtime.onInstalled.addListener(({reason}) => {
  if(reason === "install") {
    //show the intro page in the active tab which should be the AMO page
    const url = chrome.runtime.getURL("welcome.htm");
    chrome.tabs.update({url, active: true}, tab => {
      if(!tab || !tab.active) {
        chrome.tabs.create({url});
      }
    });
  }
});

chrome.storage.onChanged.addListener(changes => {
  noScroll = !!changes.noScroll.newValue;
});

chrome.storage.local.get("noScroll", data => {
  noScroll = !!data.noScroll;
});

function permCheck() {
  chrome.permissions.contains({permissions: ["tabs"]}, has => {
    if(has) {
      queryParam.url = "*:\/\/*/*";  //"url" used to skip chrome pages
    } else {
      delete queryParam["url"];
    }
  });
}

permCheck();
