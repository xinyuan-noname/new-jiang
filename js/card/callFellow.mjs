import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
export const callFellow = {};
export const callFellowTranslate = {};
export const callFellowCardSkill = {};

function CardCreater(name, card) {
    callFellow[name] = { ...card }
    delete callFellow[name].translate;
    delete callFellow[name].description;
    callFellow[name].image = 'ext:新将包/image/card_callFellow/' + name + ".png"
    callFellowTranslate[name] = card.translate;
    callFellowTranslate[name + "_info"] = card.description
    return callFellow[name];
};
/**
 * @param {string} name 
 * @param {Skill} skill 
 */
function SkillCreater(name, skill) {
    callFellowCardSkill[name] = { ...skill };
    callFellowTranslate[name] = skill.translate;
    delete callFellowCardSkill[name].transalte;
    if (skill.description) {
        callFellowTranslate[name + "_info"] = skill.description;
        delete callFellowCardSkill[name].description;
    }
}


const xjb_qingnangshu = CardCreater(
    "xjb_qingnangshu", {
    type: "equip",
    subtype: "equip5",
    skills: ["xjb_qinnang2", "xjb_qns"],
    nomod: true,
    nopower: true,
    cardcolor: "red",
    unique: true,
    destory: true,
    ai: {
        equipValue: 7.5,
        basic: {
            order: function (card, player) {
                if (player && player.hasSkillTag('reverseEquip')) {
                    return 8.5 - get.equipValue(card, player) / 20;
                }
                else {
                    return 8 + get.equipValue(card, player) / 20;
                }
            },
            useful: 2,
            equipValue: 1,
            value: function (card, player, index, method) {
                if (player.isDisabled(get.subtype(card))) return 0.01;
                var value = 0;
                var info = get.info(card);
                var current = player.getEquip(info.subtype);
                if (current && card != current) {
                    value = get.value(current, player);
                }
                var equipValue = info.ai.equipValue;
                if (equipValue == undefined) {
                    equipValue = info.ai.basic.equipValue;
                }
                if (typeof equipValue == 'function') {
                    if (method == 'raw') return equipValue(card, player);
                    if (method == 'raw2') return equipValue(card, player) - value;
                    return Math.max(0.1, equipValue(card, player) - value);
                }
                if (typeof equipValue != 'number') equipValue = 0;
                if (method == 'raw') return equipValue;
                if (method == 'raw2') return equipValue - value;
                return Math.max(0.1, equipValue - value);
            },
        },
        result: {
            target: function (player, target, card) {
                return get.equipResult(player, target, card.name);
            },
        },
    },
    enable: true,
    selectTarget: -1,
    filterTarget: function (card, player, target) {
        return target == player;
    },
    modTarget: true,
    allowMultiple: false,
    content: function () {
        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
    },
    toself: true,
    translate: '青囊书',
    description: '1：你可以将一张红色牌当【桃】使用。2：出牌阶段限一次，可对一名角色使用【桃】，每使用一张，则你与其各摸一张牌。',
    fullskin: true,
})
const xjb_card_lw = CardCreater(
    "xjb_card_lw", {
    enable: true,
    type: "trick",
    derivation: "jiaxu",
    toself: true,
    selectTarget: -1,
    modTarget: true,
    filterTarget: function (card, player, target) {
        return target == player;
    },
    content: function () {
        "step 0"
        player.logSkill('luanwu')
        event.current = target.next;
        event.currented = [];
        event.preCurrent = game.players.length
        "step 1"
        event.currented.push(event.current);
        event.current.chooseToUse('乱武:使用一张杀或失去一点体力', function (card) {
            if (get.name(card) != 'sha') return false;
            return lib.filter.filterCard.apply(this, arguments)
        }, function (card, player, target) {
            if (player == target) return false;
            var dist = get.distance(player, target);
            if (dist > 1) {
                if (game.hasPlayer(function (current) {
                    return current != player && get.distance(player, current) < dist;
                })) {
                    return false;
                }
            }
            return lib.filter.filterTarget.apply(this, arguments)
        }).set('ai2', function () {
            return get.effect_use.apply(this, arguments) + 0.01;
        });
        "step 2"
        if (result.bool == false) {
            event.current.chooseToDiscard('he', true)
            event.current.loseHp();
        }
        event.current = event.current.next;
        if (event.current != player && !event.currented.includes(event.current)) {
            game.delay(0.5);
            event.goto(1);
        } else {
            (event.preCurrent > game.players.length) && player.gain(cards, 'gain2')
        }
    },
    contentAfter: function () {
        player.chooseUseTarget('sha', '是否使用一张【杀】？', false, 'nodistance');
    },
    fullimage: true,
    translate: "文和乱武",
    description: "出牌阶段，对你自己使用，所有其他角色除非对其距离最近的角色使用【杀】，否则其弃置一张牌并失去一点体力。结算完后，你视为使用一张无距离限制的【杀】。",
})
const xjb_qinglong = CardCreater(
    "xjb_qinglong", {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    distance: {
        attackFrom: -2,
    },
    destory: true,
    onLose: function () {
        player.$skill('二龙互化', 'legend', 'metal');
        player.equip(game.createCard('qinglong', 'spade', 5))
    },
    ai: {
        equipValue: function (card, player) {
            var num = 2.5 + (player.countCards('h') + player.countCards('e')) / 2.5;
            return Math.min(num, 5);
        },
        basic: {
            equipValue: 4.5,
        },
    },
    skills: ["xjb_yanyue", "xjb_hlyyd"],
    translate: "黄龙偃月刀",
    description: "<br>偃月:当你对一名角色造成伤害前，你可以弃置两张牌令此伤害+1，你令其获得一个\"梦魇\"标记。<br>二龙互化：你失去此牌时你立即销毁之，你装备【青龙偃月刀】。",
})
const xjb_chitu = CardCreater(
    "xjb_chitu", {
    fullskin: true,
    type: "equip",
    subtype: "equip4",
    nomod: true,
    nopower: true,
    distance: {
        globalFrom: -1,
        globalTo: 1,
    },
    enable: true,
    selectTarget: -1,
    filterTarget: function (card, player, target) {
        return target == player;
    },
    modTarget: true,
    allowMultiple: false,
    content: function () {
        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
    },
    toself: true,
    destory: true,
    onLose: function () {
        game.log(card, '被销毁了');
        player.equip(game.createCard('chitu', 'heart', 5))
    },
    skills: ["xjb_zhuihun", "new_wuhun"],
    translate: "梦魇赤兔马",
    description: "增加以下效果:<br>追魂:锁定技，你受到伤害后，伤害来源须弃置一张牌并获得一个\"梦魇\"，然后你额外进行一个回合。<br>关公之魂：你失去此牌时立即销毁之，然后你装备【赤兔】。",
    ai: {
        basic: {
            order: function (card, player) {
                if (player && player.hasSkillTag('reverseEquip')) {
                    return 8.5 - get.equipValue(card, player) / 20;
                }
                else {
                    return 8 + get.equipValue(card, player) / 20;
                }
            },
            useful: 2,
            equipValue: 4,
            value: function (card, player, index, method) {
                if (player.isDisabled(get.subtype(card))) return 0.01;
                var value = 0;
                var info = get.info(card);
                var current = player.getEquip(info.subtype);
                if (current && card != current) {
                    value = get.value(current, player);
                }
                var equipValue = info.ai.equipValue;
                if (equipValue == undefined) {
                    equipValue = info.ai.basic.equipValue;
                }
                if (typeof equipValue == 'function') {
                    if (method == 'raw') return equipValue(card, player);
                    if (method == 'raw2') return equipValue(card, player) - value;
                    return Math.max(0.1, equipValue(card, player) - value);
                }
                if (typeof equipValue != 'number') equipValue = 0;
                if (method == 'raw') return equipValue;
                if (method == 'raw2') return equipValue - value;
                return Math.max(0.1, equipValue - value);
            },
        },
        result: {
            target: function (player, target, card) {
                return get.equipResult(player, target, card.name);
            },
        },
    },
})
const xjb_baiyin = CardCreater(
    "xjb_baiyin", {
    fullskin: true,
    type: "equip",
    subtype: "equip2",
    loseDelay: false,
    destory: true,
    onLose: function () {
        game.log(card, '被销毁了');
        player.equip(game.createCard('baiyin', 'club', 1))
        player.recover();
    },
    skills: ["xjb_shinu"],
    tag: {
        recover: 1,
    },
    translate: "曜日银狮子",
    description: "<br>狮怒:你受到伤害前，你立即反伤;若你此时体力值为1，你移去此牌并取消此次伤害。<br>你失去装备区里的该牌时立即销毁之，然后你恢复1点体力并装备【白银狮子】。",
    ai: {
        order: 9.5,
        equipValue: function (card, player) {
            if (player.hp == player.maxHp) return 5;
            if (player.countCards('h', 'baiyin')) return 6;
            return 0;
        },
        basic: {
            equipValue: 5,
            order: function (card, player) {
                if (player && player.hasSkillTag('reverseEquip')) {
                    return 8.5 - get.equipValue(card, player) / 20;
                }
                else {
                    return 8 + get.equipValue(card, player) / 20;
                }
            },
            useful: 2,
            value: function (card, player, index, method) {
                if (player.isDisabled(get.subtype(card))) return 0.01;
                var value = 0;
                var info = get.info(card);
                var current = player.getEquip(info.subtype);
                if (current && card != current) {
                    value = get.value(current, player);
                }
                var equipValue = info.ai.equipValue;
                if (equipValue == undefined) {
                    equipValue = info.ai.basic.equipValue;
                }
                if (typeof equipValue == 'function') {
                    if (method == 'raw') return equipValue(card, player);
                    if (method == 'raw2') return equipValue(card, player) - value;
                    return Math.max(0.1, equipValue(card, player) - value);
                }
                if (typeof equipValue != 'number') equipValue = 0;
                if (method == 'raw') return equipValue;
                if (method == 'raw2') return equipValue - value;
                return Math.max(0.1, equipValue - value);
            },
        },
        result: {
            target: function (player, target, card) {
                return get.equipResult(player, target, card.name);
            },
        },
    },
    enable: true,
    selectTarget: -1,
    filterTarget: function (card, player, target) {
        return target == player;
    },
    modTarget: true,
    allowMultiple: false,
    content: function () {
        if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
    },
    toself: true,
})
const xjb_hutou = CardCreater(
    "xjb_hutou", {
    fullskin: true,
    type: "equip",
    subtype: "equip1",
    distance: {
        attackFrom: -2,
    },
    skills: ["xjb_htzjq"],
    translate: "虎头湛金枪",
    description: "当你使用【杀】指定一名角色为目标后，你令其选择失去一点体力/体力上限。",
    ai: {
        basic: {
            equipValue: 2,
            order: function (card, player) {
                if (player && player.hasSkillTag('reverseEquip')) {
                    return 8.5 - get.equipValue(card, player) / 20;
                }
                else {
                    return 8 + get.equipValue(card, player) / 20;
                }
            },
            useful: 2,
            value: function (card, player) {
                var value = 0;
                var info = get.info(card);
                var current = player.getEquip(info.subtype);
                if (current && card != current) {
                    value = get.value(current, player);
                }
                var equipValue = info.ai.equipValue;
                if (equipValue == undefined) {
                    equipValue = info.ai.basic.equipValue;
                }
                if (typeof equipValue == 'function') return equipValue(card, player) - value;
                if (typeof equipValue != 'number') equipValue = 0;
                return equipValue - value;
            },
        },
        result: {
            target: function (player, target, card) {
                return get.equipResult(player, target, card.name);
            },
        },
    },
    enable: true,
    selectTarget: -1,
    filterTarget: function (card, player, target) {
        return target == player;
    },
    modTarget: true,
    allowMultiple: false,
    content: function () {
        target.equip(card);
    },
    toself: true,
})
const xjb_qixing = CardCreater(
    "xjb_qixing", {
    type: "equip",
    subtype: "equip2",
    skills: ["qixing", "xjb_xuming"],
    destory: true,
    onLose: function () {
        player.gain(player.getExpansions('qixing'), 'gain2', 'fromStorage');
    },
    translate: "卧龙七星袍",
    description: "武侯之魂：你装备有此牌时，则拥有技能【七星】;你装备此牌时，立即获得七颗“星”。<br>七星续命：当一名角色濒死时，你可以选择一项执行：1.视为使用一张【奇门遁甲】;2.弃置最后一颗\"星\"，令其恢复1点体力;<br>你失去此牌时，立即销毁之，然后获得你武将牌上的所有“星\"",
    ai: {
        basic: {
            equipValue: 6.5,
            order: function (card, player) {
                if (player && player.hasSkillTag('reverseEquip')) {
                    return 8.5 - get.equipValue(card, player) / 20;
                }
                else {
                    return 8 + get.equipValue(card, player) / 20;
                }
            },
            useful: 2,
            value: function (card, player, index, method) {
                if (player.isDisabled(get.subtype(card))) return 0.01;
                var value = 0;
                var info = get.info(card);
                var current = player.getEquip(info.subtype);
                if (current && card != current) {
                    value = get.value(current, player);
                }
                var equipValue = info.ai.equipValue;
                if (equipValue == undefined) {
                    equipValue = info.ai.basic.equipValue;
                }
                if (typeof equipValue == 'function') {
                    if (method == 'raw') return equipValue(card, player);
                    if (method == 'raw2') return equipValue(card, player) - value;
                    return Math.max(0.1, equipValue(card, player) - value);
                }
                if (typeof equipValue != 'number') equipValue = 0;
                if (method == 'raw') return equipValue;
                if (method == 'raw2') return equipValue - value;
                return Math.max(0.1, equipValue - value);
            },
        },
        result: {
            target: function (player, target, card) {
                return get.equipResult(player, target, card.name);
            },
        },
    },
    fullskin: true,
    enable: true,
    selectTarget: -1,
    filterTarget: function (card, player, target) {
        return target == player;
    },
    modTarget: true,
    allowMultiple: false,
    content: function () {
        target.equip(cards[0]);
        player.$skill('武侯之魂', 'legend', 'metal');
        game.me.addToExpansion(get.cards(7), 'gain2').gaintag.add('qixing');
    },
    toself: true,
})


