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

        var editor = document.getElementById('editorDiv');
        var preview = document.getElementById('previewDiv');

        if (focusType === FocusType.Preview) {

            editor.classList.remove("main--editor-withFocus");
            editor.classList.add("main--editor-withoutFocus");
            editor.classList.remove("main--editor-withoutFocus-menuShown");

            preview.classList.add("main--preview-withFocus");
            preview.classList.remove("main--preview-withoutFocus");
            preview.classList.remove("main--preview-withoutFocus-menuShown");

        } else if (focusType === FocusType.Editor) {

            editor.classList.add("main--editor-withFocus");
            editor.classList.remove("main--editor-withoutFocus");
            editor.classList.remove("main--editor-withoutFocus-menuShown");

            preview.classList.remove("main--preview-withFocus");
            preview.classList.add("main--preview-withoutFocus");
            preview.classList.remove("main--preview-withoutFocus-menuShown");

        } else if (focusType === FocusType.Menu) {

            editor.classList.remove("main--editor-withFocus");
            editor.classList.add("main--editor-withoutFocus");

            preview.classList.remove("main--preview-withFocus");
            preview.classList.remove("main--preview-withoutFocus");
            preview.classList.add("main--preview-withoutFocus-menuShown");

        }
    }

    return {
        renderPreview: renderPreview,
        setFocus: setFocus
    }
}