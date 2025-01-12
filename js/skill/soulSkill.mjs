import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
export const soulSkill = {};
export const soulTranslate = {};
/**
 * 
 * @param {string} name 
 * @param {Skill} skill 
 * @returns 
 */
function SkillCreater(name, skill) {
    soulSkill[name] = { ...skill }
    delete soulSkill[name].translate;
    delete soulSkill[name].description;
    soulTranslate[name] = skill.translate;
    soulTranslate[name + "_info"] = skill.description
    if (skill.subTrans) {
        for (const subname in skill.subTrans) {
            const [trans, info] = skill.subTrans[subname];
            soulTranslate[name + "_" + subname] = trans;
            soulTranslate[name + "_" + subname + "_info"] = info;
        }
        delete soulSkill[name].subTrans;
    }
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
    async content(event, trigger, player) {
        player.xjb_turnOverPlayerHpCard(target, true);
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
    description: "出牌阶段限一次，你可以进行一次<b description=[打开技能编辑器，令系统在线编写并生成一个锁定技]>吟咏</b>。",
    enable: "phaseUse",
    usable: 1,
    async content(event, trigger, player) {
        //player.addTempSkill('xjb_P_gathering', { player: "phaseBegin" })
        let num = 0;
        const element = ui.xjb_domTool;
        while (lib.skill['chant' + num] !== undefined) {
            num++
        }
        game.xjb_skillEditor(false);
        const touch = new TouchEvent("touchend", {
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
        try {
            // 第一页内容
            await new Promise(res => functionList.submitID(res));
            // 模拟点击和触摸操作
            await new Promise(res => setTimeout(() => {
                element().setTarget(game.xjb_back.ele.kinds[0])
                    .clickAndTouch()
                    .setTarget(game.xjb_back.ele.types[1])
                    .clickAndTouch();
                res();
            }, 200));

            // 选择模式
            await new Promise(res => setTimeout(() => {
                element().setTarget(game.xjb_back.ele.modes[2])
                    .clickAndTouch();
                res();
            }, 200));

            // 换页到第二页
            await new Promise(res => functionList.nextPage(res));

            // 处理过滤器
            await new Promise(res => {
                let list = XJB_EDITOR_LIST['filter'].randomGet(), a = 0;
                lib.translate[skill + "_info"] = `${list}整理`;
                let timer = setInterval(() => {
                    if (a === list.length) {
                        res(game.xjb_back.ele.filter.value);
                        clearInterval(timer);
                        game.xjb_back.ele.filter.arrange();
                        game.xjb_back.ele.filter.submit();
                        return;
                    }
                    game.xjb_back.ele.filter.value += list[a];
                    a++;
                }, 100);
            });

            // 换页到第三页
            await new Promise(res => functionList.nextPage(res));

            // 处理效果
            await new Promise(res => {
                let list = XJB_EDITOR_LIST['effect'].randomGet(), a = 0;
                lib.translate[skill + "_info"] += `${list}整理`;
                let timer = setInterval(() => {
                    if (a === list.length) {
                        res();
                        clearInterval(timer);
                        game.xjb_back.ele.content.arrange();
                        game.xjb_back.ele.content.submit();
                        return;
                    }
                    game.xjb_back.ele.content.value += list[a];
                    game.xjb_back.ele.content.submit();
                    a++;
                }, 100);
            });

            // 换页到第四页
            await new Promise(res => functionList.nextPage(res));

            // 处理触发器
            await new Promise(res => {
                let list = XJB_EDITOR_LIST['trigger'].randomGet(), a = 0;
                lib.translate[skill + "_info"] += `${list}整理`;
                let timer = setInterval(() => {
                    if (a === list.length) {
                        res();
                        clearInterval(timer);
                        game.xjb_back.ele.trigger.arrange();
                        game.xjb_back.ele.trigger.submit();
                        return;
                    }
                    game.xjb_back.ele.trigger.value += list[a];
                    a++;
                }, 100);
            });

            // 换页到第五页
            await new Promise(res => functionList.nextPage(res));

            // 最后处理
            await new Promise(res => setTimeout(() => {
                let produce = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', game.xjb_back.target.value);
                produce(_status, lib, game, ui, get, ai);
                game.xjb_back.remove();
                for (let k in lib.skill[skill]) {
                    lib.skill[skill][k] = lib.skill[skill][k];
                }
                let arr = lib.translate[skill + '_info'].split('整理');
                if (arr[1].includes("继承")) {
                    arr[1] = arr[1].replace("继承", "");
                    arr[1] = arr[1].replace(/[^a-z]/gi, "");
                    arr[1] = `你"${get.translation(arr[1])}(${arr[1]})"一次`;
                }
                lib.translate[skill + '_info'] = "锁定技，" + arr[2] + '，若' + arr[0] + '，' + arr[1] + '。';
                lib.translate[skill + '_info'] = lib.translate[skill + '_info'].replace(/\s/g, "");
                res();
            }, 300));
            const card = game.xjb_createSkillCard(skill);
            await player.gain(card, "gain2");
        } catch (error) {
            console.error("Error processing skill:", error);
        }
    },
    ai: {
        order: 4,
        result: {
            player: 2,
        },
    },
})
const xjb_soul_miracle = SkillCreater(
    "xjb_soul_miracle", {
    translate: "神迹",
    description: "限定技，出牌阶段，你可以获得一个神圣技能卡。",
    enable: "phaseUse",
    usable: 1,
    limited: true,
    async content(event, trigger, player) {
        const list = lib.card.xjb_skillCard.SanSkill.map(id => game.xjb_createSkillCard(id))
        const { bool, links } = await player.chooseButton(['选择一张神圣技能牌', [list, "vcard"]]).forResult();
        if (bool) {
            player.awakenSkill("xjb_soul_miracle");
            await player.gain(links[0], "gain2");
        }
        else player.getStat().skill.xjb_soul_miracle--;
    },
    ai: {
        order: 4,
        result: {
            player: 2,
        },
    }
})


const xjb_soul_zhigong = SkillCreater(
    "xjb_soul_zhigong", {
    translate: "智工",
    description: "限定技，出牌阶段，你可以在你的下位增加一名角色并令其摸四张牌。你获得〖智工主人〗，其获得〖智工仆从〗",
    enable: "phaseUse",
    limited: true,
    skillAnimation: true,
    seatRelated: true,
    changeSeat: true,
    usable: 1,
    async content(event, trigger, player) {
        player.awakenSkill(event.name);
        const characters = Object.keys(lib.character)
            .removeArray([...game.players, ...game.dead].map(curr => [curr.name1, curr.name2]).flat())
            .randomGets(3)
        const [targetName] = await player.chooseButton([
            "为你的智工仆从选择一张武将牌",
            [characters, "character"]
        ])
            .set("forced", true)
            .forResult("links");
        const target = game.addPlayer(Number(player.dataset.position) + 1);
        target.getId();
        target.init(targetName)
        await target.draw(4);
        player.addSkill("xjb_soul_zhigong_host");
        target.addSkill("xjb_soul_zhigong_servant");
        target.markAuto("xjb_soul_zhigong_servant", player);
    },
    derivation: ["xjb_soul_zhigong_host", "xjb_zhigong_servant"],
    subTrans: {
        host: ["智工主人", "你可以使用或打出一名智工仆从的手牌。"],
        servant: ["智工仆从", "你跳过出牌阶段和弃牌阶段，取消对智工主人的伤害。"],
    },
    subSkill: {
        host: {
            nobracket: true,
            //目前不知道这样的写法会出什么样的问题
            hiddenCard(player, name) {
                const target = game.findPlayer(curr => curr.hasSkill("xjb_soul_zhigong_servant"));
                if (!target) return false;
                if (!target.storage.xjb_soul_zhigong_servant) return false;
                if (!target.storage.xjb_soul_zhigong_servant.includes(player)) return false;
                return target.hasCard(name, "h");
            },
            enable: ["chooseToUse", "chooseToRespond"],
            filter: function (event, player) {
                const target = game.findPlayer(curr => curr.hasSkill("xjb_soul_zhigong_servant"));
                if (!target) return false;
                if (!target.storage.xjb_soul_zhigong_servant) return false;
                if (!target.storage.xjb_soul_zhigong_servant.includes(player)) return false;
                return target.hasCard(card => event.filterCard(get.autoViewAs(card), player, event), "h");
            },
            direct: true,
            chooseButton: {
                dialog: (event, player) => {
                    const targets = game.filterPlayer(curr =>
                        curr.hasSkill("xjb_soul_zhigong_servant")
                        && curr.storage.xjb_soul_zhigong_servant
                        && curr.storage.xjb_soul_zhigong_servant.includes(player)
                    );
                    const list = []
                    for (const target of targets) {
                        list.push(get.translation(target));
                        list.push([target.getCards("h"), "vcard"]);
                    }
                    return ui.create.dialog("智工", ...list);
                },
                filter: (button, player) => {
                    const evt = _status.event.getParent()
                    return evt.filterCard(
                        get.autoViewAs(button),
                        player,
                        evt
                    )
                },
                backup: (links, player) => {
                    return {
                        filterCard: () => false,
                        selectCard: -1,
                        precontent() {
                            delete event.result.skill;
                            event.result.cards = event.result.card.cards.slice(0);
                        },
                        viewAs: get.autoViewAs(links[0])
                    }
                }
            },
        },
        servant: {
            nobracket: true,
            mark: true,
            marktext: "仆",
            intro: {
                name: "智工-仆从",
                content: "我是$的智能机械仆从。"
            },
            trigger: {
                player: ["phaseUseBefore", "phaseDiscardBefore", "dieAfter"],
                source: "damageSource"
            },
            filter(event, player) {
                if (event.name === "damage"
                    && !event.player.hasSkill("xjb_soul_zhigong_host")
                    && !player.storage.xjb_soul_zhigong_servant.includes(event.player)) return false;
                return true;
            },
            forceDie: true,
            charlotte: true,
            superCharlotte: true,
            forced: true,
            async content(event, trigger, player) {
                if (trigger.name === "die") {
                    game.removePlayer(player);
                    return;
                }
                trigger.cancel();
            }
        }
    },
});
const xjb_soul_jihuo = SkillCreater(
    "xjb_soul_jihuo", {
    enable: "phaseUse",
    translate: "激活",
    description: "出牌阶段，你可以移去一名“智工仆从”体力点的灵力，为其设置一个身份，并令其可自由活动。",
    filter(event, player) {
        return game.hasPlayer(curr => {
            return curr.hasSkill("xjb_soul_zhigong_servant")
                && curr.storage.xjb_soul_zhigong_servant
                && curr.storage.xjb_soul_zhigong_servant.includes(player)
                && player.xjb_countLingli() >= curr.hp;
        })
    },
    filterTarget(card, player, target) {
        return target.hasSkill("xjb_soul_zhigong_servant")
            && target.storage.xjb_soul_zhigong_servant
            && target.storage.xjb_soul_zhigong_servant.includes(player)
            && player.xjb_countLingli() >= target.hp;
    },
    async content(event, trigger, player) {
        player.xjb_loseLingli(event.target.hp);
        const identityList = game.getIdentityList(event.target);
        if (identityList) delete identityList.cai;
        const { result: { links, bool } } = await player.chooseButton([
            "请为" + get.translation(event.target) + "设置一个身份",
            [Object.entries(identityList), "tdnodes"]
        ]);
        if (bool) {
            event.target.removeSkill("xjb_soul_zhigong_servant");
            event.target.identity = links[0];
            event.target.showIdentity();
        }
    }
})