import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
export const soulSkill = {};
export const soulTranslate = {};
function SkillCreater(name, skill) {
    soulSkill[name] = { ...skill }
    delete soulSkill[name].translate;
    delete soulSkill[name].description;
    soulTranslate[name] = skill.translate;
    soulTranslate[name + "_info"] = skill.description
    return soulSkill[name];
};

const xjb_soul_fuhua = SkillCreater(
    "xjb_soul_fuhua", {
    enable: "chooseToUse",
    filter: function (event, player) {
        if (lib.config.xjb_count[player.name].kind != "血族") return false
        if (event.type === 'dying') {
            if (player != event.dying) return false;
            return true;
        }
    },
    content: function () {
        'step 0'
        player.recover(1 - player.hp);
        'step 1'
        player.removeSkill(event.name);
        player.addTempSkill('xjb_soul_yiying', "roundStart");
        player.node.avatar.classList.add('xjb-becomeBat');
    },
    ai: {
        save: true,
    },
    translate: "蝠化",
    description: "当你濒死时，你体力回复至1点并进入一轮蝙蝠状态。",
});
const xjb_soul_yiying = SkillCreater(
    "xjb_soul_yiying", {
    onremove: function (player) {
        player.node.avatar.classList.remove('xjb-becomeBat')
        player.addSkill('xjb_soul_fuhua')
    },
    enable: ["chooseToUse", "chooseToRespond"],
    viewAs: {
        name: "shan",
        isCard: true,
    },
    filterCard: card => false,
    selectCard: -1,
    mark: false,
    prompt: "视为使用或打出一张【闪】",
    onuse: function (event, player) {
        let next = game.createEvent('xjb_soul_yiying_swapSeat')
        next.player = player
        next.setContent(function () {
            'step 0'
            player.chooseTarget(1).set("filterTarget", function (card, player, target) {
                return player != target
            })
            'step 1'
            if (result.bool) game.swapSeat(player, result.targets[0]);
        })
    },
    ai: {
        order: 3,
        basic: {
            useful: [7, 5.1, 2],
            value: [7, 5.1, 2],
        },
        result: {
            player: 1,
        },
    },
    translate: "移影",
    description: "蝙蝠状态技:<br>你可以在需要时，视为使用或打出一张【闪】。",
});
const xjb_soul_xueqi = SkillCreater(
    "xjb_soul_xueqi", {
    trigger: {
        source: "damageBefore",
    },
    check: function (event, player) {
        if (get.attitude(player, event.player) > 0) return false;
        if (player.hp >= event.player.hp) return false
        return true
    },
    filter(event, player) {
        return event.player != player;
    },
    content() {
        'step 0'
        //交换体力牌
        player.xjb_swapHpCard(trigger.player);
        'step 1'
        player.chooseTarget(1, '你选择一名其他角色进入血色空间').set("filterTarget", function (card, player, target) {
            return player != target
        }).set('ai', function (target) {
            return -get.attitude(player, target);
        })
        'step 2'
        if (result.bool) result.targets.forEach(target => {
            //进入血色空间
            target.addTempSkill('xjb_P_blood', { player: "phaseAfter" })
        })
    },
    translate: "血契",
    description: "当你对一名其他角色造成伤害前，你可以与该角色交换一张体力牌。若此做，你指定一名角色进入血色空间。",
});
const xjb_soul_fuhong = SkillCreater(
    "xjb_soul_fuhong", {
    enable: "phaseUse",
    usable: 1,
    filterTarget: function (card, player, target) {
        if (!(player.inRange(target))) return false;
        return true;
    },
    content: function () {
        'step 0'
        if (!target.xjb_HpCardArea) target.xjb_adjustHpCard();
        const area = target.xjb_HpCardArea.map((content, index) => {
            return [index, game.xjb_createHpCard(content.obv).outerHTML]
        });
        if (area.length > 1) {
            player.chooseButton([
                `你选择${get.translation(target)}的一张体力牌，令此体力牌牌翻面。`,
                [area, "tdnodes"]
            ])
        } else {
            target.xjb_turnOverHpCard(0);
            event.finish()
        }
        'step 1'
        if (result.bool) {
            target.xjb_turnOverHpCard(result.links[0])
        } else {
            player.storage.counttrigger["xjb_soul_fuxue"] -= 1
        }
    },
    translate: "覆红",
    description: "出牌阶段限一次,你可以翻转你攻击范围内一名角色的一张体力牌。"
})
const xjb_soul_hongxi = SkillCreater(
    "xjb_soul_hongxi", {
    enable: "phaseUse",
    usable: 1,
    content: function () {
        'step 0'
        if (!player.xjb_HpCardArea) player.xjb_adjustHpCard();
        const area = player.xjb_HpCardArea.map((content, index) => {
            return [index, game.xjb_createHpCard(content.obv).outerHTML, content.obv]
        }).filter(item => {
            return item[2] > 1;
        });
        console.log(area)
        if (area.length > 1) {
            player.chooseButton([
                `你选择${get.translation(player)}的一张体力牌，将此体力牌用等额的体力牌替换之。`,
                [area, "tdnodes"]
            ])
        } else {
            player.xjb_splitHpCard(area[0][0]);
            event.finish();
        }
        'step 1'
        if (result.bool) {
            player.xjb_splitHpCard(result.links[0])
        } else {
            player.storage.counttrigger["xjb_soul_fuxue"] -= 1
        }
    },
    translate: "红析",
    description: "出牌阶段限一次,你可以拆分一张体力牌。"
})

