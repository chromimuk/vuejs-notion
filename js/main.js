"use strict";

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
            email: '', password: ''
        };
        loadApp(blankUser, false);
    }

    // load the Vue app
    function loadApp(user, isLoggedIn) {

        new Vue({

            el: '#app',

            data: {

                // will be a Page() instance
                currentPage: {
                    content: '' // necessary to provide it for init?
                },

                // error message at login, "last saved at...", etc.
                alertMessage: '',

                // current (firebase) user
                user: user,

                // is the user currently logged in
                isLoggedIn: isLoggedIn,

                // is the page menu currently shown
                isMenuShown: false,

                // login form
                email: user.email,
                password: '',
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
                    return _RenderingHelper.renderPreview(this.currentPage.content);
                },
                pageLastEditedDateComputed: function () {
                    if (Tool.isUndefinedOrNullOrEmpty(this.currentPage.dtModified)) {
                        return null;
                    } else {
                        return DateHelper.getDateString(this.pageLastEditedDate);
                    }
                }
            },

            methods: {

                addPage: function () {
                    if (this.isLoggedIn === false)
                        return;

                    const newPage = new Page(
                        Page.getDefaultTitle(),
                        Page.getDefaultContent(),
                        this.user.email,
                        new Date(),
                        null // no id yet
                    );
                    this.currentPage = _FirebaseHelper.add(ObjectType.Page, newPage);
                },

                savePage: function (currentPage) {
                    if (this.isLoggedIn === false)
                        return;

                    const page = new Page(
                        this.currentPage.title,
                        this.currentPage.content,
                        this.user.email,
                        new Date(),
                        currentPage._id
                    );
                    _FirebaseHelper.save(ObjectType.Page, page.id, page);
                    this.addAlert(`${Resx.savedAt} ${DateHelper.getTimeString()}`);
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
                },

                updatePreview: _.debounce(function (e) {
                    this.currentPage.content = e.target.value;
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
                    let promise = _FirebaseHelper.signIn(this.email, this.password);
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

                switchView: function() {
                    _RenderingHelper.switchFullView();
                },
            }
        });
    }

    init();
}