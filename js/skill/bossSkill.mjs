export const bossSkill = {};
export const bossTranslate = {};
function SkillCreater(name, skill) {
    bossSkill[name] = { ...skill }
    delete bossSkill[name].translate;
    delete bossSkill[name].description;
    bossTranslate[name] = skill.translate;
    bossTranslate[name + "_info"] = skill.description
    return bossSkill[name];
};
const _xjb_soulBoss_load = SkillCreater(
    "_xjb_soulBoss_load", {
    mode: ["boss"],
    trigger: {
        global: "gameStart",
    },
    direct: true,
    charlotte: true,
    filter: function (event, player) {
        return lib.translate[player.name1].includes("魂使");
    },
    content: function () {
        let list = {
            '战狂魂使': [
                () => true,
                current => current.gain(game.createCard2("xjb_shenshapo", "", 1), "gain2"),
                '3.该魂使开局获得一张【神杀破】'
            ],
            '旋风魂使': [
                () => true,
                current => current.node.avatar.classList.add('xjb_tranEndless')
            ],
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
            1.场上超过其体力上限的角色体力均压制至1;<br>\
            2.魂使进入阵法〖自若〗〖灵票〗<br>\
            "+ extraStr, function () {
                if (!judgeOk) game.resume()
            })
        }
        inform()
        ui.create.system("关卡提示", inform)
        player.reinit(player.name1, player.name1)
    }
})
const xjb_soulBoss_fuyao = SkillCreater(
    "xjb_soulBoss_fuyao", {
    trigger: {
        player: ["phaseDrawBegin2"],
    },
    frequent: true,
    persevereSkill: true,
    charlotte: true,
    content: function () {
        "step 0"
        trigger.num *= 3
        game.filterPlayer(cur => cur != player).randomGet().addTempSkill("xjb_zhuanzhuan", "roundStart")
    },
    translate: "扶摇",
    description: "持恒技，charlotte技，摸牌阶段，你多摸两倍的牌，然后令随机一名其他角色进入旋转状态。"
})

/*旋转状态*/
const xjb_zhuanzhuan = SkillCreater(
    "xjb_zhuanzhuan", {
    trigger: {
        player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
    },
    mark: true,
    marktext: "转",
    intro: {
        name: "转转",
        content: '转啊转啊......'
    },
    direct: true,
    content: function () {
        if (trigger.name == "phaseZhunbei") {
            if (player == game.me) {
                ui.arena.classList.add('xjb_tranEndless');
            }
            player.node.avatar.classList.add('xjb_tranEndless')
        }
        else {
            ui.arena.classList.remove('xjb_tranEndless');
            player.node.avatar.classList.remove('xjb_tranEndless')
            player.removeSkill(event.name)
        }
    },
})

