import {
    xjbSkill,
    xjbTranslate
} from "./skill/xjbSkill.mjs";
import {
    bossSkill,
    bossTranslate
} from "./skill/bossSkill.mjs"
import {
    soulSkill,
    soulTranslate
} from "./skill/soulSkill.mjs"
import { dongzhouSkill, dongzhouTranslate } from "./skill/dongzhou.mjs";
import { _status, lib, game, ui, get, ai } from "../../../noname.js"
import dongzhouIntro from "./text/dongzhouIntro.js";
/**
 * 
 * @param {Status} _status 
 * @param {Library} lib 
 * @param {Game} game 
 * @param {UI} ui 
 * @param {Get} get 
 * @param {AI} ai 
 */

game.import("character", () => {
    const result = {
        name: "xjb_easternZhou",
        connect: true,
        character: {
            //names按照无名杀规则，写成姓+名吧，毕竟屈原写的芈|原，但是为什么不是芈|平？
            "xjb_jizi_shou": {
                sex: "male",
                group: "xjb_chunqiu_wei",
                hp: 3,
                skills: ["xjb_tongzhou", "xjb_fuwei", "xjb_taihuo"],
                trashBin: [],
                names: "姬|伋-姬|寿"
            },
            "xjb_weiyigong": {
                sex: "male",
                group: "xjb_chunqiu_wei",
                hp: 4,
                skills: ["xjb_haohe", "xjb_shiguo"],
                trashBin: [],
                names: "姬|赤"
            },

            "xjb_qixianggong": {
                sex: "male",
                group: "xjb_chunqiu_qi",
                hp: 4,
                skills: ["xjb_xionghu", "xjb_xuechou", "xjb_guaqi"],
                trashBin: [],
                names: "姜|诸儿"
            },
            "xjb_guanyiwu": {
                sex: "male",
                group: "xjb_chunqiu_qi",
                hp: 3,
                skills: ["xjb_zhangwei"],
                trashBin: [],
                names: "姬|夷吾"
            },

            "xjb_qinmugong": {
                sex: "male",
                group: "xjb_qin",
                hp: 4,
                skills: ["xjb_kaidi", "xjb_ranrong"],
                trashBin: [],
                names: "赢|任好"
            },

            "xjb_xunan": {
                sex: "male",
                group: "xjb_chunqiu_jin",
                hp: 3,
                skills: ["xjb_jiatu", "xjb_gugong"],
                trashBin: [],
                names: "姬|黯"
            },
            "xjb_xianzhen": {
                sex: "male",
                group: "xjb_chunqiu_jin",
                hp: 3,
                maxHp: 4,
                skills: ["xjb_xiaojian", "xjb_guizhan"],
                trashBin: [],
            },

            "xjb_wuyuan": {
                sex: "male",
                group: "xjb_chunqiu_wu",
                hp: 3,
                skills: ["xjb_duhen", "xjb_gangli", "xjb_wanxin"],
                trashBin: []
            },
            "xjb_qinshihuang": {
                sex: "male",
                group: "xjb_qin",
                hp: 1,
                hujia: 2,
                skills: ["xjb_zulong", "xjb_longwei"],
                trashBin: [],
                names: "嬴|政"
            },
        },
        characterSort: {
            xjb_easternZhou: {
                xjb_weiqingbuning: ["xjb_jizi_shou", "xjb_weiyigong"],
                xjb_biqizhijiang: ["xjb_qixianggong"],
                xjb_qihuanshouba: ["xjb_guanyiwu"],
                xjb_lijizhiluan: ["xjb_xunan"],
                xjb_jinwenzhiba: ["xjb_xianzhen"],
                xjb_wuyuechunqiu: ["xjb_wuyuan"],
            },
        },
        characterFilter: {},
        characterTitle: {},
        dynamicTranslate: {
            xjb_tongzhou(player) {
                if (lib.skill.xjb_tongzhou.trigger.player === "phaseZhunbeiBegin") return "准备阶段,你可以摸两张牌"
                return "准备阶段和结束阶段,你可以摸两张牌"
            },
            xjb_duhen(player) {
                return [
                    "当你造成伤害时，你可以获得一枚“恨”，令此伤害+1。",
                    "当你使用伤害牌时，你可以获得一枚“恨”，令此牌无法被响应。",
                    "当你受到伤害时，你可以获得一枚“恨”，对伤害来源造成等量点伤害。",
                    "出牌阶段开始前，你可以获得一枚“恨”，令本回合你使用牌无距离限制。",
                    "出牌阶段/濒死阶段，你可以移除〖渡恨〗的一个分项并移去X枚“恨”，然后你回复一点体力。(X为本项你发动的次数)。"
                ].map((option, index) => {
                    if (!get.info("xjb_duhen").canUse(player, index + 1)) return "<s>" + option + "</s>";
                    return option;
                }).join("</br>");
            }
        },
        characterIntro: dongzhouIntro,
        characterReplace: {},
        card: {},
        skill: {
            ...dongzhouSkill
        },
        translate: {
            "xjb_easternZhou": "东周志",

            "xjb_chunqiu_jin": "晋",
            "xjb_chunqiu_qi": "齐",
            "xjb_chunqiu_wei": "卫",
            "xjb_chunqiu_wu": "吴",
            'xjb_qin': '秦',

            "xjb_weiqingbuning": "卫顷不宁",
            "xjb_biqizhijiang": "必齐之姜",
            "xjb_qihuanshouba": "齐桓首霸",
            "xjb_lijizhiluan": "骊姬之乱",
            "xjb_jinwenzhiba": "晋文之霸",
            "xjb_wuyuechunqiu": "吴越春秋",

            "xjb_jizi_shou": "急子&寿",
            "xjb_weiyigong": "卫懿公",
            "xjb_qixianggong": "齐襄公",
            "xjb_guanyiwu": "管夷吾",
            "xjb_qinmugong": "秦穆公",
            "xjb_xunan": "荀黯",
            "xjb_xianzhen": "先轸",
            "xjb_wuyuan": "伍员",
            "xjb_qinshihuang": "秦始皇",
            ...dongzhouTranslate,

            "xjb_huozhi_huo": "货",
            "xjb_guaqi_gua": "瓜",
        },
        pinyins: {},
    }
    const nameNatureMap = {
        //这几个都是姬姓诸侯国
        "xjb_chunqiu_jin": "fire",
        "xjb_chunqiu_wei": "fire",
        //姜齐应当和姬姓诸国一致
        "xjb_chunqiu_qi": "fire",
        //
        "xjb_chunqiu_wu": "qun",
        "xjb_qin": "black",
    }
    lib.config.all.characters.push("xjb_easternZhou");
    for (const [name, nature] of Object.entries(nameNatureMap)) {
        lib.group.push(name);
        lib.groupnature[name] = nature;
    }
    for (const id in result.character) {
        result.character[id].trashBin.push('ext:新将包/image/character_dongzhou/' + id + ".jpg")
    }
    return result;
})
game.import("character", () => {
    /**
     * @type {importCharacterConfig}
     */
    const result = {
        name: "XJB",
        connect: true,
        character: {
            "xin_fellow": {
                sex: "male",
                group: "shen",
                hp: 5,
                skills: [],
                trashBin: [],
                isUnseen: true
            },
            "xjb_daqiao": {
                sex: "female",
                group: "wu",
                hp: 3,
                skills: ["xjb_liuli", "xjb_guose"],
                trashBin: []
            },
            "xjb_sunce": {
                sex: "male",
                group: "wu",
                hp: 4,
                skills: ["xjb_taoni", "jiang", "xjb_yingfa"],
                trashBin: []
            },
            "xjb_guojia": {
                sex: "male",
                group: "wei",
                hp: 3,
                skills: ["xjb_yiji", "xjb_tiandu"],
                trashBin: []
            },
            "xjbhan_caocao": {
                sex: "male",
                group: "xjb_han",
                hp: 4,
                skills: ["xin_zhibang", "xin_chuhui"],
                trashBin: []
            },
            "xjbhan_xunyu": {
                sex: "male",
                group: "xjb_han",
                hp: 3,
                clans: ["颍川荀氏"],
                skills: ["xjb_bingjie", "xjb_liuxiang", "clandaojie"],
                trashBin: []
            },
            "xjb_pangtong": {
                sex: "male",
                group: "shu",
                hp: 3,
                skills: ["xjb_fengchu", "lianhuan"],
                trashBin: []
            },
            "xjb_caocao": {
                sex: "male",
                group: "wei",
                hp: 4,
                skills: ["xjb_jianxiong", "xjb_huibian"],
                trashBin: []
            },
            "xjb_zhouyu": {
                sex: "male",
                group: "wu",
                hp: 3,
                skills: ["xjb_shiyin", "xjb_yingfa", "xjb_ruijin"],
                trashBin: []
            },
            "xjb_liushan": {
                sex: "male",
                group: "shu",
                hp: 5,
                skills: ["xjb_fangquan", "xjb_xiangle"],
                trashBin: []
            },
            "xjb_dianwei": {
                sex: "male",
                group: "wei",
                hp: 4,
                skills: ["xin_huzhu", "xin_xiongli"],
                trashBin: []
            },
            "xjb_ganning": {
                sex: "male",
                group: "wu",
                hp: 4,
                skills: ["xjb_yexi", "xjb_ziruo"],
                trashBin: []
            },
            "xjb_zhugeliang": {
                sex: "male",
                group: "shu",
                hp: 3,
                skills: ["xjb_zhijue", "xjb_qiongzhi", "kongcheng"],
                trashBin: []
            },
            "xjb_jin_simayi": {
                sex: "male",
                group: "jin",
                hp: 3,
                skills: ["xjb_xianmou", "xjb_yintao"],
                trashBin: []
            },
            "xjb_lvmeng": {
                sex: "male",
                group: "wu",
                hp: 4,
                skills: ["xjb_xiaomeng", "xjb_shelie", "xjb_keji", "xjb_guamu"],
                trashBin: []
            },
        },
        characterSort: {
            XJB: {
                'xjb_chidan': ["xjb_ganning", "xjb_dianwei"],
                'xjb_tianduyingcai': ["xjb_sunce", "xjb_zhouyu", "xjb_pangtong", "xjb_guojia"],
                'xjb_zaiwu': ["xjbhan_caocao", "xjbhan_xunyu", "xjb_caocao"],
                'xjb_jincui': ["xjb_zhugeliang", "xjb_liushan"],
                'xjb_guijin': ["xjb_jin_simayi"],
                'xjb_huahao': ["xjb_daqiao"],
            },
        },
        characterFilter: {},
        characterTitle: {},
        dynamicTranslate: {
            "xin_mousheng"(player) {
                return '锁定技，你亮出拼点牌时，你拼点牌点数+' + Math.min(game.roundNumber, 12)
            },
            "xin_jiang"(player) {
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
            },
            "xjb_guose"() {
                var num = game.countPlayer(function (current) {
                    return current.countCards('ej');
                });
                return lib.translate.xjb_guose_info.replace("X", num + "").replace(/[(].+[)]/i, "")
            }
        },
        characterIntro: {
        },
        characterReplace: {},
        card: {},
        skill: {
            ...xjbSkill
        },
        translate: {
            "XJB": "新将包",

            'xjb_han': '汉',

            "xin_fellow": "秦兵",

            "xjbhan_caocao": "曹操",
            "xjbhan_xunyu": "荀彧",

            "xjb_caocao": "曹操",
            "xjb_dianwei": "典韦",
            "xjb_guojia": "郭嘉",

            "xjb_sunce": "孙策",
            "xjb_zhouyu": "周瑜",
            "xjb_lvmeng": "吕蒙",
            "xjb_ganning": "甘宁",
            "xjb_daqiao": "大乔",

            "xjb_liushan": "刘禅",
            "xjb_zhugeliang": "诸葛亮",
            "xjb_pangtong": "庞统",

            "xjb_jin_simayi": "司马懿",

            xjb_chidan: '赤胆忠心',
            xjb_fengyun: '风云荟萃',
            xjb_zaiwu: '天命在吾',
            "xjb_tianduyingcai": '天妒英才',
            xjb_jincui: '鞠躬尽瘁',
            xjb_guijin: '三分归晋',
            xjb_huahao: '花好月圆',

            ...xjbTranslate,
            "xjb_gongxin_xin": "心"
        },
        pinyins: {},
    };
    for (const id in result.character) {
        result.character[id].trashBin.push('ext:新将包/image/character_xjb/' + id + ".jpg")
    }
    lib.config.all.characters.push("XJB");
    lib.group.push('xjb_han');
    lib.groupnature.xjb_han = "fire";
    return result;
});
game.import("character", () => {
    const result = {
        name: "xjb_soul",
        connect: false,
        character: {
            xjb_Fuaipaiyi: {
                sex: "female",
                group: "xjb_hun",
                hp: 3,
                skills: ["xjb_soul_zhigong", "xjb_soul_jihuo"],
                trashBin: [],
                names: "索|芙艾派依"
            },
            xjb_chanter: {
                sex: "female",
                group: "xjb_hun",
                hp: 3,
                skills: ["xjb_soul_chanter"],
                trashBin: [],
                names: "索|琪盎特儿"
            },
            xjb_timer: {
                sex: "male",
                group: "xjb_hun",
                hp: 3,
                skills: ["xjb_soul_minglou", "xjb_soul_guifan"],
                trashBin: [],
                names: "索|泰穆尔"
            },
            xjb_xuemo: {
                sex: "female",
                group: "xjb_hun",
                hp: 2,
                skills: ["xjb_soul_xueqi", "xjb_soul_fuhong", "xjb_soul_hongxi", "xjb_soul_fuhua"],
                get trashBin() {
                    return [`ext:新将包/skin/image/xjb_xuemo/xuemo${[1, 2, 3].randomGet()}.jpg`]
                },
                names: "索|布劳德"
            },
            xjb_newCharacter: {
                get sex() {
                    return lib.config.xjb_newcharacter.sex;
                },
                get group() {
                    return lib.config.xjb_newcharacter.group
                },
                get hp() {
                    return lib.config.xjb_newcharacter.hp;
                },
                get skills() {
                    return [...lib.config.xjb_newcharacter.skill].filter(skill => skill);
                },
                get isZhugong() {
                    return lib.config.xjb_newCharacter_isZhu == 1;
                },
                get hasHiddenSkill() {
                    return lib.config.xjb_newCharacter_hide == 1
                },
                get trashBin() {
                    return [lib.config.xjb_newcharacter.selectedSkin]
                }
            },
            xjb_SoulBoss_zhankuang: {
                sex: "none",
                group: "xjb_hun",
                hp: 6,
                skills: ["xjb_htzjq", "xjb_huibian", "xindangxian", "xinkuanggu"],
                get trashBin() {
                    return ["ext:新将包/image/god.jpg"]
                },
                isBoss: true
            },
            xjb_SoulBoss_xuanfeng: {
                sex: "none",
                group: "xjb_hun",
                hp: 5,
                skills: ["decadexuanfeng", "liefeng", "xjb_soulBoss_fuyao"],
                get trashBin() {
                    return ["ext:新将包/image/god.jpg"]
                },
                isBoss: true
            },
        },
        characterSort: {
            xjb_soul: {
                "xjb_yangcheng": ["xjb_newCharacter"],
                "xjb_timeTravel": ["xjb_timer"],
                "xjb_lingsu": ["xjb_chanter", "xjb_Fuaipaiyi", "xjb_xuemo"],
                "xjb_hunshi": ["xjb_SoulBoss_zhankuang", "xjb_SoulBoss_xuanfeng"]
            },
        },
        characterFilter: {
            xjb_SoulBoss_xuanfeng(mode) {
                return mode === "boss"
            },
            xjb_SoulBoss_zhankuang(mode) {
                return mode === "boss"
            }
        },
        characterTitle: {},
        dynamicTranslate: {
        },
        characterIntro: {
            get xjb_newcharacter() {
                return lib.config.xjb_newcharacter.intro || ''
            }
        },
        characterReplace: {},
        card: {},
        skill: {
            ...soulSkill,
            ...bossSkill,
        },
        translate: {
            xjb_soul: "soul",

            'xjb_hun': '<img src="./extension/新将包/image/xjb_hunbi.png" height="22">',

            xjb_Fuaipaiyi: "芙艾派依",
            xjb_xuemo: "布劳德",
            xjb_timer: "泰穆尔",
            xjb_chanter: "琪盎特儿",
            get xjb_newCharacter() {
                return lib.config.xjb_newcharacter.name2
            },
            xjb_SoulBoss_zhankuang: "战狂魂使",
            xjb_SoulBoss_xuanfeng: "旋风魂使",

            xjb_timeTravel: "时间旅者",
            xjb_yangcheng: "养成武将",
            xjb_hunshi: "魂使集团",
            xjb_lingsu: "灵力复苏",

            ...soulTranslate,
            ...bossTranslate
        },
        pinyins: {},
    };
    for (const id in result.character) {
        result.character[id].trashBin.push('ext:新将包/image/character_soul/' + id + ".jpg")
        if (get.mode() != "boss" && id.startsWith("xjb_SoulBoss")) result.character[id].isUnseen = true;
    }
    lib.config.all.characters.push("xjb_soul");
    lib.config.characters.push('xjb_soul');
    lib.group.push("xjb_hun");
    lib.groupnature.xjb_hun = "xjb_hun";
    return result;
});