window.XJB_LOAD_DRAW = function(_status, lib, game, ui, get, ai) {
    lib.skill.xjb_12 = {
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
    }
}