

browser.runtime.onMessage.addListener((msg) => {
  if (msg.addScrap !== undefined) {
    const node = document.createElement('div');
    node.innerHTML = msg.addScrap;
    document.body.appendChild(node);
  }
});

