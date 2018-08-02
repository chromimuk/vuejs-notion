"use strict;"

new Notion();

function Notion() {

    // singleton setup
    let _instance;
    Notion = function () {
        return _instance;
    }
    Notion.prototype = this;
    _instance = new Notion();
    _instance.constructor = Notion;


    // variables
    let _RenderingHelper;
    let _FirebaseHelper;


    // methods

    // init app, by checking if a user is logged in or not
    function init() {
        _RenderingHelper = new RenderingHelper();
        _FirebaseHelper = new FirebaseHelper();

        let promise = new Promise(function (resolve, reject) {
            _FirebaseHelper.isUserLoggedIn(resolve, reject)
        });
        promise.then(function (firebaseUser) {
            loadApp(firebaseUser, true);
        });
        promise.catch(firebaseUserStatusNoUser);
    }

    function firebaseUserStatusNoUser() {
        const blankUser = {
            email: ''
        };
        loadApp(blankUser, false);
    }

    // load the Vue app
    function loadApp(user, isLoggedIn) {

        new Vue({

            el: '#app',

            data: {
                currentPage: {
                    title: '',
                    text: '',
                },
                pageTitle: '',
                pageLastEditedUser: '',
                pageLastEditedDate: '',

                editorContent: '',
                alertMessage: '',

                user: user,
                userEmail: user.email,
                userPassword: '',

                isLoggedIn: isLoggedIn,
                isMenuShown: false
            },

            firebase: {
                pages: {
                    source: _FirebaseHelper.getReference(ObjectType.Page),
                    readyCallback: function () {
                        if (this.pages.length > 0) {
                            this.showContent(this.pages[0]);
                            this.setFocusOnPreview();
                        }
                    }
                }
            },

            computed: {
                compiledMarkdown: function () {
                    return _RenderingHelper.renderPreview(this.editorContent);
                },
                pageLastEditedDateComputed: function () {
                    if (this.isUndefinedOrNullOrEmpty(this.pageLastEditedDate)) {
                        return null;
                    } else {
                        return new Date(this.pageLastEditedDate).toLocaleDateString('fr-FR')
                    }
                }
            },

            methods: {

                addPage: function () {
                    if (this.isLoggedIn === false)
                        return;

                    this.editorContent = Page.getDefaultContent();
                    this.pageTitle = Page.getDefaultTitle();

                    const newPage = new Page(
                        this.pageTitle,
                        this.editorContent,
                        this.userEmail,
                        new Date(),
                        null // no id yet
                    );
                    this.currentPage = _FirebaseHelper.add(ObjectType.Page, newPage);
                },

                savePage: function (currentPage) {
                    if (this.isLoggedIn === false)
                        return;

                    const page = new Page(
                        this.pageTitle,
                        this.editorContent,
                        this.userEmail,
                        new Date(),
                        currentPage._id
                    );
                    _FirebaseHelper.save(ObjectType.Page, page.id, page);
                    this.addAlert('Sauvegardé le ' + new Date());
                },

                removePage: function (currentPage) {
                    if (this.isLoggedIn === false)
                        return;

                    _FirebaseHelper.remove(ObjectType.Page, currentPage._id);
                },

                showPageMenu: function (currentPage) {
                    if (this.isLoggedIn === false)
                        return;

                    this.isMenuShown = !this.isMenuShown;
                    if (this.isMenuShown === true) {
                        _RenderingHelper.setFocus(FocusType.Menu);
                    } else {
                        _RenderingHelper.setFocus(FocusType.Preview);
                    }
                },

                showContent: function (p) {
                    const page = new Page(
                        p._title,
                        p._content,
                        p._userModifiedBy,
                        p._dtModified,
                        p._id
                    );
                    this.currentPage = page;
                    this.pageTitle = page._title;
                    this.editorContent = page._content;
                    this.pageLastEditedUser = page._userModifiedBy;
                    this.pageLastEditedDate = page._dtModified;
                },

                updatePreview: _.debounce(function (e) {
                    this.editorContent = e.target.value;
                }, 300),

                setFocusOnEditor: function (element) {
                    this.isMenuShown = false;
                    _RenderingHelper.setFocus(FocusType.Editor);
                },

                setFocusOnPreview: function (element) {
                    this.isMenuShown = false;
                    _RenderingHelper.setFocus(FocusType.Preview);
                },

                login: function () {
                    let instance = this;
                    let promise = _FirebaseHelper.signIn(this.userEmail, this.userPassword);
                    promise.then(function () {
                        instance.isLoggedIn = true;
                    });
                    promise.catch(function (error) {
                        instance.isLoggedIn = false;
                        instance.addAlert(error.message);
                    });
                },

                logout: function () {
                    let instance = this;
                    let promise = _FirebaseHelper.signOut();
                    promise.then(function () {
                        instance.isLoggedIn = false;
                    });
                    promise.catch(function (error) {
                        instance.addAlert(error.message);
                    });
                },

                addAlert: function (text) {
                    this.alertMessage = text;
                },

                isUndefinedOrNullOrEmpty: function (element) {
                    return (element === undefined || element === null || element.length === 0);
                }
            }
        });
    }

    init();
}