const xjb_xuming = SkillCreater(
    "xjb_xuming", {
    transalte: "续命",
    description: "",
    trigger: {
        global: "dying",
    },
    equipSkill: true,
    direct: true,
    content() {
        "step 0"
        const list = ['使用一张【奇门遁甲】']
        const list1 = ['选项一', 'cancel2']
        if (player.getExpansions('qixing').length > 0) {
            list.push('弃置一颗"星"，令' + get.translation(trigger.player) + '恢复1点体力')
            list1.splice(1, 0, '选项二')
        }
        player.chooseControl(list1)
            .set('choiceList', list)
            .set('prompt', '续命:选择一项执行之')
        "step 1"
        if (result.control == '选项一') {
            player.chooseUseTarget(game.createCard('xjb_qimendunjia'), true);
        }
        else if (result.control === '选项二') {
            const card = player.getExpansions('qixing').slice(-1)
            player.loseToDiscardpile(card);
            trigger.player.recover()
        }
    },

})

const xjb_yanyue = SkillCreater(
    "xjb_yanyue", {
    translate: "偃月",
    description: "",
    equipSkill: true,
    trigger: {
        source: "damageBegin2",
    },
    filter(event, player) {
        return player.countCards("he") > 1;
    },
    check(event, player) {
        return get.attitude(player, event.target) < 0;
    },
    content() {
        player.chooseToDiscard(2, true, "he", "弃置两张牌令此伤害+1");
        trigger.num++;
        trigger.player.addMark('new_wuhun_mark', 1);
    },
});
const xjb_zhuihun = SkillCreater(
    "xjb_zhuihun", {
    translate: "追魂",
    description: "",
    equipSkill: true,
    trigger: {
        player: "damageEnd",
    },
    forced: true,
    check(event, player) {
        return get.attitude(player, event.source) < 0;
    },
    content() {
        if (trigger.source.countCards('h') > 0) trigger.source.chooseToDiscard('h', 1, true);
        if (trigger.source) trigger.source.addMark('new_wuhun_mark', 1);
        player.insertPhase();
    },
});
const xjb_hlyyd = SkillCreater(
    "xjb_hlyyd", {
    translate: "武圣",
    description: "你可以将一张红色牌当做【杀】使用或打出，你以此法使用或打出最后手牌时，你从牌堆中获得一张带伤害标签的牌。你对有“梦魇”标记的角色使用牌无次数限制。",
    locked: false,
    enable: ["chooseToRespond", "chooseToUse"],
    filterCard(card, player) {
        if (get.zhu(player, 'shouyue')) return true;
        return get.color(card) == 'red';
    },
    position: "hes",
    viewAs: {
        name: "sha",
    },
    viewAsFilter(player) {
        if (get.zhu(player, 'shouyue')) {
            if (!player.countCards('hes')) return false;
        }
        else {
            if (!player.countCards('hes', { color: 'red' })) return false;
        }
    },
    onuse(event, player) {
        if (player.countCards("h") == 1) player.seekTag('damage');
    },
    prompt: "将一张红色牌当杀使用或打出",
    check(card) {
        var val = get.value(card);
        if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
        return 5 - val;
    },
});


