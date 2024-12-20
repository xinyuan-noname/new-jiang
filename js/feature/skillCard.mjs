"use script"
import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
lib.element.card.xjb_Becolorful = function () {
    this.style.border = "1.5px solid black"
    this.classList.add("xjb_color_circle")
}
game.xjb_createSkillCard = function (id, colorful) {
    const info = lib.card.xjb_skillCard
    const isSanSkill = info.SanSkill.includes(id)
    info.cardConstructor(id, isSanSkill);
    info.skillLeadIn(id);
    const card = game.createCard(id + "_card");
    if (colorful) card.xjb_Becolorful();
    return card;
}

/**
 * 
 * @param {string} name 
 * @param {Skill} skill 
 * @returns 
 */
function SkillCreater(name, skill) {
    lib.skill[name] = { ...skill }
    delete lib.skill[name].translate;
    delete lib.skill[name].description;
    lib.translate[name] = skill.translate;
    lib.translate[name + "_info"] = skill.description
    return lib.skill[name];
};

const xjb_skillCardObserver = SkillCreater(
    "xjb_skillCardObserver", {
    trigger: {
        player: ["phaseBefore"],
        global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter","roundStart"]
    },
    charlotte: true,
    superCharlotte: true,
    direct: true,
    forced: true,
    silent: true,
    observeList: [],
    getSkill: (player, has) => {
        return get.info("xjb_skillCardObserver").observeList.filter(skillId => {
            if (has) return player.hasSkill(skillId)
            return !player.hasSkill(skillId)
        });
    },
    getCanLose: (player) => {
        const result = [];
        const list = get.info("xjb_skillCardObserver").getSkill(player, true);
        for (const card of list) {
            if (!player.countCards("hxs", card)) result.push(card);
        }
        return result;
    },
    getCanGet: (player) => {
        const result = [];
        const list = get.info("xjb_skillCardObserver").getSkill(player)
        for (const card of list) {
            if (player.countCards("hxs", card)) result.push(card)
        }
        return result;
    },
    filter: (event, player) => {
        return get.info("xjb_skillCardObserver").getCanGet(player).length || get.info("xjb_skillCardObserver").getCanLose(player).length;
    },
    content: async function (event, trigger, player) {
        const adds = get.info("xjb_skillCardObserver").getCanGet(player);
        const loses = get.info("xjb_skillCardObserver").getCanLose(player);
        if (adds.length) player.addTempSkill(adds, { player: "dieAfter" });
        if (loses.length) player.removeSkill(loses, { player: "dieAfter" });
    }
})