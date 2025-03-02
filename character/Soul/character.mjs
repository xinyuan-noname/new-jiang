import { _status, lib, game, ui, get, ai } from "../../../../noname.js"
import { extPath } from "./url.mjs"
const character = {
    xjb_Fuaipaiyi: {
        sex: "female",
        group: "xjb_hun",
        hp: 3,
        skills: ["xjb_soul_zhigong", "xjb_soul_jihuo"],
        trashBin: [],
        names: "索|芙艾派依"
    },
    xjb_chanter: {
        sex: "female",
        group: "xjb_hun",
        hp: 3,
        skills: ["xjb_soul_chanter"],
        trashBin: [],
        names: "索|琪盎特儿"
    },
    xjb_timer: {
        sex: "male",
        group: "xjb_hun",
        hp: 3,
        skills: ["xjb_soul_minglou", "xjb_soul_guifan"],
        trashBin: [],
        names: "索|泰穆尔"
    },
    xjb_xuemo: {
        sex: "female",
        group: "xjb_hun",
        hp: 2,
        skills: ["xjb_soul_xueqi", "xjb_soul_fuhong", "xjb_soul_hongxi", "xjb_soul_fuhua"],
        get trashBin() {
            return [`${extPath}image/character/xuemo${[1, 2, 3].randomGet()}.jpg`]
        },
        names: "索|布劳德"
    },
    xjb_newCharacter: {
        sex: lib.config.xjb_newcharacter.sex,
        group: lib.config.xjb_newcharacter.group,
        hp: lib.config.xjb_newcharacter.hp,
        skills: lib.config?.xjb_newcharacter?.skill?.filter?.(Boolean) || [],
        isZhugong: lib.config.xjb_newCharacter_isZhu == 1,
        hasHiddenSkill: lib.config.xjb_newCharacter_hide == 1,
        trashBin: [lib.config.xjb_newcharacter.selectedSkin]
    }
}
for (const id in character) {
    if (!character[id].trashBin.length) character[id].trashBin.push(`${extPath}image/character/${id}.jpg`);
}
export default character;