"use script";
import { lib } from "../../../../noname.js";
import { NonameEditor } from "./nonameEditor.mjs";
import url from "./url.mjs"
export default () => {
    lib.init.promises.css(`./${url}/style`, "index")
        .catch(err => {
            throw err;
        });
    lib.init.promises.css(`./${url}/style`, "dynamic")
        .catch(err => {
            throw err;
        });
    return new NonameEditor();
}