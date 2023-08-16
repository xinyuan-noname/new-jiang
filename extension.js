game.import("extension",function(lib,game,ui,get,ai,_status){return {name:"新将包",content:function (config, pack) {
          //折头折百花联动
          if (lib.config.extensions.contains('枝头折百花')&&lib.config.extension_枝头折百花_enable) {
                lib.nature.push('flower')
                lib.skill._ztzbh_flowerDamage = {
                    trigger: {
                        source: ["damageBegin"],
                    },
                    filter: function (event, player) {
                        if (game.roundNumber % 4 == 1) lib.translate._ztzbh_flowerDamage='春雷'
                        if (game.roundNumber % 4 == 2) lib.translate._ztzbh_flowerDamage='炎夏'
                        if (game.roundNumber % 4 == 3) lib.translate._ztzbh_flowerDamage='寂秋'
                        if (game.roundNumber % 4 == 0) lib.translate._ztzbh_flowerDamage='凌冬'
                        if (!(event.nature == "flower")) return false;
                        return true;
                    },
                    content: function () {
                        "step 0"
                        trigger.cancel()
                        if (game.roundNumber % 4 == 1) trigger.player.damage(1, "thunder", player) && player.popup('春雷')
                        if (game.roundNumber % 4 == 2) trigger.player.damage(1, "fire", player) && player.popup('炎夏')
                        if (game.roundNumber % 4 == 3) trigger.player.loseHp(1, player) && player.popup('寂秋')
                        if (game.roundNumber % 4 == 0) trigger.player.damage(1, "ice", player) && player.popup('凌冬')
                    },
                }
                lib.translate._ztzbh_flowerDamage = '花伤'
                lib.skill._ztzbh_liandong={
                    trigger:{
                        player:Object.keys(lib.extensionPack.枝头折百花.skill.skill).map(i=>i+"After")
                    },     
                    filter:function(event,player){
                        return player===game.me
                    },
                    direct:true,
                    content:function(){
                        let name=player.name
                        game.xjb_getDaomo(player,"flower")                             
                    }
                }              
            }
            //新将包路径来源             
            if (document.body.outerHTML) { /*检测浏览器是否有outHTML属性，有的话采用
                方法1:outHTML获取法
                这里先获取了所有脚本后，筛选出自己的扩展包的脚本，
                再以此js文件的路径来源。
                这个路径定位到的是本扩展的extension.js文件，因此需要把它截短一下，
                截短到上级目录*/
                lib.xjb_script = Array.from(document.scripts).filter(function (a) { //注意的是document.scripts不是数组，这里用Array.from转为数据再筛选
                    return a.outerHTML.indexOf('extension/新将包/extension') > -1
                })[0] //因为这样返回来的是一个数组，就把第一个作为我们的文件               
                lib.xjb_src = lib.xjb_script.src.replace("extension.js", "")
            } else {/*方法1不行，则执行
                方法2:lib.assertURL拼接法           
                lib.asset可以定位到游戏文件夹下，进行拼接即可*/
                lib.xjb_src = lib.assetURL + "extension/新将包/"
            }

            //新的数据处理函数部分
            lib._xjb = {
                type: function (target) {
                    var type = Object.prototype.toString.apply(target).slice(8, -1)
                    var a = type.indexOf("HTML"), b = type.indexOf("Element")
                    if (a >= 0 && b >= 0) {
                        type = type.slice(a + 4, b)
                    }
                    return type.toLowerCase()
                }
            }
            String.prototype.getNumberBefore = function (character) {
                var i = this.indexOf(character)
                for (var a = 0; a < i; a++) {
                    var p = this.slice(a, i)
                    if (p == get.xjb_number(p)) break
                }
                return this.slice(a, i)
            }
            String.prototype.withTogether = function (str, func) {
                return [func(this), func(str)]
            }
            Array.prototype.toEnsureItsPersonality = function () {
                var list = Array.from(new Set(this))
                return list
            }
            //设置刘祖项目
            if (!lib.config.xjb_π) {
                lib.config.xjb_π = 6
                /*相当于内接正六边形*/
            }
            if (!lib.config.xjb_e) {
                lib.config.xjb_e = 1
            }
            if (!lib.config.xjb_Φ) {
                lib.config.xjb_Φ = 1
            }
            //设置
            if (!lib.config.xjb_skillTag_Character) lib.config.xjb_skillTag_Character = []
            if (!lib.config.xjb_skillTag_Skill) lib.config.xjb_skillTag_Skill = {}
            if (!lib.config.xjb_redSkill) lib.config.xjb_redSkill = { list: [], skill: {}, translate: {} }
            if (!lib.config.xjb_objects) lib.config.xjb_objects = {}
            //设置技能槽
            if (!lib.config.xjb_jnc || typeof lib.config.xjb_jnc != 'number') lib.config.xjb_jnc = 0
            //设置打卡
            if (!lib.config.xjb_hundaka) lib.config.xjb_hundaka = [0, 0, 0, 0]
            if (!lib.config.xjb_hundaka2 || typeof lib.config.xjb_hundaka2 != 'number') lib.config.xjb_hundaka2 = 0
            //设置抽奖类型
            if (!lib.config.cjb_cj_type) lib.config.cjb_cj_type = "1";
            //设置系统能量
            if (lib.config.xjb_systemEnergy == undefined) lib.config.xjb_systemEnergy = 50;
            if (lib.config.xjb_systemEnergy > 5e8) lib.config.xjb_systemEnergy = 5e8;
            if (isNaN(lib.config.xjb_systemEnergy)) lib.config.xjb_systemEnergy = 0;
            //设置魂币
            if (lib.config.xjb_hunbi !== undefined) {
                if (lib.config.xjb_hunbi > 5e7) lib.config.xjb_hunbi = 5e7;
                if (isNaN(lib.config.xjb_hunbi)) lib.config.xjb_hunbi = 0;
            }
            //设置称号
            if (!lib.config.xjb_title) {
                lib.config.xjb_title = [];
            }
            if (!lib.config.xjb_count) lib.config.xjb_count = {}

            //设置养成角色
            if (!lib.config.xjb_newcharacter) {
                lib.config.xjb_newcharacter = {}
            }
            if (!lib.config.xjb_newcharacter.name2) lib.config.xjb_newcharacter.name2 = '李华';
            if (!lib.config.xjb_newcharacter.sex) lib.config.xjb_newcharacter.sex = 'male';
            if (!lib.config.xjb_newcharacter.group) lib.config.xjb_newcharacter.group = 'qun';
            if (!lib.config.xjb_newcharacter.hp || typeof lib.config.xjb_newcharacter.hp != 'number') lib.config.xjb_newcharacter.hp = 1;
            if (lib.config.xjb_newcharacter.hp > 8) lib.config.xjb_newcharacter.hp = 8
            if (!lib.config.xjb_newcharacter.skill) lib.config.xjb_newcharacter.skill = [];
            if (!lib.config.xjb_newcharacter.intro) lib.config.xjb_newcharacter.intro = '';
            if (!lib.config.xjb_newcharacter.sink) lib.config.xjb_newcharacter.sink = [];
            if (!lib.config.xjb_newcharacter.selectedSink) lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
            //设置存档
            if (!lib.config.xjb_myStorage) {
                lib.config.xjb_myStorage = {
                    total: 0,
                }
            }
            //设置变身
            lib.config.xjb_bianshenCharacter = {}
            //设置列表
            lib.config.xjb_list_hunbilist = {
                skill: {
                    first: ["xjb_juanqu", "xjb_lunhui"],
                    second: ["xjb_leijue", "xjb_bingjue"],
                    third: ["xjb_pomie", "xjb_huojue"],
                },
                choujiang: {

                },
            }
            //选项    
            lib.xjb_list_xinyuan = {
                _order: {
                    win_fan: 33.7,
                    win_zhong: 33.3,
                    win_nei: 33.5,
                    win_zhu: 33.1,
                    playedTimes_fan: 33.6,
                    playedTimes_zhu: 33,
                    playedTimes_zhong: 33.2,
                    playedTimes_nei: 33.4,
                    winRate_fan: 33.71,
                    winRate_zhong: 33.31,
                    winRate_nei: 33.51,
                    winRate_zhu: 33.11,
                    win1: 32,
                    playedTimes1: 31,
                    winRate1: 32.1,
                    win2: 42,
                    playedTimes2: 41,
                    winRate2: 43,
                    win_farmer: 44,
                    playedTimes_farmer: 44.1,
                    winRate_farmer: 44.2,
                    win_landlord: 45,
                    playedTimes_landlord: 45.1,
                    winRate_landlord: 45.2,
                    win3: 52,
                    playedTimes3: 51,
                    winRate3: 53,
                    strongDamage: 10,
                    ice: 13,
                    fire: 11,
                    thunder: 12,
                    kami: 14,
                    "kill": 1,
                    "recover": 20,
                    "loseHp": 21,
                    "loseMaxHp": 22,
                    "gainMaxHp": 23,
                },
                translate: {
                    //count翻译
                    lingfa: "灵法",
                    kind: "种族",
                    lingtan: "灵弹",
                    selectedTitle: "当前称号",
                    strongDamage: "重伤害",
                    ice: "冰属性伤害",
                    fire: "火属性伤害",
                    thunder: "雷属性伤害",
                    kami: "神属性伤害",
                    "kill": "击杀人数",
                    "HpCard": "体力牌",
                    "recover": "恢复体力",
                    "loseHp": "失去体力",
                    "loseMaxHp": "失去体力上限",
                    "gainMaxHp": "增加体力上限",
                    "die": "死亡",
                    "link": "横置",
                    "insertPhase": "额外进行一个回合",
                    //单词翻译
                    'none': '无',
                    //技能翻译
                    'limited': '限定技',
                    'juexingji': '觉醒技',
                    'zhuanhuanji': '转换技',
                    'zhuSkill': '主公技',
                    'forced': '锁定技',
                    'skill_X': 'X技',
                    'qzj': '强制技',
                    'viewAs': "视为技"
                },
                jiangchi: [],
                skills: {
                    red: ["xjb_redSkill", "xjb_redSkill_1", "xjb_redSkill_2"].concat(lib.config.xjb_redSkill.list),
                },
                theStorage: "",
                theFunction: {
                    xjb_chupingjisha: function () {
                        ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove&&ui.xjb_chupingjisha.remove()
                        //"stayleft"可以让该元素保持在左边
                        ui.xjb_chupingjisha = ui.create.control("触屏即杀",'stayleft',lib.xjb_list_xinyuan.dom_event.chupingjisha)                                                  
                    }
                },
                dom_event: {
                    chupingjisha: function (e) {
                        this.hide()
                        var next = game.createEvent("xjb-chupingjisha")
                        next.player=game.me
                        _status.event.next.remove(next);
                        _status.event.getParent().next.push(next);                                                                                            
                        next.setContent(function(){
                           "step 0"
                           let list1=["流失","火焰","雷电","冰冻","破甲","神袛"],list2=["1次","2次","3次","4次","5次"]
                           var next=player.chooseButton([
                              '请选择击杀方式',
                              [list1,'tdnodes'],
                              '请选择重复次数',
                              [list2,'tdnodes'],
                           ],2);
                           event.list1=list1
                           event.list2=list2
                           event.selected1 = 0
                           event.selected2 = 0
                           next.set('filterButton',function(button){
                              ui.selected.buttons.forEach(i=>{
                                 event.selected1 = 0
                                 event.selected2 = 0
                                 if(list1.contains(i.innerText)) event.selected1=1
                                 if(list2.contains(i.InnerText)) event.selected2=1                            
                              })
                              if(event.selected1===1&&list1.contains(button.link))  return false
                              return !(list2.contains(button.link)&&(event.selected1===0||event.selected2===1))
                           });
                           "step 1"
                           if(result.links){        
                             let times,activity                
                             result.links.forEach(i=>{
                                activity=(event.list1.contains(i)&&i)||activity
                                times=(event.list2.contains(i)&&i)||times                                
                             })
                             let e=new Array()
                             e.length=get.xjb_number(times)
                             e.fill(activity)
                             player.fc_X(...e,[game.players.length])
                             game.xjb_systemEnergyChange(-get.xjb_number(times)*30)
                           }
                           "step 2"
                           ui.xjb_chupingjisha.show()
                        })
                        //如果是你的出牌阶段发动此技能
                        if(_status.event.name=='chooseToUse'&&_status.event.player){
                           //这个设置是关键的一步，说明本次chooseToUse是发动了技能，以让phaseUse转起来
                           _status.event.result={
                              bool:true,
                              skill:'xjb_chupingjisha'
                           }
                           //这一步是让触屏击杀事件得以发动
                           game.resume()  
                        } 
                    },
                }
            }
            //这个是用于设置关卡信息的函数
            lib.arenaReady.push(function () {
                _status.xjb_level = {
                    name: lib.config.mode,
                    number: "0000",
                    Type:"normal"
                }
            });
            //这个用于把xjb_1中的函数赋给角色
            lib.arenaReady.push(function () {
                lib.element.player = { ...lib.element.player, ...lib.skill.xjb_1.player }
            });
            //这个用于设置xjb_2的中的事件
            lib.arenaReady.push(function () {
                for (let k in lib.skill.xjb_2) {
                    lib.element.player[k] = lib.skill.xjb_2[k].player;
                    lib.element.content[k] = lib.skill.xjb_2[k].content;
                }
            })
            //这个把其他新将包的数据释放出来
            lib.arenaReady.push(function () {
                let arr = new Array()
                arr.length = 12;
                arr.fill("xjb_")
                arr = arr.map(function (item, index) {
                    return item + (index + 3)
                })
                arr.forEach(function (item) {
                    for (let i in this[item]) {
                        this[item][i]()
                    }
                }, lib.skill)
            })
            //这个是一定要放在最后处理的新将包数据
            lib.arenaReady.push(function () {
                if (lib.skill.xjb_final) {
                    for (let k in lib.skill.xjb_final) {
                        window.requestAnimationFrame(function () {
                            lib.skill.xjb_final[k]()
                        })
                    }
                }
            })
            //ui函数
            game.xjb_create = {}
            game.xjb_bossLoad = function (str, player) {
                if(_status.timeout)game.pause()
                if(!player) player=game.me
                lib.skill.xjb_theLevel.theLevel[str].init(player)
            }
            game.xjb_filterData = function (Array) {
                if (arguments.length > 1) {
                    for (var i = 0; i < arguments.length; i++) {
                        game.xjb_filterData(arguments[i])
                    }
                    return
                }
                var target = lib
                for (var i = 0; i < Array.length; i++) {
                    target = target[Array[i]]
                }
                var list = {}
                for (var i in target) {
                    if (target[i] != null) list[i] = target[i]
                }
                target = list
                return target
            }
            game.xjb_gainJP = function (str, boolean, turn = 1) {
                switch (str) {
                    case "打卡点数+1": {
                        game.xjb_addDakadian(1 * turn, boolean)
                    }; break;
                    //有技能槽则获得，消耗能量
                    case "技能(1个)": {
                        var haven = lib.config.xjb_newcharacter.skill
                        var first = lib.config.xjb_list_hunbilist.skill.first
                        var second = lib.config.xjb_list_hunbilist.skill.second
                        var third = lib.config.xjb_list_hunbilist.skill.third
                        var list = first.concat(second, third)
                        var willget = list.randomGet()
                        if (game.xjb_condition(3, 1)) {
                            game.xjb_create.alert('你获得了技能' + get.translation(willget))
                            lib.config.xjb_newcharacter.skill.add(willget)
                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            game.xjb_systemEnergyChange(-20)
                        }
                        else {
                            lib.config.xjb_hunbi += 8
                            game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                            game.xjb_create.alert("请确保你有获得技能的能力！已退还8魂币")
                        }
                    }; break
                    case "称号(1个)": {
                        game.xjb_newCharacterGetTitle(1 * turn)
                    }; break
                    case "技能槽(1个)": {
                        game.xjb_newCharacterAddJnc(1 * turn)
                    }; break
                    case "体力卡(1张，3点)": {
                        game.xjb_getHpCard('xjb_newCharacter', 3, turn)
                    }; break
                    case "体力卡(1张，1点)": {
                        game.xjb_getHpCard('xjb_newCharacter', 1, turn)
                    }; break
                    case "体力值(1点)": {
                        game.xjb_newCharacterAddHp(1 * turn, boolean)

                    }; break
                    case "免费更改势力": {
                        game.xjb_newCharacterChangeGroup(1 * turn, boolean)

                    }; break
                    case "免费更改性别": {
                        game.xjb_newCharacterChangeSex(1 * turn, boolean)
                    }; break
                    case "免费更改姓名": {
                        game.xjb_newCharacterChangeName(1 * turn)
                    }; break
                    default: {
                        var num = get.xjb_number(str)
                        if (Object.keys(lib.skill).contains(str)) {
                            if (game.xjb_condition(3, 1)) {
                                game.xjb_create.alert('你获得了技能' + get.translation(str))
                                lib.config.xjb_newcharacter.skill.add(str)
                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                game.xjb_systemEnergyChange(-20)
                            }
                        }
                        else if (num != NaN) {
                            game.xjb_getHunbi(num, turn , boolean)
                        }
                    }; break
                }

            }
            game.xjb_jiangchiUpDate = function () {
                var x = lib.config.cjb_cj_type;
                var list1 = Object.keys(lib.config.xjb_list_hunbilist.choujiang[x])
                var list2 = Object.values(lib.config.xjb_list_hunbilist.choujiang[x])
                var list3 = Object.keys(lib.xjb_list_xinyuan.jiangchi)
                for (var i = 0; i < list1.length; i++) {
                    var a = get.xjb_number(list2[i])
                    for (var b = 0; b < a; b++) {
                        var c = list3.randomGet()
                        lib.xjb_list_xinyuan.jiangchi[c] = list1[i]
                        list3.remove(c)
                    }
                }
            }
            game.xjb_getCurrentDate = function (boolean) {
                var date = new Date()
                var a = date.getFullYear(), b = date.getMonth() + 1, c = date.getDate(), d = date.getHours(), e = date.getMinutes()
                if (boolean) {
                    var d = date.getDay()
                    return d === 0 ? 7 : d
                }
                return [a, b, c, d, e]
            };
            game.xjb_update_choujiang = function (num) {
                var list = Object.keys(lib.config.xjb_list_hunbilist.choujiang[num])
                for (var i = 0; i < list.length; i++) {
                    var before = lib.config.xjb_list_hunbilist.choujiang[num][list[i]]
                    var number = get.xjb_number(before) + game.xjb_getCurrentDate(true)
                    if (i === list.length - 1) number = get.xjb_number(before) - i * game.xjb_getCurrentDate(true)
                    lib.config.xjb_list_hunbilist.choujiang[num][list[i]] = number + '*100'
                }
            }
            game.xjb_jiangchi_zeroise = function () {
                for (var i = 0; i < 100; i++) {
                    lib.xjb_list_xinyuan.jiangchi[i] = ''
                }
            }
            game.xjb_newcharacter_zeroise = function () {
                lib.config.xjb_newcharacter.name2 = '李华'
                lib.config.xjb_newcharacter.sex = 'male';
                lib.config.xjb_newcharacter.group = 'qun';
                lib.config.xjb_newcharacter.hp = 1;
                lib.config.xjb_newcharacter.skill = [];
                lib.config.xjb_newcharacter.intro = '';
                lib.config.xjb_newcharacter.sink = [];
                lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
            }
            game.zeroise_xjbCount = function (target) {
                lib.config.xjb_count[target.name1] = {
                    kill: 0,
                    thunder: 0,
                    fire: 0,
                    ice: 0,
                    loseMaxHp: 0,
                    gainMaxHp: 0,
                    HpCard: [],
                    uniqueSkill: []
                }
            }
            //Hpcard创建函数，第一个值为体力牌类型，第二个值为体力牌样式高度
            game.createHpCard = function (num, num2 = 100) {
                if (Array.isArray(num)) {
                    let list = []
                    for (let i = 0; i < num.length; i++) {
                        list.push(game.createHpCard(num[i]))
                    }
                    return list
                }
                var HpCard = ui.create.div('.HpCard')
                HpCard.number = num
                HpCard.innerHTML = '<img src="' + lib.xjb_src + 'HpCard/' + HpCard.number + '.jpg" height=' + num2 + '>'
                HpCard.style['position'] = 'relative'
                var word = ui.create.div('.word', HpCard)
                word.innerHTML = get.cnNumber(num)
                word.style['font-size'] = '25px'
                word.style['position'] = 'relative'
                word.style['float'] = 'right'
                word.style['color'] = 'red'
                word.style['left'] = '-25px'
                word.style['top'] = '-10px'
                return HpCard
            }
            //统计体力牌张数
            game.countHpCard = function (arr) {
                let array = {
                    1: 0,
                    2: 0,
                    3: 0,
                    4: 0,
                    5: 0
                }
                arr.forEach(function (i) {
                    array[i] = array[i] + 1
                }, arr)
                return array
            }
            //技能=object(强制技恢复)
            game.xjb_EqualizeSkillObject = function (string1, object2) {
                lib.skill[string1] = {}
                var list = Object.keys(object2)
                for (var i = 0; i < list.length; i++) {
                    lib.skill[string1][list[i]] = object2[list[i]]
                }
                return lib.skill[string1]
            }
            game.xjb_choujiangStr = function (object, num) {
                var willget = JSON.stringify(object)
                willget = willget.replace(/\"|'/g, "");
                if (num && num === 1) {
                    willget = willget.replace(/\{|}/g, "");
                    willget = willget.replace(/\gainMaxHp/g, "获得体力上限");
                    willget = willget.replace(/\loseMaxHp/g, "失去体力上限");
                    willget = willget.replace(/\uniqueSkill/g, "特殊技能");
                    willget = willget.replace(/\HpCard/g, "体力牌");
                    willget = willget.replace(/\,/g, "<br>");
                } else {
                    willget = willget.replace(/\*/g, "%<br>");
                    willget = willget.replace(/\{|}/g, "<hr>");
                    willget = willget.replace(/\,|100/g, "");
                    willget = willget.replace(/\,|1?00/g, "");
                }
                return willget
            }
            //get函数
            //新将包翻译
            get.xjb_translation = function (target) {
                if (Array.isArray(target)) {
                    var spare = []
                    for (var i = 0; i < target.length; i++) {
                        spare.push(get.xjb_translation(target[i]))
                    }
                    return spare
                }
                var translation
                var list1 = Object.keys(lib.xjb_list_xinyuan.translate)
                var list2 = Object.values(lib.xjb_list_xinyuan.translate)
                for (var i = 0; i < list1.length; i++) {
                    if (list1[i] == target) translation = list2[i]
                    if (list2[i] == target) translation = list1[i]
                }
                if (!translation) {
                    translation = []
                    var list3 = Object.keys(lib.translate)
                    var list4 = Object.values(lib.translate)
                    for (var i = 0; i < list3.length; i++) {
                        if (list4[i] == target) translation.push(list3[i])
                        if (list3[i] == target) {
                            translation = list4[i]
                        }
                    }
                }
                if (typeof target === 'number') translation = get.xjb_number(target)
                if (Array.isArray(translation) && translation.length === 0) return target
                return translation
            }
            lib.extensionMenu.extension_新将包.delete.name = '<img src="' + lib.xjb_src + 'image/trash.png" width="16">' + '删除'
            //更改编辑
            lib.extensionMenu.extension_新将包.edit.name = '<img src="' + lib.xjb_src + 'image/edit.png" width="16">' + '编辑'            
            lib.extensionMenu.extension_新将包['Eplanation'] = {
                name: '<img src="' + lib.xjb_src + 'image/instruction.png" width="16"></img>查看/切换说明',
                init: '',
                item: {
                    mingxie: '鸣谢',
                    qzj: '强制技',
                    junchenSkill: '君臣技',
                    skill_X: 'X技',
                    hun_system: '魂币系统',
                },
                onclick: function (layout) {
                    ui.create.xjb_book(ui.window, xjb_library["intro"][layout])
                    return false;
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
                    name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20" >' + '查看魂币数',
                    clear: true,
                    onclick: function () {
                        var target = this
                        function hun(num) {
                            var hunbi = ""
                            if (num > 0 && num < 6) {
                                for (var i = 0; i < num; i++) {
                                    hunbi = hunbi + '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20" >'
                                }
                            }
                            else {
                                hunbi = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20" >×' + num
                            }
                            return hunbi
                        }
                        ui.xjb_giveStyle(target, { height: "60px" })
                        target.innerHTML = '你已有，魂币：' + hun(lib.config.xjb_hunbi) + '<p>打卡点：' + hun(lib.config.xjb_hundaka2) + '</p>';
                        setTimeout(function () {
                            ui.xjb_giveStyle(target, { height: "25px" })
                            target.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="20">' + '查看魂币数'
                        }, 2500)

                    }
                }
                lib.extensionMenu.extension_新将包.hunbi_tozero = {
                    name: '<img src="' + lib.xjb_src + 'image/zeroize.png" height="16">清零魂币',
                    clear: true,
                    onclick: function () {
                        if (lib.config.xjb_hunbi === 0) return game.xjb_create.alert('你的魂币无需清零');
                        game.xjb_create.confirm('确定要清零吗？', function () {
                            var num = lib.config.xjb_hunbi
                            if (lib.config.xjb_hunbi > 0) {
                                num = num * 7
                            }
                            else if (lib.config.xjb_hunbi < 0) {
                                num = num * 50
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
                
                lib.extensionMenu.extension_新将包.hun_card = {
                    name: '<img src="' + lib.xjb_src + 'image/xjb_shop.png" width="16">' + '<font color="yellow">魂币商店</font>',
                    clear: true,
                    onclick: function (e) {
                        game.xjb_create.alert("魂币商店已改为全局技能，希望您使用愉快！")
                    }
                }
                if (lib.config.xjb_bianshen == 1) {
                    lib.extensionMenu.extension_新将包.hun_bianshen = {
                        name: '<img src="' + lib.xjb_src + 'image/god.jpg" height="16">' + '<font color="yellow">变身功能</font>',
                        clear: true,
                        onclick: function (layout) {
                            game.xjb_create.alert("魂将已改为全局技能！祝使用愉快！")

                        }
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
                            if(lib.config.xjb_hundaka2>=layout&&lib.config.xjb_hunbi<10) return game.xjb_create.alert("由于能量不足，现在抽奖方决定：临时开发打卡点抽奖途径，以渡过无能量期，现在自动为您抽奖...",function(){
                                   lib.config.cjb_cj_type="2"
                                   game.xjb_jiangchiUpDate()
                                   let JP=lib.xjb_list_xinyuan.jiangchi.randomGet()
                                   game.cost_xjb_cost(2,1)
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
                        var xjb_list = ui.create.div('.xjb_choujiang', back)
                        ui.xjb_giveStyle(xjb_list, { width: "125px" })
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
                            var inner = ["养成奖池", "魂币奖池", "免费奖池", "技能奖池"], style = [
                                { "margin-top": "50px", color: "red" },
                                { "margin-top": "100px", color: "orange" },
                                { "margin-top": "150px", color: "blue" },
                                { "margin-top": "200px", color: "pink" }
                            ]
                            var choujiang = ui.create.div('.xjb_choujiang', xjb_list)
                            choujiang.innerHTML = inner[i]
                            ui.xjb_giveStyle(choujiang, lib.xjb_style.cj_box)
                            ui.xjb_giveStyle(choujiang, style[i])
                            choujiang.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', myFunc(i + 1))
                            return choujiang
                        }
                        //显示当前奖品
                        var content = ui.create.div(".choujiang_content", back)
                        content.innerHTML = '奖品'
                        content.id = "myChouJiang_XJB_CONTENT"
                        ui.xjb_giveStyle(content, { 'font-size': "30px", 'color': "#D9D919", "margin-left": "56%", "margin-top": "100px", "width": "240px", "text-align": "center" })
                        //抽奖按键
                        var btn = document.createElement("BUTTON")
                        btn.id = "myChouJiang_XJB_BUTTON"
                        btn.innerHTML = '点击抽奖'
                        ui.xjb_giveStyle(btn, { "margin-left": "60%", 'border-radius': "5em", position: "relative", color: "red", border: "1px solid green", 'font-size': "24px", "margin-top": "200px", width: "175px", height: "80px" })
                        back.appendChild(btn);
                        //创建奖品列表
                        var text = ui.create.div(".choujiang_text", back)
                        text.id = "myChouJiang_XJB_TXT"
                        var xx = lib.config.cjb_cj_type, xjb_txtself = document.getElementById('myChouJiang_XJB_TXT')
                        text.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang[xx])
                        ui.xjb_giveStyle(text, { 'font-size': "20px", right: "410px", top: "10px" })
                        text.onclick = function () {
                            if (btn.disabled) return;
                            this.style.color = ["red", "blue", "yellow", "pink", "white"].randomGet()
                            var bool = this.innerHTML.search(/技能/) >= 0
                            game.xjb_systemEnergyChange(-1)
                            if (!bool) return
                            lib.skill.xjb_final.choujiang()
                            this.innerHTML = game.xjb_choujiangStr(lib.config.xjb_list_hunbilist.choujiang["4"])
                            game.xjb_jiangchiUpDate()
                            game.xjb_systemEnergyChange(-1)
                        }
                        //抽奖事件
                        btn.onclick = function () {
                            var xx = get.xjb_number(lib.config.cjb_cj_type), num = 8 * layout
                            if (xx == 2) num = 1 * layout
                            if (xx == 1 && !game.xjb_condition(1, num)) {
                                return game.xjb_create.alert("你未达成抽奖的条件！")
                            }
                            else if (xx == 2 && !game.xjb_condition(2, num)) {
                                return game.xjb_create.alert("你未达成抽奖的条件！")
                            }
                            else if (xx == 4 && (!game.xjb_condition(1, num) || !game.xjb_condition(3, 1 * layout))) {
                                return game.xjb_create.alert("你未达成抽奖的条件！")
                            }
                            if (xx == 4) xx = 1
                            if (xx !== 3) game.cost_xjb_cost(xx, num)
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
                            if ((i == 3) && layout != 1) {
                                ui.xjb_giveStyle(clk, { display: 'none' })
                            }
                        }


                    }
                }
                lib.extensionMenu.extension_新将包.level = {
                    name: '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="16"><font color=yellow>技能附魔',
                    init: "openType",
                    item: {
                        openType: "开启标签",
                        addCharacter: "添删武将",
                        enchanting: "技能附魔"
                    },
                    visualMenu: function (node) {
                        node.className = 'button character controlbutton';
                        node.style.backgroundSize = '';
                    },
                    onclick: function (e) {

                        if (e === "openType") {//标签开关
                            game.xjb_create.configList({
                                xjb_skillTag_fuSkill: "福技:首次使用后恢复体力并加护甲的技能",
                                xjb_skillTag_luSkill: "禄技:首次使用后摸四张牌的技能",
                                xjb_skillTag_shouSkill: "寿技:首次使用后加两点体力上限的技能",
                                xjb_skillTag_qzj: "强制技:令目标失去技能的技能",
                                xjb_skillTag_suidongSkill: "随动技:因此技能发动而获得牌，得牌角色可以立即使用其中第一张牌的技能",
                            })
                            lib.skill.xjb_final.skillTag()
                        } else if (e === "addCharacter") {//角色开关
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
                            let obj = {}
                            if (!lib.config.xjb_skillTag_Character || !lib.config.xjb_skillTag_Character.length) return game.xjb_create.alert("你没有任何武将解锁了技能标签，请于 添删武将 中设置！")//检测是否有武将解锁了该功能
                            lib.config.xjb_skillTag_Character.forEach(function (item, index) {
                                if (lib.character[item] && lib.character[item][3] && lib.character[item][3].length) {//判断玩家是否有技能
                                    lib.character[item][3].forEach(function (item1, index1) {
                                        if (lib.skill[item1]) {//检测该技能是否存在
                                            let info = get.info(item1)
                                            if (!info.content) return;
                                            if (lib.config.xjb_skillTag_suidongSkill == 1) {
                                                obj["xjb_skillTag_suidongSkill_" + item1] = "【随动技】" + get.translation(item1) +
                                                    "(来源:" + get.translation(item) + "|" + item + ")"
                                            }
                                            if (info.enable && info.filterTarget) {//判断该技能为主动技且会选择角色
                                                if (lib.config.xjb_skillTag_qzj == 1) {
                                                    obj["xjb_skillTag_qzj_" + item1] = "【强制技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                            }
                                            /*下面这两行连写，会先判断是否有player.logSkill再判断是否为触发技*/
                                            else if (info.direct && info.content.toString().indexOf("player.logSkill") < 0) return //判断是否有技能提示
                                            else if (info.trigger) {//判断是否为触发技
                                                if (lib.config.xjb_skillTag_fuSkill == 1) {
                                                    obj["xjb_skillTag_fuSkill_" + item1] = "【福技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                                if (lib.config.xjb_skillTag_luSkill == 1) {
                                                    obj["xjb_skillTag_luSkill_" + item1] = "【禄技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                                if (lib.config.xjb_skillTag_shouSkill == 1) {
                                                    obj["xjb_skillTag_shouSkill_" + item1] = "【寿技】" + get.translation(item1) +
                                                        "(来源:" + get.translation(item) + "|" + item + ")"
                                                }
                                            }
                                        }
                                    })
                                }
                            })
                            game.xjb_create.configList(obj, function () {
                                let arr = this.isOpened, object = {
                                    fuSkill: [],
                                    luSkill: [],
                                    shouSkill: [],
                                    qzj: [],
                                    suidongSkill: []
                                }
                                arr.forEach(function (item, index) {
                                    function addTag(type) {
                                        if (item.indexOf("xjb_skillTag_" + type + "_") > -1) {
                                            object[type].add(item.replace("xjb_skillTag_" + type + "_", ""))
                                        }
                                    }
                                    ["suidongSkill", "fuSkill", "luSkill", "shouSkill", "qzj"].forEach(WonderfulTag => {
                                        addTag(WonderfulTag)
                                    })

                                })
                                game.saveConfig("xjb_skillTag_Skill", object)
                            })
                            lib.skill.xjb_final.skillTag()//更新技能附魔
                        }
                    }
                }
                if (lib.config.xjb_yangcheng == 1) {
                    lib.xjb_yangcheng1 = lib.extensionMenu.extension_新将包.newCharacter = {
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
                            sink1: '皮肤导入',
                            sink3: '原皮更改',
                            sink4: '恢复初始',

                        },
                        visualMenu: function (node) {
                            node.className = 'button character controlbutton';
                            node.style.backgroundSize = '';
                        },
                        onclick: function (layout) {
                            if (lib.config.xjb_systemEnergy < 0) {
                                return game.xjb_NoEnergy()
                            }
                            function changeSkill(abcde) {
                                var obj = {}
                                function Longstr(list) {
                                    var word = '请按以下规则输入:<br>'
                                    for (var i = 0; i < list.length; i++) {
                                        word = word + '查看技能〖' + get.translation(list[i]) + '〗，请输入' + i + '<br>'
                                    }
                                    return word
                                }
                                function normalStr(skill) {
                                    var str = '〖' + get.translation(skill) + '〗：' + lib.translate[skill + '_info']
                                    return game.xjb_create.alert(str)
                                }
                                obj.changeSkill1 = function () {
                                    var num = lib.config.xjb_jnc
                                    game.xjb_create.prompt('每开启一个技能槽，消费便多5个魂币，你当前有' + num + '个技能槽，请输入你要开启的技能槽数量', "", function () {
                                        var add = this.result
                                        if (add <= 0) {
                                            game.xjb_create.alert("请规范输入！", function () {
                                                obj.changeSkill1()
                                            })
                                        }
                                        else {
                                            add = parseInt(add, 10)//将add转化为十进制数
                                            var first = (15 + (num + 1) * 5)//获取第一个技能槽的cost
                                            var last = (15 + (num + add) * 5)//最后一个cost
                                            var cost = ((first + last) * add) / 2//高斯求和公式
                                            if (lib.config.xjb_hunbi >= cost) {
                                                game.xjb_create.confirm('开启' + add + '个技能槽，需要' + cost + '个魂币，是否开启？', function () {
                                                    game.cost_xjb_cost(1, cost)
                                                    game.xjb_newCharacterAddJnc(add)
                                                })
                                            }
                                            else game.xjb_create.alert('需要' + cost + '个魂币，你的魂币不足！')
                                        }
                                    })

                                }
                                obj.changeSkill2 = function () {
                                    var list = lib.config.xjb_newcharacter.skill
                                    if (list.length < 1) return game.xjb_create.alert('你没有技能！')
                                    game.xjb_create.prompt(Longstr(list), "", function () {
                                        var num = this.result
                                        var skill = list[num]
                                        if (list.contains(skill)) {
                                            normalStr(skill).nextConfirm('是否回收此技能并获得5魂币？', function () {
                                                lib.config.xjb_newcharacter.skill.remove(skill)
                                                game.xjb_systemEnergyChange(skill.length)
                                                game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                                game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi + 5)
                                                game.xjb_create.alert('你已删除该技能，重启即生效！' + "<br>当前魂币值为" + lib.config.xjb_hunbi).nextConfirm("是否继续查看？", function () {
                                                    obj.changeSkill2()
                                                })
                                            }, function () {
                                                game.xjb_create.confirm("是否继续查看？", function () {
                                                    obj.changeSkill2()
                                                })
                                            })
                                        }
                                        else game.xjb_create.alert("你的输入有误!")
                                    })

                                }
                                obj.changeSkill3 = function () {
                                    var haven = lib.config.xjb_newcharacter.skill, SkillList = lib.config.xjb_list_hunbilist.skill
                                    var first = SkillList.first, second = SkillList["second"], third = SkillList["third"]
                                    var list = first.concat(second, third)
                                    list.remove(haven)
                                    game.xjb_create.prompt(Longstr(list), "", function () {
                                        var num = this.result
                                        var willget = list[num]
                                        if (list.contains(willget)) {
                                            var myAlert = normalStr(willget)
                                            if (haven.length < lib.config.xjb_jnc) {
                                                if (first.contains(willget)) var cost = 15
                                                if (second.contains(willget)) var cost = 25
                                                if (third.contains(willget)) var cost = 50
                                                if (lib.config.xjb_hunbi >= cost) {
                                                    myAlert.nextConfirm('你已达成获得该技能的条件，是否花费' + cost + '个魂币，获得此技能？', function () {
                                                        game.cost_xjb_cost(1, cost)
                                                        game.xjb_systemEnergyChange(-cost - 3)
                                                        lib.config.xjb_newcharacter.skill.add(willget)
                                                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                                        game.xjb_create.alert('你已获得该技能，重启即生效！').nextConfirm("是否继续查看？", function () {
                                                            obj.changeSkill3()
                                                        })
                                                    }, function () {
                                                        game.xjb_create.confirm("是否继续查看？", function () {
                                                            obj.changeSkill3()
                                                        })
                                                    })
                                                }
                                            }
                                        }
                                        else game.xjb_create.alert("你的输入有误!")
                                    })
                                }
                                if (!lib.config.xjb_jnc) lib.config.xjb_jnc = 0
                                obj["changeSkill" + abcde]()

                            }
                            var sinks = function (str1) {

                                if (!lib.config.xjb_newcharacter.sink) lib.config.xjb_newcharacter.sink = []
                                game.xjb_create.file("请输入你的皮肤名，并选定图片，待确定出现后按确定即可。<br>注意:本功能仅手机端支持！", str1, function () {
                                    var that = this
                                    function theDownload() {
                                        var fileTransfer = new FileTransfer();
                                        var Myalert = game.xjb_create.alert("正在导入中...")
                                        ui.xjb_toBeHidden(Myalert.buttons[0])
                                        fileTransfer.download(that.file.result, lib.xjb_src + "sink/xin_newCharacter/normal/" + that.result + that.file.type, function () {
                                            Myalert.innerHTML = "导入成功！"
                                            ui.xjb_toBeVisible(Myalert.buttons[0])
                                            lib.config.xjb_newcharacter.sink.add(that.result + that.file.type)
                                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                        }, function (e) {
                                            Myalert.innerHTML = "导入失败！<br>" + e.code
                                            ui.xjb_toBeVisible(Myalert.buttons[0])
                                        });

                                    }
                                    if (lib.config.xjb_newcharacter.sink.contains(that.result)) {
                                        game.xjb_create.confirm("你已有该同名的皮肤，是否覆盖？", theDownload, function () { sinks("img") })
                                    }
                                    else theDownload()
                                })
                            }
                            var object = {
                                other: o => 1,
                                name2: function () {
                                    game.xjb_gainJP("免费更改姓名")
                                },
                                sex: function () {
                                    let sex = lib.config.xjb_newcharacter.sex
                                    game.xjb_create.confirm('你当前性别为：' + get.translation(sex) + '，更改性别需要1张性转卡(10魂币一张，当前你有' + lib.config.xjb_objects["changeSexCard"] + '张，无则自动购买)确定要更改吗？', function () {
                                        game.xjb_gainJP("免费更改性别", false)
                                    })
                                },
                                group: function () {
                                    let group = lib.config.xjb_newcharacter.group
                                    game.xjb_create.confirm('你当前势力为：' + get.translation(group) + '，更改势力需要1个择木卡(6魂币一张，当前你有' + lib.config.xjb_objects["changeGroupCard"] + '张，无则自动购买)，确定要更改吗？', function () {
                                        game.xjb_gainJP("免费更改势力", false)
                                    })
                                },
                                hp: function () {
                                    game.xjb_gainJP("体力值(1点)", false)
                                },
                                intro: function () {
                                    game.xjb_create.prompt('请输入该角色的背景信息', lib.config.xjb_newcharacter.intro, function () {
                                        lib.config.xjb_newcharacter.intro = this.result
                                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                        game.xjb_systemEnergyChange(-1)
                                    })
                                },
                                unique: function () {
                                    game.xjb_create.configList({
                                        xjb_newCharacter_isZhu: "设置为常备主公",
                                        xjb_newCharacter_hide: "设置登场时隐匿",
                                        xjb_newCharacter_addGuoZhan: "加入国战模式",
                                    })
                                },
                                skill1: function () {
                                    changeSkill(1)
                                },
                                skill2: function () {
                                    changeSkill(2)
                                },
                                skill3: function () {
                                    changeSkill(3)
                                },
                                sink1: function () {
                                    sinks("img")
                                },
                                sink3: function () {
                                    game.xjb_create.button("未选中皮肤", lib.xjb_src + "sink/xin_newCharacter/normal/", lib.config.xjb_newcharacter.sink, function () {
                                        lib.config.xjb_newcharacter.selectedSink = "ext:新将包/sink/xin_newCharacter/normal/" + this.result
                                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                        game.xjb_create.alert('更改皮肤为' + this.result + '，重启即生效');
                                        if (lib.character.xjb_newCharacter) {
                                            if (lib.character.xjb_newCharacter[4].contains("red")) { }
                                            else {
                                                lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSink]
                                                lib.characterPack["mode_extension_新将包"].xjb_newCharacter
                                            }
                                        }
                                    }, function () {
                                        game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                    })
                                },
                                sink4: function () {
                                    lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
                                    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                    game.xjb_create.alert('已恢复至原皮，重启即生效');
                                    if (lib.character.xjb_newCharacter) {
                                        if (lib.character.xjb_newCharacter[4].contains("red")) { }
                                        else if (lib.character.xjb_newCharacter[4].contains("xuemo")) { }
                                        else {
                                            lib.character.xjb_newCharacter[4] = [lib.config.xjb_newcharacter.selectedSink]
                                            lib.characterPack["mode_extension_新将包"].xjb_newCharacter
                                        }
                                    }
                                },

                            }
                            object[layout]()
                            return object
                        }

                    }
                }


                
                if (!lib.config.xjb_bianshen) {
                    lib.extensionMenu.extension_新将包.bianshen_hun_open = {
                        name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁变身功能',
                        clear: true,
                        onclick: function () {
                            var that = this
                            if (lib.config.xjb_hunbi >= 15) {
                                game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁该功能需要15个魂币，确定要解锁吗？', function () {
                                    game.cost_xjb_cost(1, 15)
                                    game.saveConfig('xjb_bianshen', 1);
                                    game.xjb_create.alert('已解锁变身功能，重启即生效');
                                    that.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁变身功能'
                                })
                            }
                            else game.xjb_create.alert('需要15个魂币，你的魂币不足！');
                        }
                    }
                }
                else {
                    on_or_off1 = function () {
                        if (lib.config.xjb_bianshen == 2) return '<font color="blue">开启变身功能</font>'
                        return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">关闭变身功能</font>'
                    }
                    lib.extensionMenu.extension_新将包.bianshen_hun_on_or_off = {
                        name: on_or_off1(),
                        clear: true,
                        onclick: function () {
                            if (lib.config.xjb_bianshen == 2) lib.config.xjb_bianshen = 1;
                            else lib.config.xjb_bianshen = 2;
                            game.saveConfig('xjb_bianshen', lib.config.xjb_bianshen);
                            game.xjb_create.alert('魂币系统已更新，重启即生效');
                            this.innerHTML = on_or_off1()
                        }
                    }
                }

                if (!lib.config.xjb_yangcheng) {
                    lib.extensionMenu.extension_新将包.yangcheng_hun_open = {
                        name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁养成功能',
                        clear: true,
                        onclick: function () {
                            var that = this
                            if (lib.config.xjb_hunbi >= 5) {
                                game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁养成功能需要5个魂币，确定要解锁吗？', function () {
                                    game.cost_xjb_cost(1, 5)
                                    game.saveConfig('xjb_yangcheng', 1);
                                    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter);
                                    game.xjb_create.alert('已解锁养成功能，角色已添加到soul包，重启则自动生效');
                                    that.innerHTML = '<img src="' + lib.assetURL + '/extension/新将包/image/xjb_open.png" width="16">' + '你已解锁养成功能'
                                })
                            }
                            else game.xjb_create.alert('需要5个魂币，你的魂币不足！');
                        }
                    }
                }
                else {
                    on_or_off2 = function () {
                        if (lib.config.xjb_yangcheng == 2) return '<font color="blue">开启养成功能</font>'
                        return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">关闭养成功能</font>'
                    }
                    lib.extensionMenu.extension_新将包.yangcheng_hun_on_or_off = {
                        name: on_or_off2(),
                        clear: true,
                        onclick: function () {
                            game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                            if (lib.config.xjb_yangcheng == 2) lib.config.xjb_yangcheng = 1;
                            else lib.config.xjb_yangcheng = 2;
                            game.saveConfig('xjb_yangcheng', lib.config.xjb_yangcheng);
                            game.xjb_create.alert('魂币系统已更新，重启即生效');
                            this.innerHTML = on_or_off2()
                        }
                    }
                }
                if (!lib.config.xjb_chupingjisha) {
                    lib.extensionMenu.extension_新将包.xjb_chupingjisha_hun_open = {
                        name: '<img src="' + lib.xjb_src + 'image/xjb_locked.png" width="16">' + '点我解锁触屏即杀功能',
                        clear: true,
                        onclick: function () {
                            var that = this
                            if (lib.config.xjb_hunbi >= 50) {
                                game.xjb_create.confirm('你已有' + lib.config.xjb_hunbi + '个魂币，解锁触屏即杀功能需要50个魂币，确定要解锁吗？', function () {
                                    game.cost_xjb_cost(1, 50)
                                    game.saveConfig('xjb_chupingjisha', 1);
                                    that.innerHTML = '<img src="' + lib.xjb_src + 'image/xjb_open.png" width="16">' + '你已解锁触屏即杀'
                                })
                            }
                            else game.xjb_create.alert('需要50个魂币，你的魂币不足！');
                        }
                    }
                } else {
                    let on_or_off3 = function () {
                        if (lib.config.xjb_chupingjisha == 2) return '<font color="blue">开启触屏即杀</font>'
                        return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="red">关闭触屏即杀</font>'
                    }
                    lib.extensionMenu.extension_新将包.xjb_chupingjisha_hun_on_or_off = {
                        name: on_or_off3(),
                        clear: true,
                        onclick: function () {
                            if (lib.config.xjb_chupingjisha == 2) {
                                lib.config.xjb_chupingjisha = 1;
                                lib.config.xjb_systemEnergy>0&&lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()
                            }
                            else {
                                lib.config.xjb_chupingjisha = 2;
                                ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove&&ui.xjb_chupingjisha.remove()                               
                            }
                            game.saveConfig('xjb_chupingjisha', lib.config.xjb_chupingjisha);
                            this.innerHTML = on_or_off3()
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
            if (true) {
                function on_off_ll() {
                    if (lib.config.xjb_lingli_Allallow) return '<img src="' + lib.xjb_src + 'image/xjb_close.png" width="16">' + '<font color="#e75480">点我关闭全员灵力系统</font>'
                    return '<font color="blue">点我开启全员灵力系统</font>'
                }
                lib.extensionMenu.extension_新将包.xjb_lingliOpen = {
                    name: on_off_ll(),
                    clear: true,
                    onclick: function () {
                        lib.config.xjb_lingli_Allallow = !lib.config.xjb_lingli_Allallow
                        game.saveConfig('xjb_lingli_Allallow', lib.config.xjb_lingli_Allallow)
                        this.innerHTML = on_off_ll()
                    }
                }
            }
            lib.extensionMenu.extension_新将包.skillEditor = {
                name: '<div>技能编写器</div>',
                clear: true,
                onclick: function () {
                    game.xjb_skillEditor()
                }
            }
            lib.xjb_dataGet = function () {
                return Object.keys(lib.config).filter(function (a) {
                    return a.indexOf("xjb_") > -1
                })
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
                name: '<div>导出魂币系统数据！(仅供手机端)</div>',
                clear: true,
                onclick: function () {
                    new Promise(res => {
                        game.xjb_create.prompt("请输入导出文件的名字", "", function () {
                            res(this.result)
                        })
                    }).then(data => {
                        let dataxjb = {};
                        lib.xjb_dataGet().forEach(i => { dataxjb[i] = lib.config[i] })
                        let BLOB = new Blob([JSON.stringify(dataxjb)], {
                            type: "application/javascript;charset=utf-8"
                        })
                        var reader = new FileReader()
                        reader.readAsDataURL(BLOB, "UTF-8")
                        reader.onload = function () {
                            var fileTransfer = new FileTransfer();
                            var Myalert = game.xjb_create.alert("正在导出中...")
                            fileTransfer.download(this.result, lib.xjb_src + "json/" + data + ".json", function () {
                                Myalert.innerHTML = "导出成功！"
                            }, function (e) {
                                Myalert.innerHTML = "导出失败！<br>" + e.code
                            });

                        }
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
                                game.print(i, data[i]);
                                lib.config[i] = data[i];
                                game.saveConfig(i, lib.config[i])
                            })
                            game.xjb_create.alert("数据已载入，请重启", function () {
                                game.reload();
                            })
                        })
                    })
                }
            }























        },precontent:function () {

        },help:{},config:{},package:{
    character:{
        character:{
            "xin_fellow":["male","shen",5,[],["unseen"]],
            "xjb_daqiao":["female","wu",3,["xjb_liuli","xjb_guose"],[]],
            "xjb_sunce":["male","wu","3/3",["xin_taoni","xin_jiang","xin_yingyi"],["zhu"]],
            "xjb_guojia":["male","wei",3,["xin_dongxin","xin_qizuo","xin_zaozhong"],[]],
            "xjbhan_caocao":["male","han",4,["xin_zhibang","xin_chuhui"],[]],
            "xjbhan_xunyu":["male","han",3,["xin_bingjie","xin_liuxiang"],[]],
            "xjb_pangtong":["male","shu",3,["xin_niepan","xin_lianhuan"],[]],
            "xjb_caocao":["male","wei",4,["xin_guixin","xin_fengtian","xin_tanyan"],["zhu"]],
            "xjb_zhouyu":["male","wu",4,["xin_shiyin","xin_yingfa"],[]],
            "xjb_liushan":["male","shu",3,["xin_fangquan","xin_baisu","xin_xiangle"],["zhu"]],
            "xjb_zhangliang_liuhou":["male","shen",3,["xin_mousheng","xin_whlw1","xin_duice"],[]],
            "xjb_dianwei":["male","wei",5,["xin_huzhu","xin_xiongli"],[]],
            "xjb_ganning":["male","wu",4,["xin_yexi","xin_ziruo"],[]],
            "xjb_zhugeliang":["male","shu",3,["xin_jincui","xin_chushi"],[]],
            "xjb_jin_simayi":["male","jin",4,["xin_huanshi","xin_zhabing"],[]],
            "xjb_yingzheng":["male","shen",3,["xin_tianming","xin_zulong","xin_longpan"],[]],
            "xjb_fazheng":["male","shu",3,["xin_enyuan","xin_qisuan","xjb_fuyi"],[]],
        },
        translate:{
            "xin_fellow":"秦兵",
            "xjb_daqiao":"大乔",
            "xjb_sunce":"孙策",
            "xjb_guojia":"郭嘉",
            "xjbhan_caocao":"曹操",
            "xjbhan_xunyu":"荀彧",
            "xjb_pangtong":"庞统",
            "xjb_caocao":"曹操",
            "xjb_zhouyu":"周瑜",
            "xjb_liushan":"刘禅",
            "xjb_zhangliang_liuhou":"张良",
            "xjb_dianwei":"典韦",
            "xjb_ganning":"甘宁",
            "xjb_zhugeliang":"诸葛亮",
            "xjb_jin_simayi":"司马懿",
            "xjb_yingzheng":"嬴政",
            "xjb_fazheng":"法正",
        },
    },
    card:{
        card:{
            qimendunjia:{
                type:"trick",
                toself:true,
                enable:function (event, player) {
                    return true;
                },
                selectTarget:-1,
                modTarget:true,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                content:function () {
                    'step 0'
                    if (target.name1.indexOf("zhugeliang") > -1) {
                        var list = ["盈", "缺", "愈", "疾", "焰", "雷"]
                        target.fc_X(true, 'choose', 'needResult', { choice: list, storage: "qimendunjia", chopro: "请选择一个魂将的X技能力" })
                        event.bool = true
                    }
                    'step 1'
                    var ability = target.storage["qimendunjia"]
                    player.$skill(ability, "legend")
                    var num = lib.xjb_list_xinyuan.X_skill_num[ability]
                    target.storage._skill_xin_X_locked = num
                    target.fc_X(num)
                },
                fullskin:true,
            },
            "xin_qinnangshu":{
                type:"equip",
                subtype:"equip5",
                skills:["xin_qinnang2"],
                nomod:true,
                nopower:true,
                cardcolor:"red",
                unique:true,
                onLose:function () {
                    card.fix();
                    card.remove();
                    card.destroyed = true;
                    player.addSkillLog("xin_qinnang2")
                    game.log(card, '被销毁了');
                },
                ai:{
                    equipValue:7.5,
                    basic:{
                        order:function (card, player) {
                            if (player && player.hasSkillTag('reverseEquip')) {
                                return 8.5 - get.equipValue(card, player) / 20;
                            }
                            else {
                                return 8 + get.equipValue(card, player) / 20;
                            }
                        },
                        useful:2,
                        equipValue:1,
                        value:function (card, player, index, method) {
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
                    result:{
                        target:function (player, target, card) {
                            return get.equipResult(player, target, card.name);
                        },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function () {
                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                },
                toself:true,
                image:"ext:新将包/xin_qingnangshu.jpg",
                fullskin:true,
            },
            "card_lw":{
                enable:true,
                type:"trick",
                derivation:"jiaxu",
                toself:true,
                selectTarget:-1,
                modTarget:true,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                content:function () {
                    "step 0"
                    player.logSkill('luanwu')
                    event.current = target.next;
                    event.currented = [];
                    "step 1"
                    event.currented.push(event.current);
                    event.current.animate('target');
                    event.current.chooseToUse('乱武：使用一张杀或失去一点体力', function (card) {
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
                        event.current.chooseToDiscard('h', 2, true)
                        event.current.loseHp();
                    }
                    event.current = event.current.next;
                    if (event.current != player && !event.currented.contains(event.current)) {
                        game.delay(0.5);
                        event.goto(1);
                    }

                },
                fullimage:true,
            },
            "xin_qinglong":{
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-2,
                },
                onLose:function () {
                    card.fix();
                    card.remove();
                    card.destroyed = true;
                    game.log(card, '被销毁了');
                    player.$skill('二龙互化', 'legend', 'metal');
                    player.equip(game.createCard('qinglong', 'spade', 5))
                },
                ai:{
                    equipValue:function (card, player) {
                        var num = 2.5 + (player.countCards('h') + player.countCards('e')) / 2.5;
                        return Math.min(num, 5);
                    },
                    basic:{
                        equipValue:4.5,
                    },
                },
                skills:["xin_yanyue"],
            },
            "xin_chitu":{
                fullskin:true,
                type:"equip",
                subtype:"equip4",
                nomod:true,
                nopower:true,
                distance:{
                    globalFrom:-1,
                    globalTo:1,
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function () {
                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                },
                toself:true,
                onLose:function () {
                    card.fix();
                    card.remove();
                    card.destroyed = true;
                    game.log(card, '被销毁了');
                    player.equip(game.createCard('chitu', 'heart', 5))
                },
                skills:["xin_zhuihun","new_wuhun"],
                ai:{
                    basic:{
                        order:function (card, player) {
                            if (player && player.hasSkillTag('reverseEquip')) {
                                return 8.5 - get.equipValue(card, player) / 20;
                            }
                            else {
                                return 8 + get.equipValue(card, player) / 20;
                            }
                        },
                        useful:2,
                        equipValue:4,
                        value:function (card, player, index, method) {
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
                    result:{
                        target:function (player, target, card) {
                            return get.equipResult(player, target, card.name);
                        },
                    },
                },
            },
            "xin_baiyin":{
                fullskin:true,
                type:"equip",
                subtype:"equip2",
                loseDelay:false,
                onLose:function () {
                    card.fix();
                    card.remove();
                    card.destroyed = true;
                    game.log(card, '被销毁了');
                    player.equip(game.createCard('baiyin', 'club', 1))
                    player.recover();
                },
                skills:["xin_shinu"],
                tag:{
                    recover:1,
                },
                ai:{
                    order:9.5,
                    equipValue:function (card, player) {
                        if (player.hp == player.maxHp) return 5;
                        if (player.countCards('h', 'baiyin')) return 6;
                        return 0;
                    },
                    basic:{
                        equipValue:5,
                        order:function (card, player) {
                            if (player && player.hasSkillTag('reverseEquip')) {
                                return 8.5 - get.equipValue(card, player) / 20;
                            }
                            else {
                                return 8 + get.equipValue(card, player) / 20;
                            }
                        },
                        useful:2,
                        value:function (card, player, index, method) {
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
                    result:{
                        target:function (player, target, card) {
                            return get.equipResult(player, target, card.name);
                        },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function () {
                    if (cards.length && get.position(cards[0], true) == 'o') target.equip(cards[0]);
                },
                toself:true,
            },
            "xin_hutou":{
                fullskin:true,
                type:"equip",
                subtype:"equip1",
                distance:{
                    attackFrom:-2,
                },
                skills:["hengwu"],
                loseDelay:false,
                onLose:function () {
                    card.fix();
                    card.remove();
                    card.destroyed = true;
                    game.log(card, '被销毁了');
                    player.$skill('虎恨', 'legend', 'metal');
                    player.equip(game.createCard(get.typeCard('equip').randomGet()))
                },
                ai:{
                    basic:{
                        equipValue:2,
                        order:function (card, player) {
                            if (player && player.hasSkillTag('reverseEquip')) {
                                return 8.5 - get.equipValue(card, player) / 20;
                            }
                            else {
                                return 8 + get.equipValue(card, player) / 20;
                            }
                        },
                        useful:2,
                        value:function (card, player) {
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
                    result:{
                        target:function (player, target, card) {
                            return get.equipResult(player, target, card.name);
                        },
                    },
                },
                enable:true,
                selectTarget:-1,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function () {
                    target.equip(card);
                },
                toself:true,
            },
            "xin_qixing":{
                type:"equip",
                subtype:"equip2",
                skills:["qixing","xin_xuming"],
                onLose:function () {
                    player.gain(player.getExpansions('qixing'), 'gain2', 'fromStorage');
                    card.fix();
                    card.remove();
                    card.destroyed = true;
                    game.log(card, '被销毁了');
                    player.removeSkill('guanxing')
                },
                ai:{
                    basic:{
                        equipValue:6.5,
                        order:function (card, player) {
                            if (player && player.hasSkillTag('reverseEquip')) {
                                return 8.5 - get.equipValue(card, player) / 20;
                            }
                            else {
                                return 8 + get.equipValue(card, player) / 20;
                            }
                        },
                        useful:2,
                        value:function (card, player, index, method) {
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
                    result:{
                        target:function (player, target, card) {
                            return get.equipResult(player, target, card.name);
                        },
                    },
                },
                fullskin:true,
                enable:true,
                selectTarget:-1,
                filterTarget:function (card, player, target) {
                    return target == player;
                },
                modTarget:true,
                allowMultiple:false,
                content:function () {
                    target.equip(cards[0]);
                    player.$skill('武侯之魂', 'legend', 'metal');
                    game.me.addToExpansion(get.cards(7), 'gain2').gaintag.add('qixing');

                },
                toself:true,
            },
        },
        translate:{
            qimendunjia:"奇门遁甲",
            "qimendunjia_info":"出牌阶段，对自己使用，执行奇门遁甲事假。",
            "xin_qinnangshu":"青囊书",
            "xin_qinnangshu_info":"青囊2:装备此牌，出牌阶段限一次，可对一名角色使用【桃】，每使用一张，则你与其各摸一张牌。",
            "card_lw":"文和乱武",
            "card_lw_info":"出牌阶段，对你自己使用，所有其他角色除非对其距离最近的角色使用【杀】，否则弃置两张牌并失去1点体力。",
            "xin_qinglong":"黄龙偃月刀",
            "xin_qinglong_info":"<br>偃月:当你对一名角色造成伤害前，你可以弃置两张牌令此伤害+1，你令其获得一个\"梦魇\"标记。<br>二龙互化：你失去此牌时你立即销毁之，你装备【青龙偃月刀】。",
            "xin_chitu":"梦魇赤兔马",
            "xin_chitu_info":"增加以下效果:<br>追魂:锁定技，你受到伤害后，伤害来源须弃置一张牌并获得一个\"梦魇\"，然后你额外进行一个回合。<br>关公之魂：你失去此牌时立即销毁之，然后你装备【赤兔】。",
            "xin_baiyin":"曜日银狮子",
            "xin_baiyin_info":"<br>狮怒:你受到伤害前，你立即反伤；你可抵消一次，你体力值为1时受到的伤害，然后移去此牌。<br>你失去装备区里的该牌时立即销毁之，然后你恢复1点体力，之后你装备【白银狮子】。",
            "xin_hutou":"虎头湛金枪",
            "xin_hutou_info":"马超之魂：你装备了此牌则视为拥有【横骛】<br>虎恨：当你装备区失去此牌时你立即销毁之，然后你装备任意一张装备牌。",
            "xin_qixing":"卧龙七星袍",
            "xin_qixing_info":"<br>武侯之魂：你装备有此牌时，则拥有技能【七星】；你装备此牌时，立即获得七颗“星”。<br>七星续命：当一名角色濒死时，然后选择一项执行：1.使用一张【奇门遁甲】；2.自动弃置一颗\"星\"，令其恢复1点体力；<br>你失去此牌时，你立即销毁之，你获得你武将牌上的所有“星\"",
        },
        list:[],
    },
    skill:{
        skill:{
            "xin_jincui":{
                audio:"ext:新将包:2",
                trigger:{
                    player:"phaseBefore",
                },
                round:1,
                content:function () {
        "step 0"
        player.fc_X(62, '再动', true, [2])
        "step 1"
        var card1 = game.createCard2('sha', 'red', undefined, 'fire')
        var card2 = game.createCard2('sha', 'red', undefined, 'fire')
        player.addToExpansion([card1, card2], 'giveAuto', player).gaintag.add('xin_chushi')
    },
                group:["xin_jincui_roundcount"],
            },
            "xin_chushi":{
                enable:"phaseUse",
                usable:1,
                filter:function (event, player) {
                    return player.getExpansions("xin_chushi").length > 0
                },
                content:function () {
                    "step 0"
                    player.getCards("x").forEach(i => {
                        player.chooseUseTarget(i)
                    })
                },
                marktext:"师",
                intro:{
                    content:"expansion",
                    markcount:"expansion",
                },
                onremove:function (player, skill) {
                    var cards = player.getExpansions(skill);
                    if (cards.length) player.loseToDiscardpile(cards);
                },
                ai:{
                    order:9,
                    result:{
                        target:function (player, target) {
                            return 2;
                        },
                    },
                    threaten:1.5,
                },
            },
            "xin_yeling":{
                trigger:{
                    player:["phaseZhunbeiBegin"],
                },
                forced:true,
                mark:true,
                priority:1000,
                content:function () {
                    'step 0'
                    player.judge()
                    'step 1'
                    player.fc_X(true, '残区', { remnant: result.card.name })
                },
            },
            "xin_huanshi":{
                trigger:{
                    global:["judgeBegin"],
                },
                filter:function (event, player) {
                    return player.countCards('he') > 0;
                },
                frequent:true,
                content:function () {
                    "step 0"
                    player.chooseCard('he', [1, Infinity], '将任意张牌置于牌堆顶').set('ai', function (card) {
                        var trigger = _status.event.getTrigger();
                        var player = _status.event.player;
                        var result = trigger.judge(card)
                        var attitude = get.attitude(player, trigger.player);
                        if (attitude == 0 || result == 0) return 0;
                        if (attitude > 0) {
                            return result - get.value(card) / 2;
                        }
                        else {
                            return -result - get.value(card) / 2;
                        }
                    })
                    "step 1"
                    if (result.bool) {
                        player.fc_X(true, '置于牌堆顶', '牌堆底摸牌', { toTopCard: result.cards }, [1, result.cards.length])
                    }
                },
            },
            "xin_bianzhu":{
                trigger:{
                    global:"judgeEnd",
                },
                filter:function (event, player) {
                    if (event.result.card.suit !== 'club') return false
                    return game.countPlayer(function (current) {
                        return current.hasSkill("xin_yeling")
                    }) > 0
                },
                content:function () {
                    "step 0"
                    player.fc_X(true, "再动", "获得技能", { skills: ['xin_bianzhu_win'] })
                },
                subSkill:{
                    win:{
                        trigger:{
                            player:["useCardEnd"],
                        },
                        forced:true,
                        filter:function (event, player) {
                            return event.targets && event.card && get.type(event.card) !== 'equip';
                        },
                        content:function () {
                            "step 0"
                            let num = [1, 2, 3].randomGet()
                            player.fc_X(true, '残区', {
                                remnant: trigger.card.name,
                                onlyme: trigger.targets
                            }, [num])
                        },
                        sub:true,
                    },
                },
            },
            "xin_zhabing":{
                trigger:{
                    player:"phaseBegin",
                },
                derivation:["xin_yeling","xin_bianzhu"],
                limited:true,
                skillAnimation:true,
                filter:function (event, player) {
                    return !player.isHealthy()
                },
                animationColor:"thunder",
                content:function () {
                    'step 0'
                    trigger.cancel()
                    var targets = game.players
                    player.fc_X(true, 83, { skills: ['xin_yeling'], expire: { player: 'xin_yelingAfter' }, onlyme: targets })
                    player.fc_X(true, 23, 133, 143, { skills: ['xin_bianzhu'], awaken: ['xin_zhabing'], remove: ['xin_yeling'] })
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                init:function (player, skill) {
                    player.storage[skill] = false;
                    player.storage.xin_zhabing = false;
                },
            },
            "xin_huzhu":{
                derivation:["xin_huzhu2"],
                audio:"ext:新将包:false",
                trigger:{
                    global:"useCardToTargeted",
                },
                check:function (event, player) {
        return get.attitude(player, event.target) > 0 && !event.target.hasSkill('xin_huzhu2');
    },
                filter:function (event, player) {
        if (event.card.name == 'sha' && event.player != player) return true
        return false
    },
                prompt:function (event, player) {
        return '是否对' + get.translation(event.target) + '发动〖护主〗？'
    },
                content:function () {
        'step 0'
        player.chooseToDiscard('he', 1, '弃置一张牌，或点取消失去一点体力').set('ai', function (card) {
            return 8 - get.value(card)
        })
        'step 1'
        if (result.bool) {
            trigger.target.draw(2)
        }
        else {
            player.loseHp()
            trigger.target.addTempSkill('xin_huzhu2', { player: 'dieAfter' })
            trigger.target.storage.xin_huzhu2++
        }
        'step 2'
        trigger.target.update();
    },
                ai:{
                    threaten:2.6,
                },
            },
            "xin_huzhu2":{
                init:function (player) {
        player.storage.xin_huzhu2 = 0;
        player.markSkill('xin_huzhu2');
        player.syncStorage('xin_huzhu2');
    },
                enable:["chooseToUse","chooseToRespond"],
                viewAs:{
                    name:"shan",
                    isCard:true,
                },
                filterCard:function () { return false },
                selectCard:-1,
                onuse:function (event, player) {
        player.draw()
        player.storage.xin_huzhu2--;
        player.update();
        if (player.storage.xin_huzhu2 <= 0) player.removeSkill('xin_huzhu2')
    },
                onrespond:function (event, player) {
        
        player.draw()
        player.storage.xin_huzhu2--;
        player.update();
       
        if (player.storage.xin_huzhu2 <= 0) player.removeSkill('xin_huzhu2')
    },
                marktext:"护",
                prompt:"视为使用或打出一张【闪】",
                intro:{
                    content:"护：你可在需要时，视为使用或打出一张【闪】。若此做，你失去一个“护”。 ",
                },
                ai:{
                    respondShan:true,
                    order:3,
                    basic:{
                        useful:[7,2],
                        value:[7,2],
                    },
                    result:{
                        player:1,
                    },
                },
            },
            "xin_xiongli":{
                enable:"phaseUse",
                multitarget:true,
                multiline:true,
                selectTarget:[1,Infinity],
                filterTarget:function (card, player, target) {
                    return (target != player)
                },
                qzj:true,
                usable:1,
                content:function () {
                    player.fc_X(true, 54, { onlyme: targets })
                    player.fc_X(true, "残区", { remnant: 'sha' }, [targets.length])
                },
                ai:{
                    damage:true,
                    order:6,
                    result:{
                        target:function (player, target) {
                            return get.damageEffect(target, player);
                        },
                    },
                    threaten:1.5,
                    expose:0.3,
                },
            },
            "xin_mousheng":{
                trigger:{
                    player:"compare",
                    target:"compare",
                },
                filter:function (event) {
                    return !event.iwhile;
                },
                forced:true,
                locked:false,
                content:function () {
                    if (player == trigger.player) {
                        trigger.num1 += game.roundNumber;
                        if (trigger.num1 > 13) trigger.num1 = 13;
                    }
                    else {
                        trigger.num2 += game.roundNumber;
                        if (trigger.num2 > 13) trigger.num2 = 13;
                    }
                },
            },
            "xin_fq1":{
                trigger:{
                    player:["phaseAfter","phaseJieshuBegin","phaseDrawBefore","phaseDiscardBefore"],
                },
                charlotte:true,
                direct:true,
                forced:true,
                priority:100,
                content:function () {
                    if (event.triggername == 'phaseAfter') {
                        player.storage.xin_fq1 = 0
                        player.removeSkill('xin_fq1')
                        player.update()
                    }
                    else trigger.cancel()
                    if (event.triggername == 'phaseJudgeBegin') game.log(player, '跳过了判定阶段');
                    else if (event.triggername == 'phaseDrawBefore') game.log(player, '跳过了摸牌阶段');
                    else if (event.triggername == 'phaseJieshuBegin') game.log(player, '跳过了结束阶段');
                    else game.log(player, '跳过了弃牌阶段');
                },
                init:function (player) {
                    player.storage.xin_fq1 = 0;
                    player.markSkill('xin_fq1');
                    player.syncStorage('xin_fq1');
                },
                intro:{
                    content:"该回合你跳过判定阶段、摸牌阶段、弃牌阶段、结束阶段",
                },
            },
            "xin_fq2":{
                trigger:{
                    player:["phaseAfter","phaseUseBefore","phaseDiscardBefore","phaseJudgeBegin"],
                },
                charlotte:true,
                direct:true,
                forced:true,
                priority:100,
                content:function () {
                    if (event.triggername == 'phaseAfter') {
                        player.storage.xin_fq2 = 0
                        player.removeSkill('xin_fq2')
                        player.update()
                    }
                    else trigger.cancel();
                    if (event.triggername == 'phaseUseBefore') game.log(player, '跳过了出牌阶段');
                    else if (event.triggername == 'phaseJudgeBegin') game.log(player, '跳过了判定阶段');
                    else game.log(player, '跳过了弃牌阶段');
                },
                init:function (player) {
                    player.storage.xin_fq2 = 0;
                    player.markSkill('xin_fq2');
                    player.syncStorage('xin_fq2');
                },
                intro:{
                    content:"该回合你跳过准备阶段、出牌阶段、弃牌阶段",
                },
            },
            "xin_fq3":{
                trigger:{
                    player:["phaseAfter","phaseDiscardBefore","phaseZhunbeiBegin","phaseJieshuBegin"],
                },
                charlotte:true,
                direct:true,
                forced:true,
                priority:100,
                content:function () {
                    if (event.triggername == 'phaseAfter') {
                        player.storage.xin_fq3 = 0
                        player.removeSkill('xin_fq3')
                        player.update()
                    }
                    else trigger.cancel();
                    if (event.triggername == 'phaseZhunbeiBegin') game.log(player, '跳过了准备阶段');
                    else if (event.triggername == 'phaseJieshuBegin') game.log(player, '跳过了结束阶段');
                    else game.log(player, '跳过了弃牌阶段');
                },
                init:function (player) {
                    player.storage.xin_fq3 = 0;
                    player.markSkill('xin_fq3');
                    player.syncStorage('xin_fq3');
                },
                intro:{
                    content:"该回合你跳过准备阶段、弃牌阶段",
                },
            },
            "xin_fangquan":{
                enable:"phaseUse",
                filterCard:true,
                selectCard:[1,3],
                position:"hes",
                check:function (card) {
                    return 6 - get.value(card)
                },
                xjb:true,
                usable:1,
                filterTarget:function (card, player, target) {
                    return !target.hasSkill('xin_fangquan') && !target.hasSkill('xin_fq2') && !target.hasSkill('xin_fq3') && !target.hasSkill('xin_fq1');
                },
                prompt:"令一名角色额外进行一个回合",
                content:function () {
                    var num = cards.length;
                    switch (num) {
                        case 1: {
                            target.addSkill('xin_fq1')
                            target.storage.xin_fq1++;
                            target.update()
                        }; break;
                        case 2: {
                            target.addSkill('xin_fq2')
                            target.storage.xin_fq2++;
                            target.update()
                        }; break;
                        case 3: {
                            target.addSkill('xin_fq3')
                            target.storage.xin_fq3++;
                            target.update()
                        }; break;
                    }
                    target.insertPhase();
                },
                ai:{
                    order:6,
                    result:{
                        target:function (player, target) {
                            return 2;
                        },
                    },
                    threaten:1.2,
                },
            },
            "xin_baisu":{
                audio:"ext:新将包:false",
                trigger:{
                    global:"phaseAfter",
                },
                priority:-1,
                forced:true,
                junSkill:true,
                zhuSkill:true,
                direct:true,
                filter:function (event, player) {
                    var target = _status.currentPhase
                    if (!player.hasZhuSkill('xin_baisu') && get.mode() == 'identity') return false;
                    return target != undefined && target.group == 'shu'
                },
                content:function () {
                    if (trigger.player.getHistory('skipped').length > 0) {
                        game.asyncDraw([trigger.player, player])
                        player.logSkill('xin_baisu')
                        trigger.player.usechenSkill()
                    }
                },
            },
            "xin_xiangle":{
                audio:"ext:新将包:false",
                trigger:{
                    player:"damageEnd",
                },
                direct:true,
                priority:1,
                content:function () {
                    "step 0"
                    var list = []
                    list.push('xin_fq1')
                    list.push('xin_fq2')
                    event.list = list
                    "step 1"
                    if (event.list && event.list.length) {
                        player.chooseControl(event.list).set('prompt', '选择一项将要获得标记').set('ai', function () {
                            return event.list.randomGet()
                        })
                    }
                    "step 2"
                    if (result.control) {
                        event.control = result.control
                        player.chooseTarget(get.prompt('xin_xiangle'), '令一名角色获得' + get.translation(event.control) + '标记', function (card, player, target) {
                            return target != _status.currentPhase && !target.hasSkill('xin_fq2') && !target.hasSkill('xin_fq3') && !target.hasSkill('xin_fq1');
                        }).set('ai', function (target) {
                            return get.attitude(player, target);
                        });
                    }
                    "step 3"
                    if (result.bool) {
                        var target = result.targets[0]
                        if (event.control == 'xin_fq2') {
                            target.addSkill(event.control)
                            target.storage.xin_fq2++;
                        }
                        if (event.control == 'xin_fq1') {
                            target.addSkill(event.control)
                            target.storage.xin_fq1++;
                        }
                        target.update();
                        player.logSkill('xin_xiangle', target)
                        target.insertPhase();
                    }
                },
            },
            "xin_zhibang":{
                init:function (player, skill) {
        if (!player.storage[skill]) player.storage.xin_zhibang = [];
    },
                marktext:"棒",
                intro:{
                    content:"cards",
                    onunmark:function (storage, player) {
            if (storage && storage.length) {
                player.$throw(storage, 1000);
                game.cardsDiscard(storage);
                game.log(storage, '被置入了弃牌堆');
                storage.length = 0;
            }
        },
                },
                mark:true,
                trigger:{
                    source:["damageEnd"],
                    player:["phaseZhunbeiBegin"],
                },
                content:function () {
        'step 0'
        event.target = trigger.player
        'step 1'
        var num = 1
        player.choosePlayerCard(event.target, [1, num], 'hej', true).set('prompt', '选择作为"棒"的牌');
        'step 2'
        if (result && result.links && result.links.length) {
            event.target.lose(result.links, ui.special, 'toStorage');
            player.markAuto('xin_zhibang', result.links);
            game.log(player, '将', result.links, '置于其武将牌上');
            player.draw()
        }
    },
                ai:{
                    damage:true,
                    effect:{
                        target:function (card, player, target, current) {
                if (get.type(card) == 'delay') {
                    return 'zeroplayertarget';
                }
            },
                    },
                    expose:0.3,
                },
            },
            "xin_chuhui":{
                audio:"ext:新将包:false",
                enable:"phaseUse",
                filter:function (event, player) {
        return player.getStorage('xin_zhibang').length >= 5;
    },
                filterTarget:function (card, player, target) {
        if (!player.storage.xin_chuhui) return true
        if (!player.storage.xin_chuhui.contains(target)) return true
        return false
    },
                content:function () {
        if (!player.storage.xin_chuhui) player.storage.xin_chuhui = [];
        player.storage.xin_chuhui.add(target);
        player.storage.xin_chuhui.sortBySeat();
        player.markSkill('xin_chuhui');
        target.gain(player.storage.xin_zhibang, 'gain2', 'fromStorage');
        player.storage.xin_zhibang.length = 0;
        target.damage(2, player)
    },
                ai:{
                    damage:true,
                    order:2,
                    result:{
                        target:function (player, target) {
                return get.damageEffect(target, player);
            },
                    },
                    threaten:1.5,
                    expose:0.3,
                },
            },
            "xin_bingjie":{
                trigger:{
                    global:["phaseZhunbeiBegin"],
                    player:"damageEnd",
                },
                filter:function (event, player) {
                    if (event.name == 'phaseZhunbei') {
                        return event.player.countCards("h") !== event.player.maxHp && player.countCards("h") > 0
                    }
                    return true;
                },
                direct:true,
                content:function () {
                    'step 0'
                    if (event.triggername == 'damageEnd') event.count = trigger.num
                    'step 1'
                    if (event.triggername == 'damageEnd') {
                        event.count--
                        player.chooseTarget('令一名角色将手牌数调至体力上限', true, function (card, player, target) {
                            return true
                        }).set('ai', function (target) {
                            var att = get.attitude(_status.event.player, target);
                            var draw = Math.min(5, target.maxHp) - target.countCards('h');
                            if (draw >= 0) {
                                if (target.hasSkillTag('nogain')) att /= 6;
                                if (att > 2) {
                                    return Math.sqrt(draw + 1) * att;
                                }
                                return att / 3;
                            }
                            if (draw < -1) {
                                if (target.hasSkillTag('nogain')) att *= 6;
                                if (att < -2) {
                                    return -Math.sqrt(1 - draw) * att;
                                }
                            }
                            return 0;
                        });
                    }
                    else {
                        event.target = trigger.player
                        var a = event.target.maxHp
                        var n = a > 5 ? 5 : a
                        var next = player.chooseBool('是否令' + get.translation(event.target) + '将手牌调至' + n + '张牌，你弃置所有手牌？')
                        next.set('ai', function () {
                            var event = _status.event;
                            if (event.player.hp > 1) {
                                if (event.source.countCards("h") < event.source.maxHp) return (get.attitude(event.player, event.source) > 0)
                            }
                            return false
                        });
                        next.set('source', event.target);
                    }
                    'step 2'
                    if (result.bool) {
                        if (event.triggername != 'damageEnd') player.discard(player.getCards("h"))
                        event.target = event.triggername == 'damageEnd' ? result.targets[0] : trigger.player
                        var num = event.target.maxHp > 20 ? 20 : event.target.maxHp
                        event.target.fc_X(true, 46, [num], { toTagCard: 'xin_liuxiang' })
                    }
                    else if (event.count > 0) event.goto(1)
                    else event.finish()
                    'step 3'
                    if (event.triggername != 'damageEnd') { }
                    else if (event.count > 0) event.goto(1)
                    else event.finish()
                },
            },
            "xin_shiyin":{
                trigger:{
                    player:"phaseDiscardEnd",
                },
                direct:true,
                filter:function (event, player) {
                    var cards = [];
                    player.getHistory('lose', function (evt) {
                        if (evt.type == 'discard' && evt.getParent('phaseDiscard') == event) cards.addArray(evt.cards2);
                    });
                    return cards.length > 0;
                },
                chenSkill:true,
                content:function () {
                    'step 0'
                    event.cards = [];
                    player.getHistory('lose', function (evt) {
                        if (evt.type == 'discard' && evt.getParent('phaseDiscard') == trigger) event.cards.addArray(evt.cards2);
                    });
                    'step 1'
                    var colors = [], type = [], num1 = 0, num2 = 0;
                    for (var i = 0; i < event.cards.length; i++) {
                        colors.add(get.color(event.cards[i]));
                        type.add(get.type(event.cards[i]));
                    }
                    event.colors = colors;
                    event.type = type
                    'step 2'
                    var num2 = 0
                    if (event.type.length == 1) {
                        switch (get.type(event.cards[0], "trick")) {
                            case 'basic': num2 = 11; break;
                            case 'trick': num2 = 12; break;
                            case 'equip': num2 = 4; break;
                        }
                    }
                    if (num2) player.chooseBool(get.xjb_number(num2, -1))
                    else event.finish()
                    if (num2) event.num2 = num2
                    'step 3'
                    if (result.bool) {
                        player.fc_X(true, event.num2, { onlyme: game.players.slice(0) })
                    }
                    if (player.countMark('_xin_junzhu') > 0) player.removeMark('_xin_junzhu', 1)
                },
            },
            "xin_liuxiang":{
                group:["xin_liuxiang_xiang","xin_liuxiang_aid"],
                subSkill:{
                    xiang:{
                        marktext:"香",
                        intro:{
                            name:"香",
                            content:"mark",
                        },
                        sub:true,
                    },
                    aid:{
                        trigger:{
                            global:["respondEnd","useCardEnd","discardEnd"],
                        },
                        forced:true,
                        priority:-1,
                        filter:function (event, player) {
                            return event.player.hasHistory('lose', function (evt) {
                                if (evt.getParent() != event) return false;
                                for (var i in evt.gaintag_map) {
                                    if (evt.gaintag_map[i].contains('xin_liuxiang')) {
                                        event.player.addMark('xin_liuxiang_xiang', 1)
                                        event.player.update()
                                        return event.player.countMark('xin_liuxiang_xiang') >= player.hp && !player.isHealthy();
                                    }
                                }
                                return false;
                            });
                        },
                        content:function () {
                            'step 0'
                            event.target = trigger.player
                            var num = event.target.hp
                            player.chooseBool('对' + get.translation(event.target) + '是否令其恢复一点体力')
                            'step 1'
                            if (result.bool) {
                                event.target.removeMark('xin_liuxiang_xiang', event.target.countMark('xin_liuxiang_xiang'));
                                event.target.fc_X(true, "回血")
                            }
                        },
                        sub:true,
                    },
                },
            },
            "xin_yexi":{
                enable:"phaseUse",
                filter:function (event, player) {
                    return player.countCards('h') > 0
                },
                filterTarget:true,
                filterCard:function (card) {
                    if (ui.selected.cards.length) {
                        return get.suit(card) == get.suit(ui.selected.cards[0])
                    }
                    return true
                },
                complexCard:true,
                selectCard:function (card) {
                    if (ui.selected.cards.length) return -1
                    return 1
                },
                check:function (card) {
                    return 6 - get.value(card)
                },
                changeS:true,
                content:function () {
                    player.fc_X(true, 2, [cards.length], 'num_2', { onlyme: [target] })
                    player.link()
                },
                ai:{
                    order:5,
                    result:{
                        player:function (player) {
                            var num1 = player.countCards('h', { color: "black" }), num2 = player.countCards('h', { color: "red" })
                            if (Math.abs(num1 - num2) < 3) return 2
                            return 0
                        },
                    },
                    threaten:1.5,
                },
            },
            "xin_ziruo":{
                trigger:{
                    target:"useCardToTarget",
                },
                filter:function (event, player) {
                    if (event.player == player) return false
                    if (!event.targets || !event.targets.contains(player)) return false;
                    return game.hasPlayer(function (current) {
                        return event.targets.contains(current) && !current.isLinked();
                    });
                },
                content:function () {
                    "step 0"
                    player.chooseTarget('为此牌减少任意个目标',
                        [1, Infinity], function (card, player, target) {
                            return _status.event.targets.contains(target) && !target.isLinked();
                        }).set('ai', function (target) {
                            var trigger = _status.event.getTrigger();
                            if (!trigger.excluded.contains(target)) {
                                return -get.effect(target, trigger.card, trigger.player, _status.event.player);
                            }
                            return -1;
                        }).set('targets', trigger.targets);
                    "step 1"
                    if (result.bool) {
                        trigger.getParent().excluded.addArray(result.targets);
                        game.delay();
                        for (var i = 0; i < result.targets.length; i++) {
                            result.targets[i].link()
                        }
                    }
                },
            },
            "xin_guixin":{
                audio:"ext:新将包:false",
                trigger:{
                    player:"damageEnd",
                },
                frequent:true,
                content:function () {
                    "step 0"
                    event.num = trigger.num;
                    "step 1"
                    if (trigger.cards) {
                        let cards = []
                        trigger.cards.forEach(i => {
                            cards.push(game.createCard(i.name, undefined, undefined, i.nature))
                        })
                        player.gain(cards, 'gain2')
                    }
                    player.draw()
                    event.num--
                    "step 2"
                    if (event.num > 0) {
                        event.num--;
                        event.goto(1)
                    }
                },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    effect:{
                        target:function (card, player, target) {
                            if (card.name == 'guiyoujie') return [0, 0.5];
                            if (target.isTurnedOver()) {
                                if (get.tag(card, 'damage')) {
                                    if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                    if (target.hp == 1) return;
                                    return [1, 2];
                                }
                            }
                        },
                    },
                },
            },
            "xin_tanyan":{
                global:"xin_tanyan_1",
                zhuSkill:true,
                junSkill:true,
                subSkill:{
                    "1":{
                        enable:"phaseUse",
                        usable:1,
                        filter:function (event, player) {
                            if (get.mode() === "identity" && !game.players.filter(function (i) { return i.hasZhuSkill("xin_tanyan") }).length > 0) return false
                            if (player.hasSkill("xin_tanyan")) return false
                            return true
                        },
                        filterTarget:function (card, player, target) {
                            return target.hasSkill('xin_tanyan')
                        },
                        prompt:"令曹操恢复一点体力",
                        content:function () {
                            'step 0'
                            target.viewHandcards(player)
                            player.awakenSkill(event.name)
                            'step 1'
                            let bool = target.isDamaged()
                            target.fc_X(true, bool ? 'recover' : 'draw', [bool ? 1 : 2])
                        },
                        ai:{
                            order:10,
                            result:{
                                player:-1,
                                target:2,
                            },
                        },
                        sub:true,
                    },
                },
            },
            "xin_fengtian":{
                trigger:{
                    player:"phaseJieshuBegin",
                },
                filter:function (event, player) {
                    return player.getCards("h").filter(function (i) { return get.tag(i, "damage") }).length > 0
                },
                content:function () {
                    player.draw(2);
                    var next = player.phaseUse();
                    event.next.remove(next);
                    trigger.getParent().next.push(next);
                },
                ai:{
                    order:8,
                    result:{
                        player:1,
                    },
                },
            },
            "xin_niepan":{
                audio:"ext:新将包:false",
                enable:"chooseToUse",
                filter:function (event, player) {
                    if (event.type == 'dying') {
                        if (player != event.dying) return false;
                        return true;
                    }
                    else if (event.parent.name == 'phaseUse') {
                        return true;
                    }
                    return false;
                },
                usable:1,
                "translate1":"每回合限一次，你濒死时/出牌阶段时，你可以摸一张牌。",
                "translate2":"每回合限一次，你濒死时/出牌阶段时，你可以恢复一点体力。",
                content:function () {
                    var num = player.countCards('h') % 2 === 1 ? 1 : 11
                    player.fc_X(true, num)
                },
                ai:{
                    save:true,
                    order:9,
                    result:{
                        player:function (player) {
                            if (player.hp <= 0) return 10;
                            if (player.hp <= 2 && player.countCards('he') <= 1) return 10;
                            return 0;
                        },
                    },
                },
            },
            "xin_tianming":{
                audio:"ext:新将包:false",
                trigger:{
                    player:["loseAfter"],
                },
                marktext:"命",
                init:function (player) {
                    if (!player.storage.xin_tianming) player.storage.xin_tianming = [];
                },
                intro:{
                    content:"你已有花色$",
                },
                charlotte:true,
                forced:true,
                content:function () {
                    player.storage._skill_xin_X[0] = 13
                    for (var i = 0; i < trigger.cards.length; i++) {
                        var suit = get.suit(trigger.cards[i])
                        if (!player.storage.xin_tianming.contains(suit)) {
                            player.storage.xin_tianming.add(suit);
                            player.draw()
                        }
                    }
                    player.markSkill('xin_tianming');

                },
                ai:{
                    threaten:0.7,
                },
            },
            "xin_zulong":{
                audio:"ext:新将包:false",
                trigger:{
                    player:["damageEnd","loseHpEnd"],
                    global:"xjb_bianshenEnd",
                },
                frequent:true,
                content:function () {
                    'step 0'
                    var objects = {
                        choice: ['转换技', '觉醒技', '主公技', '锁定技', '视为技'],
                        storage: "xin_zulong",
                    }
                    player.fc_X(true, 'choose', 'needResult', objects)
                    'step 1'
                    var string = get.xjb_translation(player.storage["xin_zulong"])
                    trigger.player.addSkillrandom(string, 1)
                },
            },
            "xin_duice":{
                enable:"phaseUse",
                filter:function (event, player) {
                    return player.countCards("h") > 0
                },
                filterTarget:function (card, player, target) {
                    return player != target && target.countCards('h') > 0;
                },
                usable:3,
                content:function () {
                    "step 0"
                    player.chooseToCompare(target);
                    "step 1"
                    if (result.bool) {
                        let card = get.typeCard("trick").filter(i => {
                            if (!lib.card[i].ai) return false
                            let get = lib.card[i].ai.tag
                            return (get && (get.damage || get.recover || get.draw))
                        }).randomGet()
                        player.chooseUseTarget({ name: card }, [result.player, result.target])
                    }
                    "step 2"
                    player.gain(player.getCards('hej'), 'gain2')
                    target.gain(target.getCards('hej'), 'gain2')
                },
                ai:{
                    order:9,
                    result:{
                        player:1,
                        target:function (player, target) {
                            return -2;
                        },
                    },
                },
            },
            "xin_qizuo":{
                trigger:{
                    global:"useCard",
                },
                filter:function (event, player) {
                    if (!event.targets || !event.card) return false;
                    var type = get.tag(event.card, "damage"), num = player.countCards("h") > 0
                    return type && num
                },
                frequent:true,
                content:function () {
                    "step 0"
                    player.chooseToDiscard('h', [1, Infinity], function (card) {
                        return true;
                    }).set("prompt", "是否弃置至少一张牌(此牌加入对应的实体牌中)，然后选择一项:1.此牌伤害+1;2.令此牌伤害为1")
                    "step 1"
                    if (result.bool) {
                        trigger.cards = trigger.cards.concat(result.cards);
                        trigger.player.xin_qizuo_card = trigger.card
                        trigger.card.color = get.color(trigger.cards)
                        trigger.card.suit = get.suit(trigger.cards)
                        trigger.card.number = get.number(trigger.cards)
                        trigger.player.$throw(trigger.cards)
                        player.chooseControl("1.令此牌伤害+1", "2.令此牌伤害为1")
                    }
                    else event.finish()
                    "step 2"
                    if (result.control === "1.令此牌伤害+1") {
                        trigger.player.xjb_addSkill("xin_qizuo_1", { source: "damageBegin4" },
                            function (event, player) {
                                return event.card === player.xin_qizuo_card
                            }, function () {
                                trigger.num++
                                if (trigger.player.isLinked() && trigger.nature != undefined) player.removeSkill(event.name)
                            }, [true])
                    }
                    else {
                        trigger.player.xjb_addSkill("xin_qizuo_2", { source: "damageBegin4" },
                            function (event, player) {
                                return event.card === player.xin_qizuo_card
                            }, function () {
                                trigger.num = 1
                            }, [true])
                    }

                },
                ai:{
                    threaten:1.3,
                },
                fuSkill:true,
                suidongSkill:true,
            },
            "xin_zaozhong":{
                audio:"ext:新将包:false",
                frequent:true,
                chenSkill:true,
                trigger:{
                    player:["damageAfter"],
                },
                content:function () {
                    "step 0"
                    event.count = trigger.num;
                    "step 1"
                    player.fc_X(16, 1, "num_2", [3, 5], {
                        promptAdd: "令一名角色使用三张残【兵粮寸断】然后摸五张牌",
                        remnant: "bingliang"
                    });
                    event.count--
                    "step 2"
                    if (event.count > 0) event.goto(1)
                },
                ai:{
                    maixie:true,
                    "maixie_hp":true,
                    result:{
                        effect:function (card, player, target) {
                            if (get.tag(card, 'damage')) {
                                if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                if (!target.hasFriend()) return;
                                if (get.tag(card, 'damage')) {
                                    if (player.hasSkillTag('jueqing', false, target)) return [1, -2];
                                    if (target.hp == 1) return;
                                    if (target.hp > 2) return [1, 2]
                                    return [1, 1];
                                }
                            }
                        },
                    },
                    threaten:0.6,
                },
            },
            "xin_taoni":{
                enable:"phaseUse",
                filterCard:{
                    suit:"diamond",
                },
                filterTarget:function (card, player, target) {
                    return !target.isLinked()
                },
                position:"he",
                qzj:true,
                filter:function (event, player) {
                    return player.countCards('hes', { suit: 'diamond' }) > 0
                },
                prepare:function (cards, player) {
                    player.$throw(cards, 1000);
                    game.log(player, '将', cards, '置入了弃牌堆');
                },
                discard:false,
                loseTo:"discardPile",
                visible:true,
                delay:0.5,
                content:function () {
                    target.fc_X(true, 13)
                    player.fc_X(true, 1)
                },
                mod:{
                    cardUsableTarget:function (card, player, target) {
                        if (target.isLinked()) return true;
                    },
                },
                ai:{
                    order:9,
                    result:{
                        player:1,
                        target:-1,
                    },
                    threaten:1.5,
                },
                xjb:true,
            },
            "xin_jiang":{
                audio:"ext:新将包:false",
                trigger:{
                    source:"damageEnd",
                    player:"damageEnd",
                },
                filter:function (event, player) {
                    return event.source.isAlive()
                },
                content:function () {
                    var num = 0
                    for (var i = 0; i < game.players.length; i++) {
                        if (game.players[i].isLinked()) num++
                    }
                    if ((player.hasZhuSkill('xin_yingyi') && get.mode() == 'identity') || get.mode() != 'identity') {
                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i].group === 'wu') num++
                        }
                    }
                    if (num > 3) num = 3
                    game.asyncDraw([trigger.player, trigger.source], num)
                },
            },
            "xin_yingyi":{
                zhuSkill:true,
                junSkill:true,
            },
            "xin_whlw":{
                trigger:{
                    global:["dying","dieAfter"],
                },
                filter:function (event, player) {
                    if (_status.currentPhase == player) return true;
                    return false
                },
                frequent:true,
                content:function () {
                    player.draw()
                },
                ai:{
                    expose:0.2,
                    threaten:1.5,
                },
            },
            "xin_qns":{
                mod:{
                    aiValue:function (player, card, num) {
                        if (get.name(card) != 'tao' && get.color(card) != 'red') return;
                        var cards = player.getCards('hs', function (card) {
                            return get.name(card) == 'tao' || get.color(card) == 'red';
                        });
                        cards.sort(function (a, b) {
                            return (get.name(a) == 'tao' ? 1 : 2) - (get.name(b) == 'tao' ? 1 : 2);
                        });
                        var geti = function () {
                            if (cards.contains(card)) {
                                return cards.indexOf(card);
                            }
                            return cards.length;
                        };
                        return Math.max(num, [6.5, 4, 3, 2][Math.min(geti(), 2)]);
                    },
                    aiUseful:function () {
                        return lib.skill.kanpo.mod.aiValue.apply(this, arguments);
                    },
                },
                locked:false,
                audio:"ext:新将包:false",
                enable:"chooseToUse",
                viewAsFilter:function (player) {
                    return player.countCards('hes', { color: 'red' }) > 0;
                },
                filterCard:function (card) {
                    return get.color(card) == 'red';
                },
                position:"hes",
                viewAs:{
                    name:"tao",
                },
                prompt:"将一张红色牌当桃使用",
                check:function (card) { return 15 - get.value(card) },
                onuse:function (event, player) {
                    if (player.countCards('h') < 3) player.draw()
                },
                ai:{
                    threaten:1.5,
                    basic:{
                        order:function (card, player) {
                            if (player.hasSkillTag('pretao')) return 5;
                            return 2;
                        },
                        useful:[6.5,4,3,2],
                        value:[6.5,4,3,2],
                    },
                    result:{
                        target:2,
                        "target_use":function (player, target) {
                            if (player.hasSkillTag('nokeep', true, null, true)) return 2;
                            var nd = player.needsToDiscard();
                            var keep = false;
                            if (nd <= 0) {
                                keep = true;
                            }
                            else if (nd == 1 && target.hp >= 2 && target.countCards('h', 'tao') <= 1) {
                                keep = true;
                            }
                            var mode = get.mode();
                            if (target.hp >= 2 && keep && target.hasFriend()) {
                                if (target.hp > 2 || nd == 0) return 0;
                                if (target.hp == 2) {
                                    if (game.hasPlayer(function (current) {
                                        if (target != current && get.attitude(target, current) >= 3) {
                                            if (current.hp <= 1) return true;
                                            if ((mode == 'identity' || mode == 'versus' || mode == 'chess') && current.identity == 'zhu' && current.hp <= 2) return true;
                                        }
                                    })) {
                                        return 0;
                                    }
                                }
                            }
                            if (target.hp < 0 && target != player && target.identity != 'zhu') return 0;
                            var att = get.attitude(player, target);
                            if (att < 3 && att >= 0 && player != target) return 0;
                            var tri = _status.event.getTrigger();
                            if (mode == 'identity' && player.identity == 'fan' && target.identity == 'fan') {
                                if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'fan' && tri.source != target) {
                                    var num = game.countPlayer(function (current) {
                                        if (current.identity == 'fan') {
                                            return current.countCards('h', 'tao');
                                        }
                                    });
                                    if (num > 1 && player == target) return 2;
                                    return 0;
                                }
                            }
                            if (mode == 'identity' && player.identity == 'zhu' && target.identity == 'nei') {
                                if (tri && tri.name == 'dying' && tri.source && tri.source.identity == 'zhong') {
                                    return 0;
                                }
                            }
                            if (mode == 'stone' && target.isMin() &&
                                player != target && tri && tri.name == 'dying' && player.side == target.side &&
                                tri.source != target.getEnemy()) {
                                return 0;
                            }
                            return 2;
                        },
                    },
                    tag:{
                        recover:1,
                        save:1,
                    },
                },
            },
            "xin_whlw1":{
                trigger:{
                    player:"damageBegin2",
                },
                forced:true,
                filter:function (event, player) {
                    if (event.card) return true
                },
                content:function () {
                    if (get.type(trigger.card) !== 'trick') trigger.num--;
                    else player.draw(2)
                },
                ai:{
                    effect:{
                        target:function (card, player, target) {
                            if (get.type(card) !== 'trick' && get.tag(card, 'damage')) return 'zerotarget';
                        },
                    },
                },
            },
            "xin_whlw2":{
                audio:"ext:新将包:false",
                global:"rewansha_global",
                trigger:{
                    global:"dyingBegin",
                },
                forced:true,
                logTarget:"player",
                filter:function (event, player) {
                    return player == _status.currentPhase;
                },
                content:function () {
                    game.countPlayer(function (current) {
                        if (current != player && current != trigger.player) current.addSkillBlocker('rewansha_fengyin');
                    });
                    player == _status.currentPhase && player.draw()
                },
            },
            "xin_htzjq2":{
                shaRelated:true,
                trigger:{
                    player:"useCardToPlayered",
                },
                check:function (event, player) {
                    return get.attitude(player, event.target) <= 0;
                },
                filter:function (event, player) {
                    return event.card.name == 'sha';
                },
                logTarget:"target",
                content:function () {
                    var target = trigger.target;
                    target.chooseLoseHpMaxHp(true)
                },
                ai:{
                    ignoreSkill:true,
                },
            },
            "xjb_leijue":{
                enable:"phaseUse",
                filterCard:{
                    suit:"spade",
                },
                filter:function (event, player) {
                    if (lib.config.xjb_systemEnergy < 1) return false
                    return true
                },
                filterTarget:true,
                content:function () {
                    target.damage('thunder');
                },
            },
            "xjb_xinsheng":{
                enable:"phaseUse",
                filter:function (event, player) {
                    return game.dead.length > 0
                },
                filterCard:true,
                selectCard:3,
                content:function () {
                    "step 0"
                    player.chooseControl(game.dead.slice(0))
                    "step 1"
                    if (result.control) {
                        result.control.revive(player.maxHp)
                    }
                },
            },
            "xjb_lunhui":{
                trigger:{
                    player:["dying"],
                },
                content:function () {
                    "step 0"
                    player.fc_X(11, 62, [3, 2], "num_2", true)
                },
            },
            "xin_lianhuan":{
                enable:"phaseUse",
                selectTarget:[1,Infinity],
                filterTarget:function (card, player, target) {
                    if (ui.selected.targets.length < player.hp) return true
                    return false
                },
                usable:1,
                content:function () {
                    target.link()
                },
            },
            "xjb_liuli":{
                trigger:{
                    player:"damageBegin",
                },
                filter:function (event, player) {
                    return player.countCards('hes', { suit: 'diamond' }) > 0
                },
                direct:true,
                content:function () {
                    "step 0"
                    player.chooseCardTarget({
                        filterCard: {
                            suit: "diamond",
                        },
                        position: "hes",
                        selectCard: 1,
                        filterTarget: function (event, player, target) {
                            if (target == player) return false
                            return true
                        },
                        ai1: function (card) {
                            var player = _status.event.player;
                            return 15 - get.value(card);
                        },
                        ai2: function (target) {
                            var player = _status.event.player, card = ui.selected.cards[0];
                            if (get.value(card, target) < 0) return -get.attitude(player, target);
                            if (get.value(card, target) < 1) return 0.01 * -get.attitude(player, target);
                            return Math.max(1, get.value(card, target) - get.value(card, player)) * get.attitude(player, target);
                        },
                        prompt: '交给另一名其他角色一张♦️牌，你令伤害来源改为这名角色并令其重新分配伤害'
                    });
                    "step 1"
                    if (result.bool) {
                        var num = trigger.num
                        result.targets[0].gain(result.cards, player, 'giveAuto');
                        var daqiao = {}
                        if (trigger.nature) {
                            daqiao.nature = [trigger.nature]
                            daqiao.wordsAdd = get.translation(trigger.nature) + '属性'
                        }
                        result.targets[0].fc_X(44, [num], daqiao)
                        trigger.cancel()
                    }
                },
                ai:{
                    "maixie_defend":true,
                    effect:{
                        target:function (card, player, target) {
                            if (player.hasSkillTag('jueqing', false, target)) return;
                            if (get.tag(card, 'damage') && target.countCards('he') > 1) return 0.7;
                        },
                    },
                },
            },
            "xjb_guose":{
                enable:"phaseUse",
                usable:1,
                filter:function (event, player) {
                    return game.countPlayer(function (current) {
                        return current.countCards('ej');
                    }) > 0
                },
                filterTarget:function (event, player, target) {
                    return target.countCards('j') == 0
                },
                content:function () {
                    "step 0"
                    var num = game.countPlayer(function (current) {
                        return current.countCards('ej');
                    });
                    if (num < 1) num = 1
                    player.draw(num)
                    "step 1"
                    var list1 = [], list2 = []
                    for (var i = 0; i < result.length; i++) {
                        if (get.suit(result[i]) != 'diamond') list1.push(result[i])
                    }
                    if (list1.length > 0) {
                        for (var i = 0; i < lib.inpile.length; i++) {
                            if (get.type(lib.inpile[i]) == 'delay') list2.push(game.createCard(lib.inpile[i], '', '', ''));
                        }
                        event.list1 = list1
                        player.chooseButton(['视为使用一张延时锦囊牌', list2], 1)
                    }
                    "step 2"
                    if (result.bool) {
                        target.addJudge({ name: result.links[0].name }, event.list1);
                    }
                },
            },
            "xin_longpan":{
                trigger:{
                    player:"phaseAfter",
                },
                filter:function (event, player) {
                    return player.storage.xin_tianming.length >= 4
                },
                frequent:true,
                content:function () {
                    'step 0'
                    var list = []
                    var suit = player.storage.xin_tianming;
                    for (var i = 0; i < suit.length; i++) {
                        var cardname = 'xin_zhaoling_' + suit[i];
                        lib.card[cardname] = {
                            fullimage: true,
                            image: 'character:' + player.name1
                        }
                        lib.translate[cardname] = lib.translate[suit[i]];
                        list.push(game.createCard(cardname, suit[i], ''));
                    }
                    player.chooseButton(['龙蟠：选择移去的花色', list], suit.length)
                    'step 1'
                    if (result.bool) {
                        event.suit = []
                        for (var i = 0; i < result.links.length; i++) {
                            event.suit.push(get.suit(result.links[i]))
                            player.storage.xin_tianming.remove(get.suit(result.links[i]))
                            player.markSkill('xin_tianming');
                        }
                        var num = result.links.length
                        player.fc_X(12, 1, [1, 4], 'num_2', 'again', { promptAdd: "然后摸四张牌" })
                    }
                },
            },
            "xin_enyuan":{
                audio:"ext:新将包:false",
                trigger:{
                    player:["gainEnd","drawEnd","damageEnd"],
                },
                usable:3,
                filter:function (event, player) {
                    if (!event.source) return false
                    if (!event.source.isAlive()) return false
                    if (event.source == event.player) return false
                    if (event.name === "damage") return true
                    if (event.cards && event.cards.length >= 2) return true;
                    else if (event.num >= 2) return true
                },
                content:function () {
                    if (trigger.name != "damage") {
                        trigger.source.fc_X(true, 1)
                        trigger.source.storage.rerende = 0
                    }
                    else trigger.source.fc_X(true, 12, '获得其牌', [trigger.num, trigger.num])
                },
            },
            "xjb_fuyi":{
                global:"xjb_fuyi_global",
                trigger:{
                    global:["roundStart"],
                },
                frequent:true,
                content:function () {
                    "step 0"
                    player.chooseBool("是否使用逐鹿天下？")
                    "step 1"
                    if (result.bool) {
                        player.useCard({
                            name: "zhulu_card",
                            suit: "club",
                            number: 4
                        }, game.players)
                    }
                },
                subSkill:{
                    global:{
                        trigger:{
                            player:"useCardToTarget",
                        },
                        frequent:true,
                        filter:function (event, player) {
                            if (event.targets.length > 1) return false
                            var info = get.info(event.card);
                            if (info.selectTarget === -1) return false
                            if (info.multitarget) return false;
                            if (info.allowMultiple === false) return false;
                            if (info.type == 'equip') return false;
                            if (info.type == 'delay') return false;
                            return event.target.countCards('e') > 0 && game.players.filter(i => i.hasSkill("xjb_fuyi")).length
                        },
                        content:function () {
                            "step 0"
                            player.chooseCard([1, Infinity], "h").set('ai', function (card) {
                                let target = game.players.filter(i => i.hasSkill("xjb_fuyi"))[0]
                                if (get.attitude(_status.event.player, target) > 0) {
                                    return 5 - get.value(card);
                                }
                                return -get.value(card);
                            });
                            "step 1"
                            let target = game.players.filter(i => i.hasSkill("xjb_fuyi"))[0]
                            if (result.bool) {
                                target.gain(result.cards, player, "giveAuto")
                                if (target === player) target.discard(result.cards)
                                player.chooseTarget([1, result.cards.length], function (card, player, target) {
                                    var trigger = _status.event.getTrigger();
                                    return !trigger.targets.contains(target) && lib.filter.targetEnabled2(trigger.card, player, target);
                                }).set('ai', function (target) {
                                    var player = _status.event.player;
                                    return get.effect(target, _status.event.getTrigger().card, player, player);
                                });
                            }
                            "step 2"
                            if (result.bool) {
                                if (!event.isMine() && !event.isOnline()) game.delayx();
                                event.target = result.targets
                            }
                            "step 3"
                            if (event.target && event.target.length) trigger.targets.push(...event.target)
                        },
                        selectedChioce:"未受伤",
                        sub:true,
                    },
                },
                shouSkill:true,
            },
            "xjb_sicuan":{
                audio:"ext:新将包:false",
                enable:"phaseUse",
                usable:1,
                check:function (card) {
                    return 9 - get.value(card)
                },
                filterTarget:function (card, player, target) {
                    return true;
                },
                content:function () {
                    "step 0"
                    var list = ["恢复体力", "失去体力", "额外进行一个回合", "失去体力上限", "横置"]
                    player.chooseControl(list)
                    "step 1"
                    var list = ["恢复体力", "失去体力", "额外进行一个回合", "失去体力上限", "横置"].remove(result.control)
                    player.chooseControl(list)
                    event.xjb_a = get.xjb_translation(result.control)
                    "step 2"
                    event.xjb_b = get.xjb_translation(result.control)
                    var c = target[event.xjb_a], a = event.xjb_a, b = event.xjb_b
                    target[a] = target[b]
                    target[b] = c
                },
                ai:{
                    order:9,
                    threaten:2,
                },
            },
            "xin_yingfa":{
                enable:"phaseUse",
                filterTarget:true,
                usable:1,
                content:function () {
                    "step 0"
                    var list = []
                    player.loseHp()
                    if (target.countCards('h', { type: "basic" })) list.push("基本牌")
                    if (target.countCards('he', { type: "equip" })) list.push("装备牌")
                    if (target.countCards('h', { type: "trick" })) list.push("普通锦囊牌")
                    if (target.countCards('h', { type: "delay" })) list.push("延时锦囊牌")
                    player.chooseControl(list)
                    "step 1"
                    var list = {
                        "基本牌": "basic",
                        "装备牌": "equip",
                        "普通锦囊牌": "trick",
                        "延时锦囊牌": "delay"
                    }
                    var type = list[result.control]
                    var s = target.getCards("he", { type: type })
                    target.fc_X(true, '弃牌', '旋转', { toDiscard: s })
                    event.cards = s
                    "step 2"
                    var s = event.cards
                    if (s.length) player.gain(s.randomGet(), "gain2")
                },
                ai:{
                    order:9,
                    result:{
                        target:function (player, target) {
                            return -target.countCards('h');
                        },
                    },
                    threaten:2,
                },
                qzj:true,
            },
            "xjb_1":{
                player:{
                    "fc_X":function () {
                    //这是对fc_X2先做一遍预处理，将文字转化为数字
            let Arr = [], obj = {
                '摸牌': 1, 'draw': 1,
                '牌堆底摸牌': 51,
                '恢复体力': 11, '回复体力': 11, '回血': 11, 'recover': 11,
                '加体力上限': 21, 'gainMaxHp': 21,
                '获得Buff': 41,
                '获得其牌': 32,
                '再动': 31, "insertPhase": 31,
                '置于牌堆顶': 26,
                '获得技能': 5,
                '残区': 16,
                '弃牌': 36,
                '旋转': 7,
                '流失':52,
                '破甲':54,
                '火焰':4,
                '冰冻':24,
                '雷电':14,
                '神袛':34
            }
            Array.from(arguments).forEach(i => {
                if (typeof i === 'string') {
                    let a = obj[i] || i
                    Arr.push(a)
                }
                else Arr.push(i)
            })
            return this.fc_X2(...Arr)
        },
                    "xjb_zeroise":function(name){
           name = name || this.name;
           let player=this;
           player.additionalSkills.length = 0;
           player.skills.length = 0;
           player.hiddenSkills.length = 0;
           player.init(name);
           player.skills = lib.character[name][3] || [];
           player.sex = lib.character[name][0];
           player.group = lib.character[name][1];
           player.classList.remove('unseen');
        },
                    "xjb_addSkillCard":function (name) {
            lib.card.xjb_skillCard.cardConstructor(name);
            lib.card.xjb_skillCard.skillLeadIn(name);
            var card = game.createCard2(name + "_card");
            this.xjb_addZhenFa(card);
        },
                    "xjb_updateCoordinate":function () {
            let player = this
            player.coordinate = [0, 0]
            var list = [...player.coordinate]
            game.countPlayer(current => {
                if (!current.coordinate) {
                    let distance = get.distance(player, current) * 50
                    let num1 = Math.floor(Math.random() * distance);
                    let num2 = Math.floor(Math.sqrt(distance * distance - num1 * num1))
                    current.coordinate = [num1, num2]
                }
                current.coordinate[0] -= list[0]
                current.coordinate[1] -= list[1]
            })
        },
                    "xjb_recover":function (num = 1) {
            let player = this
            for (let i = 0; i < 2 * num; i++) {
                player.xjb_disableEquip()
            }
            player.recover(num)
        },
                    "xjb_disableEquip":function () {
            let player = this
            player.countDisabled() >= 5 && player.enableEquip([1, 2, 3, 4, 5].randomGet())
            player.chooseToDisable()
        },
                    "xjb_eventLine":function (num) {
            let eventLine = xjb_lingli.event.match(num)
            let CardOk=()=>{
              return this.countCards("h")>=18&&eventLine.contains("xjb_cardBirth")
            }
            let MaxHpOk=()=>{
              return this.maxHp>=30&&eventLine.contains("gainMaxHp")
            }
            game.print(CardOk(),MaxHpOk())
            while(CardOk()||MaxHpOk()){
                eventLine=xjb_lingli.event.match(num)
            }            
            eventLine.forEach(event => {
                this[event]()
            })
            return eventLine
        },
                    "xjb_fire":function (num) {
            this.damage(num, "fire")
        },
                    "xjb_flower":function (num) {
            this.damage(num, "flower")
        },
                    "xjb_thunder":function (num) {
            this.damage(num, "thunder")
        },
                    "xjb_ice":function (num) {
            this.damage(num, "ice")
        },
                    "xjb_addSkillInCC":function (str) {
            this.addSkill(str)
            lib.character[this.name1][3].add(str)
        },
                    "xjb_saveStorage":function (bool) {
            let player = this
            if (!lib.config.xjb_count[player.name1]) lib.config.xjb_count[player.name1]
            if (!lib.config.xjb_count[player.name1].xjb_storage) {
                lib.config.xjb_count[player.name1].xjb_storage = { total: 0 }
            }
            lib.config.xjb_myStorage = lib.config.xjb_count[player.name1].xjb_storage
            let i = game.xjb_storage_2(player, bool)
            if (player !== game.me || _status.auto) {
                let curtain = ui.create.xjb_curtain()
                if (player === game.me) curtain.remove()
                new Promise(res => {
                    if (i.storageArea.children.length === 0) i.li_1.click()
                    res(i.storageArea.children[0].update())
                }).then(data => {
                    return new Promise(res => {
                        setTimeout(k => {
                            res(i.li_2.onclick())
                        }, 1000)
                    })
                }).then(data => {
                    setTimeout(k => {
                        i.close.closeBack()
                        curtain.remove()
                        game.resume()
                    }, 100)
                })
            }
            return i
        },
                    "xjb_readStorage":function (bool) {
            let player = this
            if (!lib.config.xjb_count[player.name1]) lib.config.xjb_count[player.name1]
            if (!lib.config.xjb_count[player.name1].xjb_storage) {
                lib.config.xjb_count[player.name1].xjb_storage = { total: 0 }
            }
            lib.config.xjb_myStorage = lib.config.xjb_count[player.name1].xjb_storage
            let i = game.xjb_storage_1(player, bool)
            game.pause()
            if (player !== game.me || _status.auto) {
                let curtain = ui.create.xjb_curtain()
                if (player === game.me) curtain.remove()
                new Promise(res => {
                    if (i.storageArea.children.length === 0) i.li_1.click()
                    res(i.storageArea.children[0].update())
                }).then(data => {
                    return new Promise(res => {
                        setTimeout(k => {
                            i.li_2.read()
                            i.close.click()
                            curtain.remove()
                        }, 1000)
                    })
                })
            }
            return i
        },
                    "xjb_updateStorage":function () {
            let player = this
            lib.config.xjb_count[player.name1].xjb_storage = lib.config.xjb_myStorage
            game.saveConfig("xjb_count", lib.config.xjb_count)
        },
                    isUniqueCharacter:function (str) {
            let player = this
            if (!player.name1) return false
            if (!lib.character[player.name1]) return false
            if (!lib.character[player.name1][4]) return false
            return lib.character[player.name1][4].includes(str)
        },
                    "xjb_noskill":function (skillname) {
            var player = this
            if (Array.isArray(skillname)) {
                for (var i = 0; i < skillname.length; i++) {
                    player.xjb_noskill(skillname[i])
                }
                return
            }
            if (lib.skill[skillname] === undefined) return
            if (lib.skill[skillname].noskill != undefined) return
            if (!player.noskill) player.noskill = {}
            player.noskill[skillname] = lib.skill[skillname]
            player.noskill_translate[skillname + '_info'] = lib.translate[skillname + '_info']
            lib.skill[skillname] = {
                noskill: true
            }
            lib.translate[skillname + '_info'] = '已被强制技封印'
        },
                    "gain_noskill":function () {
            var player = this
            var list1 = Object.keys(player.noskill)
            var list2 = Object.keys(player.noskill_translate)
            var list3 = Object.values(player.noskill_translate)
            for (var i = 0; i < list1.length; i++) {
                game.xjb_EqualizeSkillObject(list1[i], player.noskill[list1[i]])
            }
            for (var i = 0; i < list2.length; i++) {
                lib.translate[list2[i]] = list3[i]
            }
            player.noskill = {}
        },
                    changeS:function (num) {
            var player = this
            if (!player.hasSkill('skill_off')) {
                if (num && num == 1) player.addSkill('skill_off')
                else player.addTempSkill('skill_off')
                return
            }
            player.removeSkill('skill_off')
        },
                    "changeS2":function (boolean, num) {
            var player = this
            if (boolean && boolean == true) {
                if (num && num == 1) player.addSkill('skill_off')
                else player.addTempSkill('skill_off')
                return
            }
            player.removeSkill('skill_off')
        },
                    "xjb_addSkill":function (str, trigger, func1, func2, Array, Array1) {
            lib.skill[str] = {
                trigger: trigger,
                filter: func1,
                content: func2
            };
            var skill = lib.skill[str]
            if (Array) {
                if (Array[0]) skill.forced = true;
                if (Array[1]) skill.direct = true;
                if (Array[1]) skill.frequent = true;
            }
            this.addSkillLog(str)
            return skill
        },
                    addSkillrandom:function () {
            var player = this, temp = false, list = lib.skilllist, skills = []
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'boolean') {
                    temp = true
                }
                else if (typeof arguments[i] === 'object') var expire = arguments[i]
                else if (typeof arguments[i] == 'string') var need = arguments[i]
                else if (typeof arguments[i] == 'number') var num = arguments[i]
            }
            for (var a = 0; a < list.length; a++) {
                var info = lib.skill[list[a]]
                if (list[a].endsWith('_roundcount')) list.splice(a--, 1)
                else if (!info || info.sub || info.hiddenSkill) list.splice(a--, 1)
                else if (!lib.translate[list[a]]) list.splice(a--, 1)
                else if (!lib.translate[list[a] + '_info']) list.splice(a--, 1)
            }
            skills = skills.concat(list)
            for (var b = 0; b < skills.length; b++) {
                var info = lib.skill[skills[b]]
                if (need) {
                    if (!info[need]) skills.splice(b--, 1)
                    else if (player.hasSkill(skills[b])) skills.splice(b--, 1)
                }
            }
            var skill = skills.randomGet()
            if (lib.skill[skill].limited) player.restoreSkill(skill)
            if (num) {
                if (lib.skill[skill].juexingji) {
                    player.storage.addSkillrandom_filter = true
                    if (!lib.skill[skill].addSkillrandom_filter) lib.skill[skill].addSkillrandom_filter = lib.skill[skill].filter
                    lib.skill[skill].filter = function (event, player) {
                        if (player.storage.addSkillrandom_filter) return true
                        return this.addSkillrandom_filter.apply(this, arguments);
                    }
                }
            }
            if (temp == true) player.addTempSkill(skill, expire)
            else player.addSkill(skill)
            player.popup(skill)
            game.log(player, '获得了技能〖' + get.translation(skill) + '〗')
            return skill
        },
                    "xjb_getAllCards":function (str) {
            var cards = [], player = this
            var cards = player.getCards(str).map(card => {
                return [card.name,
                card.suit,
                card.number,
                card.nature,
                card.gaintag,
                card.storage]
            })
            return cards
        },
                    seekTag:function (String) {
            var player = this
            var gain = get.cardPile2(function (card) {
                return get.tag(card, String);
            });
            if (gain) {
                player.gain(gain, 'gain2');
            }
            game.updateRoundNumber();
            return gain
        },
                    "xjb_loseHpTo":function (num) {
            var player = this, number = player.hp - num || 1
            if (num < 0) number = 1
            player.loseHp(number)
        },
                    "xjb_adjustHandCardTo":function (num, str) {
            var player = this
            var hlen = player.countCards("h")
            if (hlen > num) {
                player.chooseToDiscard(hlen - num, true)
            }
            else if (hlen < num) {
                if (str) player.gain(get.cards(num - hlen), "draw").gaintag.add(str)
                else player.gain(get.cards(num - hlen), "draw")
            }
        },
                    "$giveHpCard":function (num, target) {
            var theCard = game.createHpCard(num, 150)
            var player = this
            ui.xjb_giveStyle(theCard, {
                position: "absolute",
                left: (player.offsetLeft + 23) + "px",
                top: (player.offsetTop + 23) + "px",
                "z-index": "5",
            })
            ui.arena.appendChild(theCard)
            setTimeout(function () {
                ui.xjb_giveStyle(theCard, {
                    left: (target.offsetLeft + 23) + "px",
                    top: (target.offsetTop + 23) + "px"
                })
                setTimeout(() => { theCard.remove() }, 500)

            }, 300)
        },
                    giveHpCard:function (target, num) {
            if (!target) target = _status.event.player
            if (!lib.config.xjb_count[target.name1].HpCard) lib.config.xjb_count[target.name1].HpCard = []
            var player = this
            if (!num) num = player.maxHp

            var count = player.maxHp
            var num1 = Math.min(num * 5, player.maxHp)
            player.loseMaxHp(num1)
            if (player.maxHp % 5 != 0) {
                var x = player.maxHp % 5
                lib.config.xjb_count[target.name1].HpCard.push(x)
                player.$giveHpCard(x, target)
                count -= player.maxHp % 5
            }
            var times = count / 5
            for (var i = 0; i < times; i++) {
                lib.config.xjb_count[target.name1].HpCard.push(5)
                player.$giveHpCard(5, target)
            }
            game.saveConfig('xjb_count', lib.config.xjb_count);
        },
                    "giveHpCard2":function (target) {
            if (!target) target = _status.event.player
            let num = 1
            if (!lib.config.xjb_count[target.name1].HpCard) lib.config.xjb_count[target.name1].HpCard = []
            var player = this
            player.xjb_cardDeath()
            player.loseMaxHp(num)
            lib.config.xjb_count[target.name1].HpCard.push(num)
            player.$giveHpCard(num, target)
            game.saveConfig('xjb_count', lib.config.xjb_count);
            return lib.config.xjb_count[target.name1].HpCard
        },
                },
            },
            "xjb_2":{
                "fc_X2":{
                    player:function () {
            let next = game.createEvent('fc_X2')
            var player = this
            if (!player.storage._skill_xin_X) player.storage._skill_xin_X = [1, 1, 1, [], [], [], []]
            var boolean, Array1 = [], object = {}, Array2 = [1], Array3 = []
            for (var i = 0; i < arguments.length; i++) {
                if (Array.isArray(arguments[i])) Array2 = arguments[i]
                else if (typeof arguments[i] == 'number') {
                    if (arguments[i] === 0) { }
                    else Array1.push(arguments[i])
                }
                else if (typeof arguments[i] === 'string') Array3.push(arguments[i])
                else if (typeof arguments[i] === 'boolean') boolean = arguments[i]
                else if (typeof arguments[i] === 'object') object = arguments[i]
            }
            next.boolean = boolean
            next.Array1 = Array1
            next.Array2 = Array2
            next.Array3 = Array3
            next.object = object
            next.setContent('fc_X2');
            next.player = this
            return next
        },
                    content:function () {
            'step 0'
            var boolean = event.boolean,
                Array1 = event.Array1,
                object = event.object,
                Array2 = event.Array2,
                Array3 = event.Array3
            //onlyme检测
            player.storage._skill_xin_X[4] = [...Array3, "again"]
            if (boolean == true) player.storage._skill_xin_X[4].push('onlyme', 'num_2')
            //1区设置(event.do)
            player.storage._skill_xin_X[0] = Array1.shift()
            //2区设置(event.num)
            player.storage._skill_xin_X[1] = Array2.shift()
            //7区设置(event.else)
            player.storage._skill_xin_X[7] = object
            player.storage._skill_xin_X[7].redo = [...Array1]
            player.storage._skill_xin_X[7].redo2 = Array2
            'step 1'
            player.update()
            //使用X技
            'step 2'
            player.useSkill('skill_X')
        },
                },
                "xjb_cardBirth":{
                    player:function (num = 1) {
            let next = game.createEvent('xjb_cardBirth')
            next.player = this
            next.num = num
            next.setContent('xjb_cardBirth');
            return next
        },
                    content:function () {
            for (var i = 0; i < event.num; i++) {
                let card = game.createCard2(["tao", "sha", "shan", "jiu"].randomGet())
                player.gain(card)
            }
        },
                },
                "xjb_cardDeath":{
                    player:function (num = 1) {
            let next = game.createEvent('xjb_cardDeath')
            next.player = this
            next.num = num
            next.setContent('xjb_cardDeath');
            return next
        },
                    content:function () {
            "step 0"
            if (event.player.countCards("hej") < 1) {
                event.player.xjb_eventLine(1)
                event.finish()
            }
            "step 1"
            for (var i = 0; i < event.num; i++) {
                let card = event.player.getCards("hej").randomGet()
                event.player.lose(card)
                card.fix()
                card.remove()
            }
        },
                },
                "xjb_addZhenFa":{
                    player:function (cards) {
            let next = game.createEvent('xjb_addZhenFa')
            next.player = this
            next.cards = cards
            if (!Array.isArray(cards)) next.cards = [cards]
            next.setContent('xjb_addZhenFa');
            return next
        },
                    content:function () {
            "step 0"
            event.player.addToExpansion(event.cards, 'gain2').gaintag.add("_xjb_zhenfa")
            let num = xjb_lingli.area["fanchan"](event.cards.length)
            event.player.xjb_addlingli(num)
            "step 1"
            var cards = event.player.getExpansions('_xjb_zhenfa')
        },
                },
                "xjb_molizeLingli":{
                    player:function (num = 1, target, card) {
            if (!this.countMark("_xjb_lingli")) return
            let next = game.createEvent('xjb_molizeLingli')
            next.player = this
            next.num = num
            next.target = target || this
            if (card) next.card = card
            next.setContent('xjb_molizeLingli');
            return next
        },
                    content:function () {
            "step 0"
            event.player.xjb_loselingli(event.num);
            "step 1"
            event.target.addMark("_xjb_moli", event.num);
            event.player.update();
            if (event.card) {
                lib.card.xjb_skillCard.cardConstructor(event.card);
                lib.card.xjb_skillCard.skillLeadIn(event.card);
                var card = game.createCard2(event.card + "_card");
                event.target.xjb_addZhenFa(card)
                event.goto(3)
            }
            "step 2"
            event.target.xjb_eventLine(-1*event.num)            
            "step 3"
            event.target.xjb_switchlingli()
        },
                },
                "xjb_buildBridge":{
                    player:function (target) {
            if (!lib.config.xjb_count[this.name1]) return;
            let next = game.createEvent('xjb_buildBridge')
            next.player = this
            next.target = target
            next.setContent('xjb_buildBridge');
            return next
        },
                    content:function () {
            "step 0"
            if(player != game.me) player.storage.xjb_daomoMax = 5;
            var list = [], maxNum = player.storage.xjb_daomoMax || 1;
            if (!lib.config.xjb_count[event.player.name1].daomo) {
                lib.config.xjb_count[event.player.name1].daomo = {}
            };
            let dataSource = lib.config.xjb_count[event.player.name1].daomo;
            function add(str, str2) {
                if (dataSource[str] && dataSource[str].number >= maxNum) {
                    list.push(`${str2 + xjbLogo[str](80)}`)
                }
            };
            xjb_lingli.daomo.type.forEach(i=>{
               add(i,get.xjb_daomoInformation(i).translation)
            });
            function wordswords() {
                return "请选择一个导魔介质，放置" + (player.storage.xjb_daomoMax || 1) +
                    "对在你和" + get.translation(event.target)
                    + "间"
            };
            player.addSkill("xjb_ui_dialog_append");
            let next = event.player.chooseButton([
            wordswords(),
            [list, "tdnodes"],
            "调整放置的导魔介质"
            ], [0,1]);
            next.set('filterButton',function(button){
               let logoList = {
                    "金乌": "sun",
                    "龙女": "dragon",
                    "杜鹃": "blood",
                    "雪女": "tear",
                    "桃妖": "taoyao",
                    "血魔": "xuemo",
                    "百花":"flower",
               }
               let logo = logoList[button.innerText]
               return lib.config.xjb_count[player.name1].daomo[logo].number >= (player.storage.xjb_daomoMax||1)
            });
            let div = document.createElement("div") , range = document.createElement("input")
            range.type = 'range'
            range.value = (player.storage.xjb_daomoMax || 1);
            range.min = 1;
            range.max = 5;
            range.onchange = function () {
                player.storage.xjb_daomoMax = (-(-this.value))
                this.parentNode.parentNode.firstChild.innerText = wordswords()
                ui.selected.buttons.forEach(i=>{
                  i.click()
                  i.dispatchEvent(new TouchEvent("touchend", {
                       bubbles: true,
                       cancelable: true,
                       composed: true
                  }))
                  i.click()
                  i.dispatchEvent(new TouchEvent("touchend", {
                       bubbles: true,
                       cancelable: true,
                       composed: true
                  }))
                })
                game.check()
            }
            div.appendChild(range)
            next.appendC = [ div ,'']
            "step 1"
            if (result.links && result.links.length) {
                let logo = {
                    "金乌": "sun",
                    "龙女": "dragon",
                    "杜鹃": "blood",
                    "雪女": "tear",
                    "桃妖": "taoyao",
                    "血魔": "xuemo",
                    "百花":"flower",
                }[result.links[0].slice(0, 2)]
                game.xjb_getDaomo(player, logo, -player.storage.xjb_daomoMax)
                player.addMark("_xjb_daomo_" + logo, player.storage.xjb_daomoMax)
                target.addMark("_xjb_daomo_" + logo, player.storage.xjb_daomoMax)
                player.xjb_switchlingli()
                target.xjb_switchlingli()
            }
        },
                },
                "xjb_switchlingli":{
                    player:function () {
            let next = game.createEvent('xjb_switchlingli')
            next.player = this
            next.setContent('xjb_switchlingli');
            return next
        },
                    content:function () {
            "step 0"
            event.num = event.player.countMark("_xjb_moli")
            if (event.num <= 0) event.finish()
            "step 1"
            if (!xjb_lingli.daomo.test(event.player)) event.finish()
            if (xjb_lingli.daomo.find(event.player).length < 1) event.finish()
            event.list = xjb_lingli.daomo.list(event.player)
            "step 2"
            if (!event.list.length) return event.goto(3)
            let now = event.list.shift()
            let targets = game.players.filter((current, index) => {
                if (current == event.player) return false
                if (current.hasMark(now)) return true
            })
            if (targets.length) {
                targets.forEach((current) => {
                    if (!event.player.hasMark(now)) return
                    event.num--
                    player.removeMark("_xjb_moli")
                    player.removeMark(now)
                    current.removeMark(now)
                    let next = game.createEvent('xjb_lingHit');
                    next.player = event.player;
                    let num1 = current.countMark("_xjb_lingli"),
                        num2 = event.player.countMark("_xjb_lingli");
                    next.target = num1 < num2 ? current : event.player
                    next.type = now
                    next.setContent(function () {
                        let verb = xjb_lingli.daomo.event_mark[event.type]
                        if (target[verb]) target[verb]()
                        target.xjb_addlingli()
                    });


                })
            }
            if (event.num > 0) event.redo()
            "step 3"
            if (event.num > 0) event.goto(1)
        },
                },
                "xjb_loselingli":{
                    player:function (num = 1) {
            let next = game.createEvent('xjb_loselingli')
            next.player = this
            next.num = num
            next.setContent('xjb_loselingli');
            return next
        },
                    content:function () {
            "step 0"
            event.player.removeMark("_xjb_lingli", event.num)
            event.player.update()
        },
                },
                "xjb_addlingli":{
                    player:function (num = 1, object) {
            let next = game.createEvent('xjb_addlingli')
            next.player = this
            next.num = num
            next.setContent('xjb_addlingli');
            return next
        },
                    content:function () {
            "step 0"
            event.player.addMark("_xjb_lingli", event.num)
            event.player.update()
            "step 1"
            for (let i = 0; i < event.num; i++) {
                if (Math.random() > Math.random()) event.player.xjb_molizeLingli()
            }
            event.player.xjb_updateLingli()
        },
                },
                "xjb_updateLingli":{
                    player:function () {
            let next = game.createEvent('xjb_updateLingli')
            next.player = this
            next.setContent('xjb_updateLingli');
            return next
        },
                    content:function () {
            let num = game.xjb_getSb.allLingli(event.player),
                K = xjb_lingli.updateK(game.xjb_getSb.position(event.player))
            if (num > K) {
                let limit = num - K
                for (let i = 0; i < limit; i++) {
                    event.player.xjb_molizeLingli()
                }
            }
            event.player.update()
        },
                },
                "xjb_chooseHEJXS":{
                    player:function () {
            let next = game.createEvent('xjb_chooseHEJXS')
            next.player = this
            Array.from(arguments).forEach(function (i) {
                if (lib._xjb.type(i) === "number") {
                    next.num = i
                } else if (typeof i === "boolean") {
                    next.forced = i
                } else if (typeof i === "string") {
                    next.todo = i
                }
            })
            if (!next.todo) next.todo = "discard"
            if (!next.num) next.num = 1
            next.setContent('xjb_chooseHEJXS');
            return next
        },
                    content:function () {
            "step 0"
            if (event.player.countCards("hejsx") < event.num) {
                event.player.discard(event.player.getCards("hejsx"))
                event.finish()
            }
            "step 1"
            let dialog = ui.create.dialog("请选择" + event.num + "张牌")
            dialog.add("<div class=\"text center\">手牌区</div>")
            dialog.add([event.player.getCards("h"), "vcard"])
            dialog.add("<div class=\"text center\">装备区</div>")
            dialog.add([event.player.getCards("e"), "vcard"])
            dialog.add("<div class=\"text center\">判定区</div>")
            dialog.add([event.player.getCards("j"), "vcard"])
            dialog.add("<div class=\"text center\">武将牌上</div>")
            dialog.add([event.player.getCards("x"), "vcard"])
            dialog.add("<div class=\"text center\">特殊区</div>")
            dialog.add([event.player.getCards("s"), "vcard"])
            event.player.chooseButton(dialog, event.num, event.forced)
            "step 2"
            if (result.links) {
                event.player[event.todo](result.links)
            }
        },
                },
                "xjb_chooseSkillToCard":{
                    player:function (num = 1, target) {
            let next = game.createEvent('xjb_chooseSkillToCard')
            next.player = this
            next.num = num
            next.target = target || this
            next.setContent('xjb_chooseSkillToCard');
            return next
        },
                    content:function () {
            "step 0"
            event.player.chooseSkill(event.player, "选择你丢弃的技能", function (info, skill, name) {
                if (!event.player.hasSkill(skill)) return false
                if (info.group) return false
                return true
            });
            "step 1"
            if (result.skill) {
                player.removeSkill(result.skill);
                lib.card.xjb_skillCard.cardConstructor(result.skill);
                lib.card.xjb_skillCard.skillLeadIn(result.skill);
                var card = game.createCard(result.skill + "_card");
                event.target.gain(card);

                event.num--
            }
            "step 2"
            if (event.num > 0) event.goto(0)
        },
                },
                useHpCard:{
                    player:function (num, source, bool = true) {
            let next = game.createEvent('useHpCard')
            let player, name
            next.num = num
            next.player = player = this
            if (!source) next.source = source = player
            next.name = name = source.name1
            next.usable = bool
            if (!lib.config.xjb_count[name].HpCard) lib.config.xjb_count[name].HpCard = []
            if (!lib.config.xjb_count[name].HpCard.length) {
                return
            }
            var x = lib.config.xjb_count[name].HpCard.indexOf(num)
            if (x < 0) {
                return
            }
            next.index = x
            next.setContent('useHpCard');
            return next
        },
                    content:function () {
            "step 0"
            if (event.usable === true) {
                event.player.maxHp += (event.num)
                event.player.changeHp(event.num)
            }

            lib.config.xjb_count[event.name].HpCard.splice(event.index, 1)
            game.log(event.player, get.translation(event.player.name1) + '使用了体力牌：' + event.num)
            game.saveConfig('xjb_count', lib.config.xjb_count);
        },
                },
                "xjb_bianshen":{
                    player:function () {
            let next = game.createEvent('xjb_bianshen');
            next.player = this
            Array.from(arguments).forEach(function (i) {
                if (lib._xjb.type(i) === "object") {
                    i.skill = "skill_X"
                    i.onremove = function (player) {
                        delete player.storage[i.name];
                        player.removeMark("_xin_bianshen", 1)
                    }
                    next.call = i
                } else if (typeof i == 'string') {
                    next.qimen = i
                } else if (typeof i == 'number') {
                    next.cost = i
                }
            })
            if (!next.qimen) next.qimen = ""
            next.setContent('xjb_bianshen');
            return next;
        },
                    content:function () {
            "step 0"
            if (event.player.countMark('_xin_bianshen') > 0) {
                event.finish()
            }
            "step 1"
            event.player.storage[event.call.name] = event.player.addSubPlayer(event.call);
            event.player.callSubPlayer(event.call)
            event.player.addMark('_xin_bianshen')
            "step 2"
            event.player.storage["qimendunjia"] = event.qimen
            event.player.useCard(game.createCard('qimendunjia'), event.player)
            game.xjb_systemEnergyChange(-50)
            game.cost_xjb_cost(1, event.cost)
            ui.xjb_giveStyle(event.player.node.avatar, {
                backgroundImage: `url(${lib.xjb_src + lib.character[event.call.name][4][1]})`
            })
        },
                },
                usechenSkill:{
                    player:function () {
            let next = game.createEvent('usechenSkill');
            next.player = this;
            for (var i = 0; i < arguments.length; i++) {
                if (get.itemtype(arguments[i]) === 'player') {
                    next.source = arguments[i]
                }
                else if (typeof arguments[i] === 'string') {
                    next.logSkill = arguments[i]
                }
                else if (lib._xjb.type(arguments[i]) === "array") {
                    next.skills = arguments[i]
                }
            }
            if (!next.skills) {
                next.skills = [];
                var skills = next.player.getSkills();
                for (var i = 0; i < skills.length; i++) {
                    if (lib.skill[skills[i]].chenSkill) {
                        next.skills.add(skills[i])
                    }
                }
            }
            next.setContent('usechenSkill');
            return next;
        },
                    content:function () {
            "step 0"
            var list = event.skills
            if (event.skills && event.skills.length > 0) {
                for (var i = 0; i < list.length; i++) {
                    event.player.addMark('_xin_junzhu');
                    event.player.useSkill(list[i])
                }
            }
            "step 1"
            if (event.player.countMark("_xin_junzhu")) event.player.removeMark("_xin_junzhu")
        },
                },
                chooseLoseHpMaxHp:{
                    player:function () {
            let next = game.createEvent('chooseLoseHpMaxHp', false);
            next.player = this;
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] == 'boolean') {
                    next.forced = arguments[i];
                }
                else if (typeof arguments[i] == 'string') {
                    next.prompt = arguments[i];
                }
                else if (typeof arguments[i] == 'function') {
                    next.ai = arguments[i];
                }
                else if (lib._xjb.type(arguments[i]) === "array") {
                    next.num1 = arguments[i][0]
                    next.num2 = arguments[i][1]
                }
            }
            if (!next.num1) next.num1 = 1;
            if (!next.num2) next.num2 = 1;
            next.setContent('chooseLoseHpMaxHp');
            return next;
        },
                    content:function () {
            'step 0'
            var controls = ['失去体力上限', '失去体力'];
            if (!event.forced) {
                controls.push('cancel2');
            }
            var prompt = event.prompt;
            if (!prompt) {
                prompt = '失去' + get.cnNumber(event.num1) + '体力上限或失去' + get.cnNumber(event.num2) + '点体力'
            }
            var next = player.chooseControl(controls);
            next.set('prompt', prompt);
            if (event.hsskill) next.setHiddenSkill(event.hsskill);
            if (event.ai) {
                next.set('ai', event.ai);
            }
            else {
                var choice;
                if (player.maxHp > player.hp) {
                    choice = '失去体力上限';
                } else if (player.hp == 1) {
                    choice = 'cancel2'
                }
                else {
                    choice = '失去体力';
                }
                next.set('ai', function () {
                    return _status.event.choice;
                });
                next.set('choice', choice);
            }
            'step 1'
            if (result.control != 'cancel2') {
                if (event.logSkill) {
                    if (typeof event.logSkill == 'string') {
                        player.logSkill(event.logSkill);
                    }
                    else if (Array.isArray(event.logSkill)) {
                        player.logSkill.apply(player, event.logSkill);
                    }
                }
                if (result.control == '失去体力上限') {
                    player.loseMaxHp(event.num1);
                }
                else {
                    player.loseHp(event.num2);
                }
            }
            event.result = result;

        },
                },
            },
            "xjb_3":{
                skillTag:function () {
                    //随动技附魔
                    lib.skill._xjb_suidongSkill = {
                        trigger: {
                            player: ["gainEnd", "drawEnd"]
                        },
                        direct: true,
                        filter: function (event, player) {
                            if (!event.cards) return false
                            for (let i = 1; i < 9; i++) {
                                let theName = event.getParent(i)&&event.getParent(i).name;
                                if (Object.keys(lib.skill).contains(theName)) {
                                    if (lib.skill[theName].suidongSkill === true) return true
                                }
                            }//遍历父事件是否为随动技               
                            return false
                        },
                        content: function () {
                            "step 0"
                            player.chooseUseTarget(trigger.cards[0])//选择使用该牌
                        }
                    }
                    //福技 禄技 寿技 附魔
                    lib.skill._xjb_fulushouSkill = {
                        trigger: {
                            player: "logSkill"
                        },
                        filter: function (event, player) {
                            if (!event.sourceSkill) return false
                            if (!lib.config.xjb_skillTag_Character) return false
                            if (!lib.config.xjb_skillTag_Character.contains(player.name1)) return false
                            return true
                        },
                        forced: true,
                        direct: true,
                        content: function () {
                            if (!player.storage.skillTag_container) {
                                player.storage.skillTag_container = {
                                    fuSkill: [],
                                    luSkill: [],
                                    shouSkill: [],
                                }
                            }
                            if (lib.skill[trigger.sourceSkill].fuSkill
                                && !player.storage.skillTag_container.fuSkill.contains(trigger.sourceSkill)) {
                                player.recover()
                                player.changeHujia()
                                player.popup("福技")
                                player.storage.skillTag_container.fuSkill.add(trigger.sourceSkill)
                            }
                            if (lib.skill[trigger.sourceSkill].luSkill
                                && !player.storage.skillTag_container.luSkill.contains(trigger.sourceSkill)) {
                                player.draw(4)
                                player.popup("禄技")
                                player.storage.skillTag_container.luSkill.add(trigger.sourceSkill)
                            }
                            if (lib.skill[trigger.sourceSkill].shouSkill
                                && !player.storage.skillTag_container.shouSkill.contains(trigger.sourceSkill)) {
                                player.gainMaxHp(2)
                                player.popup("寿技")
                                player.storage.skillTag_container.shouSkill.add(trigger.sourceSkill)
                            }
                        }
                    }
                    //强制技
                    lib.skill._xjb_qzj = {
                        trigger: {
                            player: "useSkillAfter"
                        },
                        filter: function (event, player) {
                            if (!event.targets) return false
                            if (!event.targets.length) return false
                            if (!event.skill) return false
                            if (!lib.skill[event.skill].qzj) return false
                            return true
                        },
                        forced: true,
                        direct: true,
                        content: function () {
                            for (let i = 0; i < trigger.targets.length; i++) {
                                trigger.targets[i].addTempSkill('skill_noskill')
                                trigger.targets[i].popup("强制技")
                            }
                        }
                    }
                    //强制技效果
                    lib.skill.skill_noskill = {
                        init: function (player, skills) {
                            var name = player.name1, list = lib.character[name][3]
                            var skillname = list.randomGet()
                            player.xjb_noskill(list)
                        },
                        onremove: function (player, skills) {
                            player.gain_noskill()
                        }
                    }
                    lib.translate.fuSkill = "<b description=［附魔：首次使用此技能恢复体力并加一点护甲］>福技</b>"
                    lib.translate.luSkill = "<b description=［附魔：首次使用此技能摸四张牌］>禄技</b>"
                    lib.translate.shouSkill = "<b description=［附魔：首次使用此技能加两点体力上限］>寿技</b>"
                    lib.translate.suidongSkill = "<b description=［附魔：因为此技能效果获得牌后可以立即使用该牌］>随动技</b>"
                    lib.translate.qzj = "<b description=［附魔：此技能指定的目标角色当前回合失去技能］>强制技</b>"
                },
                Translate:function () {
                    lib.translate.xin_qinnang2 = '青囊'
                    lib.translate.xin_xuming = '续命'
                    lib.translate.xjb_bingjue = '冰诀'
                    lib.translate.xin_qinnang2_info = '出牌阶段限一次，你可对一名角色使用任意张【桃】，你以此法你每使用一张【桃】，你和其各摸一张牌。'
                },
                dynamicTranslate:function () {
                    //谋圣动态描述
                    lib.dynamicTranslate["xin_mousheng"] = function (player) {
                        return '锁定技，你亮出拼点牌时，你拼点牌点数+' + Math.min(game.roundNumber, 12)
                    }
                    //激昂动态描述
                    lib.dynamicTranslate["xin_jiang"] = function (player) {
                        var num = 0
                        for (var i = 0; i < game.players.length; i++) {
                            if (game.players[i].isLinked()) num++
                        }
                        if ((player.hasZhuSkill('xin_yingyi') && get.mode() == 'identity') || get.mode() != 'identity') {
                            for (var i = 0; i < game.players.length; i++) {
                                if (game.players[i].group === 'wu') num++
                            }
                        }
                        if (num > 3) num = 3
                        return lib.translate.xin_jiang_info.replace("X", num + "").replace(/[(].+[)]/i, "")
                    }
                    //国色动态描述
                    lib.dynamicTranslate["xjb_guose"] = function () {
                        var num = game.countPlayer(function (current) {
                            return current.countCards('ej');
                        });
                        return lib.translate.xjb_guose_info.replace("X", num + "").replace(/[(].+[)]/i, "")
                    }
                    lib.dynamicTranslate["xin_lianhuan"] = function () {
                        return lib.translate.xjb_lianhuan_info.replace("X", player.hp + "").replace(/[(].+[)]/i, "")
                    }
                    //涅槃动态描述
                    lib.dynamicTranslate["xin_niepan"] = function (player) {
                        return player.countCards('h') % 2 == 1 ? lib.skill.xin_niepan.translate1 : lib.skill.xin_niepan.translate2
                    }
                },
                soulSkill:function () {
                    lib.skill.xjb_redSkill = {
                        init: function (player, skill) {
                            player.die = function () {
                                if (!(player == game.me || player.isUnderControl())) {
                                    player.revive(player.maxHp)
                                    player.update()
                                } else {
                                    game.pause()
                                    game.xjb_create.confirm("【玩家死亡，是否复活？】", function () {
                                        if (!lib.config.xjb_redSkill.dieTimes) { lib.config.xjb_redSkill.dieTimes = 0 }
                                        lib.config.xjb_redSkill.dieTimes++
                                        game.saveConfig("xjb_redSkill", lib.config.xjb_redSkill)
                                        player.revive(player.maxHp)
                                        player.update()
                                        game.resume()
                                    }, function () {
                                        var target = lib.config["xjb_redSkill"], length = Object.keys(lib.config['xjb_redSkill'].skill).length
                                        target.skill[length] = {}
                                        target.skill[length].list = target.list
                                        target.skill[length].translate = target.translate
                                        target.list = []
                                        target.translate = {}
                                        game.saveConfig('xjb_redSkill', lib.config[skill])
                                        lib.element.player.die.apply(player, [])
                                        game.resume()
                                    })
                                }
                            }
                        },
                        trigger: {
                            global: ["logSkill", "useSkillAfter"],
                        },
                        baned: lib.xjb_list_xinyuan.skills.red.concat(
                            "rehuashen"
                        ),
                        filter: function (event, player) {
                            if (event.player === player) return false
                            let skill = event.sourceSkill || event.skill
                            return !!skill && lib.skill[skill].equipSkill == undefined && skill[0] != "_"
                        },
                        forced: true,
                        content: function () {
                            let skill = "xjb_redSkill"
                            let _get = trigger.sourceSkill || trigger.skill
                            if (lib.skill[skill][_get] == undefined) lib.skill[skill][_get] = 0
                            if (lib.skill[skill][_get] < 20) { lib.skill[skill][_get] += 10 }
                            else if (lib.skill[skill][_get] < 30) { lib.skill[skill][_get] += 5 }
                            else if (lib.skill[skill][_get] < 100) { lib.skill[skill][_get] += 1 }
                            var theNumber = lib.skill[skill][_get] / 1000
                            if (Math.random() < theNumber) {
                                let toget = event.name + "_" + _get
                                if (!player.hasSkill(toget) && !["rehuashen"].contains(_get)) {
                                    lib.config[skill].list.add(toget)
                                    lib.config[skill].translate[toget] = lib.translate[_get]
                                    lib.config[skill].translate[toget + "_info"] = lib.translate[_get + "_info"]
                                    game.saveConfig(skill, lib.config[skill])
                                    game.updateRed()
                                    player.addSkillLog(toget)
                                    if (player == game.me) game.xjb_create.alert(`【系统提示：发现技能"${get.translation(toget)}"，已记录在技能目录中】`)
                                }
                            }

                        },
                    }
                    lib.translate.xjb_redSkill = "幻想乡OL"
                    lib.translate.xjb_redSkill_info = "你拥有习得他人技能的能力"
                    //以下是恩赐    
                    lib.skill.xjb_juanqu = {
                        enable: "phaseUse",
                        round: 1,
                        filter: function (event, player) {
                            return player.group == "shen"
                        },
                        filterTarget: function (card, player, target) {
                            return target != player
                        },
                        content: function () {
                            target.fc_X(true, 1, [10])
                            player.changeGroup(["wei", "wu", "shu", "qun"].randomGet());
                        },
                        mark: true,
                    }
                    lib.translate.xjb_juanqu = "恩赐"
                    lib.translate.xjb_juanqu_info = "每轮限一次，若你为神势力，你可以令一名角色摸十张牌然后改变自己的势力。"
                    /*以上是恩赐代码*/
                    //以下是冰诀
                    lib.skill.xjb_bingjue = {
                        mod: {
                            cardUsable: function (card, player, num) {
                                if (card.name === 'sha' && card.nature === 'ice') return Infinity;
                            },
                        },
                        enable: "phaseUse",
                        filterCard: {
                            suit: "club",
                        },
                        selectCard: -1,
                        filter: function (card, player, target) {
                            return player.countCards('h') > 0;
                        },
                        discard: false,
                        lose: false,
                        delay: false,
                        usable: 1,
                        content: function () {
                            for (var i = 0; i < cards.length; i++) {
                                cards[i].storage.vanish = true
                                player.gain(game.createCard2('sha', 'club', 1, 'ice'))
                            }
                            player.lose(cards)
                        },
                    }
                    lib.translate.xjb_bingjue_info = '出牌阶段限一次，你可弃置所有梅花手牌，然后获得等量张冰【杀♣️A】。你使用冰【杀】无次数限制。'
                    lib.skill.xjb_huojue = {
                        trigger: {
                            global: ["logSkill", "useSkillAfter"],
                        },
                        filter: function (event, player) {
                            let skillname = (event.sourceSkill || event.skill)
                            if (skillname.startsWith("_")) return false
                            if (player != event.player) return !!skillname
                        },
                        usable: 1,
                        content: function () {
                            trigger.player.damage("fire")
                            trigger.player.removeSkill((trigger.sourceSkill || trigger.skill))
                        },
                    }
                    lib.translate.xjb_huojue = "火诀"
                    lib.translate.xjb_huojue_info = "每回合限一次，当一名角色使用技能时，你可对其造成一点火属性伤害然后其失去该技能。"
                    lib.skill.xjb_pomie = {
                        trigger: {
                            source: "dying",
                        },
                        filter: function (event, player) {
                            if (player != game.me) return false
                            return true
                        },
                        content: function () {
                            "step 0"
                            if (game.xjb_condition(3, 1)) {
                                let skills1 = trigger.player.skills, skills2 = []
                                for (let i = 0; i < skills1.length; i++) {
                                    if (!lib.config.xjb_newcharacter.skill.contains(skills1[i])) {
                                        skills2.add(skills1[i])
                                    }
                                }
                                if (skills2.length) player.chooseControl(skills2)
                                else {
                                    game.xjb_create.alert("目标没有合法技能", function () {
                                        game.resume()
                                    })
                                    game.pause()
                                }
                            } else {
                                game.xjb_create.alert("请添加技能槽！", function () {
                                    game.resume()
                                })
                                game.pause()
                            }
                            "step 1"
                            if (result.control) {
                                player.addSkillLog(result.control)
                                lib.config.xjb_newcharacter.skill.add(result.control)
                                game.saveConfig("xjb_newcharacter", lib.config.xjb_newcharacter)

                            }
                        }
                    }
                    lib.translate.xjb_pomie = "破灭"
                    lib.translate.xjb_pomie_info = "当你令一名角色进入濒死阶段，你可将其一个技能添加到养成武将的武将牌上。"

                },
                SanSkill:function () {
                    //疼痛敏感
                    lib.skill.lunaticMasochist = {
                        trigger: {
                            player: ["equipBefore", "discardBefore", "loseHpBefore", "recoverBefore", "loseMaxHpBefore", "gainMaxHpBefore"]
                        },
                        forced: true,
                        content: function () {
                            trigger.set("name", "damage")
                            if (!trigger.num) trigger.num = 1
                        }
                    }
                    lib.translate.lunaticMasochist = "疼痛敏感"
                    lib.translate.lunaticMasochist_info = "你弃牌、失去体力、恢复体力、失去体力上限、恢复体力上限、装备装备牌均视为受到伤害。"
                },
                "xjb_theCardSkill":function () {
                    //以下是诸葛亮装备
                    //1.装备技能:续命
                    lib.skill.xin_xuming = {
                        trigger: {
                            global: "dying",
                        },
                        frequent: true,
                        content: function () {
                            "step 0"
                            var list0 = []
                            if (player.getExpansions('qixing').length > 0) list0.push('弃置一颗"星"，令其恢复1点体力')
                            list0.push('使用一张【奇门遁甲】')
                            if (list0.length > 0) event.list0 = list0
                            "step 1"
                            player.chooseControl(event.list0).set('prompt', '续命:选择一项执行之').set('ai', function () {
                                if (get.attitude(player, trigger.player) > 0) return '弃置一颗"星"，令其恢复1点体力'
                                return '使用一张【奇门遁甲】';
                            })
                            "step 2"
                            if (result.control == '使用一张【奇门遁甲】') {
                                player.chooseUseTarget(game.createCard('qimendunjia'), true)
                                event.finish();
                            }
                            else {
                                var card = player.getExpansions('qixing').slice(-1)
                                player.loseToDiscardpile(card);
                                trigger.player.recover()
                            }
                        }
                    }
                    /*以上是诸葛亮装备技能*/

                    //1.装备技能:偃月
                    lib.skill.xin_yanyue = {
                        equipSkill: true,
                        trigger: {
                            source: "damageBegin2",
                        },
                        filter: function (event, player) {
                            return player.countCards("he") > 1
                        },
                        check: function (event, player) {
                            return get.attitude(player, event.target) < 0;
                        },
                        content: function () {
                            player.chooseToDiscard(2, true, "he", "弃置两张牌令此伤害+1")
                            trigger.num++
                            trigger.player.addMark('new_wuhun_mark', 1);
                        },
                    }
                    lib.translate.xin_yanyue = '偃月'


                    //2.装备技能:追魂
                    lib.skill.xin_zhuihun = {
                        equipSkill: true,
                        trigger: {
                            player: "damageEnd",
                        },
                        forced: true,
                        check: function (event, player) {
                            return get.attitude(player, event.source) < 0;
                        },
                        content: function () {
                            if (trigger.source.countCards('h') > 0) trigger.source.chooseToDiscard('h', 1, true)
                            if (trigger.source) trigger.source.addMark('new_wuhun_mark', 1)
                            player.insertPhase();
                        },
                    }
                    lib.translate.xin_zhuihun = '追魂'

                    //3.装备延伸技能:武圣
                    lib.skill.xin_hlyyd = {
                        mod: {
                            cardUsableTarget: function (card, player, target) {
                                if (target.hasMark('new_wuhun_mark')) return true;
                            },
                        },
                        locked: false,
                        enable: ["chooseToRespond", "chooseToUse"],
                        filterCard: function (card, player) {
                            if (get.zhu(player, 'shouyue')) return true;
                            return get.color(card) == 'red';
                        },
                        position: "hes",
                        viewAs: {
                            name: "sha",
                        },
                        viewAsFilter: function (player) {
                            if (get.zhu(player, 'shouyue')) {
                                if (!player.countCards('hes')) return false;
                            }
                            else {
                                if (!player.countCards('hes', { color: 'red' })) return false;
                            }
                        },
                        onuse: function (event, player) {
                            if (player.countCards("h") == 1) player.seekTag('damage')
                        },
                        prompt: "将一张红色牌当杀使用或打出",
                        check: function (card) {
                            var val = get.value(card);
                            if (_status.event.name == 'chooseToRespond') return 1 / Math.max(0.1, val);
                            return 5 - val;
                        },
                    }
                    lib.translate.xin_hlyyd = "武圣"
                    lib.translate.xin_hlyyd_info = "你可以将一张红色牌当做【杀】使用或打出，你以此法使用或打出最后手牌时，你从牌堆中获得一张带伤害标签的牌。你对有“梦魇”标记的角色使用牌无次数限制。"
                    lib.skill.xin_qinnang2 = {
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            return player.countCards('h', 'tao') > 0 || (player.hasSkill('xin_qns') && player.countCards('hes', { color: 'red' }) > 0);
                        },
                        filterTarget: function (card, player, target) {
                            return target.hp < target.maxHp;
                        },
                        content: function () {
                            "step 0"
                            player.chooseToUse('使用一张桃', { name: 'tao' }, true, function (card, player, target) {
                                if (targets[0] == target) return true;
                                return false;
                            });
                            game.asyncDraw([target, player]);
                            "step 1"
                            if (player.countCards('h', 'tao') > 0 || (player.hasSkill('xin_qns') && player.countCards('hes', { color: 'red' }))) {
                                if (targets[0].hp < targets[0].maxHp) player.chooseBool('是否继续出【桃】');
                            } else event.finish()
                            "step 2"
                            if (result.bool) {
                                if (player.countCards('h', 'tao') > 0 || (player.hasSkill('xin_qns') && player.countCards('hes', { color: 'red' }))) {
                                    if (targets[0].hp < targets[0].maxHp) event.goto(0);
                                }
                            }
                        },
                        ai: {
                            order: 4.5,
                            result: {
                                target: function (player, target) {
                                    if (target.hp == 1) return 5;
                                    if (player == target && player.countCards('h') > player.hp) return 5;
                                    return 2;
                                },
                            },
                            threaten: 3,
                        },
                    }
                    //以下是马超装备
                    //1.装备技能:狮怒
                    lib.skill.xin_shinu = {
                        equipSkill: true,
                        trigger: {
                            player: "damageBegin2",
                        },
                        filter: function (event, player) {
                            return event.source
                        },
                        content: function () {
                            'step 0'
                            trigger.source.damage(trigger.num)
                            'step 1'
                            if (player.hp <= 1) {
                                trigger.cancel()
                                var s = player.getCards('e', { subtype: 'equip2' });
                                player.lose(s, ui.cardPile);
                            }
                        },
                    }
                    lib.translate.xin_shinu = '狮怒'
                },
                uniqueSkill:function () {
                    //触屏即杀
                    lib.skill.xjb_chupingjisha = {
                        enable:"phaseUse",
                        content:function(){
                           player.update()
                        }
                    }
                    lib.translate.xjb_chupingjisha="触屏即杀"
                    //游戏初始化
                    lib.skill._tianxing = {
                        trigger: {
                            global: ["gameStart"],
                        },
                        popup: false,
                        forced: true,
                        superCharlotte: true,
                        charlotte: true,
                        fixed: true,
                        filter:function(event,player){
                            return player===game.me
                        },
                        content: function () {     
                            game.xjb_PreBackImage=window.getComputedStyle(ui.background).backgroundImage;                    
                            game.countPlayer(function (current) {     
                                player.storage.xjb_daomoMax = 1  
                                //                         
                                current.storage.xjb_PreImage=window.getComputedStyle(current.node.avatar).backgroundImage;         
                                //                                               
                                current.storage._skill_xin_X = [1, 1, 1, [], [], [], []]
                                current.storage.xjb_card_allow = {}
                                current.noskill = {}
                                current.noskill_translate = {}
                                //建X_skill区，[0]代表执行项目，[1]代表角色数目，[2]代表执行次数，[3]代表禁止武将，[4]代表限制条件，[5]修改其他五区，[6]控制[5]区(套娃)
                            })
                            lib.config.xjb_chupingjisha === 1&&lib.config.xjb_systemEnergy>0&&lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()                                                               
                        },
                    };




                    lib.skill._xin_junzhu = {
                        superCharlotte: true,
                        charlotte: true,
                        fixed: true,
                        marktext: "君",
                        intro: {
                            content: "因君主技而发动",
                        },
                    }
                    lib.skill._xin_bianshen = {
                        marktext: "变",
                        intro: {
                            name: "变",
                            content: "已变身",
                        },
                    }
                    lib.skill._xjb_huobi = {
                        trigger: {
                            player: ["useCardAfter", "respondAfter", "damageAfter"],
                        },
                        priority: -1,
                        direct: true,
                        num1: 0,
                        num2: 0,
                        num: 0,
                        content: function () {
                            if (trigger.card && trigger.card.number) {
                                lib.skill._xjb_huobi.num += trigger.card.number
                                lib.skill._xjb_huobi.num1 += trigger.card.number
                                lib.skill._xjb_huobi.num2 += trigger.card.number
                            } else {
                                lib.skill._xjb_huobi.num += trigger.num * 5
                                lib.skill._xjb_huobi.num1 += trigger.num * 5
                                lib.skill._xjb_huobi.num2 += trigger.num * 5
                            }
                            if (lib.skill._xjb_huobi.num1 > 500) {
                                lib.skill._xjb_huobi.num1 = 0
                                var card = game.createCard2("xjb_tianming_huobi1", "black", 13)
                                card.storage.xjb_allowed = true;
                                ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                            }
                            if (lib.skill._xjb_huobi.num2 > 1500) {
                                lib.skill._xjb_huobi.num2 = 0
                                var card = game.createCard2("xjb_tianming_huobi2", "red", 1)
                                card.storage.xjb_allowed = true;
                                ui.cardPile.insertBefore(card, ui.cardPile.childNodes[get.rand(0, ui.cardPile.childNodes.length)]);
                            }
                        }
                    }
                    lib.translate._xjb_huobi = "货币"
                },
            },
            "xjb_4":{
                CardStore:function () {
                    game.xjb_storeCard = [
                        "xjb_shenshapo",
                        "xjb_skill_off_card",
                        "xin_zhihuan",
                        "xjb_penglai",
                        "xjb_skillCard",
                        "xjb_tianming_huobi2",
                        "xjb_tianming_huobi1",
                        "xjb_seizeHpCard",
                        "xjb_lingliCheck"
                    ]
                    lib.cardPack["xjb_hunbiStore"] = [...game.xjb_storeCard]
                    lib.translate.xjb_hunbiStore_card_config = "魂市"
                    lib.config.all.cards.push("xjb_hunbiStore");
                    if (!lib.config.cards.contains("xjb_hunbiStore")) lib.config.cards.push("xjb_hunbiStore");
                    function CardCreator(num1, num2, num3, arr1, arr2) {
                        this.content = {
                            fivePoint: num1,
                            minCost: num2,
                            energyNeed: num3,
                        }
                        this.arr1 = arr1
                        this.arr2 = arr2
                        this.update()
                    }
                    CardCreator.prototype.update = function () {
                        if (lib.config.xjb_systemEnergy < this.content.energyNeed) {
                            this.content.ok = false
                        } else this.content.ok = true
                        if (lib.config.xjb_systemEnergy < this.content.fivePoint) {
                            let Num1 = this.content.fivePoint - lib.config.xjb_systemEnergy
                            this.content.cost = (Math.floor(Num1 / this.arr1[0]) * (this.arr1[1])) + 5
                        } else if (lib.config.xjb_systemEnergy > this.content.fivePoint) {
                            let Num2 = lib.config.xjb_systemEnergy - this.content.fivePoint
                            this.content.cost = (-(Math.floor(Num2 / this.arr2[0]) * (this.arr2[1]))) + 5
                            if (this.content.cost < this.content.minCost) this.content.cost = this.content.minCost
                        } else {
                            this.content.cost = 5
                        }
                    }
                    game.xjb_storeCard_information = {
                        xjb_skill_off_card: new CardCreator(580, 0, 25, [500, 1], [600, 1]),
                        xin_zhihuan: new CardCreator(150, 1, 43, [3, 1], [10, 1]),
                        xjb_penglai: new CardCreator(1230, 2, 70, [56, 1], [70, 1]),
                        xjb_skillCard: new CardCreator(1460, 2, 75, [56, 1], [100, 1]),
                        xjb_tianming_huobi2: new CardCreator(9842, 0, 500, [24, 1], [26, 1]),
                        xjb_tianming_huobi1: new CardCreator(1142, 0, 70, [84, 1], [96, 1]),
                        xjb_shenshapo: new CardCreator(980, 1, 50, [254, 2], [220, 1]),
                        xjb_seizeHpCard: new CardCreator(3000, 4, 150, [61, 1], [10, 1]),
                        xjb_BScharacter: new CardCreator(10000, 3, 50, [1905, 1], [2300, 1]),
                        xjb_lingliCheck: new CardCreator(23000, 4, 1300, [2500, 1], [1500, 1])
                    }
                    lib.skill._xjb_cardStore = {
                        enable: ["chooseToUse"],
                        filter: function (event, player) {
                            if (!lib.config.xjb_hun) return false
                            if (!(player == game.me || player.isUnderControl())) return false
                            if (event.type != 'dying' && event.parent.name != 'phaseUse') return false
                            if (lib.config.xjb_systemEnergy < 0) return false
                            let list = []
                            game.xjb_storeCard.forEach(function (item, index) {
                                this[item].update()
                                if (!this[item].content.ok) return
                                if (!game.xjb_condition(1, this[item].content.cost)) return;
                                list.push(["", this[item].content.cost, item])
                            }, game.xjb_storeCard_information)
                            if (!list.length) return false
                            return true
                        },
                        content: function () {
                            "step 0"
                            let list = []
                            game.xjb_storeCard.forEach(function (item, index) {
                                this[item].update()
                                if (!this[item].content.ok) return
                                if (!game.xjb_condition(1, this[item].content.cost)) return;
                                list.push(["", "<font color=white>" + this[item].content.cost + "魂币", item])
                            }, game.xjb_storeCard_information)
                            if (list.length) {
                                let dialog = ui.create.dialog("新将包魂市", [list, "vcard"])
                                player.chooseButton(dialog)
                            }
                            "step 1"
                            if (result.bool) {
                                let card = game.createCard(result.links[0][2], "", 1)
                                player.gain(card, "draw")
                                card.storage.xjb_allowed = true
                                game.cost_xjb_cost(1, game.xjb_storeCard_information[result.links[0][2]].content.cost)
                                game.xjb_systemEnergyChange(-game.xjb_storeCard_information[result.links[0][2]].content.energyNeed)

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
                        content: function () {
                            "step 0"
                            for (var i = 0; i < lib.skill._unique_talent_xjb.load.length; i++) {
                                lib.skill._unique_talent_xjb.load[i]()
                            }
                            player.storage.xjb_unique_talent == undefined && event.finish()
                            "step 1"
                            if (player.storage.xjb_unique_talent.length > 0) {
                                for (var i = 0; i < player.storage.xjb_unique_talent.length; i++) {
                                    if (player.storage.xjb_unique_talent[i][0] == game.roundNumber) {
                                        var skill = player.storage.xjb_unique_talent[i][1]
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
                    lib.translate.xjb_unique = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="32">'
                    lib.translate.xjb_unique_SanSkill = "🐉神圣技能🐉"
                    lib.translate.xjb_unique_talent = "💡天赋卡💡"
                    lib.translate.xjb_unique_money = "💎货币卡💎"
                    lib.translate.xjb_unique_reusable = "♻️循环卡♻️"
                    lib.translate.xjb_skillCard = "技能卡"
                },
                Function:function () {
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
                    }
                },
                CardSkills:function () {
                    lib.translate.xjb_seizeHpCard = "体力抓取"
                    lib.translate.xjb_seizeHpCard_info = "出牌阶段对一名手牌数大于你的其他角色使用:你与其的拼点，若你赢，你获得其一张体力牌<br><b description=[当卡牌点数大于1时，使用牌结算后就不能再次获得此牌]>最大回收点数：1</b>"
                    lib.card.xjb_seizeHpCard = {
                        image: "ext:新将包/xjb_seizeHpCard.png",
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
                            if (cards[0].number < 2) player.gain(game.createCard(cards[0].name, cards[0].suit, num))

                        },
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
                    }
                    lib.card.xjb_tianming_huobi2 = {
                        image: "ext:新将包/xjb_tianming_huobi2.png",
                        audio: true,
                        fullskin: true,
                        type: "xjb_unique",
                        subtype: "xjb_unique_money",
                        enable: true,
                        selectTarget: -1,
                        cardcolor: "red",
                        toself: true,
                        filterTarget: function (card, player, target) {
                            return target === game.me && card.storage.xjb_allowed == true;
                        },
                        modTarget: true,
                        content: function () {
                            game.xjb_gainJP("80上限")
                            delete card.storage.vanish;
                        },
                        ai: {
                            basic: {
                                useful: 4.5,
                                value: 9.2,
                            },
                            result: {
                                target: 2,
                            },
                        },
                    }
                    lib.translate.xjb_tianming_huobi2 = "金币"
                    lib.translate.xjb_tianming_huobi2_info = "珍贵的金币"
                    lib.card.xjb_tianming_huobi1 = {
                        image: "ext:新将包/xjb_tianming_huobi1.png",
                        audio: true,
                        fullskin: true,
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
                        ai: {
                            basic: {
                                useful: 4.5,
                                value: 9.2,
                            },
                            result: {
                                target: 2,
                            },
                        },
                    }
                    lib.translate.xjb_tianming_huobi1 = "铜币"
                    lib.translate.xjb_tianming_huobi1_info = "普通的铜币"
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
                    lib.translate.xjb_penglai = "蓬莱"
                },
                Card:function () {
                    lib.card.xjb_penglai = {
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
                        audio: "ext:新将包",
                        type: "xjb_unique",
                        subtype: "xjb_unique_talent",
                        derivation: "",
                        enable: true,
                        filterTarget: function (card, player, target) {
                            return card.storage.xjb_allowed == true;;
                        },
                        savable: true,
                        selectTarget: 1,
                        modTarget: true,
                        content: function () {
                            'step 0'
                            target.useCard({ name: "jiu" }, target)
                            target.storage.xjb_card_allow = target.storage.xjb_card_allow || {}
                            target.storage.xjb_card_allow['xjb_penglai'] = true
                            target.storage.xjb_unique_talent = target.storage.xjb_unique_talent || []
                            event.num = [1, 2, 3].randomGet()
                            player.$skill(event.num + '', 'legend', 'wood');
                            'step 1'
                            var list = [[]], num = game.roundNumber + event.num
                            list[0] = [num, 'xjb_penglai']
                            target.storage.xjb_unique_talent = [...target.storage.xjb_unique_talent, ...list]
                            'step 2'
                            target.addSkillLog('xjb_penglai')
                            target.update()
                            'step 3'
                            target.getStat().card.jiu = 0
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
                        fullskin: true,
                        image: "ext:新将包/xjb_Infinity.png",
                    }
                    lib.translate.xjb_penglai_info = "出牌阶段及濒死时，对一名角色使用，其：<br>1.使用一张【酒】并将本回合使用过【酒】的次数清零；<br>2.体力值" +
                        "变为无限，持续回合由抽到的数字决定<br>3.失去技能废除及恢复的能力"
                    lib.card.xjb_skill_off_card = {
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
                            target.storage.xjb_unique_talent = target.storage.xjb_unique_talent || []
                            event.num = [1, 2, 3].randomGet()
                            player.$skill(event.num + '', 'legend', 'wood');
                            "step 2"
                            var list = [[]], num = game.roundNumber + event.num
                            list[0] = [num, 'skill_noskill']
                            target.storage.xjb_unique_talent = target.storage.xjb_unique_talent.concat(list)
                            "step 3"
                            target.addSkill("skill_noskill")
                            target.turnOver()
                        },
                        fullskin: true,
                        image: "ext:新将包/xjb_jingu.png"
                    }
                    lib.translate.xjb_skill_off_card_info = "出牌阶段，你对一名角色使用此牌，其翻面，然后其封印所有技能，持续回合由抽取数字决定。"

                    lib.translate.xjb_skill_off_card = "禁锢卡"
                    lib.card.xin_zhihuan = {

                        type: "xjb_unique",
                        subtype: "xjb_unique_reusable",
                        enable: true,
                        selectTarget: 1,
                        modTarget: true,
                        filterTarget: true,
                        modTarget: true,
                        filterTarget: function (card, player, target) {
                            return card.storage.xjb_allowed == true;;
                        },
                        content: function () {
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
                        image: "ext:新将包/xjb_zhihuan.png"
                    }
                    lib.translate.xin_zhihuan_info = "出牌阶段，你对一名角色使用此牌，其弃置至少一张牌，然后你摸等量张牌。<br><b description=[当卡牌点数大于4时，使用牌结算后就不能再次获得此牌]>最大回收点数:4</b>"
                    lib.translate.xin_zhihuan = "置换卡"
                    lib.card.xjb_lingliCheck = {
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
                            var num = xjb_lingli.area["fanchan"]()
                            target.xjb_addlingli(14 - cards[0].number).set("lingliSource", "card")

                        },
                        fullskin: true,
                        image: "ext:新将包/lingli/check.png",
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
                    }
                    lib.translate.xjb_lingliCheck = "灵力支票";
                    lib.translate.xjb_lingliCheck_info = "出牌阶段对一名角色使用，其获得灵力。"
                    lib.card.xjb_shenshapo = {
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
                                nature: "kami"
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
                    }
                    lib.translate.xjb_shenshapo_info = "出牌阶段指定三名角色：1.视为对目标使用一张神杀；<br>2.出牌阶段使用过【杀】的次数清零<br><b description=[当卡牌点数大于1时，使用牌结算后就不能再次获得此牌]>最大回收点数:1点</b>"
                    lib.translate.xjb_shenshapo = "神杀破"
                    lib.card.xjb_skillCard = {
                        audio: "ext:新将包",
                        type: "xjb_unique",
                        subtype: "xjb_unique_talent",
                        enable: true,
                        lianheng: true,
                        logv: false,
                        selectTarget: 1,
                        modTarget: true,
                        filterTarget: function (card, player, target) {
                            return card.storage.xjb_allowed == true;;
                        },
                        cardConstructor: function (id, boolean) {
                            var it = lib.card[id + "_card"] = {
                                enable: function (event, player) {
                                    return false
                                },
                                type: "xjb_unique",
                                subtype: "xjb_unique_talent",
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
                            if (["xin_guimeng_1"].includes(id)) {
                                it.debuff = true
                                it.ai.basic.value = 0
                                it.ai.basic.useful = 0
                            }
                            lib.translate[id + "_card"] = lib.translate[id]
                            lib.translate[id + "_card_info"] = "当你持有或武将牌上存在" + get.translation(id) + "时，你视为拥有技能:【" + get.translation(id) + "】<br><ins><i>" + lib.translate[id + "_info"] + "</i></ins>"

                        },
                        skillLeadIn: function (id, fatherName) {
                            if (!fatherName) fatherName = id
                            var skill = game.xjb_EqualizeSkillObject(id + "_card", lib.skill[id])
                            if (skill.init) skill.init = function (player, skill) { player.storage[skill] = false }
                            if (!skill.filter) {
                                skill.filter = function () { return true }
                            }
                            skill.filter2 = skill.filter
                            skill.filter = function (event, player) {
                                if (player.countCards("hxs", { name: fatherName + "_card" }) < 1) return false;
                                return this.filter2.apply(this, arguments);
                            }
                            if (skill.group) {
                                if (typeof skill.group == "string") {
                                    this.skillLeadIn(skill.group, id)
                                    skill.group = skill.group + "_card"
                                    lib.translate[skill.group + '_card'] = lib.translate[skill.group]
                                }
                                else if (Array.isArray(skill.group)) {
                                    skill.group.forEach((item, index) => {
                                        this.skillLeadIn(item, id)
                                        skill.group[index] = item + "_card"
                                        lib.translate[item + "_card"] = lib.translate[item]

                                    })
                                }
                            }
                            game.addGlobalSkill(id + "_card")
                        },
                        SanSkill: ['xin_zulong',
                            'xjb_xinsheng',
                            'lunaticMasochist',
                            'xjb_sicuan'],
                        content: function () {
                            'step 0'
                            var list = ['输入id', '神圣技能']
                            player.chooseControl(list)
                            'step 1'
                            if (result.control == '输入id') event.goto(2);
                            else if (result.control == '神圣技能') event.goto(3)
                            'step 2'
                            game.pause()
                            game.xjb_create.prompt("请输入技能的id", "", function () {
                                game.resume()
                                var id = this.result;
                                if (Object.keys(lib.skill).contains(id)) {
                                    if (lib.skill[id].mod) {
                                        player.gain(cards)
                                        return game.xjb_create.alert("该技能不在合法技能名录中！")
                                    }
                                    game.xjb_createSkillCard(id, target)
                                } else {
                                    player.gain(cards)
                                    game.xjb_create.alert("未找到该技能！")
                                }
                            }, function () {
                                game.resume()
                                player.gain(cards)
                            })
                            event.finish()
                            'step 3'
                            var list = []
                            for (let i = 0; i < lib.card.xjb_skillCard.SanSkill.length; i++) {
                                lib.card.xjb_skillCard.cardConstructor(lib.card.xjb_skillCard.SanSkill[i], true)
                                list.push(game.createCard(lib.card.xjb_skillCard.SanSkill[i] + '_card'))
                            }
                            player.chooseButton(['选择一张神圣技能牌', list], true)
                            'step 4'
                            if (result.links) {
                                player.gain(result.links[0], "gain2")
                                lib.card.xjb_skillCard.skillLeadIn(result.links[0].name.slice(0, result.links[0].name.lastIndexOf('_card')))
                            }
                        },
                        fullskin: true,
                        image: "ext:新将包/skillCard.png",
                    }
                    lib.translate.xjb_skillCard_info = "出牌阶段，你可使用此牌，然后选择一项:1.输入id，获得一张对应的技能牌;2.获得一张神圣技能牌。"
                },
            },
            "xjb_5":{
                titleSet:function () {
                    for (let i = 0; i < 15; i++) {
                        if (!lib.config.xjb_title[i]) {
                            lib.config.xjb_title[i] = [
                                ``,
                                []
                            ]
                        }
                    }
                    lib.config.xjb_title[0][0] = `<img src=${lib.xjb_src}title/xjb_kill1.png height=50px></img>`
                    lib.config.xjb_title[1][0] = `<img src=${lib.xjb_src}title/xjb_fire.png height=20px></img>`
                    lib.config.xjb_title[2][0] = `<img src=${lib.xjb_src}title/xjb_thunder.png height=20px></img>`
                    lib.config.xjb_title[3][0] = `<img src=${lib.xjb_src}title/xjb_ice.png height=20px></img>`
                    lib.config.xjb_title[4][0] = `<img src=${lib.xjb_src}title/xjb_loseMaxHp.png height=20px></img>`
                    lib.config.xjb_title[5][0] = `<img src=${lib.xjb_src}title/xjb_gainMaxHp.png height=20px></img>`
                    lib.config.xjb_title[6][0] = `<img src=${lib.xjb_src}title/xjb_kill2.png height=40px></img>`
                    lib.config.xjb_title[7][0] = `<img src=${lib.xjb_src}title/xjb_boss1.png height=50px></img>`
                    lib.config.xjb_title[8][0] = `<img src=${lib.xjb_src}title/xjb_yin1.png height=50px></img>`
                    lib.config.xjb_title[9][0] = `<img src=${lib.xjb_src}title/xjb_yin2.png height=60px></img>`
                    lib.config.xjb_title[10][0] = `<img src=${lib.xjb_src}title/xjb_yin3.png height=70px></img>`
                    lib.config.xjb_title[11][0] = `<img src=${lib.xjb_src}title/xjb_yin1.png height=50px></img>`
                    lib.config.xjb_title[12][0] = `<img src=${lib.xjb_src}title/xjb_yin2.png height=60px></img>`
                    lib.config.xjb_title[13][0] = `<img src=${lib.xjb_src}title/xjb_yin3.png height=70px></img>`
                    lib.config.xjb_title[14][0] = `<img src=${lib.xjb_src}title/xjb_damageZero.png height=60px></img>`
                    game.saveConfig('xjb_title', lib.config.xjb_title);
                },
                Func:function () {
                    game.xjb_titleGain = function (player, i) {
                        if (lib.config.xjb_title[i][1].contains(player.name1)) return
                        lib.config.xjb_hunbi += 50
                        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                        game.xjb_create.alert('恭喜' + get.translation(player.name1) + '解锁了' +
                            lib.config.xjb_title[i][0])
                        lib.config.xjb_title[i][1].add(player.name1)
                        game.saveConfig('xjb_title', lib.config.xjb_title);
                        lib.skill.xjb_final.title()
                    }
                },
                titleSkill:function () {
                    //造成伤害
                    lib.skill._damage_jxbhunbi = {
                        trigger: {
                            source: ["damageEnd"],
                        },
                        popup: false,
                        forced: true,
                        superCharlotte: true,
                        charlotte: true,
                        fixed: true,
                        filter: function (event, player) {
                            if (!lib.config.xjb_hun) return false
                            if (!(player == game.me || player.isUnderControl())) return false
                            if (event.num > 1) {
                                if (!lib.config.xjb_count[player.name]) lib.config.xjb_count[player.name] = {}
                                if (!lib.config.xjb_count[player.name].strongDamage) {
                                    lib.config.xjb_count[player.name].strongDamage = 0
                                }
                                lib.config.xjb_count[player.name].strongDamage++
                                game.saveConfig('xjb_count', lib.config.xjb_count);
                                game.log(player, 'strongDamage值为' + lib.config.xjb_count[player.name].strongDamage)
                                lib.config.xjb_hunbi++
                                game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                                game.log('你的魂币+1')
                            }
                            if (!event.nature) return false
                            return true
                        },
                        content: function () {
                            var nature = trigger.nature
                            var i
                            switch (nature) {
                                case 'thunder': i = 2; break;
                                case 'fire': i = 1;; break;
                                case 'ice': i = 3; break;
                            }
                            var name = player.name1;
                            if (!lib.config.xjb_count[name]) game.zeroise_xjbCount(player)
                            if (lib.config.xjb_count[name][nature] == undefined) lib.config.xjb_count[name][nature] = 0
                            if (isNaN(lib.config.xjb_count[name][nature])) lib.config.xjb_count[name][nature] = 0
                            lib.config.xjb_count[name][nature] += trigger.num
                            game.saveConfig('xjb_count', lib.config.xjb_count);
                            game.log(player, nature + '值为' + lib.config.xjb_count[name][nature])
                            if (lib.config.xjb_count[name][nature] >= 100 && !lib.config.xjb_title[i][1].contains(name)) {
                                game.xjb_titleGain(player, i)
                            }
                        }
                    }
                    //
                    lib.skill._skillDamageCount = {
                        trigger: {
                            player: ["damageZero"],
                        },
                        filter: function (event, player) {
                            if (!lib.config.xjb_hun) return false
                            if (!(event.source == game.me)) return false
                            return true
                        },
                        content: function () {
                            for (let i = 1; i < 9; i++) {
                                let theName = trigger.getParent(i).name
                                if (Object.keys(lib.skill).contains(theName)) {
                                    if (!_status.xjb_CharacterCount[theName]) {
                                        _status.xjb_CharacterCount[theName] = 0
                                    }
                                    _status.xjb_CharacterCount[theName]++
                                }
                            }

                        }
                    }
                    //击杀       
                    lib.skill._jisha_jxbhunbi = {
                        trigger: {
                            global: ["dieBefore"],
                        },
                        popup: false,
                        forced: true,
                        superCharlotte: true,
                        charlotte: true,
                        fixed: true,
                        filter: function (event, player) {
                            if (!lib.config.xjb_hun) return false
                            if (!(player == game.me || player.isUnderControl())) return false
                            if (_status.currentPhase != player) return false
                            return true
                        },
                        content: function () {
                            lib.config.xjb_hunbi++
                            game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                            game.log('你的魂币+1')
                            var name = player.name1;
                            if (!lib.config.xjb_count[name]) game.zeroise_xjbCount(player)
                            if (isNaN(lib.config.xjb_count[name].kill)) lib.config.xjb_count[name].kill = 0
                            lib.config.xjb_count[name].kill++
                            game.saveConfig('xjb_count', lib.config.xjb_count);
                            game.log(player, 'kill值为' + lib.config.xjb_count[name].kill)
                            if (lib.config.xjb_count[name].kill >= 100 && !lib.config.xjb_title[0][1].contains(name)) {
                                game.xjb_titleGain(player, 0)
                            }
                            if (lib.config.xjb_count[name].kill >= 250 && !lib.config.xjb_title[0][6].contains(name)) {
                                game.xjb_titleGain(player, 6)
                            }
                            if (trigger.player.name1 === "xjb_Boss_Start" && trigger.player != game.me) {
                                if (!trigger.source) event.finish()
                                if (lib.config.xjb_title[7][1].length < 1) game.xjb_titleGain(player, 7)
                            }
                        }
                    }
                    //体力上限
                    lib.skill._maxHp_jxbhunbi = {
                        trigger: {
                            player: ["loseMaxHpAfter", "gainMaxHpAfter"],
                        },
                        popup: false,
                        forced: true,
                        superCharlotte: true,
                        charlotte: true,
                        fixed: true,
                        filter: function (event, player) {
                            if (!lib.config.xjb_hun) return false
                            if (!(player == game.me || player.isUnderControl())) return false
                            return true
                        },
                        content: function () {
                            var name = player.name1, num = trigger.name === "loseMaxHp" ? 4 : 5
                            if (!lib.config.xjb_count[name]) game.zeroise_xjbCount(player)
                            if (isNaN(lib.config.xjb_count[name][trigger.name])) lib.config.xjb_count[name][trigger.name] = 0
                            lib.config.xjb_count[name][trigger.name] += trigger.num
                            game.saveConfig('xjb_count', lib.config.xjb_count);
                            game.log(player, `${trigger.name}值为${lib.config.xjb_count[name][trigger.name]}`)
                            if (lib.config.xjb_count[name][trigger.name] >= 20 && !lib.config.xjb_title[num][1].contains(name)) {
                                game.xjb_titleGain(player, num)
                            }
                        }
                    }
                },
            },
            "xjb_6":{
                "xjb_storage":function () {
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
                        let target = lib.config.xjb_count[player]&&lib.config.xjb_count[player].xjb_storage
                        if (!target) return;
                        if (Object.keys(target).filter(i => i === 'total').length === 0) return;
                        if (all) return target
                        if (num) return Object.values(target).filter(i => typeof i === 'object')[num - 1]
                    }
                },
                hpcard:function () {
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
                information:function () {
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
                                introduction.innerHTML = this.translation + "：" + this.intro
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
                bianshen:function () {
                    lib.character.xjbBS_machao = ["male", "shu", 4, ['xin_htzjq2', 'mashu'], ["ext:新将包/xjb_machao.jpg", "xjb_machao.jpg", "hidden"], "益", {
                        es: [['xin_baiyin', 'club', 1], ['xin_hutou', 'spade', 11]]
                    }]
                    lib.character.xjbBS_guanyu = ["male", "shu", 4, ['xin_hlyyd'], ["ext:新将包/xjb_guanyu.jpg", "xjb_guanyu.jpg", "hidden"], "破", {
                        es: [['xin_chitu', 'heart', 5], ['xin_qinglong', 'spade', 5]]
                    }]
                    lib.character.xjbBS_jiaxu = ["male", "qun", 3, ['xin_whlw2', 'xin_whlw1'], ["ext:新将包/xjb_jiaxu.jpg", "xjb_jiaxu.jpg", "hidden"], "疾", {
                        hs: [['card_lw', 'red', 13]]
                    }]
                    lib.character.xjbBS_huatuo = ["male", "qun", 3, ['xin_qns'], ["ext:新将包/xjb_huatuo.jpg", "xjb_huatuo.jpg", "hidden"], "愈", {
                        es: [['xin_qinnangshu', 'heart', 7]]
                    }]
                    lib.character.xjbBS_zhugeliang = ["male", "shu", 3, ['kongcheng', "reguanxing"], ["ext:新将包/xjb_zhugeliang.jpg", "xjb_zhugeliang.jpg", "hidden"], undefined, {
                        es: [['xin_qixing', 'diamond', 7]]
                    }]
                    lib.translate.xjbBS_machao = lib.translate.machao
                    lib.translate.xjbBS_huatuo = lib.translate.huatuo
                    lib.translate.xjbBS_zhugeliang = lib.translate.zhugeliang
                    lib.translate.xjbBS_jiaxu = lib.translate.jiaxu
                    lib.translate.xjbBS_guanyu = lib.translate.guanyu
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
                            let trueBody = game.xjb_storeCard_information.xjb_BScharacter
                            if (lib.config.xjb_bianshen !== 1) return false
                            if (!game.xjb_condition(1, trueBody.content.cost)) return false;
                            if (!trueBody.content.ok) return false
                            if (player.countMark('_xin_bianshen') > 0) return false
                            if (lib.config.xjb_systemEnergy < 0) return false
                            return true
                        },
                        content: function () {
                            "step 0"
                            if (!lib.skill._xjb_bianshen.filter(trigger, player)) event.finish()
                            "step 1"
                            let trueBody = game.xjb_storeCard_information.xjb_BScharacter
                            var list = ["xjbBS_machao", "xjbBS_guanyu", "xjbBS_huatuo", "xjbBS_jiaxu", "xjbBS_zhugeliang"]
                            player.chooseButton(['选择一张变身的武将牌，花费魂币:' + trueBody.content.cost, [list, 'character']])
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
                                    hs: get.cards(7),
                                    es: []
                                }
                                if (lib.character[name][6] && lib.character[name][6].es) {
                                    let cards = game.xjb_cardFactory(...lib.character[name][6].es)
                                    object.es.add(...cards)
                                }
                                if (lib.character[name][6] && lib.character[name][6].hs) {
                                    let cards = game.xjb_cardFactory(...lib.character[name][6].hs)
                                    object.hs.add(...cards)
                                }
                                list.push(object)
                                player.xjb_bianshen(...list)
                            }
                        }
                    }
                    lib.translate._xjb_bianshen = "魂将"
                },
                CharacterPack:function () {
                    lib.config.all.characters.push("xjb_soul");
                    lib.characterPack['xjb_soul'] = lib.config.all.characters['xjb_soul']
                    if (!lib.config.characters.contains("xjb_soul")) lib.config.characters.push("xjb_soul");
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
                    const xuemoElse = [`ext:新将包/sink/xjb_xuemo/xuemo${[1,2,3].randomGet()}.jpg`]
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
                            if (!keys.contains(str.slice(13))) {
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
                Sort:function () {
                    let list = {
                        xjb_newCharacter: lib.config.xjb_newcharacter.name2,
                        //
                        xjb_chidan: '赤胆忠心',
                        xjb_fengyun: '风云荟萃',
                        xjb_zaiwu: '天命在吾',
                        xjb_tiandu: '天妒英才',
                        xjb_jincui: '鞠躬尽瘁',
                        xjb_guijin: '三分归晋',
                        xjb_huahao: '花好月圆',
                        //
                        xjb_yangcheng: "养成武将",
                        xjb_hunshi: "魂使集团",
                        xjb_lingsu: "灵力复苏",
                        //
                        xjb_Fuaipaiyi: "芙艾派依",
                        xjb_xuemo: "布劳德",
                        xjb_timer: "泰穆尔",
                        xjb_chanter: "琪盎特儿",
                        xjb_SoulBoss_zhankuang: "战狂魂使",
                        xjb_SoulBoss_xuanfeng: "旋风魂使"
                    }
                    lib.translate = { ...lib.translate, ...list }
                    lib.characterSort["xjb_soul"] = {
                        "xjb_yangcheng": ["xjb_newCharacter"],
                        "xjb_hunshi": Object.keys(lib.characterPack["xjb_soul"]).filter(i => lib.translate[i].indexOf("魂使") >= 0),
                        "xjb_lingsu": ["xjb_chanter", "xjb_Fuaipaiyi", "xjb_xuemo"]
                    }
                    lib.characterSort['mode_extension_新将包'] = {
                        'xjb_fengyun': ["xjb_zhangliang_liuhou", "xjb_yingzheng"],
                        'xjb_chidan': ["xjb_ganning", "xjb_dianwei"],
                        'xjb_tiandu': ["xjb_sunce", "xjb_zhouyu", "xjb_pangtong", "xjb_guojia", "xjb_fazheng"],
                        'xjb_zaiwu': ["xjbhan_caocao", "xjbhan_xunyu", "xjb_caocao"],
                        'xjb_jincui': ["xjb_zhugeliang", "xjb_liushan"],
                        'xjb_guijin': ["xjb_jin_simayi"],
                        'xjb_huahao': ["xjb_daqiao"],
                    }


                },
                group:function () {
                    lib.group.push('han');
                    lib.translate['han'] = '汉';
                    lib.groupnature.han = "fire"
                    lib.group.push("xjb_hun");
                    lib.translate['xjb_hun'] = '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="32">'
                    lib.groupnature.xjb_hun = "xjb_hun"
                },
                Intro:function () {
                    lib.characterIntro.xjb_caocao = "操携樵沛诸夏侯曹氏，同汝颖荀之所进退，奋起于兖州之地。济天子，假天子之威，御天下之士，修政事，广屯田，征伐四方，十战九胜，可抵其锋者，唯孙刘二者。以其功高，自比于周公，置魏国，修行宫，立太子，分香卖履，薄葬于高陵。观其平生所则多杀戮，忿急至于过者亦多也。然其兴兴之政也广及率土三二，亦一世之雄也。";
                    lib.characterIntro.xjb_zhangliang_liuhou = "张良，字子房，祖、父共任韩国五代相，秦灭韩，曾刺始皇帝于博浪沙中，失败后，亡匿下邳。\
曾遇黄石公刁难，忍之，遂得《太公兵法》一部。张良跟从刘邦出谋划策，为平定天下做出了卓越贡献。\
汉高祖在封功臣时，说他：“运筹策帷帐中，决胜千里外。”让他“自择齐三万户”，张良拒绝，独留留地，被封为留侯。\
定都关中后，张良体弱多病，修辟谷道引之术，险些饿死。\
时刘邦宠爱戚夫人，欲立赵王刘如意，吕后担心自己儿子刘盈被废，求计于张良，刘盈最后保住了太子之位。";
                    lib.characterIntro.xjb_yingzheng = "秦始皇，赵氏嬴姓，名政，是我国的第一位皇帝。\
他年少继位，\
奋六世之余烈，振长策而御宇内，吞二周而亡诸侯，履至尊而制六合，执敲扑而鞭笞天下，威震四海。\
";
                },
            },
            "xjb_7":{
                "ui_modify":function () {
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
                ui:function () {
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
                    //这是创建对话框
                    ui.create.xjb_dialogBase = function () {
                        //这个是对话框
                        var div = ui.create.div(".xjb_dialogBase")
                        ui.xjb_giveStyle(div, lib.xjb_style.storage_ul)
                        ui.xjb_giveStyle(div, {
                            opacity: "0.9",
                            padding: "5px",
                            "z-index": "10",
                            position: "absolute",
                            margin: "auto",
                            'right': '0px',
                            'top': '0px',
                            'left': '0px',
                            'bottom': '0px',
                            height: "159.34px",
                            width: "628.65px",
                            "border-radius": "0.5em",
                            border: "5px solid #cb6d51",
                            "font-size": "24px",
                            overflow: "auto"
                        })
                        ui.window.appendChild(div)
                        //这里写幕布
                        var back = ui.create.xjb_curtain()
                        var length = document.createElement("div")
                        ui.xjb_giveStyle(length, {
                            "z-index": "8",
                            float: "left",
                            height: "137.16px",
                            width: "100%",
                            'right': '0px',
                            'top': '0px',
                            'left': '0px',
                            'bottom': '0px',
                            margin: "auto",
                            position: "relative",
                            'marginTop': "calc(32% + 32px)",
                        })
                        back.appendChild(length)
                        var buttons = []
                        for (var i = 0; i < arguments.length; i++) {
                            var button = ui.create.xjb_button(length, arguments[i], [div, back])
                            buttons.push(button)
                        }
                        div.back = back
                        div.buttons = buttons;
                        div.nextAlert = function () {
                            var nextDialog = game.xjb_create.alert(...arguments)
                            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
                            this.next = nextDialog
                            return nextDialog
                        }
                        div.nextConfirm = function () {
                            var nextDialog = game.xjb_create.confirm(...arguments)
                            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
                            this.next = nextDialog
                            return nextDialog
                        }
                        div.nextPrompt = function () {
                            var nextDialog = game.xjb_create.prompt(...arguments)
                            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
                            this.next = nextDialog
                            return nextDialog
                        }
                        div.goOnAlert = function () {
                            var nextDialog = game.xjb_create.alert(...arguments)
                            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
                            this.goon = nextDialog
                            return nextDialog
                        }
                        div.goOnConfirm = function () {
                            var nextDialog = game.xjb_create.confirm(...arguments)
                            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
                            this.goon = nextDialog
                            return nextDialog
                        }
                        div.goOnPrompt = function () {
                            var nextDialog = game.xjb_create.prompt(...arguments)
                            ui.xjb_toBeHidden(nextDialog, nextDialog.back)
                            this.goon = nextDialog
                            return nextDialog
                        }
                        return div
                    }
                    //创建按钮
                    ui.create.xjb_button = function (length, str, remove) {
                        var button = document.createElement("div")
                        button.innerHTML = str
                        length.appendChild(button)
                        ui.xjb_giveStyle(button, {
                            color: "#041322",
                            "text-align": "center",
                            "font-size": "36px",
                            "background-color": "#e4d5b7",
                            "border-radius": "0.5em",
                            position: "relative",
                            margin: "auto",
                            marginLeft: "15px",
                            marginRight: "15px",
                        })
                        if (remove && remove.length) {
                            button.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
                                e.stopPropagation();
                                for (var i = 0; i < remove.length; i++) {
                                    remove[i].remove()
                                    remove[i].remove()
                                }
                            })
                        }
                        return button
                    }
                    //精准给出样式
                    ui.xjb_giveStyle = function (object1, object2) {
                        var list = Object.keys(object2)
                        for (var i = 0; i < list.length; i++) {
                            object1.style[list[i]] = object2[list[i]]
                        }
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
                        function Write(writeText, type) {
                            var wordsGroups = writeText.split("")
                            return new Promise(function (res) {
                                let headline = document.createElement("h4")
                                let writer = document.createElement("h5")
                                book.appendChild(headline)
                                book.appendChild(writer)
                                let body = {
                                    headline: headline,
                                    writer: writer,
                                    content: book
                                }
                                headline.className = "xjbHeadline"
                                writer.className = "xjbWriter"
                                book.cantTouch = true
                                let wonderfulTimer = window.requestAnimationFrame(function xjbWonderfulWriter() {
                                    if (!wordsGroups.length) {
                                        cancelAnimationFrame(xjbWonderfulWriter)
                                        book.cantTouch = false
                                        return res(writeText)
                                    }
                                    var theWord = wordsGroups.shift()
                                    if (theWord === "n") theWord = "<br>"
                                    else if (theWord === "A") {
                                        theWord = "<span class=xjb2levelTitle>" + (wordsGroups.shift()) + "</span>"
                                    }
                                    else if (theWord === "B") {
                                        theWord = "<b>" + (wordsGroups.shift()) + "</b>"
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
                                    body[type].innerHTML = body[type].innerHTML + theWord
                                    let wonderfulTimer = window.requestAnimationFrame(xjbWonderfulWriter)
                                })

                            })
                        }
                        Write(text.headline, "headline").then(function (data) {
                            return Write(text.writer, "writer")
                        }).then(function (data) {
                            return Write(text.content, "content")
                        })
                        book.addEventListener("dblclick", () => book.remove())
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
                        var back = ui.create.div('.interact_back', ui.window)
                        ui.xjb_giveStyle(back, lib.xjb_style.back)
                        game.xjb_back = back//将back设置为game.xjb_back
                        ui.window.appendChild(back);
                        //创建close
                        var close = document.createElement('img');
                        close.style['width'] = '40px'
                        close.setAttribute('src', lib.xjb_src + 'image/xjb_close.png');
                        ui.xjb_giveStyle(close, {
                            float: "left"
                        })
                        close.className = 'close';
                        //点击close关闭back
                        function closeIt() {
                            ui.window.removeChild(back);
                        }
                        close.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', closeIt)
                        close.closeBack = closeIt
                        back.appendChild(close);
                        //
                        if (str) {
                            var foot = document.createElement("div")
                            ui.xjb_giveStyle(foot, lib.xjb_style.foot)
                            foot.innerHTML = "-|" + str + "|-"
                            back.appendChild(foot);
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
                Math:function () {
                    lib._xjb["Math_!"] = function (x) {
                        if (x < 0) return
                        else if (x == 0) return 1
                        return x * this["Math_!"](x - 1)
                    }
                    //兔子数列
                    lib._xjb["Math_f"] = function (n) {
                        if (n < 1) return
                        else if (n <= 2) return 1
                        else {
                            var x = 1, y = 1, z
                            for (var i = 2; i < n; i++) {
                                z = x + y
                                y = x
                                x = z
                            }
                            return x
                        }
                        //递归算法 易于理解简单，但到30~40时就有明显的卡顿
                        /*
                        return this["Math_f"](x-1)+this["Math_f"](x-2)*/
                    }
                    //算π
                    lib._xjb["Math_doPI"] = function (n) {
                        var π = Math.PI, cos = Math.cos
                        if (n >= 6111123) return π.toFixed(10)
                        return (cos((π / 2) - (π / n)) * n).toFixed(10)
                    }
                    //算e
                    lib._xjb["Math_doe"] = function (y) {
                        var x = 1 + (1 / y)
                        if (y > 60028450) return Math.E.toFixed(10)
                        /*x^(1+1/x)*/
                        return (Math.pow(x, y)).toFixed(10)
                    }
                    //算Φ
                    lib._xjb["Math_doΦ"] = function (n) {
                        /*斐波拉契数列前后两项之比随项数增大，越来越趋近黄金分割*/
                        var a = lib._xjb["Math_f"](n)
                        var b = lib._xjb["Math_f"](n + 1)
                        if (n > 25) return 0.6180339887.toFixed(10)
                        return (a / b).toFixed(10)
                    }
                    lib._xjb["Math_2yuan"] = function (a, b, e, c, d, f) {
                        if (a * d == b * c) return "无解"
                        return [(d * e - b * f) / (a * d - b * c), (a * f - c * e) / (a * d - b * c)]
                    }
                    lib._xjb["Math_2Equal"] = function (str1, str2) {
                        var a = str1.getNumberBefore('x'), b = str1.getNumberBefore('y'),
                            e = str1.slice(str1.indexOf('=') + 1)
                        var c = str2.getNumberBefore('x'), d = str2.getNumberBefore('y'),
                            f = str2.slice(str2.indexOf('=') + 1)
                        var num = this["Math_2yuan"](a, b, e, c, d, f)
                        return num
                    }
                    lib._xjb["Math_2Equal1"] = function (str, str2) {
                        var result = str.withTogether(str2, function (str1) {
                            str1 = str1.toLowerCase()
                            if (str1.indexOf("x") < 0) str1 = "0x+" + str1
                            if (str1.indexOf("y") < 0) str1 = "0y+" + str1
                            if (str1.getNumberBefore("x") === "") str1 = str1.replace("x", "1x")
                            if (str1.getNumberBefore("y") === "") str1 = str1.replace("y", "1y")
                            return str1
                        })
                        return this["Math_2Equal"](...result)
                    }
                },
            },
            "xjb_8":{
                leadVitalSkill:function () {                   
                    lib.skill._xjb_TryYourBest = {
                        direct: true,
                        trigger: {
                            global: "gameStart",
                        },
                        filter: function (event, player) {
                            if (!_status.brawl) return false
                            if (!_status.brawl.scene) return false
                            if(player!=game.me) return false
                            if(_status.brawl.scene.name === "xjb_tyb"){
                               _status.xjb_level.Type="Play"
                               return true
                            }
                        },
                        content: function () {
                            "step 0"
                            ["_xjb_cardStore","_xjb_soul_qiling","_xjb_bianshen","_xjb_soul_daomo"].forEach(skill=>{
                               game.removeGlobalSkill(skill)  
                            })               
                            "step 1"                   
                            player.chooseButton([
                            "选择你的关卡吧！",
                            [["教程篇","读档"],"tdnodes"],
                            "教程篇:在这里你将了解一些教程",
                            ],[0,1],true);
                            "step 2"           
                            if(result.links.length===0)event.goto(1)
                            else{
                               let button
                               switch(result.links[0]){
                                  case "教程篇":{
                                     button=[
                                     "你要看看什么教程呢？",
                                     [["灵力"],"tdnodes"]
                                     ];
                                     player.chooseButton(true,button,1);
                                  };break;
                                  case "读档":{
                                     player.xjb_readStorage(true);
                                  };break;                                                                
                               }                               
                            };                     
                            "step 3"       
                            if(result.links){
                               result.links[0]==="灵力"&&game.xjb_bossLoad("Lingli0001",player);                               
                            }
                        }
                    }
                    
                },
                Start:function () {
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
                                },{
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
                                },{
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
                                },{
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
                                },{
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
                level:function () {
                    let LH = lib.xjb_src + lib.config.xjb_newcharacter.selectedSink.slice(8)
                    let LHName = lib.config.xjb_newcharacter.name2 ||''
                    let azureSky = lib.xjb_src + "position/azureSky.jpg"
                    let lake = lib.xjb_src + "position/lake.jpg"
                    class DialogLead{
                        constructor(){
                           Array.from(arguments).forEach(i=>{
                              if(Array.isArray(i)) this.dialogList=i
                              else if(typeof i==="function") this.result=i
                              else if(get.itemtype(i)==="player") this.player=i
                           })
                           if(!this.result) this.result=function(){}
                        }
                        lead(){
                           game.pause()                                           
                           let dialogList=this.dialogList               
                           let dialogU=()=>{
                               if(!dialogList.length){
                                   document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click',dialogU)
                                   game.resume()
                                   this.result(this.player)                                  
                                   return;
                               }
                               let lead=dialogList.shift()
                               let dialog=ui.create.dialog()      
                               dialog.add(lead)                                       
                           }               
                           document.addEventListener(lib.config.touchscreen ? 'touchend' : 'click',dialogU)           
                        }
                    }
                    class Play{
                       dialog = {}
                       constructor(obj) {
                          this.dialog.start = obj.start || []
                          this.dialog.end = obj.end || []
                          this.information = obj.information|| {}
                          this.gameInit = obj.gameInit || function(){}
                          this.leadFn=obj.leadFn||function(){}
                          this.leadList=obj.leadList||[]
                       }
                       init(player){
                          _status.xjb_level = {...this.information}              
                          if(this.dialog.start.length){
                            this.dialog.start.map(play=>{
                              game.xjb_dialog(play)
                              return true
                            })&&               
                            game.xjb_RPGEventAdd(i=>{                                        
                              if(!player.isPhaseUsing)game.phaseLoop(player);                                   
                              game.resume(); 
                              this.gameInit(player);                                                                                                               
                            }) 
                          }
                          else{          
                            if(!player.isPhaseUsing)game.phaseLoop(player);                                       
                            game.resume();         
                            this.gameInit(player);                                                       
                          }                          
                       }                      
                    }                
                    class Content{
                       constructor(){
                          let id,content,player,trigger
                          Array.from(arguments).forEach(i=>{
                              if(typeof i==="string") id=i
                              else if(typeof i==="function") content=i
                              else if(get.itemtype(i)==="player") player=i
                              else if(typeof i==="object") trigger=i
                          })
                          this.id=id;
                          this.player=player
                          this.content=content;
                          lib.skill[id]={}
                          lib.skill[id].content=content
                          lib.skill[id].direct=true
                          lib.skill[id].trigger=trigger
                       }
                       use(){                          
                          this.player.useSkill(this.id)
                          return this                         
                       }                                              
                    }
                    lib.skill.xjb_theLevel = {
                        theLevel: {                            
                            //普通读档
                            "0000": new Play({}),
                            //灵力教程
                            Lingli0001:new Play({
                               information:{
                                        name: "灵力教程",
                                        number: "Lingli0001",
                                        Type: "Play",                                
                               },
                               leadList:[
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
                               leadFn:function(player){
                                   let content=new Content("xjb_ready",player,function(){
                                           "step 0"
                                           player.chooseControl("获得灵力").set("prompt","请点击获得灵力")
                                           "step 1"
                                           player.addMark("_xjb_lingli",10) 
                                           player.update()         
                                           "step 2"
                                           player.chooseControl("获得魔力(无能量)").set("prompt","很棒！现在来试试获取魔力吧！")       
                                           "step 3"                           
                                           player.addMark("_xjb_moli",10) 
                                           player.update()                      
                                           "step 4"               
                                           player.chooseControl("转化").set("prompt","还记得1Ch灵力→1Ch魔力(无能量)总收益等于创造一张卡牌吗，点击试一下吧！")     
                                           "step 5"                                    
                                           player.xjb_molizeLingli()       
                                           "step 6"                
                                           player.chooseControl("继续").set("prompt","记得1Ch魔力(销毁一张牌)→1Ch灵力负收益等于销毁两张牌吗，这就是通过导魔介质实现的！")    
                                           "step 7"                
                                           player.chooseControl("继续").set("prompt","一对导魔介质可以在你和另一名角色间进行1Ch魔力的传导。")
                                           "step 8"
                                           player.chooseControl("继续").set("prompt","灵力高的那一方的魔力会传导至灵力低的那一方，转化成灵力。")
                                           "step 9"
                                           player.chooseControl("导魔").set("prompt","你现在拥有10点灵力，是灵力最多的角色！魔力无论如何都会打在对方身上，来试试吧！")
                                           "step 10"                                          
                                           player.chooseTarget(true,"选择你要导魔的角色").set("filterTarget",lib.filter.notMe)                                          
                                           "step 11"
                                           game.xjb_getDaomo(player,"blood",5)
                                           player.xjb_buildBridge(result.targets[0])
                                           event.target=result.targets[0]
                                           "step 12"
                                           if(event.target.isAlive())event.goto(11)
                                           "step 13"
                                           player.chooseControl("继续").set("prompt","做的漂亮！")
                                           "step 14"
                                           player.chooseControl("继续").set("prompt","相信你已经注意到了，一名角色死亡后，其灵力和魔力会被当前回合角色获得。")
                                           game.players.filter(current=>current!=player).forEach(current=>{
                                              current.addSkill("xjb_P_gathering")
                                              current.xjb_addZhenFa(get.cards(1))
                                           })
                                           "step 15"
                                           player.chooseControl("聚灵区是什么？","阵法是什么？","我已知道这两者了。").set("prompt","哦，不妙！他们进入了聚灵区，而且阵法中多出了一张牌！")
                                           "step 16"
                                           if(result.control==="聚灵区是什么？"){
                                              player.chooseControl("我知道了").set("prompt","在一个环境中，能够容纳的灵力是有限的，超过了这个限度，灵力便一定会转化为魔力。<br>在一般的环境中，最多可以容纳10点灵力，而在聚灵区中，最多可容纳100点灵力！")
                                              event.goto(15)
                                           }else if(result.control==="阵法是什么？"){
                                              player.chooseControl("我知道了").set("prompt","阵法是一个特殊的区域，你可以利用启灵等方法把卡牌置于阵法区，就会获得灵力，获得的灵力是不确定的。")
                                              event.goto(15)
                                           }else{
                                              player.chooseControl("继续").set("prompt","很好！")
                                           }
                                           "step 17"
                                           player.chooseControl("启灵").set("prompt","刚刚提到过启灵，现在就来试试吧！")
                                           "step 18"
                                           player.chooseCard("he",true)
                                           "step 19"
                                           player.xjb_addZhenFa(result.cards)
                                           "step 20"
                                           player.chooseControl("啊？","来吧！").set("prompt","好了，灵力基本教程就结束了，现在开始战斗吧！")
                                           "step 21"
                                           if(result.control==="来吧！"){              
                                              game.xjb_getDaomo(player,"blood",10)                                                                                                                                       
                                           }
                                           player.clearSkills()
                                           player.addSkill("_xjb_soul_daomo")
                                           player.addSkill("_xjb_soul_qiling")
                                      })                                 
                                      content.use()
                               },
                               gameInit:function(player){   
                                   game.showIdentity();
                                   game.players.forEach(i=>{
                                      i.directgain(get.cards(7))                                      
                                   })                                         
                                   new DialogLead(this.leadList,this.leadFn,player).lead()                                           
                               },
                            }),
                            //自我试练                            
                            SELF0001: new Play({
                                start:[
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
                                end:[
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
                                gameInit:function(player){
                                    game.players[1].init(player.name1);
                                    game.players[1].hp = game.players[1].maxHp = game.me.maxHp;
                                    game.players[1].update();                                               
                                },
                                information:{
                                        name: "自我试练<br>1-1两个我？",
                                        number: "SELF0001",
                                        Type: "Play",
                                        next: "SELF0002",                                        
                                },
                            }),
                            SELF0002: new Play({
                                start:[
                                         [
                                            [LH, LHName, "red", "不妙啊……", lake],
                                            [, , "blue", ""],
                                         ]
                                ],
                                information:{
                                    name: "自我试练<br>1-2四重存在",
                                    number: "SELF0002",
                                    Type: "Play",  
                                },
                                gameInit:function(player){                                    
                                                                
                                },
                            }),                                                                                 
                        },
                    }
                },
            },
            "xjb_9":{
                dialog:function () {
                    //能量不足提醒
                    game.xjb_NoEnergy = function () {
                        game.xjb_create.alert("系统能量不足！<br>请支持刘徽-祖冲之项目为系统供能！")
                    }
                    //系统更新提醒
                    game.xjb_systemUpdate = function () {
                        game.xjb_create.alert('魂币系统已更新，重启即生效');
                    }
                    //game.xjb_create开关
                    game.xjb_create.ban = function () {
                        return game.xjb_create.baned = true;
                    }
                    game.xjb_create.allow = function () {
                        return game.xjb_create.baned = false;
                    }
                    //
                    game.xjb_create.condition = function (obj, arr1, arr2) {
                        if (game.xjb_create.baned) return;
                        let dialog = game.xjb_create.alert("<div style=position:relative;overflow:auto;font-size:24px>输入关键词后，敲击回车以进行搜索</div><hr>",)
                        ui.xjb_giveStyle(dialog, {
                            overflow: "",
                            height: "308.4px",
                            top: "-170px"
                        })
                        let textarea = document.createElement("textarea")
                        ui.xjb_giveStyle(textarea, lib.xjb_style.textarea1)
                        dialog.appendChild(textarea)
                        textarea.index = []
                        textarea.onkeydown = function (e) {
                            if (e && e.keyCode === 13) {
                                event.cancelBubble = true;
                                event.preventDefault();
                                event.stopPropagation();
                                this.index.forEach(function (item) {
                                    item.style.display = "block"
                                })
                                if (this.value == "") {
                                } else {
                                    this.index.forEach(function (item) {
                                        if (item.innerHTML.indexOf(textarea.value) < 0) item.style.display = "none"
                                    })
                                }
                            }
                        };
                        let ul = document.createElement("ul")
                        ui.xjb_giveStyle(ul, {
                            overflow: "auto",
                            marginTop: "-5px",
                            "list-style": "none",
                            paddingLeft: "0px",
                            height: "190px"
                        })
                        dialog.appendChild(ul)
                        var list = obj
                        if (list) {
                            for (let i in list) {
                                var li = document.createElement("li")
                                li.innerHTML = li.innerHTML + list[i]
                                ul.appendChild(li)
                                li.style.fontSize = "18px"
                                textarea.index.add(li)
                            }
                        }
                        return dialog
                    }
                    game.xjb_create.chooseAnswer = function (str, choices_result, src) {
                        if (game.xjb_create.baned) return;
                        let choices = Object.keys(choices_result)
                        let Str = "", resultList = []
                        choices.forEach(function (item, index) {
                            let colorList = {
                                1: "#c41e3a",
                                2: "#d99058",
                                3: "#e3ff00",
                                4: "#0066cc",
                                5: "#e75480"
                            }
                            Str += `<hr><span style=color:${colorList[item]}> 选项  ${index + 1} ： ${this[item][0]} </span>`
                            resultList.push(this[item][1])                            
                        }, choices_result)
                        var dialog = ui.create.xjb_dialogBase("确定")
                        ui.xjb_giveStyle(dialog, {
                            overflow: "",
                            height: "258.4px",
                            top: "-120px"
                        })
                        dialog.innerHTML = str + "<br><br>" + Str + "<hr>"
                        Array.from(dialog.getElementsByTagName("span")).forEach(function (item, index) {
                            item.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', resultList[index])
                        })
                        if (src) {
                            dialog.back.style.backgroundImage = `url(${src})`
                            dialog.back.style["background-size"] = "100% 100%"
                            dialog.back.style.opacity = "1"
                        }
                        return dialog
                    }
                    game.xjb_create.alert = function (str, func) {
                        if (game.xjb_create.baned) return;
                        var dialog = ui.create.xjb_dialogBase("确定")
                        dialog.innerHTML = str
                        if (func) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func)
                        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            if (dialog.next) {
                                ui.xjb_toBeVisible(dialog.next, dialog.next.back)
                            }
                        })
                        return dialog
                    }
                    game.xjb_create.confirm = function (str, func1, func2) {
                        if (game.xjb_create.baned) return;
                        var dialog = ui.create.xjb_dialogBase("确定", "取消")
                        dialog.innerHTML = str
                        if (func1) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func1)
                        if (func2) dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func2)
                        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            if (dialog.next) {
                                ui.xjb_toBeVisible(dialog.next, dialog.next.back)
                            }
                        })
                        dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            if (dialog.goon) {
                                ui.xjb_toBeVisible(dialog.goon, dialog.goon.back)
                            }
                        })
                        return dialog
                    }
                    game.xjb_create.prompt = function (str1, str2, func1, func2) {
                        if (game.xjb_create.baned) return;
                        var dialog = ui.create.xjb_dialogBase("确定", "取消")
                        dialog.innerHTML = str1
                        var textarea = document.createElement("textarea")
                        textarea.autofocus = true
                        ui.xjb_giveStyle(textarea, {
                            display: "block",
                            margin: "auto",
                            width: "99%",
                            height: "300%",
                            fontSize: "24px"
                        })
                        if (str2) textarea.value = str2
                        dialog.appendChild(textarea)
                        dialog.input = textarea
                        dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            this.result = textarea.value
                            if (dialog.next) {
                                ui.xjb_toBeVisible(dialog.next, dialog.next.back)
                            }
                        })
                        dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function () {
                            this.result = textarea.value
                            if (dialog.goon) {
                                ui.xjb_toBeVisible(dialog.goon, dialog.goon.back)
                            }
                        })
                        if (func1) dialog.buttons[0].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func1)
                        if (func2) dialog.buttons[1].addEventListener(lib.config.touchscreen ? 'touchend' : 'click', func2)
                        return dialog
                    }
                    game.xjb_create.file = function (str, type, func1, func2) {
                        if (game.xjb_create.baned) return;
                        var dialog = game.xjb_create.prompt(str, "", func1, func2)
                        ui.xjb_giveStyle(dialog, {
                            height: "308.4px",
                            top: "-170px"
                        })
                        ui.xjb_toBeHidden(dialog.buttons[0])
                        var textarea = dialog.input
                        ui.xjb_giveStyle(textarea, {
                            height: "26px"
                        })
                        let file = document.createElement("input")
                        file.type = "file"
                        ui.xjb_giveStyle(file, {
                            display: "block",
                        })
                        dialog.appendChild(file)
                        var obj = {
                            json: function () {
                                var json = document.createElement("div")
                                json.xjb_check = function () {
                                    if (this.xjb_type != ".json") return ui.xjb_toBeHidden(dialog.buttons[0])
                                }
                                return json
                            },
                            img: function () {
                                var img = document.createElement("img")
                                ui.xjb_giveStyle(img, {
                                    width: "var(--xjb-file-width)",
                                    "object-fit": "fill"
                                })
                                return img
                            },
                            video: function () {
                                var video = document.createElement("video")
                                ui.xjb_giveStyle(video, {
                                    width: "var(--xjb-file-width)",
                                    "object-fit": "fill"
                                })
                                video.controls = true
                                video.autoplay = true
                                return video
                            },
                            audio: function () {
                                var audio = document.createElement("audio")
                                ui.xjb_giveStyle(audio, {
                                    width: "var(--xjb-file-width)",
                                    "object-fit": "fill"
                                })
                                audio.controls = true
                                audio.autoplay = true
                                return audio
                            }
                        }
                        var target = obj[type]()
                        dialog.appendChild(target)
                        target.onerror = function () {
                            ui.xjb_toBeHidden(dialog.buttons[0])
                        }
                        file.onchange = function () {
                            ui.xjb_toBeHidden(dialog.buttons[0])
                            var reader = new FileReader()
                            reader.readAsDataURL(this.files[0], "UTF-8")
                            reader.onload = function () {
                                let lastnamefortype = file.value.slice(file.value.lastIndexOf("."))
                                target.src = this.result
                                target.xjb_type = lastnamefortype
                                ui.xjb_toBeVisible(dialog.buttons[0])
                                dialog.buttons[0].file = {
                                    result: this.result,
                                    type: lastnamefortype
                                }
                                dialog.buttons[1].file = {
                                    result: this.result,
                                    type: lastnamefortype
                                }
                                if (target.xjb_check) target.xjb_check()

                            }
                        }
                        return dialog
                    }
                    game.xjb_create.button = function (str1, str2, arr2, func, func2) {
                        if (game.xjb_create.baned) return;
                        var dialog = game.xjb_create.confirm("<p id=xjb_dialog_p>" + str1 + "</p><hr>", func, func2);
                        ui.xjb_toBeHidden(dialog.buttons[0])
                        ui.xjb_giveStyle(dialog, {
                            height: "308.4px",
                            top: "-170px"
                        })
                        for (var i = 0; i < arr2.length; i++) {
                            var img = document.createElement("div")
                            ui.xjb_giveStyle(img, {
                                width: "28.3%",
                                height: "238px",
                                margin: "1.7%",
                                border: "#f0acf7 3px solid ",
                                "background-image": `url(${str2 + arr2[i]})`,
                                "background-size": "100% 100%",
                                "background-repeat": "no-repeat",
                                position: "relative",
                                color: "white",
                                "text-align": "center",
                                "border-radius": "0.5em",
                            })
                            img.name = arr2[i]
                            img.src = str2 + arr2[i]
                            img.innerHTML = img.name
                            dialog.appendChild(img)
                            img.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
                                document.getElementById("xjb_dialog_p").innerHTML = this.name
                                ui.xjb_toBeVisible(dialog.buttons[0])
                                for (var a = 0; a < dialog.imgs.length; a++) {
                                    dialog.imgs[a].className = ""
                                }
                                this.className = "xjb_color_circle"
                                dialog.buttons[0].result = this.name
                                dialog.buttons[0].src = this.src
                            })
                            img.ondblclick = function () {
                                this.remove()
                                ui.xjb_toBeHidden(dialog.buttons[0])
                                if (arr2) {
                                    if (arr2.contains(this.name)) {
                                        arr2.remove(this.name)

                                    }
                                }
                            }
                        }
                        dialog.imgs = dialog.getElementsByTagName("div")
                        return dialog
                    }
                    game.xjb_create.configList = function (list, func) {
                        if (game.xjb_create.baned) return;
                        let dialog = game.xjb_create.alert("<div style=position:relative;overflow:auto;font-size:24px>点击以下项目可进行设置，解锁需要5魂币。输入关键词后，敲击回车或搜索框失去焦点以进行搜索</div><hr>", func)
                        ui.xjb_giveStyle(dialog, {
                            height: "318.4px",
                            top: "-170px",
                            overflow: ""
                        })
                        let textarea = document.createElement("textarea")
                        dialog.appendChild(textarea)
                        ui.xjb_giveStyle(textarea, lib.xjb_style.textarea1)
                        let ul = document.createElement("ul")
                        ui.xjb_giveStyle(ul, {
                            overflow: "auto",
                            marginTop: "-5px",
                            "list-style": "none",
                            paddingLeft: "0px",
                            height: "190px"
                        })
                        textarea.onchange = myFunc
                        textarea.onkeydown = function (e) {
                            if (e && e.keyCode === 13) {
                                event.cancelBubble = true;
                                event.preventDefault();
                                event.stopPropagation();
                                myFunc();
                            }
                        };
                        function myFunc() {
                            textarea.index.forEach(function (item) {
                                item.style.display = "block"
                            })
                            if (textarea.value == "") {

                            } else {
                                textarea.index.forEach(function (item) {
                                    if (item.innerHTML.indexOf(textarea.value) < 0) item.style.display = "none"
                                })
                            }
                        }
                        dialog.appendChild(ul)
                        dialog.buttons[0].isOpened = []
                        dialog.buttons[0].isClosed = []
                        if (list) {
                            for (let i in list) {
                                var li = document.createElement("li")
                                li.innerHTML = li.innerHTML + list[i]
                                ul.appendChild(li)
                                let span = document.createElement("span")
                                span.update = function () {
                                    switch(lib.config[i]){
                                       case undefined:span.innerHTML = '【🔐已锁定】';break;
                                       case 2:{
                                           span.innerHTML = '【🔒已关闭】';
                                           dialog.buttons[0].isOpened.contains(i)&&dialog.buttons[0].isOpened.remove(i)
                                           dialog.buttons[0].isClosed.add(i)
                                       };break;
                                       case 1:{
                                           span.innerHTML = '【🔓已开启】'
                                           dialog.buttons[0].isClosed.contains(i)&&dialog.buttons[0].isClosed.remove(i)
                                           dialog.buttons[0].isOpened.add(i)
                                       };break;
                                    }
                                }
                                span.update()
                                li.appendChild(span)
                                span.style.float = "right"
                                li.mySpan = span
                                li.myName = i
                                li.style.height = "34px"
                                li.style.fontSize = "21px"
                                li.style.width = "97%"
                                li.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function (e) {
                                    if (lib.config[this.myName] === undefined) {
                                        if (game.xjb_condition(1, 5)) {
                                            game.cost_xjb_cost(1, 5)
                                            lib.config[this.myName] = 1

                                        } else {
                                            this.className = "xjb_animation_shake"
                                            setTimeout(() => {
                                                this.className = ""
                                            }, 820)
                                        }
                                    } else if (lib.config[this.myName] === 2) {
                                        lib.config[this.myName] = 1
                                    } else if (lib.config[this.myName] == 1) {
                                        lib.config[this.myName] = 2
                                    }
                                    this.mySpan.update()
                                    game.saveConfig(this.myName, lib.config[this.myName])
                                })
                            }
                            textarea.index = Array.from(ul.children)

                        }
                        return dialog
                    }
                },
                title:function () {
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
                                if (this.value != "") {
                                //遍历索引，则令所有不含该字符的角色消失
                                    this.index.forEach(function (item) {
                                        if (item.innerHTML.indexOf(textarea.value) < 0) item.style.display = "none"
                                    })
                                }
                            }
                        };
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
                            }
                            intro.right.name.innerHTML = "<span data-nature='water'>姓名:" +
                                get.translation(intro.right.player.name1) + "</span>"
                            intro.right.name.onclick = () => {
                                if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.name2()
                            }
                            intro.right.group.innerHTML = "<span data-nature='wood'>势力:" +
                                get.translation(lib.character[intro.right.player.name1][1]) + "</span>"
                            intro.right.group.onclick = () => {
                                if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.group()
                            }
                            intro.right.sex.innerHTML = "<span data-nature='soil'>性别:" +
                                get.xjb_translation(lib.character[intro.right.player.name1][0]) + "</span>"
                            intro.right.sex.onclick = () => {
                                if (intro.right.player.name1 === "xjb_newCharacter") lib.xjb_yangcheng.sex()
                            }
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
                                if (["selectedTitle","HpCard", "uniqueSkill", "titles", "skill", "xjb_storage", "dialog", "book", "daomo", "lingtan", "lingfa"].contains(item))
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
                                width:"80%"
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
                                width:"80%"
                            })
                            intro.right.appendChild(xjb_count_bag)
                            intro.left.I = xjb_count_bag
                            game.xjb_getSb.means(intro.right.character_id).forEach(i => {
                                i.num > 0&&xjb_count_bag.appendChild(i.organize())
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
                storage:function () {
                    /*ui.create.xjb_storage只有一个参数，这个参数是用来设置底部文字的*/
                    ui.create.xjb_storage = function (str) {
                        //创建背景   
                        var list = ui.create.xjb_back(str)
                        var back = list[0] //这是背景
                        var theX = list[1] //这是关闭键
                        //创建存档区
                        var div_1 = document.createElement('div');
                        ui.xjb_giveStyle(div_1, {
                            height: "75%", width: "90%", margin: "4% auto",
                            "border-radius": "1em", overflow: "auto",
                        }
                        )
                        //这个是下方操作区
                        var ul = document.createElement('ul');
                        ui.xjb_giveStyle(ul, {
                            height: "8%", width: "90%", "background-color": "#996600",
                            "margin": "42% 0 0 1.5%", "border-radius": "5em",
                            border: "8px solid #f4a460", "list-style": "none"
                        })
                        back.appendChild(div_1)
                        back.appendChild(ul)
                        //这是三个操作区按键
                        var li_1 = document.createElement('li');
                        ui.xjb_giveStyle(li_1, lib.xjb_style.storage_li)
                        ul.appendChild(li_1)
                        li_1.innerHTML = "创建存档"
                        var li_2 = document.createElement('li');
                        ui.xjb_giveStyle(li_2, lib.xjb_style.storage_li)
                        ul.appendChild(li_2)
                        li_2.innerHTML = "读取存档"
                        var li_3 = document.createElement('li');
                        ui.xjb_giveStyle(li_3, lib.xjb_style.storage_li)
                        ul.appendChild(li_3)
                        li_3.innerHTML = "删除存档"
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
                        //显示存档号
                        var p1 = document.createElement("p")
                        var str = "" + sto_list[0].num
                        while (str.length < 7) str = "0" + str//不足七位用零补齐
                        p1.innerHTML = str
                        sto_list[0].appendChild(p1)
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
手牌区牌数/装备区牌数/判定区牌数/特殊区牌数/武将牌上牌数:${this.map.character.h.length}/${this.map.character.e.length}/${this.map.character.j.length}/${this.map.character&&this.map.character.s&&this.map.character.s.length}/${this.map.character&&this.map.character.x&&this.map.character.x.length},
`)
                        }
                        div.onclick = () => div.update()
                        return {
                            ul: div,
                            theNum: sto_list[0],
                            theCharacter: sto_list[1],
                            theLevel: sto_list[2],
                            theTime: sto_list[3]
                        }
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
                                //填充日期内容部分
                                var myDate = document.createElement("p")
                                myDate.innerHTML = target.date
                                thelist.theTime.appendChild(myDate)
                                //角色部分
                                var myCharacter = document.createElement("p")
                                myCharacter.innerHTML = target.character.name
                                thelist.theCharacter.appendChild(myCharacter)
                                //关卡部分
                                var myLevel = document.createElement("p")
                                myLevel.innerHTML = target.level.name
                                thelist.theLevel.appendChild(myLevel)
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
                            //日期部分
                            var p4 = document.createElement("p"), time = game.xjb_getCurrentDate()
                            var str = `${time[0]}-${time[1]}-${time[2]}-${time[3]}-${time[4]}`
                            obj.date = str
                            p4.innerHTML = obj.date
                            list.theTime.appendChild(p4)
                            //角色部分
                            var p2 = document.createElement("p")
                            p2.innerHTML = obj.character.name
                            list.theCharacter.appendChild(p2)
                            //关卡部分
                            var p3 = document.createElement("p")
                            p3.innerHTML = obj.level.name
                            list.theLevel.appendChild(p3)
                            player.xjb_updateStorage()
                        }
                        //设置操作2键事件
                        storage.li_2.onclick = storage.li_2.read = function () {
                            //获取选中存档
                            var theLoad = document.getElementById('xjb_storage_theStorage')
                            if (theLoad) {
                                //读档                    
                                game.pause()
                                var theObj = theLoad.map
                                game.xjb_bossLoad(theObj.level.number, player)
                                //引入角色
                                var obj = theObj.character
                                if (obj.id !== "") player.reinit(player.name1, obj.id)
                                //设置体力上限
                                player.maxHp = obj.maxHp
                                player.hp = obj.hp
                                //设置护甲
                                player.changeHujia(-player.hujia)
                                player.changeHujia(obj.hujia)
                                //设置横置及翻面
                                player.link(obj.linked)
                                player.turnOver(obj.turnedOver)
                                //失去所有区的手牌
                                player.lose(player.getCards("hejsx"))
                                //手牌区卡牌
                                player.gain(game.xjb_cardFactory(...obj.h))
                                //装备区
                                var e = game.xjb_cardFactory(...obj.e)
                                e.forEach(i => {
                                    player.equip(i)
                                })
                                //判定区
                                var j = game.xjb_cardFactory(...obj.j)
                                j.forEach(i => {
                                    player.addJudge(i)
                                })
                                //特殊区                       
                                var s = game.xjb_cardFactory(...obj.s)
                                s.forEach(i => {
                                    player.loseToSpecial([i], i.gaintag[0])
                                })
                                //扩展
                                var x = game.xjb_cardFactory(...obj.x)
                                x.forEach(i => {
                                    player.addToExpansion(i).gaintag.add(i.gaintag[0])
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
                math:function () {
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
                                            game.xjb_systemEnergyChange(number * 2)
                                            game.cost_xjb_cost(1, number)
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
                Dialog:function () {
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
                        lib.skill.xjb_9.Dialog()
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
                        if (!ui.xjb.RPG.funcList){
                           ui.xjb.RPG.funcList = [];
                           return
                        } 
                        let next = ui.xjb.RPG.funcList.shift()
                        if (typeof next === "function") next()
                        return game
                    }
                    game.xjb_RPGEventAdd = function(func){
                        if (!ui.xjb.RPG.funcList)ui.xjb.RPG.funcList = [];
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
            },
            "xjb_final":{
                import:function () {
                    lib.init.css(lib.xjb_src + "css", "css1", () => game.print("样式表引入成功——新将包"))
                    lib.init.js(lib.xjb_src + "js", "library", () => game.print("图书馆资料引入成功——新将包"), () => game.print("图书馆资料引入失败——新将包"))
                    lib.init.js(lib.xjb_src + "js", "editor", () =>{                       lib.xjb_translate={...window.xjb_editor}
                        for (let i = 0; i < 100; i++) {
                lib.xjb_translate["步骤" + i ] = '"step ' + i + '"'
                lib.xjb_translate["步骤" + get.cnNumber(i) ] = '"step ' + i + '"'
                lib.xjb_translate["第" + i + "步"] = '"step ' + i + '"'
                lib.xjb_translate["第" + get.cnNumber(i) + "步"] = '"step ' + i + '"'
                lib.xjb_translate[i + "张"] = '' + i
                lib.xjb_translate[get.cnNumber(i) + "张"] = '' + i
                lib.xjb_translate[i + "名"] = '' + i
                lib.xjb_translate[get.cnNumber(i) + "名"] = '' + i
                lib.xjb_translate[i + "点"] = '' + i
                lib.xjb_translate[get.cnNumber(i) + "点"] = '' + i                
                        }
                        Object.keys(lib.card).forEach(i => {
                            if (lib.translate[i]) {
                            lib.xjb_translate[lib.translate[i]] = '"' + i + '"'
                    lib.xjb_translate['成为' + lib.translate[i] + '目标'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为' + lib.translate[i] + '的目标'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为' + lib.translate[i] + '的目标时'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为' + lib.translate[i] + '目标时'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为' + lib.translate[i] + '的目标后'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为' + lib.translate[i] + '目标后'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为【' + lib.translate[i] + '】目标'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为【' + lib.translate[i] + '】的目标'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为【' + lib.translate[i] + '】的目标时'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为【' + lib.translate[i] + '】目标时'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为【' + lib.translate[i] + '】的目标后'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['成为【' + lib.translate[i] + '】目标后'] = 'target:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['使用' + lib.translate[i] + '指定目标后'] = 'player:' + i + ':' +
                        'useCardToPlayered'
                    lib.xjb_translate['使用【' + lib.translate[i] + '】指定目标后'] = 'player:' + i + ':' +
                        'useCardToTarget'
                    lib.xjb_translate['使用' + lib.translate[i] + '指定目标'] = 'player:' + i + ':' +
                        'useCardToPlayered'
                    lib.xjb_translate['使用【' + lib.translate[i] + '】指定目标'] = 'player:' + i + ':' +
                        'useCardToTarget'   
                    }
                    
                           lib.xjb_class.cardName.push('"' + i + '"')
                        })            
                        game.print("技能编辑器数据引入成功——新将包")
                    }, () => game.print("技能编辑器数据引入失败——新将包"))                    
                    if (lib.xjb_yangcheng1) {
                        lib.xjb_yangcheng = lib.xjb_yangcheng1.onclick("other");
                        delete lib.xjb_yangcheng1
                    }
                },
                "boss_judge":function () {
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
                                    '旋风魂使': [current=>true, function (current) {
                                        player.node.avatar.classList.add('xjb_tranEndless');
                                        player.node.avatar.style = '--xjbTimeLong:0.5s'                                        
                                    }],
                                }
                                list[lib.translate[player.name1]][1](player)
                                player.xjb_addSkillCard("xin_ziruo")
                                player.xjb_addSkillCard("xjb_lingpiao")                                
                                game.countPlayer(function (current) {
                                    if(current != player){
                                        list[lib.translate[player.name1]][0](current)&&current.showCharacter(2)                                                  
                                        if (current.maxHp > 5) current.maxHp = 1
                                    }                                    
                                })
                                game.removeGlobalSkill("_xjb_cardStore")
                                let inform = function () {
                                    let judgeOk = _status.paused, extraStr = list[lib.translate[player.name1]][2] || ''
                                    game.pause()
                                    game.xjb_create.alert("魂使发动了能力！<br>\
            ①场上超过其体力上限的角色体力均压制至1；<br>\
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
                guozhan:function () {
                    if (get.mode() === "guozhan") {
                        lib.characterPack.mode_guozhan["xjb_fazheng"] = lib.character["xjb_fazheng"]
                        lib.characterPack.mode_guozhan["xjb_daqiao"] = lib.character["xjb_daqiao"]
                        lib.characterPack.mode_guozhan["xjb_zhangliang_liuhou"] = lib.character["xjb_zhangliang_liuhou"]
                        if (lib.config.xjb_newCharacter_addGuoZhan == 1 && lib.config.xjb_yangcheng == 1 && lib.config.xjb_hun) {
                            lib.characterPack.mode_guozhan["xjb_newCharacter"] = lib.character["xjb_newCharacter"]
                        }
                    }
                },
                "xjb_count":function () {
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
                        if (1) {
                            let target = lib.config.xjb_count[i].daomo
                            if (!target.xuemo) target.xuemo = {...get.xjb_daomoInformation("xuemo"),number:0}                                
                            if (!target.tear) target.tear ={...get.xjb_daomoInformation("tear"),number:0}
                            if (!target.taoyao) target.taoyao = {...get.xjb_daomoInformation("taoyao"),number:0}
                            if (!target.dragon) target.dragon = {...get.xjb_daomoInformation("dragon"),number:0}
                            if (!target.sun) target.sun = {...get.xjb_daomoInformation("sun"),number:0}
                            if (!target.blood) target.blood = {...get.xjb_daomoInformation("blood"),number:0}
                        }
                        lib.config.xjb_count[i].titles = [];
                        lib.config.xjb_count[i].lingtan = [];
                        lib.config.xjb_count[i].lingfa = [];
                        lib.config.xjb_count[i].kind = "人类"
                    }
                    game.saveConfig('xjb_count', lib.config.xjb_count);
                },
                lingli:function () {
                    //
                    lib.config.xjb_count["xjb_chanter"].lingfa = ["xjb_soul_lingdun"];
                    lib.config.xjb_count["xjb_Fuaipaiyi"].lingfa =["xjb_soul_lingqiang"];                     
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
                title:function () {
                    if (lib.config.xjb_hun) {
                        Object.keys(lib.config.xjb_count).forEach(function (item, index) {
                            if (this[item]) {
                                if (!lib.config.xjb_count[item].titles) lib.config.xjb_count[item].titles = []
                                lib.config.xjb_count[item].titles.add(this[item])
                            }
                        }, lib.characterTitle)
                        lib.config.xjb_title.forEach(function (item, index) {
                            if (!item[1]) return
                            item[1].forEach(function (ite, ind) {
                                if (this[ite].titles) this[ite].titles.add(item[0])
                            }, lib.config.xjb_count)
                        })
                        Object.keys(lib.config.xjb_count).forEach(function (item) {
                            if (this[item].selectedTitle) lib.characterTitle[item] = '<a class=xjb_hunTitle href=#xjb_player' + item + ' onclick="location.hash=this.href">' + this[item].selectedTitle + '</a>'
                            else {
                                if (this[item].titles && this[item].titles.length) {
                                    this[item].selectedTitle = this[item].titles[0]
                                    lib.characterTitle[item] = '<a class=xjb_hunTitle href=#xjb_player' + item + ' onclick="location.hash=this.href">' + this[item].selectedTitle + '</a>'
                                } else {
                                    lib.characterTitle[item] = '<a data-nature=xjb_hun href=#xjb_titlesCondition onclick="location.hash=this.href">获得称号方式</a>'
                                }
                            }
                        }, lib.config.xjb_count)
                    }
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
                        this[index] = item[0] + "<br>" + condition[index]
                    }, lib.xjb_title_condition)
                    game.xjb_Intro2()
                    game.xjb_Introduction.style.display = "none"                                                       
                    /*不知道为何document无作用，但用window却行*/
                    window.addEventListener('hashchange', function () {
                        //判断锚点是否为所要的
                        if (location.hash === '#xjb_titlesCondition') {
                            let target = game.xjb_create.condition(lib.xjb_title_condition)                
                            target.buttons[0].parentNode.parentNode.remove()
                            document.addEventListener(lib.config.touchscreen ? 'touchend' : 'click', function removeIt(e) {
                                if (e.target !== target && !Array.from(target.getElementsByTagName("*")).contains(e.target)) {
                                    target.remove()
                                    location.hash = '#'
                                    document.removeEventListener(lib.config.touchscreen ? 'touchend' : 'click', removeIt)
                                }
                            })
                        } else if (location.hash.indexOf('xjb_player') > -1) {
                            let playerName = location.hash.replace('#xjb_player', '')
                            let intro = game.xjb_Intro2(playerName)
                            //模拟点击事件
                            intro.right.titleSet.click();
                            //模拟触摸事件
                            intro.right.titleSet.dispatchEvent(new TouchEvent("touchend", {
                                bubbles: true,
                                cancelable: true,
                                composed: true
                            }))
                            location.hash = '#'
                        }
                    })
                    //                                                           
                },
                skillTag:function () {
                    for (let i in lib.config.xjb_skillTag_Skill) {
                        lib.skilllist.forEach(function (item, index) {
                            if (this[item] && this[item][i]) this[item][i] = undefined
                        }, lib.skill)
                        lib.config.xjb_skillTag_Skill[i].forEach(function (item) {
                            if (lib.skill[item]) {
                                lib.skill[item][i] = true
                                if (lib.translate[item + "_info"].indexOf(get.translation(i)) < 0) {
                                    lib.translate[item + "_info"] = get.translation(i) + "，" + lib.translate[item + "_info"]
                                }
                            }
                        })
                    }
                    ["xin_xiongli", "xin_yingfa", "xin_taoni"].forEach(function (item) {
                        if (this[item]) this[item].qzj = true
                        if (lib.translate[item + "_info"].indexOf(get.translation("qzj")) < 0) lib.translate[item + "_info"] = get.translation("qzj") + "，" + lib.translate[item + "_info"]
                    }, lib.skill)
                },
                choujiang:function () {
                    if (!lib.config.xjb_hun) return
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
                            "120魂币大礼包": "6*100",
                            "71魂币中礼包": "18*100",
                            "35魂币小礼包": "20*100",
                            "12魂币谢谢惠顾": "23*100",
                            "7魂币欢迎光临": "33*100",
                        },
                        "3": {
                            "30魂币中礼包": "5*100",
                            "体力卡(1张，3点)": "5*100",
                            "体力卡(1张，1点)": "22*100",
                            "打卡点数+1": "30*100",
                            "3魂币欢迎光临": "15*100",
                            "1魂币作者赐予": "15*100",
                            "0魂币谢谢参与": "8*100",
                        },
                        "4": {
                            "技能槽(1个)": "1*100",
                            "技能(1个)": "4*100"
                        }
                    }

                    for (var k in lib.character) {
                        Array = Array.concat(lib.character[k][3])
                    }
                    var list = [Array.randomGet(), Array.randomGet(), Array.randomGet(), Array.randomGet(), Array.randomGet()]
                    for (var i = 0; i < list.length; i++) {
                        lib.config.xjb_list_hunbilist.choujiang["4"][list[i]] = "19*100"
                    }
                    game.xjb_update_choujiang('1')
                    game.xjb_update_choujiang('2')
                    game.xjb_jiangchi_zeroise()
                    game.xjb_jiangchiUpDate()
                },
                daka:function () {
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
                            game.xjb_systemEnergyChange(100)
                        }
                    }
                },
            },
            "xjb_10":{
                win:function () {
                    if (true) {
                        let list = [
                            ["_zhu", "主公"],
                            ["_zhong", "忠臣"],
                            ["_nei", "内奸"],
                            ["_fan", "反贼"],
                            ["_landlord", "地主"],
                            ["_farmer", "农民"],
                            ["1", "身份场"],
                            ["2", "斗地主场"],
                            ["3", "国战场"]]
                        list.forEach(i => {
                            lib.xjb_list_xinyuan.translate["winRate" + i[0]] = i[1] + "胜率"
                            lib.xjb_list_xinyuan.translate["playedTimes" + i[0]] = i[1] + "场次"
                            lib.xjb_list_xinyuan.translate["win" + i[0]] = i[1] + "胜场"
                        })
                    }
                    game.xjb_win = function (player, num, bool) {
                        let name = bool?player.name1 : player.name2
                        let count = lib.config.xjb_count[name]
                        if (!count) return true
                        if (!count["win" + num]) count["win" + num] = 0
                        count["win" + num]++
                        //
                        Object.keys(_status.xjb_CharacterCount).forEach(function (item) {
                            if (this[item] >= 5) {
                                game.xjb_titleGain(player, 14)
                            }
                        }, _status.xjb_CharacterCount)
                        //江东铁壁称号判定
                        if (["shen_ganning", "re_xusheng"].contains(name)) {
                            if (num == 1) {
                                if (count["win" + num] >= 25 && !lib.config.xjb_title[8][1].contains(name)) {
                                    game.xjb_titleGain(player, 8)
                                }
                                if (count["win" + num] >= 100 && !lib.config.xjb_title[9][1].contains(name)) {
                                    game.xjb_titleGain(player, 9)
                                }
                                if (count["win" + num] >= 250 && !lib.config.xjb_title[9][1].contains(name)) {
                                    game.xjb_titleGain(player, 10)
                                }
                            }
                            if (num === 2) {
                                if (count["win" + num] >= 25 && !lib.config.xjb_title[8][1].contains(name)) {
                                    game.xjb_titleGain(player, 11)
                                }
                                if (count["win" + num] >= 100 && !lib.config.xjb_title[9][1].contains(name)) {
                                    game.xjb_titleGain(player, 12)
                                }
                                if (count["win" + num] >= 250 && !lib.config.xjb_title[9][1].contains(name)) {
                                    game.xjb_titleGain(player, 13)
                                }
                            }
                        }
                        //
                        if (num == 1) {
                            if (["zhu", "zhong", "nei", "fan"].contains(player.identity)) {
                                if (!count["win_" + player.identity]) count["win_" + player.identity] = 0
                                count["win_" + player.identity]++
                            }
                        }
                        if (num === 2) {
                            let iden = player.identity == "zhu" ? "landlord" : "farmer"
                            if (!count["win_" + iden]) count["win_" + iden] = 0
                            count["win_" + iden]++
                        }
                        game.xjb_played_timesUp(player, num, bool)
                        return true
                    }
                    game.xjb_played_timesUp = function (player, num, bool) {
                        let name = player.name1
                        if (bool) name = player.name2
                        let count = lib.config.xjb_count[name]
                        if (!count) return
                        if (!count["playedTimes" + num])count["playedTimes" + num] = 0     
                        count["playedTimes" + num]++
                        if (count["win" + num]>count["playedTimes" + num]) count["playedTimes" + num] = count["win" + num]                                                                                                             
                        if (true) {
                            count["winRate" + num] =
                                ((count["win" + num] * 100) / count["playedTimes" + num]).toFixed(2) + "%"
                        }
                        if (num == 1) {
                            if (["zhu", "zhong", "nei", "fan"].contains(player.identity)) {
                                if (!count["playedTimes_" + player.identity]) count["playedTimes_" + player.identity] = 0                                                                
                                count["playedTimes_" + player.identity]++
                                if(count["playedTimes_" + player.identity] > count["win_" + player.identity]) count["playedTimes_" + player.identity] = count["win_" + player.identity]
                                count["winRate_" + player.identity] =
                                    ((count["win_" + player.identity] * 100) / count["playedTimes_" + player.identity]).toFixed(2) + "%"
                            }
                        }
                        if (num === 2) {
                            let iden = player.identity == "zhu" ? "landlord" : "farmer"
                            if (!count["playedTimes_" + iden]) count["playedTimes_" + iden] = 0    
                            count["playedTimes_" + iden]++                                                           
                            if(count["playedTimes_" + iden] > count["win_" + iden])count["playedTimes_" + iden] = count["win_" + iden]
                            count["winRate_" + iden] =
                                ((count["win_" + iden] * 100) / count["playedTimes_" + iden]).toFixed(2) + "%"
                        }
                        game.saveConfig("xjb_count", lib.config.xjb_count)
                    }
                    game.xjb_createWinObserver = function (player, num) {
                        return function wonderfulFrame() {
                            if(!ui.dialog||!ui.dialog.content||!ui.dialog.content.firstChild) return
                            let judge=ui.dialog.content.firstChild.innerHTML
                            judge === "战斗胜利"&&game.xjb_win(player, num)&&game.xjb_win(player, num, true);    
                            (judge === "战斗失败"||judge==="战斗结束")&&game.xjb_played_timesUp(player, num)&&game.xjb_played_timesUp(player, num, true)                                                                                                                      
                            cancelAnimationFrame(wonderfulFrame)
                        }
                    }
                },
                guozhan:function () {
                    if (get.mode() != "guozhan") return
                    lib.element.player.xjb_dieAfter = lib.element.player.dieAfter
                    lib.element.player.dieAfter = function () {
                        lib.element.player.xjb_dieAfter.apply(this, arguments)
                        window.requestAnimationFrame(game.xjb_createWinObserver(game.me, 3));
                    }
                },
                doudizhu:function () {
                    if (get.mode() != "doudizhu") return
                    lib.element.player.xjb_dieAfter = lib.element.player.dieAfter
                    lib.element.player.dieAfter = function () {
                        lib.element.player.xjb_dieAfter.apply(this, arguments)
                        window.requestAnimationFrame(game.xjb_createWinObserver(game.me, 2));
                    }
                },
                identity:function () {
                    if (get.mode() != "identity") return
                    lib.element.player.xjb_dieAfter = lib.element.player.dieAfter
                    lib.element.player.dieAfter = function () {
                        lib.element.player.xjb_dieAfter.apply(this, arguments)
                        window.requestAnimationFrame(game.xjb_createWinObserver(game.me, 1));
                    }
                },
            },
            "xjb_11":{
                saturation:function(){
                    //空气
                    lib.skill._xjb_P_air={
                       trigger:{
                          global:["phaseBegin","phaseEnd"]
                       },
                       filter:function(event,player){
                          return player.storage.lingliPosition === "air"&&Math.random()>=Math.random()
                       },
                       direct:true,
                       content:function(){
                          player.xjb_molizeLingli()
                       }
                    }                 
                    //血色空间   
                    lib.skill.xjb_P_blood={
                       init:function(player){
                          player.storage.lingliPosition = "blood"
                          player.xjb_updateLingli()    
                       },
                       onremove:function(player){
                          player.storage.lingliPosition = "air"
                          player.xjb_updateLingli()  
                       },
                       trigger:{
                          player:['phaseBegin','phaseEnd']
                       },
                       filter:function(event,player){
                          return player.storage.lingliPosition === "blood"
                       },
                       direct:true,
                       content:function(){
                          switch(event.triggername){
                             case 'phaseBegin':{
                                ui.xjb_giveStyle(ui.background,{
                                   'background-image':"url('"+lib.xjb_src+"position/redSpace.jpg')"
                                })
                                player.addTempSkill("xin_guimeng_1")
                             };break;           
                             case 'phaseEnd':{
                                ui.xjb_giveStyle(ui.background,{
                                   'background-image':game.xjb_PreBackImage
                                })                                
                             };break;                                         
                          }                          
                       }
                    }
                    //聚灵区
                    lib.skill.xjb_P_gathering={
                       init:function(player){
                          player.storage.lingliPosition = "gathering"
                          player.xjb_updateLingli()                
                          player.node.xjb_gathering=ui.create.div(".xjb_gathering",player)                          
                       },
                       onremove:function(player){
                          player.storage.lingliPosition = "air"
                          player.xjb_updateLingli()  
                          if(player.node.xjb_gathering){
                              player.node.xjb_gathering.remove();
                              player.node.xjb_gathering=undefined;
                          }
                       },
                       trigger:{
                          player:['damageBegin']
                       },
                       filter:function(event,player){
                          return player.storage.lingliPosition === "gathering"&&player.countMark("_xjb_moli")>=(2*event.num)&&event.getParent().name!=="xjb_lingHit"
                       },
                       direct:true,
                       content:function(){
                          "step 0"
                          event.num=trigger.num
                          "step 1"
                          switch(event.triggername){
                             case 'damageBegin':{
                                trigger.cancel()
                                let next = game.createEvent('xjb_lingHit');
                                next.player = trigger.source;
                                next.target = trigger.player;
                                next.nature = trigger.nature;
                                next.setContent(function () {
                                    target.xjb_addlingli()
                                    target.damage(player,event.nature)        
                                    target.xjb_eventLine(1) 
                                    target.xjb_eventLine(1)                            
                                })
                             };break;                                                                             
                          }  
                          event.num--                      
                          "step 2"  
                          if(event.num>0)event.goto(1)
                       }
                    }
                },
                count:function () {
                    game.xjb_haveDaomo = game.xjb_hasDaomo = function (name) {
                        if (typeof name != 'string') name = name.name
                        var list = []
                        if (!lib.config.xjb_count[name]) return false;
                        let dataSource = lib.config.xjb_count[name].daomo
                        if (typeof dataSource != "object") return false
                        list = Object.keys(dataSource).filter(i => {
                            return dataSource[i].number > 0
                        })
                        return list.length > 0;
                    }
                    game.xjb_getDaomo = game.xjb_addDaomo = function (player, type, add=1) {
                        if (typeof player != 'string') player = player.name
                        if(!lib.config.xjb_count[player]) return;
                        if(!lib.config.xjb_count[player].daomo) lib.config.xjb_count[player].daomo={}
                        if(!lib.config.xjb_count[player].daomo[type]) lib.config.xjb_count[player].daomo[type]=get.xjb_daomoInformation(type)             
                        if(!lib.config.xjb_count[player].daomo[type].number) lib.config.xjb_count[player].daomo[type].number=0        
                        lib.config.xjb_count[player].daomo[type].number += add
                        game.saveConfig("xjb_count", lib.config.xjb_count)
                    }
                    get.xjb_daomoInformation = function(type){
                        let list={
                           blood:{
                             translation: "杜鹃",
                             intro: "失去体力导魔介质"
                           },
                           sun:{
                             translation: "金乌",
                             intro: "火属性导魔介质"
                           },
                           dragon:{
                             translation: "龙女",
                             intro: "雷属性导魔介质"
                           },
                           taoyao:{
                             translation: "桃妖",
                             intro: "恢复体力导魔介质"
                           },
                           tear:{
                              translation: "雪女",
                              intro: "冰属性导魔介质"
                           },
                           xuemo:{
                              translation: "血魔",                              
                              intro: "体力牌导魔介质"
                           },
                           flower:{
                              translation: "百花",                              
                              intro: "花属性导魔介质"
                           }
                        }
                        if(list[type]) return {...list[type]}
                        return {
                          translation:"",
                          intro:""
                        }
                    }
                },
                transform:function () {
                    lib.skill.xin_guimeng = {
                        subSkill: {
                            "1": {
                                trigger: {
                                    player: "useCard",
                                },
                                filter: function (event, player) {
                                    let info = lib.card[event.card.name]
                                    if (info.notarget||info.contentBefore||info.contentAfter) return false;
                                    return info.content;
                                },
                                direct: true,
                                content: function () {
                                    player.removeSkill("xin_guimeng_2")
                                    let info = lib.skill["xin_guimeng_2"]
                                    info.trigger.player = trigger.card.name + "Before"
                                    player.addTempSkill("xin_guimeng_2", { player: "xin_guimeng_2After" })
                                },
                                sub: true,
                            },
                            "2": {
                                trigger: {
                                    player: "taoBefore",
                                },
                                direct: true,
                                card: ["sha", "juedou", "wuzhong", "guohe", "huogong", "tao"],
                                content: function () {
                                    let card = [...lib.skill["xin_guimeng_2"].card]
                                    card.remove(trigger.name)
                                    let cardname = card.randomGet()
                                    trigger.content = lib.init.parsex(lib.card[cardname].content);
                                    game.log(trigger.card, "因混乱变为" + get.translation(cardname));
                                },
                                sub: true,
                            },
                        },
                    }
                    lib.translate.xin_guimeng = "血梦"
                    lib.translate.xin_guimeng_info = "你使用牌时，该牌效果变为【杀】【桃】【决斗】【火攻】【过河拆桥】【无中生有】中的一种"
                    lib.skill.xjb_soul_lingqiang = {
                        enable: "phaseUse",
                        filter: function (event, player) {
                            return player.countMark("_xjb_moli") > 0
                        },
                        filterTarget: function (card, player, current) {
                            player.xjb_updateCoordinate()
                            var num1 = current.coordinate[0], num2 = current.coordinate[1]
                            return player != current && num1 * num1 + num2 * num2 < 10000;
                        },
                        position: "he",
                        filterCard: true,
                        content: function () {
                            "step 0"
                            player.removeMark("_xjb_moli")
                            target.coordinate = undefined
                            game.playAudio().src = lib.xjb_src + "audio/fire1.mp3"
                            let next = game.createEvent('xjb_lingHit');
                            next.player = player;
                            next.target = target
                            next.setContent(function () {
                                target.popup("命中！")
                                target.xjb_addlingli();
                                target.xjb_eventLine(2);
                            })
                        },
                        ai: {
                            basic: {
                                order: 9,
                            },
                            result: {
                                target: function (player, target) {
                                    return -1
                                },
                            },
                        },
                    }
                    lib.translate.xjb_soul_lingqiang = "灵枪"
                    lib.translate.xjb_soul_lingqiang_info = "出牌阶段，你可以销毁一张牌，然后将产生的1Ch魔力(1C)发射之。"
                    lib.skill.xjb_soul_lingdun = {
                        trigger: {
                            global: "xjb_lingHitBegin"
                        },
                        filter: function (event, player) {
                            if (player.countMark("_xjb_lingli") <= 0) return;
                            return event.target == player;
                        },
                        content: function () {
                            trigger.cancel()
                            player.xjb_loselingli();
                        }
                    }
                    lib.translate.xjb_soul_lingdun = "灵盾"
                    lib.translate.xjb_soul_lingdun_info = "当魔力通过袭来时，你可用灵力和其对撞。"                   
                },
                moliSkill:function () {
                    lib.skill._xjb_soul_lingfa = {
                        enable: "phaseUse",
                        usable: 2,
                        filter: function (event, player) {
                            if (player.countMark("_xjb_lingli") < 1) return;
                            let list = []
                            if (!lib.config.xjb_count[player.name1]) return;
                            if (lib.config.xjb_count[player.name1].lingfa) lib.config.xjb_count[player.name1].lingfa.forEach(function (i) {
                                if (!lib.skill[i]) return
                                if (player.countCards("x", i + "_card") > 0) return;
                                lib.card.xjb_skillCard.cardConstructor(i);
                                lib.card.xjb_skillCard.skillLeadIn(i);
                                list.push(["灵法", "", i])
                            })
                            return list.length > 0;
                        },
                        content: function () {
                            "step 0"
                            let list = []
                            if (lib.config.xjb_count[player.name1].lingfa) lib.config.xjb_count[player.name1].lingfa.forEach(function (i) {
                                if (!lib.skill[i]) return
                                if (player.countCards("x", i + "_card") > 0) return
                                lib.card.xjb_skillCard.cardConstructor(i);
                                lib.card.xjb_skillCard.skillLeadIn(i);
                                list.push(["灵法", "", i])
                            })
                            if (list.length) {
                                let dialog = ui.create.dialog("灵力自用转化牌", [list, "vcard"])
                                player.chooseButton(dialog)
                            }
                            "step 1"
                            if (result.bool) player.xjb_molizeLingli(1, player, result.links[0][2])
                        },
                        ai: {
                            basic: {
                                order: 9,
                            },
                            result: {
                                player: 1,
                            },
                        },
                    }
                    lib.translate._xjb_soul_lingfa = "<span data-nature=xjb_hun><font color=white>灵法</font></span>"
                    lib.skill._xjb_soul_lingtan = {
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            if (player.countMark("_xjb_lingli") < 1) return false
                            let list = []
                            if (!lib.config.xjb_count[player.name1]) return
                            if (lib.config.xjb_count[player.name1].lingtan) lib.config.xjb_count[player.name1].lingtan.forEach(function (i) {
                                if (!lib.skill[i]) return
                                lib.card.xjb_skillCard.cardConstructor(i);
                                lib.card.xjb_skillCard.skillLeadIn(i);
                                list.push(["灵弹", "", i])
                            })
                            return list.length > 0
                        },
                        filterTarget: function (card, player, target) {
                            return player != target;
                        },
                        content: function () {
                            "step 0"
                            let list = []
                            if (lib.config.xjb_count[player.name1].lingtan) lib.config.xjb_count[player.name1].lingtan.forEach(function (i) {
                                if (!lib.skill[i]) return
                                lib.card.xjb_skillCard.cardConstructor(i);
                                lib.card.xjb_skillCard.skillLeadIn(i);
                                list.push(["灵弹", "", i])
                            })
                            if (list.length) {
                                let dialog = ui.create.dialog("灵力弹射转化牌", [list, "vcard"])
                                player.chooseButton(dialog)
                            }
                            "step 1"
                            if (result.bool) {
                                let card = result.links[0][2]
                                player.xjb_molizeLingli(1, target, card)
                            }
                        },
                        ai: {
                            basic: {
                                order: 9,
                            },
                            result: {
                                target: 1,
                            },
                        },
                    }
                    lib.translate._xjb_soul_lingtan = "<span data-nature=xjb_hun><font color=white>灵弹</font></span>"
                    lib.skill._xjb_soul_tiaomo = {
                        trigger: {
                            global: "roundStart"
                        },
                        forced: true,
                        filter: function (event, player) {
                            player.coordinate = undefined
                            return true
                        },
                        content: function () {}
                    }
                    lib.skill._xjb_lingliBeforeDeath = {
                        trigger: {
                            player: ["dieBefore"]
                        },
                        filter: function (event, player) {
                            return player.countMark("_xjb_lingli")
                        },
                        direct: true,
                        forced: true,
                        content: function () {
                            let num1=trigger.player.removeMark("_xjb_lingli", trigger.player.countMark("_xjb_lingli"));
                            let num2=trigger.player.removeMark("_xjb_moli", trigger.player.countMark("_xjb_moli"));
                            if(_status.currentPhase){
                               _status.currentPhase.xjb_addlingli(num1)
                               _status.currentPhase.addMark(num2)
                            }
                        }
                    }
                    lib.skill._xjb_soul_daomo = {
                        enable: "phaseUse",
                        usable: 1,
                        filter: function (event, player) {
                            if (!lib.config.xjb_lingli_Allallow) return !(!lib.characterPack['xjb_soul'][player.name1])
                            return game.xjb_hasDaomo(player)
                        },
                        filterTarget: function (card, player, target) {
                            return player != target;
                        },
                        content: function () {
                            "step 0"
                            player.xjb_buildBridge(target)
                        },
                        ai: {
                            basic: {
                                order: 9,
                            },
                            result: {
                                target: function (player, target) {
                                    if (target.countMark("_xjb_lingli") >= player.countMark("_xjb_lingli")) return 0
                                    return -1
                                },
                            },
                        },
                    }
                    lib.translate._xjb_soul_daomo = "<span data-nature=xjb_hun><font color=white>导魔</font></span>"
                    lib.skill._xjb_soul_qiling = {
                        enable: "phaseUse",
                        check: function (card) {
                            if (lib.card[card.name].debuff) return 0;
                            if (lib.card[card.name].hasSkill) return 999;
                            return 10 - get.value(card)
                        },
                        filterCard: true,
                        usable: 1,
                        selectCard: true,
                        filter: function (event, player) {
                            if (lib.config.xjb_lingli_Allallow) return true
                            return lib.characterPack['xjb_soul'][player.name1]
                        },
                        content: function () {
                            player.xjb_addZhenFa(cards)
                        },
                        ai: {
                            basic: {
                                order: 2,
                            },
                            result: {
                                player: 1,
                            },
                        },
                    }
                    lib.translate._xjb_soul_qiling = "<span data-nature=xjb_hun><font color=white>启灵</font></span>"
                    lib.translate._xjb_soul_qiling_info = "选择一张牌置于阵法区以获得灵力/魔力"
                },
                play:function () {
                    lib.soul = {}
                    lib.soul.xjb_chanter = function () {
                        if (!lib.config.xjb_count.xjb_chanter.dialog) lib.config.xjb_count.xjb_chanter.dialog = {}
                        let chanter = lib.xjb_src + "soul_chanter.jpg"
                        let chanter2 = lib.xjb_src + "soul_chanter2.jpg"
                        let library = lib.xjb_src + "position/library.jpg"
                        let LH = lib.xjb_src + lib.config.xjb_newcharacter.selectedSink.slice(8)
                        let myName = lib.config.xjb_newcharacter.name2
                        /*if (!lib.config.xjb_count.xjb_chanter.dialog.firstMeet) {
                            game.xjb_dialog([
                                [LH, myName, "green", "咦，之前还没有发现，这里怎么有这么大一座图书馆啊！", library],
                                [chanter, "琪盎特儿", "white", "确实，这座图书馆建在不起眼的地方，所以也没有什么人来"],
                                [LH, myName, "green", "你是？"],
                                [chanter, "琪盎特儿", "white", "我名唤琪盎特儿，索姓，乃是本图书馆的第四任馆主。"],
                                [LH, myName, "green", "我是" + myName + "，" + "人如其名，想必琪盎特儿小姐是一位咏唱使吧。"],
                                [chanter, "琪盎特儿", "white", "虽说以名取人不可取，但我仍旧要承认这件事实，不错，我的确是一位咏唱使。"],
                                [LH, myName, "green", "咏唱使是伟大的职业。我向你表示敬意。我现在却是无职，只身一人，四处闯荡而已。"],
                                [chanter, "琪盎特儿", "white", "在这一个混乱的时代，单枪匹马是冒险的事情。"],
                                [LH, myName, "green", "没有什么冒险不冒险的，安全不安全的。坚守城池固然不易攻破，但谁能否定随机应变不是佳策呢？"],
                                [chanter, "琪盎特儿", "white", "那便祝福你了。虽然是点头之交，我不介意为你效劳。"]
                            ], () => {
                                lib.config.xjb_count.xjb_chanter.dialog.firstMeet = true
                                game.saveConfig("xjb_count", lib.config.xjb_count)
                            })
                            return;
                        }*/
                        game.xjb_dialog([
                            [chanter, "琪盎特儿", "white", "再次相逢了，" + myName + "，是什么打算把你送到我这边来的呢？", library]
                        ]);

                    }
                },
                linglichang:function () {
                    lib.xjb_lingli=window.xjb_lingli = {
                        daomo: {
                            type: ["sun", "dragon", "blood", "tear", "taoyao", "xuemo","flower"],
                            event: {
                                "sun": "xjb_fire",//金乌
                                "dragon": "xjb_thunder",//龙女
                                "blood": "loseHp",//杜鹃
                                "tear": "xjb_ice",//雪女
                                "taoyao": "xjb_recover",//桃妖
                                "xuemo": "giveHpCard2",//血魔
                                "flower":"xjb_flower",//百花
                            },
                            event_mark: {},
                            //检测是否有导魔介质
                            test: function (player) {
                                let array = []
                                //遍历所有导魔介质类型，有该导魔介质，array数组就对应有一个1，反之，则对应有一个0
                                for (let i = 0; i < this.type.length; i++) {
                                    array[i] = 0 + (player.hasMark("_xjb_daomo_" + this.type[i]))
                                }
                                //检测最大值是否为1，为1则证明有导魔介质
                                return Boolean(Math.max(...array))
                            },
                            //列出一名角色的导魔介质
                            list: function (player) {
                                let array = []
                                for (let i = 0; i < this.type.length; i++) {
                                    if (player.hasMark("_xjb_daomo_" + this.type[i]))
                                        array.push("_xjb_daomo_" + this.type[i])
                                }
                                return array
                            },
                            //匹配所有有导魔介质的角色
                            find: function (player) {
                                let arr = []
                                game.countPlayer(current => {
                                    if (current == player) return false
                                    if (this.test(current)) arr.push(current)
                                })
                                return arr
                            }
                        },
                        event: {
                            "+2": ["loseHp", "loseMaxHp",
                                "xjb_recover",
                                "xjb_fire", "xjb_ice", "xjb_thunder",
                                "giveHpCard2"],
                            "-2": ["recover", "gainMaxHp"],
                            "+1": ["xjb_cardDeath"],
                            "-1": ["xjb_cardBirth"],
                            match: function (num) {
                                let list = ["-2", "+2", "-1", "+1"]
                                let now = list.randomGet(), eventLine = []
                                eventLine.push(this[now].randomGet())
                                now = Number(now)
                                while (now != num) {
                                    if (eventLine.includes('xjb_recover')) eventLine.remove("xjb_recover")
                                    if (eventLine.length >3) return this.match(num)
                                    let add = list.randomGet()
                                    eventLine.push(this[add].randomGet())
                                    now += Number(add)
                                }
                                return eventLine
                            },
                            find: function (event) {
                                let list = ["-2", "+2", "-1", "+1"]
                                let result
                                list.forEach(i => {
                                    if (this[i].includes(event)) result = i
                                })
                                return Number(result)
                            }
                        },
                        //
                        gathering:{
                          M:-2520,
                        },
                        //血色空间
                        blood: {
                            M: -10080
                        },
                        //空气
                        air: {
                            M: -5040,
                        },
                        //灵力场
                        area: {
                            M: 5040,
                            "ΣL": 1024,
                            S: {
                                S0: 0,
                                S1: 2,
                                S2: 14,
                                S3: 38,
                                S4: 74,
                                S5: 122,
                                S6: 182,
                                S7: 254,
                                S8: 338
                            },
                        }
                    }
                    xjb_lingli.area.countL = () => {
                        let S = xjb_lingli.area.S
                        return S.S0 + S.S1 + S.S2 + S.S3 + S.S4 + S.S5 + S.S6 + S.S7 + S.S8
                    }
                    xjb_lingli.updateK = str => {
                        let lg = (x) => {
                            let ln = Math.log
                            return ln(x) / ln(10)
                        }
                        let pow = Math.pow, L = xjb_lingli.area["ΣL"],
                            M1 = xjb_lingli.area.M, M2 = xjb_lingli[str].M, abs = Math.abs
                        xjb_lingli[str].K = pow(10, (lg(L) * 2 * M1 / abs(M1 - M2)) + 1 - lg(L))
                        return xjb_lingli[str].K
                    }
                    xjb_lingli.air.updateK = () => {
                        xjb_lingli.updateK("air")
                        return xjb_lingli.air.K
                    }
                    xjb_lingli.air.updateK()
                    xjb_lingli.updateK("blood")
                    xjb_lingli.updateK("gathering")
                    xjb_lingli.area["updateΔL"] = () => {
                        let S = xjb_lingli.area.S
                        xjb_lingli.area["ΔL"] = [];
                        xjb_lingli.area["ΔL"][0] = S.S1 - S.S0
                        xjb_lingli.area["ΔL"][1] = S.S2 - S.S1
                        xjb_lingli.area["ΔL"][2] = S.S3 - S.S2
                        xjb_lingli.area["ΔL"][3] = S.S4 - S.S3
                        xjb_lingli.area["ΔL"][4] = S.S5 - S.S4
                        xjb_lingli.area["ΔL"][5] = S.S6 - S.S5
                        xjb_lingli.area["ΔL"][6] = S.S7 - S.S6
                        xjb_lingli.area["ΔL"][7] = S.S8 - S.S7
                    }
                    xjb_lingli.area["updateΔL"]()
                    xjb_lingli.area["updateV"] = () => {
                        let S = xjb_lingli.area.S
                        xjb_lingli.area.V = {
                            V0: S.S0 / 2,
                            V1: S.S1 / 2,
                            V2: S.S2 / 2,
                            V3: S.S3 / 2,
                            V4: S.S4 / 2,
                            V5: S.S5 / 2,
                            V6: S.S6 / 2,
                            V7: S.S7 / 2,
                            V8: S.S8 / 2
                        }
                        let V = xjb_lingli.area["V"]
                        xjb_lingli.area["ΔV"] = [];
                        xjb_lingli.area["ΔV"][0] = V.V1 - V.V0
                        xjb_lingli.area["ΔV"][1] = V.V2 - V.V1
                        xjb_lingli.area["ΔV"][2] = V.V3 - V.V2
                        xjb_lingli.area["ΔV"][3] = V.V4 - V.V3
                        xjb_lingli.area["ΔV"][4] = V.V5 - V.V4
                        xjb_lingli.area["ΔV"][5] = V.V6 - V.V5
                        xjb_lingli.area["ΔV"][6] = V.V7 - V.V6
                        xjb_lingli.area["ΔV"][7] = V.V8 - V.V7
                    }
                    xjb_lingli.area["updateV"]()
                    xjb_lingli.area["updateW"] = () => {
                        let L = xjb_lingli.area["ΔL"], M = xjb_lingli.area.M
                        xjb_lingli.area["W"] = {};
                        xjb_lingli.area["W"]["0"] = M / L[0]
                        xjb_lingli.area["W"]["1"] = M / L[1]
                        xjb_lingli.area["W"]["2"] = M / L[2]
                        xjb_lingli.area["W"]["3"] = M / L[3]
                        xjb_lingli.area["W"]["4"] = M / L[4]
                        xjb_lingli.area["W"]["5"] = M / L[5]
                        xjb_lingli.area["W"]["6"] = M / L[6]
                        xjb_lingli.area["W"]["7"] = M / L[7]
                    }
                    xjb_lingli.area["updateW"]()
                    xjb_lingli.update = () => {
                        xjb_lingli.area["updateΔL"]()
                        xjb_lingli.air.updateK()
                        xjb_lingli.area["updateV"]()
                        xjb_lingli.area["updateW"]()
                    }
                    xjb_lingli.area["fanchan"] = num => {
                        let area = xjb_lingli.area;
                        let S = area.S;
                        let count = 0
                        function check(num1, num2) {
                            return (area.countL() <= num1) && (area.countL() > num2);
                        }
                        function isNature(arr) {
                            let array = []
                            for (let i = 0; i < arr.length; i++) {
                                array[i] = 0 + (arr[i] % 1 === 0)
                            }
                            return Math.min(...array)
                        }
                        xjb_lingli.update()
                        function linglilose(num1, num2, str1) {
                            if (check(num1, num2)) while (num > 0 && check(num1, num2)) {
                                    if (area.countL() <= 72) return;
                                    S[str1] -= 2;
                                    count += 2;
                                    xjb_lingli.update()
                                    if (isNature(Object.values(area.W))) num--
                                    if (area.countL() <= 72) return;
                            }     
                        }
                        //
                        linglilose(1024, 942, "S8")
                        linglilose(942, 872, "S7")
                        linglilose(872, 814, "S6")
                        linglilose(814, 768, "S5")
                        linglilose(768, 734, "S4")
                        linglilose(734, 712, "S3")
                        linglilose(712, 702, "S2")
                        //
                        linglilose(702, 632, "S8")
                        linglilose(632, 574, "S7")
                        linglilose(574, 528, "S6")
                        linglilose(528, 494, "S5")
                        linglilose(494, 472, "S4")
                        linglilose(472, 462, "S3")
                        //
                        linglilose(462, 404, "S8")
                        linglilose(404, 358, "S7")
                        linglilose(358, 324, "S6")
                        linglilose(324, 302, "S5")
                        linglilose(302, 292, "S4")
                        //
                        linglilose(292, 246, "S8")
                        linglilose(246, 212, "S7")
                        linglilose(212, 190, "S6")
                        linglilose(190, 180, "S5")
                        //
                        linglilose(180, 146, "S8")
                        linglilose(146, 124, "S7")
                        linglilose(124, 114, "S6")

                        linglilose(114, 92, "S8")
                        linglilose(92, 82, "S7")
                        linglilose(82, 72, "S8")
                        return count
                    }
                },
                logo:function () {
                    let createLogo = (str, size) => {
                        let div = document.createElement("div")
                        let i = document.createElement("i")
                        i.style.display = "block";
                        i.setAttribute("size",size+"px")
                        i.style.height = size + "px";
                        i.style.width = size + "px";
                        i.style.backgroundImage = `url(${lib.xjb_src + str})`;
                        i.style.backgroundSize = "contain"
                        div.appendChild(i)
                        return div.innerHTML
                    }
                    window.xjbLogo = {
                        taoyao: size => createLogo("lingli/taoyao.jpg", size),
                        blood: size => createLogo("lingli/blood.jpg", size),
                        dragon: size => createLogo("lingli/dragon.jpg", size),
                        tear: size => createLogo("lingli/tear.jpg", size),
                        sun: size => createLogo("lingli/sun.jpg", size),
                        xuemo: size => createLogo("lingli/xuemo.jpg", size),
                        flower: size => createLogo("lingli/flower.jpg", size),
                    }
                },
                card:function () {
                    //技能卡彩框
                    lib.element.card.xjb_Becolorful = function () {
                        this.style.border = "1.5px solid black"
                        this.classList.add("xjb_color_circle")
                    }
                    game.xjb_createSkillCard = function (id, target) {
                        lib.card.xjb_skillCard.cardConstructor(id)
                        lib.card.xjb_skillCard.skillLeadIn(id)
                        var card = game.createCard(id + "_card")
                        target.gain(card)
                        card.xjb_Becolorful()
                    }
                },
                Marks:function () {
                    lib.skill._xjb_zhenfa = {
                        marktext: "阵",
                        intro: {
                            name: "阵法",
                            content: "expansion",
                            markcount: "expansion",
                        },
                    }
                    xjb_lingli.daomo.type.forEach(i=>{
                       lib.skill["_xjb_daomo_"+i]={
                            marktext: xjbLogo[i](20),
                            intro: {
                                name: xjbLogo[i](230),
                                content: function (storage, player, skill) {
                                    return "能量值:" + storage + "C"
                                },
                            }
                       }
                       xjb_lingli.daomo.event_mark["_xjb_daomo_"+i] = xjb_lingli.daomo.event[i]
                    })                    
                    lib.skill._xjb_daomo_xuemo = {
                        marktext: xjbLogo.xuemo(20),
                        intro: {
                            name: xjbLogo.xuemo(230),
                            content: function (storage, player, skill) {
                                return "能量值:" + storage + "C"
                            },
                        }
                    }
                    lib.skill._xjb_lingli = {
                        marktext: "灵",
                        intro: {
                            name: "灵力",
                            content: function (storage, player, skill) {
                                return "灵力值:" + storage + "Ch/" + xjb_lingli.updateK(game.xjb_getSb.position(player)) + "Ch"
                            },
                        }
                    }
                    lib.skill._xjb_moli = {
                        marktext: "魔",
                        intro: {
                            name: "魔力",
                            content: function (storage, player, skill) {
                                return "魔力值:" + storage + "Ch;<br>导魔最大值：" + player.storage.xjb_daomoMax;
                            },
                        }
                    }
                },
            },
            "xjb_12":{
                "gain_jp":function () {

                },
                sub:function () {
                    //货币类
                    game.xjb_getHunbi = function (value = 1, num = 1, freeE) {
                        if (!lib.config.xjb_hunbi) lib.config.xjb_hunbi = 0
                        lib.config.xjb_hunbi += num * value
                        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
                        game.xjb_create.alert('你获得了' + num * value + '魂币！')
                        if (!freeE) {
                            game.xjb_systemEnergyChange(-num * value * 2)
                        }
                    }
                    game.xjb_addDakadian = function (num = 1, freeE) {
                        game.saveConfig('xjb_hundaka2', lib.config.xjb_hundaka2 + num);
                        if (!freeE) {
                            game.xjb_create.alert('你获得了' + num + '打卡点！')
                            game.xjb_systemEnergyChange(-20*num)
                        }
                    }
                    game.xjb_systemEnergyChange = function (num=0) {
                        lib.config.xjb_systemEnergy += num
                        game.saveConfig('xjb_systemEnergy', lib.config.xjb_systemEnergy);
                        if (lib.config.xjb_systemEnergy <= 0) {
                            num < 0&&game.xjb_create.alert("魂币系统能量耗尽")
                            game.xjb_back && game.xjb_back.remove&&game.xjb_back.remove()
                            ui.xjb_chupingjisha&&ui.xjb_chupingjisha.remove&&ui.xjb_chupingjisha.remove()                                    
                        }else{
                            lib.config.xjb_chupingjisha === 1&&lib.xjb_list_xinyuan.theFunction.xjb_chupingjisha()
                        }
                        return lib.config.xjb_systemEnergy
                    }
                    //
                    game.xjb_condition = function (num1, num2) {
                        var Uhave               
                        switch(num1){
                           case 1:Uhave = lib.config.xjb_hunbi;break;
                           case 2:Uhave = lib.config.xjb_hundaka2;break;
                           case 3:Uhave = lib.config.xjb_jnc - lib.config.xjb_newcharacter.skill.length;;break;
                        }        
                        if (!Uhave) return false
                        if (Uhave >= num2) return true
                        return false
                    }
                    game.cost_xjb_cost = function (num1, num2) {
                        num2 = Math.abs(num2)
                        if (num1 == 1) lib.config.xjb_hunbi -= num2
                        else if (num1 === 2) lib.config.xjb_hundaka2 -= num2
                        game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi)
                        game.saveConfig('xjb_hundaka2', lib.config.xjb_hundaka2);
                        game.xjb_systemEnergyChange(num2)
                        return true
                    }
                    //物品类
                    game.xjb_hasIt = function (name, num = 1) {
                        if (!lib.config.xjb_objects[name]) lib.config.xjb_objects[name] = 0
                        return lib.config.xjb_objects[name] >= num
                    }
                    game.xjb_purchaseIt = function (name, num = 1, price) {
                        if (!game.xjb_condition(1, price)) return false
                        game.cost_xjb_cost(1, price)
                        game.xjb_getIt(...arguments)
                        return true
                    }
                    game.xjb_getIt = function (name, num = 1) {
                        if (!lib.config.xjb_objects[name]) lib.config.xjb_objects[name] = 0
                        lib.config.xjb_objects[name] += num
                        game.saveConfig('xjb_objects', lib.config.xjb_objects)
                    }
                    //养成类
                    game.xjb_newCharacterGetTitle = function (num = 1) {
                        let list2 = new Array()
                        for (let b = 0; b < num; b++) {
                            list2.push(Math.round(Math.random() * (lib.config.xjb_title.length - 1)))
                        }
                        let str = '恭喜' + get.translation('xjb_newCharacter') + '解锁了称号:<br>'
                        for (let c = 0; c < list2.length; c++) {
                            str += lib.config.xjb_title[list2[c]][0]
                            if (!lib.config.xjb_title[list2[c]][1].contains('xjb_newCharacter')) {
                                lib.config.xjb_hunbi += 50
                                game.saveConfig('xjb_hunbi', lib.config.xjb_hunbi);
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
                                game.xjb_create.alert("你已更名为：<br>" + lib.config.xjb_newcharacter.name2 + "。<br>重启即更新数据");
                                game.xjb_systemEnergyChange(-5)
                            }
                        })
                    }
                    game.xjb_newCharacterChangeSex = function (num = 1, free) {
                        if (free === false) {
                            if (game.xjb_hasIt("changeSexCard")) { }
                            else if (!game.xjb_purchaseIt("changeSexCard", 1, 10)) return game.xjb_create.alert("需要购买性转卡(10魂币)，你的魂币不足")
                            var list = ['male', 'female', 'none', 'unknown', 'double']
                            var word = '请按以下规则输入：'
                            for (var i = 0; i < list.length; i++) {
                                word = word + '改为' + get.xjb_translation(list[i]) + '性，请输入' + i + '，'
                            }
                            game.xjb_create.prompt(word, undefined, function () {
                                var num = this.result
                                var newsex = list[num]
                                if (list.contains(newsex)) {
                                    lib.config.xjb_newcharacter.sex = newsex
                                    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                    game.xjb_create.alert("你性别已更改为：" + get.xjb_translation(lib.config.xjb_newcharacter.sex) + "，<br>重启即更新数据");
                                    game.xjb_systemEnergyChange(-20)
                                    game.xjb_getIt("changeSexCard", -1)
                                } else game.xjb_create.alert("你的输入有误！")
                            })
                        } else {
                            game.xjb_getIt("changeSexCard", num)
                            game.xjb_create.alert("你获得了" + num + "张性转卡")
                            game.xjb_systemEnergyChange(-5 * num)
                        }
                    }
                    game.xjb_newCharacterChangeGroup = function (num = 1, free) {
                        if (free === false) {
                            if (game.xjb_hasIt("changeGroupCard")) { }
                            else if (!game.xjb_purchaseIt("changeGroupCard", 1, 6)) return game.xjb_create.alert("需要购买择木卡(6魂币)，你的魂币不足")
                            var list = ["key", "western"].concat(lib.group)
                            var word = '请按以下规则输入：<br>'
                            for (var i = 0; i < list.length; i++) {
                                word = word + '改为' + get.translation(list[i]) + '势力，请输入' + i + '<br>'
                            }
                            game.xjb_create.prompt(word, undefined, function () {
                                var num = this.result;
                                var newgroup = list[num]
                                if (list.contains(newgroup)) {
                                    lib.config.xjb_newcharacter.group = newgroup
                                    game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
                                    game.xjb_create.alert("你势力已更改为：" + get.translation(lib.config.xjb_newcharacter.group) + "<br>重启即更新数据");
                                    game.xjb_systemEnergyChange(-10)
                                    game.xjb_getIt("changeGroupCard", -1)
                                } else game.xjb_create.alert("你的输入有误！")
                            })
                        } else {
                            game.xjb_getIt("changeGroupCard", num)
                            game.xjb_create.alert("你获得了" + num + "张择木卡")
                            game.xjb_systemEnergyChange(-5 * num)
                        }

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
                                game.cost_xjb_cost(1, cost)
                                addHp(function () {
                                    game.xjb_create.confirm('是否继续？', function () {
                                        game.xjb_newCharacterAddHp(1, false)
                                    })
                                })
                                game.xjb_systemEnergyChange(-countCostE() - 20)
                            })
                        } else addHp()
                    }
                },
            },
            "xjb_13":{
                content:function () {
        lib.xjb_class = {
            player: ['_status.currentPhase', 'target', 'game.me',
                'player', 'trigger.player', 'trigger.source', 'global'],
            players: ['game.players', 'result.targets', 'targets'],
            game: ['game'],
            suit: ['"red"', '"black"', '"club"', '"spade"', '"heart"', '"diamond"', '"none"'],
            nature: ['"ice"', '"fire"', '"thunder"'],
            cardName: [],
            number: ['1', '2', '3', '4', '5', '6',
                '7', '8', '9', '10', '11', '12', '13'],
            gain: ['"gain2"', '"draw"'],
            event: ['event', 'trigger'],
        }
        get.xjb_makeIt = game.xjb_makeIt = function (value) {
            if (value === 'gain') return '"gain2"'
            return 'undefined'
        }
        //判定类型
        get.xjb_judgeType = game.xjb_judgeType = function (word) {
            if (!isNaN(Number(word))) return 'number'
            for (let k in lib.xjb_class) {
                if (lib.xjb_class[k] && lib.xjb_class[k].includes(word)) return k
            }
        }
        get.xjb_MapNum = function (value, input) {
            if (value === 'createCard' || value === 'createCard2') {
                if (input === 'cardName') return 1
                if (input === 'suit') return 2
                if (input === 'number') return 3
                if (input === 'nature') return 4
            }
            if (value === 'gain') {
                if (input === 'gain') return 1
                return 2
            }
            if (value === "addToExpansion"){
                if (input === 'gain') return 1
                return 2
            }
        }
        get.xjb_fAgruments = function (value) {
            let list = []
            if (["createCard",'createCard2'].contains(value)) list = ['cardName', 'suit', 'number', 'nature']
            if (["addToExpansion",'gain'].contains(value) ) list = ['gain']
            return list
        }
        game.xjb_skillEditor = function () {
            //
            const playerCN=new Array("你","玩家","目标角色","当前回合角色","所选角色","选择的角色","所选的角色")
            let player = ui.create.player()
            let eventModel = { ..._status.event }
            eventModel.trigger = undefined;
            player.init('xjb_caocao')
            let back = ui.create.xjb_back()[0]
            back.ele={}
            back.skill = {
                mode: '',
                id: 'xxx',
                kind: '',
                type: [],
                filter: [],
                filter_card: [],
                content: [],
                trigger: {
                    player: [],
                    source: [],
                    global: [],
                    target: []
                }
            }
            back.pageNum = 0
            back.pages = []
            back.trigger = []
            back.phaseUse = []
            back.choose = []
            back.organize = function () {
                let str = '', step = 0, bool ,logic=false ,IF=false
                if (this.skill.mode === 'mt') {
                    str = this.skill.id + ':{\n'
                } else if (this.skill.mode === 'mainCode') {
                    str = 'lib.skill.' + this.skill.id + '={\n'
                }
                back.trigger.forEach(i => { i.style.display = 'none' })
                back.phaseUse.forEach(i => { i.style.display = 'none' })
                back.choose.forEach(i => { i.style.display = 'none' })
                if (this.skill.kind === 'trigger') {
                    back.trigger.forEach(i => { i.style.display = 'block' })
                    str += '    trigger:{\n'
                    let addTrigger = (value) => {
                        if (this.skill.trigger[value].length === 0) return false
                        str += '        '
                        str += value
                        str += ':['
                        this.skill.trigger[value].forEach((i, k) => {
                            str += '"' + i + '"'
                            str += (k == this.skill.trigger[value].length - 1 ? '' : ',')
                        })
                        str += '],\n'
                    }
                    ["player", "global", "source", "target"].forEach(TriA => {
                        addTrigger(TriA);
                    })
                    str += '    },\n'
                }
                else if (this.skill.kind) {
                    str += '    ' + this.skill.kind + ',\n'
                    if (this.skill.kind === 'enable:"phaseUse"') {
                        back.phaseUse.forEach(i => { i.style.display = 'block' })
                    } else {
                        back.choose.forEach(i => { i.style.display = 'block' })
                    }
                }
                this.skill.type.forEach(i => {
                    str += '    ' + i + ':true,\n'

                })
                str += '    filter:function(event,player){\n'
                if (this.skill.type.contains("zhuSkill")) {
                    str += '        if(! player.hasZhuSkill("' + this.skill.id +
                        '")) return false;\n'
                }
                if (this.skill.filter_card.length > 0) {
                    let tempStr = this.skill.filter_card.join()
                    str += '        if(! [' + tempStr + '].contains(get.name(event.card))) return false;\n'
                }
                this.skill.filter.forEach((i, k) => {
                    if(i==="") return;
                    if(i.slice(0,3)==="var"||i.slice(0,3)==="let") str += '        '+i
                    if(i.slice(-3,-1)==="||"||i.slice(-3,-1)==="&&"){
                       if(logic==false) str+='        if(! ('+i
                       else str+='\n        '+i
                       logic=true
                    } 
                    else if(logic===true){
                       str+='\n        '+i+')) return false;\n'
                       logic=false
                    }
                    else{
                       str += '        if(! (' + i + ')) return false;\n'                      
                    } 
                })
                str += '        return true;\n'
                str += '    },\n'
                str += '    content:function(){\n        "step 0"\n'
                let judgeAwaken = () => {
                    return this.skill.type.filter(i => {
                        return ["limited", "juexingji", "dutySkill"].contains(i)
                    }).length > 0
                }
                if (judgeAwaken()) str += '        player.awakenSkill("' + this.skill.id + '");\n';
                if (this.skill.type.contains('zhuanhuanji')) str +=
                    '        player.changeZhuanhuanji("' + this.skill.id + '");\n'
                this.skill.content.forEach(i => {
                    let a = i
                    //这里是步骤矫正                  
                    if (i.indexOf("'step") >= 0 || i.indexOf('"step') >= 0) {
                        let k = i
                        k = k.replace(/"/g, '')
                        k = k.replace(/'/g, '')
                        k = k.replace('step', '')
                        k = k.replace(' ', '')
                        step++
                        a = '"step ' + step + '"'
                        bool = false                      

                    } else if (i.indexOf('result.targets') >= 0 && !bool) {
                        a = 'if(result.bool) ' + i
                    } else {
                        let k = i.replace(' ', '')
                        if (k.indexOf('if(result.bool){') === 0) bool = true
                    }
                    if (i.indexOf('chooseTarget') > 0) {
                        if(a.indexOf('other')>0){
                           a=a.replace(/,?other/,'')
                           a+='.set("filterTarget",function(card,player,target){return player!=target})'
                        } 
                    }
                    if(i.indexOf('atLeast')>0){
                        a=a.replace('atLeast','')
                        let tempStr=(a.match(/[0-9]+/)&&a.match(/[0-9]+/)[0])||''
                        a=a.replace(tempStr,'['+tempStr+',Infinity]')
                    }else if(i.indexOf('atMost')>0){
                        a=a.replace('atMost','')
                        let tempStr=(a.match(/[0-9]+/)&&a.match(/[0-9]+/)[0])||''
                        a=a.replace(tempStr,'[1,'+tempStr+']')
                    }
                    if(i.indexOf("addToExpansion")>0){
                        if(i.indexOf("gaintag.add")<0){
                            a+='.gaintag.add( "'+this.skill.id+'")'
                        }
                    }
                    if(i==="if("&&IF===false){
                       str += '        if('
                       IF=true
                    } 
                    else if(i===")"&&IF===true){
                       str +=')\n    '
                       IF=false
                    } 
                    else if(IF===true){
                       str += a
                    }
                    else str += '        ' + a + "\n"
                    if (i.indexOf('chooseTarget') > 0) {
                        step++
                        str += '        "step ' + step + '"\n'
                        bool = false;                        
                    }
                })
                str += '    },\n'
                if (this.skill.mode === 'mt') str += '},'
                else if (this.skill.mode === 'mainCode') str += '}'
                str=str.replace(/,[)]/g,')')
                str=str.replace(/,,+/g,',')
                str=str.replace(/[(],/g,'(')
                this.target.value = str                
            }
            function dispose(str, number) {
                let list1 = str.split('\n'), list2 = [], list3 = [], list4 = [];
                //切割
                if (number === 1) return list1
                list1.forEach(i => {                    
                    list2.push(i.split(' '))
                })
                if (number === 2) return list2
                //翻译
                list2.forEach(i => {
                    let list = []
                    i.forEach(a => {
                        let c = a.split(''), d = []
                        c.forEach(f => {
                            if (!['当'].contains(f)) d.push(f)
                        })
                        d = d.join('')
                        d = lib.xjb_translate[d] || d
                        if(d.indexOf(":intoFunction")>0){                           
                           d=d.replace(":intoFunction","")
                           d=d.split(":")
                           return list.push(...d)
                        }
                        list.push(d)
                    })
                    list3.push(list)
                })
                if (number === 3) return list3
                //组装
                list3.forEach(i => {
                    let str0 = '', str = '', str1 = '', str2 = '', notice = [], bool = true, index,
                        players
                    //捕捉关键词
                    i.forEach(a => {
                        if (game.xjb_judgeType(a)) {
                            notice.push(game.xjb_judgeType(a))
                            if (game.xjb_judgeType(a) === 'players') players = a
                        }
                    })
                    //组装函数前语句
                    i.forEach((a, b) => {
                        if (!bool) return false
                        function WAW(body) {                            
                            if (body[a]) {
                                str += ('.' + a)
                                if (typeof body[a] === 'function') {
                                    bool = false;
                                    index = b + 1
                                    str2 = '()'
                                }
                            }
                            else if(a.indexOf(':')>0){
                                let arrA=a.split(':')
                                str +='.'+arrA.shift()
                                str +='('
                                str +=arrA.join(',')
                                str +=')'
                            }
                            else str += a
                        }
                        if (notice.contains('game')) WAW(game)
                        else if (notice.contains('player')) WAW(player)
                        else if (notice.contains('event')) WAW(eventModel)
                        else WAW(player)
                    })
                    //填写参数
                    if (index) {
                        let toOrder = i.splice(index)
                        //排序
                        toOrder.sort((a, b) => {
                            let value1 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(a)),
                                value2 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(b))
                            return value1 - value2
                        })
                        //补齐必须参数
                        let j = get.xjb_fAgruments(i[i.length - 1])
                        for (let g = 0; g < j.length; g++) {
                            if (get.xjb_judgeType(toOrder[g]) !== j[g]) {
                                toOrder.splice(g, 0, get.xjb_makeIt(j[g]))
                            }
                        }
                        toOrder.forEach((c, b) => {
                            let string = '', a = c
                            if (c.indexOf('到') > 0) {
                                let arr = c.split('到')
                                a = '['
                                a += lib.xjb_translate[arr[0]] || arr[0]
                                a += ','
                                a += lib.xjb_translate[arr[1]] || arr[1]
                                a += ']'
                            }
                            if (b > 0) string = ',' + a + ')'
                            else string = a + ')'
                            str2 = str2.replace(')', string)
                        })
                    }
                    if (notice.contains('players')) {
                        str0 = players + '.forEach(i=>{'
                        while (str.indexOf(players) >= 0) str = str.replace(players, 'i')
                        while (str2.indexOf(players) >= 0) str2 = str2.replace(players, 'i')
                        str2 += ';})'
                    }
                    if (notice.contains('if') && !notice.contains('then')) {
                        str1 = ')'
                    }
                    list4.push(str0 + str + str1 + str2)
                })
                return list4
            }
            function newElement(tag, innerHTML, father) {
                let h = document.createElement(tag);
                h.innerHTML = innerHTML;
                father.appendChild(h)
                return h
            }
            function style(ele) {
                ui.xjb_giveStyle(ele, {
                    height: "1.5em",
                    position: 'relative',
                })
            }
            function listener(ele, fn) {
                ele.addEventListener(lib.config.touchscreen ?
                    'touchend' : 'click', fn)
            }
            function newPage() {
                let subBack = newElement('div', '', back)
                back.pages.push(subBack)
                ui.xjb_giveStyle(subBack, {
                    flexDirection: 'column',
                    bottom: '25px',
                    fontSize: '1.5em',
                    width: 'calc(95% - 50px)',
                    height: 'calc(65% + 50px)',
                    margin: 'auto',
                    position: 'relative',
                    display: 'flex'
                })
                let curtain = newElement('div', '', subBack)
                ui.xjb_giveStyle(curtain, {
                    width: '100%',
                    height: '100%',
                    backgroundColor: "#3c4151",
                    opacity: "0.7",
                    position: 'absolute',
                    zIndex: '-1'
                })
                if (back.pages.length > 1) subBack.style.display = "none"
                return subBack
            }
            let h1 = newElement('h1', '魂氏技能编辑器', back)
            h1.style.width = '90%'
            let next = newElement('span', '下一页', h1)
            next.style.float = 'right'
            back.ele.nextPage=next
            listener(next, e => {
                if (back.pageNum < back.pages.length - 1) back.pageNum++
                else back.pageNum = 0
                back.pages.forEach((i, k) => {
                    i.style.display = back.pageNum == k ? 'flex' : 'none'
                })
            })
            let last = newElement('span', '上一页', h1)
            back.ele.lastPage=last
            listener(last, e => {
                back.pageNum--
                if (back.pageNum < 0) back.pageNum = back.pages.length - 1
                back.pages.forEach((i, k) => {
                    i.style.display = back.pageNum == k ? 'flex' : 'none'
                })
            })
            last.style.float = 'right'
            last.style.marginRight = '10px'
            //第一页
            let subBack = newPage()
            //
            let idSeter = newElement('div', '技能id:', subBack)
            style(idSeter)
            let idFree = newElement('textarea', '', subBack)
            back.ele.id=idFree
            ui.xjb_giveStyle(idFree, {
                fontSize: '1em',
                height: '1em',
                width: '50%',
                position: 'relative',
            })
            idFree.submit = function(e) {
                if (e&&e.keyCode == 13) {
                    idFree.value = ''
                }
                back.skill.id = idFree.value
                back.organize()
            }
            idFree.addEventListener('keyup', idFree.submit)
            //
            let kindSeter = newElement('div', '技能种类:', subBack)
            style(kindSeter)
            let kindFree = newElement('div', '', subBack)
            ui.xjb_giveStyle(kindFree, {
                height: '1em',
                float: 'left',
                position: 'relative',
            })
            back.ele.kinds=kindFree.children
            if (true) {
                let list = ['触发类', '出牌阶段类', '使用类', '打出类', '使用打出类'];
                let list1 = ['trigger', 'enable:"phaseUse"', 'enable:"chooseToUse"',
                    'enable:"chooseToRespond"', 'enable:["chooseToUse","chooseToRespond"]']
                list.forEach((i, k) => {
                    let it = ui.create.xjb_button(kindFree, i)
                    ui.xjb_giveStyle(it, {
                        fontSize: '1em'
                    })
                    it.kind = list1[k]
                    listener(it, e => {
                        back.skill.kind = it.kind
                        Array.from(it.parentElement.children).forEach(t => {
                            t.style.backgroundColor = "#e4d5b7"
                            if (t.kind == back.skill.kind) t.style.backgroundColor = 'red'
                        })
                        back.organize()
                    })
                })
            }
            //
            let typeSeter = newElement('div', '技能标签:', subBack)
            style(typeSeter)
            let typeFree = newElement('div', '', subBack)
            ui.xjb_giveStyle(typeFree, {
                height: '1em',
                float: 'left',
                position: 'relative',

            })
            back.ele.types=typeFree.children
            if (true) {
                let list = ['主公技', '锁定技', '使命技', '限定技', '觉醒技', '转换技'];
                let list1 = ['zhuSkill', 'forced', 'dutySkill', 'limited',
                    'juexingji', 'zhuanhuanji']
                list.forEach((i, k) => {
                    let it = ui.create.xjb_button(typeFree, i)
                    ui.xjb_giveStyle(it, {
                        fontSize: '1em'
                    })
                    it.type = list1[k]
                    listener(it, e => {
                        if (back.skill.type.contains(it.type)) {
                            back.skill.type.remove(it.type)
                            it.style.backgroundColor = "#e4d5b7";
                        } else {
                            it.style.backgroundColor = "red";
                            back.skill.type.push(it.type)
                        }
                        back.organize()
                    })
                })
            }
            let modeSeter = newElement('div', '编写位置:', subBack)
            style(modeSeter)
            let modeFree = newElement('div', '', subBack)
            back.ele.mode=modeFree.children
            ui.xjb_giveStyle(modeFree, {
                height: '1em',
                float: 'left',
                position: 'relative',
            })
            if (true) {
                let list = ['本体自带编写器', 'mt管理器', '主代码'];
                let list1 = ['self', 'mt', 'mainCode']
                list.forEach((i, k) => {
                    let it = ui.create.xjb_button(modeFree, i)
                    ui.xjb_giveStyle(it, {
                        fontSize: '1em'
                    })
                    it.mode = list1[k]
                    listener(it, e => {
                        back.skill.mode = it.mode
                        Array.from(it.parentElement.children).forEach(t => {
                            t.style.backgroundColor = "#e4d5b7"
                            if (t.mode == back.skill.mode) t.style.backgroundColor = 'red'
                        })
                        back.organize()
                    })
                })
            }
            //第二页
            let subBack2 = newPage()
            let filterSeter = newElement('div', '<b><font color="red">发动条件</font></b>:', subBack2)
            style(filterSeter)
            let filterFree = newElement('textarea', '', subBack2)
            back.ele.filter = filterFree
            ui.xjb_giveStyle(filterFree, {
                height: '5em',
                fontSize: '0.75em',
                width: '50%'
            })
            filterFree.changeWord = function (replaced, replacer) {
                this.value = this.value.replace(replaced, replacer)
                return true
            }
            filterFree.arrange = function () {
                function update(str) {
                    let wonder = filterFree.value.split('\n')
                    wonder = wonder.map(t => {
                        let wonder1 = t.split(str).join('')
                        return wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : '')
                    })
                    filterFree.value = wonder.join('\n')
                }            
                playerCN.forEach(i=>{
                    this.changeWord(i + '的',i)
                });
                new Array("你","玩家","目标","当前回合角色",
                "体力值","体力上限","手牌数",
                "大于","小于","等于","是","为","不是","不为",
                "火属性", "冰属性", "雷属性",
                 '红色', '黑色', '梅花', '方片', '无花色', '黑桃', '红桃', '红心').forEach(i=>{
                    this.changeWord(new RegExp(i,'g'), i+' ')
                });    
                this.changeWord(/体力(?!上限|值)/g,'体力 ')
                this.changeWord(/并且\s?/g, '并且\n')
                this.changeWord(/或者\s?/g, '或者\n')
                this.changeWord(/\s\s/g, ' ')
                this.changeWord(/\s+$/,'')
            }
            back.ele.filter.submit = function(e){
                let wonderfulCSTS = (filterFree.value.indexOf("同上") > 0 && filterFree.value.match(/.+\n同上/) && filterFree.value.match(/.+\n同上/)[0]) || ''
                wonderfulCSTS = wonderfulCSTS.replace(/\n同上/, '')
                filterFree.value = filterFree.value.replace("同上", wonderfulCSTS)
                let updatedValue = (filterFree.value.indexOf("同下") >= 0 && filterFree.value.match(/同下\n.+/) && filterFree.value.match(/同下\n.+/)[0]) || '';
                updatedValue = updatedValue.replace(/同下\n/, '');
                filterFree.value = filterFree.value.replace(/同下/, updatedValue);
                filterFree.value.indexOf("整理") > 0 && filterFree.changeWord('整理', '') && filterFree.arrange()              
                back.skill.filter = []
                if (!filterFree.value || filterFree.value.length === 0) return back.skill.filter.push('true') && back.organize()
                let list = dispose(filterFree.value)
                list = list.map(t => {
                    return t.replace(/trigger/g, 'event')
                })
                back.skill.filter.push(...list)
                back.organize()
            }
            filterFree.addEventListener('keyup', back.ele.filter.submit)
            let filterIntro = newElement('div', '举例说明', subBack2)
            style(filterIntro)
            let filterExample = newElement('div', '例如:有一个技能的发动条件是:你的体力值大于3<br>' +
                '就在框框中写:<br>' +
                '你 体力值 大于 三<br>' +
                '每写完一个效果，就提行写下一个效果。'
                , subBack2)
            style(filterExample)
            //第三页
            let subBack3 = newPage()
            let contentSeter = newElement('div', '<b><font color=red>技能效果', subBack3)
            style(contentSeter)
            let contentFree = newElement('textarea', '', subBack3)
            back.ele.content = contentFree
            ui.xjb_giveStyle(contentFree, {
                height: '5em',
                fontSize: '0.75em',
                width: '50%'
            })
            contentFree.changeWord = function (replaced, replacer) {
                this.value = this.value.replace(replaced, replacer)
                return true
            }
            contentFree.ensure = function (){
                this.changeWord(/\s\n/g, '\n')           
                this.changeWord(/\s\s/g, ' ')  
                this.changeWord(/如果\s?/g, '如果\n')
                this.changeWord(/\s?那么\s?/g, '\n那么\n')    
            }
            contentFree.arrange = function () {    
                this.changeWord(/然后/g, '\n')                
                this.changeWord(/\s\n/g, '\n')       
                function update(str) {
                    let wonder = contentFree.value.split('\n')
                    wonder = wonder.map(t => {
                        let wonder1 = t.split(str).join('')
                        return wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : '')
                    })
                    contentFree.value = wonder.join('\n')
                }
                for (let i = 1; i <= 20; i++) {                    
                    this.changeWord("任意"+i + '张' ,i + '张')
                    this.changeWord("任意"+get.cnNumber(i) + '张',get.cnNumber(i) + '张')
                    this.changeWord("任意"+i + '名',get.cnNumber(i) + '名')
                    this.changeWord("任意"+get.cnNumber(i) + '名',get.cnNumber(i) + '名')
                }
                playerCN.forEach(i=>{
                    this.changeWord(i + '的',i)
                })
                for (let i = 1; i <= 20; i++) {                    
                    update(i + '张')
                    update(get.cnNumber(i) + '张')
                    update(i + '点')
                    update(get.cnNumber(i) + '点')
                    update(i + '名')
                    update(get.cnNumber(i) + '名')
                }                
                "abcdefghjlmnopqrstuvwxyz".split('').forEach(i=>{
                    update(i + '张')
                    update(i + '点')    
                    update(i + '名')    
                    update(i.toUpperCase() + '张')
                    update(i.toUpperCase() + '点')  
                    update(i.toUpperCase() + '名')                   
                })
                const wonderA = [
                '红色', '黑色', '梅花', '方片', '无花色', '黑桃', '红桃', '红心',
                "火属性", "冰属性", "雷属性",
                "任意张","任意名",
                "其他","至多","至少",
                "并且","或者"]
                for (let i = 0; i < wonderA.length; i++) {
                    update(wonderA[i])
                }                                                                          
                ["体力值","体力上限","手牌数",
                "大于","小于","等于","是","为","不是","不为","令为",
                "变量"
                ].forEach(i=>{
                    this.changeWord(new RegExp(i,'g'), i+' ')
                })  
                this.changeWord(/体力(?!上限|值)/g,'体力 ')
                this.ensure()
                let ty=contentFree.value.split('\n').map(i=>{
                   let nice1=[],nice2=[],ie          
                   let arrNice=new Array(...playerCN)
                   arrNice.forEach(ae=>{
                      if(i.indexOf(ae)===0){
                         nice1.push(ae)
                         i=i.replace(ae,'')
                      }
                   })                  
                   if(!nice1.length) return i
                   arrNice.forEach(ae=>{                   
                      ie=i.split(ae)
                      while(i.indexOf(ae)>=0){
                         i=i.replace(ae,'')
                      }
                      if(ie.length>1){
                        let nice3=[]
                        nice3.length=ie.length-1
                        nice3.fill(ae)
                        nice2.push(...nice3)
                      }                      
                   })                  
                   return nice1.join('')+' '+i+' '+nice2.join(' ')
                })
                this.value = ty.join('\n'); 
                this.ensure()                   
                this.changeWord(/\s+$/,'')           
            }
            contentFree.zeroise=function(){
                this.value =""
            }
            back.ele.content.submit=function(e){
                let wonderfulCSTS = (contentFree.value.indexOf("同上") > 0 && contentFree.value.match(/.+\n同上/) && contentFree.value.match(/.+\n同上/)[0]) || ''
                wonderfulCSTS = wonderfulCSTS.replace(/\n同上/, '')
                contentFree.changeWord("同上", wonderfulCSTS)
                let updatedValue = (contentFree.value.indexOf("同下") >= 0 && contentFree.value.match(/同下\n.+/) && contentFree.value.match(/同下\n.+/)[0]) || '';
                updatedValue = updatedValue.replace(/同下\n/, '');
                contentFree.changeWord(/同下/, updatedValue);
                contentFree.value.indexOf("清空") >= 0 && contentFree.zeroise()                               
                contentFree.value.indexOf("整理") >= 0 && contentFree.changeWord('整理', '') && contentFree.arrange()
                back.skill.content = []
                if (contentFree.value.length === 0) return back.organize()
                let list = dispose(contentFree.value)
                back.skill.content.push(...list)
                back.organize()
            }
            contentFree.addEventListener('keyup', back.ele.content.submit)
            let contentIntro = newElement('div', '举例说明', subBack3)
            style(contentIntro)
            let contentExample = newElement('div', '例如:有一个技能的效果是:你摸三张牌<br>' +
                '就在框框中写:<br>' +
                '你 摸牌 三张<br>' +
                '每写完一个效果，就提行写下一个效果。'
                , subBack3)
            style(contentExample)
            //第五页
            let subBack5 = newPage()
            let triggerAdd = (who, en) => {
                back.trigger.push(who)
                who.style.display = 'none'
                who.style.display = 'none'
            }
            let triggerSeter = newElement('div', '<b><font color=red>触发时机</font></b>', subBack5)
            style(triggerSeter)
            let triggerFree = newElement('textarea', '', subBack5)
            back.ele.trigger = triggerFree
            ui.xjb_giveStyle(triggerFree, {
                height: '5em',
                fontSize: '0.75em',
                width: '50%'
            })
            triggerFree.changeWord = function (replaced, replacer) {
                this.value = this.value.replace(replaced, replacer)
                return true
            }
            triggerFree.arrange = function () {
                ["你","一名角色"].forEach(i=>{
                    this.changeWord(new RegExp(i,'g'), i+' ')
                })    
                this.changeWord(/\s\s/g, ' ')
            }
            back.ele.trigger.submit = function(e){
                this.value.indexOf("整理") > 0 && this.changeWord('整理', '') && this.arrange()               
                back.skill.trigger.source = []
                back.skill.trigger.player = []
                back.skill.trigger.global = []
                back.skill.trigger.target = []
                back.skill.filter_card = []
                if (triggerFree.value.length === 0) return
                let list = dispose(triggerFree.value, 3), tri_player = [],
                    tri_global = [], tri_target = [], tri_source = [], tri_players = []
                list.forEach(i => {
                    if (i.contains('player')) {
                        let a = i
                        a.remove('player')
                        tri_players.push(...a)
                    } else if (i.contains('global')) {
                        let a = i
                        a.remove('global')
                        tri_global.push(...a)
                    }
                })
                tri_players.forEach(i => {
                    let a = i
                    if (i === 'damageSource') tri_source.push(a)
                    else if (i.indexOf("source:") === 0) {
                        a = a.slice(7)
                        tri_source.push(a)
                    }
                    else if (i.indexOf("target:") === 0) {
                        a = a.slice(7)
                        if (a.indexOf('useCardToTarget') > 0) {
                            tri_target.includes('useCardToTarget') || tri_target.push('useCardToTarget')
                            a = a.replace('useCardToTarget', '')
                            a = a.replace(':', '')
                            back.skill.filter_card.push('"' + a + '"')
                        }
                        else tri_target.push(a)
                    }
                    else if (i.indexOf("player:") === 0) {
                        a = a.slice(7)
                        if (a.indexOf('useCardToPlayer') > 0) {
                            tri_player.includes('useCardToPlayer') || tri_player.push('useCardToPlayer')
                            a = a.replace('useCardToPlayer', '')
                            a = a.replace(':', '')
                            back.skill.filter_card.push('"' + a + '"')
                        }
                        else tri_player.push(a)
                    }
                    else tri_player.push(a)
                })
                back.skill.trigger.player.push(...tri_player)
                back.skill.trigger.source.push(...tri_source)
                back.skill.trigger.target.push(...tri_target)
                back.skill.trigger.global.push(...tri_global)
                back.organize()
            }
            triggerFree.addEventListener('keyup', back.ele.trigger.submit)
            let triggerIntro = newElement('div', '举例说明', subBack5)
            style(triggerIntro)
            let triggerExample = newElement('div', '例如有一个技能的发动时机是:你受到伤害后<br>' +
                '在框框中就写:<br>' +
                '你 受到伤害后<br>' +
                '每写完一个时机就提行写下一个时机。',
                subBack5)
            style(triggerExample)
            triggerAdd(triggerExample)
            triggerAdd(triggerFree)
            triggerAdd(triggerIntro)
            triggerAdd(triggerSeter)
            let enableAdd = (word, en) => {
                let rat = newElement('div', '', subBack5)
                ui.xjb_giveStyle(rat, {
                    height: '1em',
                    float: 'left',
                    position: 'relative',
                })
                let it = ui.create.xjb_button(rat, word)
                ui.xjb_giveStyle(it, {
                    fontSize: '1em'
                })
                it.type = en
                listener(it, e => {
                    if (back.skill.type.contains(it.type)) {
                        back.skill.type.remove(it.type)
                        it.style.backgroundColor = "#e4d5b7";
                    } else {
                        it.style.backgroundColor = "red";
                        back.skill.type.push(it.type)
                    }
                    back.organize()
                })
                let mouse = newElement('div', '', subBack5)
                style(mouse)
                rat.style.display = 'none'
                mouse.style.display = 'none'
                back.phaseUse.push(rat, mouse)
            }
            enableAdd('选择角色', 'filterTarget')
            enableAdd('选择卡片', 'filterCard')
            let chooseSeter = newElement('div', '视为牌的技能:还在施工中...', subBack5)
            style(chooseSeter)
            back.choose.push(chooseSeter)
            //第四页
            let subBack4 = newPage()
            let skillSeter = newElement('h2', '技能', subBack4)
            let copy = newElement('span', '复制', skillSeter)
            copy.style.float = 'right'
            listener(copy, e => {
                try{
                   if(back.skill.mode==='mainCode'){
                      let func=new Function('lib',back.target.value)                      
                   }
                   else new Function('let gama={'+back.target.value+'}')
                   back.target.select();
                   document.execCommand("copy")
                }
                catch(err){
                   game.xjb_create.alert("！！！报错：<br>"+err)
                }                
            })
            let skillFree = newElement('textarea', '', subBack4)
            ui.xjb_giveStyle(skillFree, {
                height: '10em',
                fontSize: '0.75em',
            })
            back.target = skillFree
            back.organize()                                
            return back
        }
        ui.create.system("技能编辑", game.xjb_skillEditor)
    },
            },
            "xjb_14":{
                result:function () {
        //伤害--无视护甲效果
        lib.skill["xjb_pojia"] = {
            trigger: {
                player: "damageEnd"
            },
            direct:true,
            content: function () {
                player.removeSkill(event.name)
            },
            ai: {
                nohujia: true,
            }
        }
        //特效--旋转效果
        lib.skill.xjb_zhuanzhuan = {
            trigger: {
                player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
            },
            direct: true,
            content: function () {
                if (trigger.name == "phaseZhunbei") {
                    if (player == game.me) {
                        ui.arena.style = '--xjbTimeLong:4s'
                        ui.arena.classList.add('xjb_tranEndless');                        
                    }
                    else {
                        player.node.avatar.classList.add('xjb_tranEndless')                        
                    }
                }
                else {
                    ui.arena.style = '--xjbTimeLong:0s'
                    player.node.avatar.classList.remove('xjb_tranEndless')
                    player.removeSkill(event.name)
                }
            },
        }
    },
                "X_skill":function () {

        //fc_X描述
        get.xjb_number = function (number, tarlen1, num1) {
            var tarlen = tarlen1
            if (!number) return ''
            if (typeof number === 'string') {
                return parseInt(number, 10)
            }
            if (!tarlen1) tarlen = 1
            var numobj = {}, name = '选择' + get.cnNumber(tarlen) + '名角色，你'
            var num2 = num1 || 1
            for (var i = 0; i < arguments.length; i++) {
                if (typeof arguments[i] === 'object') {
                    numobj = arguments[i]
                }
            }
            var words1 = tarlen === 1 ? '其' : '这些角色各',
                words2 = tarlen === 1 ? '其' : '这些角色分别',
                wordsAdd = numobj.wordsAdd || ''
            if (tarlen === -1) {
                words1 = '所有角色'
                words2 = '所有角色'
                name = '你'
            }
            if (![2, 32, 183].contains(number) && number % 10 !== 4) {
                name += '令'
            } else if (number % 10 === 4) {
                name += '对' + words1 + '造成' + get.cnNumber(num2)
            }
            switch (number) {
                case 1: name += words1 + '摸' + get.cnNumber(num2) + '张牌'; break;
                case 11: name += words1 + '恢复' + get.cnNumber(num2) + '点体力'; break;
                case 21: name += words1 + '加' + get.cnNumber(num2) + '点体力上限'; break;
                case 41: case 123: name += words2 + '获得一个Buff'; break;
                case 2: name += '弃置' + words1 + get.cnNumber(num2) + '张牌'; break;
                case 12: case 52: name += words1 + '失去' + get.cnNumber(num2) + '点体力'; break;
                case 22: name += words1 + '减' + get.cnNumber(num2) + '点体力上限'; break;
                case 32: name += '获得' + words1 + get.cnNumber(num2) + '张牌'; break;
                case 42: name += words1 + '弃置' + get.cnNumber(num2) + '张牌'; break;
                case 62: name += words1 + '弃置全域内' + get.cnNumber(num2) + '张牌'; break;
                case 72: case 113: name += words2 + '获得一个Debuff'; break;
                case 3: name += words2 + '重置之'; break;
                case 13: name += words2 + '横置之'; break;
                case 23: name += words2 + '获得技能' + get.translation(numobj.skills); break;
                case 33: name += words2 + '获得技能' + get.translation(numobj.skills); break;
                case 83: {
                    name += words2 + '视为拥有技能' + get.translation(numobj.skills)
                }; break;
                case 153: name += words2 + '正面朝上'; break;
                case 163: name += words2 + '背面朝上'; break;
                case 173: name += words2 + '翻面'; break;
                case 183: name += '对' + words2 + '使用' + get.translation(numobj.toUseCard); break;
                case 4: name += '点火属性伤害'; break;
                case 14: name += '点雷属性伤害'; break;
                case 24: name += '点冰属性伤害'; break;
                case 34: name += '点神属性伤害'; break;
                case 44: {
                    name += wordsAdd + '点伤害'
                }; break;
                case 54: name += wordsAdd + '点伤害(此伤害无视护甲)'; break;
            }
            return name
        }
        lib.skill.skill_X = {
            trigger: {
                player: 'phaseBegin',
            },
            charlotte: true,
            direct: true,
            popup: false,
            content: function () {
                'step 0'
                //载入存在storage的数据
                event.do = player.storage._skill_xin_X[0] || 1;
                event.num = player.storage._skill_xin_X[1] || 1;
                event.count = player.storage._skill_xin_X[2] || 1;
                event.ban = player.storage._skill_xin_X[3];
                event.unique = player.storage._skill_xin_X[4] || [];
                event.change = player.storage._skill_xin_X[5];
                event.control = player.storage._skill_xin_X[6];
                event.else = player.storage._skill_xin_X[7] || {}
                'step 1'
                event.count--
                if (event.num === 0) event.goto(4)
                if (trigger && trigger.player) event.do = trigger.player.storage._skill_xin_X_locked
                'step 2'
                //处理num数据(选择角色数，事件数值)
                var name, num1, num2
                if (event.unique.contains('num_2') && event.do % 10 !== 3) {
                    num1 = 1
                    num2 = event.num
                }
                else {
                    num1 = event.num
                    num2 = 1
                }
                if (event.do === 33) num1 = event.else.skills.length
                //处理prompt
                name = get.xjb_number(event.do, num1, num2, event.else)
                if (event.else.promptAdd) name = name + event.else.promptAdd
                //检测用途，选择分支
                if (event.unique.contains('choose')) {
                    var choice
                    if (event.else.skills && event.do === 23) choice = event.else.skills
                    if (event.else.identity && event.do === 43) choice = event.else.identity
                    if (event.unique.contains('needResult')) choice = event.else.choice
                    if (event.unique.contains('getNumber')) choice = event.else.getNumber
                    var next = player.chooseControl(choice)
                    var chopro = event.else.chopro || '请选择一项'
                    next.set('prompt', chopro)
                    next.set('ai', function () {
                        return choice.randomGet()
                    })
                }
                //检测用途，指定角色分支
                if (!event.unique.contains('onlyme')) {
                    var next = player.chooseTarget([1, num1])
                    next.set('prompt', name)
                    next.set('filterTarget', function (card, player, target) {
                        if (event.ban.contains(target)) return false
                        if (event.do === 11 && target.hp === target.maxHp) return false;
                        if (event.do === 2 && target.countCards('he') === 0) return false;
                        if (event.do === 32 && target.countCards('he') === 0) return false;
                        if (event.do === 42 && target.countCards('he') === 0) return false;
                        if (event.do === 3 && !target.isLinked()) return false;
                        if (event.do === 13 && target.isLinked()) return false;
                        if (event.unique.contains('linked') && !target.isLinked()) return false;
                        if (event.unique.contains('other') && target === player) return false;
                        return true;
                    })
                    if (event.else.ai) {
                        next.set("ai", event.else.ai)
                    }
                    else {
                        next.set('ai', function (target) {
                            //利用余数写ai
                            if (event.do % 10 == 1) return get.attitude(player, target);
                            if (event.do % 10 === 2) return -get.attitude(player, target);
                            if (event.do % 10 === 4) return get.damageEffect(target, player, player)
                            var theNum1 = [3, 153], theNum2 = [13, 163]
                            if (theNum1.contains(event.do)) return get.attitude(player, target);
                            if (theNum2.contains(event.do)) return -get.attitude(player, target);
                        })
                    }
                }
                'step 3'
                //选择分支
                if (event.unique.contains('needResult')) {
                    player.storage._skill_xin_X = [event.do, 1, 1, event.ban, [], [], []]
                    if (event.else.storage) {
                        var storage = event.else.storage
                        player.storage[storage] = result.control;
                    }
                    event.finish()
                }
                else if (event.unique.contains('getNumber')) {
                    event.do = Number(result.control) === result.control ? result.control : 1
                }
                //事件分支
                //角色处理
                if (result.bool && result && result.targets) var targets = result.targets.slice(0)
                if (event.unique.contains('onlyme')) {
                    var targets = event.else.onlyme ? event.else.onlyme : [player]
                }
                //再执行处理
                if (!event.unique.contains('num_2') && event.else.redo2) {
                    var tarlen = event.else.redo2.length
                    if (event.unique.contains('again') && targets.length > event.else.redo2[tarlen]) targets.length = event.else.redo2[tarlen] || 1
                }
                //执行事件
                if (targets && targets.length) {
                    player.skill_X = { targets: targets }
                    if (event.unique.contains('num_2') && event.do % 10 !== 3) {
                        var num = event.num
                    }
                    else var num = 1
                    for (var i = 0; i < targets.length; i++) {
                        if (event.unique.contains('noskill_temp')) targets[i].addTempSkill('skill_noskill')
                        if (event.unique.contains('usechenSkill')) targets[i].usechenSkill()
                        if (event.unique.contains('S')) targets[i].changeS2(true)
                        if (event.unique.contains('deS')) targets[i].changeS2()
                        if (event.unique.contains('changeS_1')) targets[i].changeS(1)
                        switch (event.do) {
                            //增益事件    
                            case 1: targets[i].draw(num, player); break;
                            case 11: targets[i].recover(num, player); break;
                            case 21: targets[i].gainMaxHp(num); break;
                            case 31: targets[i].insertPhase(); break;
                            case 41: case 123: targets[i].getBuff(); break;
                            case 51: targets[i].draw(num, player, 'bottom'); break;
                            //亏损事件   
                            case 2: player.discardPlayerCard(targets[i], num, 'he', true); break;;
                            case 12: targets[i].loseHp(num); break;
                            case 22: targets[i].loseMaxHp(num).source = player; break;
                            case 32: player.gainPlayerCard(targets[i], true, num, 'he'); break;
                            case 42: targets[i].chooseToDiscard('he', 1, true); break;
                            case 52: {
                                targets[i].loseHp(num).source = player
                            }; break;
                            case 62: targets[i].xjb_chooseHEJXS(num, true); break;
                            case 72: case 113: targets[i].getDebuff(); break;
                            //特殊事件    
                            case 3: {
                                if (targets[i].isLinked()) targets[i].link()
                            }; break;
                            case 13: {
                                if (!targets[i].isLinked()) targets[i].link()
                            }; break;
                            case 43: {
                                var identity
                                if (result.control && event.unique.contains('choose')) identity = result.control
                                else identity = event.else.identity[0]
                                targets[i].identity = identity
                                if (targets[i] === game.me) targets[i].setIdentity(identity)
                                targets[i].update()
                            }; break;
                            case 53: {
                                targets[i].identity = event.else.identity[i]
                                if (targets[i] === game.me) player.setIdentity(event.else.identity[i])
                                targets[i].update()
                            }; break;
                            case 103: {
                                var hp1 = player.hp, hp2 = targets[i].hp, mp1 = player.maxHp, mp2 = targets[i].maxHp
                                player.maxHp = mp2
                                player.hp = hp2
                                player.update()
                                targets[i].maxHp = mp1
                                targets[i].hp = hp1
                                targets[i].update()
                            }; break;
                            case 153: {
                                if (targets[i].isTurnedOver()) targets[i].turnOver()
                            }; break;
                            case 163: {
                                if (!targets[i].isTurnedOver()) targets[i].turnOver()
                            }; break;
                            case 173: {
                                targets[i].turnOver()
                            }; break;
                            //伤害事件   
                            case 4: targets[i].damage(num, 'fire', player); break;
                            case 14: targets[i].damage(num, 'thunder', player); break;
                            case 24: targets[i].damage(num, 'ice', player); break;
                            case 34: targets[i].damage(num, 'kami', player); break;
                            case 44: {
                                if (event.else.nature && event.else.nature.length) {
                                    var nature = event.else.nature[0]
                                    targets[i].damage(num, nature, player)
                                }
                                else targets[i].damage(num, player)
                            }; break;
                            case 54: {
                                targets[i].addSkill("xjb_pojia")
                                if (event.else.nature && event.else.nature.length) {
                                    var nature = event.else.nature[0]
                                    targets[i].damage(num, nature, player)
                                }
                                else targets[i].damage(num, player)
                            }; break;
                            //技能事件   
                            case 5: case 23: {
                                if (result.control && event.unique.contains('choose')) {
                                    targets[i].addSkill(result.control)
                                }
                                else {
                                    for (var a = 0; a < event.else.skills.length; a++) {
                                        targets[i].addSkill(event.else.skills[a])
                                    }
                                }
                            }; break;
                            case 15: case 33: targets[i].addSkill(event.else.skills[i]); break;
                            case 25: case 83: {
                                var expire = { player: "phaseAfter" }
                                if (event.else.expire) expire = event.else.expire
                                if (result.control && event.unique.contains('choose')) {
                                    var str = result.control
                                    if (event.unique.contains('ootSkill')) expire = { player: str + "After" }
                                    targets[i].addTempSkill(str, expire)
                                }
                                else {
                                    for (var a = 0; a < event.else.skills.length; a++) {
                                        var str = event.else.skills[a]
                                        if (event.unique.contains('ootSkill')) expire = { player: str + "After" }
                                        targets[i].addTempSkill(str, expire)
                                    }
                                }
                            }; break;
                            case 35: case 133: {
                                if (result.control && event.unique.contains('choose')) {
                                    targets[i].awakenSkill(result.control);
                                }
                                else {
                                    if (!event.else.awaken) event.else.awaken = []
                                    for (var a = 0; a < event.else.awaken.length; a++) {
                                        targets[i].awakenSkill(event.else.awaken[a])
                                    }
                                }
                            }; break;
                            case 45: case 143: {
                                if (result.control && event.unique.contains('choose')) {
                                    targets[i].removeSkill(result.control);
                                }
                                else {
                                    if (!event.else.remove) event.else.remove = []
                                    for (var a = 0; a < event.else.remove.length; a++) {
                                        targets[i].removeSkill(event.else.remove[a])
                                    }
                                }
                            }; break;
                            //卡牌事件    
                            case 6: case 183: {
                                if (!event.else.toUseCard) event.else.toUseCard = []
                                for (var a = 0; a < event.else.toUseCard.length; a++) {
                                    player.useCard(event.else.toUseCard[a], targets[i])
                                }
                            }; break;
                            case 16: {
                                var cards = []
                                for (var a = 0; a < event.num; a++) {
                                    var card = game.createCard(event.else.remnant)
                                    cards.push(card)
                                }
                                targets[i].gain(cards, "gain2")
                                targets[i].loseToSpecial(cards, '_xjb_remnantArea')
                                targets[i].popup(get.translation("_xjb_remnantArea"))
                            } break;
                            case 26: {
                                if (!event.else.toTopCard) event.else.toTopCard = []
                                while (event.else.toTopCard.length > 0) {
                                    ui.cardPile.insertBefore(event.else.toTopCard.pop(), ui.cardPile.firstChild);
                                }
                                targets[i].$throw(event.else.toTopCard, 1000);
                                game.log(targets[i], '将', event.else.toTopCard, '置于牌堆顶')
                            }; break;
                            case 36: if (event.else.toDiscard) targets[i].discard(event.else.toDiscard); break;
                            case 46: {
                                if (targets[i].countCards("h") > num) {
                                    targets[i].chooseToDiscard(targets[i].countCards("h") - num, true)
                                }
                                else if (targets[i].countCards("h") < num) {
                                    if (event.else.toTagCard) targets[i].gain(get.cards(num - targets[i].countCards("h")), "draw").gaintag.
                                        add(event.else.toTagCard)
                                    else targets[i].gain(get.cards(num - targets[i].countCards("h")), "draw")
                                }
                            }; break;
                            //特效事件   
                            case 7: {
                                targets[i].addSkill('xjb_zhuanzhuan')
                            }; break;
                        }
                    }
                }
                if (event.unique.contains('again')) {
                    if (event.else.redo.length) {
                        event.do = event.else.redo.shift()
                        if (event.else.redo2.length) {
                            event.num = event.else.redo2.shift()
                        }
                        event.redo()
                    }
                }
                'step 4'
                game.updateRoundNumber();
                //5区调控事件
                if (event.change.length) {
                    for (var a = 0; a < event.change.length; a++) {
                        switch (event.change[a][0]) {
                            case 0: event.do = event.change[a][1]; break;
                            case 1: event.num = event.change[a][1]; break
                            case 2: event.count = event.change[a][1]; break
                            case 3: event.ban = event.change[a][1]; break
                            case 4: event.unique = event.change[a][1]; break
                            case 6: event.control = event.change[a][1]; break
                            case 7: event.else = event.change[a][1]; break
                        }
                    }
                }
                'step 5'
                //6区调控5区
                if (event.count > 0) {
                    event.change = event.control
                    event.goto(1)
                }
                else player.storage._skill_xin_X = [event.do, 1, 1, event.ban, [], [], []]//重置数据
            },
        }

    },
            },
            "_xjb_remnantArea":{
                mod:{
                    "cardEnabled2":function (card, player) {
            var remnant = player.getCards("s").filter(i => {
                return i.hasGaintag("_xjb_remnantArea")
            });
            if (remnant.contains(card)) return false
        },
                },
                trigger:{
                    player:"phaseJudgeBefore",
                },
                filter:function (event, player) {
        return player.getCards("s").filter(i => {
            return i.hasGaintag("_xjb_remnantArea")
        }).length > 0
    },
                forced:true,
                content:function () {
        "step 0"
        let list = {}
        let remnantArea = player.getCards("s").filter(i => {
            return i.hasGaintag("_xjb_remnantArea")
        })
        remnantArea.forEach(i => {
            let a = i.name
            if (!list[i.name]) list[a] = []
            list[a].push(i)
        })
        for (let k in list) {
            let a = Math.floor(list[k].length / 2)
            let b = list[k].length % 2
            if (lib.card[k].type === "delay") {
                if (!player.canAddJudge(k)) continue;
                else if (list[k].length > 1) {
                    a = 1
                    b = list[k].length - 2
                }
            }
            while (list[k].length > b) {
                list[k].pop().discard()
            }
            for (let c = 0; c < a; c++) {
                player.useCard(game.createCard(k), player,false)
                player.popup("残【" + get.translation(k) + "】")
            }

        }
        player.updateMarks()
    },
            },
            "_UseHpCard":{
                trigger:{
                    global:"gameStart",
                },
                filter:function (event, player) {
        if (!lib.config.xjb_hun) return false
        var name = player.name1
        if (!lib.config.xjb_count[name]) return false
        if (!lib.config.xjb_count[name].HpCard || !lib.config.xjb_count[name].HpCard.length) return false
        if (!(player === game.me || player.isUnderControl())) return false
        return true
    },
                forced:true,
                content:function () {
        "step 0"
        var name = player.name1
        var list = game.countHpCard(lib.config.xjb_count[name].HpCard)
        var hpCard = new Array(1, 2, 3, 4, 5).map(function (i) {
            return (i + game.createHpCard(i).innerHTML)
        })
        var next = player.chooseButton(['请选择你使用的体力牌', [hpCard, "tdnodes"]], [1, Infinity])
        next.filterButton = function (button) {
            var player = _status.event.player
            return lib.config.xjb_count[player.name1].HpCard.contains(
                get.xjb_number(button.link[0])
            )
        }
        "step 1"
        if (result.bool) {
            result.links.forEach(function (i) {
                player.useHpCard(get.xjb_number(i[0]))
            })
        }
    },
            },
            "xjb_lingpiao":{
                trigger:{
                    global:["xjb_addlingliBefore"],
                },
                check:function (event, player) {
        return get.attitude(player, event.player) < 0                   
    },
                filter:function (event, player) {
        return event.lingliSource !== "card";
    },
                content:function () {
        "step 0"
        trigger.cancel()
        let card = game.createCard("xjb_lingliCheck", 'heart', 13 - trigger.num)
        card.storage.xjb_allowed = true
        trigger.player.gain("gain2", card)
        trigger.player.xjb_eventLine(1)
    },
            },
            "xjb_guifan":{
                enable:"chooseToUse",
                limited:true,
                content:function () {
                    player.awakenSkill("xjb_guifan")
                    player.xjb_readStorage()
                },
                ai:{
                    order:2,
                    save:true,
                    result:{
                        player:function (player) {
                            if (player.hp <= 0) return 10;
                            if (player.hp <= 1 && player.countCards('he') <= 1) return 10;
                            return 0;
                        },
                    },
                },
                mark:true,
                intro:{
                    content:"limited",
                },
                skillAnimation:true,
                init:function(player,skill){
                    player.storage[skill]=false;
                },
            },
            "xjb_minglou":{
                enable:"phaseUse",
                content:function () {
        player.xjb_saveStorage()
    },
                ai:{
                    order:9,
                    save:true,
                    result:{
                        player:function (player) {
                let targetMother = get.xjb_storage(player, 1)
                if (!targetMother) return 10;
                let target = targetMother.character
                let score = 0
                score += (player.hp - target.hp) * 2;
                score += (player.hujia - target.hujia) * 2;
                score += (player.maxHp - target.maxHp)
                score += ((!player.isLinked()) - (!target.isLinked))
                score += ((!player.isTurnedOver()) - (!target.isTurnOvered)) * 5
                function countCards() {
                    return target.h.length + target.e.length + target.j.length + target.s.length + target.x.length
                }
                score += (player.countCards('hejsx') - countCards())
                player.popup('存档收益' + (score > 0 ? '+' : '') + score)
                return score;
            },
                    },
                },
            },
            "xjb_soul_fuhua":{
                enable:"chooseToUse",
                filter:function (event, player) {
        if (lib.config.xjb_count[player.name1].kind != "血族") return false
        if (event.type === 'dying') {
            if (player != event.dying) return false;
            return true;
        }
    },
                content:function () {     
        'step 0'
        player.recover(1 - player.hp);
        'step 1'
        player.removeSkill(event.name)
        player.addSkill('xjb_soul_yiying')
        var src = lib.xjb_src + "sink/xjb_xuemo/"        
        ui.xjb_giveStyle(player.node.avatar, {
            "background-image": "url('" + src + "xuemo4.jpg')" 
        });
        'step 2'
        lib.skill._unique_talent_xjb.load.push(function(){
            game.players.forEach(current=>{
                current.removeSkill('xjb_soul_yiying')
            })            
        })       
    },
                ai:{
                    save:true,
                },
            },
            "xin_xueqi":{
                trigger:{
                    source:"damageBefore",
                },
                check:function (event, player) {
        if (get.attitude(player, event.player) > 0) return false;
        if (player.hp >= event.player.hp) return false
        return true
    },
                content:function () {
        'step 0'
        //交换体力牌
        player.fc_X(103, true, {
            onlyme: [trigger.player]
        })  
        'step 1'
        player.chooseTarget(1,'你选择一名其他角色进入血色空间').set("filterTarget",function(card,player,target){
            return player!=target
        }).set('ai',function(target){
            return -get.attitude(player,target);
        })
        'step 2'
        if(result.bool)result.targets.forEach(target=>{
            //进入血色空间
            target.addTempSkill('xjb_P_blood',{player:"phaseBegin"})        
        })
    },
            },
            "xjb_soul_yiying":{
                onremove:function (player) {
        if(player.storage.xjb_PreImage){
            ui.xjb_giveStyle(player.node.avatar, {
               "background-image":player.storage.xjb_PreImage
           })
        }
        player.addSkill('xjb_soul_fuhua')
    },
                enable:["chooseToUse","chooseToRespond"],
                viewAs:{
                    name:"shan",
                    isCard:true,
                },
                filterCard:card => false,
                selectCard:-1,
                mark:false,
                prompt:"视为使用或打出一张【闪】",
                onuse:function(event,player){
        let next=game.createEvent('xjb_soul_yiying')
        next.player=player
        next.setContent(function(){
            'step 0'
            player.chooseTarget(1).set("filterTarget",function(card,player,target){
            return player!=target
            })
            'step 1'
            if(result.bool)game.swapSeat(player,result.targets[0]);
        })
    },
                ai:{
                    order:3,
                    basic:{
                        useful:[7,5.1,2],
                        value:[7,5.1,2],
                    },
                    result:{
                        player:1,
                    },
                },
            },
            "xjb_soul_chanter":{
                enable:"phaseUse",
                usable:1,
                filterCard:true,
                nextDo:function(player,skill){
        game.print(player,skill)
        let next=game.createEvent("chant")
        next.player = player       
        next.skill = skill        
        next.setContent(function(){
            "step 0"
            game.resume()
            event.player.xjb_addSkillCard(event.skill)                                             
        })
        game.resume()
    },
                content:function(){
        "step 0"
        game.pause()
        let num=0
        while(lib.skill['chant'+num]!==undefined){
            num++
        }
        game.xjb_skillEditor()        
        player.addTempSkill('xjb_P_gathering',{player:"phaseBegin"})
        let touch=new TouchEvent("touchend", {  
                bubbles: true,
                cancelable: true,
                composed: true
        })
        let skill="chant" + num
        lib.translate[skill]="咏唱"+num
        new Promise(res=>{
                let list=('chant'+num).split(''),a=0                
                let timer=setInterval(i=>{
                     if(a===list.length){
                         res()
                         clearInterval(timer)
                         game.xjb_back.ele.id.submit()                         
                         return
                     }
                     game.xjb_back.ele.id.value+=list[a]                                        
                     a++
                },100)
            }).then(data=>{
                return new Promise(res=>{
                    setTimeout(i=>{
                        game.xjb_back.ele.kinds[0].click()
                        game.xjb_back.ele.kinds[0].dispatchEvent(touch)
                        game.xjb_back.ele.types[1].click()
                        game.xjb_back.ele.types[1].dispatchEvent(touch)
                        res()
                    },200)
                })
            }).then(data=>{
                return new Promise(res=>{
                   setTimeout(i=>{
                        game.xjb_back.ele.mode[2].click()
                        game.xjb_back.ele.mode[2].dispatchEvent(touch)
                        res()
                    },200)
                })
            }).then(data=>{
                return new Promise(res=>{
                    setTimeout(i=>{
                        game.xjb_back.ele.nextPage.click()
                        game.xjb_back.ele.nextPage.dispatchEvent(touch)
                        res()
                    },200)
                })
            }).then(data=>{
                return new Promise(res=>{
                    let list=['你已受伤','你未受伤','你体力不小于3'].randomGet()+'整理',a=0
                    lib.translate[skill+"_info"]=list
                    let timer=setInterval(i=>{                                          
                         if(a===list.length){
                             res(game.xjb_back.ele.filter.value)
                             clearInterval(timer)
                             game.xjb_back.ele.filter.submit()                            
                             return
                         }
                         game.xjb_back.ele.filter.value+=list[a]    
                         a++
                    },100)
                })
            }).then(data=>{
                return new Promise(res=>{
                     setTimeout(i=>{
                        game.xjb_back.ele.nextPage.click()
                        game.xjb_back.ele.nextPage.dispatchEvent(touch)
                        res(data)
                    },200)
                })
            }).then(data=>{
                return new Promise(res=>{
                    let list=['你摸两张牌','你恢复一点体力','你获得一点护甲',
                    '你卜算两张','你移动场上一张牌','你失去一点体力','你随机弃置两张牌'].randomGet()+'整理',a=0
                    lib.translate[skill+"_info"]+=list
                    let timer=setInterval(i=>{
                        if(a===list.length){
                             res()
                             clearInterval(timer)
                             game.xjb_back.ele.content.submit()
                             return
                         }
                         game.xjb_back.ele.content.value+=list[a]                                               
                         a++
                    },100)
                })
            }).then(data=>{
                return new Promise(res=>{
                    setTimeout(i=>{
                        game.xjb_back.ele.nextPage.click()
                        game.xjb_back.ele.nextPage.dispatchEvent(touch)
                        res()
                    },200)
                })
            }).then(data=>{
                return new Promise(res=>{
                    let list=['当一名角色受到伤害后',
                              '当你受到伤害后','当你回合结束后','当你成为杀的目标后'].randomGet()+'整理',a=0
                    lib.translate[skill+"_info"]+=list
                    let timer=setInterval(i=>{
                         if(a===list.length){
                             res()
                             clearInterval(timer)
                             game.xjb_back.ele.trigger.submit()
                             return
                         }
                         game.xjb_back.ele.trigger.value+=list[a]                                               
                         a++
                    },100)
                })
            }).then(data=>{
                return new Promise(res=>{
                    setTimeout(i=>{
                        game.xjb_back.ele.nextPage.click()
                        game.xjb_back.ele.nextPage.dispatchEvent(touch)
                        res()
                    },200)
                })
            }).then(data=>{
                return new Promise(res=>{
                    setTimeout(i=>{
                        let produce=new Function('lib',game.xjb_back.target.value)
                        produce(lib)    
                        game.xjb_back.remove()       
                        for(let k in lib.skill[skill]){
                            lib.skill[skill][k] = lib.skill[skill][k]
                        }
                        let arr=lib.translate[skill+'_info'].split('整理')
                        lib.translate[skill+'_info']="锁定技，"+arr[2]+'，若'+arr[0]+'，'+arr[1]+'。'
                        res()
                    },300)
                })
            }).then(data=>{
                lib.skill.xjb_soul_chanter.nextDo(player,skill)
            })           
        
    },
                ai:{
                    order:4,
                    result:{
                        player:2,
                    },
                },
            },
        },
        translate:{
            "xin_jincui":"尽瘁",
            "xin_jincui_info":"每轮限一次，回合开始前，你可以弃置你全域内两张牌，然后将等量火【杀】置于武将牌上。当前回合后你额外执行一个回合。",
            "xin_chushi":"出师",
            "xin_chushi_info":"出牌阶段限一次，你可选择是否对一名角色依次使用你武将牌上的所有牌。",
            "xin_yeling":"谒陵",
            "xin_yeling_info":"锁定技，你的准备阶段，你可以进行一次判定，你使用与判定牌同名的<b description=[即在你的残区中置入一张“与判定牌同名”的牌。残区:你的判定阶段前，你的残区中每有两张同名的牌且这些牌可对自己使用，你移去这些牌并对自己使用一张同名的实体牌]>残牌。</b>",
            "xin_huanshi":"蓄发",
            "xin_huanshi_info":"当一张牌判定牌生效前，你可以将任意张牌置于牌堆顶，然后从牌堆底摸等量张牌。",
            "xin_bianzhu":"权揽",
            "xin_bianzhu_info":"一张梅花判定牌生效后，若场上仍有谒陵技能的角色，你可额外进行一个回合。你第一次发动该技能后，你获得如下效果：<br>你每对一名角色使用一张非装备牌，其使用1～3张与此牌同名的<b description=[即在你的残区中置入1～3张“与此牌同名的”牌。残区:你的判定阶段前，你的残区中每有两张同名的牌且这些牌可对自己使用，你移去这些牌并对自己使用一张同名的实体牌]>残牌</b>。",
            "xin_zhabing":"诈病",
            "xin_zhabing_info":"<b>限定技</b>，你的回合开始时，若你已受伤，你可以跳过此回合并获得技能“权揽”。场上所有其他角色视为拥有\"谒陵\"直到其第一次发动。",
            "xin_huzhu":"护主",
            "xin_huzhu_info":"当一名其他角色使用【杀】指定目标时，你可以选择以下一项执行之：⑴弃置一张牌，目标角色摸两张牌；⑵失去一点体力，目标角色获得1个“护”。 ",
            "xin_huzhu2":"护主",
            "xin_huzhu2_info":"<i>护：你可以在需要时，视为使用或打出一张【闪】。若此做，你摸一张牌并移去1个“护”。</i> ",
            "xin_xiongli":"凶力",
            "xin_xiongli_info":"出牌阶段限一次，你可以对任意名其他角色造成一点破甲伤害，若此做，对自己使用等量张<b description=[即在你的残区中置入“等量张”【杀】。残区:你的判定阶段前，你的残区中每有两张同名的牌且这些牌可对自己使用，你移去这些牌并对自己使用一张同名的实体牌]>残【杀】。</b>",
            "xin_mousheng":"谋圣",
            "xin_mousheng_info":"锁定技，你亮出拼点牌时，你拼点牌点数+X(X为游戏轮数)",
            "xin_fq1":"放权1",
            "xin_fq1_info":"",
            "xin_fq2":"放权2",
            "xin_fq2_info":"",
            "xin_fq3":"放权3",
            "xin_fq3_info":"",
            "xin_fangquan":"放权",
            "xin_fangquan_info":"出牌阶段限一次，你可弃置至多三张牌并令一名其他无\"放权系列标记\"的角色额外进行一个回合，若你弃置的牌数为1/2/3，则其分别获得标记\"放权1\"/\"放权2\"/\"放权3\"。<br><br>放权系列标记：<li>放权1：跳过摸牌阶段、弃牌阶段、结束阶段<br><li>放权2：跳过判定阶段、出牌阶段、弃牌阶段<br><li>放权3：跳过准备阶段、弃牌阶段、结束阶段",
            "xin_baisu":"白素",
            "xin_baisu_info":"君主技，锁定技，蜀势力的角色回合结束后，若其本回合有跳过的阶段，你与其各摸一张牌。",
            "xin_xiangle":"享乐",
            "xin_xiangle_info":"你受到伤害后，可令一名非当前回合角色(无放权系列标记)获得一个“放权1”/\"放权2\"标记，然后其额外进行一个回合。",
            "xin_zhibang":"置棒",
            "xin_zhibang_info":"你的准备阶段和你对一名角色造成伤害后，你可以将该角色区域内一张牌置于你的武将牌上，称为“棒\"。若此做，你摸一张牌。",
            "xin_chuhui":"除秽",
            "xin_chuhui_info":"出牌阶段，若你\"棒\"数量≥5，你可令一名角色获得全部的\"棒\"并对其造成2点伤害。",
            "xin_bingjie":"秉节",
            "xin_bingjie_info":"1.一名角色准备阶段前，你可以弃置所有手牌，你令该角色将手牌调至体力上限<br>2.你受到一点伤害后，你可令一名角色将手牌调至体力上限。<br>因该技能获得的牌均记为\"留香\"。",
            "xin_shiyin":"识音",
            "xin_shiyin_info":"弃牌阶段后，若你弃置的牌均为：基本牌/锦囊牌/装备牌，场上所有角色：恢复1点体力/失去1点体力/受到一点火属性伤害。",
            "xin_liuxiang":"留香",
            "xin_liuxiang_info":"一名角色每失去X次\"留香\"牌后，你可以令其恢复一点体力值。(X为其体力值)",
            "xin_yexi":"夜袭",
            "xin_yexi_info":"出牌阶段，你可弃置一花色的所有手牌并弃置一名角色等量张牌。然后你横置或重置。",
            "xin_ziruo":"自若",
            "xin_ziruo_info":"当你成为其他角色的牌的目标时，你可为此牌减少任意名未横置的目标，然后这些目标横置。",
            "xin_guixin":"归心",
            "xin_guixin_info":"当你受到一点伤害后，你可获得与造成伤害的实体牌同名的牌然后摸一张牌。",
            "xin_tanyan":"谈讌",
            "xin_tanyan_info":"君主技，场上其他角色的出牌阶段，其向你展示所有手牌，然后令你恢复一点体力(已满改为摸两张牌)，其再不能发动此技能。",
            "xin_fengtian":"挥鞭",
            "xin_fengtian_info":"结束阶段，若你还有带有伤害标签的牌，你可以摸两张牌然后额外执行一个出牌阶段。",
            "xin_niepan":"涅槃",
            "xin_niepan_info":"每回合限一次，你濒死时/出牌阶段时，你若你手牌数为奇数，你可摸一张牌；手牌数为偶数，你恢复一点体力。",
            "xin_tianming":"天命",
            "xin_tianming_info":"锁定技，当你失去一张区域的牌后，若你有未记录该牌的花色，你记录之并摸一张牌。",
            "xin_zulong":"祖龙",
            "xin_zulong_info":"当你体力值减少后，可以你获得一个技能。若此技能为觉醒技，则无视发动条件。",
            "xin_duice":"对策",
            "xin_duice_info":"出牌阶段限三次，你可以与一名角色拼点，若你赢，你将拼点牌作为一张随机的锦囊牌使用。然后拼点双方获得其区域内所有牌。",
            "xin_qizuo":"奇佐",
            "xin_qizuo_info":"当一名角色使用一张带有伤害标签的牌前，你可以弃置至少一张牌并将你弃置的牌加入对应的实体牌中，然后你选择一项:1.此牌造成伤害+1;2.此牌造成伤害为1。",
            "xin_zaozhong":"遗计",
            "xin_zaozhong_info":"名臣技，当你受到一点伤害后，你选择一名角色，其使用三张<b description=[即在你的残区中置入三张【兵粮寸断】。残区:你的判定阶段前，你的残区中每有两张同名的牌且这些牌可对自己使用，你移去这些牌并对自己使用一张同名的实体牌]>残【兵粮寸断】</b>然后摸五张牌。",
            "xin_taoni":"讨逆",
            "xin_taoni_info":"出牌阶段，你可以弃置一张♦️牌并选择一名未横置的角色，该角色横置然后你摸一张牌；你对已横置的角色使用牌无次数限制。",
            "xin_jiang":"激昂",
            "xin_jiang_info":"当你造成伤害及受到伤害后，涉及的角色各摸X张牌(X为已横置的角色，X至多为3)",
            "xin_yingyi":"英义",
            "xin_yingyi_info":"君主技，锁定技，场上每有一名吴势力角色，你激昂的X值便+1。",
            "xin_whlw":"毒士",
            "xin_whlw_info":"每有一名在你回合内进入濒死阶段，你则摸一张牌，若其死亡，你再摸一张牌。你进入濒死阶段后，你摸一张牌。",
            "xin_qns":"急救",
            "xin_qns_info":"你可以将一张红色牌当做【桃】使用。若此时，你的手牌数<3，你摸一张牌。",
            "xin_whlw1":"帷幄",
            "xin_whlw1_info":"锁定技，当你受到非锦囊牌的伤害-1;你受到锦囊牌造成的伤害前，你摸两张牌。",
            "xin_whlw2":"完杀",
            "xin_whlw2_info":"锁定技。①你的回合内，不处于濒死状态的角色不能使用【桃】。②当有角色于你的回合内进入濒死状态时，你摸一张牌。",
            "xin_htzjq2":"铁骑",
            "xin_htzjq2_info":"当你使用【杀】指定一名角色为目标后，你令其选择失去一点体力/体力上限。",
            "xjb_leijue":"雷诀",
            "xjb_leijue_info":"出牌阶段，你可以弃置一张黑桃牌，然后对一名角色造成1点雷属性伤害。",
            "xjb_xinsheng":"新生",
            "xjb_xinsheng_info":"出牌阶段，你可以弃置三张手牌令一名角色复活。",
            "xjb_lunhui":"灵愈",
            "xjb_lunhui_info":"当你濒死时，你可以恢复三点体力然后弃置全区域内两张牌。",
            "xin_lianhuan":"连环",
            "xin_lianhuan_info":"出牌阶段限一次，你可令X名角色横置或重置。(X为你的体力值)",
            "xjb_liuli":"流离",
            "xjb_liuli_info":"当你受到伤害前，你可交给另一名其他角色一张♦️牌，若此做，你令伤害来源改为这名角色并令其重新分配伤害(每名角色至多1点伤害)",
            "xjb_guose":"国色",
            "xjb_guose_info":"出牌阶段限一次，你可以选择一名判定区无牌的角色，然后你摸X张牌(X为场上的牌数)并将其中的非♦️牌当做任意一张延时锦囊牌置于其判定区内。",
            "xin_longpan":"龙蟠",
            "xin_longpan_info":"你的回合后，若你已有四种花色，你可以移去\"天命\"中的全部个花色，若此做，你令一名角色失去一点体力并摸四张牌。",
            "xin_enyuan":"恩怨",
            "xin_enyuan_info":"①当你一次因一名其他角色获得两张牌时，你可以令其摸一张牌；②当你受到伤害后，你可以令伤害来源失去等量点体力并获得其等量张牌。",
            "xjb_fuyi":"辅翼",
            "xjb_fuyi_info":"每轮开始时，你可以使用一张【逐鹿天下】。<br>一名角色每回合指定有装备的角色为唯一目标时，其可以交给你至少一张手牌(若为你则改为弃置)，其令此牌多指定等量个目标。",
            "xjb_sicuan":"倒置",
            "xjb_sicuan_info":"每轮限一次，你可令一名角色的两种事件颠倒进行",
            "xin_yingfa":"英发",
            "xin_yingfa_info":"出牌阶段限一次，你可以失去一点体力，令一名角色失去一种类型的所有牌，你随机获得其中一张牌。",
            "xjb_1":"<font color=red>player</font>",
            "xjb_1_info":"",
            "xjb_2":"<font color=red>event</font>",
            "xjb_2_info":"",
            "xjb_3":"<font color=red>skill</font>",
            "xjb_3_info":"",
            "xjb_4":"<font color=red>card</font>",
            "xjb_4_info":"",
            "xjb_5":"<font color=red>title</font>",
            "xjb_5_info":"",
            "xjb_6":"<font color=red>character</font>",
            "xjb_6_info":"",
            "xjb_7":"<font color=red>other</font>",
            "xjb_7_info":"",
            "xjb_8":"<font color=red>play</font>",
            "xjb_8_info":"",
            "xjb_9":"<font color=red>project</font>",
            "xjb_9_info":"",
            "xjb_final":"<font color=red>final</font>",
            "xjb_final_info":"",
            "xjb_10":"<font color=red>win</font>",
            "xjb_10_info":"",
            "xjb_11":"<font color=red>soul</font>",
            "xjb_11_info":"",
            "xjb_12":"<font color=red>draw</font>",
            "xjb_12_info":"",
            "xjb_13":"<font color=red>editor</font>",
            "xjb_13_info":"",
            "xjb_14":"<font color=red>X_skill</font>",
            "xjb_14_info":"",
            "_xjb_remnantArea":"<font color=gold>残区</font>",
            "_xjb_remnantArea_info":"",
            "_UseHpCard":"<font color=gold>体力牌</font>",
            "_UseHpCard_info":"",
            "xjb_lingpiao":"灵票",
            "xjb_lingpiao_info":"一名其他角色灵力增加时，你可取消之，并用一张【灵力支票】代替。<br>产生【灵力支票】的消耗由此角色支付。",
            "xjb_guifan":"归返",
            "xjb_guifan_info":"出牌阶段，你可以读档。",
            "xjb_minglou":"铭镂",
            "xjb_minglou_info":"出牌阶段，你可以存档。",
            "xjb_soul_fuhua":"蝠化",
            "xjb_soul_fuhua_info":"人形状态技：<br>当你濒死时，你体力回复至1点并进入一轮蝙蝠状态。",
            "xin_xueqi":"血契",
            "xin_xueqi_info":"当你对一名角色造成伤害时，你可以与该角色交换体力牌。若此做，你指定一名角色进入<b description=[进入该空间后，灵力会全部转化为魔力，角色在其回合内使用牌混乱。]>血色空间</b>。",
            "xjb_soul_yiying":"移影",
            "xjb_soul_yiying_info":"蝙蝠状态技:<br>你可以在需要时，视为使用或打出一张【闪】。",
            "xjb_soul_chanter":"吟咏",
            "xjb_soul_chanter_info":"出牌阶段限一次，你可以弃置一张卡牌并进入<b description=[进入该空间后，灵力最大可以达到100Ch，在该区域内的的伤害会被魔力吸收，作用到角色上负收益翻倍。]>聚灵区</b>，然后你进行一次<b description=[打开技能编辑器，令系统在线编写并生成一个锁定技，你该技能对应的技能牌置于阵法区]>吟咏</b>。",
        },
    },
    intro:"<a href=https://gitee.com/xinyuanwm/new-jiang class=xjb_hunTitle>扩展已上传至git！</a>",
    author:"新元",
    diskURL:"",
    forumURL:"",
    version:"1.1.8.080723",
},files:{"character":["xjb_fazheng.jpg"],"card":["xin_qixing.png"],"skill":[]}}})