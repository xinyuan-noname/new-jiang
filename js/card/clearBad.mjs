import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
export const clearBad = {};
export const clearBadTranslate = {};
function CardCreater(name, card) {
    clearBad[name] = { ...card }
    clearBad[name].image = "ext:新将包/image/card_clearBad/" + name + ".png";
    delete clearBad[name].translate;
    delete clearBad[name].description;
    clearBadTranslate[name] = card.translate;
    clearBadTranslate[name + "_info"] = card.description
    return clearBad[name];
};
const xjb_zhuqiang = CardCreater(
    "xjb_zhuqiang", {
    translate: "筑墙",
    description: "此牌可被重铸。出牌阶段，对你自己使用，你获得一点护甲值。",
    selectTarget: -1,
    toself: true,
    enable: true,
    type: "trick",
    fullskin: true,
    recastable: true,
    filterTarget: function (card, player, target) {
        return player === target;
    },
    content: function () {
        player.changeHujia(1, "gain", true);
    },
    ai: {
        basic: {
            order: 1,
            useful: 2,
            value: 8,
        },
        result: {
            target: (player, target) => {
                if (player.hujia < 5) return 3;
            },
        },
    },
})
const xjb_lijingtuzhi = CardCreater(
    "xjb_lijingtuzhi", {
    fullskin: true,
    type: "delay",
    filterTarget: function (card, player, target) {
        return (lib.filter.judge(card, player, target)) && player === target;
    },
    judge: function (card) {
        if (get.suit(card) != 'heart') return 1;
        return -2;
    },
    effect: function () {
        if (result.bool == true) {
            let evt1 = _status.event.getParent("phase")
            if (evt1.phaseList) {
                evt1.phaseList.splice(evt1.num + 1, 0, "phaseUse|xjb_lijingtuzhi")
            } else {
                let evt2 = _status.event.getParent("phaseJudge")
                let next = player.phaseUse()
                _status.event.next.remove(next);
                evt2.next.push(next)
            }
        }
    },
    translate: "励精图治",
    description: "出牌阶段,对你使用。若判定结果不为红桃,你于该判定阶段后执行一个额外的出牌阶段。",
    ai: {
        basic: {
            order: 1,
            useful: 2,
            value: 8,
        },
        result: {
            target: (player, target) => {
                return 2;
            },
        },
        tag: {
            add: "phaseUse",
        },
    },
    selectTarget: -1,
    toself: true,
    enable: true,
    content: function () {
        if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
    },
    allowMultiple: false,
})
const xjb_xiugengxuzi = CardCreater(
    "xjb_xiugengxuzi", {
    image: "ext:新将包/image/card/xjb_xiugengxuzi.png",
    fullskin: true,
    type: "delay",
    filterTarget: function (card, player, target) {
        return (lib.filter.judge(card, player, target));
    },
    judge: function (card) {
        if (get.suit(card) != 'club') return 1;
        return -2;
    },
    "judge2": function (result) {
        if (result.bool == true) return true;
        return false;
    },
    effect: function () {
        if (result.bool == true) {
            let evt1 = _status.event.getParent("phase")
            if (evt1.phaseList) {
                evt1.phaseList.splice(evt1.num + 1, 0, "phaseDraw|xjb_xiugengxuzi")
            } else {
                let evt2 = _status.event.getParent("phaseJudge")
                let next = player.phaseDraw()
                _status.event.next.remove(next);
                evt2.next.push(next)
            }
        }
    },
    translate: "修耕蓄资",
    description: "出牌阶段,对一名角色使用。若判定结果不为梅花,你于该判定阶段后执行一个额外的摸牌阶段。",
    ai: {
        basic: {
            order: 1,
            useful: 2,
            value: 8,
        },
        result: {
            target: (player, target) => {
                return 2;
            },
        },
        tag: {
            add: "phaseDraw",
        },
    },
    selectTarget: 1,
    enable: true,
    content: function () {
        if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
    },
    allowMultiple: false,
})
const xjb_chucanquhui = CardCreater(
    "xjb_chucanquhui", {
    fullskin: true,
    type: "trick",
    filterTarget: function (card, player, target) {
        return player !== target && target.countCards("h") > 0;
    },
    content: function () {
        "step 0"
        player.chooseCard("h", { color: "red" }, [0, 1], true).set("ai", function (card) {
            return get.number(card) - get.value(card)
        });
        "step 1"
        event.playerCard = result.cards[0];
        target.chooseCard("h", { color: "black" }, [0, 1], true).set("ai", function (card) {
            return get.number(card) - get.value(card)
        });;
        "step 2"
        event.targetCard = result.cards[0]
        "step 3"
        player.discard(event.playerCard);
        target.discard(event.targetCard);
        if (!event.playerCard) {
            player.damage(target)
            event.finish();
        }
        if (!event.targetCard) {
            target.damage(player)
            event.finish();
        }
        "step 4"
        let num1 = get.number(event.playerCard, player), num2 = get.number(event.targetCard, target)
        if (num1 > num2) target.damage(player);
        if (num1 < num2) player.damage(target)
    },
    selectTarget: 1,
    enable: true,
    translate: "除残去秽",
    description: "出牌阶段，对一名有手牌的其他角色使用。你/该角色可以弃置一张红色手牌/黑色手牌，未弃置牌和弃置牌点数较小的角色各受到对方造成的一点伤害。",
    ai: {
        basic: {
            order: 5,
            useful: 2,
            value: 6,
        },
        result: {
            target: -1,
        },
        tag: {
            damage: 1,
        },
    },
})
const xjb_qimendunjia = CardCreater(
    "xjb_qimendunjia", {
    type: "trick",
    enable: function (event, player) {
        return true;
    },
    filterTarget: true,
    selectTarget: -1,
    multitarget: true,
    multiline: true,
    content: function () {
        'step 0'
        const lose_list = [];
        const type = [];
        for (const cur of targets) {
            const card = cur.getCards('hej').randomGet()
            if (card) {
                lose_list.push([cur, [card]])
                type.push(get.color(card))
            } else {
                type.push('none')
            }
        }
        game.loseAsync({
            lose_list: lose_list
        }).setContent("chooseToCompareLose");
        event.type = type;
        'step 1'
        event.type.forEach((color, i) => {
            if (color !== 'red') targets[i].getDebuff();
            if (color !== 'black') targets[i].getBuff();
            game.delay(0.5);
        })
    },
    ai: {
        basic: {
            order: 1,
            useful: 2,
            value: 8,
        },
        result: {
            target(player, target) {
                const rs = target.countCards('hej', { color: "red" });
                const bs = target.countCards('hej', { color: "black" });
                if (rs > bs) return -2;
                else return 0;
            },
        },
        tag: {
            add: "phaseDraw",
        },
    },
    fullskin: true,
    translate: '奇门遁甲',
    description: '出牌阶段，对所有角色使用。所有角色同时随机将区域内的一张牌置入弃牌堆。未失去红色牌的角色获得一个负面效果;未失去黑色牌的角色获得一个正面效果。'
})
const xjb_tianqian = CardCreater(
    "xjb_tianqian", {
    fullskin: true,
    type: "delay",
    selectTarget: 1,
    enable: true,
    filterTarget: function (card, player, target) {
        return (lib.filter.judge(card, player, target));
    },
    judge: function (card) {
        if (get.color(card) == 'black') return -10;
        return 1;
    },
    "judge2": function (result) {
        if (result.bool == false) return true;
        return false;
    },
    effect: function () {
        'step 0'
        if (!player.storage.xjb_judge_tianqian) player.storage.xjb_judge_tianqian = 0;
        player.storage.xjb_judge_tianqian++;
        player.popup('雷劫层数:</br>' + player.storage.xjb_judge_tianqian);
        event.bool = result.bool
        game.delay(1.5)
        'step 1'
        if (event.bool == false) {
            const hes = player.getCards('he');
            player.loseToDiscardpile(hes);
            for (const destory of hes) {
                destory.fix();
                destory.remove();
                destory.destoryed = true;
                game.log(destory, '被销毁了')
            }
            player.changeHujia(player.hujia);
            player.damage(player.storage.xjb_judge_tianqian, 'nosource', 'damage');
        } else {
            player.addJudge(card, cards);
        }
    },
    cancel: function () {
        player.addJudge(card, cards);
    },
    translate: "天谴",
    description: "出牌阶段，对一名角色使用。判定结果生效时，其雷劫层数+1。若判定结果为黑色，销毁目标角色所有牌并失去所有护甲，然后令其受到x点雷电伤害（x为其雷劫层数）；否则，将此牌再次置入其判定区。",
    ai: {
        basic: {
            order: 1,
            useful: 2,
            value: 8,
        },
        result: {
            target: (player, target) => {
                return -10;
            },
        },
    },
    content: function () {
        if (lib.filter.judge(card, player, target) && cards.length && get.position(cards[0], true) == 'o') target.addJudge(card, cards);
    },
    allowMultiple: false,
})

