window.XJB_LOAD_RPG = function (_status, lib, game, ui, get, ai) {
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
                content: function () {
                    "step 0"
                    //部分全局技能禁用
                    ["_xjb_cardStore", "_xjb_soul_qiling", "_xjb_bianshen", "_xjb_soul_daomo"].forEach(skill => {
                        game.removeGlobalSkill(skill)
                    })
                    "step 1"
                    player.chooseButton([
                        "选择你的关卡吧！",
                        [["教程篇", "读档"], "tdnodes"],
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
                        }
                    };
                    "step 3"
                    if (result.links) {
                        result.links[0] === "灵力" && game.xjb_bossLoad("Lingli0001", player);
                    }
                }
            }

        },
        Start: function () {
            if (lib.config.xjb_yangcheng !== 1 || !lib.config.xjb_hun) return
            if (lib.config.mode === "brawl") {
                if (!lib.storage.scene) lib.storage.scene = {};
                if (true) {
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
                        }, {
                            name: "xin_fellow",
                            "name2": "none",
                            "identity": "fan",
                            "position": 3,
                            "linked": false,
                            "turnedover": false,
                            "playercontrol": false,
                            "handcards": [],
                            "equips": [],
                            "judges": []
                        }, {
                            name: "xin_fellow",
                            "name2": "none",
                            "identity": "fan",
                            "position": 4,
                            "linked": false,
                            "turnedover": false,
                            "playercontrol": false,
                            "handcards": [],
                            "equips": [],
                            "judges": []
                        }, {
                            name: "xin_fellow",
                            "name2": "none",
                            "identity": "fan",
                            "position": 5,
                            "linked": false,
                            "turnedover": false,
                            "playercontrol": false,
                            "handcards": [],
                            "equips": [],
                            "judges": []
                        }, {
                            name: "xin_fellow",
                            "name2": "none",
                            "identity": "fan",
                            "position": 6,
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
            }
        },
        level: function () {
            let LH = lib.xjb_src + lib.config.xjb_newcharacter.selectedSink.slice(8)
            let LHName = lib.config.xjb_newcharacter.name2 || ''
            let azureSky = lib.xjb_src + "position/azureSky.jpg"
            let lake = lib.xjb_src + "position/lake.jpg"
            //长对话
            class DialogLead {
                constructor() {
                    Array.from(arguments).forEach(i => {
                        if (Array.isArray(i)) this.dialogList = i
                        else if (typeof i === "function") this.result = i
                        else if (get.itemtype(i) === "player") this.player = i
                    })
                    if (!this.result) this.result = function () { }
                }
                lead() {
                    game.pause()
                    let dialogList = this.dialogList
                    let dialogU = () => {
                        if (!dialogList.length) {
                            document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', dialogU)
                            game.resume()
                            this.result(this.player)
                            return;
                        }
                        let lead = dialogList.shift()
                        let dialog = ui.create.dialog()
                        dialog.add(lead)
                    }
                    document.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', dialogU)
                }
            }
            class Play {
                dialog = {}
                constructor(obj) {
                    this.dialog.start = obj.start || []
                    this.dialog.end = obj.end || []
                    this.information = obj.information || {}
                    this.gameInit = obj.gameInit || function () { }
                    this.leadFn = obj.leadFn || function () { }
                    this.leadList = obj.leadList || []
                }
                init(player) {
                    //设置关卡信息
                    _status.xjb_level = { ...this.information }
                    //如果有前置剧情，则处理前置剧情，把登场函数设置为最后的函数
                    if (this.dialog.start.length) {
                        this.dialog.start.map(play => {
                            game.xjb_dialog(play)
                            return true
                        }) &&
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
            }
            //这个可以用来设置一个技能并执行
            class Content {
                constructor() {
                    let id, content, player, trigger
                    Array.from(arguments).forEach(i => {
                        if (typeof i === "string") id = i
                        else if (typeof i === "function") content = i
                        else if (get.itemtype(i) === "player") player = i
                        else if (typeof i === "object") trigger = i
                    })
                    this.id = id;
                    this.player = player
                    this.content = content;
                    lib.skill[id] = {}
                    lib.skill[id].content = content
                    lib.skill[id].direct = true
                    lib.skill[id].trigger = trigger
                }
                use() {
                    this.player.useSkill(this.id)
                    return this
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
                    //灵力教程
                    Lingli0001: new Play({
                        information: {
                            name: "灵力教程",
                            number: "Lingli0001",
                            Type: "Play",
                        },
                        leadList: [
                            "欢迎来到灵力教程关卡！",
                            "在本关卡中，你将学会如何使用灵力。",
                            "事不宜迟，让我们开始吧！",
                            "首先要提出的就是灵力和魔力的关系",
                            "每个单位的灵力中含有创造一张卡牌的能量",
                            "请注意，这里指的卡牌范围很广，包括：",
                            "武将牌、身份牌、体力牌,当然也包括通常讲的牌",
                            "与之相反的是，有一种魔力每个单位中含有销毁一张牌的能量",
                            '为什么说"有一种"？因为还有一种魔力不带能量。',
                            "灵力和魔力的单位都是Ch，它们之间可以相互转化。",
                            "不难想到，当1Ch灵力→1Ch魔力(无能量)时，会创造一张牌。",
                            "而当1Ch魔力(销毁一张牌)→1Ch灵力时，会销毁两张牌。",
                            "销毁两张卡牌等效于一点体力(上限)减少,创造两张卡牌等效于一点体力(上限)增加",
                            "现在，就获得灵力看看吧！"
                        ],
                        leadFn: function (player) {
                            let content = new Content("xjb_ready", player, function () {
                                "step 0"
                                player.chooseControl("获得灵力").set("prompt", "请点击获得灵力")
                                "step 1"
                                player.addMark("_xjb_lingli", 10)
                                player.update()
                                "step 2"
                                player.chooseControl("获得魔力(无能量)").set("prompt", "很棒！现在来试试获取魔力吧！")
                                "step 3"
                                player.addMark("_xjb_moli", 10)
                                player.update()
                                "step 4"
                                player.chooseControl("转化").set("prompt", "还记得1Ch灵力→1Ch魔力(无能量)总收益等于创造一张卡牌吗，点击试一下吧！")
                                "step 5"
                                player.xjb_molizeLingli()
                                "step 6"
                                player.chooseControl("继续").set("prompt", "记得1Ch魔力(销毁一张牌)→1Ch灵力负收益等于销毁两张牌吗，这就是通过导魔介质实现的！")
                                "step 7"
                                player.chooseControl("继续").set("prompt", "一对导魔介质可以在你和另一名角色间进行1Ch魔力的传导。")
                                "step 8"
                                player.chooseControl("继续").set("prompt", "灵力高的那一方的魔力会传导至灵力低的那一方，转化成灵力。")
                                "step 9"
                                player.chooseControl("导魔").set("prompt", "你现在拥有10点灵力，是灵力最多的角色！魔力无论如何都会打在对方身上，来试试吧！")
                                "step 10"
                                player.chooseTarget(true, "选择你要导魔的角色").set("filterTarget", lib.filter.notMe)
                                "step 11"
                                game.xjb_getDaomo(player, "blood", 5)
                                player.xjb_buildBridge(result.targets[0])
                                event.target = result.targets[0]
                                "step 12"
                                if (event.target.isAlive()) event.goto(11)
                                "step 13"
                                player.chooseControl("继续").set("prompt", "做的漂亮！")
                                "step 14"
                                player.chooseControl("继续").set("prompt", "相信你已经注意到了，一名角色死亡后，其灵力和魔力会被当前回合角色获得。")
                                game.players.filter(current => current != player).forEach(current => {
                                    current.addSkill("xjb_P_gathering")
                                    current.xjb_addZhenFa(get.cards(1))
                                })
                                "step 15"
                                player.chooseControl("聚灵区是什么？", "阵法是什么？", "我已知道这两者了。").set("prompt", "哦，不妙！他们进入了聚灵区，而且阵法中多出了一张牌！")
                                "step 16"
                                if (result.control === "聚灵区是什么？") {
                                    player.chooseControl("我知道了").set("prompt", "在一个环境中，能够容纳的灵力是有限的，超过了这个限度，灵力便一定会转化为魔力。<br>在一般的环境中，最多可以容纳10点灵力，而在聚灵区中，最多可容纳100点灵力！")
                                    event.goto(15)
                                } else if (result.control === "阵法是什么？") {
                                    player.chooseControl("我知道了").set("prompt", "阵法是一个特殊的区域，你可以利用启灵等方法把卡牌置于阵法区，就会获得灵力，获得的灵力是不确定的。")
                                    event.goto(15)
                                } else {
                                    player.chooseControl("继续").set("prompt", "很好！")
                                }
                                "step 17"
                                player.chooseControl("启灵").set("prompt", "刚刚提到过启灵，现在就来试试吧！")
                                "step 18"
                                player.chooseCard("he", true)
                                "step 19"
                                player.xjb_addZhenFa(result.cards)
                                "step 20"
                                player.chooseControl("啊？", "来吧！").set("prompt", "好了，灵力基本教程就结束了，现在开始战斗吧！")
                                "step 21"
                                if (result.control === "来吧！") {
                                    game.xjb_getDaomo(player, "blood", 10)
                                }
                                player.clearSkills()
                                player.addSkill("_xjb_soul_daomo")
                                player.addSkill("_xjb_soul_qiling")
                            })
                            content.use()
                        },
                        gameInit: function (player) {
                            game.showIdentity();
                            game.players.forEach(i => {
                                i.directgain(get.cards(7))
                            })
                            new DialogLead(this.leadList, this.leadFn, player).lead()
                        },
                    }),
                    //自我试练                            
                    SELF0001: new Play({
                        start: [
                            [
                                [LH, LHName, "red", "这是一个动荡的时代。或许你不理解像我这些四处游走的旅人。", azureSky],
                                [, , , "你以为我是被迫流亡？错咯！我坚信智者芙艾派依说的话：冒险和勇气往往会收获意想不到的结局！"],
                                [, , , "今年是——1296，而我自1264离开家乡，已是三个年头了。"],
                                [, , , '我辗转的这些年份，常作学徒——"偷艺"的学徒。我只是看了那些作艺的过程，又不去四处宣扬，造成不了什么损失。偏偏近来常遇见狭隘的主，硬是污了我名去。'],
                                [, , , "如今倒好，落下个坏名声，四个村镇的人都听闻有这么一个贼人。无可奈何，我又得另寻他处以容身了。——看看地图吧——"],
                                [, , , "——lino，这个地方我还未去过，闻所未闻。这个地方还有小字的标注。"],
                                ["none", "标注", "white", "欲至lino，必须明白自己正是在它的lero，经由lane才能前往。最后你会发现要从ladina而到达lion，但这是不可能的。"],
                                [LH, LHName, "red", "这句话可真令人摸不着头脑。让人云里雾里的。它就不像是在指路。——我正处在它的lero，经由lane才能前往lino，不要经过ladina。可是lane又是什么？我到哪里寻呢？ladina又是什么？我又何从避开呢？"],
                                [, , , "就跟谜似的。算了，不管这些了。看看别处去——这处地不错，就向它进发吧。"]
                            ],
                            [
                                [LH, LHName, "red", "这河水真是清澈，暂且歇歇脚。", lake],
                                [lake, "", "blue",],
                                [LH, LHName, "red", "奇怪？怎么有回声呀！这里是平原，又不是山峰。"],
                                [lake, "", "blue",],
                                [LH, , "red", "(常听老人说，回声永不散，水仙永不爱。发生这样的事，怕是因为回声女神伊可所受到诅咒又传染给了别人。不过，既然是伊可仙女一样的可怜人，就无所担心了。让我唤她出来)"],
                                [LH, LHName, "red", "遭受情伤的仙女，出来见我一面吧！我想我帮帮你"],
                                [lake, "", "blue",],
                                [LH, LHName, "red", "天哪！你到底是谁！简直和我一模一样！"],
                                [, , "blue"],
                                [, , "red", "等等，你要做些什么？"],
                                [, , "blue"],
                            ]
                        ],
                        end: [
                            [
                                [LH, LHName, "red", "我以为会有什么奇幻遭遇，但却给了我一场袭击。还好侥幸战胜了这样一个冒牌货。", lake],
                                [, , "blue",],
                                [, , "red", "真是令人恼怒！你不是伊可，你不是米若，你不是回声和镜子，不却断重复我的言语行为。你分明是会自己行动的。怎么？你是非要灭了我取而代之？"],
                                [, , "blue", ""],
                                [, , "red", "(举起身旁一块大石，砸向河水，河水翻滚，溅起的水珠都映着" + LHName + "的模样)"],
                                [, , "blue", "(瞬间化成成千上万个，不约而同地向" + LHName + "袭来)"],
                                [, , "red", "！！！"]
                            ]
                        ],
                        gameInit: function (player) {
                            game.players[1].init(player.name1);
                            game.players[1].hp = game.players[1].maxHp = game.me.maxHp;
                            game.players[1].update();
                        },
                        information: {
                            name: "自我试练<br>1-1两个我？",
                            number: "SELF0001",
                            Type: "Play",
                            next: "SELF0002",
                        },
                    }),
                    SELF0002: new Play({
                        start: [
                            [
                                [LH, LHName, "red", "不妙啊……", lake],
                                [, , "blue", ""],
                            ]
                        ],
                        information: {
                            name: "自我试练<br>1-2四重存在",
                            number: "SELF0002",
                            Type: "Play",
                        },
                        gameInit: function (player) {

                        },
                    }),
                },
            }
        },
        "_priority": 0,
    }
}