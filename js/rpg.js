import { _status, lib, game, ui, get, ai } from "../../../noname.js";
game.xjb_getPlayersWithoutMe = function () {
    return [...game.players, ...game.dead].filter(i => i !== game.me);
}
//control players
game.xjb_PlayAddPlayer = function () {
    const allPlayers = [...game.players, ...game.dead];
    const player = ui.create.player(ui.arena).addTempClass('start');
    player.dataset.position = allPlayers.length;
    player.getId();
    game.players.push(player);
    game.arrangePlayers();
    ui.arena.setNumber(Math.min(allPlayers.length + 1, 10))
    return player;
}
game.xjb_PlayAddPlayersTo = function (number) {
    const allPlayers = [...game.players, ...game.dead];
    while (allPlayers.length < number) {
        let player = game.xjb_PlayAddPlayer();
        allPlayers.push(player);
    }
}
game.xjb_PlayAdjustPlayersTo = function (number, nameList, identityList) {
    if (number < 1) return void 0;
    let allPlayers = game.xjb_getPlayersWithoutMe();
    if (allPlayers.length + 1 < number) game.xjb_PlayAddPlayersTo(number);
    while (allPlayers.length + 1 > number) {
        allPlayers.pop().remove();
    }
    ui.arena.setNumber(Math.min(number, 10));
    allPlayers = game.xjb_getPlayersWithoutMe();
    if (nameList) {
        if (typeof nameList === "function") nameList = nameList();
        allPlayers.forEach((player, i) => {
            player.init(nameList[i])
        })
    }
    if (identityList) allPlayers.forEach((player, i) => {
        player.identity = identityList[i];
        player.showIdentity();
    })
}
class Play {
    dialog = {}
    constructor({
        start = [],
        end = [],
        information = {},
        leadFn = () => { },
        leadDialog,
        skillFree = false,
        playersLength = 8,
        globalSkills = [],
        playersHook = () => { },
        playerNameList,
        playerIdentityList
    } = {}) {
        this.dialog = { start, end };
        this.information = information;
        this.leadDialog = leadDialog;
        this.leadFn = leadFn;
        this.playersLength = playersLength;
        this.playerIdentityList = playerIdentityList;
        this.playerNameList = playerNameList;
        this.skillFree = skillFree;
        this.playersHook = playersHook;
        this.globalSkills = globalSkills;
    }
    init(player) {
        //设置关卡信息
        const _this = this;
        _status.xjb_level = { ...this.information };
        game.xjb_PlayAdjustPlayersTo(this.playersLength, this.playerNameList, this.playerIdentityList);
        [...game.xjb_getPlayersWithoutMe(), game.me].forEach(current => {
            if (_this.skillFree) {
                current.xjb_clearSkills();
            }
            _this.playersHook(current);
        })
        _this.globalSkills.forEach(skill => {
            game.addGlobalSkill(skill);
        });
        //如果有前置剧情，则处理前置剧情，把登场函数设置为最后的函数
        if (this.dialog.start.length) {
            this.dialog.start.map(play => {
                game.xjb_dialog(play);
                return true;
            })
            game.xjb_RPGEventAdd(i => {
                if (!player.isPhaseUsing) game.phaseLoop(player);
                game.resume();
                this.gameInit(player);
            })
        }
        //没有前置剧情直接进行gameInit
        else {
            if (!player.isPhaseUsing) game.phaseLoop(player);
            game.resume();
            this.gameInit(player);
        }
    }
    async gameInit(player) {
        const { leadDialog, leadFn } = this;
        if (leadDialog) {
            const next = game.createEvent("xjb_rpgModeBefore");
            next.setContent(async function (event, trigger, player) {
                await new Promise((res) => {
                    let dialogU = () => {
                        if (!leadDialog.length) {
                            document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', dialogU);
                            res();
                            return;
                        }
                        let lead = leadDialog.shift();
                        let dialog = ui.create.dialog();
                        dialog.add(lead);
                    }
                    document.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', dialogU);
                })
            })
        }
        if (leadFn) {
            const next = game.createEvent("xjb_rpgModeStart");
            next.player = player;
            next.setContent(leadFn);
        }
    }
}
// let LH = lib.xjb_src + lib.config.xjb_newcharacter.selectedSkin.slice(8)
// let LHName = lib.config.xjb_newcharacter.name2 || ''
// let azureSky = lib.xjb_src + "position/azureSky.jpg"
// let lake = lib.xjb_src + "position/lake.jpg"
lib.skill.xjb_theLevel = {
    theLevel: {
        //普通读档
        "0000": new Play({
            information: {
                name: lib.config.mode,
                number: "0000",
                Type: "normal"
            }
        }),
        //灵力教程
        Lingli0001: new Play({
            information: {
                name: "灵力教程",
                number: "Lingli0001",
                Type: "Play",
            },
            cards: 7,
            playersLength: 5,
            playerIdentityList: ['fan', 'fan', 'fan', 'fan'],
            playerNameList: ['xin_fellow', "xin_fellow", 'xin_fellow', 'xin_fellow'],
            skillFree: true,
            showIdentity: true,
            leadDialog: [
                "欢迎来到灵力教程关卡！",
                "在本关卡中，你将学会如何使用灵力。",
                "事不宜迟，让我们开始吧！",
                // "首先要提出的就是灵力和魔力的关系",
                // "每个单位的灵力中含有创造一张卡牌的能量",
                // "请注意，这里指的卡牌范围很广，包括：",
                // "武将牌、身份牌、体力牌,当然也包括通常讲的牌",
                // "与之相反的是，有一种魔力每个单位中含有销毁一张牌的能量",
                // '为什么说"有一种"？因为还有一种魔力不带能量。',
                // '带有能量的魔力也被称为"动魔子",而不带有能量的魔力也被称为"静魔子"',
                // "灵力和魔力的单位都是Ch，它们之间可以相互转化。",
                // "不难想到，当1Ch灵力→1Ch静魔子时，会创造一张牌。",
                // "而当1Ch动魔子→1Ch灵力时，会销毁两张牌。",
                // "销毁两张卡牌等效于一点体力(上限)减少,创造两张卡牌等效于一点体力(上限)增加",
                // "现在，就获得灵力看看吧！"
            ],
            leadFn() {
                // "step 0"
                // player.chooseControl("获得灵力").set("prompt", "请点击获得灵力")
                // "step 1"
                // player.addMark("_xjb_lingli", 10)
                // player.update()
                // "step 2"
                // player.chooseControl("获得静魔子").set("prompt", "很棒！现在来试试获取魔力吧！")
                // "step 3"
                // player.addMark("_xjb_moli", 10)
                // player.update()
                // "step 4"
                // player.chooseControl("转化").set("prompt", "还记得1Ch灵力→1Ch静魔子总收益等于创造一张卡牌吗，点击试一下吧！")
                // "step 5"
                // player.xjb_molizeLingli()
                // "step 6"
                // player.chooseControl("继续").set("prompt", "记得1Ch动魔子→1Ch灵力负收益等于销毁两张牌吗，这就是通过导魔介质实现的！")
                // "step 7"
                // player.chooseControl("继续").set("prompt", "一对导魔介质可以在你和另一名角色间进行1Ch魔力的传导。")
                // "step 8"
                // player.chooseControl("继续").set("prompt", "灵力高的那一方的魔力会传导至灵力低的那一方，转化成灵力。")
                // "step 9"
                // player.chooseControl("导魔").set("prompt", "你现在拥有10点灵力，是灵力最多的角色！魔力无论如何都会打在对方身上，来试试吧！")
                // "step 10"
                // player.chooseTarget(true, [1, 1], "选择你要导魔的角色").set("filterTarget", lib.filter.notMe)
                // "step 11"
                // game.xjb_getDaomo(player, "blood", 5)
                // player.xjb_chooseToBuildBridge(result.targets[0])
                // event.target = result.targets[0]
                // "step 12"
                // if (event.target.isAlive()) event.goto(11)
                // "step 13"
                // player.chooseControl("继续").set("prompt", "做的漂亮！")
                // "step 14"
                // player.chooseControl("继续").set("prompt", "相信你已经注意到了，一名角色死亡后，其灵力和魔力会被当前回合角色获得。")
                // game.players.filter(current => current != player).forEach(current => {
                //     current.addSkill("xjb_P_gathering")
                //     current.xjb_addZhenFa(get.cards(1))
                // })
                // "step 15"
                // player.chooseControl("聚灵区是什么？", "阵法是什么？", "我已知道这两者了。").set("prompt", "哦，不妙！他们进入了聚灵区，而且阵法中多出了一张牌！")
                // "step 16"
                // if (result.control === "聚灵区是什么？") {
                //     player.chooseControl("我知道了").set("prompt", "在一个环境中，能够容纳的灵力是有限的，超过了这个限度，灵力便一定会转化为魔力。<br>在一般的环境中，最多可以容纳10点灵力，而在聚灵区中，最多可容纳100点灵力！")
                //     event.goto(15)
                // } else if (result.control === "阵法是什么？") {
                //     player.chooseControl("我知道了").set("prompt", "阵法是一个特殊的区域，你可以利用启灵等方法把卡牌置于阵法区，就会获得灵力，获得的灵力是不确定的。")
                //     event.goto(15)
                // } else {
                //     player.chooseControl("继续").set("prompt", "很好！")
                // }
                // "step 17"
                // player.chooseControl("启灵").set("prompt", "刚刚提到过启灵，现在就来试试吧！")
                // "step 18"
                // player.chooseCard("he", true)
                // "step 19"
                // player.xjb_addZhenFa(result.cards)
                // "step 20"
                // player.chooseControl("继续").set("prompt", "好了，灵力基本教程就结束了，现在开始战斗吧！")
                // "step 21"
                // player.clearSkills()
                player.storage.xjb_tempAllowUseLingli = true
            },
        }),
        //guessNumber
        guessNumber: new Play({
            information: {
                name: "猜数字",
                number: "guessNumber",
                Type: "Play",
            },
            playersLength: 10,
            playerIdentityList: ['fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan', 'fan'],
            playerNameList: () => {
                return lib.xjb_characterList.randomGets(9)
            },
            skillFree: true,
            globalSkills: [
                'xjb_phaseReplaceGuessNumber'
            ],
            playersHook: current => {
                current.maxHp = current.hp = Infinity;
                current.update();
            },
            leadFn() {
                "step 0"
                if (!game.xjb_condition('hunbi', 20)) event.goto(3)
                else {
                    player.chooseControl('下注', '不下注').set('prompt', '是否下注');
                }
                "step 1"
                if (result.control == '下注') {
                    const List = ['取消']
                    if (game.xjb_condition('hunbi', 20)) List.push('20');
                    if (game.xjb_condition('hunbi', 40)) List.push('40');
                    if (game.xjb_condition('hunbi', 60)) List.push('60');
                    if (game.xjb_condition('hunbi', 80)) List.push('80');
                    if (game.xjb_condition('hunbi', 100)) List.push('100');
                    player.chooseControl(...List).set('prompt', '选择下注的魂币数');
                } else {
                    event.goto(3)
                }
                "step 2"
                if (result.control == "取消") event.goto(3);
                else {
                    _status.xjb_level.xjb_chip = Number(result.control);
                    game.xjb_costHunbi(_status.xjb_level.xjb_chip, '下注')
                }
                "step 3"
                player.chooseControl('确定').set('prompt', '<h5>游戏规则</h5>10人猜测数字,猜中者出局,其余玩家进入下一局,直到场上仅剩3人!');
                "step 4"
                _status.xjb_level.guessNumber = Math.floor(Math.random() * 1000)
                _status.xjb_level.min = 0;
                _status.xjb_level.max = 999;
            }
        })
    },
}

