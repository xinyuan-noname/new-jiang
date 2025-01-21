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
    if (skill.subTrans) {
        for (const subname in skill.subTrans) {
            const [trans, info] = skill.subTrans[subname];
            lib.translate[name + "_" + subname] = trans;
            lib.translate[name + "_" + subname + "_info"] = info;
        }
        delete lib.skill[name].subTrans;
    }
    return lib.skill[name];
};

const _xjb_soul_jiezhen = SkillCreater(
    "_xjb_soul_jiezhen", {
    translate: "<span data-nature=xjb_hun><font color=white>结阵</font></span>",
    description: "出牌阶段限一次，你失去一点体力，从牌堆顶及牌堆底各获得一张牌。若这两张牌花色相同或点数相同，你销毁这对牌并将牌堆中一张放入阵法区。",
    enable: "phaseUse",
    filterCard: false,
    filter: function (_, player) {
        if (!player.xjb_canUseLingli()) return false;
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
            || cards[0].number === cards[1].number) {
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
const _xjb_soul_zhizhen = SkillCreater(
    "_xjb_soul_zhizhen", {
    translate: "<span data-nature=xjb_hun><font color=white>置阵</font></span>",
    description: "出牌阶段，若你手牌中有技能卡，你可以失去一点体力，将其置于阵法区。",
    enable: "phaseUse",
    filter: function (_, player) {
        if (!player.xjb_hasSkillCard()) return false;
        if (player.getHistory("custom", evt => evt.name === "xjb_addZhenFa").length) return false;
        return true;
    },
    filterCard(card, player) {
        return card.dataset.xjb_skillCard;
    },
    async content(event, trigger, player) {
        await player.loseHp();
        player.xjb_addZhenFa(event.cards[0]);
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

const xjb_lingliDensity = SkillCreater(
    "xjb_lingliDensity", {
    markimage: "extension/新将包/lingli/lingli.png",
    intro: {
        name: "灵力",
        markcount(storage, player, string) {
            return player.xjb_getLingliDensity()
        },
        content: function (storage, player, skill) {
            return `灵力上限:${player.xjb_getLingliDensity()}`
        },
    },
    trigger: {
        global: "phaseAfter"
    },
    direct: true,
    charlotte: true,
    filter(event, player) {
        return player.xjb_hasLingli() && !player.xjb_isLingliStable();
    },
    async content(event, trigger, player) {
        player.xjb_transDensity();
        player.popup("灵寂");
    }
})
const xjb_lingliStruggle = SkillCreater(
    "xjb_lingliStruggle", {
    trigger: {
        global: ["gainAfter", "equipAfter", "addToExpansionAfter", "loseAsyncAfter", "loseAfter", "addJudgeAfter"]
    },
    filter: (event, player) => {
        return player.xjb_getLingliPeaceless().length;
    },
    forced: true,
    charlotte: true,
    content: async function (event, trigger, player) {
        for (const pos of player.xjb_getLingliPeaceless()) {
            const cardsP = player.xjb_getLingli("positive", pos);
            const cardsN = player.xjb_getLingli("negative", pos);
            const dis = cardsP.length - cardsN.length;
            if (dis > 0) {
                await player.xjb_destoryCards(cardsN);
                await player.xjb_destoryCards(cardsP.slice(dis));
            } else if (dis < 0) {
                await player.xjb_destoryCards(cardsP);
                await player.xjb_destoryCards(cardsN.slice(Math.abs(dis)));
            } else {
                await player.xjb_destoryCards(cardsN);
                await player.xjb_destoryCards(cardsP);
            }
        }
    }
})
const xjb_lingliNature = SkillCreater(
    "xjb_lingliNature", {
    trigger: {
        player: "xjb_addLingliAfter"
    },
    subTrans: {
        duanti: ["锻体",],
    },
    charlotte: true,
    forced: true,
    filter: (event, player) => {
        return !player.storage.xjb_lingliNature || player.storage.xjb_lingliNature.length === 0;
    },
    content: async function (event, trigger, player) {
        const [lingliNature] = await player.chooseButton([
            "灵力属性",
            [
                ["xjb_lingliNature_duanti"],
                "blank"
            ]
        ], true).set("prompt", "选择一个灵力属性获得之").forResultLinks();
        player.markAuto("xjb_lingliNature", lingliNature);
        if (player == game.me) {
            event.dialog = ui.create.dialog("选择的灵力属性", get.translation(lingliNature));
            if (event.isMine()) {
                ui.create.confirm("o");
                game.countChoose();
                await game.pause();
            } else {
                setTimeout(function () {
                    event.dialog.close();
                }, 2 * lib.config.duration);
                await game.delayx(2);
            }
        } else if (event.isOnline()) {
            event.send();
        }
        _status.imchoosing = false;
        if (event.dialog) event.dialog.close();
        player.markAuto("xjb_lingliNature", lingliNature);
    }
})