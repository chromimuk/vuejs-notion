"use strict";

// determine on what the focus is currently on
const FocusType = {
    Editor: 0,
    Preview: 1,
    Menu: 2,
    FullPreview: 3,
    FullEditor: 4
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

    let onlyEditorIsShown = true;

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

    function cleanFocusClassList(element, elementName) {
        const focusClasses = [
            `main--${elementName}-withFocus`,
            `main--${elementName}-withoutFocus`,
            `main--${elementName}-withoutFocus-menuShown`,
            `main--${elementName}-full`
        ];
        
        for (let c of focusClasses)
        {
            element.classList.remove(c);
        }
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

        cleanFocusClassList(editor, 'editor');
        cleanFocusClassList(preview, 'preview');

        if (focusType === FocusType.Preview) {
            editor.classList.add("main--editor-withoutFocus");
            preview.classList.add("main--preview-withFocus");
        } else if (focusType === FocusType.Editor) {
            editor.classList.add("main--editor-withFocus");
            preview.classList.add("main--preview-withoutFocus");
        } else if (focusType === FocusType.Menu) {
            editor.classList.add("main--editor-withoutFocus");
            preview.classList.add("main--preview-withoutFocus-menuShown");
        } else if (focusType === FocusType.FullPreview) {
            preview.classList.add("main--preview-full");
            preview.classList.remove('hidden');
            editor.classList.add('hidden');
        } else if (focusType === FocusType.FullEditor) {
            editor.classList.add("main--editor-full");
            editor.classList.remove('hidden');
            preview.classList.add('hidden');
        } 
    }

    _instance.switchFullView = function () {

        const btnSwitchView = document.getElementById("btnSwitchView");

        if (onlyEditorIsShown === true)
        {
            this.setFocus(FocusType.FullPreview);
            btnSwitchView.innerText  = Resx.showEditor;
        }
        else
        {
            this.setFocus(FocusType.FullEditor);
            btnSwitchView.innerText  = Resx.showPreview;
        }

        onlyEditorIsShown = !onlyEditorIsShown;
    }

    return _instance;
}