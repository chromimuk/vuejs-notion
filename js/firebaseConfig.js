function FirebaseConfig() {

    function getConfig() {
        return {
            apiKey: "<apikey>",
            authDomain: "<authDomain>",
            databaseURL: "<databaseUrl>",
            projectId: "<projectId>",
            storageBucket: "<storageBucket>",
            messagingSenderId: "<messageSenderId>"
        };
    }
    return { getConfig: getConfig };
}