import {
    lib,
    game,
    ui,
    get,
    ai,
    _status
} from "../../noname.js";
export function XJB_CONTENT(config, pack) {
    //这个是用于设置关卡信息的函数
    lib.arenaReady.push(function () {
        _status.xjb_level = {
            name: lib.config.mode,
            number: "0000",
            Type: "normal"
        }
    });
    //这个把其他新将包的数据释放出来
    lib.arenaReady.push(function () {
        //这里会创建一个数组，该数组为xjb_3、xjb_4、...
        let arr = new Array();
        arr.length = 11;
        arr.fill("xjb_");
        arr = arr.map(function (item, index) {
            return item + (index + 3);
        })
        //遍历这个数组，执行其中的函数
        arr.forEach(function (item) {
            if (!lib.skill[item]) {
                return false;
            }
            for (let i in lib.skill[item]) {
                if (typeof lib.skill[item][i] === "function") lib.skill[item][i]();
            }
        })
    })
    //这个是一定要放在最后处理的新将包数据
    lib.arenaReady.push(function () {
        const loadFinal = () => {
            if (!lib.skill.xjb_final) {
                setTimeout(loadFinal, 100);
                return;
            };
            for (let k in lib.skill.xjb_final) {
                (typeof lib.skill.xjb_final[k] === "function") &&
                    lib.skill.xjb_final[k]()
            }
        }
        loadFinal()
    })
    lib.extensionMenu.extension_新将包.delete.name = '<img src="' + lib.xjb_src + 'image/trash.png" width="16">' + '删除'
    lib.extensionMenu.extension_新将包['Eplanation'] = {
        name: '<img src="' + lib.xjb_src + 'image/instruction.png" width="16"></img>概念说明',
        init: '',
        item: {
            mingxie: '鸣谢',
            disk: "网盘",
            HpCard: "体力牌",
            remnantArea: "残区",
            hun_system: '魂币系统',
            economic: "魂的货币体系"
        },
        onclick: function (layout) {
            ui.create.xjb_book(ui.window, xjb_library["intro"][layout])
        }
    }
    lib.extensionMenu.extension_新将包.xjb_download = {
        name: '\u{1f4e5}更新工具',
        init: '',
        item: {
            getAPI: '获取工具',
            changeBranch: "切换分支",
            putout: '输出目录',
            download: '下载更新',
            downloadSimply: '简易更新',
        },
        visualMenu: function (node) {
            node.className = 'button controlbutton';
        },
        onclick: async (layout) => {
            switch (layout) {
                case 'getAPI': {
                    import("https://gitee.com/xinyuanwm/noname-extension-updater/raw/master/updator.js")
                        .then(module => {
                            const Updator = module.Updator;
                            game.xjb_updator = new Updator("新将包", "https://gitee.com/xinyuanwm/new-jiang/raw/master")
                                .addResUrl("PR", "https://gitee.com/xinyuanwm/new-jiang/raw/PR-branch")
                                .setData(lib, game, ui, get, ai, _status);
                            alert("updator获取成功！");
                        })
                        .catch(err => {
                            alert(`updator获取失败\n${err}`);
                        })
                }; break;
                case "changeBranch": {
                    if (!game.xjb_updator) return alert("updator未引入,请点击获取工具引入!");
                    if (game.xjb_updator.mainResName === "main") game.xjb_updator.changeMainRes("PR");
                    else game.xjb_updator.changeMainRes("main");
                    alert(`已切换至${game.xjb_updator.mainResName}:${game.xjb_updator.mainURL}`)
                }; break;
                case 'putout': {
                    if (!game.xjb_updator) return alert("updator未引入,请点击获取工具引入!");
                    const myUpdator = game.xjb_updator;
                    const fileList = await myUpdator.readDirDefault(
                        [
                            "Thumbs.db",
                        ],
                        [
                            ".vscode", ".git", ".github", ".gitee",
                            "log", "skin/image/xjb_newCharacter"
                        ]
                    );
                    const bufferArray = await myUpdator.cache(fileList);
                    const hashMap = await myUpdator.getHashMap(bufferArray, true);
                    await myUpdator.genDir(Array.from(hashMap));
                    alert("目录生成成功");
                }; break;
                case 'download': {
                    if (!game.xjb_updator) return alert("updator未引入,请点击获取工具引入!");
                    const myUpdator = game.xjb_updator;
                    const manager = myUpdator.updateLine({
                        rmCR: true,
                        timeoutMinutes: 1,
                        reCalHash: true
                    });
                    manager.on("getCache", data => {
                        console.log(data);
                    });
                    manager.on("filterHash", data => {
                        console.log(data);
                    });
                    manager.on("makeSureDirSuc", data => {
                        console.log(data.processingDir, "文件夹创建成功")
                    })
                    manager.on("update", data => {
                        console.log(data.updateInfo);
                    });
                    manager.on("updateSuc", data => {
                        console.log(data.processingFile, "下载成功");
                    });
                    manager.on("fixFileSuc", data => {
                        console.log(data.fixingFileInfo);
                    })
                    manager.on("fileAllOk", () => {
                        alert("更新成功！")
                    })
                    manager.on("fileException", (updateFailFile) => {
                        alert(`存在下载失败的文件！\n${updateFailFile}`)
                    })
                    manager.on("error", err => {
                        console.error(err);
                    });
                    manager.smartUpdate();
                }; break;
                case 'downloadSimply': {
                    if (!game.xjb_updator) return alert("updator未引入,请点击获取工具引入!");
                }; break;
            }
        }
    }
    lib.extensionMenu.extension_新将包.xjb_strategy = {
        name: "💡策略集",
        clear: true,
        onclick: function () {
            const strategyList = {
                xjb_lingli_Allallow: '<b description="开启后，场上角色均可以使用灵力系统">全员灵力策略</b>',
                xjb_skillsNumberLimitation: '<b description="开启后，技能数超过6的角色须将一张技能转化为技能牌">技能数限制策略</b>',
                xjb_maxHpLimitation: '<b description="开启后，体力上限超过15的角色在其回合开始时,选择失去x点体力或体力上限（x为其此时体力上限的1/15且向上取整）。体力无限的角色将体力调整至15。">体力上限限制策略',
            };
            const restList = {
                xjb_yangcheng: '养成武将策略',
                xjb_chupingjisha: '触屏击杀策略',
                xjb_cardStore: '魂市策略',
                xjb_bianshen: '魂将策略'
            }
            if (lib.config.xjb_hun) Object.keys(restList).forEach(i => {
                if (lib.config[i] !== void 0) {
                    strategyList[i] = restList[i];
                }
            })
            game.xjb_create.configList(strategyList, function () {
                game.xjb_cpjsLoad();
                game.xjb_cpjsRemove();
                if (_status.event.name == 'chooseToUse' && _status.event.player) {
                    _status.event.result = {
                        bool: true,
                        skill: 'xjb_updateStrategy'
                    };
                    game.resume();
                }

            });
        }
    }
    if (!lib.config.xjb_hun) {
        lib.extensionMenu.extension_新将包.open = {
            name: "<font color='blue'>点我开启魂币系统",
            clear: true,
            onclick: function () {
                if (!lib.config.xjb_hunbi) {
                    lib.config.xjb_hunbi = 0;
                    game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                }
                game.saveConfig('xjb_hun', true);
                game.xjb_create.alert('已开启魂币系统，将自动重启', function () {
                    game.reload();
                });
            }
        }
    }
    if (lib.config.xjb_hun) {
        lib.extensionMenu.extension_新将包.hunbi = {
            name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20" >' + '魂币数据',
            clear: true,
            onclick: function () {
                function hun(num) {
                    var hunbi = ""
                    if (num > 0 && num < 5) {
                        for (var i = 0; i < num; i++) {
                            hunbi = hunbi + '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="25" >'
                        }
                    }
                    else {
                        hunbi = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="25" >×' + num
                    }
                    return hunbi
                }
                let condition = {
                    "hunbi": "魂币:" + (hun(lib.config.xjb_hunbi)),
                    "dakadian": "打卡点:" + (hun(lib.config.xjb_hundaka2)),
                    "energy": "能量:" + (hun(lib.config.xjb_systemEnergy)),
                    "HunbiExpectation": "魂币期望:" + (hun(game.xjb_hunbiExpectation())),
                    "floatRate": "浮流率:" + (game.xjb_inflationRate() * 100).toFixed(2) + "%"
                }
                game.xjb_create.condition(condition).font(30)
            }
        }
        lib.extensionMenu.extension_新将包.hunbi_tozero = {
            name: '<img src="' + lib.xjb_src + 'image/zeroize.png" height="16">清零魂币',
            clear: true,
            onclick: function () {
                if (lib.config.xjb_hunbi === 0) return game.xjb_create.alert('你的魂币无需清零');
                game.xjb_create.confirm('确定要清零吗？', function () {
                    var num = lib.config.xjb_hunbi
                    if (lib.config.xjb_hunbi > 0 && lib.config.xjb_hunbi <= 50) {
                        num = game.xjb_currencyRate.CoinToEnergy * num - 1;
                    }
                    else if (lib.config.xjb_hunbi > 50 && lib.config.xjb_hunbi <= 500) {
                        num = game.xjb_currencyRate.firstRate * num;
                    }
                    else if (lib.config.xjb_hunbi > 500) {
                        num = game.xjb_currencyRate.firstRate * num + 500;
                    }
                    else if (lib.config.xjb_hunbi < 0) {
                        num = num * game.xjb_currencyRate.CoinToEnergy - 100;
                    }
                    game.saveConfig('xjb_hunbi', 0);
                    game.xjb_systemEnergyChange(num)
                    game.xjb_create.alert('你的魂币已清零');
                })

            }
        }
        lib.extensionMenu.extension_新将包.LZ_project = {
            name: '<img src="' + lib.xjb_src + 'image/π.png" height="16">刘徽-祖冲之项目',
            clear: true,
            onclick: function () {
                game.xjb_LZ_project()
            }
        }
        lib.extensionMenu.extension_新将包['information'] = {
            name: '<img src="' + lib.xjb_src + 'image/instruction.png" width="16">' + '<font color="yellow">角色进度查询!</font>',
            clear: true,
            onclick: function () {
                game.xjb_Intro2()
            }
        }
        lib.extensionMenu.extension_新将包['choujiang'] = {
            name: '<img src="' + lib.xjb_src + 'image/Lucky.png" width="16">' + '<font color="yellow">超值抽奖！</font>',
            init: '1',
            item: {
                1: '一倍',
                6: '六倍',
                36: '三十六倍',
                72: '七十二倍'
            },
            onclick: function (layout) {
                if (lib.config.xjb_systemEnergy < 0) {
                    if (layout >= 6) return game.xjb_NoEnergy()
                    if (lib.config.xjb_hundaka2 >= layout && lib.config.xjb_hunbi < 10) return game.xjb_create.alert("由于能量不足，现在抽奖方决定：临时开发打卡点抽奖途径，以渡过无能量期，现在自动为您抽奖...", function () {
                        lib.config.cjb_cj_type = "2"
                        game.xjb_jiangchiUpDate()
                        let JP = lib.xjb_list_xinyuan.jiangchi.randomGet()
                        game.cost_xjb_cost(2, 1)
                        game.xjb_create.alert(JP + '×' + layout, function () {
                            game.xjb_gainJP(JP, true, 1 * layout)
                        })
                    })
                    return game.xjb_NoEnergy()
                }
                //设置back
                var thelist = ui.create.xjb_back("抽奖花费:养成、技能奖池:8魂币，魂币奖池:1打卡点。点击奖品表即可刷新。")
                var back = thelist[0]
                //设置抽奖种类
                var xjb_list = ui.create.div('.jb_choujiangx', back)
                xjb_list.classList.add('xjb-choujiang-listContainer')
                ui.xjb_giveStyle(xjb_list, {
                    width: "125px",
                    margin: '50px 0'
                })
                //onclick函数生成
                var myFunc = function (num) {
                    return function () {
                        lib.config.cjb_cj_type = `${num}`
                        var xx = lib.config.cjb_cj_type, xjb_txt1 = document.getElementById('myChouJiang_XJB_TXT'), btn = document.getElementById('myChouJiang_XJB_BUTTON')
                        if (btn.disabled) return false
                        xjb_txt1.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang[xx])
                        game.xjb_jiangchiUpDate()
                    }
                }
                //设置每个抽奖按钮的内容
                var constructor = function (i) {
                    var inner = ["养成奖池", "魂币奖池", "免费奖池", "技能奖池"]
                    var choujiang = ui.create.div('.xjb_choujiang', xjb_list)
                    choujiang.innerHTML = inner[i]
                    choujiang.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', myFunc(i + 1))
                    return choujiang
                }
                //显示当前奖品
                var content = ui.create.div(".choujiang_content", back)
                content.innerHTML = '奖品'
                content.id = "myChouJiang_XJB_CONTENT";
                //抽奖按键
                var btn = document.createElement("BUTTON")
                btn.id = "myChouJiang_XJB_BUTTON"
                btn.innerHTML = '点击抽奖';
                back.appendChild(btn);
                //创建奖品列表
                var text = ui.create.div(".choujiang_text", back)
                text.id = "myChouJiang_XJB_TXT"
                var xx = lib.config.cjb_cj_type;
                text.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang[xx])
                text.onclick = function () {
                    if (btn.disabled) return;
                    this.style.color = ["red", "blue", "yellow", "pink", "white", "orange"].randomGet()
                    var bool = this.innerHTML.search(/技能/) >= 0
                    game.xjb_systemEnergyChange(-1)
                    if (!bool) return
                    lib.skill.xjb_final.choujiang();
                    this.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang["4"]);
                    game.xjb_jiangchiUpDate();
                    game.xjb_systemEnergyChange(-1);
                }
                //抽奖事件
                btn.onclick = function () {
                    var xx = get.xjb_number(lib.config.cjb_cj_type), num = 8 * layout
                    if (xx == 2) num = 1 * layout
                    let conditionList = {
                        '1': () => !game.xjb_condition(1, num),
                        '2': () => !game.xjb_condition(2, num),
                        '3': () => false,
                        '4': () => (!game.xjb_condition(1, num) || !game.xjb_condition(3, 1 * layout))
                    }
                    if (conditionList[xx]()) return game.xjb_create.alert("你未达成抽奖的条件！")
                    if (xx == 4) xx = 1
                    if (xx !== 3) game.cost_xjb_cost(xx, num, '抽奖')
                    game.xjb_jiangchiUpDate()
                    btn.disabled = true;
                    var xjb_content = document.getElementById('myChouJiang_XJB_CONTENT')
                    var i = 0, z = -1
                    var timer = window.requestAnimationFrame(function wonderfulJP() {
                        z++
                        if (i < 100) {
                            if (z % 5 === 0) {
                                var jp = lib.xjb_list_xinyuan.jiangchi[i]
                                xjb_content.innerHTML = jp
                                i++
                            }
                            var timer = window.requestAnimationFrame(wonderfulJP)
                        }
                        else {
                            game.xjb_create.alert(xjb_content.innerHTML + '×' + layout, function () {
                                game.xjb_gainJP(xjb_content.innerHTML, undefined, 1 * layout)
                            })
                            cancelAnimationFrame(timer)
                            btn.disabled = false
                        }
                    })
                }
                //设置奖池表
                for (var i = 0; i < 4; i++) {
                    let clk = constructor(i)
                    if ((i == 3) && layout != 1) ui.xjb_hideElement(clk);
                }
            }
        }
        lib.extensionMenu.extension_新将包.level = {
            name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="16"><font color=yellow>技能附魔！',
            init: "openType",
            item: {
                openType: "开启标签",
                addCharacter: "添删武将",
                enchanting: "技能附魔"
            },
            visualMenu: function (node) {
                node.className = 'button controlbutton';
            },
            onclick: function (e) {
                if (e === "openType") {
                    //标签开关
                    const dialog = game.xjb_create.configList({
                        xjb_skillTag_fuSkill: "福技:首次使用后恢复体力并加护甲",
                        xjb_skillTag_luSkill: "禄技:首次使用后摸四张牌",
                        xjb_skillTag_shouSkill: "寿技:首次使用后加两点体力上限",
                        xjb_skillTag_qzj: "强制技:结算后,令目标失去技能(此时切勿用本体编辑器编辑技能!)",
                        xjb_skillTag_suidongSkill: "随动技:因本技能而获得牌，该角色可以立即使用之",
                        xjb_skillTag_queqiaoxian: "鹊桥仙:结算后,可令有姻缘的珠联璧合角色额外结算一次",
                    })
                    dialog.style.width = '800px'
                    lib.skill.xjb_final.skillTag()
                } else if (e === "addCharacter") {
                    //角色开关
                    let obj = {}
                    for (let i in lib.character) {
                        if (lib.character[i][4].includes("unseen")) continue;
                        obj["xjb_skillTag_Character_" + i] = get.translation(i) + "(" + i + ")"
                    }
                    game.xjb_create.configList(obj, function () {
                        let arr = this.isOpened
                        arr = arr.map(function (item) {
                            return item.replace("xjb_skillTag_Character_", "")
                        })
                        game.saveConfig("xjb_skillTag_Character", arr)
                    })
                    lib.skill.xjb_final.skillTag()
                } else if (e === "enchanting") {//技能开关
                    const obj = {}
                    function addItem(skillName, characterID, type) {
                        obj["xjb_skillTag_" + type + "_" + skillName] = "【" + get.translation(type) + "】"
                            + `<b description=${get.plainText(`${lib.translate[skillName + "_info"] || ''}`).replaceAll(/(福技|禄技|寿技|随动技|强制技|鹊桥仙)[,，]/g, '')}>${get.translation(skillName)}</b>`
                            + "(来源:" + get.translation(characterID) + ")"
                    }
                    const {
                        xjb_skillTag_Character,
                        xjb_skillTag_qzj,
                        xjb_skillTag_queqiaoxian,
                        xjb_skillTag_suidongSkill,
                        xjb_skillTag_fuSkill,
                        xjb_skillTag_luSkill,
                        xjb_skillTag_shouSkill
                    } = lib.config;
                    if (!xjb_skillTag_Character || !xjb_skillTag_Character.length) {
                        //检测是否有武将解锁了该功能
                        return game.xjb_create.alert("你没有任何武将解锁了技能标签，请于 添删武将 中设置！")
                    }
                    const queqiaoxianBan = []
                    function searchGroup(skillName, info, characterID) {
                        const group = [].concat(info.group);
                        if (group.every(skill => {
                            const bool1 = !game.xjb_judgeSkill.Tri_logSkill(skill);
                            const bool2 = !game.xjb_judgeSkill.enableNotView(skill);
                            return bool1 && bool2
                        })) return;
                        if (xjb_skillTag_queqiaoxian == 1 && get.info("_xjb_queqiaoxian").getCP(characterID).length) {
                            addItem(skillName, characterID, 'queqiaoxian')
                        }
                        return;
                    }
                    xjb_skillTag_Character.forEach(item => {
                        if (!lib.character[item]) return;
                        if (!lib.character[item][3]) return;
                        if (!lib.character[item][3].length) return;
                        lib.character[item][3].forEach(skillName => {
                            if (!lib.skill[skillName]) return;
                            //检测该技能是否存在
                            const info = get.info(skillName)
                            if (!info.content) {
                                if (!info.group) return;
                                searchGroup(skillName, info, item);
                            }
                            const contentStr = info.content ? info.content.toString() : "";
                            if (xjb_skillTag_suidongSkill == 1) {
                                addItem(skillName, item, 'suidongSkill')
                            }
                            //判断该技能为主动技且会选择角色
                            if (info.enable) {
                                if (info.filterTarget && xjb_skillTag_qzj == 1) {
                                    addItem(skillName, item, 'qzj')
                                }
                                if (xjb_skillTag_queqiaoxian == 1 && get.info("_xjb_queqiaoxian").getCP(item).length) {
                                    addItem(skillName, item, 'queqiaoxian')
                                }
                            }
                            /*下面这两行连写，会先判断是否有player.logSkill再判断是否为触发技*/
                            else if (info.direct && !contentStr.includes("logSkill")) return;
                            else if (info.popup === false && !contentStr.includes("logSkill")) return;
                            else if (info.trigger) {
                                if (xjb_skillTag_fuSkill == 1) {
                                    addItem(skillName, item, 'fuSkill')
                                }
                                if (xjb_skillTag_luSkill == 1) {
                                    addItem(skillName, item, 'luSkill')
                                }
                                if (xjb_skillTag_shouSkill == 1) {
                                    addItem(skillName, item, 'shouSkill')
                                }
                                if (xjb_skillTag_queqiaoxian == 1 && get.info("_xjb_queqiaoxian").getCP(item).length) {
                                    if (!info.forceDie && queqiaoxianBan.every(ban => !skillName.endsWith(ban))) addItem(skillName, item, 'queqiaoxian')
                                }
                            }
                            else if (info.group) {
                                searchGroup(skillName, info, item)
                            }
                        })
                    })
                    game.xjb_create.configList(obj, function () {
                        let arr = this.isOpened, object = {
                            fuSkill: [],
                            luSkill: [],
                            shouSkill: [],
                            qzj: [],
                            suidongSkill: [],
                            queqiaoxian: []
                        }
                        function addTag(item, type) {
                            if (item.indexOf("xjb_skillTag_" + type + "_") > -1) {
                                object[type].add(item.replace("xjb_skillTag_" + type + "_", ""))
                            }
                        }
                        arr.forEach(item => {
                            Object.keys(object).forEach(Tag => {
                                addTag(item, Tag)
                            })
                        })
                        game.saveConfig("xjb_skillTag_Skill", object)
                    })
                    //更新技能附魔
                    lib.skill.xjb_final.skillTag()
                }
            }
        }
        if (lib.config.xjb_yangcheng == 1) {
            lib.extensionMenu.extension_新将包.newCharacter = {
                name: '<img src="' + lib.xjb_src + 'xin_newCharacter.jpg" height="16">' + '<font color="yellow">武将养成</font>',
                init: 'name2',
                item: {
                    name2: '姓名更改',
                    sex: '性别更改',
                    group: '势力更改',
                    hp: '体力值↑',
                    intro: '身份设置',
                    unique: '特殊设置',
                    skill1: '技能槽↑',
                    skill2: '技能回收',
                    skill3: '技能学习',
                    skin1: '皮肤导入',
                    skin3: '原皮更改',
                    skin4: '恢复原皮',
                },
                visualMenu: function (node) {
                    node.className = 'button controlbutton';
                },
                onclick: function (layout) {
                    //能量判定
                    if (lib.config.xjb_systemEnergy < 0) {
                        return game.xjb_NoEnergy()
                    }
                    switch (layout) {
                        case 'name2': game.xjb_gainJP("免费更改姓名"); break;
                        case 'sex': {
                            let sex = lib.config.xjb_newcharacter.sex;
                            let price = game.xjb_goods.changeSexCard.price;
                            game.xjb_create.confirm('你当前性别为：' + get.translation(sex) + `，更改性别需要1张性转卡(${price}魂币一张，当前你有` + game.xjb_countIt("changeSexCard") + '张，无则自动购买)确定要更改吗？', function () {
                                game.xjb_newCharacterChangeSex(1, false);
                            });
                        } break;
                        case 'group': {
                            let group = lib.config.xjb_newcharacter.group;
                            let price = game.xjb_goods.changeGroupCard.price;
                            game.xjb_create.confirm('你当前势力为：' + get.translation(group) + `，更改势力需要1个择木卡(${price}魂币一张，当前你有` + game.xjb_countIt("changeGroupCard") + '张，无则自动购买)，确定要更改吗？', function () {
                                game.xjb_newCharacterChangeGroup(1, false);
                            });
                        } break;
                        case 'hp': {
                            let hp = lib.config.xjb_newcharacter.hp;
                            let max = 0;
                            function getCost(num) {
                                let count = 0, i = 0;
                                while (i < num) {
                                    count += (hp + i) * (hp + i) * 2;
                                    i++;
                                }
                                return count;
                            }
                            for (let add = 0; add < 15; add++) {
                                let cost = getCost(add);
                                if (lib.config.xjb_hunbi < cost) break;
                                max = add;
                            }
                            game.xjb_create.range('你已有' + hp + '点体力。增加0点体力需要0个魂币。', 0, max, 0, function () {
                                const add = this.result;
                                let cost = getCost(add);
                                if (lib.config.xjb_hunbi >= cost) {
                                    game.xjb_newCharacterAddHp(this.result, false);
                                }
                            }, function () {
                                const add = this.value;
                                let cost = getCost(add);
                                this.prompt.innerHTML = '你已有' + hp + '点体力。增加' + add + '点体力需要' + cost + '个魂币。';
                            });
                        }; break;
                        case 'intro': game.xjb_setInfoDia(); break;
                        case 'unique':
                            game.xjb_create.configList({
                                xjb_newCharacter_isZhu: "设置为常备主公",
                                xjb_newCharacter_hide: "设置登场时隐匿",
                                xjb_newCharacter_addGuoZhan: "加入国战模式",
                            });
                            break;
                        case 'skill1': {
                            let num = lib.config.xjb_jnc;
                            let max = 0;
                            function apSum(first, endIndex, difference) {
                                const last = first + (endIndex - 1) * difference
                                return (first + last) * endIndex / 2
                            }
                            for (let add = 0; add < 15; add++) {
                                let first = game.xjb_goods.jnc.price
                                let cost = apSum(first, add, 5)
                                if (lib.config.xjb_hunbi < cost) break;
                                max = add;
                            }
                            game.xjb_create.range('你当前有' + num + '个技能槽，开启0个技能槽,共需0个魂币', 0, max, 0, function () {
                                let add = this.result
                                let first = game.xjb_goods.jnc.price
                                let cost = apSum(first, add, 5)
                                if (lib.config.xjb_hunbi >= cost) {
                                    game.cost_xjb_cost("B", cost)
                                    game.xjb_newCharacterAddJnc(add)
                                }
                            }, function () {
                                let add = this.value;
                                let first = game.xjb_goods.jnc.price
                                let cost = apSum(first, add, 5)
                                this.prompt.innerHTML = '你当前有' + num + '个技能槽，开启' + add + '个技能槽,共需' + cost + '个魂币'
                            })
                            if (!lib.config.xjb_jnc) lib.config.xjb_jnc = 0;
                        } break;
                        case 'skill2': game.xjb_raiseCharRemoveUpdateSkillsDia(); break;
                        case 'skill3': game.xjb_addHunSkillsDia(); break;
                        case 'skin1': game.xjb_importSkinDia(); break;
                        case 'skin3': game.xjb_changePreSkinDia(); break;
                        case 'skin4': game.xjb_changeToInitialSkinDia(); break;
                        default: break;
                    }
                }
            }
        }
        if (!lib.config.xjb_bianshen) {
            lib.extensionMenu.extension_新将包.bianshen_hun_open = {
                name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁变身功能',
                clear: true,
                onclick: function () {
                    const goods = game.xjb_goods.permission_callFellow
                    if (lib.config.xjb_hunbi >= goods.price) {
                        game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁该功能需要' + goods.price + '个魂币，确定要解锁吗？', () => {
                            game.xjb_costHunbi(goods.price, '开启魂将功能权限')
                            game.saveConfig(goods.mapToConfig, 1);
                            game.xjb_create.alert('已解锁变身功能，重启即生效');
                            this.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁变身功能'
                        })
                    }
                    else game.xjb_create.alert('需要' + goods.price + '个魂币，你的魂币不足！');
                }
            }
        }
        if (!lib.config.xjb_yangcheng) {
            lib.extensionMenu.extension_新将包.yangcheng_hun_open = {
                name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁养成功能',
                clear: true,
                onclick: function () {
                    const goods = game.xjb_goods.permission_raise
                    if (lib.config.xjb_hunbi >= goods.price) {
                        game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁该功能需要' + goods.price + '个魂币，确定要解锁吗？', () => {
                            game.xjb_costHunbi(goods.price, '开启养成功能权限')
                            game.saveConfig(goods.mapToConfig, 1);
                            game.xjb_create.alert('已解锁养成功能，重启即生效');
                            this.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁变身功能'
                        })
                    }
                    else game.xjb_create.alert('需要' + goods.price + '个魂币，你的魂币不足！');
                }
            }
        }
        if (!lib.config.xjb_chupingjisha) {
            lib.extensionMenu.extension_新将包.xjb_chupingjisha_hun_open = {
                name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁触屏即杀功能',
                clear: true,
                onclick: function () {
                    const goods = game.xjb_goods.permission_cpjs
                    if (lib.config.xjb_hunbi >= goods.price) {
                        game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁触屏即杀功能需要' + goods.price + '个魂币，确定要解锁吗？', () => {
                            game.xjb_costHunbi(goods.price, '开启触屏即杀功能权限')
                            game.saveConfig(goods.mapToConfig, 1);
                            this.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁触屏即杀'
                        })
                    }
                    else game.xjb_create.alert('需要' + goods.price + '个魂币，你的魂币不足！');
                }
            }
        }
        lib.extensionMenu.extension_新将包.hun_close = {
            name: '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">点我关闭魂币系统</font>',
            clear: true,
            onclick: function () {
                game.saveConfig('xjb_hun', false);
                game.xjb_create.alert('已关闭魂币系统，将自动重启', function () {
                    game.xjb_systemEnergyChange(1)
                    game.reload();
                });
            }
        }
    }
    lib.extensionMenu.extension_新将包.skillEditor = {
        name: '<div>技能编辑器</div>',
        clear: true,
        onclick: function () {
            game.xjb_skillEditor()
        }
    }
    lib.extensionMenu.extension_新将包.hun_zeroise = {
        name: '<div>重置魂币系统数据！</div>',
        clear: true,
        onclick: function () {
            game.xjb_create.confirm('确定要重置吗？', function () {
                let list = lib.xjb_dataGet()
                for (let i = 0; i < list.length; i++) {
                    game.saveConfig(list[i], undefined);
                }
                game.xjb_create.alert("已重置，点击重启", function () {
                    game.reload();
                })
            });
        }
    }
    lib.extensionMenu.extension_新将包.storage = {
        name: '<div>导出魂币系统数据！</div>',
        clear: true,
        onclick: function () {
            new Promise(res => {
                game.xjb_create.prompt("请输入导出文件的路径及名称", lib.config.xjb_fileURL + "json/", function () {
                    res(this.result)
                })
            }).then(data => {
                let dataxjb = {};
                lib.xjb_dataGet().forEach(i => { dataxjb[i] = lib.config[i] })
                let BLOB = new Blob([JSON.stringify(dataxjb, null, 4)], {
                    type: "application/javascript;charset=utf-8"
                });
                let fileWay = data + '.json';
                game.xjb_transferFile(BLOB, fileWay);
            })

        }
    }
    lib.extensionMenu.extension_新将包.readStorage = {
        name: '<div>读取魂币系统数据！</div>',
        clear: true,
        onclick: function () {
            game.xjb_create.file("选择你要读取的json文件", "json", function () {
                lib.init.json(this.file.result, function (data) {
                    let list = Object.keys(data);
                    list.forEach(i => {
                        lib.config[i] = data[i];
                        game.saveConfig(i, lib.config[i])
                    })
                    game.xjb_create.alert("数据已导入，请重启", function () {
                        game.reload();
                    })
                })
            })
        }
    }
}
