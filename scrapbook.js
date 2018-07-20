
function dom(tagName, attributes, children=[]) {
  const node = document.createElement(tagName);
  for (let name in attributes) {
    if (name.indexOf('on') === 0) {
      node[name] = attributes[name];
    } else {
      node.setAttribute(name, attributes[name]);
    }
  }
  if (!(children instanceof Array)) {
    children = [children];
  }
  for (let child of children) {
    if (typeof child === 'string') {
      child = document.createTextNode(child);
    }
    node.appendChild(child);
  }
  return node;
}

browser.runtime.onMessage.addListener((msg) => {
  if (msg.addScrap !== undefined) {
    const dataurl = `data:text/html;base64,${btoa(msg.addScrap)}`;
    const borderStyle = 'border: 1px solid black; padding: 0.25em; margin: 0.25em';
    const frameStyle = 'margin-top: 0.25em; margin-bottom: 1em; width: 100%';
    const node = dom('div', {}, [
      dom('a', {style: borderStyle, onclick: () => node.remove()}, 'X'),
      dom('span', {style: borderStyle}, `${new Date(msg.timestamp).toLocaleString()} `),
      dom('a', {href: msg.fromURL}, msg.fromURL),
      dom('iframe', {src: dataurl, 'style': frameStyle})
    ]);
    document.body.appendChild(node);
  }
});
