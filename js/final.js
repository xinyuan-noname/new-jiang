window.XJB_LOAD_FINAL = function (_status, lib, game, ui, get, ai) {
    lib.skill.xjb_final = {
        RPG: function () {
            {
                if (!ui.create.xjb_curtain) return false
            }
            game.xjb_RPG_reload = this.RPG
            let xjb_rpg = document.createElement("div")
            xjb_rpg.style.height = "100%"
            xjb_rpg.style.width = "100%"
            ui.window.appendChild(xjb_rpg)
            ui.xjb = {}
            ui.xjb.RPG = xjb_rpg
            //创建幕布
            var back = ui.create.xjb_curtain(ui.xjb.RPG)
            back.style["background-size"] = "100% 100%"
            back.style.opacity = "1"
            //创建对话栏
            var div = document.createElement("div")
            ui.xjb.RPG.appendChild(div)
            ui.xjb.RPG.dialog = div
            var img = document.createElement("div");
            ui.xjb.RPG.appendChild(img);
            var name = document.createElement("div");
            ui.xjb.RPG.appendChild(name);
            var skip = document.createElement("div");
            ui.xjb.RPG.appendChild(skip);
            skip.innerHTML = "跳过>>"
            ui.xjb_giveStyle(skip, {
                height: "34px",
                fontSize: "32px",
                position: "relative",
                float: "right",
                top: "12px",
                right: "5px",
                "z-index": "9",
            })
            skip.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                let vanish = [...ui.xjb.RPG.funcList]
                cancelAnimationFrame(ui.xjb.RPG.interval)
                ui.xjb.RPG.remove()
                game.xjb_RPG_reload()
                let wonderfulRPGSkip = window.requestAnimationFrame(function () {
                    ui.xjb.RPG.funcList = [...vanish]
                    if (ui.xjb.RPG.funcList[0]) {
                        let myduty = ui.xjb.RPG.funcList.shift()
                        myduty()
                    }
                    cancelAnimationFrame(wonderfulRPGSkip)
                })
            })
            ui.xjb.RPG.style.display = "none"
            let textintoit = function (text, it) {
                var writeText = text
                var wordsGroups = writeText.split(""), z = 0
                function write() {
                    z++
                    if (!wordsGroups.length) {
                        it.cantTouch = false
                        return cancelAnimationFrame(ui.xjb.RPG.interval)
                    }
                    if (z % 3 === 0) {
                        var theWord = wordsGroups.shift()
                        it.innerHTML = it.innerHTML + "<span>" + theWord + "</span>"
                    }
                    it.cantTouch = true
                    ui.xjb.RPG.interval = window.requestAnimationFrame(write)
                }
                ui.xjb.RPG.interval = window.requestAnimationFrame(write)
            }
            ui.create.xjb_dialog = function (src, Name, color, str, backSrc) {
                ui.xjb.RPG.style.display = "block";
                (function () {
                    ui.xjb_giveStyle(div, {
                        width: "80.3%",
                        height: "28%",
                        backgroundColor: "#71d9e2",
                        border: "10px solid #00bfff",
                        opacity: "0.80",
                        "font-size": "24px",
                        "z-index": "9",
                        paddingLeft: "18%",
                        paddingTop: "2%",
                        paddingBottom: "2%",
                    })
                    ui.xjb_giveStyle(div, {
                        top: `${ui.xjb.RPG.offsetHeight - div.offsetHeight}px`
                    });
                    div.innerHTML = ""
                    textintoit(str, div)
                })();
                //创建人物图         
                ui.xjb_giveStyle(img, {
                    height: "30%",
                    width: "13%",
                    marginLeft: "2%",
                    "z-index": "9",
                    backgroundImage: `url(${src})`,
                    "background-size": "cover",
                    "background-repeat": "no-repeat"
                });
                ui.xjb_giveStyle(img, {
                    top: `${ui.window.offsetHeight - div.offsetHeight + (div.offsetHeight - img.offsetHeight) / 2}px`
                })
                div.picture = img
                ui.xjb_giveStyle(name, {
                    height: "7%",
                    width: "17%",
                    backgroundColor: "#71d9e2",
                    "z-index": "9",
                    "border-bottom-right-radius": "3em",
                    "border-top-right-radius": "3em",
                    border: `1px solid ${color}`,
                    color: "" + color,
                    "font-size": "28px",
                    "text-align": "center",
                    paddingTop: "6px",
                    opacity: "0.80",
                });
                ui.xjb_giveStyle(name, {
                    top: `${ui.window.offsetHeight - div.offsetHeight - name.offsetHeight / 1.5}px`
                })
                div.name = name
                div.curtain = back
                name.innerHTML = `${Name}`
                if (backSrc) back.style.backgroundImage = `url(${backSrc})`
                return {
                    curtain: back,
                    dialog: div,
                    name: name
                }
            }
            game.xjb_RPGnext = function (func) {
                if (!ui.xjb.RPG.funcList) {
                    ui.xjb.RPG.funcList = [];
                    return
                }
                let next = ui.xjb.RPG.funcList.shift()
                if (typeof next === "function") next()
                return game
            }
            game.xjb_RPGEventAdd = function (func) {
                if (!ui.xjb.RPG.funcList) ui.xjb.RPG.funcList = [];
                if (func) ui.xjb.RPG.funcList.push(func)
                return game
            }
            game.xjb_dialog = function (Array, func) {
                if (!ui.xjb.RPG.funcList) ui.xjb.RPG.funcList = [];
                if (ui.xjb.RPG.doing === true) {
                    ui.xjb.RPG.funcList.push(() => game.xjb_dialog(Array))
                    if (func) ui.xjb.RPG.funcList.push(func)
                }
                if (ui.xjb.RPG.doing === true) return
                if (func) ui.xjb.RPG.funcList = [func, ...ui.xjb.RPG.funcList]
                ui.xjb.RPG.doing = true
                var obj = ui.create.xjb_dialog(...Array[0])
                obj.dialog.num = 0
                obj.dialog.Maxnum = Array.length - 1
                obj.dialog.Array = Array
                function fc() {
                    var i = this.num
                    if (this.cantTouch === true) {//判断是否还在显示文字
                        cancelAnimationFrame(ui.xjb.RPG.interval)
                        this.innerHTML = this.Array[i][3]
                        return this.cantTouch = false
                    }
                    if (i >= this.Maxnum) {
                        ui.xjb.RPG.style.display = "none"
                        ui.xjb.RPG.doing = false
                        if (ui.xjb.RPG.funcList[0]) {
                            let myduty = ui.xjb.RPG.funcList.shift()
                            myduty()
                        }
                        this.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', fc)
                    }
                    else {
                        this.num = (++i)
                        this.innerHTML = ""
                        if (this.Array[i][0]) ui.xjb_giveStyle(this.picture, { backgroundImage: `url(${this.Array[i][0]})` })
                        if (this.Array[i][1]) this.name.innerHTML = `${this.Array[i][1]}`
                        if (this.Array[i][2]) {
                            ui.xjb_giveStyle(this.name, {
                                border: `1px solid ${this.Array[i][2]}`,
                                color: "" + this.Array[i][2]
                            })
                        }
                        if (this.Array[i][3]) {
                            textintoit(this.Array[i][3], this)

                        } else {
                            this.Array[i][3] = this.Array[i - 1][3]
                            textintoit(this.Array[i][3], this)
                        }
                        if (this.Array[i][4]) this.curtain.style.backgroundImage = `url(${this.Array[i][4]})`
                    }
                }
                obj.dialog.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', fc)
            }
        },
        XJB_Card: function () {
            let cardList = {
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
            };
            window.addEventListener('hashchange', function () {
                if (location.hash.indexOf('xjb_card') < 0) return false;
                Object.keys(cardList).forEach(i => {
                    let that = cardList[i]
                    that.current = lib.config.xjb_cardAddToPile[that.counterpart] || 0;
                })
                let cardName = location.hash.replace('#xjb_card', '');
                let targetList = Object.keys(cardList).filter(i => {
                    return (i.indexOf(cardName) >= 0)
                }).map(i => cardList[i]);
                let targetObj = { ...targetList }
                let dialog = game.xjb_create.configNumberList(targetObj, function () {
                    if (Object.assign) {
                        lib.config.xjb_cardAddToPile = Object.assign(lib.config.xjb_cardAddToPile, dialog.changedObj);
                    } else {
                        for (let k in dialog.changedObj) {
                            lib.config.xjb_cardAddToPile[k] = dialog.changedObj[k]
                        }
                    }
                    game.saveConfig("xjb_cardAddToPile", lib.config.xjb_cardAddToPile)
                })
                location.hash = '#'
            })
        },
        "import": function () {
            lib.init.js(lib.xjb_src + "js", "editor", () => {
                lib.xjb_translate = { ...window.xjb_editor }
                window.XJB_LOAD_EDITOR(_status, lib, game, ui, get, ai)
            }, () => game.print("技能编辑器数据引入失败——新将包"))
            if (lib.xjb_yangcheng1) {
                lib.xjb_yangcheng = lib.xjb_yangcheng1.onclick("other");
                delete lib.xjb_yangcheng1
            }
        },
        "boss_judge": function () {
            if (get.mode() === "boss") {
                lib.skill._boss_xjb_start = {
                    mode: ["boss"],
                    trigger: {
                        global: "gameStart",
                    },
                    direct: true,
                    filter: function (event, player) {
                        return (lib.translate[player.name1].indexOf("魂使") >= 0)
                    },
                    content: function () {
                        let list = {
                            '战狂魂使': [function (current) {
                                return true
                            }, function (current) {
                                current.gain(game.createCard2("xjb_shenshapo", "", 1), "gain2")
                            }, '④该魂使开局获得一张【神杀破】'],
                            '旋风魂使': [current => true, function (current) {
                                player.node.avatar.classList.add('xjb_tranEndless');
                                player.node.avatar.style = '--xjbTimeLong:0.5s'
                            }],
                        }
                        list[lib.translate[player.name1]][1](player)
                        player.xjb_addSkillCard("xin_ziruo")
                        player.xjb_addSkillCard("xjb_lingpiao")
                        game.countPlayer(function (current) {
                            if (current != player) {
                                list[lib.translate[player.name1]][0](current) && current.showCharacter(2)
                                if (current.maxHp > 5) current.maxHp = 1
                            }
                        })
                        game.removeGlobalSkill("_xjb_cardStore")
                        let inform = function () {
                            let judgeOk = _status.paused, extraStr = list[lib.translate[player.name1]][2] || ''
                            game.pause()
                            game.xjb_create.alert("魂使发动了能力！<br>\
                            ①场上超过其体力上限的角色体力均压制至1;<br>\
                            ②魂使进入阵法〖自若〗〖灵票〗<br>\
                            "+ extraStr, function () {
                                if (!judgeOk) game.resume()
                            })
                        }
                        inform()
                        ui.create.system("关卡提示", inform)
                        player.reinit(player.name1, player.name1)
                    }
                }
            }

        },
        guozhan: function () {
            if (get.mode() === "guozhan") {
                lib.characterPack.mode_guozhan["xjb_fazheng"] = lib.character["xjb_fazheng"]
                lib.characterPack.mode_guozhan["xjb_daqiao"] = lib.character["xjb_daqiao"]
                lib.characterPack.mode_guozhan["xjb_zhangliang_liuhou"] = lib.character["xjb_zhangliang_liuhou"]
                if (lib.config.xjb_newCharacter_addGuoZhan == 1 && lib.config.xjb_yangcheng == 1 && lib.config.xjb_hun) {
                    lib.characterPack.mode_guozhan["xjb_newCharacter"] = lib.character["xjb_newCharacter"]
                }
            }
        },
        "xjb_count": function () {
            _status.xjb_CharacterCount = {}
            let list = { ...lib.character, 'xjb_newCharacter': [] }
            for (var i in list) {
                if (!lib.config.xjb_count[i]) lib.config.xjb_count[i] = {}
                if (!lib.config.xjb_count[i].kill) lib.config.xjb_count[i].kill = 0;
                if (lib.config.xjb_count[i].skill) lib.config.xjb_count[i].skill = undefined;
                if (!lib.config.xjb_count[i].strongDamage) lib.config.xjb_count[i].strongDamage = 0;
                if (!lib.config.xjb_count[i].thunder) lib.config.xjb_count[i].thunder = 0;
                if (!lib.config.xjb_count[i].fire) lib.config.xjb_count[i].fire = 0;
                if (!lib.config.xjb_count[i].ice) lib.config.xjb_count[i].ice = 0;
                if (!lib.config.xjb_count[i].loseMaxHp) lib.config.xjb_count[i].loseMaxHp = 0;
                if (!lib.config.xjb_count[i].gainMaxHp) lib.config.xjb_count[i].gainMaxHp = 0;
                if (!lib.config.xjb_count[i].win1) lib.config.xjb_count[i].win1 = 0;
                if (!lib.config.xjb_count[i].win2) lib.config.xjb_count[i].win2 = 0;
                if (!lib.config.xjb_count[i].HpCard) lib.config.xjb_count[i].HpCard = [];
                if (!lib.config.xjb_count[i].uniqueSkill) lib.config.xjb_count[i].uniqueSkill = [];
                if (!lib.config.xjb_count[i].daomo) lib.config.xjb_count[i].daomo = {}
                if (!lib.config.xjb_count[i].book) lib.config.xjb_count[i].book = []
                function bookWrite(author, books, type) {
                    if (!lib.translate[i]) return;
                    let target = lib.config.xjb_count[i].book
                    if (lib.translate[i].indexOf(author) >= 0) {
                        let list1 = target.filter(item1 => {
                            return !books.includes(item1.headline)
                        })
                        target.length = 0
                        target.push(...list1)
                        books.forEach((item, index) => {
                            target.push({ type: type[index], headline: item })
                        })
                    }
                }
                let wonderfulP = new Array();
                wonderfulP.length = 10;
                wonderfulP.fill("poem");
                let wonderfulA = new Array()
                wonderfulA.length = 10
                wonderfulA.fill("article")
                bookWrite("曹操", ["龟虽寿", "短歌行", "观沧海", "述志令"], ["poem", "poem", "poem", "article"])
                bookWrite("曹植", ["白马篇", "洛神赋", "铜雀台赋", "赠白马王彪"], wonderfulP)
                bookWrite("曹丕", ["燕歌行"], ["poem"])
                bookWrite("陈琳", ["为袁绍檄豫州"], ["article"])
                bookWrite("诸葛亮", ["隆中对", "出师表", "诫子书", "诫外生书"], wonderfulA)
                bookWrite("嬴政", ["过秦论", "阿房宫赋"], wonderfulA)
                bookWrite("李白", ['行路难', "蜀道难", "清平调", "梦游天姥吟留别", "将进酒"], wonderfulP)
                bookWrite("周瑜", ["赤壁怀古"], wonderfulP)
                bookWrite("芙艾派依", ["魂的货币体系"], ["lingli"])
                if (1) {
                    let target = lib.config.xjb_count[i].daomo
                    if (!target.xuemo) target.xuemo = { ...get.xjb_daomoInformation("xuemo"), number: 0 }
                    if (!target.tear) target.tear = { ...get.xjb_daomoInformation("tear"), number: 0 }
                    if (!target.taoyao) target.taoyao = { ...get.xjb_daomoInformation("taoyao"), number: 0 }
                    if (!target.dragon) target.dragon = { ...get.xjb_daomoInformation("dragon"), number: 0 }
                    if (!target.sun) target.sun = { ...get.xjb_daomoInformation("sun"), number: 0 }
                    if (!target.blood) target.blood = { ...get.xjb_daomoInformation("blood"), number: 0 }
                }
                lib.config.xjb_count[i].titles = [];
                lib.config.xjb_count[i].lingtan = [];
                lib.config.xjb_count[i].lingfa = [];
                lib.config.xjb_count[i].kind = "人类"
            }
            game.saveConfig('xjb_count', lib.config.xjb_count);
        },
        lingli: function () {
            //
            lib.config.xjb_count["xjb_chanter"].lingfa = ["xjb_soul_lingdun"];
            lib.config.xjb_count["xjb_Fuaipaiyi"].lingfa = ["xjb_soul_lingqiang"];
            //琪盎特儿的导魔介质        
            lib.config.xjb_count["xjb_chanter"].daomo.blood.number = Infinity;
            lib.config.xjb_count["xjb_chanter"].daomo.taoyao.number = Infinity;
            lib.config.xjb_count["xjb_chanter"].daomo.tear.number = Infinity;
            lib.config.xjb_count["xjb_chanter"].daomo.dragon.number = Infinity;
            lib.config.xjb_count["xjb_chanter"].daomo.sun.number = Infinity;
            //                   
            lib.config.xjb_count["xjb_xuemo"].daomo.xuemo.number = Infinity
            lib.config.xjb_count["xjb_xuemo"].kind = "血族"
        },
        title: function () {
            if (lib.config.xjb_hun) {
                //遍历角色新将包数据，如果角色原来有称号，则增加至新将包角色称号列表。
                Object.keys(lib.config.xjb_count).forEach(function (item, index) {
                    if (this[item]) {
                        lib.config.xjb_count[item].titles = lib.config.xjb_count[item].titles || [];
                        lib.config.xjb_count[item].titles.add(this[item]);
                    }
                }, lib.characterTitle)
                //遍历新将包称号列表(lib.config.xjb_title，0-称号内容，1-称号名单)，如果称号名单中含有角色，则将此称号加入新将包列表。
                lib.config.xjb_title.forEach(function (item, index) {
                    if (!item[1]) return 0;
                    item[1].forEach(function (ite, ind) {
                        (this[ite].titles) && this[ite].titles.add(item[0])
                    }, lib.config.xjb_count);
                })
                //遍历新将包记录的角色，如果其有称号，则设置称号，否则则显示“获得称号方式”，令其点击时location.hash值改变以触发hashchange事件
                Object.keys(lib.config.xjb_count).forEach(function (item) {
                    if (this[item].selectedTitle) lib.characterTitle[item] = '<a class=xjb_hunTitle href=#xjb_player' + item + ' onclick="location.hash=this.href">' + this[item].selectedTitle + '</a>'
                    else if (this[item].titles && this[item].titles.length) {
                        this[item].selectedTitle = this[item].titles[0]
                        lib.characterTitle[item] = '<a class=xjb_hunTitle href=#xjb_player' + item + ' onclick="location.hash=this.href">' + this[item].selectedTitle + '</a>'
                    } else {
                        //没有称号的角色
                        lib.characterTitle[item] = '<a data-nature=xjb_hun href=#xjb_titlesCondition onclick="location.hash=this.href">获得称号方式</a>'
                    }
                }, lib.config.xjb_count)
            }
            //设置新将包称号获取说明方式
            lib.xjb_title_condition = {}
            let condition = {
                0: "卓越超群:击杀一百名角色",
                1: "烈火燎原:造成一百点火属性伤害",
                2: "震雷骇天:造成一百点雷属性伤害",
                3: "冰冻三尺:造成一百点冰属性伤害",
                4: "损身熬心:失去二十点体力上限",
                5: "益寿延年:增加二十点体力上限",
                6: "赫赫战功:击杀二百五十名角色",
                7: "不世之功:第一个击杀本扩展boss获得此称号",
                8: "江东铁壁:使用神甘宁|手杀徐盛获得身份场二十五胜次",
                9: "江东铁壁:使用神甘宁|手杀徐盛获得身份场一百胜次",
                10: "江东铁壁:使用神甘宁|手杀徐盛获得身份场两百五十胜次",
                11: "江东铁壁:使用神甘宁|手杀徐盛获得斗地主场二十五胜次",
                12: "江东铁壁:使用神甘宁|手杀徐盛获得斗地主场一百胜次",
                13: "江东铁壁:使用神甘宁|手杀徐盛获得斗地主场两百五十胜次",
                14: "诡计多端:发动技能造成五次0点伤害并获得游戏胜利",
            }
            lib.config.xjb_title.forEach(function (item, index) {
                //图片+换行+条件
                this[index] = item[0] + "<br>" + condition[index]
            }, lib.xjb_title_condition)
            window.addEventListener('hashchange', function () {
                //判断锚点是否为所要的                        
                if (location.hash !== '#xjb_titlesCondition') return false
                let target = game.xjb_create.condition(lib.xjb_title_condition)
                //移去灰色背景及其上的按钮           
                target.buttons[0].parentNode.parentNode.remove()
                //为页面增加事件，如果点击或触摸处不为条件框元素，移去之
                document.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function removeIt(e) {
                    if (e.target !== target && !Array.from(target.getElementsByTagName("*")).includes(e.target)) {
                        target.remove()
                        location.hash = '#'
                        document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', removeIt)
                    }
                })

            })
        },
        "Intro2": function () {
            //这个代码块来判断条件
            {
                if (!game.xjb_Intro2) return false
            }
            game.xjb_Intro2()
            game.xjb_Introduction.style.display = "none"
            window.addEventListener('hashchange', function () {
                //判断锚点是否为所要的                        
                if (location.hash.indexOf('xjb_player') < 0) return false
                let playerName = location.hash.replace('#xjb_player', '')
                let intro = game.xjb_Intro2(playerName)
                //这里模拟点击称号查询，考虑到触屏模式，所以两者皆设置之。
                //模拟点击事件
                intro.right.titleSet.click();
                //模拟触摸事件
                intro.right.titleSet.dispatchEvent(new TouchEvent("touchend", {
                    bubbles: true,
                    cancelable: true,
                    composed: true
                }))
                location.hash = '#'
            })
        },
        skillTag: function () {
            let skilllist = Object.keys(lib.skill)
            for (let i in lib.config.xjb_skillTag_Skill) {
                skilllist.forEach(function (item, index) {
                    if (this[item] && this[item][i]) this[item][i] = undefined
                }, lib.skill)
                lib.config.xjb_skillTag_Skill[i].forEach(function (item) {
                    if (!lib.skill[item]) return;
                    lib.skill[item][i] = true
                    if (lib.translate[item + "_info"].indexOf(get.translation(i)) < 0) {
                        lib.translate[item + "_info"] = get.translation(i) + "，" + lib.translate[item + "_info"]
                    }
                })
            }
            ["xin_xiongli", "xin_yingfa", "xin_taoni"].forEach(function (item) {
                if (this[item]) this[item].qzj = true
                let info = lib.translate[item + "_info"]
                if (info && info.indexOf(get.translation("qzj")) < 0) lib.translate[item + "_info"] = get.translation("qzj") + "，" + lib.translate[item + "_info"]
            }, lib.skill)
        },
        choujiang: function () {
            {
                if (!get.xjb_number) return false
                if (!lib.config.xjb_hun) return false
            }
            var Array = []
            lib.config.xjb_list_hunbilist.choujiang = {
                "1": {
                    "称号(1个)": "4*100",
                    "体力卡(1张，3点)": "15*100",
                    "体力卡(1张，1点)": "15*100",
                    "体力值(1点)": "12*100",
                    "免费更改势力": "13*100",
                    "免费更改性别": "41*100",
                },
                "2": {
                    "135魂币超大礼包": "1*100",
                    "102魂币大礼包": "2*100",
                    "72魂币中礼包": "14*100",
                    "33魂币小礼包": "17*100",
                    "12魂币谢谢惠顾": "23*100",
                    "9魂币欢迎光临": "43*100",
                },
                "3": {
                    "打卡点数+1": "1*100",
                    "体力卡(1张，3点)": "16*100",
                    "体力卡(1张，1点)": "29*100",
                    "33魂币中礼包": "24*100",
                    "3魂币谢谢参与": "30*100",
                },
                "4": {
                    "技能槽(1个)": "1*100",
                    "技能(1个)": "4*100"
                }
            }
            for (let k in lib.character) {
                let skills = []
                if (lib.character[k]) skills = lib.character[k][3]
                Array = Array.concat(skills)
            }
            let list = [Array.randomGet(), Array.randomGet(), Array.randomGet(), Array.randomGet(), Array.randomGet()]
            for (let i = 0; i < list.length; i++) {
                lib.config.xjb_list_hunbilist.choujiang["4"][list[i]] = "19*100"
            }
            game.xjb_update_choujiang('1')
            game.xjb_update_choujiang('2')
            game.xjb_jiangchiUpDate()
        },
        daka: function () {
            if (lib.config.xjb_hun) {
                var num1 = game.xjb_getCurrentDate()
                var num2 = lib.config.xjb_hundaka
                if (num1[0] > num2[0] || num1[1] > num2[1] || num1[2] > num2[2]) {
                    lib.config.xjb_hundaka[0] = num1[0]
                    lib.config.xjb_hundaka[1] = num1[1]
                    lib.config.xjb_hundaka[2] = num1[2]
                    lib.config.xjb_hundaka[3]++
                    game.saveConfig('xjb_hundaka', lib.config.xjb_hundaka);
                    game.xjb_addDakadian(3, true)
                    game.xjb_create.alert('打卡成功！<br>你已打卡过' + lib.config.xjb_hundaka[3] + '次');
                    let num = lib.config.xjb_hunbi * 10 + lib.config.xjb_systemEnergy
                    if (num < 0) game.xjb_systemEnergyChange(lib.config.xjb_hunbi)
                    else game.xjb_systemEnergyChange(-lib.config.xjb_systemEnergy * 0.01)
                }
            }
            game.xjb_currencyRate.PointToEnergy = 520;
            game.xjb_currencyRate.CoinToEnergy = Math.floor(game.xjb_currencyRate.PointToEnergy / game.xjb_hunbiExpectation());
            game.xjb_currencyRate.firstRate = Math.round(game.xjb_currencyRate.CoinToEnergy / 1.3);
            game.xjb_currencyRate.secondRate = Math.round(game.xjb_currencyRate.CoinToEnergy / 3);
            game.xjb_currencyRate.thirdRate = Math.round(game.xjb_currencyRate.CoinToEnergy / 5);
            function xjb_currencyRateProperty() {
                ['PointToEnergy', 'CoinToEnergy',
                    'firstRate', 'secondRate', 'thirdRate'].forEach(i => {
                        game.xjb_currencyRate.defineProperty(i)
                    })
            };
            xjb_currencyRateProperty()
        },
    }
}