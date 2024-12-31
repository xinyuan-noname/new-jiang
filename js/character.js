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
                group: "xjb_qi",
                hp: 4,
                skills: ["xjb_xionghu", "xjb_yanshi", "xjb_xuechou", "xjb_guaqi"],
                trashBin: [],
                names: "姜|诸儿"
            },
            "xjb_guanyiwu": {
                sex: "male",
                group: "xjb_qi",
                hp: 3,
                skills: ["xjb_zhangwei"],
                trashBin: []
            },

            "xjb_wuyuan": {
                sex: "male",
                group: "xjb_chunqiu_wu",
                hp: 4,
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
                xjb_weiqingbuning: ["xjb_jizi_shou","xjb_weiyigong"],
                xjb_qihuanshouba: ["xjb_qixianggong", "xjb_guanyiwu"],
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
        characterIntro: {
            xjb_jizi_shou: "卫国太子伋，也称急子。卫宣公未即位时，与卫庄公妾室夷姜私通所生。宣公即位，遂立伋为太子。后太子娶齐女，未入室，宣公派遣太子出使宋国，自己筑新台娶之。后来宣公派伋出使齐国，为宣公所害。<br>卫国公子寿，卫宣公与宣姜之子，宣公命边境强盗杀太子伋，公子寿听闻消息，劝止太子伋，不成，遂泛舟江上，太子伋醉后，盗太子出使符节而替死。寿死后，伋又到边境处，见寿尸体，一心求死，强盗将其杀害。",
            xjb_weiyigong: "卫懿公，姬姓，名赤。以好鹤而闻名，因好鹤而失国。",
            xjb_qixianggong: "齐襄公，姜姓吕氏，名诸儿。齐襄公四年夏，齐襄公与鲁桓公于泺地相会时，与已是鲁国夫人的妹妹文姜私通。鲁桓公知晓此事后，责怪文姜，文姜不满，又将此事告诉给齐襄公。齐襄公借鲁桓公醉酒登车之际，派公子彭生将鲁桓公杀死。后来鲁国询问此事，齐襄公将公子彭生杀死谢罪。桓公死后，文姜之子即位，即后世所说的鲁庄公。同年秋，齐襄公在首止之会中假借未向年少仇怨谢罪之名杀死郑国国君的郑子亹(wěi)，郑国未作反应。齐襄公五年，齐襄公以报九世之仇之名齐国攻打纪国，纪国成为附庸。齐襄公九年，齐襄公护送妹妹宣姜之子卫惠公归国，卫惠公复位，齐襄公又决定让宣姜改嫁给卫惠公同父异母的兄弟卫昭伯。齐襄公十二年，心怀不满的公孙无知、连称兄妹和管至父造反，齐襄公被杀。",
            xjb_qihuangong: "齐桓公，姜姓吕氏，名小白，春秋时期第一位霸主。其兄齐襄公在位之时，在身为公子的小白与鲍叔牙出逃莒国。齐襄公、公孙无知相继死于内乱之中，流亡在外的小白和公子纠遂发生一场即位之争。回国路上，小白半路遭到管仲埋伏，射中衣带钩，随即诈死，得以回国即位。即位后，桓公遂与支持公子纠的鲁国开战，鲁国大败。鲁国人处死公子纠，之后又用囚车将管仲送至齐国。桓公不计前嫌，任命管仲为相国。在其辅佐下，齐国国力日渐强盛，桓公也成为春秋首位霸主。管仲死后，桓公任用公孙隰朋和鲍叔牙为相，不得长久。在齐桓公晚年病重之时，易牙、竖刁、开方把持朝政，诸公子忙于争位，这位位四十三年的首位霸主齐桓公，在死后六十七天才得以入殓。",
            xjb_guanyiwu: "管夷吾，姬姓管氏，名夷吾，字仲。管仲早年辅佐公子纠，于后来与公子小白小白的即位之争中时，险些射死齐桓公。公子纠落败后，鲍叔牙劝说桓公任用管仲，桓公不计前嫌，任命管仲为相国并拜为“仲父”。在管仲的拜相后，齐国进行了政治、经济、军事等各方面的改革，齐国富强，打出了“尊王攘夷”的旗帜，“九合诸侯，一匡天下”，齐桓公成为春秋首霸。管仲死前，推举公孙隰朋为相，而告诫齐桓公远离竖刁、易牙、开方三人。桓公终不能远离三人，落得凄惨下场。",
            xjb_baoshuya: "鲍叔牙，姓氏从其父封地，为人刚直。齐襄公时期辅佐公子小白出逃莒国。后来公子小白即位，后世称之齐桓公。桓公欲杀曾有一箭之仇的管仲，鲍叔牙劝止，认为桓公要想成就霸业必须依靠管仲。在管仲辅佐下，齐桓公成为春秋首位霸主。鲍叔牙早年即与管仲相交，相知多年，管仲曾叹曰：“生我者父母，知我者鲍子也。”",
            xjb_wuyuan: "伍员，名员，字子胥。伍子胥原为楚平王时期大臣，其父亲伍奢为太子太傅。太子娶亲时，费无极见其绝美，建议平王代子娶亲，平王从之。后来，费无极害怕太子即位遭到清算，故构陷太子，伍子胥父亲和弟弟受到牵连被杀，伍子胥踏上逃亡之路，决心报仇。子胥过昭关时，楚王正搜捕子胥，世传子胥一夜白头，得以蒙混过关。后来官兵前来追捕，子胥跑到江边，得到一渔父相助过河。之后子胥盘缠用尽，一路乞讨到了吴国。到达吴国后，伍子胥认识了公子光，先后策划了针对吴王僚和吴王僚之子庆忌的刺杀，使得其登上并巩固君位。公子光即位后，是为吴王阖闾。伍子胥向吴王阖闾推荐了孙武。吴王阖闾九年，吴国攻灭楚国，时楚平王已死，伍子胥鞭尸以泄愤。后来，阖闾因越王勾践而死，夫差即位。夫差灭越后，勾践贿赂太宰嚭，不听子胥之言，未除掉勾践。太宰嚭多进谗言，使得夫差逐渐厌恶伍子胥，最后伍子胥被赐死。勾践灭吴国后，夫差后悔不听伍子胥之言，自刎。",
            xjb_qinshihuang: "秦始皇，嬴姓，名政，是我国的第一位皇帝。"
        },
        characterReplace: {

        },
        card: {},
        skill: {
            ...dongzhouSkill
        },
        translate: {
            "xjb_easternZhou": "东周志",

            "xjb_qi": "齐",
            'xjb_qin': '秦',
            "xjb_chunqiu_wei": "卫",
            "xjb_chunqiu_wu": "吴",

            "xjb_qihuanshouba": "齐国首霸",
            "xjb_wuyuechunqiu": "吴越春秋",
            "xjb_weiqingbuning": "卫顷不宁",

            "xjb_jizi_shou": "急子&寿",
            "xjb_weiyigong": "卫懿公",
            "xjb_qixianggong": "齐襄公",
            "xjb_guanyiwu": "管夷吾",
            "xjb_wuyuan": "伍员",
            "xjb_qinshihuang": "秦始皇",
            ...dongzhouTranslate,

            "xjb_huozhi_huo": "货",
            "xjb_guaqi_gua": "瓜",
        },
        pinyins: {},
    }
    const nameNatureMap = {
        "xjb_qin": "black",
        "xjb_qi": "fire",
        "xjb_chunqiu_wei": "fire",
        "xjb_chunqiu_wu": "qun",
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