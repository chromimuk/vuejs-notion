"use strict;"

class Tool {
    static isUndefinedOrNullOrEmpty(e) {
        return (e === undefined || e === null || e.length === 0);
    }
}

class DateHelper {
    static getTimeString() {
        const date = new Date();
        return date.toLocaleTimeString('fr-FR');
    }

    static getDateString(d) {
        let date;
        if (Tool.isUndefinedOrNullOrEmpty(d) === true) {
            date = new Date();
        } else {
            if (d instanceof Date === false) {
                date = DateHelper.toDate(d);
            } else {
                date = d;
            }
        }

        return date.toLocaleDateString('fr-FR');
    }

    static toDate(d) {
        // TODO: throw error if invalid
        return new Date(d);
    }
}




const Resx = {
    savedAt: 'Sauvegardé à',
}