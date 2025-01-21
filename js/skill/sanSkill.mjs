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

const xjb_reviveDead = SkillCreater(
    "xjb_reviveDead", {
    translate: "起死回生",
    description: "出牌阶段，你可以弃置4张花色不同的牌令一名角色复活。",
    enable: "phaseUse",
    nobracket: true,
    filter: function (event, player) {
        return game.dead.length > 0 && player.countDiscardableCards(player, "he") > 4;
    },
    filterCard: function (card, player) {
        if (ui.selected.cards.length === 0) return true;
        return !ui.selected.cards.map(card => get.suit(card)).includes(get.suit(card))
    },
    complexCard: true,
    selectCard: 4,
    position: "he",
    filterTarget: function (card, player, target) {
        return target.isDead()
    },
    deadTarget: true,
    content: async function (event, trigger, player) {
        event.target.revive(player.maxHp);
    }
})

const xjb_JudgeReversal = SkillCreater(
    "xjb_JudgeReversal", {
    mod: {
        judge: function (player, result) {
            if (!_status.event.card) return;
            if (result.bool == false) result.bool = true;
            else result.bool = false
        }
    },
    nobracket: true,
    translate: '判定反转',
    description: "你的延时锦囊牌判定结果反转"
})

const xjb_seasonChange = SkillCreater(
    "xjb_seasonChange", {
    translate: "四季分明",
    description: "每轮开始时，根据季节分别加场上人数张【桃】/【火攻】/【五谷丰登】/冰【杀】。(一轮代表一个季节)",
    nobracket: true,
    sanSkill: true,
    trigger: {
        global: "roundStart"
    },
    silent: true,
    forced: true,
    async content(event, trigger, player) {
        for (let i = 0; i < game.players.length; i++) {
            let card;
            const number = parseInt(Math.random() * 13 + 1)
            switch (game.roundNumber % 4) {
                case 1: card = game.createCard2("tao", "red", number); break;
                case 2: card = game.createCard2("huogong", "red", number); break;
                case 3: card = game.createCard2("wugu", "heart", number); break;
                case 0: card = game.createCard2("sha", "club", number, "ice"); break;
            }
            const insertedCard = Array.from(ui.cardPile.childNodes).randomGet();
            ui.cardPile.insertBefore(card, insertedCard)
            game.updateRoundNumber();
            game.log(card, "被置入牌堆中");
        }
    }
})

const xjb_arrangePhase = SkillCreater(
    "xjb_arrangePhase", {
    translate: "回合定序",
    description: "每轮开始时，你可以重新安排各个阶段的顺序。",
    nobracket: true,
    phaseList: [],
    init(player) {
        player.storage.xjb_arrangePhase = ["phaseZhunbei", "phaseJudge", "phaseDraw", "phaseUse", "phaseDiscard", "phaseJieshu"];
        player.markSkill("xjb_arrangePhase");
    },
    mark: true,
    marktext: "序",
    intro: {
        name: "回合定序",
        content: "当前回合顺序：$"
    },
    createPhaseCard(phaseName) {
        const cardName = `xjb_phaseCard_${phaseName}`
        if (!(cardName in lib.card)) {
            lib.card[cardName] = {

            };
            lib.translate[cardName] = get.translation(phaseName);
        }
        const card = game.createCard(cardName, "", "", "");
        card.dataset.xjb_phaseName = phaseName;
        return card;
    },
    trigger: {
        global: "roundStart"
    },
    async content(event, trigger, player) {
        const info = get.info("xjb_arrangePhase")
        const { result: { moved } } = await player.chooseToMove("重新安排回合的阶段顺序", true)
            .set("list", [
                ["阶段顺序", player.storage.xjb_arrangePhase.map(phase => info.createPhaseCard(phase))]
            ]);
        player.storage.xjb_arrangePhase = moved[0].map(card => card.dataset.xjb_phaseName);
    },
    global: "xjb_arrangePhase_phaseChange",
    subSkill: {
        phaseChange: {
            trigger: {
                player: "phaseBegin"
            },
            filter(event, player) {
                return game.hasPlayer2(curr => curr.storage.xjb_arrangePhase)
            },
            charlotte: true,
            superCharlotte: true,
            forced: true,
            async content(event, trigger, player) {
                const master = game.findPlayer2(curr => curr.storage.xjb_arrangePhase);
                trigger.phaseList = master.storage.xjb_arrangePhase;
            }
        }
    }
})

