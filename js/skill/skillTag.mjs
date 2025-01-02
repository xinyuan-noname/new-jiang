import { lib, game, ui, get, ai, _status } from "../../../../noname.js";

lib.translate.fuSkill = "<b description=福技：首次使用此技能恢复体力并加一点护甲>福技</b>"
lib.translate.luSkill = "<b description=禄技：首次使用此技能摸四张牌>禄技</b>"
lib.translate.shouSkill = "<b description=寿技：首次使用此技能加两点体力上限>寿技</b>"
lib.translate.suidongSkill = "<b description=随动技：因为此技能效果获得牌后可以立即使用该牌>随动技</b>"
lib.translate.qzj = "<b description=强制技：技能结算后,此技能指定的目标角色当前回合失去技能>强制技</b>"
lib.translate.queqiaoxian = "<b description=鹊桥仙：技能结算后,可令一名珠联璧合的异性角色额外结算一次>鹊桥仙</b>"
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
//随动技附魔
SkillCreater(
    "_xjb_suidongSkill", {
    trigger: {
        player: ["gainEnd", "drawEnd"]
    },
    direct: true,
    filter: function (event, player) {
        if (!event.cards) return false;
        if (!lib.config.xjb_skillTag_Character) return false;
        for (let i = 1; i < 9; i++) {
            let theName = event.getParent(i) && event.getParent(i).name;
            if (Object.keys(lib.skill).includes(theName)) {
                if (lib.skill[theName].suidongSkill === true) return true;
            }
        } // 遍历父事件是否为随动技
        return false;
    },
    content: function () {
        "step 0"
        player.chooseUseTarget(trigger.cards[0]); // 选择使用该牌
    }
});

SkillCreater(
    "_xjb_fulushouSkill", {
    trigger: {
        player: "logSkill"
    },
    filter: function (event, player) {
        if (!event.sourceSkill) return false;
        if (!lib.config.xjb_skillTag_Character) return false;
        if (!lib.config.xjb_skillTag_Character.includes(player.name1)
            && !lib.config.xjb_skillTag_Character.includes(player.name2)) return false;
        return true;
    },
    direct: true,
    content: function () {
        if (!player.storage.skillTag_container) {
            player.storage.skillTag_container = {
                fuSkill: [],
                luSkill: [],
                shouSkill: [],
            };
        }
        if (lib.skill[trigger.sourceSkill].fuSkill
            && !player.storage.skillTag_container.fuSkill.includes(trigger.sourceSkill)) {
            player.recover();
            player.changeHujia();
            player.popup("福技");
            player.storage.skillTag_container.fuSkill.add(trigger.sourceSkill);
        }
        if (lib.skill[trigger.sourceSkill].luSkill
            && !player.storage.skillTag_container.luSkill.includes(trigger.sourceSkill)) {
            player.draw(4);
            player.popup("禄技");
            player.storage.skillTag_container.luSkill.add(trigger.sourceSkill);
        }
        if (lib.skill[trigger.sourceSkill].shouSkill
            && !player.storage.skillTag_container.shouSkill.includes(trigger.sourceSkill)) {
            player.gainMaxHp(2);
            player.popup("寿技");
            player.storage.skillTag_container.shouSkill.add(trigger.sourceSkill);
        }
    }
});

SkillCreater(
    "_xjb_qzj", {
    trigger: {
        player: "useSkillAfter"
    },
    filter: function (event, player) {
        // 判断角色
        if (!event.targets) return false;
        if (!event.targets.length) return false;
        if (!event.skill) return false;
        // 判断有没有标签的
        if (!lib.skill[event.skill].qzj) return false;
        return true;
    },
    direct: true,
    content: function () {
        for (let i = 0; i < trigger.targets.length; i++) {
            trigger.targets[i].addTempSkill('skill_noskill');
            trigger.targets[i].popup("强制技");
        }
    }
});

