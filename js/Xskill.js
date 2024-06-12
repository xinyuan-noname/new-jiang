window.XJB_LOAD_Xskill = function (_status, lib, game, ui, get, ai) {
    lib.skill.xjb_13 = {
        "X_skill": function () {
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
                if (![2, 32, 183].includes(number) && number % 10 !== 4) {
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
                    if (event.unique.includes('num_2') && event.do % 10 !== 3) {
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
                    if (event.unique.includes('choose')) {
                        var choice
                        if (event.else.skills && event.do === 23) choice = event.else.skills
                        if (event.else.identity && event.do === 43) choice = event.else.identity
                        if (event.unique.includes('needResult')) choice = event.else.choice
                        if (event.unique.includes('getNumber')) choice = event.else.getNumber
                        var next = player.chooseControl(choice)
                        var chopro = event.else.chopro || '请选择一项'
                        next.set('prompt', chopro)
                        next.set('ai', function () {
                            return choice.randomGet()
                        })
                    }
                    //检测用途，指定角色分支
                    if (!event.unique.includes('onlyme')) {
                        var next = player.chooseTarget([1, num1])
                        next.set('prompt', name)
                        next.set('filterTarget', function (card, player, target) {
                            if (event.ban.includes(target)) return false
                            if (event.do === 11 && target.hp === target.maxHp) return false;
                            if (event.do === 2 && target.countCards('he') === 0) return false;
                            if (event.do === 32 && target.countCards('he') === 0) return false;
                            if (event.do === 42 && target.countCards('he') === 0) return false;
                            if (event.do === 3 && !target.isLinked()) return false;
                            if (event.do === 13 && target.isLinked()) return false;
                            if (event.unique.includes('linked') && !target.isLinked()) return false;
                            if (event.unique.includes('other') && target === player) return false;
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
                                if (theNum1.includes(event.do)) return get.attitude(player, target);
                                if (theNum2.includes(event.do)) return -get.attitude(player, target);
                            })
                        }
                    }
                    'step 3'
                    //选择分支
                    if (event.unique.includes('needResult')) {
                        player.storage._skill_xin_X = [event.do, 1, 1, event.ban, [], [], []]
                        if (event.else.storage) {
                            var storage = event.else.storage
                            player.storage[storage] = result.control;
                        }
                        event.finish()
                    }
                    else if (event.unique.includes('getNumber')) {
                        event.do = Number(result.control) === result.control ? result.control : 1
                    }
                    //事件分支
                    //角色处理
                    if (result.bool && result && result.targets) var targets = result.targets.slice(0)
                    if (event.unique.includes('onlyme')) {
                        var targets = event.else.onlyme ? event.else.onlyme : [player]
                    }
                    //再执行处理
                    if (!event.unique.includes('num_2') && event.else.redo2) {
                        var tarlen = event.else.redo2.length
                        if (event.unique.includes('again') && targets.length > event.else.redo2[tarlen]) targets.length = event.else.redo2[tarlen] || 1
                    }
                    //执行事件
                    if (targets && targets.length) {
                        player.skill_X = { targets: targets }
                        if (event.unique.includes('num_2') && event.do % 10 !== 3) {
                            var num = event.num
                        }
                        else var num = 1
                        for (var i = 0; i < targets.length; i++) {
                            if (event.unique.includes('noskill_temp')) targets[i].addTempSkill('skill_noskill')
                            if (event.unique.includes('usechenSkill')) targets[i].usechenSkill()
                            if (event.unique.includes('S')) targets[i].changeS2(true)
                            if (event.unique.includes('deS')) targets[i].changeS2()
                            if (event.unique.includes('changeS_1')) targets[i].changeS(1)
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
                                    if (result.control && event.unique.includes('choose')) identity = result.control
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
                                    if (result.control && event.unique.includes('choose')) {
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
                                    if (result.control && event.unique.includes('choose')) {
                                        var str = result.control
                                        if (event.unique.includes('ootSkill')) expire = { player: str + "After" }
                                        targets[i].addTempSkill(str, expire)
                                    }
                                    else {
                                        for (var a = 0; a < event.else.skills.length; a++) {
                                            var str = event.else.skills[a]
                                            if (event.unique.includes('ootSkill')) expire = { player: str + "After" }
                                            targets[i].addTempSkill(str, expire)
                                        }
                                    }
                                }; break;
                                case 35: case 133: {
                                    if (result.control && event.unique.includes('choose')) {
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
                                    if (result.control && event.unique.includes('choose')) {
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
                    if (event.unique.includes('again')) {
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

        }
    }
}