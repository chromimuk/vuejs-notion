App().init();

function App() {

    var g_RenderingHelper = RenderingHelper();
    var g_FirebaseHelper = FirebaseHelper();

    function init() {

        g_FirebaseHelper.init();

        firebase.auth().onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                g_RenderingHelper.showLoggedInState();
                load(firebaseUser, false);
            } else {
                g_RenderingHelper.showLoggedOutState();
                load({ email: '' }, true);
            }
        });
    }

    function load(user, isFake) {
        
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
                editorContent: '',
                user: user,
                userEmail: user.email,
                userPassword: '',
                alertMessage: '',
                isNotLoggedIn: isFake
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
                }
            },

            methods: {

                addPage: function () {
                    if (this.isNotLoggedIn === true)
                        return;

                    this.editorContent = this._defaultPageContent();
                    this.pageTitle = this._defaultPageTitle();
                    this.currentPage = {
                        title: this.pageTitle,
                        text: this.editorContent,
                    };
                    this.currentPage['.key'] = g_PageRepo.add(this.currentPage);
                },

                savePage: function (page) {
                    if (this.isNotLoggedIn === true)
                        return;

                    if (this.pageTitle.length === 0)
                        this.pageTitle = this._defaultPageTitle();
                    var newValues = {
                        title: this.pageTitle,
                        text: this.editorContent
                    }
                    g_PageRepo.save(page['.key'], newValues);
                    this.addAlert('Sauvegardé le ' + this._defaultPageTitle());
                },

                removePage: function (page) {
                    if (this.isNotLoggedIn === true)
                        return;

                    g_PageRepo.remove(page['.key']);
                },

                showContent: function (page) {
                    this.currentPage = page;
                    this.editorContent = page.text;
                    this.pageTitle = page.title;
                },

                updatePreview: _.debounce(function (e) {
                    this.editorContent = e.target.value;
                }, 300),

                setFocusOnEditor: function (element) {
                    g_RenderingHelper.setFocus(false);
                },

                setFocusOnPreview: function (element) {
                    g_RenderingHelper.setFocus(true);
                },

                login: function () {
                    g_FirebaseHelper.signIn(this.userEmail, this.userPassword);
                },

                logout: function () {
                    g_FirebaseHelper.signOut();
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

    return { init: init };
}