export const clearBadSettingList = {
    xjb_lijingtuzhi_1: {
        counterpart: "励精图治-红桃-7",
        min: 0,
        max: 3,
    },
    xjb_lijingtuzhi_2: {
        counterpart: "励精图治-黑桃-7",
        min: 0,
        max: 3,
    },
    xjb_lijingtuzhi_3: {
        counterpart: "励精图治-梅花-7",
        min: 0,
        max: 3,
    },
    xjb_xiugengxuzi_1: {
        counterpart: "修耕蓄资-黑桃-3",
        min: 0,
        max: 2,
    },
    xjb_xiugengxuzi_2: {
        counterpart: "修耕蓄资-梅花-9",
        min: 0,
        max: 2,
    },
    xjb_chucanquhui_1: {
        counterpart: "除残去秽-方片-9",
        min: 0,
        max: 5,
    },
    xjb_chucanquhui_2: {
        counterpart: "除残去秽-方片-5",
        min: 0,
        max: 5,
    },
    xjb_qimendunjia_1: {
        counterpart: "奇门遁甲-红桃-8",
        min: 0,
        max: 2
    },
    xjb_qimendunjia_2: {
        counterpart: "奇门遁甲-黑桃-8",
        min: 0,
        max: 2
    },
    xjb_qimendunjia_3: {
        counterpart: "奇门遁甲-梅花-8",
        min: 0,
        max: 2
    },
    xjb_qimendunjia_4: {
        counterpart: "奇门遁甲-方片-8",
        min: 0,
        max: 2
    },
    xjb_tianqian_1: {
        counterpart: "天谴-黑桃-9",
        min: 0,
        max: 1
    },
    xjb_zhuqiang_1: {
        counterpart: "筑墙-黑桃-3",
        min: 0,
        max: 2
    },
    xjb_zhuqiang_2: {
        counterpart: "筑墙-黑桃-4",
        min: 0,
        max: 1
    },
    xjb_zhuqiang_4: {
        counterpart: "筑墙-黑桃-6",
        min: 0,
        max: 2
    },
    xjb_zhuqiang_6: {
        counterpart: "筑墙-黑桃-8",
        min: 0,
        max: 3
    },
    xjb_zhuqiang_11: {
        counterpart: "筑墙-梅花-12",
        min: 0,
        max: 4
    },
}