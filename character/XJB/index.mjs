import { game, lib } from "../../../../noname.js";
import character from "./character.mjs";
import characterSort from "./characterSort.mjs";
import dynamicTranslate from "./dynamicTranslate.mjs";
import skill from "./skill.mjs";
import translate from "./translate.mjs";
export default () => {
    const natureGroup = [
        ["xjb_han", "fire"]
    ]
    for (const [name, nature] of natureGroup) {
        lib.group.push(name);
        lib.groupnature[name] = nature;
    }
    game.import("character", () => ({
        name: "XJB",
        connect: true,
        character,
        characterSort,
        dynamicTranslate,
        skill,
        translate
    }));
}