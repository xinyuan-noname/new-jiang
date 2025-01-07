"use script"
import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
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
/**
 * 
 * @param {string} name 
 * @param {object} param1 
 * @param {function(this:Player)} param1.player
 * @param {function} param1.content
 */
const setEvent = (name, { player, content }) => {
    lib.element.Player.prototype[name] = get.copy(player)
    lib.element.content[name] = get.copy(content)
};
const setEventLike = (name, method) => {
    lib.element.Player.prototype[name] = get.copy(method)
}
const addPlayerMethod = (name, method) => {
    lib.element.Player.prototype[name] = get.copy(method)
};

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
    card.dataset.xjb_skillCard = true;
    if (colorful) card.xjb_Becolorful();
    return card;
}

addPlayerMethod("xjb_hasSkillCard", function (postion = "h", includeNoSkill) {
    const player = this;
    return player.countCards(postion, (card, player) => {
        if (includeNoSkill && get.name(card) === "xjb_skillCard") return true;
        return card.dataset.xjb_skillCard;
    }) > 0;
})
addPlayerMethod("xjb_countSkillCard", function (postion = "h", includeNoSkill) {
    const player = this;
    return player.countCards(postion, (card, player) => {
        if (includeNoSkill && get.name(card) === "xjb_skillCard") return true;
        return card.dataset.xjb_skillCard;
    })
})
addPlayerMethod("xjb_getSkillCard", function (postion = "h", includeNoSkill) {
    const player = this;
    return player.getCards(postion, (card, player) => {
        if (includeNoSkill && get.name(card) === "xjb_skillCard") return true;
        return card.dataset.xjb_skillCard;
    })
})
setEvent("xjb_discardSkillCard", {
    player: function (select = 1) {
        const player = this;
        const next = game.createEvent('xjb_discardSkillCard')
        next.player = this;
        next.select = select;
        next.setContent('xjb_discardSkillCard');
        return next
    },
    content: function () {
        "step 0"
        const skillCard = player.xjb_getSkillCard("x");
        if (skillCard.length) player.chooseButton(["选择从阵法中移除的技能牌", skillCard], event.select, true)
        else event.finish();
        "step 1"
        if (result && result.links) {
            player.gain(result.links, "gain2")
        }
    },
})
setEvent("xjb_chooseSkillToCard", {
    player: function (...args) {
        const player = this;
        const next = game.createEvent("xjb_chooseSkillToCard");
        for (const arg of args) {
            if (get.itemtype(arg) === "player") next.target = arg;
            else if (get.itemtype(arg) === "select") next.select = arg;
            else if (typeof arg === "boolean") next.forced = true;
            else if (typeof arg === "number") next.select = [arg, arg];
            else if (typeof arg === "function") next.filterSkill = arg;
        }
        next.player = player;
        if (!next.target) next.target = player;
        if (!next.select) next.select = [1, 1];
        next.setContent("xjb_chooseSkillToCard");
        return next
    },
    content: function () {
        "step 0"
        const skills = target.getSkills(null, false, false).filter(skill => {
            const info = get.info(skill);
            if (event.filterSkill) return event.filterSkill(skill);
            return !info.sourceSkill && !info.sub
        }).map(skill => {
            return [skill, `〖${get.plainText(lib.translate[skill])}〗(${skill})${lib.translate[skill + "_info"]}`]
        });
        let prompt;
        if (event.select[0] !== event.select[1]) prompt = `选择${get.cnNumber(event.select[0])}到${get.cnNumber(event.select[1])}项技能`
        else prompt = `选择${get.cnNumber(event.select[0])}项技能`;
        player.chooseButton([
            prompt,
            [skills, "tdnodes"]
        ], event.select, event.forced)
        "step 1"
        if (result.bool && result.links && result.links.length) {
            target.removeSkill(result.links);
            const cards = []
            for (const skill of result.links) {
                const card = game.xjb_createSkillCard(skill);
                cards.push(card)
            }
            player.gain(cards)
        }
        event.result = { bool: result.bool, skills: result.links }
    }
})

const xjb_skillCardObserver = SkillCreater(
    "xjb_skillCardObserver", {
    trigger: {
        player: ["phaseBefore"],
        global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "roundStart"]
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