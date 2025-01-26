"use script"
import { _status, lib, ui, game, ai, get } from "../../../../noname.js"
/**
 * 
 * @param {string} name 
 * @param {Skill} skill 
 * @returns 
 */
function SkillCreater(name, skill) {
    lib.skill[name] = { ...skill }
    delete lib.skill[name].translate;
    delete lib.skill[name].description;
    lib.translate[name] = skill.translate;
    lib.translate[name + "_info"] = skill.description
    return lib.skill[name];
};
/**
 * 
 * @param {string} name 
 * @param {object} param1 
 * @param {function(this:Player)} param1.player
 * @param {function} param1.content
 */
const setEvent = (name, { player, content }) => {
    lib.element.Player.prototype[name] = get.copy(player)
    lib.element.content[name] = get.copy(content)
};
const setEventLike = (name, method) => {
    lib.element.Player.prototype[name] = get.copy(method)
}
const addPlayerMethod = (name, method) => {
    lib.element.Player.prototype[name] = get.copy(method)
};

lib.element.card.xjb_Becolorful = function () {
    this.style.border = "1.5px solid black"
    this.classList.add("xjb_color_circle")
}
game.xjb_createSkillCard = function (id, colorful) {
    const info = lib.card.xjb_skillCard
    const isSanSkill = info.SanSkill.includes(id)
    info.cardConstructor(id, isSanSkill);
    info.skillLeadIn(id);
    const card = game.createCard(id + "_card");
    card.dataset.xjb_skillCard = true;
    if (colorful) card.xjb_Becolorful();
    return card;
}

addPlayerMethod("xjb_hasSkillCard", function (postion = "h", includeNoSkill) {
    const player = this;
    return player.countCards(postion, (card, player) => {
        if (includeNoSkill && get.name(card) === "xjb_skillCard") return true;
        return card.dataset.xjb_skillCard;
    }) > 0;
})
addPlayerMethod("xjb_countSkillCard", function (postion = "h", includeNoSkill) {
    const player = this;
    return player.countCards(postion, (card, player) => {
        if (includeNoSkill && get.name(card) === "xjb_skillCard") return true;
        return card.dataset.xjb_skillCard;
    })
})
addPlayerMethod("xjb_getSkillCard", function (postion = "h", includeNoSkill) {
    const player = this;
    return player.getCards(postion, (card, player) => {
        if (includeNoSkill && get.name(card) === "xjb_skillCard") return true;
        return card.dataset.xjb_skillCard;
    })
})
setEvent("xjb_discardSkillCard", {
    player: function (select = 1) {
        const player = this;
        const next = game.createEvent('xjb_discardSkillCard')
        next.player = this;
        next.select = select;
        next.setContent('xjb_discardSkillCard');
        return next
    },
    content: function () {
        "step 0"
        const skillCard = player.xjb_getSkillCard("x");
        if (skillCard.length) player.chooseButton(["选择从阵法中移除的技能牌", skillCard], event.select, true)
        else event.finish();
        "step 1"
        if (result && result.links) {
            player.gain(result.links, "gain2")
        }
    },
})
setEvent("xjb_chooseSkillToCard", {
    player: function (...args) {
        const player = this;
        const next = game.createEvent("xjb_chooseSkillToCard");
        for (const arg of args) {
            if (get.itemtype(arg) === "player") next.target = arg;
            else if (get.itemtype(arg) === "select") next.select = arg;
            else if (typeof arg === "boolean") next.forced = true;
            else if (typeof arg === "number") next.select = [arg, arg];
            else if (typeof arg === "function") next.filterSkill = arg;
        }
        next.player = player;
        if (!next.target) next.target = player;
        if (!next.select) next.select = [1, 1];
        next.setContent("xjb_chooseSkillToCard");
        return next
    },
    content: function () {
        "step 0"
        const skills = target.getSkills(null, false, false).filter(skill => {
            const info = get.info(skill);
            if (event.filterSkill) return event.filterSkill(skill);
            return !info.sourceSkill && !info.sub
        }).map(skill => {
            return [skill, `〖${get.plainText(lib.translate[skill])}〗(${skill})${lib.translate[skill + "_info"]}`]
        });
        let prompt;
        if (event.select[0] !== event.select[1]) prompt = `选择${get.cnNumber(event.select[0])}到${get.cnNumber(event.select[1])}项技能`
        else prompt = `选择${get.cnNumber(event.select[0])}项技能`;
        player.chooseButton([
            prompt,
            [skills, "tdnodes"]
        ], event.select, event.forced)
        "step 1"
        if (result.bool && result.links && result.links.length) {
            target.removeSkill(result.links);
            const cards = []
            for (const skill of result.links) {
                const card = game.xjb_createSkillCard(skill);
                cards.push(card)
            }
            player.gain(cards)
        }
        event.result = { bool: result.bool, skills: result.links }
    }
})
setEvent("xjb_chant", {
    player: function (...args) {
        const player = this;
        const next = game.createEvent("xjb_chant");
        for (const arg of args) {
            if (Array.isArray(arg)) next.tags = arg;
            else if (typeof arg === "string") next.skillId = arg;
        }
        if (!next.skillId) {
            let i;
            for (i = 0; lib.skill['chant' + i] !== undefined; i++);
            next.skillId = "chant" + i;
            next.skillCnName = "咏唱" + i
        }
        next.player = player;
        next.setContent("xjb_chant");
        return next
    },
    content: async function (event, trigger, player) {
        game.xjb_skillEditor(false);
        const touch = new TouchEvent("touchend", {
            bubbles: true,
            cancelable: true,
            composed: true
        })
        const skill = event.skillId
        if (event.skillCnName) game.broadcastAll(skill => {
            lib.translate[skill] = event.skillCnName
        }, skill);
        const functionList = {
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
                //设置触发技
                game.xjb_back.skill.kind = "trigger";
                //设置强制发动标签
                if (event.tags && event.tags.includes("forced")) game.xjb_back.skill.type.push("forced");
                game.xjb_back.organize();
                res();
            }, 200));
            // 选择模式
            await new Promise(res => setTimeout(() => {
                game.xjb_back.skill.mode = 'mainCode';
                game.xjb_back.organize();
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
                let arr = lib.translate[skill + '_info'].split('整理');
                if (arr[1].includes("继承")) {
                    arr[1] = arr[1].replace("继承", "");
                    arr[1] = arr[1].replace(/[^a-z]/gi, "");
                    arr[1] = `你"${get.translation(arr[1])}(${arr[1]})"一次`;
                }
                let description = '';
                if (event.tags && event.tags.includes("forced")) description += "锁定技，"
                description += arr[2] + '，若' + arr[0] + '，' + arr[1] + '。'
                lib.translate[skill + '_info'] = description;
                lib.translate[skill + '_info'] = lib.translate[skill + '_info'].replace(/\s/g, "");
                res();
            }, 300));
            const card = game.xjb_createSkillCard(skill);
            await player.gain(card, "gain2");
        } catch (error) {
            console.error("Error processing skill:", error);
        }
    }
})

