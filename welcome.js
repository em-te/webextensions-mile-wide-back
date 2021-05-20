let toggle = false;

let tabs = document.getElementById("tabs");
let swipe = document.getElementById("swipe");
let bar1 = document.getElementById("bar1");

bar1.addEventListener("wheel", e => {
  if(e.screenY !== 0) {
    let next = e.deltaY > 0 ? true : false;
    let tab = tabs.querySelector(".selected");
    if(next) {
      tab.classList.remove("selected");
      while(tab = tab.nextElementSibling) {
        if(!tab.classList.contains("removed")) {
          tab.classList.add("selected");
          break;
        }
      }
      if(!tab) {
        tab = tabs.firstElementChild;
        do {
          if(!tab.classList.contains("removed")) {
            tab.classList.add("selected");
            break;
          }
        } while(tab = tab.nextElementSibling);
      }
    } else {
      tab.classList.remove("selected");
      while(tab = tab.previousElementSibling) {
        if(!tab.classList.contains("removed")) {
          tab.classList.add("selected");
          break;
        }
      }
      if(!tab) {
        tab = tabs.lastElementChild;
        do {
          if(!tab.classList.contains("removed")) {
            tab.classList.add("selected");
            break;
          }
        } while(tab = tab.previousElementSibling);
      }
    }
  }
}, true);

bar1.addEventListener("click", e => {
  if(e.screenY !== 0) {
    if(e.button !== 0) return;
    swipe.style.animation = toggle ?
      "nav1 0.5s ease-in normal, nav2 0.5s ease-out normal" :
      "navb1 0.5s ease-in normal, navb2 0.5s ease-out normal";
    toggle = !toggle;
    e.preventDefault();
  }
}, true);

bar1.addEventListener("contextmenu", e => {
  if(e.screenY !== 0) {
    swipe.style.animation = toggle ? 
      "nav1 0.5s ease-in reverse, nav2 0.5s ease-out reverse" :
      "navb1 0.5s ease-in reverse, navb2 0.5s ease-out reverse";
    toggle = !toggle;
    e.preventDefault();
  }
}, true);

bar1.addEventListener("auxclick", e => {
  if(e.screenY !== 0) {
    if(e.button !== 1) return;

    if(tabs.querySelectorAll("*:not(.removed)").length <= 1) {
      tabs.querySelectorAll(".removed").forEach(e => e.classList.remove("removed"));
      return;
    }

    let tab = tabs.querySelector(".selected");
    tab.classList.remove("selected");
    tab.classList.add("removed");
    while(tab = tab.previousElementSibling) {
      if(!tab.classList.contains("removed")) {
        tab.classList.add("selected");
        break;
      }
    }
    if(!tab) {
      tab = tabs.firstElementChild;
      do {
        if(!tab.classList.contains("removed")) {
          tab.classList.add("selected");
          break;
        }
      } while(tab = tab.nextElementSibling);
    }
    e.preventDefault();
  }
}, true);

document.querySelectorAll("*[i18n]").forEach(n => {
  n[n.getAttribute("i18n")] = chrome.i18n.getMessage(n.textContent);
});