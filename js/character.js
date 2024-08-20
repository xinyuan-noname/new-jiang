import {
    xjbSkill,
    xjbTranslate
} from "./xjbSkill.js";
import{
    bossSkill,
    bossTranslate
}from "./bossSkill.js"
window.XJB_LOAD_CHARACTER = function (_status, lib, game, ui, get, ai) {
    game.import("character", () => {
        const result = {
            name: "XJB",
            connect: false,
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
                    hp: 3,
                    skills: ["xin_taoni", "xin_jiang", "xin_yingyi"],
                    trashBin: []
                },
                "xjb_guojia": {
                    sex: "male",
                    group: "wei",
                    hp: 3,
                    skills: ["xjb_qizuo", "xin_zaozhong"],
                    trashBin: []
                },
                "xjbhan_caocao": {
                    sex: "male",
                    group: "han",
                    hp: 4,
                    skills: ["xin_zhibang", "xin_chuhui"],
                    trashBin: []
                },
                "xjbhan_xunyu": {
                    sex: "male",
                    group: "han",
                    hp: 3,
                    skills: ["xin_bingjie", "xin_liuxiang"],
                    trashBin: []
                },
                "xjb_pangtong": {
                    sex: "male",
                    group: "shu",
                    hp: 3,
                    skills: ["xin_niepan", "xin_lianhuan"],
                    trashBin: []
                },
                "xjb_caocao": {
                    sex: "male",
                    group: "wei",
                    hp: 4,
                    skills: ["xjb_jianxiong", "xin_fengtian"],
                    trashBin: []
                },
                "xjb_zhouyu": {
                    sex: "male",
                    group: "wu",
                    hp: 4,
                    skills: ["xin_shiyin", "xin_yingfa"],
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
                    hp: 5,
                    skills: ["xin_huzhu", "xin_xiongli"],
                    trashBin: []
                },
                "xjb_ganning": {
                    sex: "male",
                    group: "wu",
                    hp: 4,
                    skills: ["xin_yexi", "xin_ziruo"],
                    trashBin: []
                },
                "xjb_zhugeliang": {
                    sex: "male",
                    group: "shu",
                    hp: 3,
                    skills: ["xin_jincui", "xin_chushi"],
                    trashBin: []
                },
                "xjb_jin_simayi": {
                    sex: "male",
                    group: "jin",
                    hp: 4,
                    skills: ["xin_huanshi", "xin_zhabing"],
                    trashBin: []
                },
                "xjb_yingzheng": {
                    sex: "male",
                    group: "shen",
                    hp: 3,
                    skills: ["xin_tianming", "xin_zulong", "xin_longpan"],
                    trashBin: []
                },
                "xjb_fazheng": {
                    sex: "male",
                    group: "shu",
                    hp: 3,
                    skills: ["xin_enyuan", "xin_qisuan", "xjb_fuyi"],
                    trashBin: []
                },
                "xjb_jiaxu": {
                    sex: "male",
                    group: "qun",
                    hp: 3,
                    skills: ["xin_whlw2", "xin_whlw1", "xin_chongmou"],
                    trashBin: []
                },
            },
            characterSort: {
                XJB: {
                    'xjb_fengyun': ["xjb_yingzheng"],
                    'xjb_chidan': ["xjb_ganning", "xjb_dianwei"],
                    'xjb_tiandu': ["xjb_sunce", "xjb_zhouyu", "xjb_pangtong", "xjb_guojia", "xjb_fazheng"],
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
                xjb_caocao: "操携樵沛诸夏侯曹氏，同汝颖荀之所进退，奋起于兖州之地。济天子，假天子之威，御天下之士。修政事，广屯田，缮水利。征伐四方，十战九胜，可抵其锋者，唯孙刘二者。以其功高，自比于周公，置魏国，修行宫，立太子，分香卖履，薄葬于高陵。观其平生则多杀戮，忿急至于过者亦多也。然其兴兴之政也广及率土三二，亦一世之雄也。",
                xjb_yingzheng: "秦始皇，赵氏嬴姓，名政，是我国的第一位皇帝。"
            },
            characterReplace: {},
            card: {},
            skill: { ...xjbSkill },
            translate: {
                "XJB": "新将包",

                "xin_fellow": "秦兵",
                "xjb_daqiao": "大乔",
                "xjb_sunce": "孙策",
                "xjb_guojia": "郭嘉",
                "xjbhan_caocao": "曹操",
                "xjbhan_xunyu": "荀彧",
                "xjb_pangtong": "庞统",
                "xjb_caocao": "曹操",
                "xjb_zhouyu": "周瑜",
                "xjb_liushan": "刘禅",
                "xjb_dianwei": "典韦",
                "xjb_ganning": "甘宁",
                "xjb_zhugeliang": "诸葛亮",
                "xjb_jin_simayi": "司马懿",
                "xjb_yingzheng": "嬴政",
                "xjb_fazheng": "法正",
                "xjb_jiaxu": "贾诩",

                xjb_chidan: '赤胆忠心',
                xjb_fengyun: '风云荟萃',
                xjb_zaiwu: '天命在吾',
                xjb_tiandu: '天妒英才',
                xjb_jincui: '鞠躬尽瘁',
                xjb_guijin: '三分归晋',
                xjb_huahao: '花好月圆',

                ...xjbTranslate
            },
            pinyins: {},
        };
        for (const id in result.character) {
            result.character[id].trashBin.push('ext:新将包/' + id + ".jpg")
        }
        lib.config.all.characters.push("XJB");
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
                    skills: ['xjb_lingpiao'],
                    trashBin: []
                },
                xjb_chanter: {
                    sex: "female",
                    group: "xjb_hun",
                    hp: 3,
                    skills: ["xjb_soul_chanter"],
                    trashBin: []
                },
                xjb_timer: {
                    sex: "male",
                    group: "xjb_hun",
                    hp: 3,
                    skills: ["xjb_minglou", "xjb_guifan"],
                    trashBin: []
                },
                xjb_xuemo: {
                    sex: "female",
                    group: "xjb_hun",
                    hp: 2,
                    skills: ["xin_xueqi", "xjb_soul_fuhua"],
                    get trashBin() {
                        return [`ext:新将包/skin/image/xjb_xuemo/xuemo${[1, 2, 3].randomGet()}.jpg`]
                    }
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
                        return [...lib.config.xjb_newcharacter.skill];
                    },
                    get isZhugong() {
                        return lib.config.xjb_newCharacter_isZhu == 1;
                    },
                    get hasHiddenSkill() {
                        return lib.config.xjb_newCharacter_hide == 1
                    },
                    get trashBin() {
                        return [lib.config.xjb_newcharacter.selectedSink]
                    }
                },
                xjb_SoulBoss_zhankuang: {
                    sex: "none",
                    group: "xjb_hun",
                    hp: 6,
                    skills: ["xin_htzjq2", "xin_fengtian", "xindangxian", "xinkuanggu"],
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
                ...bossSkill
            },
            translate: {
                "xjb_soul": "soul",

                xjb_Fuaipaiyi: "芙艾派依",
                xjb_xuemo: "布劳德",
                xjb_timer: "泰穆尔",
                xjb_chanter: "琪盎特儿",
                get xjb_newCharacter() {
                    return lib.config.xjb_newcharacter.name2
                },
                xjb_SoulBoss_zhankuang: "战狂魂使",
                xjb_SoulBoss_xuanfeng: "旋风魂使",

                ...bossTranslate
            },
            pinyins: {},
        };
        for (const id in result.character) {
            result.character[id].trashBin.push('ext:新将包/skin/image/' + id + "/normal.jpg")
            if (get.mode() != "boss" && id.startsWith("xjb_SoulBoss")) result.character[id].isUnseen = true;
        }
        lib.config.all.characters.push("xjb_soul");
        return result;
    })
}