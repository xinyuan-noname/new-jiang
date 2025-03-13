import { game, lib } from "../../../../noname.js";
import character from "./character.mjs";
import characterIntro from "./characterIntro.mjs";
import characterSort from "./characterSort.mjs";
import dynamicTranslate from "./dynamicTranslate.mjs";
import skill from "./skill.mjs";
import translate from "./translate.mjs";
import url from "./url.mjs"
export default () => {
    lib.init.promises.css(`./${url}/style`, "nature")
        .catch(err => {
            throw err;
        });
    const natureGroup = [
        ["xjb_chunqiu_jin", "fire"],
        ["xjb_chunqiu_wei", "fire"],
        ["xjb_chunqiu_qi", "fire"],
        ["xjb_chunqiu_wu", "qun"],
        ["xjb_qin", "black"]
    ]
    for (const [name, nature] of natureGroup) {
        lib.group.push(name);
        lib.groupnature[name] = nature;
    }
    game.import("character", () => ({
        name: "xjb_easternZhou",
        connect: true,
        character,
        characterSort,
        dynamicTranslate,
        characterIntro,
        skill,
        translate
    }))
}