SkillCreater(
    "_xjb_queqiaoxian", {
    trigger: {
        player: "useSkillAfter"
    },
    filter: function (event, player) {
        if (!event.skill) return false;
        if (event.reason === "xjb_queqiaoxian") return false;
        if (!lib.skill[event.skill].queqiaoxian) return false;
        const info = get.info("_xjb_queqiaoxian");
        const osPairs = info.getCP(player, event.skill);
        if (!osPairs.length) return false;
        if (!game.countPlayer(
            cur => osPairs.some(character => `${cur.name1}`.endsWith(character) || `${cur.name2}`.endsWith(character))
        )) return false;
        if (!event.targets || event.targets.some(cur => cur.isDead())) return false;
        return true;
    },
    whoseSkill: function (player, skill) {
        const result = [];
        if (lib.character[player.name1] && game.expandSkills(lib.character[player.name1].skills).includes(skill)) result.push(player.name1);
        if (lib.character[player.name2] && game.expandSkills(lib.character[player.name2].skills).includes(skill)) result.push(player.name2);
        return result;
    },
    getPefectPair: function (characterName = '', characterName2 = '') {
        const result = [];
        for (let one in lib.perfectPair) {
            if (characterName.endsWith(one)) {
                result.push(...lib.perfectPair[one]);
            }
            if (lib.perfectPair[one].some(pair => characterName.endsWith(pair))) {
                result.push(one);
            }
            if (characterName2.endsWith(one)) {
                result.push(...lib.perfectPair[one]);
            }
            if (lib.perfectPair[one].some(pair => characterName2.endsWith(pair))) {
                result.push(one);
            }
        }
        return result;
    },
    filterCharacterNotSameSex: function (player, characterList, names = []) {
        let sex;
        const name1 = names[0], name2 = names[1];
        if (typeof player === 'string') sex = lib.character[player].sex;
        else if (!player.name2) sex = player.sex;
        else if (names.length === 1) sex = lib.character[name1].sex;
        else if (names.length === 2) {
            if (lib.character[name2].sex === lib.character[name1].sex) sex = player.sex;
            else sex = "double";
        }
        return characterList.filter(
            characterName => {
                if (lib.character[characterName]) return sex != lib.character[characterName].sex;
            }
        );
    },
    getCP: function (player, skill) {
        const info = get.info("_xjb_queqiaoxian");
        const names = typeof player === 'string' ? [player] : info.whoseSkill(player, skill);
        const allPairs = info.getPefectPair(...names);
        const osPairs = info.filterCharacterNotSameSex(player, allPairs, names);
        function removeGUICHUN(guichun1, guichun2) {
            if (names.some(name => name.endsWith(guichun1))) {
                osPairs.remove(guichun2);
            }
            if (names.some(name => name.endsWith(guichun2))) {
                osPairs.remove(guichun1);
            }
        }
        removeGUICHUN("mayunlu", 'machao');
        removeGUICHUN("mayunlu", 'mateng');
        removeGUICHUN("zhanglu", 'zhangqiying');
        removeGUICHUN("guanyinping", 'guanyu');
        removeGUICHUN("zhouyu", 'zhouyi');
        removeGUICHUN("wujing", "wuguotai");
        removeGUICHUN("fuwan", "fuhuanghou");
        removeGUICHUN("lvlingqi", "lvbu");
        return osPairs;
    },
    direct: true,
    content: function () {
        "step 0"
        player.popup("鹊桥仙");
        "step 1"
        player.chooseTarget("鹊桥仙", `是否令为有姻缘的珠联璧合角色额外结算一次${get.translation(trigger.skill)}?`)
            .set("filterTarget", function (card, player, target) {
                const info = get.info("_xjb_queqiaoxian");
                const osPairs = info.getCP(player, trigger.skill);
                return osPairs.some(character => (`${target.name1}`).endsWith(character) || (`${target.name2}`).endsWith(character));
            });
        "step 2"
        if (result.bool) {
            result.targets[0].useSkill(trigger.skill, trigger.targets, trigger.cards)
                .set("reason", "xjb_queqiaoxian");
        }
    }
});

