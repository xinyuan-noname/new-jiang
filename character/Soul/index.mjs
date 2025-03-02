import { _status, lib, game, ui, get, ai } from "../../../../noname.js"
import character from "./character.mjs";
import characterSort from "./characterSort.mjs";
import skill from "./skill.mjs";
import translate from "./translate.mjs";
import url from "./url.mjs"
export default () => {
    lib.init.promises.css(`./${url}/style`, "nature")
        .catch(err => {
            throw err;
        });
    const natureGroup = [
        ["xjb_hun", "xjb_hun"]
    ]
    for (const [name, nature] of natureGroup) {
        lib.group.push(name);
        lib.groupnature[name] = nature;
    }
    lib.config.characters.push('xjb_soul');
    game.import("character", () => ({
        name: "xjb_soul",
        connect: false,
        character,
        characterSort,
        skill,
        translate,
    }))
}
lib.translate.xjb_newCharacter = lib.config.xjb_newcharacter.name2;
