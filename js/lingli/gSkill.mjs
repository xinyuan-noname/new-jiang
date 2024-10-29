import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
/**
 * 
 * @param {*} name 
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

const _xjb_soul_ling_jiezhen = SkillCreater(
    "_xjb_soul_jiezhen", {
    translate: "<span data-nature=xjb_hun><font color=white>灵·结阵</font></span>",
    description: "出牌阶段，你可以销毁一对点数相同的手牌，将牌堆中随机一张牌置入阵法区。",
    enable: "phaseUse",
    check: function (card) {
        if (lib.card[card.name].debuff) return 0;
        if (lib.card[card.name].hasSkill) return 999;
        return 10 - get.value(card)
    },
    filterCard: (card) => {
        if (!ui.selected.cards.length) return true;
        const firstCard = ui.selected.cards[0]
        return get.number(card) === get.number(firstCard)
    },
    selectCard: 2,
    filter: function (_, player) {
        if (!lib.config.xjb_lingli_Allallow && !lib.characterPack['xjb_soul'][player.name]) return false;
        if (player.getHistory("custom", evt => evt.name === "xjb_addZhenFa").length) return false;
        const hs = player.getCards('h').map(card => get.number(card));
        return hs.toUniqued().length != hs.length;
    },
    content: function () {
        player.xjb_destoryCards(cards);
        player.xjb_addZhenFa(Array.from(ui.cardPile.childNodes).randomGet());
    },
    ai: {
        basic: {
            order: 2,
        },
        result: {
            player: 1,
        },
    },
})
const _xjb_soul_xue_jiezhen = SkillCreater(
    "_xjb_soul_xueyin", {
    translate: "<span data-nature=xjb_hun><font color=white>血·结阵</font></span>",
    description: "出牌阶段限一次，你失去一点体力，从牌堆顶及牌堆底各获得一张牌。若这两张牌花色、点数、类别有至少一项相同，你销毁这对牌并将牌堆中一张放入阵法区。",
    enable: "phaseUse",
    filter: function (_, player) {
        if (!lib.config.xjb_lingli_Allallow && !lib.characterPack['xjb_soul'][player.name]) return false;
        if (player.getHistory("custom", evt => evt.name === "xjb_addZhenFa").length) return false;
        return true;
    },
    content: function () {
        "step 0"
        player.loseHp();
        "step 1"
        const cards = [...get.cards(1), ...get.bottomCards(1)];
        player.gain(cards, "gain2");
        player.showCards(cards);
        game.delay();
        if (cards[0].suit === cards[1].suit
            || cards[0].number === cards[1].number
            || get.type2(cards[0]) === get.type2(cards[1])) {
            player.xjb_destoryCards(cards);
            player.xjb_addZhenFa(Array.from(ui.cardPile.childNodes).randomGet());
        }
    },
    ai: {
        basic: {
            order: 2,
        },
        result: {
            player(player, target, card) {
                if (player.hp <= 2) return -1;
                return 2
            },
        },
    },
})
const _xjb_soul_lingji = SkillCreater(
    "_xjb_soul_lingji", {
    trigger: {
        global: "phaseAfter"
    },
    direct: true,
    charlotte: true,
    filter(event, player, triggername) {
        return player.xjb_hasLingli() && !player.xjb_isLingliStable();
    },
    async content(event, trigger, player) {
        player.xjb_transDensity();
        player.popup("灵寂");
    }
})
const _xjb_soul_linghu = SkillCreater(
    "_xjb_soul_linghu", {
    translate: "灵护",
    trigger: {
        player: ["damageBegin"]
    },
    forced: true,
    charlotte: true,
    filter: function (event, player, name) {
        return player.xjb_countLingli() >= 2;
    },
    content: function () {
        trigger.cancel();
        player.xjb_transDensityForced(2);
    }
})

const _xjb_zhenfa = SkillCreater(
    "_xjb_zhenfa", {
    marktext: "阵",
    intro: {
        name: "阵法",
        content: "expansion",
        markcount: "expansion",
    },
    trigger: {
        player: ["addToExpansionAfter"],
    },
    forced: true,
    filter: function (event, player) {
        if (!(event.gaintag.includes('_xjb_zhenfa'))) return false;
        return true;
    },
    async content(event, trigger, player) {
        player.xjb_qiling(trigger.cards.length);
        if (player.countExpansions("_xjb_zhenfa") > 3) player.xjb_discardZhenfaCard(1);
    },
})
const _xjb_lingli = SkillCreater(
    "_xjb_lingli", {
    marktext: "灵",
    intro: {
        name: "灵力",
        content: function (storage, player, skill) {
            let num = xjb_lingli.updateK(game.xjb_getSb.position(player))
            return `灵力值:${storage}Ch/${Math.floor(num)}Ch
            </br>灵力密度:${player.xjb_getLingliDensity()}`
        },
    }
})
const _xjb_moli = SkillCreater(
    "_xjb_moli", {
    marktext: "魔",
    intro: {
        name: "魔力",
        content: function (storage, player, skill) {
            return "魔力值:" + storage + "Ch";
        },
    }
})

