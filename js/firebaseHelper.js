function FirebaseHelper() {

    function _getConfig() {
        return {
            apiKey: "AIzaSyAY8-F8oDEApfw9sgHY_Rl9a3Ykjz_T0Ug",
            authDomain: "vuejs-university.firebaseapp.com",
            databaseURL: "https://vuejs-university.firebaseio.com",
            projectId: "vuejs-university",
        };
    }

    function init() {
        var config = _getConfig();
        firebase.initializeApp(config);
    }

    function getUser() {
        return firebase.auth().currentUser;
    }

    function getReference(name) {
        return firebase.database().ref(name);
    }

    function signIn(email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    }

    function signOut() {
        return firebase.auth().signOut();
    }


    return {
        init: init,
        getUser: getUser,
        getReference: getReference,
        signIn: signIn,
        signOut: signOut
    }
}


function FirebasePageReference() {

    var _ref = null;

    function init() {
        _ref = firebase.database().ref('pages');
    }

    function getReference() {
        return _ref;
    }

    function add(page) {
        var newRef = _ref.push();
        var newItem = {
            id: newRef.key,
            title: page.title,
            text: page.text
        };
        newRef.set(newItem);
        return newRef.key;
    }

    function save(pageKey, newValues) {
        _ref.child(pageKey).update({
            title: newValues.title,
            text: newValues.text
        });
    }

    function remove(pageKey) {
        _ref.child(pageKey).remove();
    }

    return {
        init: init,
        getReference: getReference,
        add: add,
        save: save,
        remove: remove,
    }
}