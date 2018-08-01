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
            _FirebasePageReference.add(obj);
        }
    };

    _instance.save = function (objectType, id, newValues) {
        if (objectType === ObjectType.Page) {
            _FirebasePageReference.save(id, newValues);
        }
    };

    _instance.remove = function (objectType, id) {
        if (objectType === ObjectType.Page) {
            _FirebasePageReference.remove(id);
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
        let newPage = _refPages.push();
        const newItem = {
            id: newPage.key,
            title: page.title,
            text: page.text,
            date: page.date,
            user: page.user
        };
        newPage.set(newItem);
        return newPage.key;
    };

    _instance.save = function (pageKey, newValues) {
        _refPages.child(pageKey).update({
            title: newValues.title,
            text: newValues.text,
            date: newValues.date,
            user: newValues.user
        });
    }

    _instance.remove = function (pageKey) {
        _refPages.child(pageKey).remove();
    }

    return _instance;
}