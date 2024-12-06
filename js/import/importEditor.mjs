import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
import { EXTENSION_GAME_URL } from "./url.js";
export function importEditor() {
    if (ui.system.querySelector("xjb-system-ED")) return;
    import("../editor.js").then(() => {
        const node = ui.create.system("技能编辑", game.xjb_skillEditor);
        node.classList.add("xjb-system-ED")
    }).catch(err => {
        console.error(err, "技能编辑器载入失败");
    });
    lib.init.css(`${EXTENSION_GAME_URL}/css`, "editor");
}
