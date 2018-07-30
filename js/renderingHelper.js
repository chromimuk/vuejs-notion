var FocusType = {
    Editor: 0,
    Preview: 1,
    Menu: 2
}

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
        var preBlocksLength = preBlocks.length;

        for (var i = 0; i < preBlocksLength; i++) {
            var oldBlockHTML = preBlocks[i].children[0].innerHTML.replace(/'/g, '&#39;');
            var codeBlock = preBlocks[i].children[0];
            hljs.highlightBlock(codeBlock);
            html = html.replace(oldBlockHTML, codeBlock.innerHTML);
        }

        return html;
    }

    function setFocus(focusType) {
        var editorBar = document.getElementsByClassName('editorbar')[0];
        var previewBar = document.getElementsByClassName('previewbar')[0];
        if (focusType === FocusType.Preview) {
            editorBar.classList.add("editorbarWithoutFocus");
            editorBar.classList.remove("editorbarWithFocus");
            editorBar.classList.remove("editorbarWithoutFocusMenu");
            previewBar.classList.add("previewbarWithFocus");
            previewBar.classList.remove("previewbarWithoutFocus");
            previewBar.classList.remove("previewbarWithoutFocusMenu");
        } else if (focusType === FocusType.Editor) {
            editorBar.classList.add("editorbarWithFocus");
            editorBar.classList.remove("editorbarWithoutFocus");
            editorBar.classList.remove("editorbarWithoutFocusMenu");
            previewBar.classList.add("previewbarWithoutFocus");
            previewBar.classList.remove("previewbarWithFocus");
            previewBar.classList.remove("previewbarWithoutFocusMenu");
        } else if (focusType === FocusType.Menu) {
            editorBar.classList.add("editorbarWithoutFocusMenu");
            editorBar.classList.remove("editorbarWithFocus");
            editorBar.classList.remove("editorbarWithoutFocus");
            previewBar.classList.add("previewbarWithoutFocusMenu");
            previewBar.classList.remove("previewbarWithFocus");
            previewBar.classList.remove("previewbarWithoutFocus");
        }
    }

    return {
        renderPreview: renderPreview,
        setFocus: setFocus
    }
}