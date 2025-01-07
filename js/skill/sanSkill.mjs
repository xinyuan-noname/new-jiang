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
    position:"he",
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