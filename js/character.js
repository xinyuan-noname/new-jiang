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
/**
 * 
 * @param {Status} _status 
 * @param {Library} lib 
 * @param {Game} game 
 * @param {UI} ui 
 * @param {Get} get 
 * @param {AI} ai 
 */
window.XJB_LOAD_CHARACTER = function (_status, lib, game, ui, get, ai) {
    game.import("character", () => {
        const result = {
            name: "xjb_easternZhou",
            connect: true,
            character: {
                "xjb_guanyiwu": {
                    sex: "male",
                    group: "xjb_qi",
                    hp: 3,
                    skills: ["xjb_zhangwei"],
                    trashBin: []
                },
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
                xjb_tongzhou(player) {
                    if (lib.skill.xjb_tongzhou.trigger.player === "phaseZhunbeiBegin") return "准备阶段,你可以摸两张牌"
                    return "准备阶段和结束阶段,你可以摸两张牌"
                }
            },
            characterIntro: {
                xjb_jizi_shou: "卫太子伋，也称急子。卫宣公未即位时，与卫庄公妾室夷姜私通所生。宣公即位，遂立伋为太子。后太子娶齐女，未入室，宣公筑新台娶之。后来宣公派伋出使齐国，为宣公所害。<br>卫国公子寿，卫宣公与宣姜之子，宣公命边境强盗杀太子伋，公子寿劝止太子伋不成，遂灌醉太子伋，盗太子出使符节而替死。寿死后，伋又到边境处，见寿尸体，遂无生意，一心求死，强盗将其杀害。",
                xjb_guanyiwu: "管夷吾，姬姓管氏，名夷吾，字仲。管仲早年辅佐公子纠，于后来齐桓公的即位之争中时，险些射死桓公。公子纠落败后，鲍叔牙劝说桓公任用管仲，桓公不计前嫌，任命管仲为相国并拜为“仲父”。在管仲的辅佐下，齐国富强，打出了“尊王攘夷”的旗帜，“九合诸侯，一匡天下”，主持葵丘之盟，成为春秋首霸。管仲死前，推举公孙隰朋和鲍叔牙为相，而告诫齐桓公远离竖刁、易牙、开方三人。桓公终不能远离三人，落得凄惨下场。",
                xjb_qihuangong: "齐桓公，姜姓吕氏，名小白，春秋时期第一位霸主。齐襄公在位之时，在身为公子的小白与鲍叔牙出逃莒国。齐襄公、公孙无知相继死于内乱之中，小白和公子纠争相回国即位。小白半路遭到管仲埋伏，射中衣带钩，随即诈死，使管仲和公子纠掉意轻心，率先回国即位。即位后，桓公遂与支持公子纠的鲁国开战，鲁国大败。鲁国人处死公子纠，之后又用囚车将管仲送至齐国。桓公不计前嫌，任命管仲为相国。在其辅佐下，齐国国力日渐强盛，桓公也成为春秋首位霸主。管仲死后，桓公任用公孙隰朋和鲍叔牙为相，不得长久。后来，易牙、竖刁、开方把持朝政，诸公子忙于争位，桓公死后六十七天才得以入殓。",
                xjb_qinshihuang: "秦始皇，嬴姓赵氏，名政，是我国的第一位皇帝。"
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
                "xjb_qi": "齐",

                "xjb_jizi_shou": "急子&寿",
                "xjb_qinshihuang": "秦始皇",
                "xjb_guanyiwu": "管夷吾",
                ...dongzhouTranslate
            },
            pinyins: {},
        }
        const nameNatureMap = {
            "xjb_qin": "black",
            "xjb_chunqiu_wei": "fire",
            "xjb_qi": "fire",
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
                    hp: 4,
                    skills: ["xjb_taoni", "jiang", "xjb_yingfa"],
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
                    skills: ["xjb_xianmou", "xjb_yinlve"],
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
                xjb_tiandu: '天妒英才',
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
    lib.init.css(lib.xjb_src + "css", "nature");
}