const xjb_qns = SkillCreater(
    "xjb_qns", {
    translate: "青囊书1",
    mod: {
        aiValue: function (player, card, num) {
            if (get.name(card) != 'tao' && get.color(card) != 'red') return;
            var cards = player.getCards('hs', function (card) {
                return get.name(card) == 'tao' || get.color(card) == 'red';
            });
            cards.sort(function (a, b) {
                return (get.name(a) == 'tao' ? 1 : 2) - (get.name(b) == 'tao' ? 1 : 2);
            });
            var geti = function () {
                if (cards.includes(card)) {
                    return cards.indexOf(card);
                }
                return cards.length;
            };
            return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
        },
        aiUseful: function () {
            return lib.skill.kanpo.mod.aiValue.apply(this, arguments);
        },
    },
    enable: "chooseToUse",
    viewAsFilter: function (player) {
        return player.countCards('hes', { color: 'red' }) > 0;
    },
    filterCard: function (card) {
        return get.color(card) == 'red';
    },
    position: "hes",
    viewAs: {
        name: "tao",
    },
    prompt: "将一张红色牌当桃使用",
    check: function (card) { return 15 - get.value(card) },
    "_priority": 0,
})
const xjb_qinnang2 = SkillCreater(
    "xjb_qinnang2", {
    translate: "青囊书2",
    description: "",
    enable: "phaseUse",
    usable: 1,
    filter(event, player) {
        return player.countCards('h', 'tao') > 0 || (player.hasSkill('xjb_qns') && player.countCards('hes', { color: 'red' }) > 0);
    },
    filterTarget(card, player, target) {
        return player.canUse("tao", target);
    },
    async content(event, trigger, player) {
        while (true) {
            await player.chooseToUse('使用一张桃', { name: 'tao' }, true, function (card, player, target) {
                const targetx = _status.event.targetX;
                if (targetx == target) return true;
                return false;
            }).set("targetX", event.target);
            await game.asyncDraw([event.target, player]);
            if (!player.canUse("tao", event.target)) return;
            const { bool } = await player.chooseBool('是否继续出【桃】').forResult();
            if (!bool) return;
        }
    },
    ai: {
        order: 4.5,
        result: {
            target(player, target) {
                if (target.hp == 1) return 5;
                if (player == target && player.countCards('h') > player.hp) return 5;
                return 2;
            },
        },
        threaten: 3,
    },
});


const xjb_shinu = SkillCreater(
    "xjb_shinu", {
    translate: "狮怒",
    description: "",
    equipSkill: true,
    trigger: {
        player: "damageBegin2",
    },
    filter(event, player) {
        return event.source;
    },
    content() {
        'step 0'
        trigger.source.damage(trigger.num);
        'step 1'
        if (player.hp <= trigger.num) {
            trigger.cancel();
            var s = player.getCards('e', { subtype: 'equip2' });
            player.lose(s, ui.cardPile);
        }
    },
});

const xjb_htzjq = SkillCreater(
    "xjb_htzjq", {
    equipSkill: true,
    transalte: "铁骑",
    description: "当你使用【杀】指定一名角色为目标后，你令其选择失去一点体力/体力上限。",
    trigger: {
        player: "useCardToPlayered",
    },
    check: function (event, player) {
        return get.attitude(player, event.target) <= 0;
    },
    filter: function (event, player) {
        return event.card.name == 'sha';
    },
    logTarget: "target",
    content: function () {
        trigger.target.xjb_chooseLoseHpMaxHp(true)
    },
    ai: {
        shaRelated: true,
        ignoreSkill: true,
    },
    "_priority": 0,
})