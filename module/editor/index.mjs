"use script";
import { NonameEditor } from "./nonameEditor.mjs";
import url from "./url.mjs"
const loadCss = (name) => {
    const style = document.createElement("link");
    style.rel = "stylesheet";
    style.href = `./${url}/style/${name}.css`;
    style.addEventListener("error", e => console.error(e.error));
    document.head.appendChild(style);
}
export default () => {
    loadCss("index"); loadCss("dynamic"); loadCss("font");
    return new NonameEditor();
}