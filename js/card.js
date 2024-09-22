import { clearBad } from "./card/clearBad.js";
import { clearBadTranslate } from "./card/clearBad.js";
import { soulStoreCard, soulStoreCardTranslate } from "./card/store.js";
import { callFellow, callFellowCardSkill, callFellowTranslate } from "./card/callFellow.js"
window.XJB_LOAD_CARD = function (_status, lib, game, ui, get, ai) {
    game.import("card", function () {
        lib.config.all.cards.push("xjb_jizhuoyangqing");
        return {
            name: "xjb_jizhuoyangqing",
            connect: false,
            card: {
                ...clearBad
            },
            skill: {},
            translate: {
                "xjb_jizhuoyangqing_card_config": "激浊扬清",
                ...clearBadTranslate
            }
        };
    });
    game.import("card", function () {
        lib.config.all.cards.push("xjb_hunbiStore");
        lib.config.cards.push("xjb_hunbiStore");
        return {
            name: "xjb_hunbiStore",
            connect: false,
            card: {
                ...soulStoreCard
            },
            skill: {},
            translate: {
                "xjb_hunbiStore_card_config": "魂市",
                xjb_unique: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="24">',
                xjb_unique_SanSkill: "🐉神圣技能🐉",
                xjb_unique_talent: "💡天赋卡💡",
                xjb_unique_money: "💎货币卡💎",
                xjb_unique_reusable: "♻️循环卡♻️",
                ...soulStoreCardTranslate
            },
        };
    });
    game.import("card", function () {
        lib.config.all.cards.push("xjb_callFellow");
        lib.config.cards.push("xjb_callFellow");
        return {
            name: "xjb_callFellow",
            connect: false,
            card: {
                ...callFellow
            },
            skill: {
                ...callFellowCardSkill
            },
            translate: {
                "xjb_callFellow_card_config": "魂将",
                ...callFellowTranslate,
            }
        };
    })
    lib.skill.xjb_4 = {
        XJBCard: function () {
            if (lib.config.cards.includes("xjb_jizhuoyangqing")) {
                lib.inpile.push(...lib.cardPack["xjb_jizhuoyangqing"])
                lib.cardPack["xjb_jizhuoyangqing"].forEach(i => {
                    lib.translate[i + "_info"] += `<br><a onclick="location.hash='#xjb_card${i}'">※点此将该牌加入牌堆</a>`
                })
            }
        },
        CardFunction: function () {
            get.xjb_enFromCn = function (cn) {
                return Object.entries(lib.translate).find(item => {
                    return item[1] === cn
                })[0]
            }
            //创建卡牌并返回数组
            game.xjb_cardFactory = function () {
                var cards = []
                for (var i = 0; i < arguments.length; i++) {
                    let card = lib.card[arguments[i][0]] && game.createCard2(...arguments[i])
                    card.storage = arguments[i][5]
                    card.gaintag = arguments[i][4]
                    cards.push(card)
                }
                return cards
            };
            //检测卡牌是否可被添加
            game.xjb_checkCardCanAdd = function (cardName) {
                return lib.inpile.includes(cardName)
            };
            //
            game.xjb_cardAddToCardPile = function (card) {
                let Acard = card
                if (get.itemtype(card) !== "card") {
                    Acard = game.createCard2(...card);
                }
                let cardPileItems = ui.cardPile.children;
                let randomIndex = Math.floor(Math.random() * (cardPileItems.length + 1));
                ui.cardPile.insertBefore(Acard, cardPileItems[randomIndex]);
            };

            //获取可以加入牌堆的牌的信息
            game.xjb_getCardToAdd = function (step) {
                const firstList = Object.entries(lib.config.xjb_cardAddToPile).filter(i => i[1] !== "0");
                if (step == 1) return firstList;
                const secondList = firstList.map(i => i.join("-"));
                if (step == 2) return secondList;
                const thirdList = secondList.map(i => i.split("-"))
                if (step == 3) return thirdList;
                const fourthList = thirdList.map(i => {
                    return [get.xjb_enFromCn(i[0]), get.xjb_enFromCn(i[1]).slice(0, -1), i[2] * 1, i[3] * 1]
                })
                if (step == 4) return fourthList;
                const fifthList = fourthList.filter(i => game.xjb_checkCardCanAdd(i[0]));
                return fifthList;
            }
        },
        CardStore: function () {
            game.xjb_storeCard = [
                "xjb_shenshapo",
                "xjb_skill_off_card",
                "xjb_zhihuan",
                "xjb_penglai",
                "xjb_skillCard",
                "xjb_tianming_huobi2",
                "xjb_tianming_huobi1",
                "xjb_seizeHpCard",
                "xjb_lingliCheck"
            ]
            class CardCreator {
                constructor(num1 = 1, num2 = 1, num3 = 1, arr1, arr2) {
                    this.content = {
                        fivePoint: num1,
                        minCost: num2,
                        energyNeed: num3,
                    }
                    this.arr1 = arr1
                    this.arr2 = arr2
                }
                get ok() {
                    return lib.config.xjb_systemEnergy >= this.content.energyNeed;
                }
                get cost() {
                    this.update();
                    if (lib.translate[this.cardName]) lib.translate[this.cardName + "_info"] = this.description + "</br>价格:" + this.content.cost;
                    return this.content.cost;
                }
                update() {
                    if (lib.config.xjb_systemEnergy < this.content.fivePoint) {
                        let Num1 = this.content.fivePoint - lib.config.xjb_systemEnergy
                        this.content.cost = (Math.floor(Num1 / this.arr1[0]) * (this.arr1[1])) + 5
                    } else if (lib.config.xjb_systemEnergy > this.content.fivePoint) {
                        let Num2 = lib.config.xjb_systemEnergy - this.content.fivePoint
                        this.content.cost = (-(Math.floor(Num2 / this.arr2[0]) * (this.arr2[1]))) + 5
                    } else {
                        this.content.cost = 5
                    }
                    this.content.cost = Math.round(this.content.cost * game.xjb_inflationRate())
                    if (this.content.cost < this.content.minCost) this.content.cost = this.content.minCost
                }
                setName(cardName) {
                    this.cardName = cardName
                    this.description = lib.translate[cardName + "_info"]
                    return this
                }
            }
            game.xjb_storeCard_information = {
                xjb_skill_off_card: new CardCreator(580, 0, 25, [500, 1], [600, 1]).setName("xjb_skill_off_card"),
                xjb_zhihuan: new CardCreator(150, 1, 53, [5, 1], [8, 1]).setName("xjb_zhihuan"),
                xjb_penglai: new CardCreator(1230, 2, 90, [56, 1], [70, 1]).setName("xjb_penglai"),
                xjb_skillCard: new CardCreator(1460, 2, 85, [56, 1], [100, 1]).setName("xjb_skillCard"),
                xjb_tianming_huobi2: new CardCreator(9842, 0, 500, [24, 1], [26, 1]).setName("xjb_tianming_huobi2"),
                xjb_tianming_huobi1: new CardCreator(1142, 0, 70, [84, 1], [96, 1]).setName("xjb_tianming_huobi1"),
                xjb_shenshapo: new CardCreator(980, 1, 50, [254, 2], [220, 1]).setName("xjb_shenshapo"),
                xjb_seizeHpCard: new CardCreator(3000, 4, 150, [61, 1], [10, 1]).setName("xjb_seizeHpCard"),
                xjb_BScharacter: new CardCreator(10000, 8, 109, [1905, 1], [2300, 1]),
                xjb_lingliCheck: new CardCreator(23000, 4, 1300, [2500, 1], [1500, 1]).setName("xjb_lingliCheck")
            }
            lib.skill._xjb_cardStore = {
                enable: ["chooseToUse"],
                filter: function (event, player) {
                    if (!lib.config.xjb_hun || !lib.config.xjb_cardStore) return false
                    if (!(player == game.me || player.isUnderControl())) return false
                    if (event.type != 'dying' && event.parent.name != 'phaseUse') return false
                    if (lib.config.xjb_systemEnergy < 0) return false
                    let list = []
                    game.xjb_storeCard.forEach(function (item, index) {
                        const _this = game.xjb_storeCard_information[item];
                        if (!_this) return;
                        if (!_this.cost || !_this.ok) return;
                        if (!game.xjb_condition(1, _this.cost)) return;
                        list.push(item);
                    })
                    if (!list.length) return false
                    return true
                },
                content: function () {
                    "step 0"
                    let list = []
                    game.xjb_storeCard.forEach(function (item, index) {
                        const _this = game.xjb_storeCard_information[item];
                        if (!_this) return;
                        if (!_this.cost || !_this.ok) return;
                        if (!game.xjb_condition(1, _this.cost)) return;
                        list.push(["", "<font color=white>" + _this.cost + "魂币", item])
                    })
                    if (list.length) {
                        let dialog = ui.create.dialog("新将包魂市", [list, "vcard"])
                        player.chooseButton(dialog)
                    }
                    "step 1"
                    if (result.bool) {
                        const cardName = result.links[0][2];
                        const information = game.xjb_storeCard_information[cardName];
                        let card = game.createCard(cardName, "", 1)
                        player.gain(card, "draw")
                        card.storage.xjb_allowed = true;
                        card.dataset.cost = information.cost;
                        game.cost_xjb_cost(1, information.cost, '在商店中购买');
                        game.xjb_systemEnergyChange(-information.content.energyNeed);
                    }
                },
                ai: {
                    save: true
                }
            }
            //天赋卡判定原理
            lib.skill._unique_talent_xjb = {
                trigger: {
                    global: "roundStart",
                },
                load: [],
                direct: true,
                async content(event, trigger, player) {
                    const loads = get.info(event.name).load
                    for (const load of loads) {
                        load();
                    }
                    const storage = player.storage.xjb_unique_talent;
                    if (storage && storage.length) {
                        for (const info of storage) {
                            const endRound = info[0];
                            const skill = info[1];
                            if (endRound === game.roundNumber) {
                                player.removeSkill(skill)
                                player.update()
                            }
                        }
                    }
                }
            }
            lib.translate._xjb_cardStore = "魂市"
            lib.cardType['xjb_unique'] = 0.5
            lib.cardType['xjb_unique_skill'] = 0.35
            lib.cardType['xjb_unique_talent'] = 0.4
            lib.cardType['xjb_unique_reusable'] = 0.45
            lib.cardType['xjb_unique_money'] = 0.46
        },
        CardSkills: function () {
            //蓬莱卡
            lib.skill.xjb_penglai = {
                init: function (player, skill) {
                    if (!player.storage.xjb_card_allow['xjb_penglai']) return
                    player.storage[skill] = player.maxHp
                    game.log(player, '忽闻海外有仙山，上联青云九霄天，下通沟壑九幽界。隐隐云窈窕，我得神皇药。');
                    player.maxHp = player.hasSkill("xjb_minglou") || Infinity;
                    player.hp = player.hasSkill("xjb_minglou") || Infinity;
                },
                onremove: function (player, skill) {
                    var maxHp = player.storage[skill] || 3
                    player.maxHp = maxHp
                    if (player.storage.xjb_card_allow['xjb_penglai']) {
                        player.storage.xjb_card_allow['xjb_penglai'] = false
                    }
                    const benben = {
                        disableSkill: lib.element.player.disableSkill,
                        enableSkill: lib.element.player.enableSkill,
                        awakenSkill: lib.element.player.awakenSkill,
                        restoreSkill: lib.element.player.restoreSkill,
                    }
                    for (let k in benben) {
                        player[k] = benben[k]
                    }
                },
            }
        },
    }
}