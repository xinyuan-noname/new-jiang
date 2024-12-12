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
window.XJB_LOAD_CHARACTER = function (_status, lib, game, ui, get, ai) {
    game.import("character", () => {
        const result = {
            name: "xjb_easternZhou",
            connect: true,
            character: {
                "xjb_jizi_shou": {
                    sex: "male",
                    group: "xjb_chunqiu_wei",
                    hp: 3,
                    skills: ["xjb_tongzhou", "xjb_fuwei", "xjb_taihuo"],
                    trashBin: []
                },
                "xjb_qinshihuang": {
                    sex: "male",
                    group: "xjb_qin",
                    hp: 1,
                    hujia: 2,
                    skills: ["xjb_zulong", "xjb_longwei"],
                    trashBin: []
                },
            },
            characterSort: {
                xjb_easternZhou: {

                },
            },
            characterFilter: {},
            characterTitle: {},
            dynamicTranslate: {
                xjb_tongzhou(player){
                    if(lib.skill.xjb_tongzhou.trigger.player === "phaseZhunbeiBegin") return "准备阶段,你可以摸两张牌"
                    return "准备阶段和结束阶段,你可以摸两张牌"
                }
            },
            characterIntro: {
                xjb_jizi_shou: "卫太子伋，也称急子。卫宣公未即位时，与卫庄公妾室夷姜私通所生。宣公即位，遂立伋为太子。后太子娶齐女，未入室，宣公筑新台娶之。后来宣公派伋出使齐国，为宣公所害。<br>卫国公子寿，卫宣公与宣姜之子，宣公命边境强盗杀太子伋，公子寿劝止太子伋不成，遂灌醉太子伋，盗太子出使符节而替死。寿死后，伋又到边境处，见寿尸体，遂无生意，一心求死，强盗将其杀害。",
                xjb_qinshihuang: "秦始皇，赵氏嬴姓，名政，是我国的第一位皇帝。"
            },
            characterReplace: {},
            card: {},
            skill: {
                ...dongzhouSkill
            },
            translate: {
                "xjb_easternZhou": "东周志",

                'xjb_qin': '秦',
                "xjb_chunqiu_wei": "卫",

                "xjb_jizi_shou": "急子&寿",
                "xjb_qinshihuang": "秦始皇",

                ...dongzhouTranslate
            },
            pinyins: {},
        }
        const nameNatureMap = {
            "xjb_qin": "thunder",
            "xjb_chunqiu_wei": "fire"
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
                    hp: 3,
                    maxHp: 4,
                    skills: ["xjb_taoni", "jiang"],
                    trashBin: []
                },
                "xjb_guojia": {
                    sex: "male",
                    group: "wei",
                    hp: 3,
                    skills: ["xjb_qizuo", "xjb_yiji", "tiandu"],
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
                    skills: ["xjb_bingjie", "xjb_liuxiang"],
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
                    skills: ["xjb_xianmou", "xjb_yinlve"],
                    trashBin: []
                },
            },
            characterSort: {
                XJB: {
                    'xjb_chidan': ["xjb_ganning", "xjb_dianwei"],
                    'xjb_tiandu': ["xjb_sunce", "xjb_zhouyu", "xjb_pangtong", "xjb_guojia"],
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
                    skills: ['xjb_soul_lingpiao'],
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
                    skills: ["xjb_soul_minglou", "xjb_soul_guifan"],
                    trashBin: []
                },
                xjb_xuemo: {
                    sex: "female",
                    group: "xjb_hun",
                    hp: 2,
                    skills: ["xjb_soul_xueqi", "xjb_soul_fuhong", "xjb_soul_hongxi", "xjb_soul_fuhua"],
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

                'xjb_hun': '<img src="' + lib.xjb_src + 'image/xjb_hunbi.png" height="22">',

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
}