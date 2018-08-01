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
                    if (this.pageLastEditedDate.length === 0)
                        return null;
                    else
                        return new Date(this.pageLastEditedDate).toLocaleDateString('fr-FR')
                }
            },

            methods: {

                addPage: function () {

                    if (this.isLoggedIn === false)
                        return;

                    this.editorContent = this._defaultPageContent();
                    this.pageTitle = this._defaultPageTitle();
                    this.currentPage = {
                        title: this.pageTitle,
                        text: this.editorContent,
                        date: new Date(),
                        user: this.userEmail
                    };
                    this.currentPage['.key'] = _FirebaseHelper.add(ObjectType.Page, this.currentPage);
                },

                savePage: function (page) {
                    if (this.isLoggedIn === false)
                        return;
                    if (this.pageTitle.length === 0)
                        this.pageTitle = this._defaultPageTitle();

                    var newValues = {
                        title: this.pageTitle,
                        text: this.editorContent,
                        date: new Date(),
                        user: this.user.email
                    }
                    _FirebaseHelper.save(ObjectType.Page, page['.key'], newValues);
                    this.addAlert('Sauvegardé le ' + this._defaultPageTitle());
                },

                removePage: function (page) {
                    if (this.isLoggedIn === false)
                        return;

                    _FirebaseHelper.remove(ObjectType.Page, page['.key']);
                },

                showPageMenu: function (page) {
                    if (this.isLoggedIn === false)
                        return;

                    this.isMenuShown = !this.isMenuShown;
                    if (this.isMenuShown === true) {
                        _RenderingHelper.setFocus(FocusType.Menu);
                    } else {
                        _RenderingHelper.setFocus(FocusType.Preview);
                    }
                },

                showContent: function (page) {
                    this.currentPage = page;
                    this.editorContent = page.text;
                    this.pageTitle = page.title;
                    this.pageLastEditedUser = page.user;
                    this.pageLastEditedDate = page.date;
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

                // à la création d'une nouvelle page
                _defaultPageContent: function () {
                    const date = new Date();
                    return '*' + date.toLocaleDateString('fr-FR') + '*\n___';
                },
                _defaultPageTitle: function () {
                    const date = new Date();
                    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                },
            }
        });
    }

    init();
}