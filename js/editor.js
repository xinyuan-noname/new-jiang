import {
    adjustTab,
    indexRange,
    selectionIsInRange,
    validParenthness,
    findPrefix,
    whichPrefix,
    addPSFix,
    eachLine,
    findWordsGroup,
    clearWordsGroup,
    suitSymbolToCN,
    deleteRepeat,
    isOpenCnStr
} from './string.js'
import {
    listenAttributeChange,
    element,
    textareaTool,
    touchE
} from './ui.js'
import {
    NonameCN
} from './nonameCN.js'
import { getSymbol } from './math.js';
window.XJB_LOAD_EDITOR = function (_status, lib, game, ui, get, ai) {
    window.XJB_EDITOR_LIST = {
        filter: ['你已受伤', '你未受伤', '你体力不小于3',
            '你本回合使用牌次数大于1'],
        effect: [
            '你可以摸三张牌或回复一点体力值',
            '你可以摸两张牌', '你回复一点体力', '你获得一点护甲',
            '你移动场上一张牌', '你失去一点体力', '你随机弃置两张牌',
            '所有角色回复一点体力', '所有角色摸一张牌',
            '所有角色随机弃置两张牌',
            '你摸一张牌，如果\n游戏轮数小于3\n那么\n你再摸一张牌',
            '你选择一名其他角色，所选角色摸两张牌', '你选择一名其他角色，所选角色回复一点体力',
            '继承releiji\n',
            '继承jieming\n', '继承niepan\n', '继承xunxun\n',
            '继承kurou\n', '继承chengxiang\n', '继承huituo\n', '继承fangzhu\n',
            '继承yiji\n', "继承luoshen\n"
        ],
        trigger: [
            '你受到一点伤害后','你失去一点体力后',
            '你受到伤害后', '你回复体力后',
            '回合结束时', '摸牌阶段开始时', '摸牌阶段结束时', '弃牌阶段开始时', '弃牌阶段结束时',
            '当你判定牌生效后',
            '你于回合外失去手牌后', '你于回合外失去牌后',
            '当你使用杀指定目标时', '当你使用杀指定目标后',
            '当你成为杀的目标后', '当你成为决斗的目标后',
            '当你使用杀后', '当你使用决斗后', '当你使用桃后', '当你使用\u5357\u86ee\u5165\u4fb5后', '当你使用万箭齐发后'
        ],
    };
    window.XJB_PUNC = [" || ", " && ", " + ", " - ", " += ", " -= ", "++", "--", "!", " >= ", " <= ", " == ", " === "]
    lib.xjb_class = {
        player: ['_status.currentPhase', 'target', 'game.me',
            'player', 'trigger.player', 'trigger.source', 'global'],
        players: ['game.players', 'result.targets', 'targets'],
        game: ['game'],
        get: ['get'],
        event: ['event', 'trigger', '_status.event'],
        suit: ['"red"', '"black"', '"club"', '"spade"', '"heart"', '"diamond"', '"none"'],
        nature: ['"ice"', '"fire"', '"thunder"'],
        cardName: [],
        number: ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12', '13'],
        gain: ['"gain2"', '"draw"'],
        logicConj: [" > ", " < ", " >= ", " <= ", " == ", ">", "<", ">=", "<=", "=="]
    }
    get.xjb_en=(str)=>NonameCN.getEn(str);
    lib.xjb_translate = { ...NonameCN.AllList }
    lib.xjb_editorUniqueFunc = NonameCN.uniqueFunc
    let obj = {
        //该函数用于生成lib.xjb_translate，用于将中文转为代码
        xjb_translate: function () {
            function randomNum() {
                const list = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
                for (let i = 0; i < 11; i++) {
                    for (let a = 10; a > i; a--) {
                        lib.xjb_translate[`${i}到${a}`] = `new Array(${list.slice(i, a + 1)}).randomGet()`
                    }
                }
            }
            function translateVariable() {
                "bcdfghlmnoprstuvwxyz".split('')
                    .forEach(i => {
                        lib.xjb_translate[i + '点'] = i
                        lib.xjb_translate[i.toUpperCase() + '点'] = i.toUpperCase()
                        lib.xjb_translate[i + '张'] = i
                        lib.xjb_translate[i.toUpperCase() + '张'] = i.toUpperCase()
                        lib.xjb_translate[i + '张'] = i
                        lib.xjb_translate[i.toUpperCase() + '点'] = i.toUpperCase()
                    })
            };
            function translateNumber() {
                for (let i = 0; i < 100; i++) {
                    lib.xjb_translate["步骤" + i] = '"step ' + i + '"'
                    lib.xjb_translate["步骤" + get.cnNumber(i)] = '"step ' + i + '"'
                    lib.xjb_translate["第" + i + "步"] = '"step ' + i + '"'
                    lib.xjb_translate["第" + get.cnNumber(i) + "步"] = '"step ' + i + '"'
                    lib.xjb_translate["跳至第" + i + "步"] = `event.goto(${i})`
                    lib.xjb_translate["跳至第" + get.cnNumber(i) + "步"] = `event.goto(${i})`
                }
                for (let i = 1; i < 14; i++) {
                    lib.xjb_translate["牌堆中牌点数为" + get.strNumber(i)] = `cardPile2: card => get.number(card, false) === "${i}":intoFunction`
                    lib.xjb_translate["弃牌堆中牌点数为" + get.strNumber(i)] = `discardPile: card => get.number(card, false) === "${i}":intoFunction`
                }
                for (let i = 0; i < 51; i++) {
                    lib.xjb_translate[i + "张"] = '' + i
                    lib.xjb_translate[get.cnNumber(i) + "张"] = '' + i
                    lib.xjb_translate[i + "名"] = '' + i
                    lib.xjb_translate[get.cnNumber(i) + "名"] = '' + i
                    lib.xjb_translate[i + "点"] = '' + i
                    lib.xjb_translate[get.cnNumber(i) + "点"] = '' + i
                }
            };
            function translateCard() {
                const CardMission = {
                    /**
                     * @description According  to the attribute , set translation for getting card from the cardPile
                     * @param {String} attributeValue such as 'sha'(name),"red"(color)
                     * @param {String} attributeKey such as "name","color"
                     * @param {String} cn attributeValue in Chinese
                     */
                    cardPile: (attributeValue, attributeKey, cn) => {
                        lib.xjb_translate["牌堆中" + cn] = `cardPile2: card => get.${attributeKey}(card, false) === "${attributeValue}":intoFunction`
                    },
                    /**
                     * @description According  to the attribute , set translation for getting card from the discardPile 
                     * @param {String} attributeValue such as 'sha'(name),"red"(color)
                     * @param {String} attributeKey such as "name","color"
                     * @param {String} cn attributeValue in Chinese
                     */
                    discardPile: (attributeValue, attributeKey, cn) => {
                        lib.xjb_translate["弃牌堆中" + cn] = `discardPile: card => get.${attributeKey}(card, false) === "${attributeValue}":intoFunction`
                    },
                    /**
                     * @description According  to the attribute , set translation for a target trigger 
                     * @param {String} attribute id,color,suit and so on
                     * @param {String} cn attribute in Chinese
                     */
                    target: (attribute, cn) => {
                        lib.xjb_translate["成为" + cn + '的目标时'] = 'target:' + attribute + ':' + 'useCardToTarget';
                        lib.xjb_translate["成为" + cn + '的目标后'] = 'target:' + attribute + ':' + 'useCardToTargeted';
                    },
                    /**
                     * @description According  to the attribute , set translation for a player trigger 
                     * @param {String} attribute id,color,suit and so on
                     * @param {String} cn attribute in Chinese
                     */
                    player: (attribute, cn) => {
                        lib.xjb_translate["使用" + cn + '指定目标时'] = 'player:' + attribute + ':' + 'useCardToPlayer';
                        lib.xjb_translate["使用" + cn + '指定目标后'] = 'player:' + attribute + ':' + 'useCardToPlayered';
                    },
                    /**
                     * @description According  to the attribute , set translation for a player's Use trigger 
                     * @param {String} attribute id,color,suit and so on
                     * @param {String} cn attribute in Chinese
                     */
                    playerUse: (attribute, cn) => {
                    },
                    /**
                     * @description According  to the attribute , set translation for a player's using card times in a phase up to that time
                     * @param {String} attribute id
                     * @param {String} cn attribute in Chinese
                     */
                    usedTimes: (attribute, cn) => {
                        lib.xjb_translate['使用' + cn + '次数'] =
                            lib.xjb_translate[cn + '使用次数'] =
                            "getStat://!?card://!?" + attribute
                    },
                }
                for (let [cardTranslate, cardId] of Object.entries(NonameCN.freeQuotation.cardName)) {
                    CardMission.cardPile(cardId, 'name', cardTranslate)
                    CardMission.discardPile(cardId, 'name', cardTranslate)
                    CardMission.target(cardId, cardTranslate)
                    CardMission.player(cardId, cardTranslate)
                    CardMission.playerUse(cardId, cardTranslate)
                    CardMission.usedTimes(cardId, cardTranslate)
                    lib.xjb_class.cardName.push('"' + cardId + '"')
                }
                lib.suits.forEach(i => {
                    const suit = i, suitTranslate = lib.translate[i + '2'] + "牌"
                    CardMission.cardPile(suit, 'suit', suitTranslate)
                    CardMission.discardPile(suit, 'suit', suitTranslate)
                    CardMission.target(suit, suitTranslate)
                    CardMission.player(suit, suitTranslate)
                    CardMission.playerUse(suit, suitTranslate)
                })
                Object.keys(lib.color).forEach(i => {
                    const color = i, colorTranslate = lib.translate[i] + "牌"
                    CardMission.cardPile(color, 'color', colorTranslate)
                    CardMission.discardPile(color, 'color', colorTranslate)
                    CardMission.target(color, colorTranslate)
                    CardMission.player(color, colorTranslate)
                    CardMission.playerUse(color, colorTranslate)
                })
            };
            function translateSkill() {
                let list = Object.keys(lib.skill)
                list = list.filter(a => {
                    if (a === "global") return false;
                    if (a === "globalmap") return false;
                    if (a.indexOf("_") === 0) return false;
                    return true;
                })
                list.forEach(i => {
                    lib.xjb_translate['发动' + i + '次数'] =
                        lib.xjb_translate[i + '发动' + '次数'] =
                        "getStat://!?skill://!?" + i
                })
            };
            randomNum();
            translateVariable();
            translateNumber();
            translateCard();
            translateSkill();
        },
        content: function () {
            get.xjb_makeIt = game.xjb_makeIt = function (value) {
                if (value === 'gain') return '"gain2"'
                return 'undefined'
            }
            //判定类型
            get.xjb_judgeType = game.xjb_judgeType = function (word) {
                if (!isNaN(Number(word))) return 'number'
                for (let k in lib.xjb_class) {
                    if (lib.xjb_class[k] && lib.xjb_class[k].includes(word)) return k
                }
            }
            get.xjb_MapNum = function (value, input) {
                if (value === 'createCard' || value === 'createCard2') {
                    if (input === 'cardName') return 1
                    if (input === 'suit') return 2
                    if (input === 'number') return 3
                    if (input === 'nature') return 4
                }
                if (value === 'gain') {
                    if (input === 'gain') return 1
                    return 2
                }
                if (value === "addToExpansion") {
                    if (input === 'gain') return 1
                    return 2
                }
            }
            get.xjb_fAgruments = function (value) {
                let list = []
                if (["createCard", 'createCard2'].includes(value)) list = ['cardName', 'suit', 'number', 'nature']
                if (["addToExpansion", 'gain'].includes(value)) list = ['gain']
                return list
            }
            game.xjb_skillEditor = function () {
                //
                const playerCN = new Array("你", "玩家", "目标角色", "当前回合角色", "所选角色", "选择的角色", "所选的角色", "所有角色", "触发角色", "伤害来源", "触发来源");
                let player = NonameCN.getVirtualPlayer();
                let eventModel = {
                    ..._status.event,
                    num: 1,
                    targetprompt: '1',
                    getParent:()=>true,
                    filterTarget:()=>true,
                    "set":()=>true,
                    cancel:()=>true
                }
                eventModel.trigger = undefined;
                let backArr = ui.create.xjb_back()
                let back = backArr[0]
                let close = backArr[1]
                back.close = close
                back.ele = {}
                back.skill = {
                    mode: '',
                    id: 'xxx',
                    kind: '',
                    type: [],
                    filter: [],
                    /*
                    jianxiong-gain:用来确保获得的为实体牌而且处于处理区 
                    viewAs:用来确保技能类别为视为类技能  
                    */
                    boolList: [],
                    /*
                    group-*:用来设置势力技
                    mainVice-remove1:用来设置移去阴阳鱼
                    */
                    uniqueList: [],
                    filter_card: [],
                    filter_suit: [],
                    filter_color: [],
                    variable_filter: new Map(),
                    variable_content: new Map(),
                    filterTarget: [],
                    content: [],
                    contentAsync: false,
                    trigger: {
                        player: [],
                        source: [],
                        global: [],
                        target: []
                    },
                    uniqueTrigger: [],
                    respond: [],
                    viewAs: [],
                    viewAsCondition: [],
                    tri_filterCard: []
                }
                back.pageNum = 0;
                back.pages = [];
                back.trigger = [];
                back.phaseUse = [];
                back.choose = [];
                //获取变量,在两者已提交后
                back.allVariable = function () {
                    back.skill.variable_content.clear();
                    back.skill.variable_filter.clear();
                    back.skill.content.forEach(str => {
                        let regexp = /(var|const|let)(\s)+(.+)\=\s*(.+)/
                        if (regexp.exec(str) != null) {
                            str.replace(regexp, function (...arr) {
                                /**
                                 * @type {Map}
                                 */
                                let map = back.skill.variable_content;
                                map.set(arr[4].replace(/\s/g, ""), arr[3].replace(/\s/g, ""));
                            })
                        }
                    });
                    back.skill.filter.forEach(str => {
                        let regexp = /(var|const|let)(\s)+(.+)=\s*(.+)/
                        if (regexp.exec(str) != null) {
                            str.replace(regexp, function (...arr) {
                                /**
                                 * @type {Map}
                                 */
                                let map = back.skill.variable_filter;
                                map.set(arr[4].replace(/\s/g, ""), arr[3].replace(/\s/g, ""));
                            })
                        }
                    });
                }
                //调整显示
                back.updateDisplay = function () {
                    [...back.trigger, ...back.phaseUse, ...back.choose].forEach(i => {
                        i.style.display = 'none'
                    });
                    switch (back.skill.kind) {
                        case "trigger": {
                            back.trigger.forEach(i => { i.style.display = 'block' });
                        }; break;
                        case 'enable:"phaseUse"': {
                            back.phaseUse.forEach(i => { i.style.display = 'block' });
                        }; break;
                        default: {
                            back.skill.boolList.includes("viewAs") && back.choose.forEach(i => { i.style.display = 'block' })
                        }; break;
                    }
                }
                back.modTest = function () {
                    back.ele.content.submit(true);
                    back.skill.mod = {
                        cardUsable_Infinity: [],
                        targetInRange_Infinity: [],
                        targetEnabled_false: [],
                        globalFrom: [],
                        globalTo: []
                    }
                    function giveMethodOfGet(name, condition) {
                        Object.defineProperty(back.skill.mod, name, {
                            get() {
                                let result = 0;
                                for (let k in back.skill.mod) {
                                    const atrr = back.skill.mod[k];
                                    const bool = condition === void 0 ? true : k.startsWith(condition)
                                    if (bool && Array.isArray(atrr)) result += atrr.length;
                                }
                                return result;
                            }
                        });
                    }
                    giveMethodOfGet('length')
                    giveMethodOfGet('lengthOfCardUsable', 'cardUsable')
                    giveMethodOfGet('lengthOfTargetInRange', 'targetInRange')
                    giveMethodOfGet('lengthOfTargetEnabled', 'targetEnabled')
                    giveMethodOfGet('lengthOfGlobalFrom', 'globalFrom')
                    giveMethodOfGet('lengthOfGlobalTo', 'globalTo')
                    /**
                     * @param {RegExp} regexp 
                     * @param {string} output 
                     * @param {string} attr
                     * @param {function} func
                     */
                    function addMod(regexp, output, attr, func) {
                        [...back.skill.content].forEach((cont, i) => {
                            let match;
                            if ((match = regexp.exec(cont)) !== null) {
                                const last = back.skill.content[i - 1]
                                if (last && (last === "{" || last === ")")) return;
                                back.skill.content.remove(cont);
                                if (func) [output, attr] = func(...match)
                                back.skill.mod[attr].push(output);
                            }
                        })
                    }
                    addMod(/^\s*(你|player)\s*计算(与|和)其他角色的?距离时?(减|\-|减少|加|\+|增加)([0-9]+)\s*$/, void 0, void 0, (match, ...p) => {
                        let symbol = getSymbol(p[2]);
                        return [`${symbol}:${p[3]}`, `globalFrom`];
                    })
                    addMod(/^\s*其他角色计算(与|和)(你|player)的?\s*距离时?(减|\-|减少|加|\+|增加)([0-9]+)\s*$/, void 0, void 0, (match, ...p) => {
                        let symbol = getSymbol(p[2]);
                        alert(symbol)
                        return [`${symbol}:${p[3]}`, `globalTo`];
                    })
                    //
                    addMod(new RegExp(`^\s*(你|player)\s*不能成为\s*(${Object.keys(NonameCN.groupedList.cardName).join('|')})的?目标\s*$`), void 0, void 0, (match, ...p) => {
                        return [`name:${NonameCN.getEn(p[1])}`, `targetEnabled_false`]
                    })
                    addMod(/^\s*(你|player)\s*不能成为\s*(基本牌|装备牌|普通锦囊牌|延时锦囊牌)的?目标\s*$/, void 0, void 0, (match, ...p) => {
                        return [`type:${NonameCN.getEn(p[1])}`, `targetEnabled_false`]
                    })
                    addMod(/^\s*(你|player)\s*不能成为\s*锦囊牌的?目标\s*$/, "type:trick-delay", "targetEnabled_false");
                    //
                    addMod(/^\s*(你|player)\s*使用的?\s*卡?牌(无|没有)(次数|数量)限制\s*$/, void 0, void 0, (match, ...p) => {
                        return [`all`, `${p[3] === '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                    });
                    addMod(/^\s*(你|player)\s*使用的?\s*锦囊牌(无|没有)(次数|数量|距离)限制\s*$/, void 0, void 0, (match, ...p) => {
                        return ["type:trick-delay", `${p[3] === '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                    });
                    addMod(/^\s*(你|player)\s*使用的?\s*(杀|酒|顺手牵羊|兵粮寸断)(无|没有)(次数|数量|距离)限制\s*$/, void 0, void 0, (match, ...p) => {
                        return [`name:${NonameCN.getEn(p[1])}`, `${p[3] === '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                    })
                    addMod(/^\s*(你|player)\s*使用的?\s*(基本牌|普通锦囊牌|延时锦囊牌)(无|没有)(次数|数量|距离)限制\s*$/, void 0, void 0, (match, ...p) => {
                        return [`type:${NonameCN.getEn(p[1])}`, `${p[3] === '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                    })
                }           
                back.groupTest = function(){
                    back.skill.group = [];
                    return true;
                }
                back.aiTest = function () {
                    back.skill.ai = [];
                    back.skill.subSkillAi = [];
                    back.aiArrange()
                    return true;
                }
                back.aiArrange = function () {
                    return true;
                }
                back.prepare = function () {
                    back.allVariable();
                    back.skill.boolList.length = 0;
                    function isJianxiongGain() {
                        /**
                         * @type {Map}
                         */
                        let map = back.skill.variable_content
                        let p = map.get("trigger.cards")
                        const bool1 = back.skill.trigger.player.includes("damageEnd");
                        const bool2 = back.skill.content.some(str => {
                            return /gain\(.*trigger.cards.*\)/.exec(str) !== null;
                        });
                        const bool3 = back.skill.content.some(str => {
                            return new RegExp(`gain\(.*${p}.*\)`).exec(str) != null;
                        })
                        return bool1 && (bool2 || bool3);
                    }
                    function isViewAs() {
                        const bool = back.skill.kind && back.skill.kind !== "trigger" && back.skill.kind !== 'enable:"phaseUse"'
                        return bool
                    }
                    function moreViewAs() {
                        const bool = back.skill.viewAs.length > 1 && back.skill.viewAsCondition.length > 1
                        return bool;
                    }
                    isJianxiongGain() && back.skill.boolList.push("jianxiong_gain");
                    isViewAs() && back.skill.boolList.push("viewAs");
                    moreViewAs() && back.skill.boolList.push("moreViewAs")
                    //
                    back.modTest()
                    back.groupTest()
                    back.aiTest()
                    //dom部分
                    //更新显示状态
                    back.updateDisplay();
                }
                back.organize = function () {
                    back.prepare();
                    /*初始化:最终输出的文字*/
                    let str = '',
                        /*初始化：步骤变量*/
                        step = -1, bool,
                        /*初始化:逻辑变量*/
                        logic = false, IF = false, branch = false, afterBranch = [];
                    //根据所选的编辑器类型确定开头
                    if (back.skill.mode === 'mt') {
                        str = '"' + back.skill.id + '":{\n'
                    } else if (back.skill.mode === 'mainCode') {
                        str = 'lib.skill["' + back.skill.id + '"]={\n'
                    } else if (!back.skill.mode) {
                        back.skill.mode = 'self'
                    }
                    //init部分
                    if (back.skill.type.includes("mainSkill") || back.skill.type.includes("viceSkill")) {
                        str += "init:function(player,skill){\n"
                        if (back.skill.type.includes("mainSkill")) {
                            str += `const bool = player.checkMainSkill("${back.skill.id}");\n`
                        }
                        if (back.skill.type.includes("viceSkill")) {
                            str += `const bool = player.checkViceSkill("${back.skill.id}")\n&& !player.viceChanged;\n`
                        }
                        if (back.skill.uniqueList.includes("mainVice-remove1")) {
                            str += `bool && player.removeMaxHp();\n`
                        }
                        str += '},\n'
                    }
                    //mod部分
                    if (back.skill.mod.length) {
                        str += NonameCN.GenerateMod(back)
                    }
                    //处理触发事件
                    if (back.skill.kind === 'trigger') {
                        /*开头*/
                        str += 'trigger:{\n'
                        /*添加函数的制作*/
                        let addTrigger = (value) => {
                            if (back.skill.trigger[value].length === 0) return false
                            str += value
                            str += ':['
                            back.skill.trigger[value].forEach((i, k) => {
                                str += '"' + i + '"'
                                str += (k == back.skill.trigger[value].length - 1 ? '' : ',')
                            })
                            str += '],\n'
                        }
                        ["player", "global", "source", "target"].forEach(TriA => {
                            addTrigger(TriA);
                        })
                        /*结束*/
                        str += '},\n'
                    }
                    else if (back.skill.kind) {
                        str += back.skill.kind + ',\n';
                    }
                    //遍历技能类别
                    back.skill.type.forEach(i => {
                        if (i === 'filterTarget' && back.skill.kind != 'enable:"phaseUse"' || (i === 'filterTarget' && back.skill.filterTarget && back.skill.filterTarget.length > 0)) return;
                        if (i === 'filterCard' && back.skill.kind != 'enable:"phaseUse"') return;
                        str += i + ':true,\n'
                    })
                    if(back.skill.getIndex){
                        str += `getIndex:function(event,player,triggername){\n`
                        str += `return event.num;\n`
                        str += `},\n`
                    }
                    //filter部分
                    const filter = NonameCN.GenerateFilter(back, IF, logic)
                    str += filter
                    if (back.skill.kind == 'enable:"phaseUse"' && back.skill.filterTarget && back.skill.filterTarget.length > 0 && back.skill.type.includes('filterTarget')) {
                        str += 'filterTarget:function(card,player,target){\n';
                        back.skill.filterTarget.forEach(i => {
                            let a = i;
                            //如果含赋值语句或本身就有return，则不添加return
                            if (i.indexOf("return") >= 0 || i.indexOf("var ") >= 0 || i.indexOf("let ") >= 0 || i.indexOf("const ") >= 0 || i.indexOf(" = ") >= 0 || i.indexOf(" += ") >= 0 || i.indexOf(" -= ") >= 0) {
                                str += i + '\n'
                            }
                            else str += 'if( !(' + a + ")) return false;\n"
                        })
                        str += 'return true;\n'
                        str += '},\n'
                    }
                    //content部分
                    let judgeAwaken = () => {
                        return back.skill.type.filter(i => {
                            return ["limited", "juexingji", "dutySkill"].includes(i)
                        }).length > 0
                    }
                    if (!back.skill.boolList.includes("viewAs")) {
                        str += back.skill.contentAsync ? 'content:async function(event,trigger,player){\n' : 'content:function(){\n';
                        if (!back.stepIgnore) {
                            str += '"step 0"\n';
                            step = 0;
                        }
                        if (judgeAwaken()) str += 'player.awakenSkill("' + back.skill.id + '");\n';
                        if (back.skill.type.includes('zhuanhuanji')) str += 'player.changeZhuanhuanji("' + back.skill.id + '");\n'
                        //开始时,先初始化一下变量
                        IF = false;
                        //遍历
                        back.skill.content.forEach(i => {
                            let a = i
                            //这里是步骤矫正
                            if (i.indexOf("'step") >= 0 || i.indexOf('"step') >= 0) {
                                let k = i
                                k = k.replace(/"/g, '')
                                k = k.replace(/'/g, '')
                                k = k.replace('step', '')
                                k = k.replace(' ', '')
                                step++
                                a = '"step ' + step + '"'
                                bool = false
                            } else if (i.includes('result.targets') && !bool) {
                                a = 'if(result.bool) ' + i
                            } else {
                                let k = i.replace(' ', '')
                                if (k.indexOf('if(result.bool){') === 0) bool = true
                            }
                            if (i.indexOf('chooseTarget') > 0) {
                                if (a.indexOf('other') > 0) {
                                    a = a.replace(/,?other/, '')
                                    a += '\n.set("filterTarget",function(card,player,target){return player!=target})'
                                }
                                if (!back.stepIgnore) {
                                    a += `\n.set("prompt",get.prompt("${back.skill.id}"))`
                                    a += `\n.set("prompt2",(lib.translate["${back.skill.id}_info"]||''))`
                                }
                            }
                            if (i.indexOf('atLeast') > 0) {
                                a = a.replace('atLeast', '')
                                let tempStr = (a.match(/[0-9]+/) && a.match(/[0-9]+/)[0]) || ''
                                a = a.replace(tempStr, '[' + tempStr + ',Infinity]')
                            } else if (i.indexOf('atMost') > 0) {
                                a = a.replace('atMost', '')
                                let tempStr = (a.match(/[0-9]+/) && a.match(/[0-9]+/)[0]) || ''
                                a = a.replace(tempStr, '[1,' + tempStr + ']')
                            }
                            if (i.indexOf("addToExpansion") > 0) {
                                if (i.indexOf("gaintag.add") < 0) {
                                    a += '.gaintag.add( "' + back.skill.id + '")'
                                }
                            }
                            if(i.includes('chooseToUse')){
                                a = a.replace(/(.*?)([0-9])(.*)/,'new Array($2).fill().forEach(()=>$1$3)')
                            }
                            if (i === 'if(' && IF === false) {
                                str += i;
                                IF = true
                            }
                            else if (i === ")" && IF === true) {
                                str += i;
                                IF = false;
                            }
                            else if (IF === true) {
                                str += a.startsWith('||') || a.startsWith('&&') ? '\n' + a : a;
                            }
                            else if (i === "{" && branch === false) {
                                str += '{\n';
                                branch = true;
                            }
                            else if (i === "}" && branch === true) {
                                str += '}\n'
                                branch = false
                                afterBranch = afterBranch.filter(x => {
                                    x()
                                    return false;
                                });
                            }
                            else if (branch === true) {
                                function addBranchStence() {
                                    str += `${a}\n`
                                }
                                if (a.includes("if(result.bool) ")) afterBranch.push(addBranchStence)
                                else addBranchStence()
                            }
                            else str += a + "\n"
                            if (!back.stepIgnore && i.indexOf('chooseTarget') > 0) {
                                step++
                                function addStepForChoose() {
                                    str += '"step ' + step + '"\n'
                                    bool = false;
                                }
                                if (!branch) addStepForChoose()
                                else afterBranch.push(addStepForChoose)
                            }
                        })
                        str += '},\n'
                        //获得对你造成伤害的牌
                        if (back.skill.boolList.includes("jianxiong_gain")) {
                            str = addPSFix(str, /[a-z\.]+gain\(.*trigger.cards.*\)/g, `if(get.itemtype(trigger.cards)==="cards"\n&&get.position(trigger.cards[0])==="o"){\n`, '\n}\n')
                            /**
                             * @type {Map}
                             */
                            const map = back.skill.variable_content;
                            let p = map.get("trigger.cards")
                            str = addPSFix(str, new RegExp(`[a-z\.]+gain\(.*${p}.*\)`, "g"), `if(get.itemtype(${p})==="cards"\n&&get.position(${p}[0])=="o"){\n`, '\n}\n')
                        }
                        if (/此【?杀】?(造成的)?伤害(\+|-|\*)/.exec(str) != null) {
                            str = str.replace(/\s+$/gm, "")
                            let regexp = /(此【?杀】?)(造成的)?伤害(\+|-|\*)(?=[0-9a-z_$]+)/g
                            str = str.replace(regexp, function (match, ...p) {
                                return `var id=trigger.target.playerid;\nvar map=trigger.getParent().customArgs;\nif(!map[id]) map[id]={};\nif(typeof map[id].extraDamage!='number'){\nmap[id].extraDamage=0;\n}\nmap[id].extraDamage${p[2]}=`
                            })
                        }
                        if (/(造成|受到)(的)?伤害(\+|-|\*)/.exec(str) != null) {
                            str = str.replace(/\s+$/gm, "")
                            let regexp = /(造成|受到)(的)?伤害(\+|-|\*)(?=[0-9a-z_$]+)/g
                            str = str.replace(regexp, function (match, ...p) {
                                return `trigger.num${p[2]}=`
                            })
                        }
                    }
                    else if (back.skill.viewAs.length && back.skill.viewAsCondition.length) {
                        str += NonameCN.GenerateViewAs(back, 0);
                    }
                    if (back.adjust) {
                        str = str.replace(/else\s*\n\s*{/g, "else{");
                        /*匹配满足特定条件的点（.）字符，其前面必须是一个等号（=）或者行首，并且后面跟着一个小写字母。
                        其用于匹配
                        */
                        str = str.replace(/(?<=(\=|^)\s*)\.(?=[a-z])/img, "player.");
                        str = str.replace(/([/][*])(.|\n)*([*][/])/g, "");
                    }
                    if (back.aiArrange() && back.skill.ai.length) {
                        str += 'ai:{\n'
                        back.skill.ai.forEach(line => {
                            str += line + '\n'
                        })
                        str += '},\n'
                    }
                    if (back.skill.boolList.includes("moreViewAs")) {
                        str += 'subSkill:{\n'
                        const limit = Math.min(back.skill.viewAs.length, back.skill.viewAsCondition.length);
                        for (let index = 1; index < limit; index++) {
                            str += NonameCN.GenerateSubskill(back, index, `${back.skill.kind},\n`, filter, NonameCN.GenerateViewAs(back, index));
                            back.skill.group.push(back.skill.id+"_"+index)
                        }
                        str += '},\n'
                    }
                    if (back.skill.group.length){
                        const group = back.skill.group.map(id=>`"${id}"`)
                        str += `group:[${group}],\n`
                    }
                    if (back.skill.mode === 'mt') str += '},'
                    else if (back.skill.mode === 'mainCode') str += '}'
                    //清除.undefined
                    str = str.replace(/\.undefined/g, "")
                    //处理标点符号使用;!
                    str = str.replace(/,+[)]/g, ')');
                    str = str.replace(/,,+/g, ',');
                    str = str.replace(/[(],+/g, '(');
                    str = str.replace(/;;+/g, ';');
                    str = str.replace(/\,\}/g, '}');
                    str = deleteRepeat(str, /if\(.+?\)/g)
                    //tab处理
                    str = adjustTab(str, back.skill.mode === 'self' ? 1 : 0);
                    back.target.value = str;
                }
                function dispose(str, number, directory = lib.xjb_translate) {
                    //初始化
                    back.NowDidposePlayerType = undefined;
                    //                  
                    let list1 = str.split('\n').filter(line => !line.startsWith("/*") && !line.endsWith("*/") && line.length),
                        list2 = [],
                        list3 = [],
                        list4 = [];
                    //切割
                    if (number === 1) return list1
                    list1.forEach(i => {
                        list2.push(i.split(' '))
                    })
                    if (number === 2) return list2
                    //翻译
                    list2.forEach(i => {
                        let list = []
                        i.forEach(a => {
                            let c = a.split(''), d = []
                            c.forEach((f, t) => {
                                if (!['当'].includes(f)) d.push(f);
                                else if (c[t + 1] === "前") d.push(f);
                            })
                            d = d.join('')
                            //如果有对应的翻译,则翻译,否则,返回原文
                            d = directory[d] || d
                            //如果中含有intoFunction,则将其分割,并放置于参数位置
                            if (d.includes(":intoFunction")) {
                                d = d.replace(":intoFunction", "");
                                d = d.split(/(?<!{\[ \w"']+):(?![ \w"']+})/);
                                return list.push(...d);
                            }
                            list.push(d)
                        })
                        list3.push(list)
                    });
                    if (number === 3) return list3
                    //组装
                    list3.forEach(i => {
                        let str0 = '', str = '', str1 = '', str2 = '', notice = [], bool = true, index,
                            players, logicConj = []
                        //捕捉关键词
                        i.forEach(a => {
                            if (game.xjb_judgeType(a)) {
                                //notice.push(game.xjb_judgeType(a))
                                if (logicConj && game.xjb_judgeType(a) === 'player') back.NowDidposePlayerType = a;
                                if (game.xjb_judgeType(a) === 'players') players = a
                                if (game.xjb_judgeType(a) === 'logicConj') logicConj.push(a)
                            }
                        })
                        //组装函数前语句
                        i.forEach((a, b) => {
                            if (!bool) return false
                            function WAW(body) {
                                if (body[a]) {
                                    str += ('.' + a)
                                    if (typeof body[a] === 'function') {
                                        bool = false;
                                        index = b + 1
                                        str2 = '()'
                                    }
                                }
                                else if (a.includes(':') && a.at(-1) != ',') {
                                    let arrA = a.split(/(?<!{\[ \w"']+):(?![ \w"']+})/)
                                    let arrB = [];
                                    arrA = arrA.filter(each=>{
                                        if(each.startsWith("//!?")){
                                            arrB.push(each.replace("//!?",""))
                                            return false;
                                        }
                                        return true;
                                    })
                                    let verbA = arrA.shift()
                                    if (body[verbA]) {
                                        str += '.' + verbA;
                                        str += '(';
                                        str += arrA.join(',');
                                        str += ')';
                                        if(arrB.length){
                                            str += '.'
                                            str += arrB.join('.')
                                        }
                                    } else {
                                        str += a;
                                    }
                                }
                                else str += a
                            }
                            notice.push(game.xjb_judgeType(a))
                            if (["const ","let ","var "].includes(a)) notice.push("variable")
                            if (notice.includes('game')) WAW(game)
                            else if (notice.includes('get')) WAW(get)
                            else if (notice.includes('player')) { WAW(player) }
                            else if (notice.includes('event')) WAW(eventModel)
                            else if (notice.includes('event')) WAW(eventModel)
                            else if (notice.includes('variable')) WAW({})
                            else WAW(player);
                        })
                        //填写参数
                        if (index) {
                            let toOrder = i.splice(index)
                            //排序
                            toOrder.sort((a, b) => {
                                let value1 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(a)),
                                    value2 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(b))
                                return value1 - value2
                            })
                            //补齐必须参数
                            let j = get.xjb_fAgruments(i[i.length - 1])
                            for (let g = 0; g < j.length; g++) {
                                if (get.xjb_judgeType(toOrder[g]) !== j[g]) {
                                    toOrder.splice(g, 0, get.xjb_makeIt(j[g]))
                                }
                            }
                            let puncSwtich = false
                            toOrder.forEach((c, b) => {
                                let string = '', a = c
                                let punc = window.XJB_PUNC
                                //翻译n到m
                                if (c.indexOf('到') > 0) {
                                    let arr = c.split('到')
                                    a = '['
                                    a += lib.xjb_translate[arr[0]] || arr[0]
                                    a += ','
                                    a += lib.xjb_translate[arr[1]] || arr[1]
                                    a += ']'
                                }
                                //非标点符号以,连接
                                if (b > 0 && !punc.includes(a) && !puncSwtich) {
                                    string = ',' + a + ')'
                                }
                                //否则直接连接
                                else {
                                    if (punc.includes(a)) puncSwtich = true
                                    else if (puncSwtich) puncSwtich = false
                                    string = a + ')'
                                }
                                str2 = str2.replace(')', string)
                            })
                        }
                        if (notice.includes('players')) {
                            str0 = players + '.forEach(i=>{'
                            while (str.indexOf(players) >= 0) str = str.replace(players, 'i')
                            while (str2.indexOf(players) >= 0) str2 = str2.replace(players, 'i')
                            str2 += '})'
                        }
                        if (notice.includes('if') && !notice.includes('then')) {
                            str1 = ')'
                        }
                        let sentence = str0 + str + str1 + str2, p
                        if (notice.includes("logicConj")) {
                            if (back.stepIgnore) { }
                            else if (logicConj.length === 1) {
                                let caught;
                                sentence = sentence.replace(new RegExp(`${logicConj[0]}[^\n\)]*`), function (match, p1) {
                                    caught = match;
                                    return "";
                                });
                                let disposedCaught = caught.replace(",", "");
                                sentence += disposedCaught;
                                sentence = sentence.replaceAll(",)", ")")
                            }
                        }
                        list4.push(sentence)
                    })
                    return list4
                }
                /**
                 * @param {String} tag 
                 * @param {String} innerHTML 
                 * @param {HTMLElement} father 
                 * @returns {HTMLElement}
                 */
                function newElement(tag, innerHTML, father) {
                    let h = document.createElement(tag);
                    h.innerHTML = innerHTML;
                    father.appendChild(h);
                    h.setStyle = function (style) {
                        ui.xjb_giveStyle(this, style);
                        return this;
                    };
                    h.style1 = function (style) {
                        return this.setStyle({
                            height: "1.5em",
                            position: 'relative'
                        })
                    };
                    return h;
                }
                /**
                 * 
                 * @param {HTMLElement} ele 
                 * @param {Function} fn 
                 */
                function listener(ele, fn) {
                    ele.addEventListener(lib.config.touchscreen ?
                        'touchend' : 'click', fn)
                }
                function newPage() {
                    let subBack = newElement('div', '', back).setStyle({
                        flexDirection: 'column',
                        bottom: '25px',
                        fontSize: '1.5em',
                        width: 'calc(95% - 50px)',
                        height: 'calc(65% + 50px)',
                        margin: 'auto',
                        position: 'relative',
                        display: 'flex',
                        "font-family": "xingkai"
                    });
                    back.pages.push(subBack)
                    let curtain = newElement('div', '', subBack).setStyle({
                        width: '100%',
                        height: '100%',
                        backgroundColor: "#3c4151",
                        opacity: "0.7",
                        position: 'absolute',
                        zIndex: '-1'
                    });
                    if (back.pages.length > 1) subBack.style.display = "none"
                    return subBack;;
                }
                /**
                 * @param {Event} e 
                 * @returns 
                 */
                function deleteModule(e) {
                    const i = this.selectionStart, k = this.selectionEnd;
                    if (i === k && i === 0) return;
                    if (k > i) return;
                    if (e.key !== "Delete" && e.key !== "Backspace") {
                        return;
                    };
                    e.preventDefault();
                    const deleteModule = (start, end) => {
                        let arr1 = validParenthness(this.value, start, end);
                        let over1 = false
                        let some1 = arr1.some(ranges => {
                            const rangeA = ranges[0], rangeB = ranges[1];
                            if (over1 === true) return true;
                            if (selectionIsInRange(i, rangeA, true) || selectionIsInRange(i, rangeB, true)) {
                                this.value = `${this.value.slice(0, rangeA[0])}${this.value.slice(rangeB[1] + 1)}`;
                                this.arrange();
                                over1 = true;
                                return true;
                            }
                        })
                        return some1
                    }
                    if (!deleteModule('如果', '那么')
                    && !deleteModule('分支开始', '分支结束')) {
                        this.value = `${this.value.slice(0, i - 1)}${this.value.slice(i)}`;
                        this.selectionStart = this.selectionEnd = i - 1;
                    }
                }
                function adjustSelection(e) {
                    let arr = [
                        ...indexRange(this.value, '如果'),
                        ...indexRange(this.value, '如果\n'),
                        ...indexRange(this.value, '那么'),
                        ...indexRange(this.value, '分支开始'),
                        ...indexRange(this.value, "那么\n分支开始"),
                        ...indexRange(this.value, "分支开始\n"),
                        ...indexRange(this.value, '分支结束'),
                        ...indexRange(this.value, '否则'),
                        ...indexRange(this.value, '否则\n分支开始')
                        ]
                    const i = this.selectionStart;
                    arr.forEach(range => {
                        if (selectionIsInRange(i, range)) this.selectionStart = range[1] + 1;
                    })
                }
                /**
                 * @type {HTMLElement}
                 */
                const buttonContainer = element("div")
                    .style({
                        height: '1em',
                        position: 'relative'
                    })
                    .exit()
                let h1 = newElement('h1', '', back).setStyle({
                    width: '90%'
                });
                let h1Title = newElement("span", "魂氏技能编辑器", h1);
                listener(h1Title, e => {
                    h1.slide.style.display = h1.slide.style.display == "none" ? "inline" : "none"
                });
                let h1Slide = newElement("span", "滑动翻页", h1)
                h1.slide = h1Slide;
                listener(h1Slide, e => {
                    lib.config.xjb_editorSplide = !lib.config.xjb_editorSplide;
                    game.saveConfig("xjb_editorSplide", lib.config.xjb_editorSplide);
                    h1.slide.style.color = lib.config.xjb_editorSplide ? "red" : "gray";
                });
                ui.xjb_giveStyle(h1.slide, {
                    margin: "10px",
                    display: "none",
                    color: (lib.config.xjb_editorSplide ? "red" : "gray"),
                    opacity: "0.75",
                    fontSize: "0.75em"
                })//*/
                //换页功能
                //切换至下一页
                let next = newElement('span', '下一页', h1).setStyle({
                    float: 'right'
                });
                back.ele.nextPage = next;
                function turnNextPage() {
                    if (back.pageNum < back.pages.length - 1) back.pageNum++
                    else back.pageNum = 0
                    back.pages.forEach((i, k) => {
                        i.style.display = back.pageNum == k ? 'flex' : 'none'
                    })
                }
                listener(next, turnNextPage)
                //切换至上一页
                let last = newElement('span', '上一页', h1).setStyle({
                    float: 'right',
                    marginRight: '10px'
                })
                back.ele.lastPage = last
                function turnLastPage() {
                    back.pageNum--
                    if (back.pageNum < 0) back.pageNum = back.pages.length - 1
                    back.pages.forEach((i, k) => {
                        i.style.display = back.pageNum == k ? 'flex' : 'none'
                    })
                }
                listener(last, turnLastPage);
                (function touchPageChange() {
                    function hasParentBack(ele) {
                        let parentNode = ele.parentNode;
                        while (parentNode != null) {
                            if (parentNode == back) {
                                return true;
                            }
                            parentNode = parentNode.parentNode;
                        }
                        return false;
                    }
                    // 初始化触摸相关变量
                    let startX = 0;
                    let isMoving = false;
                    let diffX = 0
                    // 监听touchstart事件
                    function touchS(event) {
                        if (hasParentBack(event.target) || !lib.config.xjb_editorSplide) return;
                        if (event.touches.length === 1) {
                            // 记录起始X坐标
                            startX = event.touches[0].clientX;
                            isMoving = true;
                        }
                    }
                    document.addEventListener('touchstart', touchS);
                    // 监听touchmove事件
                    function touchM(event) {
                        if (hasParentBack(event.target) || !lib.config.xjb_editorSplide) return;
                        if (isMoving && event.touches.length === 1) {
                            const endX = event.touches[0].clientX;
                            diffX = endX - startX;
                            // 按照滑动方向更新当前显示的页面    
                            startX = endX;
                        }
                    }
                    document.addEventListener('touchmove', touchM);
                    // 监听touchend事件
                    function touchE(event) {
                        if (hasParentBack(event.target) || !lib.config.xjb_editorSplide) return;
                        if (diffX > 5) {
                            turnLastPage();
                        } else if (diffX < -5) {
                            turnNextPage();
                        }
                        // 更新起始X坐标
                        isMoving = false;
                    }
                    document.addEventListener('touchend', touchE);
                    listener(back.close, e => {
                        document.removeEventListener("touchstart", touchS)
                        document.removeEventListener("touchend", touchE)
                        document.removeEventListener("touchmove", touchM)
                    })

                })();
                //第一页
                let subBack = newPage()
                let idSeter = newElement('div', '技能id:', subBack).style1();
                let idFree = newElement('textarea', '', subBack).setStyle({
                    fontSize: '1em',
                    height: '1em',
                    width: '50%',
                    position: 'relative',
                })
                back.ele.id = idFree;
                idFree.submit = function (e) {
                    //敲击回车,清空字符
                    if (e && e.keyCode == 13) {
                        idFree.value = ''
                    }
                    //设置非法id，id为一些字符;id包含一些字符
                    if ([...(',.?!:/@...";~()<>([{<*&[]\`#%^+-={}|>}])'.split('')), "'",
                        'NaN', 'Infinity', 'undefined', 'null',
                        'Math', 'Object', 'Array', 'Date', 'String', 'Number', 'Symbol', 'RegExp',
                        'player', 'target', 'event', 'result', 'trigger', 'card', 'cards', 'targets',
                        'var', 'let', 'const', 'try', 'catch', 'throw', 'if', 'else', 'switch', 'case', 'for', 'while', 'break', 'continue', 'function', 'return', 'new', 'class', 'async'].includes(idFree.value) ||
                        bannedKeyWords.some(i => idFree.value.includes(i) )
                    ) {
                        try {
                            throw ('"' + idFree.value + '"不是合法id');
                        }
                        catch (err) {
                            idFree.value = '';
                            game.xjb_create.alert('警告:' + err);
                        };
                    }
                    back.skill.id = idFree.value;
                    back.organize();
                }
                idFree.addEventListener('keyup', idFree.submit);
                //
                let kindSeter = newElement('div', '技能种类:', subBack).style1();
                let kindFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.kinds = kindFree.children
                if (true) {
                    let list = ['触发类', '出牌阶段类', '使用类', '打出类', '使用打出类'];
                    let list1 = ['trigger', 'enable:"phaseUse"', 'enable:"chooseToUse"',
                        'enable:"chooseToRespond"', 'enable:["chooseToUse","chooseToRespond"]']
                    list.forEach((i, k) => {
                        //这是创建一个button,设置技能的类别;
                        let it = ui.create.xjb_button(kindFree, i)
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        })
                        it.kind = list1[k]
                        listener(it, e => {
                            back.skill.kind = it.kind;
                            Array.from(it.parentElement.children).forEach(t => {
                                t.style.backgroundColor = "#e4d5b7"
                                if (t.kind == back.skill.kind) t.style.backgroundColor = 'red'
                            })
                            back.organize()
                        })
                    })
                }
                /**
                 * @param {Array<string>} list1 
                 * @returns {Array<string>}
                 */
                function xjb_formatting(list1) {
                    if (list1.length > 5) {
                        let t = Math.floor((list1.length - 5) / 4)
                        list1.splice(5, 0, ">>>", "<<<")
                        for (let i = 0; i < t; i++) {
                            list1.splice(7 + 4 * (i + 1) + 2 * i, 0, ">>>", "<<<")
                        }
                    }
                    return list1
                }
                //
                let typeSeter = newElement('div', '技能标签:', subBack).style1()
                let typeFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.types = typeFree.children
                if (true) {
                    const mapList = {
                        'zhuSkill': '主公技',
                        'forced': "锁定技",
                        "limited": "限定技",
                        "juexingji": "觉醒技",
                        "zhuanhuanji": "转换技",
                        "hiddenSkill": "隐匿技",
                        "clanSkill": "宗族技",
                        "groupSkill": "势力技",
                        "dutySkill": "使命技",
                        "zhenfa": "阵法技",
                        "mainSkill": "主将技",
                        "viceSkill": "副将技",
                        "preHidden": "预亮",
                        "chargeSkill": "蓄力技",
                        "chargingSkill": "蓄能技",
                        "charlotte": "charlotte技",
                        "sunbenSkill": "昂扬技",
                        "persevereSkill": "持恒技",
                        "frequent": "自动发动",
                    }
                    let list = xjb_formatting(Object.values(mapList));
                    let list1 = xjb_formatting(Object.keys(mapList));
                    list.forEach((i, k) => {
                        const en = list1[k];
                        let it;
                        it = ui.create.xjb_button(typeFree, i);
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        });
                        if (k >= 6) ui.xjb_giveStyle(it, {
                            display: 'none'
                        });
                        it.type = en;
                    });
                }
                listener(typeFree, e => {
                    let list = Array.from(typeFree.children)
                    if (!list.includes(e.target)) return;
                    if (e.target.innerText.includes('>>>')) {
                        const a = list.indexOf(e.target) + 1;
                        let b = Math.min((a + 5), (list.length - 1));
                        list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none")
                        return;
                    }
                    if (e.target.innerText.includes('<<<')) {
                        const a = list.indexOf(e.target) - 1;
                        let b = Math.max(0, (a - 5));
                        list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none")
                        return;
                    }
                    if (back.skill.type.includes(e.target.type)) {
                        back.skill.type.remove(e.target.type);
                        e.target.style.backgroundColor = "#e4d5b7";
                    } else {
                        e.target.style.backgroundColor = "red";
                        back.skill.type.push(e.target.type);
                    };
                    back.organize();
                    back.ele.groupsContainer.update();
                });
                let groupSeter = newElement('div', '特殊设置:', subBack).style1()
                let groupFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.groupsContainer = groupFree;
                back.ele.groups = groupFree.children;
                groupFree.groupsPageNum = 0;
                listener(groupFree, e => {
                    let list = Array.from(groupFree.children)
                    if (!list.includes(e.target)) return;
                    if (e.target.innerText.includes('>>>')) {
                        const a = list.indexOf(e.target) + 1;
                        let b = Math.min((a + 5), (list.length - 1));
                        list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none");
                        groupFree.groupsPageNum++;
                        return;
                    }
                    if (e.target.innerText.includes('<<<')) {
                        const a = list.indexOf(e.target) - 1;
                        let b = Math.max(0, (a - 5));
                        list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "inline-block")
                        list.forEach(ele => ele.style.display = "none");
                        groupFree.groupsPageNum--;
                        return;
                    }
                    let attr = e.target.getAttribute('data-attr');
                    let prefix = whichPrefix(attr, ["group", "mainVice"])
                    findPrefix(back.skill.uniqueList, prefix).forEach(k => {
                        back.skill.uniqueList.remove(k);
                        let ele = groupFree.querySelector(`[data-attr="${k}"]`)
                        if (ele !== null) ele.style.backgroundColor = "#e4d5b7";
                    });
                    back.skill.uniqueList.push(attr);
                    e.target.style.backgroundColor = "red";
                    back.organize();
                });
                groupFree.update = function () {
                    const pageNum = groupFree.groupsPageNum;
                    groupFree.groupsPageNum = 0;
                    function groupFreeChange() {
                        //先移除所有元素
                        element().setTarget(groupFree)
                            .removeAllChildren();
                        let mapList = {};
                        if (back.skill.type.includes("groupSkill")) {
                            [...lib.group, "key", "western"].forEach(group => {
                                mapList["group-" + group] = lib.translate[group] + "势力"
                            })
                        }
                        if (back.skill.type.includes("mainSkill") || back.skill.type.includes("viceSkill")) {
                            mapList = Object.assign(mapList, {
                                "mainVice-remove1": "鱼减半个"
                            })
                        }
                        let list = xjb_formatting(Object.values(mapList));
                        let list1 = xjb_formatting(Object.keys(mapList));
                        list.forEach((i, k) => {
                            const en = list1[k];
                            /**
                             * @type {HTMLElement}
                             */
                            let it = ui.create.xjb_button(groupFree, i);
                            element().setTarget(it)
                                .setStyle('fontSize', '1em')
                                .hook(ele => {
                                    if (k >= 6) element().setTarget(ele).setStyle("display", "none");
                                }).
                                setAttribute('data-attr', en);
                            if (back.skill.uniqueList.includes(en)) it.style.backgroundColor = "red";

                        });
                        return list.length;
                    }
                    if (groupFreeChange()) {
                        element().setTarget(groupSeter)
                            .setStyle("display", "inline-block")
                            .setTarget(groupFree)
                            .setStyle("display", "inline-block")
                    } else {
                        element().setTarget(groupSeter)
                            .setStyle("display", "none")
                            .setTarget(groupFree)
                            .setStyle("display", "none")
                    };
                    while (groupFree.groupsPageNum !== pageNum) {
                        /**
                         * @type {HTMLElement}
                         */
                        let target = Array.from(groupFree.children).filter(k => k.style.display != "none").at(-1);
                        if (target && target.innerText.includes('>>>')) {
                            target.click();
                            target.dispatchEvent(touchE);
                        } else break;
                    }
                }
                groupFree.update();
                //编辑模式选择
                let modeSeter = newElement('div', '编写位置:', subBack).style1()
                let modeFree = element()
                    .clone(buttonContainer)
                    .father(subBack)
                    .exit()
                back.ele.mode = modeFree.children;
                if (true) {
                    let list = ['本体自带编写器', 'mt管理器', '主代码'];
                    let list1 = ['self', 'mt', 'mainCode']
                    list.forEach((i, k) => {
                        let it = ui.create.xjb_button(modeFree, i)
                        ui.xjb_giveStyle(it, {
                            fontSize: '1em'
                        })
                        it.mode = list1[k]
                        listener(it, e => {
                            back.skill.mode = it.mode
                            Array.from(it.parentElement.children).forEach(t => {
                                t.style.backgroundColor = "#e4d5b7"
                                if (t.mode == back.skill.mode) t.style.backgroundColor = 'red'
                            })
                            back.organize()
                        })
                    })
                }
                //第二页
                let subBack2 = newPage()
                let filterSeter = newElement('div', '<b><font color="red">发动条件</font></b>:', subBack2).style1()
                let filterFree = newElement('textarea', '', subBack2)
                filterFree.setStyle({
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                back.ele.filter = filterFree;
                filterFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                filterFree.arrange = function () {
                    const that = filterFree;
                    function update(str) {
                        let wonder = filterFree.value.split('\n')
                        wonder = wonder.map(t => {
                            let wonder1 = t.split(str).join('')
                            return wonder1 + (t.indexOf(str) > 0 ? (' ' + str) : '')
                        })
                        filterFree.value = wonder.join('\n')
                    }
                    /**
                    * @param {string} appendWord 
                    * @param {string[]} every 
                    */
                    function appendWordToEvery(appendWord, every) {
                        every.forEach(i => {
                            that.changeWord(new RegExp(i, 'g'), i + appendWord);
                        });
                    }
                    //
                    that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                        return p[0];
                    })
                    //处理变量词
                    NonameCN.underlieVariable(that)
                    //处理角色相关字符
                    playerCN.forEach(i => {
                        that.changeWord(new RegExp(i + '(的|于|在)回合外', 'g'), i + '不为当前回合角色')
                        that.changeWord(new RegExp(i + '的', 'g'), i)
                    });
                    appendWordToEvery(' ', ["你", "玩家", "当前回合角色"]);
                    that.changeWord(/体力(?!上限|值)/g, '体力值');
                    appendWordToEvery(' ', ["体力值", "体力上限", "手牌数"]);
                    //处理game相关字符
                    that.changeWord(/游戏轮数/g, '游戏 轮数')
                    /*统一写法*/
                    for (let i = 999; i > 0; i--) {
                        that.changeWord("加" + get.cnNumber(i), "+" + i)
                        that.changeWord("减" + get.cnNumber(i), "-" + i)
                        that.changeWord("乘" + get.cnNumber(i), "*" + i)
                        that.changeWord("乘以" + get.cnNumber(i), "*" + i)
                        that.changeWord("加" + (i), "+" + i)
                        that.changeWord("减" + (i), "-" + i)
                        that.changeWord("乘" + (i), "*" + i)
                        that.changeWord("乘以" + (i), "*" + i)
                        that.changeWord("*" + get.cnNumber(i), "*" + i)
                        that.changeWord("+" + get.cnNumber(i), "+" + i)
                        that.changeWord("-" + get.cnNumber(i), "-" + i)
                    }
                    that.value = suitSymbolToCN(that.value)
                    that.changeWord(/该回合/g, "本回合")
                    //处理一些特殊属性
                    appendWordToEvery(' ', ["火属性", "冰属性", "雷属性"]);
                    appendWordToEvery(' ', ['红色', '黑色', '梅花', '方片', '无花色', '黑桃', '红桃']);
                    //处理逻辑字符
                    new Array("不大于", "不小于", "不是", "不为", "不等于").forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), ' ' + i + ' ')
                    });
                    ["大于", "小于", "是", "等于"].forEach(i => {
                        that.changeWord(new RegExp(`(?<!不)${i}`, "g"), ` ${i} `)
                    })
                    that.changeWord(/并且\s?/g, '并且\n')
                    that.changeWord(/或者\s?/g, '或者\n')
                    NonameCN.standardFilter(that);
                    NonameCN.deleteBlank(that)
                }
                back.ele.filter.submit = function (e) {
                    const _this = this
                    //继承指令
                    let wonderfulInherit = (filterFree.value.indexOf("继承") >= 0 && filterFree.value.match(/继承.+\n/) && filterFree.value.match(/继承.+\n/)[0]) || '';
                    if (wonderfulInherit && wonderfulInherit != '继承') {
                        let preSkill = ''
                        //获取继承的技能的id                   
                        wonderfulInherit = wonderfulInherit.replace(/继承/, '');
                        wonderfulInherit = wonderfulInherit.replace(/\n/, '');
                        //获取继承的技能的filter并处理                    
                        if (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content) preSkill = wonderfulInherit;
                        wonderfulInherit = (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].filter && lib.skill[wonderfulInherit].filter.toString()) || ''
                        /*清除空格*/
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        /*截取函数*/
                        wonderfulInherit = wonderfulInherit.slice((wonderfulInherit.indexOf('{') + 2), -1)
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        wonderfulInherit = wonderfulInherit.replace(new RegExp(preSkill, 'g'), back.skill.id)
                        back.returnIgnore = true;
                        back.FilterInherit = true
                        filterFree.changeWord(/继承.+\n/, wonderfulInherit);
                    }
                    back.skill.filter = []
                    if (!filterFree.value || filterFree.value.length === 0) return back.skill.filter.push('true') && back.organize()
                    back.allVariable();
                    const varCardBool = Object.values(back.skill.variable_filter).includes("card")
                    let list = dispose(filterFree.value, back.FilterInherit ? 1 : void 0)
                    const regexp = /get\.(name|color|suit|subtype|type)/
                    list = list.map(t => {
                        let result = t.replace(/trigger(?!name)/g, 'event')
                        if (regexp.exec(result) !== null) result = result.replace(/\bcards\b/g, 'card')
                        if (!varCardBool) result = result.replace(/\bcard\b/g, 'event.card')
                        return result
                    })
                    back.skill.filter.push(...list);
                    back.organize()
                }
                listenAttributeChange(filterFree, 'selectionStart').start();
                textareaTool().setTarget(filterFree)
                    .clearOrder()
                    .dittoOrder()
                    .dittoUnderOrder()
                    .replaceThenOrder(/(?<![/][*])[ ]*back.FilterInherit[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.FilterInherit=true*/", () => { back.FilterInherit = true })
                    .clearThenOrder(/([/][*])[ ]*back.FilterInherit[ ]*\=false[ ]*[ ]*([*][/])/g, () => { back.FilterInherit = false })
                    .clearThenOrder("整理", back.ele.filter.arrange)
                    .replaceOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束")
                    .replaceOrder('新否则', "否则\n分支开始\n\n分支结束")
                    .debounce('keyup', back.ele.filter.submit, 200)
                    .listen('keydown', deleteModule)
                    .listen('selectionStartChange', adjustSelection);
                let filterIntro = newElement('div', '举例说明', subBack2).style1();
                let filterExample = newElement('div', '例如:有一个技能的发动条件是:你的体力值大于3<br>' +
                    '就在框框中写:' +
                    '你体力值大于三<br>' +
                    '每写完一个效果，就提行写下一个效果，<br>' +
                    "最后输入整理即可<br>"
                    , subBack2).style1()
                //第三页
                let subBack3 = newPage();
                let contentSeter = newElement('div', '<b><font color=red>技能效果', subBack3).style1()
                let contentFree = newElement('textarea', '', subBack3).setStyle({
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                });
                back.ele.content = contentFree;
                contentFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, typeof replacer === 'function' ? replacer : '' + replacer)
                    return true
                };
                contentFree.arrange = function () {
                    if (back.stepIgnore) return false;
                    const that = contentFree
                    /**
                     * This function is used to adjust a word to the end of its line
                     * @param {String} str the word to adjust
                     * @param {Function} hook 
                     */
                    function update(str, hook) {
                        /**
                         * @type {string[]}
                         */
                        let wonder = that.value.split('\n')
                        wonder = wonder.map(line => {
                            let wonder1 = line.split(str).join('');
                            let disposedString = (wonder1 + (line.includes(str) ? (' ' + str) : ''))
                            if (typeof hook === 'function') {
                                disposedString = hook(str, disposedString, line)
                            }
                            return disposedString;
                        })
                        that.value = wonder.join('\n')
                    }
                    /**
                     * 该函数用于集中处理一类参数
                     * @param  {...any} wonderA 
                     */
                    function parameter(...wonderA) {
                        let parameterWord = wonderA, hook;
                        if (typeof wonderA[wonderA.length - 1] === 'function') {
                            hook = parameterWord.splice(-1, 1)[0];
                        }
                        for (let i = 0; i < wonderA.length; i++) {
                            update(wonderA[i], hook)
                        };
                    }
                    //实例字符
                    function newLine() {
                        that.changeWord(/，/g, '\n')
                        that.changeWord(/然后/g, '\n');
                        that.changeWord(/\s+\n/g, '\n');
                    }
                    newLine()
                    //卡牌处理
                    that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                        return p[0];
                    })
                    //处理角色称谓
                    textareaTool().setTarget(that)
                        .replace(/(所|被)(选|选择)的?角色/g, '所选角色')
                    //处理变量词
                    NonameCN.underlieVariable(that)
                    //
                    that.changeWord(/(可以使用)一张(手?牌)/g,'$1$2')
                    //处理逻辑词
                    that.changeWord(/≯/g, '不大于')
                    that.changeWord(/≮/g, '不小于')
                    that.changeWord(/若你/g, "如果 你")
                    that.changeWord(/若游戏/g, "如果 游戏")
                    new Array("不大于", "不小于", "不是", "不为", "不等于").forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), ' ' + i + ' ')
                    });
                    ["大于", "小于", "是", "等于"].forEach(i => {
                        that.changeWord(new RegExp(`(?<!不)${i}`), ` ${i} `)
                    });
                    that.changeWord(/(使用|打出)(杀|闪|桃|酒|无懈可击)次数/, "$1的$2次数")
                    that.changeWord(/(?<=使用|打出)(?=杀|闪|桃|酒|无懈可击)/, " ")
                    //长语句处理
                    that.changeWord(/可以(失去.+?点体力|受到.+?点伤害|摸.+?张牌)/g, function (match, ...p) {
                        return match.replace("可以", "")
                    })
                    that.changeWord(/你使用的?([\u4e00-\u9fa5]+?)无(距离和次数|次数和距离|距离和数量|数量和距离)限制/g, function (match, ...p) {
                        return `你使用的${p[0]}无距离限制，你使用的${p[0]}无次数限制`
                    })
                    that.changeWord(/(你|伤害来源|当前回合角色)对([\u4e00-\u9fa5]+?)造成(.*?)点伤害/g, function (match, ...p) {
                        return `${p[1]}受到由${p[0]}造成的${p[2]}点伤害`
                    })
                    that.changeWord(/区域(里|内)的?/, "区域内")
                    that.changeWord(/(你|伤害来源|当前回合角色)\s*(可以)?获得(你|伤害来源|当前回合角色)(.*?)张(手牌|牌)/g, function (match, ...p) {
                        return match.replace("可以", "").replace("获得", "获得角色")
                    })
                    //处理player相关字符
                    playerCN.forEach(i => {
                        that.changeWord(new RegExp(`由${i}造成的`, 'g'), `${i}`);
                        that.changeWord(new RegExp(`对${i}造成伤害的牌`, 'g'), "造成伤害的牌");
                        that.changeWord(new RegExp(i + '的', 'g'), i);
                    });
                    that.changeWord(/体力(?!上限|值)/g, '体力值');
                    ["体力值", "体力上限", "手牌数"].forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), i + ' ');
                    });
                    //处理game相关字符
                    that.changeWord(/游戏轮数/g, '游戏 轮数')
                    //处理事件有关字符
                    NonameCN.standardEvent(that)
                    textareaTool().setTarget(that)
                        .replace(/(该|此)回合的?/g, "本回合")
                        .replace(/(再|各)摸/g, "摸")
                        .replace(/可以获得(?=.*牌)/g, " 获得牌 ")
                        .replace('的事件', "事件")
                    //限定词处理
                    that.changeWord(/(至多)+/g, "至多");
                    that.changeWord(/(至少)+/g, "至少");
                    that.changeWord(/(其他|其它)+/g, "其他");
                    that.changeWord(/(可以)+/g, "可以");
                    //数字有关处理
                    that.changeWord(/二(名|点)/g, function (match, p1) {
                        //将匹配的部分换为两名/两点
                        return '两' + p1
                    });
                    for (let i = 1; i <= 20; i++) {
                        that.changeWord(new RegExp("任意" + i + '张', 'g'), i + '张');
                        that.changeWord(new RegExp("任意" + get.cnNumber(i) + '张', 'g'), get.cnNumber(i) + '张');
                        that.changeWord(new RegExp("任意" + i + '名', 'g'), get.cnNumber(i) + '名');
                        that.changeWord(new RegExp("任意" + get.cnNumber(i) + '名', 'g'), get.cnNumber(i) + '名');
                        that.changeWord(new RegExp(`可?以?令(至多|至少)*${i}名(其他)*角色`, 'g'), function (match, p1, p2) {
                            return `选择${p1 ? p1 : ''}${i}名${p2 ? p2 : ''}角色然后所选角色`
                        });
                        that.changeWord(new RegExp(`可?以?令(至多|至少)*${get.cnNumber(i)}名(其他)*角色`, 'g'), function (match, p1, p2) {
                            return `选择${p1 ? p1 : ''}${get.cnNumber(i)}名${p2 ? p2 : ''}角色然后所选角色`
                        });
                    }
                    that.changeWord(new RegExp(`令任意名(其他)*角色`, 'g'), function (match, p1) {
                        return `选择名${p1 ? p1 : ''}角色然后所选角色`
                    });
                    newLine()
                    //数字参数处理
                    for (let i = 1; i <= 20; i++) {
                        update(i + '张');
                        update(get.cnNumber(i) + '张');
                        update(i + '点');
                        update(get.cnNumber(i) + '点');
                        update(i + '名');
                        update(get.cnNumber(i) + '名');
                    }
                    "abcdefghjlmnopqrstuvwxyz".split('').forEach(i => {
                        update(i + '点');
                        update(i.toUpperCase() + '点');
                        update(i + '名');
                        update(i.toUpperCase() + '名');
                        update(i + '张');
                        update(i.toUpperCase() + '张');
                    });
                    //统一写法
                    for (let i = 999; i > 0; i--) {
                        that.changeWord("加" + get.cnNumber(i), "+" + i)
                        that.changeWord("减" + get.cnNumber(i), "-" + i)
                        that.changeWord("乘" + get.cnNumber(i), "*" + i)
                        that.changeWord("乘以" + get.cnNumber(i), "*" + i)
                        that.changeWord("加" + (i), "+" + i)
                        that.changeWord("减" + (i), "-" + i)
                        that.changeWord("乘" + (i), "*" + i)
                        that.changeWord("乘以" + (i), "*" + i)
                        that.changeWord("*" + get.cnNumber(i), "*" + i)
                        that.changeWord("+" + get.cnNumber(i), "+" + i)
                        that.changeWord("-" + get.cnNumber(i), "-" + i)
                    }
                    that.value = suitSymbolToCN(that.value)
                    //参数处理
                    update('其他', function (disposing, disposed, previous) {
                        if (previous.match(/其他角色计算(与|和)/)) return previous;
                        if (previous.match(/计算(与|和)其他角色的?距离/)) return previous;
                        return disposed;
                    })
                    parameter("火属性", "冰属性", "雷属性",
                        "任意张", "任意名",
                        "从牌堆底");
                    parameter("至多", "至少")
                    parameter('梅花', '方片', '无花色', '黑桃', '红桃', '红色', '黑色', '无色', function (disposing, disposed, previous) {
                        if (previous.includes(`牌堆中${disposing}牌`)) return previous;
                        return disposed;
                    });
                    parameter('魏势力', '蜀势力', '吴势力', '群势力', '晋势力', '神势力');
                    that.value = eachLine(contentFree.value, line => {
                        let group = findWordsGroup(line, playerCN)
                        if (line.includes("令为")||line.includes("变量") || !group.length) return;
                        if (/其他角色计算(和|与)你的?距离/.test(line)) return;
                        let restWords = clearWordsGroup(line, playerCN);
                        return `${group.shift()} ${restWords} ${group.join(" ")}`
                    })
                    playerCN.forEach(i => {
                        that.changeWord(new RegExp(i, 'g'), `${i} `);
                    });
                    NonameCN.standardEvent(that)
                    NonameCN.deleteBlank(that)
                    parameter("并且", "或者")
                }
                contentFree.zeroise = function () {
                    this.value = ""
                }
                back.ele.content.submit = function (bool = false) {
                    //继承指令
                    let wonderfulInherit = (contentFree.value.indexOf("继承") >= 0 && contentFree.value.match(/继承.+\n/) && contentFree.value.match(/继承.+\n/)[0]) || '';
                    if (wonderfulInherit && wonderfulInherit != '继承') {
                        let preSkill = ''
                        //获取继承的技能的id                   
                        wonderfulInherit = wonderfulInherit.replace(/继承/, '');
                        wonderfulInherit = wonderfulInherit.replace(/\n/, '');
                        //获取继承的技能的content并处理                    
                        if (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content) preSkill = wonderfulInherit;
                        wonderfulInherit = (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content && lib.skill[wonderfulInherit].content.toString()) || ''
                        if (wonderfulInherit.includes('async content')) back.skill.contentAsync = true
                        /*清除空格*/
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        /*截取函数*/
                        wonderfulInherit = wonderfulInherit.slice((wonderfulInherit.indexOf('{') + 2), -1)
                        wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
                        wonderfulInherit = wonderfulInherit.replace(new RegExp(preSkill, 'g'), back.skill.id)
                        contentFree.changeWord(/继承.+\n/, wonderfulInherit);
                        back.stepIgnore = true
                        back.ContentInherit = true
                    }
                    //清空content数组
                    back.skill.content = []
                    //数组为空则返回
                    if (contentFree.value.length === 0) {
                        if (bool !== true) back.organize()
                        return;
                    }
                    //后续处理，如果涉及到继承，则为数字1就返回
                    const list = dispose(contentFree.value, back.ContentInherit ? 1 : void 0)
                    const thisCard = NonameCN.analyzeThisCard(back.skill.trigger) || "此牌"
                    const theseCard = NonameCN.analyzeThisCard(back.skill.trigger) || "这些牌"
                    function disposeList() {
                        let disposedList = list.map(x => {
                            let result = x;
                            result = result.replaceAll(/(?<!["'`].*?)此牌(?!.*?["'`])/g, thisCard);
                            result = result.replaceAll(/(?<!["'`].*?)这些牌(?!.*?["'`])/g, theseCard);
                            //没有角色类型返回原值
                            if (!back.NowDidposePlayerType) return result
                            //不含逻辑字符返回原值
                            if (!result.split("").some(y => lib.xjb_class.logicConj.includes(y))) return result;
                            /*判断承前省略
                            如果匹配".",前面为空字符/>/<,且后面字符非空
                            */
                            result = result.replace(/(?<=\s|\>|\<)\.(?=[^\s]+)/g, function (match) {
                                return back.NowDidposePlayerType + "."
                            })
                            return result;
                        })
                        return disposedList
                    }
                    const redispose = NonameCN.replace(disposeList().join('\n'))
                    back.skill.content.push(...redispose);
                    if (bool !== true) back.organize()
                }
                listenAttributeChange(contentFree, 'selectionStart').start();
                textareaTool().setTarget(contentFree)
                    .clearOrder()
                    .dittoOrder()
                    .dittoUnderOrder()
                    .replaceThenOrder(/(?<![/][*])back.adjust[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.adjust=true*/", () => { back.adjust = false })
                    .clearThenOrder(/([/][*])[ ]*back.adjust[ ]*\=[ ]*false[ ]*([*][/])/g, () => { back.adjust = false })
                    .replaceThenOrder(/(?<![/][*])[ ]*back.skill.contentAsync[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.skill.contentAsync=true*/", () => { back.skill.contentAsync = true; back.stepIgnore = true })
                    .clearThenOrder(/([/][*])[ ]*back.skill.contentAsync[ ]*\=false[ ]*[ ]*([*][/])/g, () => { back.skill.contentAsync = false })
                    .replaceThenOrder(/(?<![/][*])back.ContentInherit[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.ContentInherit=true*/", () => { back.ContentInherit = false })
                    .clearThenOrder(/([/][*])[ ]*back.ContentInherit[ ]*\=[ ]*false[ ]*([*][/])/g, () => { back.ContentInherit = false })
                    .replaceThenOrder(/(?<![/][*])[ ]*back.stepIgnore[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.stepIgnore=true*/", () => { back.stepIgnore = true })
                    .clearThenOrder(/([/][*])[ ]*back.stepIgnore[ ]*\=false[ ]*[ ]*([*][/])/g, () => { back.stepIgnore = false })
                    .clearThenOrder("整理", back.ele.content.arrange)
                    .replaceOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束")
                    .replaceOrder('新否则', "否则\n分支开始\n\n分支结束")
                    .debounce('keyup', back.ele.content.submit, 200)
                    .listen('keydown', deleteModule)
                    .listen('selectionStartChange', adjustSelection);
                let contentIntro = newElement('div', '举例说明', subBack3).style1();
                let contentExample = newElement('div', `例如:技能的一个效果是:你摸三张牌</br>
                    就在框框中写:你摸三张牌。</br>
                    每写完一个效果，就提行写下一个效果。</br>
                    最后输入整理即可。` , subBack3).style1()
                //第五页
                let subBack5 = newPage()
                let triggerAdd = (who, en) => {
                    back.trigger.push(who);
                    who.style.display = 'none';
                }
                let triggerSeter = newElement('div', '<b><font color=red>触发时机</font></b>', subBack5).style1()
                let triggerFree = newElement('textarea', '', subBack5).setStyle({
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                })
                back.ele.trigger = triggerFree;
                triggerFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                triggerFree.arrange = function () {
                    const that = triggerFree;
                    /**
                     * @param {string} appendWord 
                     * @param {string[]} every 
                     */
                    function appendWordToEvery(appendWord, every) {
                        every.forEach(i => {
                            that.changeWord(new RegExp(i, 'g'), i + appendWord);
                        });
                    }
                    //
                    that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                        return p[0];
                    })
                    //        
                    that.changeWord(/之(前|时|后)/g,"$1")
                    //逻辑处理
                    that.changeWord(/(?<!使用)或(?!打出)/g, ' ')
                    //省略
                    that.changeWord(/的判定牌生效/g, '判定牌生效');
                    that.changeWord(/一张/g, '');
                    that.changeWord(/^(.*?)(一点)(.*?)$/mg,'$1$3 $2')
                    //统一写法                    
                    that.changeWord(/红牌/g, '红色牌');
                    that.changeWord(/黑牌/g, '黑色牌');
                    that.value = suitSymbolToCN(that.value)
                    //
                    that.changeWord(/(?<=你|一名角色)的?判定区被?置入(延时)?类?(锦囊)?牌/g, "牌置入判定区")
                    that.changeWord(/(?<=你|一名角色)的?装备区被?置入(装备)?牌/g, "牌置入装备区")
                    that.changeWord(/场上(的|有)?(延时)?类?(锦囊)?牌被?置入判定区/g, "一名角色牌置入判定区")
                    that.changeWord(/场上(的|有)?(装备)?牌被?置入判定区/g, "一名角色牌置入装备区")
                    //关于角色
                    appendWordToEvery(' ', ['你', '每名角色']);
                    that.changeWord(/(?<!令)(一名角色)/g, '$1 ');
                    NonameCN.standardEvent(that)
                    NonameCN.standardTri(that)
                    that.changeWord(/([\u4e00-\u9fa5]*?)使用或打出([\u4e00-\u9fa5]+)/g, function (match, ...p) {
                        return `${p[0]}使用${p[1]} ${p[0]}打出${p[1]}`;
                    })
                    that.changeWord(/[ ][ ]+/g, ' ');
                }
                back.ele.trigger.submit = function (e) {
                    back.skill.uniqueTrigger = [];
                    back.skill.trigger.source = [];
                    back.skill.trigger.player = [];
                    back.skill.trigger.global = [];
                    back.skill.trigger.target = [];
                    back.skill.filter_card = [];
                    back.skill.filter_color = [];
                    back.skill.filter_suit = [];
                    back.skill.tri_filterCard = [];
                    back.skill.getIndex = false;
                    this.value.includes('于回合外失去') && back.skill.uniqueTrigger.push("outPhase:lose")
                    this.value.includes('于回合内失去') && back.skill.uniqueTrigger.push("inPhase:lose")
                    if (triggerFree.value.length === 0) return;
                    function disposeTriggerValue() {
                        let myTarget = triggerFree.value;
                        myTarget = myTarget.replace(/于回合[外内]/g, '')
                        return myTarget;
                    }
                    let list = dispose(disposeTriggerValue(), 3, NonameCN.TriList)
                    let tri_player = [], tri_global = [], tri_target = [], tri_source = [], tri_players = []
                    list.forEach(i => {
                        let a = i
                        if(i.includes("一点")){
                            a.remove("一点")
                            back.skill.getIndex=true
                        }
                        if (i.includes('player')) {
                            a.remove('player')
                            tri_players.push(...a)
                        } else if (i.includes('global')) {
                            a.remove('global')
                            tri_global.push(...a)
                        } else {
                            tri_players.push(...a)
                        }
                    })
                    tri_players.forEach(i => {
                        let a = i, cardsNames = Object.keys(lib.card), suits = lib.suits, colors = Object.keys(lib.color)
                        if (i === 'damageSource') tri_source.push(a)
                        else if (i.indexOf("source:") === 0) {
                            a = a.slice(7)
                            tri_source.push(a)
                        }
                        else if (i.startsWith("target:")) {
                            a = a.slice(7)
                            let strToArray = function (pending, str) {
                                if (!pending.includes(str)) return false;
                                tri_target.includes(str) || tri_target.push(str);
                                pending = pending.replace(str, '').replace(':', '');
                                if (cardsNames.includes(pending)) back.skill.filter_card.push(str + ':"' + pending + '"')
                                if (suits.includes(pending)) back.skill.filter_suit.push(str + ':"' + pending + '"')
                                if (colors.includes(pending)) back.skill.filter_color.push(str + ':"' + pending + '"')
                                return true
                            }
                            if (strToArray(a, 'useCardToTargeted')) { }
                            else if (strToArray(a, 'useCardToTarget')) { }
                            else tri_target.push(a)
                        }
                        else if (i.indexOf("loseAfter") === 0) {
                            back.skill.uniqueTrigger.push('player:' + i);
                            tri_player.push("loseAfter", "loseAsyncAfter");
                            if (i !== 'loseAfter:discard') tri_global.push("equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter");
                        }
                        else if (i.indexOf("player:") === 0) {
                            a = a.slice(7)
                            let strToArray = function (pending, str) {
                                if (!pending.includes(str)) return false;
                                tri_player.includes(str) || tri_player.push(str);
                                pending = pending.replace(str, '').replace(':', '')
                                if (cardsNames.includes(pending)) back.skill.filter_card.push(str + ':"' + pending + '"')
                                if (suits.includes(pending)) back.skill.filter_suit.push(str + ':"' + pending + '"')
                                if (colors.includes(pending)) back.skill.filter_color.push(str + ':"' + pending + '"')
                                return true
                            }
                            if (strToArray(a, 'useCardToPlayered')) { }
                            else if (strToArray(a, 'useCardToPlayer')) { }
                            else tri_player.push(a)
                        }
                        else if (i.includes(':useCard')) {
                            const list = i.split(":"), str = "useCardAfter";
                            a = list[0];
                            if (cardsNames.includes(a)) back.skill.filter_card.push(str + ':"' + a + '"')
                            if (suits.includes(a)) back.skill.filter_suit.push(str + ':"' + a + '"')
                            if (colors.includes(a)) back.skill.filter_color.push(str + ':"' + a + '"')
                            tri_player.push(list[1]);
                        }
                        else if (i.startsWith('chooseToUseBefore:') || i.startsWith('chooseToUseBegin:')) {
                            const list = i.split(":")
                            const str = list[0]
                            back.skill.tri_filterCard.add(list[1])
                            tri_player.push(str);
                        }
                        else if (i.startsWith('chooseToRespondBefore:') || i.startsWith('chooseToRespondBegin:')) {
                            const list = i.split(":");
                            back.skill.tri_filterCard.add(list[1])
                            tri_player.push(list[0]);
                        }
                        else tri_player.push(a)
                    })
                    tri_global = tri_global.map(i => {
                        let a = i, cardsNames = Object.keys(lib.card), suits = lib.suits, colors = Object.keys(lib.color)
                        if (i.includes(':useCardAfter')) {
                            const str = "useCardAfter"
                            a = a.replace(':useCardAfter', '')
                            if (cardsNames.includes(a)) back.skill.filter_card.push(str + ':"' + a + '"')
                            if (suits.includes(a)) back.skill.filter_suit.push(str + ':"' + a + '"')
                            if (colors.includes(a)) back.skill.filter_color.push(str + ':"' + a + '"')
                            return str;
                        }
                        return i;
                    })
                    back.skill.trigger.player.push(...tri_player)
                    back.skill.trigger.source.push(...tri_source)
                    back.skill.trigger.target.push(...tri_target)
                    back.skill.trigger.global.push(...tri_global)
                    back.organize()
                }
                textareaTool().setTarget(back.ele.trigger)
                    .clearOrder()
                    .dittoOrder()
                    .dittoUnderOrder()
                    .clearThenOrder("整理", back.ele.trigger.arrange)
                    .debounce('keyup', back.ele.trigger.submit, 200);
                triggerFree.addEventListener('keyup', back.ele.trigger.submit)
                let triggerIntro = newElement('div', '举例说明', subBack5).style1()
                let triggerExample = newElement('div', '例如有一个技能的发动时机是:你受到伤害后<br>' +
                    '在框框中就写:' +
                    '你受到伤害后<br>' +
                    '每写完一个时机就提行写下一个时机<br>' +
                    '最后输入整理即可',
                    subBack5).style1()
                triggerAdd(triggerExample)
                triggerAdd(triggerFree)
                triggerAdd(triggerIntro)
                triggerAdd(triggerSeter)
                //
                let enableAdds = (who) => {
                    back.phaseUse.push(who)
                    who.style.display = 'none'
                }
                let enableAdd = (word, en) => {
                    let rat = newElement('div', '', subBack5).setStyle({
                        height: '1em',
                        float: 'left',
                        position: 'relative'
                    })
                    let it = ui.create.xjb_button(rat, word)
                    ui.xjb_giveStyle(it, {
                        fontSize: '1em'
                    })
                    it.type = en
                    listener(it, e => {
                        if (back.skill.type.includes(it.type)) {
                            back.skill.type.remove(it.type)
                            it.style.backgroundColor = "#e4d5b7";
                        } else {
                            it.style.backgroundColor = "red";
                            back.skill.type.push(it.type)
                        }
                        back.organize()
                    })
                    let mouse = newElement('div', '', subBack5).style1()
                    enableAdds(rat);
                    enableAdds(mouse);
                }
                enableAdd('选择角色', 'filterTarget')
                let filterTargetFree = newElement('textarea', '', subBack5).setStyle({
                    marginTop: '-20px',
                    marginLeft: '10px',
                    height: '5em',
                    fontSize: '0.75em',
                    width: '50%'
                });
                filterTargetFree.changeWord = function (replaced, replacer) {
                    this.value = this.value.replace(replaced, replacer)
                    return true
                }
                filterTargetFree.arrange = function () {
                    this.changeWord(/所选角色/g, '目标')
                    new Array('你', '目标').forEach(i => {
                        this.changeWord(new RegExp(i, 'g'), i + ' ')
                    })
                    this.changeWord(/\s\s/g, ' ')
                }
                filterTargetFree.submit = function (e) {
                    if (!back.skill.type.includes('filterTarget')) filterTargetFree.value = ''
                    this.value.indexOf("整理") > 0 && this.changeWord('整理', '') && this.arrange()
                    back.skill.filterTarget = []
                    let list = dispose(filterTargetFree.value)
                    back.skill.filterTarget.push(...list)
                    back.organize()
                }
                filterTargetFree.addEventListener('keyup', filterTargetFree.submit)
                enableAdds(filterTargetFree)
                enableAdd('选择卡片', 'filterCard')
                //
                let chooseSeter = newElement('div', '视为的牌', subBack5).style1()
                const cardNameFree = element()
                    .clone(buttonContainer)
                    .father(subBack5)
                    .exit();
                cardNameFree.colorList = ["red", "orange", "yellow", "green", "pink", "#add8e6"]
                let costSeter = newElement('div', '视为的花费', subBack5).style1()
                const costFree1 = element()
                    .clone(buttonContainer)
                    .father(subBack5)
                    .setStyle("marginBottom", "0.5em")
                    .exit();
                const costFree2 = element()
                    .clone(costFree1)
                    .father(subBack5)
                    .exit();
                const costFree3 = element()
                    .clone(costFree1)
                    .father(subBack5)
                    .exit();
                if (true) {
                    const colorList = cardNameFree.colorList;
                    /**
                     * @param {HTMLElement} domEle 
                     * @param {object} mapList 
                     * @param {Array<string>} backAttr 
                     * @param {string} domEleAttr 
                     */
                    function setDom(domEle, mapList, backAttr, domEleAttr, ...extra) {
                        let list = xjb_formatting(Object.values(mapList));
                        let list1 = xjb_formatting(Object.keys(mapList));
                        list.forEach((i, k) => {
                            const en = list1[k];
                            let it;
                            it = ui.create.xjb_button(domEle, i);
                            ui.xjb_giveStyle(it, {
                                fontSize: '1em'
                            });
                            if (k >= 6) ui.xjb_giveStyle(it, {
                                display: 'none'
                            });
                            element().setTarget(it)
                                .setStyle("fontSize", "1em")
                                .hook(ele => { ele[domEleAttr] = en })
                        });
                        listener(domEle, e => {
                            let list = Array.from(domEle.children)
                            if (!list.includes(e.target)) return;
                            if (e.target.innerText.includes('>>>')) {
                                const a = list.indexOf(e.target) + 1;
                                let b = Math.min((a + 5), (list.length - 1));
                                list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "inline-block")
                                list.forEach(ele => ele.style.display = "none")
                                return;
                            }
                            if (e.target.innerText.includes('<<<')) {
                                const a = list.indexOf(e.target) - 1;
                                let b = Math.max(0, (a - 5));
                                list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "inline-block")
                                list.forEach(ele => ele.style.display = "none")
                                return;
                            }
                            if (backAttr.includes(e.target[domEleAttr])) backAttr.remove(e.target[domEleAttr]);
                            else if (backAttr.length < colorList.length) backAttr.push(e.target[domEleAttr]);
                            let arr=Array.from(domEle.children)
                            for(let collection of extra){
                                arr.push(...collection)
                            }
                            arr.filter(ele => {
                                ele.style.backgroundColor = "#e4d5b7";
                                return true;
                            }).forEach(ele => {
                                const k = backAttr.indexOf(ele[domEleAttr]);
                                if (k !== -1) ele.style.backgroundColor = colorList[k];
                            });
                            back.organize();
                        });
                    }
                    if (cardNameFree) {
                        const mapList = {
                        };
                        lib.inpile_nature.forEach(k => {
                            mapList["nature-" + k + ":sha"] = lib.translate[k] + '杀'
                        });
                        [...lib.cardPack.standard, ...lib.cardPack.extra,
                        ...lib.cardPack.guozhan].forEach(k => {
                            if (lib.translate[k] && get.type(k) != "equip") mapList[k] = lib.translate[k]
                        })
                        setDom(cardNameFree, mapList, back.skill.viewAs, "cardName",[])
                    };
                    if (costFree1) {
                        const mapList = {
                        };
                        lib.inpile_nature.forEach(k => {
                            mapList["cardName-nature-" + k + ":sha"] = lib.translate[k] + '杀'
                        });
                        [...lib.cardPack.standard, ...lib.cardPack.extra,
                        ...lib.cardPack.guozhan].forEach(k => {
                            if (lib.translate[k]) mapList["cardName-" + k] = lib.translate[k]
                        })
                        setDom(costFree1, mapList, back.skill.viewAsCondition, "condition", costFree2.children,costFree3.children)
                    };
                    if (costFree2) {
                        const mapList = {
                            'color-pos-hes:black': "黑色牌",
                            'color-pos-hs:black': "黑色手牌",
                            'color-pos-hes:red': "红色牌",
                            'color-pos-hs:red': "红色手牌",
                            'suit-pos-hes:heart': "♥牌",
                            'suit-pos-hs:heart': "♥手牌",
                            'suit-pos-hes:diamond': "♦牌",
                            'suit-pos-hs:diamond': "♦手牌",
                            'suit-pos-hes:club': "♣牌",
                            'suit-pos-hs:club': "♣手牌",
                            'suit-pos-hes:spade': "♠牌",
                            'suit-pos-hs:spade': "♠手牌",
                        };
                        setDom(costFree2, mapList, back.skill.viewAsCondition, "condition", costFree1.children,costFree3.children)
                    };
                    if (costFree3) {
                        const mapList = {
                            "preEve-link-true":"横置之",
                            "preEve-link-false":"重置之"
                        };
                        setDom(costFree3, mapList, back.skill.viewAsCondition, "condition", costFree1.children,costFree2.children)
                    };
                }
                //第四页
                let subBack4 = newPage()
                let skillSeter = newElement('h2', '技能', subBack4)
                let copy = newElement('span', '复制', skillSeter)
                copy.style.float = 'right'
                listener(copy, e => {
                    e.preventDefault();
                    function copyToClipboard(){
                        if (document.execCommand) {
                            back.target.select();
                            document.execCommand("copy")
                        }else {
                            game.xjb_create.alert('由于所用方法已废弃，请手动复制(已为你选中，点击文本框即可复制。)', function () {
                                back.target.select();
                            })
                        }
                    }
                    try {
                        if (back.skill.mode === 'mainCode') {
                            let func = new Function('lib', back.target.value)
                        }
                        else new Function('let mega={' + back.target.value + '}')
                        if(isOpenCnStr(back.target.value)){
                            game.xjb_create.confirm(
                                "代码中含有未被引号包围的全中文段落，说明该功能可能暂未实现，仍要复制吗？",
                                copyToClipboard()
                            )
                        }else{
                            copyToClipboard()
                        }
                    }
                    catch (err) {
                        game.xjb_create.alert("！！！报错：<br>" + err)
                    }
                })
                let generator = newElement('span', '生成', skillSeter)
                generator.style.float = 'right'
                generator.style.marginRight = "0.5em"
                listener(generator, e => {
                    e.preventDefault();
                    try {
                        if (back.skill.mode === 'mainCode') {
                            if(isOpenCnStr(back.target.value)) throw new Error("代码中含有未被引号包围的全中文段落！")
                            let func = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', back.target.value)
                            func(_status, lib, game, ui, get, ai);
                            game.xjb_create.confirm('技能' + back.skill.id + "已生成(本局游戏内生效)!是否将该技能分配给玩家？",function(){
                                game.me.addSkill(back.skill.id)
                                if(back.skill.group) game.me.addSkill(back.skill.group)
                            })
                        }
                    }
                    catch (err) {
                        game.xjb_create.alert("！！！报错：<br>" + err)
                    }
                })
                let skillFree = newElement('textarea', '', subBack4)
                ui.xjb_giveStyle(skillFree, {
                    height: '10em',
                    fontSize: '0.75em',
                    tabSize: '4'
                })
                //关于dom
                back.target = skillFree
                back.contentDoms = [contentSeter, contentFree, contentIntro, contentExample]
                back.viewAsDoms = [chooseSeter]
                back.choose = [chooseSeter, cardNameFree, costSeter, costFree1, costFree2, costFree3];
                //初始化
                back.organize()
                return back
            }
            ui.create.system("技能编辑", game.xjb_skillEditor);
        },
    }
    for (let k in obj) {
        obj[k]()
    }
}