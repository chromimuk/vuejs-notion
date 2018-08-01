"use strict";

// determine on what the focus is currently on
const FocusType = {
    Editor: 0,
    Preview: 1,
    Menu: 2
}

// helper to render elements on the page
function RenderingHelper() {

    // singleton setup
    let _instance;
    RenderingHelper = function () {
        return _instance;
    }
    RenderingHelper.prototype = this;
    _instance = new RenderingHelper();
    _instance.constructor = RenderingHelper;


    // private

    function _applyCodeBlockHighlight(html) {

        const tmpHTML = document.createElement('html');
        tmpHTML.innerHTML = html;
        const preBlocks = tmpHTML.getElementsByTagName('pre');
        const preBlocksLength = preBlocks.length;

        // highlight each pre block
        for (let i = 0; i < preBlocksLength; i++) {
            let preBlockChild = preBlocks[i].children[0];
            let oldBlockHTML = preBlockChild.innerHTML.replace(/'/g, '&#39;');
            hljs.highlightBlock(preBlockChild);
            html = html.replace(oldBlockHTML, preBlockChild.innerHTML);
        }

        return html;
    }


    // public 

    _instance.renderPreview = function (editorContent) {
        let html = marked(editorContent, {
            sanitize: true
        });
        return _applyCodeBlockHighlight(html);
    }

    _instance.setFocus = function (focusType) {

        const editor = document.getElementById('editorDiv');
        const preview = document.getElementById('previewDiv');

        // meh

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

    return _instance;
}