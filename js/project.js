window.XJB_LOAD_PROJECT = function (_status, lib, game, ui, get, ai) {
    /*file*/
    game.xjb_transferFile = function (BLOB, fileWay, silent) {
        var reader = new FileReader()
        reader.readAsDataURL(BLOB, "UTF-8")
        reader.onload = function () {
            var fileTransfer = new FileTransfer();
            const obj = {}
            if (!silent) obj.Myalert = game.xjb_create.alert("正在导出中...")
            fileTransfer.download(this.result, fileWay, function () {
                if (obj.Myalert) obj.Myalert.innerHTML = "导出成功！"
            }, function (e) {
                if (obj.Myalert) obj.Myalert.innerHTML = "导出失败！<br>" + e.code
            });
        }
    };
    lib.skill.xjb_6 = {
        "xjb_storage": function () {
            get.xjb_storage = function () {
                let num, all, player
                Array.from(arguments).forEach(i => {
                    if (typeof i === 'number') {
                        num = Math.max(1, i)
                    } else if (i === true) {
                        all = i
                    } else if (typeof i == 'object') {
                        player = i.name1
                    } else if (typeof i === 'string') {
                        player = i
                    }
                })
                let target = lib.config.xjb_count[player] && lib.config.xjb_count[player].xjb_storage
                if (!target) return;
                if (Object.keys(target).filter(i => i === 'total').length === 0) return;
                if (all) return target
                if (num) return Object.values(target).filter(i => typeof i === 'object')[num - 1]
            }
        },
        hpcard: function () {
            game.xjb_getHpCard = function (player, value = 1, num) {
                if (typeof player != 'string') player = player.name1
                if (!lib.config.xjb_count[player]) lib.config.xjb_count[player]
                if (!lib.config.xjb_count[player].HpCard) lib.config.xjb_count[player].HpCard = []
                let list = new Array()
                list.length = num
                list.fill(value)
                lib.config.xjb_count[player].HpCard.push(...list)
                game.saveConfig('xjb_count', lib.config.xjb_count);
                var dialog = ui.create.dialog(get.translation(player) + '获得了体力卡', game.createHpCard(value))
                dialog.add('(计' + num + '个)')
                dialog.style['z-index'] = '15'
                setTimeout(function () {
                    dialog.close();
                }, 2500)
                game.xjb_systemEnergyChange(-7 * value * num)
            }
        },
        information: function () {
            game.xjb_getSb = {
                position: (player) => {
                    return player.storage.lingliPosition || "air"
                },
                allLingli: function (player) {
                    let targets = game.players.filter(i => {
                        return this.position(i) == this.position(player)
                    })
                    let num = 0
                    targets.forEach(i => num = num + i.countMark("_xjb_lingli"))
                    return num
                },
                //道具
                means: (player) => {
                    function Means(translation, num, picture, intro) {
                        this.translation = translation
                        this.num = num
                        this.picture = picture
                        this.intro = intro
                    }
                    Means.prototype.organize = function () {
                        let li = document.createElement("li")
                        li.appendChild(this.picture)
                        let span = document.createElement("span")
                        span.innerHTML = this.translation + "×" + this.num
                        span.style.position = "relative"
                        li.appendChild(span)
                        if (typeof this.intro === "function") {
                            this.picture.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', this.intro)
                            return li
                        }
                        let introduction = document.createElement("div")
                        introduction.innerHTML = this.translation + ":" + this.intro
                        introduction.style.position = "relative"
                        introduction.style.display = "none"
                        li.onmouseover = function () {
                            introduction.style.display = "block"
                        }
                        li.onmouseout = function () {
                            introduction.style.display = "none"
                        }
                        li.appendChild(introduction)
                        return li
                    }
                    var result = [];
                    function picture(str, h, w) {
                        let i = document.createElement("div")
                        i.style.display = "block";
                        i.style.height = h + "px";
                        i.style.width = w + "px";
                        i.style.backgroundImage = `url(${lib.xjb_src + str})`;
                        i.style.backgroundSize = "100% 100%"
                        i.style.position = "relative"
                        return i
                    }
                    //体力牌统计
                    if (1) {
                        let dataSource = lib.config.xjb_count[player].HpCard;
                        let dataList = game.countHpCard(dataSource)
                        new Array(1, 2, 3, 4, 5).forEach(function (item) {
                            if (dataList["" + item]) result.push(new Means(
                                item + "点体力牌",
                                dataList["" + item],
                                picture("HpCard/" + item + ".jpg", 100, 55),
                                "开局时使用，使用后加" + item + "点体力上限和体力"
                            )
                            )
                        })
                    }
                    if (1) {
                        let dataSource = lib.config.xjb_count[player].daomo
                        if (dataSource) {
                            dataSource = Object.keys(dataSource)
                            dataSource.forEach(function (i) {
                                result.push(new Means(
                                    this[i].translation,
                                    this[i].number,
                                    picture("lingli/" + i + ".jpg", 75, 75),
                                    this[i].intro
                                ))
                            }, lib.config.xjb_count[player].daomo)
                        }
                    }
                    //书统计
                    if (1) {
                        let dataSource = lib.config.xjb_count[player].book
                        if (dataSource) {
                            dataSource.forEach(i => {
                                result.push(new Means(
                                    i.headline + "(单击点开后，双击可以收起)",
                                    1,
                                    picture("lingli/book.jpg", 100, 100),
                                    () => {
                                        ui.create.xjb_book(ui.window, xjb_library[i.type][i.headline])
                                    }
                                ))
                            })
                        }
                    }
                    return result
                }
            }
        },
        bianshen: function () {
            lib.xjb_list_xinyuan.X_skill_num = {
                "益": 1,
                "损": 2,
                "愈": 11,
                "疾": 12,
                "雷": 14,
                "焰": 4,
                "冰": 24,
                "破": 54,
                "盈": 123,
                "缺": 113
            }
            lib.skill._xjb_bianshen = {
                enable: "phaseUse",
                filter: function (event, player) {
                    //将武将的实体定位卡牌商店中的某个物品
                    let trueBody = game.xjb_storeCard_information.xjb_BScharacter
                    trueBody.update();
                    //变身功能未开启取消
                    if (lib.config.xjb_bianshen !== 1) return false
                    //魂币不足，取消
                    if (!game.xjb_condition(1, trueBody.content.cost)) return false;
                    if (!trueBody.content.ok) return false
                    //处于变身状态，取消
                    if (player.countMark('_xin_bianshen') > 0) return false
                    //能量不足，取消
                    if (lib.config.xjb_systemEnergy < 0) return false
                    return true
                },
                content: function () {
                    "step 0"
                    if (!lib.skill._xjb_bianshen.filter(trigger, player)) event.finish()
                    "step 1"
                    let trueBody = game.xjb_storeCard_information.xjb_BScharacter;
                    let addToList = function (arr, tsl) {
                        for (let k in lib.translate) {
                            lib.translate[k] && lib.translate[k].indexOf(tsl) >= 0 && lib.character[k] && arr.push(k)
                        }
                    }
                    let po = [], yu = [], yi = [], ji = [], all = [];
                    addToList(yi, '马超');
                    addToList(po, '关羽');
                    addToList(yu, '华佗');
                    addToList(ji, '贾诩');
                    addToList(all, '诸葛亮');
                    let Ayi = yi.randomGet(), Apo = po.randomGet(), Ayu = yu.randomGet(), Aji = ji.randomGet(), Aall = all.randomGet()
                    var list = [Ayi, Apo, Ayu, Aji, Aall]
                    player.chooseButton([`选择一张变身的武将牌，花费魂币: ${trueBody.content.cost}`, '-武将列表-', [list, 'character']])
                    event.yi = Ayi; event.po = Apo; event.yu = Ayu; event.ji = Aji; event.all = Aall
                    "step 2"
                    if (result.bool) {
                        var name = result.links[0];
                        let trueBody = game.xjb_storeCard_information.xjb_BScharacter
                        const cost = trueBody.content.cost
                        var list = [cost]
                        lib.character[name][5] && list.push(lib.character[name][5])
                        let object = {
                            name: name,
                            skills: [...lib.character[name][3], "skill_X"],
                            hp: lib.character[name][2],
                            maxHp: lib.character[name][2],
                            hs: get.cards(5),
                            es: []
                        }
                        if (name === event.yi) {
                            list.push("益");
                            let cards = game.xjb_cardFactory(["xin_baiyin", "club", 1], ["xin_hutou", "spade", 11])
                            player.expandEquip && player.expandEquip(4);
                            object.es.add(...cards);
                        }
                        if (name === event.po) {
                            list.push("破");
                            let cards = game.xjb_cardFactory(["xin_chitu", "heart", 5], ["xin_qinglong", "spade", 5])
                            player.expandEquip && player.expandEquip(1);
                            object.es.add(...cards);
                        }
                        if (name === event.yu) {
                            list.push("愈");
                            let cards = game.xjb_cardFactory(["xin_qinnangshu", "heart", 7])
                            player.expandEquip && player.expandEquip(5);
                            object.es.add(...cards);
                        }
                        if (name === event.ji) {
                            list.push("疾");
                            let cards = game.xjb_cardFactory(["card_lw", "red", 13])
                            player.expandEquip && player.expandEquip(3);
                            object.hs.add(...cards);
                        }
                        if (name == event.all) {
                            let cards = game.xjb_cardFactory(["xin_qixing", "diamond", 7])
                            player.expandEquip && player.expandEquip(2);
                            object.hs.add(...cards);
                        }
                        list.push(object)
                        player.xjb_bianshen(...list)
                    }
                }
            }
            lib.translate._xjb_bianshen = "魂将"
        },
        xjbCharacterPack: function () {
            lib.config.all.characters.push("XJB");
            lib.characterPack['XJB'] = lib.config.all.characters['XJB']
            if (!lib.config.characters.includes("XJB")) lib.config.characters.push("XJB");
            lib.translate["XJB_character_config"] = "新将包";
            lib.characterPack["XJB"] = {}
            lib.translate.XJB = "新将包"
            let character = {
                "xin_fellow": ["male", "shen", 5, [], ["unseen"]],
                "xjb_daqiao": ["female", "wu", 3, ["xjb_liuli", "xjb_guose"], []],
                "xjb_sunce": ["male", "wu", "3/3", ["xin_taoni", "xin_jiang", "xin_yingyi"], []],
                "xjb_guojia": ["male", "wei", 3, ["xjb_qizuo", "xin_zaozhong"], []],
                "xjbhan_caocao": ["male", "han", 4, ["xin_zhibang", "xin_chuhui"], []],
                "xjbhan_xunyu": ["male", "han", 3, ["xin_bingjie", "xin_liuxiang"], []],
                "xjb_pangtong": ["male", "shu", 3, ["xin_niepan", "xin_lianhuan"], []],
                "xjb_caocao": ["male", "wei", 4, ["xin_guixin", "xin_fengtian", "xin_tanyan"], []],
                "xjb_zhouyu": ["male", "wu", 4, ["xin_shiyin", "xin_yingfa"], []],
                "xjb_liushan": ["male", "shu", 5, ["xjb_fangquan", "xjb_xiangle"], []],
                "xjb_dianwei": ["male", "wei", 5, ["xin_huzhu", "xin_xiongli"], []],
                "xjb_ganning": ["male", "wu", 4, ["xin_yexi", "xin_ziruo"], []],
                "xjb_zhugeliang": ["male", "shu", 3, ["xin_jincui", "xin_chushi"], []],
                "xjb_jin_simayi": ["male", "jin", 4, ["xin_huanshi", "xin_zhabing"], []],
                "xjb_yingzheng": ["male", "shen", 3, ["xin_tianming", "xin_zulong", "xin_longpan"], []],
                "xjb_fazheng": ["male", "shu", 3, ["xin_enyuan", "xin_qisuan", "xjb_fuyi"], []],
                "xjb_jiaxu": ["male", "qun", 3, ["xin_whlw2", "xin_whlw1"], ["ext:新将包/xjb_jiaxu.jpg", "xjb_jiaxu.jpg"]],
            }
            for (let k in character) {
                character[k][4].push("ext:新将包/" + k + ".jpg", k + ".jpg")
                lib.character[k] = character[k];
                lib.characterPack['XJB'][k] = character[k]
            }
        },
        CharacterPack: function () {
            lib.config.all.characters.push("xjb_soul");
            lib.characterPack['xjb_soul'] = lib.config.all.characters['xjb_soul']
            if (!lib.config.characters.includes("xjb_soul")) lib.config.characters.push("xjb_soul");
            lib.translate["xjb_soul_character_config"] = "soul";
            lib.characterPack["xjb_soul"] = {}
            lib.translate.xjb_soul = "soul"
            if (get.mode() == "boss") {
                lib.characterPack.xjb_soul.xjb_SoulBoss_zhankuang =
                    lib.character.xjb_SoulBoss_zhankuang =
                    ["none", "xjb_hun", 6, ["xin_htzjq2", "xin_fengtian", "xindangxian", "xinkuanggu"], ['boss', 'bossallowed', "ext:新将包/image/god.jpg"]]
                lib.characterPack.xjb_soul.xjb_SoulBoss_xuanfeng =
                    lib.character.xjb_SoulBoss_xuanfeng =
                    ["none", "xjb_hun", 5, ["rexuanfeng", "liefeng", "xin_yingfa", "xjb_fengzhu"], ['boss', 'bossallowed', "ext:新将包/image/god.jpg"]]
            }
            //芙爱派依
            const FuaipaiyiSkill = ['xjb_lingpiao']
            const FuaipaiyiElse = ['ext:新将包/soul_Fuaipaiyi.jpg']
            lib.character.xjb_Fuaipaiyi = ["female", "xjb_hun", 3, FuaipaiyiSkill, FuaipaiyiElse]
            lib.characterPack["xjb_soul"].xjb_Fuaipaiyi = lib.character.xjb_Fuaipaiyi
            //琪盎特儿
            const chanterSkill = ["xjb_soul_chanter"]
            const chanterElse = ['ext:新将包/soul_chanter.jpg']
            lib.character.xjb_chanter = ["female", "xjb_hun", 3, chanterSkill, chanterElse]
            lib.characterPack["xjb_soul"].xjb_chanter = lib.character.xjb_chanter
            //布劳德
            const xuemoSkill = ["xin_xueqi", "xjb_soul_fuhua"]
            const xuemoElse = [`ext:新将包/sink/xjb_xuemo/xuemo${[1, 2, 3].randomGet()}.jpg`]
            lib.character.xjb_xuemo = ["female", "xjb_hun", 2, xuemoSkill, xuemoElse]
            lib.characterPack["xjb_soul"].xjb_xuemo = lib.character.xjb_xuemo;
            //泰穆尔
            const timerSkill = ["xjb_minglou", "xjb_guifan"]
            const timerElse = ['ext:新将包/soul_timer.jpg']
            lib.character.xjb_timer = ["male", "xjb_hun", 3, timerSkill, timerElse]
            lib.characterPack["xjb_soul"].xjb_timer = lib.character.xjb_timer
            //凯瑞科瑞特
            game.updateRed = function () {
                var list = lib.config["xjb_redSkill"].list, keys = Object.keys(lib.skill)
                for (let i = 0; i < list.length; i++) {
                    var str = list[i]
                    if (!keys.includes(str.slice(13))) {
                        lib.config["xjb_redSkill"].list.remove(str)
                        i--
                    }
                    else {
                        game.xjb_EqualizeSkillObject(list[i], lib.skill[str.slice(13)])
                        lib.skill[str].audio = false
                        lib.translate[list[i]] = lib.config["xjb_redSkill"].translate[list[i]]
                        lib.translate[list[i] + "_info"] = lib.config["xjb_redSkill"].translate[list[i] + "_info"]
                    }
                }
            }
            game.updateRed()
            if (!lib.character.xjb_newCharacter) {
                let intro = lib.config.xjb_newcharacter.intro
                let sink = [lib.config.xjb_newcharacter.selectedSink], sex = lib.config.xjb_newcharacter.sex, group = lib.config.xjb_newcharacter.group, hp = lib.config.xjb_newcharacter.hp, skill = [...lib.config.xjb_newcharacter.skill]
                if (lib.config.xjb_newCharacter_isZhu == 1) sink.add("zhu")
                if (lib.config.xjb_newCharacter_hide == 1) sink.add("hiddenSkill")
                function xin_newCharacter() {
                    lib.characterIntro.xjb_newCharacter = intro
                    return [sex, group, hp, skill, sink];
                }
                lib.character.xjb_newCharacter = xin_newCharacter();
                lib.characterPack["xjb_soul"].xjb_newCharacter = lib.character.xjb_newCharacter;
            }
        },
        Sort: function () {
            lib.characterSort["xjb_soul"] = {
                "xjb_yangcheng": ["xjb_newCharacter"],
                "xjb_hunshi": Object.keys(lib.characterPack["xjb_soul"]).filter(i => lib.translate[i].indexOf("魂使") >= 0),
                "xjb_lingsu": ["xjb_chanter", "xjb_Fuaipaiyi", "xjb_xuemo"]
            }
            lib.characterSort['XJB'] = {
                'xjb_fengyun': ["xjb_zhangliang_liuhou", "xjb_yingzheng"],
                'xjb_chidan': ["xjb_ganning", "xjb_dianwei"],
                'xjb_tiandu': ["xjb_sunce", "xjb_zhouyu", "xjb_pangtong", "xjb_guojia", "xjb_fazheng"],
                'xjb_zaiwu': ["xjbhan_caocao", "xjbhan_xunyu", "xjb_caocao"],
                'xjb_jincui': ["xjb_zhugeliang", "xjb_liushan"],
                'xjb_guijin': ["xjb_jin_simayi"],
                'xjb_huahao': ["xjb_daqiao"],
            }
        },
        group: function () {
            lib.group.push('han');
            lib.translate['han'] = '汉';
            lib.groupnature.han = "fire"
            lib.group.push("xjb_hun");
            lib.translate['xjb_hun'] = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="32">'
            lib.groupnature.xjb_hun = "xjb_hun"
        },
        Intro: function () {
            lib.characterIntro.xjb_caocao = "操携樵沛诸夏侯曹氏，同汝颖荀之所进退，奋起于兖州之地。济天子，假天子之威，御天下之士，修政事，广屯田，征伐四方，十战九胜，可抵其锋者，唯孙刘二者。以其功高，自比于周公，置魏国，修行宫，立太子，分香卖履，薄葬于高陵。观其平生所则多杀戮，忿急至于过者亦多也。然其兴兴之政也广及率土三二，亦一世之雄也。";
            lib.characterIntro.xjb_yingzheng = "秦始皇，赵氏嬴姓，名政，是我国的第一位皇帝。\
他年少继位，\
奋六世之余烈，振长策而御宇内，吞二周而亡诸侯，履至尊而制六合，执敲扑而鞭笞天下，威震四海。\
";
        },
    }
    lib.skill.xjb_7 = {
        "ui_modify": function () {
            lib.skill.xjb_ui_dialog_append = {
                forced: true,
                trigger: {
                    player: "chooseButtonBegin"
                },
                content: function () {
                    var a = window.requestAnimationFrame(() => {
                        if (trigger.dialog && trigger.appendC) {
                            trigger.appendC.forEach(i => { trigger.dialog.add(i) })
                        }
                        cancelAnimationFrame(a)
                    })
                }
            }
        },
        ui: function () {
            ui.xjb_toBeHidden = function (ele) {
                if (arguments.length > 1) {
                    for (var i = 0; i < arguments.length; i++) {
                        ui.xjb_toBeHidden(arguments[i])
                    }
                    return;
                }
                ui.xjb_giveStyle(ele, { visibility: "hidden" })
            }
            ui.xjb_toBeVisible = function (ele) {
                if (arguments.length > 1) {
                    for (var i = 0; i < arguments.length; i++) {
                        ui.xjb_toBeVisible(arguments[i])
                    }
                    return;
                }
                ui.xjb_giveStyle(ele, { visibility: "visible" })
            }
            ui.xjb_addElement = function ({ target, tag, innerHTML, style, className, addclass, ctEvent, src, type, max, min, hideFun, display, inherit }) {
                let ele = document.createElement(tag);
                if (tag = "canvas") ele.setHW = function (height, width) { this.height = height; this.width = width; return this };
                if (tag == "div") ui.xjb_giveStyle(ele, { display: "block" });
                if (display) ui.xjb_giveStyle(ele, { display: display });
                ui.xjb_giveStyle(ele, { position: "relative" });
                target.appendChild(ele);
                if (innerHTML) {
                    if (tag == "textarea") ele.value = innerHTML;
                    else ele.innerHTML = innerHTML;
                }
                if (style) ui.xjb_giveStyle(ele, style);
                if (className) ele.className = className;
                if (addclass) ele.classList.add(...addclass);
                if (ctEvent) ele.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', ctEvent);
                if (src) ele.setAttribute('src', src);
                if (type) ele.setAttribute('type', type);
                if (max) ele.setAttribute('max', max);
                if (min) ele.setAttribute('min', min);
                if (hideFun) {
                    ele.hide = function () { ele.style.display = 'none' };
                    ele.show = function () { ele.style.display = display == 'none' ? 'block' : display };
                }
                if (inherit === true) ele.addElement = function ({ ...arg }) {
                    return ui.xjb_addElement({
                        ...arg,
                        target: this,
                    })
                };
                return ele;
            }
            //精准给出样式
            ui.xjb_giveStyle = function (target, styleList) {
                if (typeof styleList === "object" && styleList != null) {
                    for (let k in styleList) {
                        target.style[k] = styleList[k]
                    }
                } else if (typeof styleList === "string") {
                    try {
                        let parseList = JSON.parse(styleList)
                        return ui.xjb_giveStyle(target, parseList)
                    } catch (e) { }
                }
                return target
            }
            //添加头部样式
            ui.xjb_giveStyle2 = function (str) {
                var style = document.createElement("style")
                style.innerHTML = str
                document.head.appendChild(style)
            }
            ui.xjb_giveContent = function () {
                var list = []
                for (var i = 0; i < arguments.length - 1; i++) {
                    if (typeof arguments[i] === "string") {
                        list[i] = document.createElement("li")
                        list[i].innerHTML = arguments[i]
                        arguments[arguments.length - 1][0].appendChild(list[i])
                        if (arguments[arguments.length - 1][1]) ui.xjb_giveStyle(list[i], arguments[arguments.length - 1][1])
                        if (arguments[arguments.length - 1][2]) {
                            list[i].onclick = arguments[arguments.length - 1][2]
                        }
                    }
                }
                return list
            }
            //造书
            ui.create.xjb_book = (father, text) => {
                if (lib.xjb_library) {
                    let book = lib.xjb_library[text.headline + "-" + text.writer];
                    if (book) {
                        father.appendChild(book);
                        return book;
                    }
                }
                let book = document.createElement("div")
                ui.xjb_giveStyle(book, {
                    backgroundImage: `url(${lib.xjb_src}/lingli/book.jpg)`,
                    "background-size": "100% 100%",
                    padding: "25px",
                    "z-index": "10",
                    fontSize: "22px",
                    padding: "7%",
                    overflow: "auto"
                })
                book.className = "xjbToCenter"
                text.style && ui.xjb_giveStyle(book, text.style)
                father.appendChild(book)
                //添加标题和作者
                let headline = document.createElement("h4")
                let writer = document.createElement("h5")
                book.appendChild(headline)
                book.appendChild(writer)
                headline.className = "xjbHeadline"
                writer.className = "xjbWriter"
                let body = {
                    headline: headline,
                    writer: writer,
                    content: book
                }
                //这是一个填充内容的promise
                function Write(writeText, type) {
                    var wordsGroups = writeText.split("")
                    return new Promise(function (res) {
                        body.content.open = game.open;
                        body.headline.open = game.open;
                        body.writer.open = game.open;
                        book.cantTouch = true
                        let nowTarget = body[type];
                        let targetList = [body[type]];
                        let ignore = false
                        //返回上一级元素
                        function turnPre(bool) {
                            //如果已经是book的最高级元素，则跳过
                            if (nowTarget === body[type]) return;
                            //获取对象链中当前对象的索引
                            const index = targetList.indexOf(nowTarget);
                            if (!index) return;
                            //切换当前对象为上一级元素
                            nowTarget = targetList[index - 1];
                            //将当前对象从对象链中删除
                            targetList.splice(index, 1);
                            //清除ignore
                            ignore = false
                            //如果传入了true参数，进行迭代，使得当前对象切换为最高级元素                           
                            if (bool) turnPre(bool);
                        }
                        //增加对象            
                        function addTatget(tag, className, ignoreValue) {
                            //根据提供的tag和className创建元素
                            let toAdd = document.createElement(tag);
                            if (className) toAdd.classList.add(className)
                            //将target添加进去
                            body[type].appendChild(toAdd);
                            //将新加对象作为当前对象
                            nowTarget = toAdd;
                            //增加至对象链中
                            targetList.push(toAdd);
                            //设置ignore值
                            ignore = Boolean(ignoreValue)
                            //console.log(targetList,nowTarget)
                        }
                        let wonderfulTimer = window.requestAnimationFrame(function xjbWonderfulWriter() {
                            if (!wordsGroups.length) {
                                cancelAnimationFrame(xjbWonderfulWriter)
                                book.cantTouch = false
                                return res(writeText)
                            }
                            var theWord = wordsGroups.shift()
                            if (!ignore && theWord === "n") {
                                turnPre(true)
                                theWord = "</br>"
                            }
                            else if (!ignore && theWord === "A") {
                                if (nowTarget.nodeName.toLowerCase() === "span") turnPre()
                                else addTatget("span", "xjb2levelTitle");
                                return window.requestAnimationFrame(xjbWonderfulWriter)
                            }
                            else if (!ignore && theWord === "B") {
                                if (nowTarget.nodeName === "B") turnPre()
                                else addTatget("b");
                                return window.requestAnimationFrame(xjbWonderfulWriter)
                            }
                            else if (theWord === "く") {
                                theWord = wordsGroups.shift()
                            }
                            else if (theWord === "の") {
                                theWord = wordsGroups.shift()
                                if (get.pinyin) theWord = "<span xjb_pinyin=(" + get.pinyin(theWord) + ")>" + theWord + "</span>"
                            }
                            else if (theWord === "っ") {
                                let temp = Number(wordsGroups.shift()), temp1
                                temp1 = wordsGroups.splice(0, temp).join("")
                                theWord = wordsGroups.shift()
                                theWord = "<span xjb_pinyin=(" + temp1 + ")>" + theWord + "</span>"
                            }
                            else if (theWord === "ま") {
                                let chain = '', nowWord = wordsGroups.shift();
                                theWord = nowWord;
                                nowWord = wordsGroups.shift();
                                while (nowWord !== 'ま') {
                                    theWord += nowWord;
                                    nowWord = wordsGroups.shift();
                                }
                                nowWord = wordsGroups.shift()
                                while (nowWord !== 'ら') {
                                    chain += nowWord;
                                    nowWord = wordsGroups.shift();
                                }
                                theWord = "<span xjb_pinyin=(" + chain + ")>" + theWord + "</span>"
                            }
                            else if (theWord === "ぇ") {
                                if (nowTarget.nodeName.toLowerCase() === "a") {
                                    let chain = '', nowWord = wordsGroups.shift();
                                    while (nowWord !== 'こ') {
                                        chain += nowWord;
                                        nowWord = wordsGroups.shift();
                                    }
                                    nowTarget.setAttribute("href", chain);
                                    nowTarget.addEventListener('click', function () {
                                        location.href = this.href;
                                    })
                                    turnPre()
                                }
                                else {
                                    addTatget("a", void 0, true);
                                    ignore = true;
                                }
                                return window.requestAnimationFrame(xjbWonderfulWriter)
                                /*
                                let chain = '', nowWord = wordsGroups.shift();
                                theWord = nowWord;
                                nowWord = wordsGroups.shift();
                                while (nowWord !== 'ぇ') {
                                    theWord += nowWord;
                                    nowWord = wordsGroups.shift();
                                }
                                nowWord = wordsGroups.shift()
                                while (nowWord !== 'こ') {
                                    chain += nowWord;
                                    nowWord = wordsGroups.shift();
                                }
                                theWord = `<a onclick="location.href=this.href" href=${chain}>${theWord}</a>`
                                */
                            }
                            else if (theWord === "ア") {
                                if (nowTarget.nodeName.toLowerCase() === "i") {
                                    turnPre();
                                }
                                else {
                                    addTatget("i", void 0, true);
                                }
                                return window.requestAnimationFrame(xjbWonderfulWriter)
                            }
                            nowTarget.innerHTML = nowTarget.innerHTML + theWord
                            window.requestAnimationFrame(xjbWonderfulWriter)
                        })

                    })
                }
                Write(text.headline, "headline").then(function (data) {
                    return Write(text.writer, "writer")
                }).then(function (data) {
                    return Write(text.content, "content")
                })
                book.addEventListener("dblclick", () => book.remove())
                if (!lib.xjb_library) {
                    lib.xjb_library = {}
                }
                lib.xjb_library[text.headline + "-" + text.writer] = book
                return book
            }
            //幕布
            ui.create.xjb_curtain = function (father) {
                var back = document.createElement("div")
                if (!father) father = ui.window
                father.appendChild(back)
                ui.xjb_giveStyle(back, {
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(60,65,81,0.7)",
                    "z-index": "9",
                    "text-align": "center",
                    "font-size": "32px",
                })
                return back
            }
            ui.create.xjb_double = function (str) {
                let list = ui.create.xjb_back(str)
                let back = list[0], close = list[1]
                let back2 = document.createElement("div")
                back.appendChild(back2)
                ui.xjb_giveStyle(back2, {
                    margin: "auto",
                    width: "90%",
                    height: "100%",
                })
                let style = {
                    width: "334px",
                    height: "88%",
                    float: "left",
                    position: "relative",
                    "border-radius": "0.5em",
                    margin: "10px",
                    backgroundColor: "#3c4151",
                    opacity: "0.7",
                    padding: "3px"
                }
                let div1 = document.createElement("div")
                let div2 = document.createElement("div")
                ui.xjb_giveStyle(div1, style)
                ui.xjb_giveStyle(div2, style)
                back2.appendChild(div1)
                back2.appendChild(div2)
                //
                return {
                    close: close,
                    back: back,
                    container: back2,
                    left: div1,
                    right: div2
                }
            }
            //背景
            ui.create.xjb_back = function (str) {
                if (game.xjb_back && game.xjb_back.remove) {
                    game.xjb_back.remove()//若已有game.xjb_back则移除   
                }
                //创建back
                var back = ui.xjb_addElement({
                    target: ui.window,
                    tag: 'div',
                    className: 'interact_back',
                    hideFun: true,
                    display: 'inline-block',
                    style: lib.xjb_style.back
                })
                game.xjb_back = back//将back设置为game.xjb_back
                //点击close关闭back
                function closeIt() {
                    let modeActionList = {
                        close: () => { ui.window.removeChild(back); },
                        hide: () => { back.hide() }
                    };
                    const mode = this.dataset.closeMode, func = modeActionList[mode];
                    if (func) func();
                }
                //创建close
                var close = ui.xjb_addElement({
                    target: back,
                    tag: 'img',
                    className: 'close',
                    ctEvent: closeIt,
                    src: lib.xjb_src + 'image/xjb_close.png',
                    style: {
                        float: "left",
                        'width': '40px'
                    }
                });
                close.closeBack = closeIt;
                close.dataset.closeMode = 'close';
                if (str) {
                    var foot = ui.xjb_addElement({
                        target: back,
                        tag: 'div',
                        innerHTML: "-|" + str + "|-",
                        display: 'inline-block',
                        style: lib.xjb_style.foot
                    });
                    return [back, close, foot]
                }
                //
                return [back, close]//设置返回值为数组
            }
            //样式表
            lib.xjb_style = {
                textarea1: {
                    width: "99%",
                    margin: "auto",
                    height: "24px",
                    position: "relative",
                    fontSize: "24px"
                },
                back: {
                    width: "800px",
                    height: "400px",
                    position: "absolute",
                    margin: "auto",
                    'z-index': '8',
                    'right': '0px',
                    'top': '0px',
                    'left': '0px',
                    'bottom': '0px',
                    'border-radius': '3em',
                    'background-image': 'linear-gradient(to bottom right,#f0acf7,#7093DB,#f7f0ac)',
                    'border': '3px solid black',
                },
                foot: {
                    'position': 'absolute',
                    "font-size": "20px",
                    "font-family": "楷体",
                    width: "100%",
                    'color': "#D9D919",
                    "text-align": "center",
                    "margin-top": "370px",
                    "margin-left": "-40px"
                },
                cj_box: {
                    'font-size': '24px',
                    'border': '1px solid #4A766E',
                    'border-radius': '5em',
                    float: "left",
                    "margin-bottom": "14px"
                },
                storage_li: {
                    height: "92%",
                    width: "25%",
                    "background-color": "#e4d5b7",
                    "border-radius": "3em",
                    float: "left",
                    "margin-right": "8%",
                    color: "#041322",
                    "text-align": "center"
                },
                storage_ul: {
                    height: "30%",
                    width: "92%",
                    "border-radius": "2em",
                    "background-color": "#71291d",
                    border: "9px solid #cb6d51",
                    "list-style": "none",
                    "background-image": "",
                    "background-size": ""
                }
            }
        },
    }
    lib.skill.xjb_9 = {
        title: function () {
            //这个函数可以唤出武将介绍，如果填写了id，这为初始武将为角色id
            game.xjb_Intro = function (playerName) {
                //生成界面
                let intro = ui.create.xjb_double("这是可以查询武将进度之处")
                intro.right.style.overflow = "auto"
                //搜索部分
                let textarea = document.createElement("textarea")
                intro.left.appendChild(textarea)
                ui.xjb_giveStyle(textarea, {
                    margin: "auto",
                    width: "98%",
                    height: "24px",
                    fontSize: "24px"
                })
                textarea.onkeydown = function (e) {
                    if (e && e.keyCode === 13) {
                        event.cancelBubble = true;
                        event.preventDefault();
                        event.stopPropagation();
                        //现在所有角色的样式设置为块级元素
                        this.index.forEach(function (item) {
                            item.style.display = "block"
                        })
                        //如果是空字符则全部显示
                        //遍历索引，则令所有不含该字符的角色消失
                        this.index.forEach(function (item) {
                            if (item.innerHTML.indexOf(textarea.value) < 0) item.style.display = "none"
                        })
                    }
                };
                textarea.onkeyup = function () {
                    if (this.value === "") {
                        this.index.forEach(function (item) {
                            item.style.display = "block"
                        })
                    }
                }
                //创建放武将列表
                let ul = document.createElement("ul")
                intro.left.appendChild(ul)
                textarea.index = []
                ui.xjb_giveStyle(ul, {
                    overflow: "auto",
                    "list-style": "none",
                    paddingLeft: "0px",
                    width: "100%",
                    height: "300px",
                    backgroundColor: "#3c4151"
                })
                Object.keys(lib.config.xjb_count).forEach(function (item) {
                    if (lib.character[item]) {
                        //
                        let li = document.createElement("li")
                        li.innerHTML = `${get.translation(item)}(${item})`
                        textarea.index.add(li)
                        ul.appendChild(li)
                        ui.xjb_giveStyle(li, {
                            width: "90%",
                            fontSize: "20px",
                            color: "black",
                            border: "solid 1.5px",
                            backgroundColor: "white"
                        })
                        li.myName = item
                        li.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            //这是设置彩框
                            textarea.index.forEach(function (item) {
                                item.className = ""
                            })
                            this.className = "xjb_color_circle"
                            if (intro.left.I) intro.left.I.remove()
                            intro.right.character_id = item
                            intro.right.clear()
                        })
                    }
                })
                intro.right.clear = function () {
                    //清除技能   
                    intro.right.player.xjb_zeroise(intro.right.character_id)
                    intro.right.player.node.avatar.onclick = function () {
                        lib.soul[intro.right.player.name1] && lib.soul[intro.right.player.name1]()
                    };
                    intro.right.name.onclick = () => {
                        if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.name2()
                    };
                    intro.right.group.onclick = () => {
                        if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.group()
                    };
                    intro.right.sex.onclick = () => {
                        if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.sex()
                    };
                    intro.right.name.innerHTML = "<span data-nature='water'>姓名:" +
                        get.translation(intro.right.player.name1) + "</span>"
                    if (!lib.character[intro.right.player.name1]) return;
                    intro.right.group.innerHTML = "<span data-nature='wood'>势力:" +
                        get.translation(lib.character[intro.right.player.name1][1]) + "</span>"

                    intro.right.sex.innerHTML = "<span data-nature='soil'>性别:" +
                        get.xjb_translation(lib.character[intro.right.player.name1][0]) + "</span>"

                    intro.right.Title.innerHTML = "<span data-nature='metal'>称号</span>:<br>" +
                        (lib.characterTitle[intro.right.player.name1] && lib.characterTitle[intro.right.player.name1].indexOf('获得称号方式') > 0 ? "无" : lib.characterTitle[intro.right.player.name1])
                }
                let div = document.createElement("div")
                ui.xjb_giveStyle(div, {
                    width: "100%",
                    height: "180px",
                    position: "relative"
                })
                intro.right.appendChild(div)
                let player = ui.create.player()
                player.init("xin_fellow")
                intro.right.player = player
                intro.right.character_id = playerName || "xin_fellow"
                //调整样式
                ui.xjb_giveStyle(player, {
                    marginTop: "-48px",
                    position: "relative"
                })
                div.appendChild(player)
                //设置信息列表
                let infor = document.createElement("ul")
                ui.xjb_giveStyle(infor, {
                    float: "right",
                    overflow: "auto",
                    width: "50%",
                    height: "180px",
                    marginTop: "0px",
                    "list-style": "none",
                    paddingLeft: "0px",
                    fontSize: "24px"
                })
                div.appendChild(infor)
                let li1 = document.createElement("li")
                infor.appendChild(li1)
                intro.right.name = li1
                let li2 = document.createElement("li")
                infor.appendChild(li2)
                intro.right.group = li2
                let li3 = document.createElement("li")
                infor.appendChild(li3)
                intro.right.sex = li3
                let li4 = document.createElement("li")
                infor.appendChild(li4)
                intro.right.Title = li4
                let hr = document.createElement("hr")
                intro.right.appendChild(hr)
                //这里是tab栏
                let tab = document.createElement("div")
                intro.right.appendChild(tab)
                ui.xjb_giveStyle(tab, {
                    paddingLeft: "12px",
                    position: "relative",
                    overflow: "auto",
                    height: "11%",
                    width: "100%"
                })
                function addButton(str) {
                    let button = ui.create.xjb_button(tab, str)
                    ui.xjb_giveStyle(button, {
                        marginLeft: "0px",
                        marginRight: "21px",
                        marginBottom: "5px",
                        height: "24px",
                        fontSize: "20px",
                        padding: "5px"
                    })
                    return button
                }
                //设置数据一览
                let data = addButton("<span data-nature='key'>数据一览</span>")
                intro.right.dataSet = data
                data.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                    if (intro.left.I) intro.left.I.remove()
                    let xjb_count_data = document.createElement("ul")
                    ui.xjb_giveStyle(xjb_count_data, {
                        fontSize: "20px",
                        "list-style": "none",
                        paddingLeft: "0px",
                    })
                    intro.right.appendChild(xjb_count_data)
                    intro.left.I = xjb_count_data
                    let count = lib.config.xjb_count[intro.right.character_id]
                    //排序
                    let arr1 = Object.keys(count).filter(item => {
                        if (["selectedTitle", "HpCard", "uniqueSkill", "titles", "skill", "xjb_storage", "dialog", "book", "daomo", "lingtan", "lingfa"].includes(item))
                            return false
                        return true
                    })
                    arr1.sort(function (a, b) {
                        if (lib.xjb_list_xinyuan._order[a] && lib.xjb_list_xinyuan._order[b]) {
                            return (lib.xjb_list_xinyuan._order[a] - lib.xjb_list_xinyuan._order[b])
                        }

                        return a > b ? 1 : -1
                    })
                    arr1.forEach(function (item) {
                        let countA = document.createElement("li"), theStr
                        if (item === "ice") {
                            theStr = "<span data-nature='ice'>"
                        } else if (item === "fire" || item.indexOf('zhu') >= 0 || item.indexOf('landlord') >= 0) {
                            theStr = "<span data-nature='fire'>"
                        } else if (item === "thunder" || item.indexOf('nei') >= 0) {
                            theStr = "<span data-nature='thunder'>"
                        } else if (item.indexOf('fan') >= 0 || item.indexOf('farmer') >= 0) {
                            theStr = "<span data-nature='wood'>"
                        } else if (item.indexOf('zhong') >= 0) {
                            theStr = "<span data-nature='orange'>"
                        } else if (get.xjb_translation(item).indexOf('场') >= 0) {
                            theStr = "<span data-nature='kami'>"
                        } else {
                            theStr = "<span data-nature='metal'>"
                        }
                        countA.innerHTML = `${theStr}${get.xjb_translation(item)}:${count[item]}</span>`
                        xjb_count_data.appendChild(countA)
                    })
                })
                //设置称号设定
                let title = addButton("<span data-nature='key'>称号一览</span>")
                intro.right.titleSet = title
                title.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                    if (intro.left.I) intro.left.I.remove()
                    let xjb_count_title = document.createElement("ul")
                    ui.xjb_giveStyle(xjb_count_title, {
                        fontSize: "20px",
                        "list-style": "none",
                        paddingLeft: "0px",
                        width: "80%"
                    })
                    intro.right.appendChild(xjb_count_title)
                    intro.left.I = xjb_count_title
                    let count = lib.config.xjb_count[intro.right.character_id].titles
                    count.forEach(function (item) {
                        let countA = document.createElement("li")
                        countA.innerHTML = item
                        xjb_count_title.appendChild(countA)
                        countA.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            game.xjb_create.confirm('是否将' + item + '设置为你的称号', function () {
                                lib.config.xjb_count[intro.right.character_id].selectedTitle = item
                                game.saveConfig("xjb_count", lib.config.xjb_count)
                                game.xjb_create.alert("已设置成功，重启即生效！")
                            })
                        })
                    })
                    if (true) {
                        let countA = document.createElement("li")
                        countA.innerHTML = "<span data-nature='key'>双击查看获取称号方法！</span>"
                        countA.addEventListener('dblclick', function () {
                            game.xjb_create.condition(
                                lib.xjb_title_condition,
                                lib.config.xjb_count[intro.right.character_id].titles2
                            )
                        })
                        xjb_count_title.appendChild(countA)

                    }
                })
                //背包设定
                let bag = addButton("<span data-nature='key'>背包查看</span>")
                intro.right.bagSet = bag
                bag.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                    if (intro.left.I) intro.left.I.remove()
                    let xjb_count_bag = document.createElement("ul")
                    ui.xjb_giveStyle(xjb_count_bag, {
                        fontSize: "20px",
                        "list-style": "none",
                        paddingLeft: "0px",
                        width: "80%"
                    })
                    intro.right.appendChild(xjb_count_bag)
                    intro.left.I = xjb_count_bag
                    game.xjb_getSb.means(intro.right.character_id).forEach(i => {
                        i.num > 0 && xjb_count_bag.appendChild(i.organize())
                    })
                    if (!xjb_count_bag.children.length) {
                        let countA = document.createElement("li")
                        countA.innerHTML = "你背包内没有任何东西！"
                        xjb_count_bag.appendChild(countA)
                        ui.xjb_giveStyle(xjb_count_bag, {
                            marginTop: "20px",
                        })
                    }
                })
                intro.right.clear()
                for (let y in intro) {
                    if (y === "back") continue
                    intro.back[y] = intro[y]
                }
                return intro
            }
            game.xjb_Intro2 = function (playerName) {
                if (!game.xjb_Introduction) {
                    game.xjb_Introduction = game.xjb_Intro().back
                    game.xjb_back = null
                    game.xjb_Introduction.close.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', game.xjb_Introduction.close.closeBack)
                    game.xjb_Introduction.close.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                        game.xjb_Introduction.style.display = "none"
                    })
                }
                game.xjb_Introduction.style.display = "block"
                game.xjb_Introduction.right.character_id = playerName || "xin_fellow"
                game.xjb_Introduction.right.clear()
                return game.xjb_Introduction
            }
        },
        storage: function () {
            /*ui.create.xjb_storage只有一个参数，这个参数是用来设置底部文字的*/
            ui.create.xjb_storage = function (str) {
                //创建背景   
                var list = ui.create.xjb_back(str)
                var back = list[0] //这是背景
                var theX = list[1] //这是关闭键
                //创建存档区
                var div_1 = ui.xjb_addElement({
                    target: back,
                    tag: 'div',
                    style: {
                        height: "75%", width: "90%", margin: "4% auto", display: 'inline-block',
                        "border-radius": "1em", overflow: "auto", position: 'absolute'
                    }
                })
                //这个是下方操作区
                var ul = ui.xjb_addElement({
                    target: back,
                    tag: 'ul',
                    style: {
                        height: "8%", width: "90%", "background-color": "#996600",
                        "margin": "42% 0 0 1.5%", "border-radius": "5em",
                        border: "8px solid #f4a460", "list-style": "none", position: 'absolute'
                    }
                })
                //这是三个操作区按键
                function createKey(innerHTML) {
                    return ui.xjb_addElement({
                        target: ul,
                        tag: 'li',
                        innerHTML: innerHTML,
                        style: lib.xjb_style.storage_li
                    })
                }
                var li_1 = createKey("创建存档");
                var li_2 = createKey("读取存档");
                var li_3 = createKey("删除存档");
                return {
                    back: back,
                    div_1: div_1,
                    ul: ul,
                    li_1: li_1,
                    li_2: li_2,
                    li_3: li_3,
                    close: theX
                }
            }
            /*ui.create.xjb_theStorage有两个参数，第一个为其父元素，第二个为存档号*/
            ui.create.xjb_theStorage = function (storage, num) {
                //创建一个存档
                var div = document.createElement('ul')
                ui.xjb_giveStyle(div, lib.xjb_style.storage_ul)
                if (storage.children.length > 0) {
                    ui.xjb_giveStyle(div, { "margin-top": "20px", })
                } //如果不是第一个存档，则给一个上边距           
                //设置存档内容的抬头
                /*ui.xjb_giveContent函数最后一个元素为数组，设置父元素及子元素样式，
                前面为字符串有多少个则创建多少个li子元素，且子元素的内容和字符串内容相同*/
                var sto_list = ui.xjb_giveContent("<b>存档号</b>", "<b>存档角色</b>", "<b>关卡信息</b>", "<b>存档时间</b>", [div, {
                    height: "94%",
                    width: "17%",
                    float: "left",
                    "margin-right": "8%",
                    fontSize: "15px",
                    "text-align": "center"
                }])
                //设置被记录存档号
                div.num = num
                sto_list[0].num = num
                game.saveConfig("xjb_myStorage", lib.config.xjb_myStorage)
                //设置存档号
                var str = "" + sto_list[0].num
                while (str.length < 7) str = "0" + str//不足七位用零补齐
                var p1 = ui.xjb_addElement({
                    target: sto_list[0],
                    tag: "p",
                    innerHTML: str,
                })
                storage.appendChild(div)//将以上内容放入父节点
                //设置存档被点击后的事件
                div.update = function () {
                    game.pause()
                    Array.from(storage.children).forEach((i, k) => {
                        i.id = ""
                        ui.xjb_giveStyle(i, lib.xjb_style.storage_ul)
                    })
                    this.id = "xjb_storage_theStorage"
                    this.map = lib.config.xjb_myStorage[this.num]
                    this.setAttribute('xjb_information', `存档信息:编号:${this.num} 时间:${this.map.date} 关卡:${this.map.level.name}                
武将名称:${this.map.character.name}(${this.map.character.id}),
武将状态:体力:${this.map.character.hp}/${this.map.character.maxHp}  护甲:${this.map.character.hujia} 横置:${this.map.character.linked} 翻面:${this.map.character.turnedOver},
手牌区牌数/装备区牌数/判定区牌数/特殊区牌数/武将牌上牌数:${this.map.character.h.length}/${this.map.character.e.length}/${this.map.character.j.length}/${this.map.character && this.map.character.s && this.map.character.s.length}/${this.map.character && this.map.character.x && this.map.character.x.length},
`)
                };
                div.onclick = () => div.update();
                return {
                    ul: div,
                    theNum: sto_list[0],
                    theCharacter: sto_list[1],
                    theLevel: sto_list[2],
                    theTime: sto_list[3]
                };
            }
            //读档函数
            game.xjb_storage_1 = function (player, bool) {
                //创建存档
                var storage = ui.create.xjb_storage()
                //引入存档信息
                for (var i in lib.config.xjb_myStorage) {
                    if (typeof lib.config.xjb_myStorage[i] === "object") {
                        var thelist = ui.create.xjb_theStorage(storage.div_1, get.xjb_number(i))//storage.div_1，即放存档的地方
                        var target = lib.config.xjb_myStorage[i]
                        const eachPartSet = [
                            { target: thelist.theTime, innerHTML: target.date },
                            { target: thelist.theCharacter, innerHTML: target.character.name },
                            { target: thelist.theLevel, innerHTML: target.level.name }
                        ];
                        eachPartSet.forEach(k => {
                            ui.xjb_addElement({ ...k, tag: 'p' })
                        })
                        if (bool === true) {
                            if (target.level.Type != _status.xjb_level.Type) thelist.ul.style.display = "none"
                        }
                    }
                }
                //设置存档操作键1事件
                storage.li_1.onclick = function () {
                    //创建存档
                    var list = ui.create.xjb_theStorage(storage.div_1, ++lib.config.xjb_myStorage.total)
                    //设置存档信息
                    lib.config.xjb_myStorage[list.theNum.num] = {}
                    var obj = lib.config.xjb_myStorage[list.theNum.num]
                    //存档角色信息
                    obj.character = {
                        id: player.name1,
                        name: "",
                        hp: Math.max(player.hp, 1),
                        maxHp: player.maxHp,
                        hujia: player.hujia,
                        linked: player.isLinked(),
                        turnedOver: player.isTurnedOver(),
                        h: [],
                        e: [],
                        j: [],
                        x: [],
                        s: []
                    }
                    //存档关卡信息
                    obj.level = {
                        name: _status.xjb_level.name,
                        number: _status.xjb_level.number,
                        Type: _status.xjb_level.Type
                    }
                    var time = game.xjb_getCurrentDate();
                    var str = `${time[0]}-${time[1]}-${time[2]}-${time[3]}-${time[4]}`;
                    obj.date = str;
                    const restPartSet = [
                        { target: list.theTime, innerHTML: obj.date },
                        { target: list.theCharacter, innerHTML: obj.character.name },
                        { target: list.theLevel, innerHTML: obj.level.name }
                    ];
                    restPartSet.forEach(k => {
                        ui.xjb_addElement({ ...k, tag: 'p' })
                    })
                    player.xjb_updateStorage()
                }
                //设置操作2键事件
                storage.li_2.onclick = storage.li_2.read = function () {
                    //获取选中存档
                    var theLoad = document.getElementById('xjb_storage_theStorage')
                    if (theLoad) {
                        //读档                    
                        game.pause()
                        var theObj = theLoad.map;
                        game.xjb_bossLoad(theObj.level.number, player);
                        //引入角色
                        var obj = theObj.character;
                        if (obj.id !== "") player.reinit(player.name1, obj.id);
                        //设置属性
                        ["maxHp", "hp", "hujia"].forEach(att => {
                            player[att] = obj[att]
                        });
                        //执行函数
                        const attActionList = [
                            ['link', obj.linked],
                            ['turnOver', obj.turnedOver],
                            ['lose', player.getCards("hejsx")],
                            ['gain', game.xjb_cardFactory(...obj.h)]
                        ];
                        attActionList.forEach(k => {
                            let func = k[0], arg = k[1];
                            player[func](arg)
                        });
                        //处理其他区域
                        const areaActionList = [
                            ['e', card => player.equip(card)],
                            ['j', card => player.addJudge(card)],
                            ['s', card => player.loseToSpecial(card, card.gaintag[0])],
                            ['x', card => player.addToExpansion(card).gaintag.add(card.gaintag[0])],
                        ];
                        areaActionList.forEach(k => {
                            let area = k[0], callback = k[1]
                            let cards = game.xjb_cardFactory(...obj[area]);
                            cards.forEach(callback)
                        })
                        //关闭
                        storage.back.remove()
                        game.resume()
                    }
                    player.xjb_updateStorage()
                }
                //删档
                storage.li_3.onclick = function () {
                    var theRemove = document.getElementById('xjb_storage_theStorage')
                    if (theRemove) {
                        theRemove.remove()
                        lib.config.xjb_myStorage[theRemove.num] = null
                        game.saveConfig("xjb_myStorage", game.xjb_filterData(["config", "xjb_myStorage"]))

                    }
                    player.xjb_updateStorage()
                }
                storage.close.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', game.resume)
                return { li_1: storage.li_1, li_2: storage.li_2, li_3: storage.li_3, close: storage.close, storageArea: storage.div_1 }
            }
            //存档函数
            game.xjb_storage_2 = function (player, bool) {
                var step1 = game.xjb_storage_1(player, bool)
                step1.li_2.innerHTML = "覆盖存档"
                step1.li_2.onclick = function () {
                    var theUpdate = document.getElementById('xjb_storage_theStorage')
                    if (theUpdate) {
                        var obj = lib.config.xjb_myStorage[theUpdate.num], time = game.xjb_getCurrentDate()
                        var str = `${time[0]}-${time[1]}-${time[2]}-${time[3]}-${time[4]}`
                        obj.date = str
                        obj.character.id = player.name1
                        obj.character.name = get.translation(player.name1)
                        obj.character.hp = player.hp
                        obj.character.maxHp = player.maxHp
                        obj.character.hujia = player.hujia
                        obj.character.linked = player.isLinked(),
                            obj.character.turnedOver = player.isTurnedOver(),
                            obj.character.h = player.xjb_getAllCards("h")
                        obj.character.e = player.xjb_getAllCards("e")
                        obj.character.j = player.xjb_getAllCards("j")
                        obj.character.x = player.xjb_getAllCards("x")
                        obj.character.s = player.xjb_getAllCards("s")
                        obj.level = {
                            name: _status.xjb_level.name,
                            number: _status.xjb_level.number,
                        }
                        game.saveConfig("xjb_myStorage", game.xjb_filterData(["config", "xjb_myStorage"]))
                        var p = theUpdate.getElementsByTagName("p")
                        p[3].innerHTML = obj.date
                        p[2].innerHTML = obj.level.name
                        p[1].innerHTML = obj.character.name
                    }
                    player.xjb_updateStorage()
                    theUpdate.update()
                }
                return { li_1: step1.li_1, li_2: step1.li_2, li_3: step1.li_3, close: step1.close, storageArea: step1.storageArea }
            }
        },
        math: function () {
            game.xjb_LZ_project = function () {
                var obj = ui.create.xjb_storage("点击投资区按钮可以选择投资的魂币额度，我们将考虑反馈打卡点！")
                obj.back.removeChild(obj.ul)
                var list = [ui.create.xjb_theStorage(obj.div_1),
                ui.create.xjb_theStorage(obj.div_1),
                ui.create.xjb_theStorage(obj.div_1)]
                var addP = function (element, str1, str2) {
                    element.innerHTML = '<b>' + str1 + '</b>'
                    var p = document.createElement("p")
                    p.innerHTML = str2
                    element.appendChild(p)
                    ui.xjb_giveStyle(element, { color: '#b0e0e6' })
                }
                var name = ['割圆术', '黄金分割', '自然常数']
                var π = lib._xjb["Math_doPI"], e = lib._xjb["Math_doe"], Φ = lib._xjb["Math_doΦ"]
                var num = [π(lib.config.xjb_π), Φ(lib.config.xjb_Φ), e(lib.config.xjb_e)]
                var project = ["xjb_π", "xjb_Φ", "xjb_e"]
                for (var i = 0; i < list.length; i++) {
                    list[i].ul.onclick = undefined
                    list[i].ul.className = "xjb_ul_storage"
                    addP(list[i].theNum, '项目名', name[i])
                    addP(list[i].theCharacter, '当前值', num[i])
                    addP(list[i].theLevel, '投资区', '<span class=1>×1</span><span class=6>×6</span><span class=36>×36</span><span class=216>×216</span>')
                    var spans = list[i].ul.getElementsByTagName("span")
                    for (var a = 0; a < spans.length; a++) {
                        function constructor(str) {
                            return function () {
                                var number = get.xjb_number(this.className)
                                if (lib.config.xjb_hunbi >= number) {
                                    game.xjb_systemEnergyChange(number * game.xjb_currencyRate.secondRate)
                                    game.cost_xjb_cost(1, number, '投资')
                                    lib.config[str] += number
                                    game.saveConfig(str, lib.config[str])
                                    if (Math.random() * 50 < Math.min(number, 49)) {
                                        game.saveConfig("xjb_hundaka2", lib.config["xjb_hundaka2"] + 1)
                                        game.xjb_create.alert('你知道的，你要的报酬到了，打卡点数已增加');
                                    }
                                    else game.xjb_create.alert('今日你所捐的，于你亦是有益的，数学会让你见识它的伟大力量。');
                                    game.xjb_LZ_project()
                                } else { game.xjb_create.alert("佯装行善，夸下海口，却无子，去罢。") }
                            }
                        }
                        spans[a].onclick = constructor(project[i])
                    }
                    ui.xjb_giveStyle(list[i].theLevel, { width: "32%" })
                    ui.xjb_giveStyle(list[i].theCharacter, { width: "24%" })
                    ui.xjb_giveStyle(list[i].theNum, { width: "15%" })
                    list[i].theTime.remove()
                }
            }
        },
        chupingjisha: function () {
            game.xjb_cpjsLoad = function () {
                if (lib.config.xjb_chupingjisha === 1 && lib.config.xjb_systemEnergy > 0) return lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()
                return false
            };
            game.xjb_cpjsRemove = function () {
                if (lib.config.xjb_chupingjisha === 2 || lib.config.xjb_systemEnergy < 0) {
                    ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove();
                };
            }
        }
    }
    lib.skill.xjb_12 = {
        sub: function () {
            //养成类
            game.xjb_newCharacterGetTitle = function (num = 1) {
                let list2 = new Array()
                for (let b = 0; b < num; b++) {
                    list2.push(Math.round(Math.random() * (lib.config.xjb_title.length - 1)))
                }
                let str = '恭喜' + get.translation('xjb_newCharacter') + '解锁了称号:<br>'
                for (let c = 0; c < list2.length; c++) {
                    str += lib.config.xjb_title[list2[c]][0]
                    if (!lib.config.xjb_title[list2[c]][1].includes('xjb_newCharacter')) {
                        game.xjb_getHunbi(50, void 0, void 0, void 0, '抽奖获取称号')
                        lib.config.xjb_title[list2[c]][1].push('xjb_newCharacter')
                        game.saveConfig('xjb_title', lib.config.xjb_title);
                    }
                }
                game.xjb_create.alert(str)
                game.xjb_systemEnergyChange(-5 * num)
            }
            game.xjb_newCharacterChangeName = function (num = 1, free) {
                game.xjb_create.prompt("请输入你更改后的姓名", lib.config.xjb_newcharacter.name2, function () {
                    if (this.result !== "") {
                        lib.config.xjb_newcharacter.name2 = this.result
                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                        game.xjb_create.alert("你已更名为:<br>" + lib.config.xjb_newcharacter.name2 + "。<br>重启即更新数据");
                        game.xjb_systemEnergyChange(-5)
                    }
                }).inputSmall()
            }
            game.xjb_newCharacterChangeSex = function (num = 1, free) {
                const informationList = {
                    object: "changeSexCard",
                    num: num,
                    free: free,
                    list: ['male', 'female', 'none', 'unknown', 'double'],
                    previousPrice: 5,
                    objectName: '性转卡',
                    changeFunc: function (newAttribute) {
                        lib.config.xjb_newcharacter.sex = newAttribute
                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                        game.xjb_create.alert("已更改为:" + get.xjb_translation(lib.config.xjb_newcharacter.sex) + "，<br>重启即更新数据");
                    }
                }
                game.xjb_create.UABobjectsToChange(informationList)
            }
            lib.config.xjb_developer = false
            game.xjb_newCharacterChangeGroup = function (num = 1, free) {
                const informationList = {
                    object: "changeGroupCard",
                    num: num,
                    free: free,
                    list: ["key", "western"].concat(lib.group),
                    previousPrice: 4,
                    objectName: '择木卡',
                    changeFunc: function (newAttribute) {
                        lib.config.xjb_newcharacter.group = newAttribute
                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                        game.xjb_create.alert("已更改为:" + get.xjb_translation(lib.config.xjb_newcharacter.group) + "，<br>重启即更新数据");
                    }
                }
                game.xjb_create.UABobjectsToChange(informationList)
            }
            game.xjb_newCharacterAddJnc = function (num = 1) {
                lib.config.xjb_jnc += num
                game.saveConfig('xjb_jnc', lib.config.xjb_jnc);
                game.xjb_create.alert('你当前技能槽数量为:<br>' + lib.config.xjb_jnc)
                game.xjb_systemEnergyChange(-50 * num)
            }
            game.xjb_newCharacterAddHp = function (num = 1, free) {
                var hp = lib.config.xjb_newcharacter.hp
                if (hp >= 8) return game.xjb_create.alert("你的体力值已达到最大！")
                if (hp + num > 8) num = 8 - hp;
                var countCostE = function () {
                    let count = 0, i = 0
                    while (i < num) {
                        count += (hp + i) * (hp + i) * 2
                        i++
                    }
                    return count
                }
                var cost = hp * hp * 2
                function addHp(func) {
                    lib.config.xjb_newcharacter.hp += num
                    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                    var hp_str = '你现在体力值为:<br>' + lib.config.xjb_newcharacter.hp + '<br>重启即更新数据'
                    game.xjb_create.alert(hp_str, func)
                    game.xjb_systemEnergyChange(-countCostE())
                }
                if (free === false) {
                    game.xjb_create.confirm('你已有' + lib.config.xjb_newcharacter.hp + '点体力。<br>加1点体力需要' + cost + '个魂币。<br>确定要增加吗？', function () {
                        if (lib.config.xjb_hunbi < cost) return game.xjb_create.alert("你的魂币不足！")
                        game.cost_xjb_cost(1, cost, '增加养成武将体力值')
                        addHp(function () {
                            game.xjb_create.confirm('是否继续？', function () {
                                game.xjb_newCharacterAddHp(1, false)
                            })
                        })
                        game.xjb_systemEnergyChange(-countCostE() - 20)
                    })
                } else addHp()
            }
        }
    }
}
