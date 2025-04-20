let playerWindowId = null;

chrome.action.onClicked.addListener(() => {
  if (playerWindowId === null) {
    chrome.windows.create({
      url: 'player.html',
      type: 'popup',
      width: 360,
      height: 260,
      focused: true
    }, (window) => {
      playerWindowId = window.id;
    });
  } else {
    chrome.windows.update(playerWindowId, {
      focused: true
    });
  }
});

chrome.windows.onRemoved.addListener((windowId) => {
  if (windowId === playerWindowId) {
    playerWindowId = null;
  }
});

let currentTrack = null;
let audioPort = null;

chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'audio-port') {
    audioPort = port;
    port.onMessage.addListener((msg) => {
      if (msg.type === 'trackUpdate') {
        currentTrack = msg.track;
      }
    });
    
    port.onDisconnect.addListener(() => {
      audioPort = null;
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getCurrentTrack') {
    sendResponse({ track: currentTrack });
    return true;
  }
});