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
                    name: "xjb_rider",
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
