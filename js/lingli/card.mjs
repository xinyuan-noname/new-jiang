import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
/**
 * 
 * @param {string} name 
 * @param {importCardConfig['card']} card 
 * @returns 
 */
function CardCreater(name, card) {
    lib.card[name] = get.copy(card);
    delete lib.card[name].translate;
    delete lib.card[name].description;
    lib.translate[name] = card.translate;
    lib.translate[name + "_info"] = card.description
    return lib.card[name];
};
const xjb_lingli = CardCreater(
    "xjb_lingli", {
    translate: "灵力",
    description: "这是一点灵力",
    image: "ext:新将包/lingli/lingli_card.png",
    fullskin: true,
    enable: false,
    global: ["xjb_lingliDensity", "xjb_lingliStruggle", "xjb_lingliNature",
        
    ]
})