const xjb_soul_minglou = SkillCreater(
    "xjb_soul_minglou", {
    translate: "铭镂",
    description: "出牌阶段，你可以存档。",
    enable: "phaseUse",
    content: function () {
        player.xjb_saveStorage()
    },
    ai: {
        order: 9,
        save: true,
        result: {
            player: function (player) {
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
});
const xjb_soul_guifan = SkillCreater(
    "xjb_soul_guifan", {
    translate: "归返",
    description: "出牌阶段，你可以读档。",
    enable: "chooseToUse",
    limited: true,
    content: function () {
        player.awakenSkill("xjb_soul_guifan")
        player.xjb_readStorage()
    },
    ai: {
        order: 2,
        save: true,
        result: {
            player: function (player) {
                if (player.hp <= 0) return 10;
                if (player.hp <= 1 && player.countCards('he') <= 1) return 10;
                return 0;
            },
        },
    },
    mark: true,
    intro: {
        content: "limited",
    },
    skillAnimation: true,
    init: function (player, skill) {
        player.storage[skill] = false;
    },
})

const xjb_soul_chanter = SkillCreater(
    "xjb_soul_chanter", {
    translate: "吟咏",
    description: "出牌阶段限一次，你可以弃置一张卡牌并进入<b description=[进入该空间后，灵力最大可以达到100Ch，在该区域内的的伤害会被魔力吸收，作用到角色上负收益翻倍。]>聚灵区</b>，然后你进行一次<b description=[打开技能编辑器，令系统在线编写并生成一个锁定技，你该技能对应的技能牌置于阵法区]>吟咏</b>。",
    enable: "phaseUse",
    usable: 1,
    filterCard: true,
    nextDo: function (player, skill) {
        let next = game.createEvent("chant")
        next.player = player
        next.skill = skill
        next.setContent(function () {
            "step 0"
            game.resume()
            event.player.xjb_addSkillCard(event.skill)
        })
        game.resume()
    },
    async content(event, trigger, player) {
        player.addTempSkill('xjb_P_gathering', { player: "phaseBegin" })
        game.pause()
        let num = 0;
        const element = ui.xjb_domTool;
        while (lib.skill['chant' + num] !== undefined) {
            num++
        }
        game.xjb_skillEditor()
        let touch = new TouchEvent("touchend", {
            bubbles: true,
            cancelable: true,
            composed: true
        })
        event.skillId = event.skillId || ("chant" + num)
        let skill = event.skillId
        lib.translate[skill] = event.skillCnName || ("咏唱" + num)
        let functionList = {
            submitID: function (res) {
                let list = (skill).split(''), a = 0
                //输入id
                let timer = setInterval(i => {
                    if (a === list.length) {
                        res();
                        clearInterval(timer);
                        game.xjb_back.ele.id.submit();
                        return;
                    }
                    game.xjb_back.ele.id.value += list[a];
                    a++;
                }, 100)
            },
            nextPage: function (res) {
                setTimeout(i => {
                    game.xjb_back.ele.nextPage.click()
                    game.xjb_back.ele.nextPage.dispatchEvent(touch)
                    res()
                }, 200)
            }
        }
        new Promise(res => {
            //这里是第一页内容
            functionList.submitID(res)
        }).then(data => {
            return new Promise(res => {
                setTimeout(i => {
                    element().setTarget(game.xjb_back.ele.kinds[0])
                        .clickAndTouch()
                        .setTarget(game.xjb_back.ele.types[1])
                        .clickAndTouch()
                    res()
                }, 200)
            })
        }).then(data => {
            return new Promise(res => {
                setTimeout(i => {
                    element().setTarget(game.xjb_back.ele.modes[2])
                        .clickAndTouch()
                    res()
                }, 200)
            })
        }).then(data => {
            //这里换页了，第二页
            return new Promise(res => {
                functionList.nextPage(res)
            })
        }).then(data => {
            return new Promise(res => {
                let list = XJB_EDITOR_LIST['filter'].randomGet(), a = 0
                lib.translate[skill + "_info"] = `${list}整理`
                let timer = setInterval(i => {
                    if (a === list.length) {
                        res(game.xjb_back.ele.filter.value)
                        clearInterval(timer)
                        element().setTarget(game.xjb_back.ele.filter)
                            .callMethod("arrange")
                            .callMethod("submit");
                        return
                    }
                    game.xjb_back.ele.filter.value += list[a]
                    a++
                }, 100)
            })
        }).then(data => {
            //第三页
            return new Promise(res => {
                functionList.nextPage(res)
            })
        }).then(data => {
            return new Promise(res => {
                let list = XJB_EDITOR_LIST['effect'].randomGet(), a = 0
                lib.translate[skill + "_info"] += `${list}整理`
                let timer = setInterval(i => {
                    if (a === list.length) {
                        res();
                        clearInterval(timer);
                        element().setTarget(game.xjb_back.ele.content)
                            .callMethod("arrange")
                            .callMethod("submit");
                        return;
                    }
                    game.xjb_back.ele.content.value += list[a];
                    element().setTarget(game.xjb_back.ele.content)
                        .callMethod("submit");
                    a++
                }, 100)
            })
        }).then(data => {
            //第四页
            return new Promise(res => {
                functionList.nextPage(res)
            })
        }).then(data => {
            return new Promise(res => {
                let list = XJB_EDITOR_LIST['trigger'].randomGet(), a = 0
                lib.translate[skill + "_info"] += `${list}整理`
                let timer = setInterval(i => {
                    if (a === list.length) {
                        res()
                        clearInterval(timer)
                        element().setTarget(game.xjb_back.ele.trigger)
                            .callMethod("arrange")
                            .callMethod("submit");
                        return
                    }
                    game.xjb_back.ele.trigger.value += list[a]
                    a++
                }, 100)
            })
        }).then(data => {
            //第五页
            return new Promise(res => {
                functionList.nextPage(res)
            })
        }).then(data => {
            return new Promise(res => {
                setTimeout(i => {
                    let produce = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', game.xjb_back.target.value)
                    produce(_status, lib, game, ui, get, ai)
                    game.xjb_back.remove()
                    for (let k in lib.skill[skill]) {
                        lib.skill[skill][k] = lib.skill[skill][k]
                    }
                    let arr = lib.translate[skill + '_info'].split('整理')
                    if (arr[1].includes("继承")) {
                        arr[1] = arr[1].replace("继承", "");
                        arr[1] = arr[1].replace(/[^a-z]/gi, "")
                        arr[1] = `你"${get.translation(arr[1])}(${arr[1]})"一次`;
                    }
                    lib.translate[skill + '_info'] = "锁定技，" + arr[2] + '，若' + arr[0] + '，' + arr[1] + '。'
                    lib.translate[skill + '_info'] = lib.translate[skill + '_info'].replace(/\s/g, "")
                    res()
                }, 300)
            })
        }).then(data => {
            get.info(event.name).nextDo(player, skill)
        })
    },
    ai: {
        order: 4,
        result: {
            player: 2,
        },
    },
})

const xjb_soul_lingpiao = SkillCreater(
    "xjb_soul_lingpiao", {
    translate: "灵票",
    description: "一名其他角色灵力增加时，你可取消之，并用一张【灵力支票】代替。<br>产生【灵力支票】的消耗由此角色支付。",
    trigger: {
        global: ["xjb_addlingliBefore"],
    },
    check: function (event, player) {
        return get.attitude(player, event.player) < 0
    },
    filter: function (event, player) {
        return event.lingliSource !== "card";
    },
    content: function () {
        "step 0"
        trigger.cancel()
        let card = game.createCard("xjb_lingliCheck", 'heart', 13 - trigger.num)
        card.storage.xjb_allowed = true
        trigger.player.gain("gain2", card)
        trigger.player.xjb_eventLine(1)
    },
})



