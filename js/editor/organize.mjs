import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../../../noname.js";
import { NonameCN } from "../nonameCN.js";

export class EditorOrganize{
    static testSentenceIsOk(str){
        try{
            new Function(str);
        }catch(err){
            if(err) return false;
        }
        return true;
    }
}