const xjb_livelyForever = SkillCreater(
    "xjb_livelyForever", {
    translate: "生生不息",
    description: "每回合限一次，你可以选择两张颜色相反的异名牌，生成一张字数、点数在其之间，花色从其一的牌。",
    nobracket: true,
    getCardNames: (num) => {
        const result = [];
        for (const i in lib.card) {
            if (get.translation(i).length === num) result.push(i);
        }
        return result;
    },
    enable: "phaseUse",
    selectCard: 2,
    filterCard: (card) => {
        if (ui.selected.cards.length === 0) return true;
        else return get.color(card, false) !== get.color(ui.selected.cards[0], false) &&
            get.name(card, false) !== get.name(ui.selected.cards[0], false);
    },
    lose: false,
    discard: false,
    usable: 1,
    position: "he",
    content: async function (event, trigger, player) {
        const nameList = [];
        event.cards.sort((card1, card2) => get.cardNameLength(card1, false) - get.cardNameLength(card2, false));
        const [card1, card2] = event.cards;
        const num1 = get.cardNameLength(card1, false), num2 = get.cardNameLength(card2, false);
        for (let i = num1; i <= num2; i++) {
            nameList.addArray(get.info(event.name).getCardNames(i));
        }
        const name = nameList.randomGet(),
            suit = event.cards.map(card => get.suit(card, false)).randomGet(),
            number = parseInt(Math.random() * (num2 - num1)) + num1;
        const card = game.createCard(name, suit, number);
        player.gain(card);
    }
})

