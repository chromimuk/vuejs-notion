function RenderingHelper() {

    function renderPreview(editorContent) {
        var html = marked(editorContent, {
            sanitize: true
        });
        return _applyCodeBlockHighlight(html);
    }

    function _applyCodeBlockHighlight(html) {
        var el = document.createElement('html');
        el.innerHTML = html;
        var preBlocks = el.getElementsByTagName('pre');
        for (var i = 0; i < preBlocks.length; i++) {
            var oldBlockHTML = preBlocks[i].children[0].innerHTML.replace(/'/g, '&#39;');
            var codeBlock = preBlocks[i].children[0];
            hljs.highlightBlock(codeBlock);
            html = html.replace(oldBlockHTML, codeBlock.innerHTML);
        }

        return html;
    }

    function setFocus(isFocusOnPreview) {
        var editorBar = document.getElementsByClassName('editorbar')[0];
        var previewBar = document.getElementsByClassName('previewbar')[0];
        if (isFocusOnPreview === true) {
            editorBar.classList.add("editorbarWithoutFocus");
            editorBar.classList.remove("editorbarWithFocus");
            previewBar.classList.add("previewbarWithFocus");
            previewBar.classList.remove("previewbarWithoutFocus");
        } else {
            editorBar.classList.add("editorbarWithFocus");
            editorBar.classList.remove("editorbarWithoutFocus");
            previewBar.classList.add("previewbarWithoutFocus");
            previewBar.classList.remove("previewbarWithFocus");
        }
    }

    return {
        renderPreview: renderPreview,
        setFocus: setFocus
    }
}