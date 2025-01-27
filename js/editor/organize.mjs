// import {
//     lib,
//     game,
//     ui,
//     get,
//     ai,
//     _status
// } from "../../../../noname.js";
1;
export class EditorOrganize {
    static testSentenceIsOk(str) {
        try {
            new Function(str);
        } catch (err) {
            if (err) return false;
        }
        return true;
    }
}