const xjb_yinyangxiangsheng = SkillCreater(
    "xjb_yinyangxiangsheng", {
    translate: "阴阳相生",
    description: "你使用一张牌后，若此牌为红色，你获得一个阳爻；若此牌为黑色，你获得一个阴爻。当你的爻能够组成：乾卦，你可以视为使用任意一张普通锦囊牌；兑卦，你重置武将牌；离卦，你对一名角色造成一点火焰伤害；震卦，你对一名角色造成一点雷电伤害；巽卦，你展示牌堆顶的一张牌，令一名角色将该此花色的牌置入弃牌堆；坎卦，你回复一点体力(未受伤改为摸两张牌)；艮卦，你获得一点护甲；坤卦，你可以视为使用一张基本牌。",
    nobracket: true,
    markimage: true,
    trigger: {
        player: "useCardAfter"
    },
    markimage: "extension/新将包/image/@bagua/none.jpg",
    intro: {
        name: "阴阳相生",
        content: (storage, player, skill) => {
        }
    },
    forced: true,
    subTrans: {
        "qian": "乾",
        "kun": "坤",
        "dui": "兑",
        "xun": "巽",
        "gen": "艮",
        "li": "离",
        "zhen": "震",
        "kan": "坎"
    },
    content: async function (event, trigger, player) {
        game.broadcastAll((player, name) => {
            if (!player.storage[name]) player.storage[name] = [];
        }, player, "xjb_yinyangxiangsheng");
        const card = trigger.card;
        if (get.color(card) === "red") {
            player.storage["xjb_yinyangxiangsheng"].push("yang");
            player.markSkill("xjb_yinyangxiangsheng")
        } else if (get.color(card) === "black") {
            player.storage["xjb_yinyangxiangsheng"].push("yin")
            player.markSkill("xjb_yinyangxiangsheng")
        } else return;
        const gua = player.storage["xjb_yinyangxiangsheng"].slice(0, 3).join("-");
        player.marks.xjb_yinyangxiangsheng.style.backgroundImage = `url("extension/新将包/image/@bagua/${gua}.jpg")`;
        if (player.storage["xjb_yinyangxiangsheng"].length < 3) return;
        switch (gua) {
            // 乾卦 ok
            case "yang-yang-yang": {
                player.$skill("乾")
                const list = [];
                for (const name of lib.inpile) {
                    if (get.type(name) === "trick") {
                        list.push(["锦囊", "", name]);
                    }
                }
                const { result: { bool, links } } = await player.chooseButton(["阴阳相生",
                    [list, "vcard"]
                ]);
                if (!bool) return;
                await player.chooseUseTarget({ name: links[0][2] });
            }; break;
            //兑卦 ok
            case "yin-yang-yang": {
                player.$skill("兑")
                await player.link(false);
                await player.turnOver(false);
            }; break;
            // 离卦 ok
            case "yang-yin-yang": {
                player.$skill("离")
                const targets = await player.chooseTarget("选择目标对其造成一点火焰伤害").forResultTargets();
                if (targets) await targets[0].damage(1, "fire");
            }; break;
            // 震卦 ok
            case "yin-yin-yang": {
                player.$skill("震")
                const targets = await player.chooseTarget("选择目标对其造成一点雷电伤害").forResultTargets();
                if (targets) await targets[0].damage(1, "thunder");
            }; break;
            // 艮卦 ok
            case "yang-yin-yin": {
                player.$skill("艮")
                await player.changeHujia(1, "gain", true)
            }; break;
            // 坎卦 ok
            case "yin-yang-yin": {
                player.$skill("坎")
                if (player.isHealthy()) await player.draw(2)
                else await player.recover();
            }; break;
            // 巽卦 ok
            case "yang-yang-yin": {
                player.$skill("巽")
                const [card] = get.cards(1, true);
                await player.showCards([card]);
                const targets = await player.chooseTarget(`选择目标将${get.translation(get.suit(card))}牌置入弃牌堆`).forResultTargets();
                if (targets) {
                    const suit = get.suit(card);
                    const cards = targets[0].getCards("he", { suit });
                    if (cards.length) {
                        await targets[0].loseToDiscardpile(cards);
                    }
                }
            }; break;
            // 坤卦 ok
            case "yin-yin-yin": {
                player.$skill("坤")
                const list = [];
                for (const name of lib.inpile) {
                    if (get.type(name) === "basic") {
                        if (get.type(name) === "sha") {
                            for (const nature of lib.inpile_nature) {
                                list.push(["基本", "", name, nature]);
                            }
                        }
                        list.push(["基本", "", name]);
                    }
                }
                const { result: { bool, links } } = await player.chooseButton([
                    "阴阳相生",
                    [list, "vcard"]
                ]);
                if (!bool) return;
                player.chooseUseTarget({ name: links[0][2], nature: links[0][3] }, false);
            }; break;
        }
        game.broadcastAll((player, name) => {
            player.storage[name] = [];
            player.markSkill(name);
            player.marks.xjb_yinyangxiangsheng.style.backgroundImage = `url("extension/新将包/image/@bagua/none.jpg")`;
        }, player, "xjb_yinyangxiangsheng");
        for (const tag of ["qian", "kun", "dui", "xun", "kan", "li", "zhen", "gen"]) {
            player.removeGaintag("xjb_yinyangxiangsheng_" + tag)
        }
    },
    group: ["xjb_yinyangxiangsheng_prompt"],
    subSkill: {
        prompt: {
            trigger: {
                player: "chooseToUseBefore",
            },
            charlotte: true,
            silent: true,
            content: async function (event, trigger, player) {
                game.broadcastAll((player, name) => {
                    if (!player.storage[name]) player.storage[name] = [];
                }, player, "xjb_yinyangxiangsheng");
                const hs = player.getCards("h", card => {
                    return trigger.filterCard(get.autoViewAs(card), player, event) && get.color(card, player) !== "none";
                });
                if (!player.storage.xjb_yinyangxiangsheng.length) return;
                for (const card of hs) {
                    switch (player.storage.xjb_yinyangxiangsheng.join("-")) {
                        case "yang-yang": {
                            //ok yang-yang-yang
                            if (get.color(card) === "red") player.addGaintag(card, "xjb_yinyangxiangsheng_qian");
                            //yang-yang-yin
                            else if (get.color(card) === "black") player.addGaintag(card, "xjb_yinyangxiangsheng_xun");
                        }; break;
                        case "yang-yin": {
                            //ok yang-yin-yang
                            if (get.color(card) === "red") player.addGaintag(card, "xjb_yinyangxiangsheng_li");
                            //yang-yin-yin
                            else if (get.color(card) === "black") player.addGaintag(card, "xjb_yinyangxiangsheng_gen");
                        }; break;
                        case "yin-yang": {
                            //ok yin-yang-yang
                            if (get.color(card) === "red") player.addGaintag(card, "xjb_yinyangxiangsheng_dui");
                            //ok yin-yang-yin
                            else if (get.color(card) === "black") player.addGaintag(card, "xjb_yinyangxiangsheng_kan");
                        }; break;
                        case "yin-yin": {
                            //yin-yin-yang
                            if (get.color(card) === "red") player.addGaintag(card, "xjb_yinyangxiangsheng_zhen");
                            //ok yin-yin-yin
                            else if (get.color(card) === "black") player.addGaintag(card, "xjb_yinyangxiangsheng_kun");
                        }; break;
                    }
                }
                player.when({ player: "phaseAfter" }).then(() => {
                    for (const tag of ["qian", "kun", "dui", "xun", "kan", "li", "zhen", "gen"]) {
                        player.removeGaintag("xjb_yinyangxiangsheng_" + tag)
                    }
                });
            },
        }
    }
})