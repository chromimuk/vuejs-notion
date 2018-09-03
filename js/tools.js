"use strict";

class Tool {
    static isUndefinedOrNullOrEmpty(e) {
        return (e === undefined || e === null || e.length === 0);
    }
}

class DateHelper {

    static getTimeString(d) {
        return DateHelper.toDate(d).toLocaleTimeString('fr-FR');
    }

    static getDateString(d) {
        return DateHelper.toDate(d).toLocaleDateString('fr-FR');
    }

    static toDate(d) {
        let date;
        if (Tool.isUndefinedOrNullOrEmpty(d) === true) {
            date = new Date();
        } else {
            if (d instanceof Date === false) {
                // TODO: throw error if invalid
                date = new Date(d);
            } else {
                date = d;
            }
        }
        return date;
    }
}




const Resx = {
    savedAt: 'Sauvegardé à',
    showEditor: 'Éditeur',
    showPreview: 'Aperçu',
}