SkillCreater(
    "_xjb_queqiaoxian2", {
    trigger: {
        player: ["logSkill"]
    },
    filter: function (event, player) {
        if (!event.sourceSkill) return false;
        if (!lib.skill[event.sourceSkill].queqiaoxian) return false;
        if (!lib.skill[event.skill].content) return false;
        const info = get.info("_xjb_queqiaoxian");
        const osPairs = info.getCP(player, event.sourceSkill);
        if (!osPairs.length) return false;
        if (!game.countPlayer(
            cur => osPairs.some(character => `${cur.name1}`.endsWith(character) || `${cur.name2}`.endsWith(character))
        )) return false;
        const skillEvt = lib.skill[event.skill].direct ?
            event.getParent(event.skill) :
            event.player.getHistory("useSkill", evt => evt.skill === event.skill).at(-1).event;
        if (skillEvt.reason === "xjb_queqiaoxian") return false;
        const playerList = [];
        if (skillEvt.player) playerList.push(skillEvt.player);
        if (skillEvt.targets) playerList.push(...skillEvt.targets);
        if (skillEvt._trigger.source) playerList.push(skillEvt._trigger.source);
        if (skillEvt._trigger.targets) playerList.push(...skillEvt._trigger.targets);
        if (playerList.some(cur => cur.isDead())) return false;
        return true;
    },
    direct: true,
    async content(event, trigger, player) {
        player.popup("鹊桥仙");
        const result = await player.chooseTarget("鹊桥仙", `是否令有姻缘的珠联璧合角色额外结算一次${get.translation(trigger.sourceSkill)}?`)
            .set("filterTarget", function (card, player, target) {
                const info = get.info("_xjb_queqiaoxian");
                const osPairs = info.getCP(player, trigger.sourceSkill);
                return osPairs.some(character => (`${target.name1}`).endsWith(character) || (`${target.name2}`).endsWith(character));
            }).forResult();
        if (result.bool) {
            const skill = trigger.skill;
            const info = get.info(skill);
            const skillEvt = info.direct ?
                trigger.getParent(trigger.skill) : trigger.player.getHistory("useSkill", evt => evt.skill === trigger.skill).at(-1).event;
            const next = game.createEvent(skill);
            if (typeof info.usable == "number") {
                result.targets[0].addSkill("counttrigger");
                if (!result.targets[0].storage.counttrigger) result.targets[0].storage.counttrigger = {};
                if (!result.targets[0].storage.counttrigger[skill]) result.targets[0].storage.counttrigger[skill] = 1;
                else result.targets[0].storage.counttrigger[skill]++;
            }
            next.player = result.targets[0];
            next._trigger = skillEvt._trigger;
            next.triggername = skillEvt.triggername;
            next.setContent(info.content);
            next.skillHidden = skillEvt.skillHidden;
            if (info.forceOut) next.includeOut = true;
            if (get.itemtype(skillEvt.targets) == "players") next.targets = skillEvt.targets.slice(0);
            if (get.itemtype(skillEvt.cards) === "cards") next.cards = skillEvt.cards.slice(0);
            if ("cost_data" in skillEvt) next.cost_data = skillEvt.cost_data;
            next.indexedData = skillEvt.indexedData;
            next.reason = 'xjb_queqiaoxian';
        }
    }
});

SkillCreater(
    "skill_noskill", {
    init: function (player, skills) {
        var name = player.name1, list = lib.character[name][3]
        var skillname = list.randomGet()
        player.xjb_noskill(list)
    },
    onremove: function (player, skills) {
        player.gain_noskill()
    },
    translate: '强制空白',
    description: '锁定技,你的所有技能被封印'
})