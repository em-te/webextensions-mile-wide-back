function stopProp(e) {
  if(e.screenX === 0 && e.screenY !== 0) {
    e.preventDefault();
    e.stopPropagation();
  }
}

let mouseDown = false;  //avoids drag and drop accidental activation

//needs onmouseup on Chrome because "onclick" fails upon mousedown suppression
window.addEventListener("mouseup", e => {
  if(mouseDown && e.screenX === 0 && e.screenY !== 0) {
    chrome.runtime.sendMessage({
      clickAction: e.button
    });
    stopProp(e);
  }
  mouseDown = false;
}, true);

window.addEventListener("mousedown", e => {
  mouseDown = false;
  if(e.screenX === 0 && e.screenY !== 0) {
    if(e.buttons === 3) {  //left+right button concurrently pressed
      stopProp(e);
      chrome.runtime.sendMessage({
        clickAction: e.buttons
      });
    } else {
      mouseDown = true;
      if(e.button === 1) stopProp(e);
    }
  }
}, true);

window.addEventListener("wheel", e => {
  if(e.screenX === 0 && e.screenY !== 0) {
    chrome.runtime.sendMessage({
      scrollAction: (e.deltaY > 0) ? 1 : -1
    });
    //stopProp(e);
  }
}, true);

//suppresses link navigation and open in new tabs on Firefox
window.addEventListener("click", stopProp, true);

//suppresses middle click open in new tabs
window.addEventListener("auxclick", stopProp, true);

//mouseUp on Windows, mouseDown on Linux
window.addEventListener("contextmenu", stopProp, true);
