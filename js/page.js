"use strict;"

class Page {

    constructor(title, content, userModifiedBy, dtModified, id) {
        this._title = title || null;
        this._content = content || null;
        this._userModifiedBy = userModifiedBy || null;
        this._dtModified = dtModified || null;
        this._id = id || null;
    }

    get id() {
        return this._id;
    }
    set id(id) {
        this._id = id;
    }

    get title() {
        return this._title;
    }
    set title(title) {
        this._title = title;
    }

    get content() {
        return this._content;
    }
    set content(content) {
        this._content = content;
    }

    get userModifiedBy() {
        return this._userModifiedBy;
    }
    set userModifiedBy(userModifiedBy) {
        this._userModifiedBy = userModifiedBy;
    }

    get dtModified() {
        return this._dtModified;
    }
    set dtModified(dtModified) {
        this._dtModified = dtModified;
    }

    validate() {
        // TODO
        return true;
    }

    static getDefaultTitle() {
        const date = new Date();
        return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    }

    static getDefaultContent() {
        const date = new Date();
        return '*' + date.toLocaleDateString('fr-FR') + '*\n___';
    }

}