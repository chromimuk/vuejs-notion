"use strict";

const ObjectType = {
    Page: 0
};


/// interface to the firebase API
function FirebaseHelper() {

    // singleton setup
    let _instance;
    FirebaseHelper = function () {
        return _instance;
    }
    FirebaseHelper.prototype = this;
    _instance = new FirebaseHelper();
    _instance.constructor = FirebaseHelper;


    // private

    const firebaseConfig = FirebaseConfig().getConfig();
    firebase.initializeApp(firebaseConfig);

    const _FirebasePageReference = new FirebasePageReference();


    // public

    _instance.isUserLoggedIn = function (resolve, reject) {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                resolve(user);
            } else {
                reject();
            }
        });
    }

    _instance.signIn = function (email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    };

    _instance.signOut = function () {
        return firebase.auth().signOut();
    };

    _instance.getReference = function (objectType) {
        if (objectType === ObjectType.Page) {
            return _FirebasePageReference.getReference();
        }
    };

    _instance.add = function (objectType, obj) {
        if (objectType === ObjectType.Page) {
            return _FirebasePageReference.add(obj);
        }
    };

    _instance.save = function (objectType, id, newValues) {
        if (objectType === ObjectType.Page) {
            return _FirebasePageReference.save(id, newValues);
        }
    };

    _instance.remove = function (objectType, id) {
        if (objectType === ObjectType.Page) {
            return _FirebasePageReference.remove(id);
        }
    };

    return _instance;
}


/// reference to the 'pages' node on Firebase
function FirebasePageReference() {

    // singleton setup
    let _instance;
    FirebasePageReference = function () {
        return _instance;
    }
    FirebasePageReference.prototype = this;
    _instance = new FirebasePageReference();
    _instance.constructor = FirebasePageReference;


    // private

    const _refPages = firebase.database().ref('pages');


    // public

    _instance.getReference = function () {
        return _refPages;
    };

    _instance.add = function (page) {
        if (page instanceof Page === false)
            throw new Error(`object is invalid (${page.constructor.name})`);

        // create a blank page on Firebase (to get the ID)
        let newPage = _refPages.push();

        // create a real firebase page
        page.id = newPage.key;

        // push the page on Firebase
        newPage.set(page);

        return page;
    };

    _instance.save = function (pageKey, page) {
        if (page instanceof Page === false)
            throw new Error(`object is invalid (${page.constructor.name})`);

        _refPages.child(pageKey).update(page);
    }

    _instance.remove = function (pageKey) {
        _refPages.child(pageKey).remove();
    }

    return _instance;
}