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
const xjb_lunaticMasochist = SkillCreater(
    "xjb_lunaticMasochist", {
    nobracket: true,
    translate: "疼痛敏感",
    description: "你弃牌、失去体力、恢复体力、失去体力上限、恢复体力上限、装备装备牌均视为受到伤害。",
    trigger: {
        player: ["equipBefore", "discardBefore", "loseHpBefore", "recoverBefore", "loseMaxHpBefore", "gainMaxHpBefore"]
    },
    forced: true,
    content: function () {
        trigger.set("name", "damage")
        if (!trigger.num) trigger.num = 1
    }
})
const xjb_xinsheng = SkillCreater(
    "xjb_xinsheng", {
    translate: "新生",
    description: "出牌阶段，你可以弃置三张牌令一名角色复活。",
    enable: "phaseUse",
    filter: function (event, player) {
        return game.dead.length > 0 && player.countDiscardableCards(player, "he") > 3;
    },
    filterCard: true,
    selectCard: 3,
    position: "he",
    filterTarget: function (card, player, target) {
        return target.isDead()
    },
    deadTarget: true,
    content: async function (event, trigger, player) {
        event.target.revive(player.maxHp);
    }
})