lib.skill.xjb_8 = {
    leadVitalSkill: function () {
        lib.skill._xjb_TryYourBest = {
            direct: true,
            trigger: {
                global: "gameStart",
            },
            filter: function (event, player) {
                if (!_status.brawl) return false
                if (!_status.brawl.scene) return false
                if (player != game.me) return false
                if (_status.brawl.scene.name === "xjb_tyb") {
                    _status.xjb_level.Type = "Play"
                    return true
                }
            },
            async content() {
                "step 0"
                //部分全局技能禁用
                ["_xjb_cardStore", "_xjb_soul_qiling",
                "_xjb_bianshen", "_xjb_soul_daomo",
                "_xjb_skillsNumberLimitation", "_xjb_maxHpLimitation"].forEach(skill => {
                    game.removeGlobalSkill(skill)
                });
                "step 1"
                player.chooseButton([
                    "选择你的关卡吧！",
                    [["教程篇", "游戏", "读档"], "tdnodes"],
                    "教程篇:在这里你将了解一些教程",
                ], [0, 1], true);
                "step 2"
                if (result.links.length === 0) event.goto(1)
                else {
                    let button
                    switch (result.links[0]) {
                        case "教程篇": {
                            button = [
                                "你要看看什么教程呢？",
                                [["灵力"], "tdnodes"]
                            ];
                            player.chooseButton(true, button, 1);
                        }; break;
                        case "读档": {
                            player.xjb_readStorage(true);
                        }; break;
                        case "游戏": {
                            button = [
                                "你要玩什么游戏呢？",
                                [["猜数字"], "tdnodes"]
                            ];
                            player.chooseButton(true, button, 1);
                        }; break;
                    }
                };
                "step 3"
                if (result.links) {
                    result.links[0] === "灵力" && game.xjb_bossLoad("Lingli0001", player);
                    result.links[0] === "猜数字" && game.xjb_bossLoad("guessNumber", player);
                }
            }
        }
    },
    Start: function () {
        if (lib.config.xjb_yangcheng !== 1 || !lib.config.xjb_hun) return
        if (lib.config.mode === "brawl") {
            if (!lib.storage.scene) lib.storage.scene = {};
            lib.storage.scene["试练模式"] = {
                name: "xjb_tyb",
                intro: "来挑战自己吧！",
                players: [{
                    name: "xjb_newCharacter",
                    "name2": "none",
                    "identity": "zhu",
                    "position": 1,
                    "linked": false,
                    "turnedover": false,
                    "playercontrol": true,
                    "handcards": [],
                    "equips": [],
                    "judges": []
                }, {
                    name: "xin_fellow",
                    "name2": "none",
                    "identity": "fan",
                    "position": 2,
                    "linked": false,
                    "turnedover": false,
                    "playercontrol": false,
                    "handcards": [],
                    "equips": [],
                    "judges": []
                }],
                cardPileTop: [],
                cardPileBottom: [],
                discardPile: [],
            }
        }
    },
}
