console.log('background.js');
browser.browserAction.onClicked.addListener(handleClick);
function handleClick() {
  console.log('HANDLECLICK');
}