const xjb_skillCardObserver = SkillCreater(
    "xjb_skillCardObserver", {
    trigger: {
        player: ["phaseBefore"],
        global: ["loseAfter", "loseAsyncAfter", "equipAfter", "addJudgeAfter", "gainAfter", "loseAsyncAfter", "addToExpansionAfter", "roundStart"]
    },
    charlotte: true,
    superCharlotte: true,
    direct: true,
    forced: true,
    silent: true,
    observeList: [],
    getSkill: (player, has) => {
        return get.info("xjb_skillCardObserver").observeList.filter(skillId => {
            if (has) return player.hasSkill(skillId)
            return !player.hasSkill(skillId)
        });
    },
    getCanLose: (player) => {
        const result = [];
        const list = get.info("xjb_skillCardObserver").getSkill(player, true);
        for (const card of list) {
            if (!player.countCards("hxs", card)) result.push(card);
        }
        return result;
    },
    getCanGet: (player) => {
        const result = [];
        const list = get.info("xjb_skillCardObserver").getSkill(player)
        for (const card of list) {
            if (player.countCards("hxs", card)) result.push(card)
        }
        return result;
    },
    filter: (event, player) => {
        return get.info("xjb_skillCardObserver").getCanGet(player).length || get.info("xjb_skillCardObserver").getCanLose(player).length;
    },
    content: async function (event, trigger, player) {
        const adds = get.info("xjb_skillCardObserver").getCanGet(player);
        const loses = get.info("xjb_skillCardObserver").getCanLose(player);
        if (adds.length) player.addTempSkill(adds, { player: "dieAfter" });
        if (loses.length) player.removeSkill(loses, { player: "dieAfter" });
    }
})
