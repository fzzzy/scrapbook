
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

function click(event) {
    event.preventDefault();
    const x = event.pageX + window.scrollX - window.pageXOffset;
    const y = event.pageY + window.scrollY - window.pageYOffset
    const el = document.elementFromPoint(x, y);
    const serialized = serializeDOM(el);
    //console.log(serialized);
    document.removeEventListener("click", click, false);
    browser.runtime.sendMessage({"addScrap": serialized});
}

document.addEventListener("click", click, false);


