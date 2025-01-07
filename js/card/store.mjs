import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
export const soulStoreCard = {};
export const soulStoreCardTranslate = {};
function CardCreater(name, card) {
    soulStoreCard[name] = { ...card }
    delete soulStoreCard[name].translate;
    delete soulStoreCard[name].description;
    soulStoreCardTranslate[name] = card.translate;
    soulStoreCardTranslate[name + "_info"] = card.description
    return soulStoreCard[name];
};
const xjb_penglai = CardCreater(
    "xjb_penglai", {
    type: "xjb_unique",
    subtype: "xjb_unique_talent",
    enable: true,
    filterTarget: function (card, player, target) {
        return card.storage.xjb_allowed == true;
    },
    content() {
        'step 0'
        target.useCard({ name: "jiu" }, target)
        target.storage.xjb_card_allow = target.storage.xjb_card_allow || {}
        target.storage.xjb_card_allow['xjb_penglai'] = true
        target.storage.xjb_unique_talent = target.storage.xjb_unique_talent || []
        event.num = [1, 2, 3].randomGet()
        player.$skill(event.num + '', 'legend', 'wood');
        'step 1'
        target.xjb_recordTalentCard(event.num, 'xjb_penglai');
        'step 2'
        target.addSkillLog('xjb_penglai');
        target.update();
        'step 3'
        target.getStat().card.jiu = 0;
        target.restoreSkill = function () {
            return this;
        }
        target.awakenSkill = function (skill) {
            this.storage[skill] = false
            return this;
        }
        target.enableSkill = function () {
            return this;
        }
        target.disableSkill = function () {
            return this;
        }
    },
    savable: true,
    selectTarget: 1,
    modTarget: true,
    ai: {
        order: 8,
        basic: {
            value: 10,
            useful: 10,
        },
        result: {
            target: function (player, target, card, isLink) {
                if (target.hasSkill("xjb_penglai")) return 0.5
                return 1
            },
        },
    },
    fullskin: true,
    image: "ext:新将包/xjb_Infinity.png",
    translate: '蓬莱',
    description: '出牌阶段及濒死时，对一名角色使用，其:<br>1.使用一张【酒】并将本回合使用过【酒】的次数清零;<br>2.体力值变为无限，持续回合由抽到的数字决定<br>3.失去技能废除及恢复的能力'
});
const xjb_skill_off_card = CardCreater(
    "xjb_skill_off_card", {
    type: "xjb_unique",
    subtype: "xjb_unique_talent",
    enable: true,
    filterTarget: function (card, player, target) {
        return card.storage.xjb_allowed == true;;
    },
    selectTarget: 1,
    modTarget: true,
    content: function () {
        "step 0"
        if (target.name1.indexOf("subplayer") > -1) {
            game.xjb_create.alert("禁止对随从使用此牌！")
            event.finish()
        }
        "step 1"
        event.num = [1, 2, 3].randomGet()
        player.$skill(event.num + '', 'legend', 'wood');
        "step 2"
        target.xjb_recordTalentCard(event.num, 'skill_noskill')
        "step 3"
        target.addSkill("skill_noskill")
        target.turnOver()
    },
    fullskin: true,
    image: "ext:新将包/xjb_jingu.png",
    translate: '禁锢卡',
    description: '出牌阶段，你对一名角色使用此牌，其翻面并封印所有技能，持续回合由抽取数字决定。'
});
const xjb_zhihuan = CardCreater(
    'xjb_zhihuan', {
    type: "xjb_unique",
    subtype: "xjb_unique_reusable",
    enable: true,
    selectTarget: 1,
    modTarget: true,
    filterTarget: true,
    modTarget: true,
    filterTarget(card, player, target) {
        return card.storage.xjb_allowed == true;;
    },
    content() {
        "step 0"
        target.chooseToDiscard('he', [1, Infinity], true)
        "step 1"
        player.draw(result.cards.length)
        var num = cards[0].number + 1
        if (cards[0].number < 5) {
            let gainCard = game.createCard(cards[0].name, cards[0].suit, num)
            gainCard.storage.xjb_allowed = true
            player.gain(gainCard)
        }
    },
    fullskin: true,
    image: "ext:新将包/xjb_zhihuan.png",
    translate: '置换卡',
    description: '出牌阶段，你对一名角色使用此牌，其弃置至少一张牌，然后你摸等量张牌。<br>最大回收点数:4'
});
const xjb_lingliCheck = CardCreater(
    "xjb_lingliCheck", {
    type: "xjb_unique",
    subtype: "xjb_unique_money",
    enable: true,
    selectTarget: 1,
    modTarget: true,
    filterTarget: function (card, player, target) {
        return card.storage.xjb_allowed == true;;
    },
    content: function () {
        "step 0"
        target.xjb_addLingli(14 - cards[0].number).set("lingliSource", "card")
    },
    fullskin: true,
    image: "ext:新将包/lingli/check.png",
    translate: "灵力支票",
    description: '出牌阶段对一名角色使用，其获得灵力。',
    ai: {
        order: 2,
        basic: {
            value: 10,
            useful: 10,
        },
        result: {
            target: 1
        },
    },
});
const xjb_shenshapo = CardCreater(
    "xjb_shenshapo", {
    ai: {
        order: 3,
        basic: {
            value: 10,
            useful: 10,
        },
        result: {
            target: -3,
            player: 1,
        },
    },
    image: "ext:新将包/xjb_shenshapo.png",
    type: "xjb_unique",
    subtype: "xjb_unique_reusable",
    enable: true,
    selectTarget: 3,
    multitarget: true,
    multiline: true,
    modTarget: true,
    filterTarget: true,
    content: function () {
        'step 0'
        player.useCard({
            name: "sha",
            nature: "kami",
            isCard: true
        }, targets)
        'step 1'
        player.getStat().card.sha = 0
        var num = cards[0].number + 1
        if (cards[0].number < 2) {
            let gainCard = game.createCard(cards[0].name, cards[0].suit, num)
            gainCard.storage.xjb_allowed = true
            player.gain(gainCard)
        }

    },
    fullskin: true,
    translate: '神杀破',
    description: '出牌阶段指定三名角色:1.视为对目标使用一张神杀;<br>2.出牌阶段使用过【杀】的次数清零<br>最大回收点数:1点'
})
const xjb_seizeHpCard = CardCreater(
    "xjb_seizeHpCard", {
    audio: true,
    fullskin: true,
    type: "xjb_unique",
    subtype: "xjb_unique_reusable",
    filterTarget: function (card, player, target) {
        if (card.storage.xjb_allowed !== true) return false
        return target !== player && player.canCompare(target) && target.maxHp != Infinity && player.countCards("h") > target.countCards("h")
    },
    enable: true,
    content: function () {
        "step 0"
        player.chooseToCompare(target);
        "step 1"
        if (result.bool) {
            target.giveHpCard(player, 1)
        }
        "step 2"
        var num = cards[0].number + 1
        if (cards[0].number < 2) {
            const card = game.createCard(cards[0].name, cards[0].suit, num)
            player.gain(card);
            card.storage.xjb_allowed = true;
        }

    },
    image: "ext:新将包/xjb_seizeHpCard.png",
    translate: '体力抓取',
    description: '出牌阶段对一名手牌数小于你的其他角色使用:你与其的拼点，若你赢，你获得其一张体力牌<br>最大回收点数:1',
    ai: {
        order: 6,
        basic: {
            useful: 4.5,
            value: 9.2,
        },
        result: {
            target: -2,
        },
    },
})
const xjb_tianming_huobi2 = CardCreater(
    "xjb_tianming_huobi2", {
    image: "ext:新将包/xjb_tianming_huobi2.png",
    audio: true,
    fullskin: true,
    type: "xjb_unique",
    subtype: "xjb_unique_money",
    recastable: true,
    enable: true,
    selectTarget: -1,
    cardcolor: "red",
    toself: true,
    filterTarget: function (card, player, target) {
        return target === game.me && card.storage.xjb_allowed == true;
    },
    modTarget: true,
    content: function () {
        game.xjb_gainJP("160上限")
        delete card.storage.vanish;
    },
    translate: '金币',
    description: '珍贵的金币',
    ai: {
        basic: {
            useful: 4.5,
            value: 9.2,
        },
        result: {
            target: 2,
        },
    },
})
const xjb_tianming_huobi1 = CardCreater(
    "xjb_tianming_huobi1", {
    image: "ext:新将包/xjb_tianming_huobi1.png",
    audio: true,
    fullskin: true,
    recastable: true,
    type: "xjb_unique",
    subtype: "xjb_unique_money",
    enable: true,
    selectTarget: -1,
    cardcolor: "red",
    toself: true,
    filterTarget: function (card, player, target) {
        return target === game.me && card.storage.xjb_allowed == true;;
    },
    modTarget: true,
    content: function () {
        game.xjb_gainJP("40上限")
        delete card.storage.vanish;
    },
    translate: '铜币',
    description: '普通的铜币',
    ai: {
        basic: {
            useful: 4.5,
            value: 9.2,
        },
        result: {
            target: 2,
        },
    },
})
const xjb_skillCard = CardCreater(
    "xjb_skillCard", {
    type: "xjb_unique",
    subtype: "xjb_unique_talent",
    enable: true,
    lianheng: true,
    logv: false,
    selectTarget: 1,
    modTarget: true,
    filterTarget(card, player, target) {
        return card.storage.xjb_allowed == true;;
    },
    cardConstructor(id, boolean) {
        const it = lib.card[id + "_card"] = {
            enable: function (event, player) {
                return false
            },
            type: "xjb_unique",
            subtype: "xjb_unique_talent",
            recastable: true,
            hasSkill: id,
            ai: {
                basic: {
                    useful: 10,
                    value: 10,
                },
            },
            fullskin: true,
            image: "ext:新将包/skillCard.png"
        };
        if (boolean === true) {
            it.subtype = "xjb_unique_SanSkill";
        }
        lib.translate[id + "_card"] = lib.translate[id]
        lib.translate[id + "_card_info"] = "当你持有或武将牌上存在" + get.translation(id) + "时，你视为拥有技能:【" + get.translation(id) + "】<br><ins><i>" + lib.translate[id + "_info"] + "</i></ins>";
        if (!lib.skill.global.includes("xjb_skillCardObserver")) {
            game.addGlobalSkill("xjb_skillCardObserver");
        }
        lib.skill.xjb_skillCardObserver.observeList.add(id + "_card");
    },
    skillLeadIn(id) {
        const skillCardName = id + "_card"
        const skill = get.copy(lib.skill[id])
        if (!skill.filter) skill.filter = () => true;
        skill.filter2 = skill.filter;
        skill.skillCardName = skillCardName;
        skill.filter = function (event, player) {
            const name = this.skillCardName;
            if (player.countCards("hxs", { name }) < 1) return false;
            return this.filter2.apply(this, arguments);
        }
        lib.skill[skillCardName] = skill;
        return skill;
    },
    SanSkill: [
        "xjb_reviveDead",
        'xjb_lunaticMasochist',
        "xjb_JudgeReversal",
        "xjb_arrangePhase",
        "xjb_seasonChange",
        "xjb_livelyForever"
    ],
    async content(event, trigger, player) {
        const { control } = await player.chooseControl(["输入id", "神圣技能"]).forResult();
        if (control == '输入id') {
            const { result: id, bool } = await game.xjb_create.promise.chooseSkill(void 0, true);
            if (bool && id in lib.skill) {
                const toGain = game.xjb_createSkillCard(id);
                await event.target.gain(toGain);
            } else {
                await player.gain(event.cards)
                if (bool) await game.xjb_create.promise.alert("不是合法技能！")
            }
            return;
        }
        else if (control == '神圣技能') {
            const list = lib.card.xjb_skillCard.SanSkill.map(id => game.xjb_createSkillCard(id))
            const { bool, links } = await player.chooseButton(['选择一张神圣技能牌', [list, "vcard"]]).forResult();
            if (bool) {
                event.target.gain(links[0], "gain2")
            }
        }
    },
    fullskin: true,
    image: "ext:新将包/skillCard.png",
    translate: "技能卡",
    description: '出牌阶段，你可使用此牌，然后选择一项:1.输入id，获得一张对应的技能牌;2.获得一张神圣技能牌。'
})