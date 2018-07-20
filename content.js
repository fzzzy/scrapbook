
(function (){
let getAbsoluteUrl = (function() {
	let a;

	return function(url) {
		if (!a) a = document.createElement('a');
		a.href = url;

		return a.href;
	};
})();

function *indent(level) {
    for (let i = 0; i < level; i++) {
        yield '  ';
    }
}

function *generateSerializedDOMParts(node, indentLevel=0) {
    for (let space of indent(indentLevel)) {
        yield space;
    }
    if (node === null) {
        return;
    }
    if (node.tagName === undefined) {
        yield node.textContent + '\n';
        return;
    }
    yield `<${node.tagName}`;
    if (node.hasAttributes()) {
        for (let attr of node.attributes) {
            if (attr.name === 'style' || attr.name.indexOf('on') === 0) {
                continue;
            }
            let value = attr.value;
            if (attr.name === 'src') {
                value = getAbsoluteUrl(value);
            }
            yield ` ${attr.name}="${value}"`;
        }
    }
    yield ' style="';
    let de = window.getDefaultComputedStyle(node);
    let cs = window.getComputedStyle(node);
    for (let style of cs) {
        const dv = de.getPropertyValue(style);
        const sv = cs.getPropertyValue(style);
        if (dv !== sv) {
            yield `${style}: ${cs.getPropertyValue(style)}; `;
        }
    }
    yield '">\n';
    for (let child of node.childNodes) {
        for (let sub of serializeDOM(child, indentLevel + 1)) {
            yield sub;
        }
    }
    for (let space of indent(indentLevel)) {
        yield space;
    }
    yield `</${node.tagName}>\n`;
}

function serializeDOM(node) {
    return Array.from(generateSerializedDOMParts(node)).join('');
}

function scroll(event) {
    if (overlay) overlay.remove();
    let highlight = document.getElementById('highlight-box');
    if (highlight) highlight.remove();
}

function mousemove(event) {
    const x = event.clientX;
    const y = event.clientY;
    let node = document.getElementById('highlight-box');
    if (node) node.remove();
    overlay.remove();
    let el = document.elementFromPoint(x, y);
    document.body.appendChild(overlay);
    if (node) { document.body.appendChild(node); }
    if (!node) {
        node = document.createElement('div');
        node.id = 'highlight-box';
        node.style.position = 'fixed';
        node.style.border = '1px dashed black';
        node.style.borderImage = `url('${browser.extension.getURL("icons/selection.gif")}') 1 1 1 1 repeat repeat`;
        document.body.appendChild(node);
    }
    const bounds = el.getBoundingClientRect();
    node.style.top = bounds.top;
    node.style.left = bounds.left;
    node.style.height = bounds.height;
    node.style.width = bounds.width;
}

function click(event) {
    event.preventDefault();
    if (overlay) overlay.remove();
    let highlight = document.getElementById('highlight-box');
    if (highlight) highlight.remove();
    const x = event.clientX;
    const y = event.clientY;
    const el = document.elementFromPoint(x, y);
    const serialized = serializeDOM(el);
    //console.log(serialized);
    browser.runtime.sendMessage({"addScrap": serialized});
    document.removeEventListener("click", click, false);
    document.removeEventListener("mousemove", mousemove, false);
    window.removeEventListener("scroll", scroll, false);
}

let overlay = document.getElementById('scrapbook-highlight-overlay');
if (!overlay) {
    overlay = document.createElement('div');
    overlay.style.postion = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.bottom = '0';
    overlay.style.right = '0';
    overlay.style.backgroundColor = 'rgba(1,1,1,0.5)';
    document.body.appendChild(overlay);
    document.addEventListener("click", click, false);
    document.addEventListener("mousemove", mousemove, false);
    window.addEventListener("scroll", scroll, false);
}

})();

