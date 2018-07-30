App().init();

function App() {

    var isInitialized = false;
    var g_RenderingHelper = RenderingHelper();
    var g_FirebaseHelper = FirebaseHelper();

    function init() {
        g_FirebaseHelper.init();
        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (isInitialized === false) {
                if (firebaseUser) {
                    load(firebaseUser, true);
                    isInitialized = true;
                } else {
                    load({
                        email: ''
                    }, false);
                    isInitialized = true;
                }
            }
        });
    }

    function load(user, isLoggedIn) {

        var g_PageRepo = FirebasePageReference();
        g_PageRepo.init();

        var app = new Vue({
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
                    source: g_PageRepo.getReference(),
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
                    return g_RenderingHelper.renderPreview(this.editorContent);
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
                    this.currentPage['.key'] = g_PageRepo.add(this.currentPage);
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
                    g_PageRepo.save(page['.key'], newValues);
                    this.addAlert('Sauvegardé le ' + this._defaultPageTitle());
                },

                removePage: function (page) {
                    if (this.isLoggedIn === false)
                        return;

                    g_PageRepo.remove(page['.key']);
                },

                showPageMenu: function (page) {
                    if (this.isLoggedIn === false)
                        return;

                    this.isMenuShown = !this.isMenuShown;
                    if (this.isMenuShown === true) {
                        g_RenderingHelper.setFocus(FocusType.Menu);
                    } else {
                        g_RenderingHelper.setFocus(FocusType.Preview);
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
                    g_RenderingHelper.setFocus(FocusType.Editor);
                },

                setFocusOnPreview: function (element) {
                    this.isMenuShown = false;
                    g_RenderingHelper.setFocus(FocusType.Preview);
                },

                login: function () {
                    var instance = this;
                    var promise = g_FirebaseHelper.signIn(this.userEmail, this.userPassword);
                    promise.then(function (firebaseUser) {
                        instance.isLoggedIn = true;
                    });
                    promise.catch(function (error) {
                        instance.isLoggedIn = false;
                        instance.addAlert(error.message);
                    });
                },

                logout: function () {
                    var instance = this;
                    var promise = g_FirebaseHelper.signOut();
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
                    var date = new Date();
                    return '*' + date.toLocaleDateString('fr-FR') + '*\n___';
                },
                _defaultPageTitle: function () {
                    var date = new Date();
                    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
                },
            }
        });
    }

    return {
        init: init
    };
}