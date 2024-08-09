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
    isOpenCnStr,
    correctPunctuation,
    JavascriptKeywords,
    JavascriptUsualType,
    JavascriptGlobalVariable,
    getLineOfInput,
    getLineRangeOfInput
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
        filter: [
            '你已受伤',
            '你未受伤',
            '你体力不小于3',
            '你有空置的武器栏',
            '你有空置的防具栏',
            '你有空置的宝物栏',
            '场上有男性角色',
            '你已横置',
            '你已翻面'
        ],
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
            '你受到一点伤害后', '你失去一点体力后',
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
            'player', 'trigger.player', 'trigger.source', 'trigger.target'
        ],
        players: ['game.players', 'result.targets', 'targets'],
        game: ['game'],
        get: ['get'],
        event: ['event', 'trigger', '_status.event'],
        suit: ['"red"', '"black"', '"club"', '"spade"', '"heart"', '"diamond"', '"none"'],
        nature: ['"ice"', '"fire"', '"thunder"'],
        cardName: (() => {
            const cardNameList = [].concat(...lib.config.cards.map(name => lib.cardPack[name]));
            return cardNameList.map(card => `"${card}"`);
        })(),
        number: ['1', '2', '3', '4', '5', '6',
            '7', '8', '9', '10', '11', '12', '13'],
        gain: ['"gain2"', '"draw"'],
        logicConj: [" > ", " < ", " >= ", " <= ", " == ", ">", "<", ">=", "<=", "=="],
    }
    get.xjb_en = (str) => NonameCN.getEn(str);
    lib.xjb_translate = { ...NonameCN.AllList }
    lib.xjb_editorUniqueFunc = NonameCN.uniqueFunc;
    get.xjb_makeIt = game.xjb_makeIt = function (value) {
        if (value === 'gain') return '"gain2"'
        return 'undefined'
    }
    //判定类型
    get.xjb_judgeType = game.xjb_judgeType = function (word) {
        if (!isNaN(Number(word))) return 'number'
        if (Object.values(NonameCN.groupedList.array).some(arr => word === arr)) return "array"
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
    function EditorContent() {
        game.xjb_skillEditor = function () {
            const DEFAULT_EVENT = lib.config.touchscreen ? 'touchend' : 'click';
            const playerCN = NonameCN.playerCN;
            const JOINED_PLAYAERCN = playerCN.join("|");
            let player = NonameCN.getVirtualPlayer();
            let eventModel = {
                ..._status.event,
                num: 1,
                targetprompt: '1',
                getParent: () => true,
                filterTarget: () => true,
                "set": () => true,
                cancel: () => true
            }
            eventModel.trigger = undefined;
            let backArr = ui.create.xjb_back()
            let back = backArr[0]
            let close = backArr[1]
            back.close = close
            back.ele = {}
            back.skill = {
                mode: 'self',
                id: 'xxx',
                kind: '',
                type: [],
                filter: [],
                /*
                jianxiong-gain:用来确保获得的为实体牌而且处于处理区 
                viewAs:用来确保技能类别为视为类技能  
                moreViewAs:表示视为类技能不止一个
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
                selectTarget: '',
                filterCard: [],
                selectCard: '',
                content: [],
                contentAsync: false,
                trigger: {
                    player: [],
                    source: [],
                    global: [],
                    target: []
                },
                respond: [],
                viewAsCondition: [],
                viewAs: [],
                subSkill: {},
                group: [],
                uniqueTrigger: [],
                tri_filterCard: [],
                primarySkillCache: {
                    skill: {},
                    ele: {}
                },
                marktext: "",
                markName: "",
                markContent: ""
            }
            back.pageNum = 0;
            back.pages = [];
            back.trigger = [];
            back.phaseUse = [];
            back.choose = [];

            back.skillEditorStart = function () {
                const cache = back.skill.primarySkillCache;
                back.skill = {
                    mode: 'self',
                    id: 'xxx',
                    kind: '',
                    type: [],
                    filter: [],
                    boolList: [],
                    uniqueList: [],
                    filter_card: [],
                    filter_suit: [],
                    filter_color: [],
                    variable_filter: new Map(),
                    variable_content: new Map(),
                    filterTarget: [],
                    selectTarget: '',
                    filterCard: [],
                    selectCard: '',
                    content: [],
                    contentAsync: false,
                    trigger: {
                        player: [],
                        source: [],
                        global: [],
                        target: []
                    },
                    respond: [],
                    viewAsCondition: [],
                    viewAs: [],
                    subSkill: {},
                    group: [],
                    uniqueTrigger: [],
                    tri_filterCard: [],
                    primarySkillCache: {
                        skill: {},
                        ele: {}
                    },
                    marktext: "",
                    markName: "",
                    markContent: ""
                }
                back.skill.primarySkillCache = { ...cache };
                back.organize()
            }
            back.getID = function () {
                return back.skill.subSkillEditing ? back.skill.primarySkillCache.skill.id + '_' + back.skill.id : back.skill.id
            }
            back.getSourceID = function () {
                return back.skill.primarySkillCache.skill.id || back.skill.id;
            }
            back.clearTextarea = function () {
                const listEle = [
                    "id",
                    "filter",
                    "content",
                    "trigger",
                    "filterTarget",
                    "filterCard"
                ]
                for (const itemName of listEle) {
                    back.ele[itemName].value = '';
                };
            }

            //缓存部分
            back.cachePrimarySkill = function () {
                if (!back.skill.subSkillEditing) {
                    const listSkill = Object.keys(back.skill).filter(item => {
                        return item !== "primarySkillCache" && !item.startsWith("variable_");
                    })
                    for (const itemName of listSkill) {
                        if (Array.isArray(back.skill[itemName])) {
                            back.skill.primarySkillCache.skill[itemName] = [...back.skill[itemName]];
                        }
                        else if (typeof back.skill[itemName] === "object") {
                            back.skill.primarySkillCache.skill[itemName] = { ...back.skill[itemName] };
                        }
                        else back.skill.primarySkillCache.skill[itemName] = back.skill[itemName];
                    }
                    const listEle = [
                        "id",
                        "filter",
                        "content",
                        "trigger",
                        "filterTarget",
                        "filterCard"
                    ]
                    for (const itemName of listEle) {
                        back.skill.primarySkillCache.ele[itemName] = back.ele[itemName].value;
                    };
                }
            }
            back.readPrimarySkillCache = function () {
                for (const itemName in back.skill.primarySkillCache.ele) {
                    back.ele[itemName].value = back.skill.primarySkillCache.ele[itemName];
                };
                for (const itemName in back.skill.primarySkillCache.skill) {
                    if (Array.isArray(back.skill[itemName])) {
                        back.skill[itemName] = [...back.skill.primarySkillCache.skill[itemName]];
                    }
                    else if (typeof back.skill[itemName] === "object") {
                        back.skill[itemName] = { ...back.skill.primarySkillCache.skill[itemName] };
                        continue;
                    }
                    back.skill[itemName] = back.skill.primarySkillCache.skill[itemName];
                }
                back.organize()
            }
            back.cacheSubskill = function () {
                if (back.skill.subSkillEditing) {
                    const id = back.skill.id
                    if (!back.skill.primarySkillCache.skill.subSkill[id]) back.skill.primarySkillCache.skill.subSkill[id] = {};
                    if (!back.skill.primarySkillCache.skill.subSkill[id].skill) back.skill.primarySkillCache.skill.subSkill[id].skill = {};
                    if (!back.skill.primarySkillCache.skill.subSkill[id].ele) back.skill.primarySkillCache.skill.subSkill[id].ele = {};
                    const listSkill = Object.keys(back.skill).filter(item => {
                        return item !== "primarySkillCache" && !item.startsWith("variable_");
                    })
                    for (const itemName of listSkill) {
                        if (Array.isArray(back.skill[itemName])) {
                            back.skill.primarySkillCache.skill.subSkill[id].skill[itemName] = [...back.skill[itemName]];
                        }
                        else if (typeof back.skill[itemName] === "object") {
                            back.skill.primarySkillCache.skill.subSkill[id].skill[itemName] = { ...back.skill[itemName] };
                        }
                        else back.skill.primarySkillCache.skill.subSkill[id].skill[itemName] = back.skill[itemName];
                    }
                    const listEle = [
                        "id",
                        "filter",
                        "content",
                        "trigger",
                        "filterTarget",
                        "filterCard"
                    ]
                    for (const itemName of listEle) {
                        back.skill.primarySkillCache.skill.subSkill[id].ele[itemName] = back.ele[itemName].value;
                    };
                    back.skill.mode = 'self';
                    back.organize();
                    back.skill.primarySkillCache.skill.subSkill[id].result = NonameCN.GenerateSubskill(back, id, back.target.value);
                }
            }
            back.readSubskillCache = function (id) {
                for (const itemName in back.skill.subSkill[id].ele) {
                    back.ele[itemName].value = back.skill.subSkill[id].ele[itemName];
                };
                for (const itemName in back.skill.subSkill[id].skill) {
                    if (Array.isArray(back.skill.subSkill[id].skill[itemName])) {
                        back.skill[itemName] = [...back.skill.subSkill[id].skill[itemName]];
                    }
                    else if (typeof back.skill.subSkill[id].skill[itemName] === "object") {
                        back.skill[itemName] = { ...back.skill.subSkill[id].skill[itemName] };
                        continue;
                    }
                    back.skill[itemName] = back.skill.subSkill[id].skill[itemName];
                }
                delete back.skill.subSkill;
                back.organize()
            }

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


            back.modTest = function () {
                back.ele.content.submit(true);
                back.skill.mod = {
                    cardUsable_Infinity: [],
                    targetInRange_Infinity: [],
                    targetEnabled_false: [],
                    cardEnabled_false: [],
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
                giveMethodOfGet('lengthOfCardEnabled', 'cardEnabled')
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
                        let match = regexp.exec(cont);
                        if (!match) return;
                        if (func) [output, attr] = func(...match)
                        {
                            const next = back.skill.content[i + 1];
                            //强制转对象,以便添加属性和方法
                            const last = new String(back.skill.content[i - 1]);
                            last.contentIndex = i - 1;
                            last.getLast = function () {
                                const result = new String(back.skill.content[this.contentIndex - 1])
                                if (result == "undefined") return;
                                if (result.endsWith(",")) return;
                                result.getLast = this.getLast;
                                result.contentIndex = this.contentIndex - 1;
                                return result;
                            }
                            if (last == "{" && next == "}") {
                                let line = last.getLast()
                                for (let _ = 0; _ < 20; _++) {
                                    if (line == "if(") break;
                                    if (line == "undefined") break;
                                    line = line.getLast();
                                }
                                if (line != "undefined") {
                                    const startIndex = line.contentIndex;
                                    let slice = back.skill.content.splice(startIndex, i - startIndex + 2);
                                    back.skill.mod[attr].push(...slice.slice(0, -2), output, slice.at(-1));
                                    return;
                                }
                            };
                            back.skill.content.remove(cont);
                            back.skill.mod[attr].push(output);
                        }
                    })
                }
                const matchCardName = Object.keys(NonameCN.groupedList.cardName).join('|')
                addMod(/^\s*(你|player)\s*计算(与|和)其他角色的?距离时?(减|\-|减少|加|\+|增加)([0-9]+)\s*$/, void 0, void 0, (match, ...p) => {
                    let symbol = getSymbol(p[2]);
                    return [`${symbol}:${p[3]}`, `globalFrom`];
                })
                addMod(/^\s*其他角色计算(与|和)(你|player)的?\s*距离时?(减|\-|减少|加|\+|增加)([0-9]+)\s*$/, void 0, void 0, (match, ...p) => {
                    let symbol = getSymbol(p[2]);
                    return [`${symbol}:${p[3]}`, `globalTo`];
                })
                //
                addMod(new RegExp(`^\s*(你|player)\s*不能成为\s*(${matchCardName})的?目标\s*$`), void 0, void 0, (match, ...p) => {
                    return [`name:${NonameCN.getEn(p[1])}`, `targetEnabled_false`]
                })
                addMod(new RegExp(`^\s*(你|player)\s*不能成为\s*(${matchCardName})(和|与|或|、)(${matchCardName})的?目标\s*$`), void 0, void 0, (match, ...p) => {
                    return [`name:${NonameCN.getEn(p[1])}-${NonameCN.getEn(p[3])}`, `targetEnabled_false`]
                })
                addMod(/^\s*(你|player)\s*不能成为\s*(基本牌|装备牌|普通锦囊牌|延时锦囊牌)的?目标\s*$/, void 0, void 0, (match, ...p) => {
                    return [`type:${NonameCN.getEn(p[1])}`, `targetEnabled_false`]
                })
                addMod(/^\s*(你|player)\s*不能成为\s*锦囊牌的?目标\s*$/, "type:trick-delay", "targetEnabled_false");
                //
                addMod(/^\s*(你|player)\s*使用的?\s*卡?牌(无|没有)(次数|数量|距离)限制\s*$/, void 0, void 0, (match, ...p) => {
                    return [`all`, `${p[2] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                });
                addMod(/^\s*(你|player)\s*使用的?\s*锦囊牌(无|没有)(次数|数量|距离)限制\s*$/, void 0, void 0, (match, ...p) => {
                    return ["type:trick-delay", `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                });
                addMod(new RegExp(`^\s*(你|player)\s*使用的?\s*(${matchCardName})(无|没有)(次数|数量|距离)限制\s*$`), void 0, void 0, (match, ...p) => {
                    return [`name:${NonameCN.getEn(p[1])}`, `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                });
                addMod(/^\s*(你|player)\s*使用的?\s*(基本牌|普通锦囊牌|延时锦囊牌)(无|没有)(次数|数量|距离)限制\s*$/, void 0, void 0, (match, ...p) => {
                    return [`type:${NonameCN.getEn(p[1])}`, `${p[3] == '距离' ? 'targetInRange' : 'cardUsable'}_Infinity`]
                });
                addMod(new RegExp(`^\s*(你|player)\s*不能使用(${matchCardName})\s*$`), void 0, void 0, (match, ...p) => {
                    return [`name:${NonameCN.getEn(p[1])}`, `cardEnabled_false`]
                });
                addMod(new RegExp(`^\s*(你|player)\s*不能使用(${matchCardName})(和|与|或|、)(${matchCardName})\s*$`), void 0, void 0, (match, ...p) => {
                    return [`name:${NonameCN.getEn(p[1])}-${NonameCN.getEn(p[3])}`, `cardEnabled_false`]
                });
                addMod(new RegExp(`^\s*(你|player)\s*不能使用牌\s*$`), void 0, void 0, (match, ...p) => {
                    return [`all`, `cardEnabled_false`]
                });
            }
            back.subSkillTest = function () {
                for (const skillName in back.skill.subSkill) {
                    if (back.skill.subSkill[skillName].viewAsSubSkill) delete back.skill.subSkill[skillName];
                }
                return true
            }
            back.groupTest = function () {
                for (const skillName in back.skill.subSkill) {
                    if (back.skill.subSkill[skillName].viewAsSubSkill) back.skill.group.remove(back.skill.id + '_' + skillName);
                }
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

            //调整显示
            back.updateDisplay = function () {
                for (const kindButton of back.ele.kinds) {
                    if (kindButton.kind == back.skill.kind) {
                        kindButton.style.backgroundColor = 'red';
                        continue;
                    }
                    kindButton.style.backgroundColor = "#e4d5b7";
                }
                for (const typeButton of back.ele.types) {
                    if (back.skill.type.includes(typeButton.type)) {
                        typeButton.style.backgroundColor = "red";
                        continue;
                    }
                    typeButton.style.backgroundColor = "#e4d5b7";
                }
                back.ele.groupsContainer.update()
                for (const uniqueButton of back.ele.groups) {
                    if (back.skill.uniqueList.includes(uniqueButton.dataset.attr)) {
                        uniqueButton.style.backgroundColor = "red";
                        continue;
                    }
                    uniqueButton.style.backgroundColor = "#e4d5b7";
                }
                for (const modeButton of back.ele.modes) {
                    if (modeButton.mode == back.skill.mode) {
                        modeButton.style.backgroundColor = 'red';
                        continue;
                    }
                    modeButton.style.backgroundColor = "#e4d5b7";
                }
                [...back.trigger, ...back.phaseUse, ...back.choose].forEach(i => {
                    i.style.display = 'none'
                });
                switch (back.skill.kind) {
                    case "trigger": {
                        back.trigger.forEach(i => { i.style.display = 'flex' });
                        back.trigger[0].parentElement.offBack()
                    }; break;
                    case 'enable:"phaseUse"': {
                        back.phaseUse.forEach(i => { i.style.display = 'flex' });
                        back.phaseUse[0].parentElement.offBack()
                    }; break;
                    default: {
                        back.skill.boolList.includes("viewAs") && back.choose.forEach(i => { i.style.display = 'flex' })
                        back.choose[0].parentElement.onBack()
                    }; break;
                }
            }
            back.prepare = function () {
                back.allVariable();
                back.skill.boolList.length = 0;
                if (!back.skill.mode) back.skill.mode = 'self';
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
                back.modTest();
                back.groupTest();
                back.aiTest();
                back.subSkillTest();
                //dom部分
                //更新显示状态
                back.updateDisplay();
            }
            back.organize = function () {
                back.prepare();
                /*初始化:最终输出的文字*/
                let strParts = [];
                //根据所选的编辑器类型确定开头
                strParts.push(NonameCN.GenerateOpening(back));
                strParts.push(NonameCN.GenerateInit(back));
                strParts.push(NonameCN.GenerateMod(back));
                strParts.push(NonameCN.GenerateKind(back));
                strParts.push(NonameCN.GenerateTag(back));
                strParts.push(NonameCN.GenerateGetIndex(back));
                //filter部分
                const filter = NonameCN.GenerateFilter(back)
                strParts.push(filter);
                strParts.push(NonameCN.GenerateEnable(back))
                //content部分
                if (!back.skill.boolList.includes("viewAs")) {
                    strParts.push(NonameCN.GenerateContent(back));
                }
                else if (back.skill.viewAs.length && back.skill.viewAsCondition.length) {
                    strParts.push(NonameCN.GenerateViewAs(back, 0));
                }
                if (back.aiArrange() && back.skill.ai.length) {
                    strParts.push(NonameCN.GenerateAi(back));
                }
                if (back.skill.boolList.includes("moreViewAs")) {
                    const limit = Math.min(back.skill.viewAs.length, back.skill.viewAsCondition.length);
                    for (let index = 1; index < limit; index++) {
                        back.skill.subSkill[index] = {
                            viewAsSubSkill: true,
                            result: NonameCN.GenerateSubskill(
                                back,
                                index,
                                `${back.skill.kind},\n`,
                                filter,
                                NonameCN.GenerateViewAs(back, index)
                            )
                        }
                        back.skill.group.push(back.skill.id + "_" + index)
                    }
                }
                strParts.push(NonameCN.GenerateAllSubskills(back));
                strParts.push(NonameCN.GenerateGroup(back));
                strParts.push(NonameCN.GenerateEnding(back));
                let str = strParts.join('')
                if (back.adjust) {
                    str = str.replace(/else\s*\n\s*{/g, "else{");
                    /*匹配满足特定条件的点（.）字符，其前面必须是一个等号（=）或者行首，并且后面跟着一个小写字母。
                    其用于匹配
                    */
                    str = str.replace(/(?<=(\=|^)\s*)\.(?=[a-z])/img, "player.");
                    str = str.replace(/([/][*])(.|\n)*([*][/])/g, "");
                }
                str = str.replace(/\.undefined/g, "");
                str = correctPunctuation(str)
                str = deleteRepeat(str, /if\(.+?\)/g);
                //tab处理
                str = adjustTab(str, back.skill.mode === 'self' ? 1 : 0);
                back.target.value = str;
            }
            function dispose(str, number, directory = lib.xjb_translate) {
                //初始化
                let list1 = str.split('\n').filter(line => !line.startsWith("/*") && !line.endsWith("*/") && line.length),
                    list2 = [],
                    list3 = [],
                    list4 = [];
                //切割
                if (number === 1) return list1;
                list1.forEach(i => {
                    list2.push(i.split(/[ \t]/));
                })
                if (number === 2) return list2;
                //翻译
                const matchNotObjColon = /(?<!\{[ \w"']+):(?![ \w"']+\})/;
                list2.forEach(i => {
                    let list = [];
                    const after = [];
                    const before = [];
                    i.forEach(a => {
                        let d = a;
                        //如果有对应的翻译,则翻译,否则,返回原文
                        d = directory[d] || d
                        if (d.includes(":denyPrefix")) {
                            d = d.replace(":denyPrefix", "")
                            before.push("! ")
                        }
                        if (d.includes(":intoFunctionWait")) {
                            d = d.replace(":intoFunctionWait", "");
                            d = d.split(matchNotObjColon);
                            list.push(d[0])
                            after.push(d.slice(1))
                            return
                        }
                        //如果中含有intoFunction,则将其分割,并放置于参数位置
                        if (d.includes(":intoFunction")) {
                            d = d.replace(":intoFunction", "");
                            d = d.split(matchNotObjColon);
                            list.push(...d);
                            return
                        }
                        list.push(d)
                    })
                    list3.push([...before, ...list, ...after])
                });
                if (number === 3) return list3;
                //组装
                list3.forEach(i => {
                    let str0 = '', str = '', str1 = '', str2 = '',
                        notice = [], bool = true, index,
                        players
                    //捕捉关键词
                    i.forEach(a => {
                        if (!game.xjb_judgeType(a)) return;
                        if (game.xjb_judgeType(a) === 'players') players = a
                    });
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
                                let arrA = a.split(matchNotObjColon);
                                let arrB = [];
                                arrA = arrA.filter(each => {
                                    if (each.startsWith("//!?")) {
                                        arrB.push(each.replace("//!?", ""))
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
                                    if (arrB.length) {
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
                        if (["const ", "let ", "var "].includes(a)) notice.push("variable")
                        if (notice.includes('game')) WAW(game)
                        else if (notice.includes('get')) WAW(get)
                        else if (notice.includes('player')) { WAW(player) }
                        else if (notice.includes('event')) WAW(eventModel)
                        else if (notice.includes('event')) WAW(eventModel)
                        else if (notice.includes('variable')) WAW({})
                        else if (notice.includes('array')) WAW([])
                        else WAW(player);
                    })
                    //填写参数
                    if (index) {
                        let toOrder = i.splice(index)
                        //排序
                        toOrder.sort((a, b) => {
                            let value1 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(a)),
                                value2 = get.xjb_MapNum(i[i.length - 1], game.xjb_judgeType(b))
                            return value1 - value2;
                        })
                        //补齐必须参数
                        let j = get.xjb_fAgruments(i[i.length - 1])
                        for (let g = 0; g < j.length; g++) {
                            if (get.xjb_judgeType(toOrder[g]) !== j[g]) {
                                toOrder.splice(g, 0, get.xjb_makeIt(j[g]));
                            }
                        }
                        //这里是连接函数参数
                        let puncSwtich = false
                        toOrder.forEach((c, b) => {
                            let string = '', a = c;
                            let punc = window.XJB_PUNC;
                            //翻译n到m
                            if (/到/.test(c)) {
                                let arr = c.split('到');
                                a = '[';
                                a += lib.xjb_translate[arr[0]] || arr[0];
                                a += ',';
                                a += lib.xjb_translate[arr[1]] || arr[1];
                                a += ']';
                            }
                            //非标点符号以,连接
                            if (b > 0 && !punc.includes(a) && !puncSwtich) {
                                string = ',' + a + ')';
                            }
                            //否则直接连接
                            else {
                                if (punc.includes(a)) puncSwtich = true;
                                else if (puncSwtich) puncSwtich = false;
                                string = a + ')';
                            }
                            //匹配最后一个括号以替换
                            str2 = str2.replace(/\)(?=[^\)]*$)/, string);
                        })
                    }
                    if (notice.includes('players')) {
                        str0 = players + '.forEach(i=>{';
                        str = str.replace(new RegExp(players, 'g'), 'i');
                        str2 = str2.replace(new RegExp(players, 'g'), 'i');
                        str2 += '})';
                    }
                    if (notice.includes('if') && !notice.includes('then')) {
                        str1 = ')';
                    }
                    let sentence = str0 + str + str1 + str2;
                    list4.push(sentence);
                });
                return list4;
            }
            /**
             * @param {String} tag 
             * @param {String} innerHTML 
             * @param {HTMLElement} father 
             * @returns {HTMLElement}
             */
            function newElement(tag, innerHTML = '', father) {
                let h = document.createElement(tag);
                h.innerHTML = innerHTML;
                if (father) father.appendChild(h);
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
                ele.addEventListener(DEFAULT_EVENT, fn)
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
                    "font-family": "xingkai",
                    backgroundColor: "rgba(60,65,81,0.7)",
                });
                back.pages.push(subBack)
                if (back.pages.length > 1) subBack.style.display = "none"
                subBack.flexRow = function () {
                    ui.xjb_giveStyle(subBack, {
                        flexDirection: 'row',
                    })
                    return this;
                }
                subBack.offBack = function () {
                    ui.xjb_giveStyle(subBack, {
                        backgroundColor: "",
                    })
                    return this;
                }
                subBack.onBack = function () {
                    ui.xjb_giveStyle(subBack, {
                        backgroundColor: "rgba(60,65,81,0.7)",
                    })
                    return this;
                }
                return subBack;
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
            function addSidebarButton(myTarget, myContainer, giveSentenceType) {
                const button_arrange = ui.create.xjb_button(myContainer, '整理');
                element().setTarget(button_arrange)
                    .listen(DEFAULT_EVENT, e => {
                        e.preventDefault();
                        myTarget.arrange();
                        myTarget.submit();
                    })
                const button_clear = ui.create.xjb_button(myContainer, '清空');
                element().setTarget(button_clear)
                    .listen(DEFAULT_EVENT, e => {
                        e.preventDefault();
                        myTarget.value = '';
                        myTarget.submit();
                    })
                const button_replace = ui.create.xjb_button(myContainer, '替换');
                element().setTarget(button_replace)
                    .listen(DEFAULT_EVENT, e => {
                        game.xjb_create.multiprompt(function () {
                            const searchValue = this.resultList[0];
                            const replaceValue = this.resultList[1];
                            myTarget.value = myTarget.value.replaceAll(searchValue, replaceValue)
                            myTarget.submit();
                        })
                            .appendPrompt('替换什么', void 0, '这里写替换的文字,不支持正则!')
                            .appendPrompt('替换为', void 0, '这里替换后的文字')
                    })
                const button_thisIdWithQuotes = ui.create.xjb_button(myContainer, '"本技能ID"');
                element().setTarget(button_thisIdWithQuotes)
                    .listen(DEFAULT_EVENT, e => {
                        e.preventDefault()
                        const start = myTarget.selectionStart;
                        const end = myTarget.selectionEnd;
                        const content = myTarget.value;
                        const id = `"` + back.getID() + `"`
                        myTarget.value = content.slice(0, start) + id + content.slice(end);
                        myTarget.selectionStart = myTarget.selectionEnd = start + id.length
                        myTarget.submit();
                    })
                const button_giveSentence = ui.create.xjb_button(myContainer, '查询语句')
                element().setTarget(button_giveSentence)
                    .listen(DEFAULT_EVENT, e => {
                        game.xjb_create.seeDelete(
                            NonameCN.giveSentence[giveSentenceType],
                            '使用',
                            '隐藏',
                            function () {
                                const id = this.container.dataset.xjb_id;
                                if (myTarget.value.length) myTarget.value += '\n';
                                myTarget.value += id;
                                myTarget.arrange();
                                myTarget.submit();
                            },
                            function () {
                            },
                            function () {
                            }
                        )
                    })
            }
            function tabChange(type) {
                let list = [];
                let tabMode = false;
                return function (e) {
                    if (e.key != 'Tab') {
                        if (!tabMode) return;
                        if (e.key === 'Backspace') return;
                        this.arrange();
                        this.submit();
                        tabMode = false;
                        return;
                    }
                    if (!tabMode) tabMode = true;
                    e.preventDefault();
                    const range = getLineRangeOfInput(this);
                    const start = range[0];
                    const end = range[1];
                    const content = this.value;
                    const subStr = content.slice(start, end).replace('\t', '');
                    if (this.selectionEnd == this.selectionStart) {
                        list = Object.keys(NonameCN.giveSentence[type]).filter(item => item.startsWith(subStr));
                    }
                    if (!list.length) {
                        this.selectionStart = start;
                        this.selectionEnd = end;
                        return;
                    }
                    const replacer = list.shift();
                    this.value = content.slice(0, start) + replacer + content.slice(end);
                    this.selectionStart = start;
                    this.selectionEnd = start + replacer.length;
                }
            }
            /**
             * @type {HTMLElement}
             */
            const buttonContainer = element("div")
                .style({
                    height: '1.5em',
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
            const next = newElement('span', '下一页', h1).setStyle({
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
            element().setTarget(next)
                .listen(DEFAULT_EVENT, turnNextPage)
                .shortCut('n')
            //切换至上一页
            const last = newElement('span', '上一页', h1).setStyle({
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
            {
                element().setTarget(last)
                    .listen(DEFAULT_EVENT, turnLastPage)
                    .shortCut('l');
            }

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
                try {
                    NonameCN.GenerateEditorError(
                        `"${idFree.value}"不是合法id`,
                        [
                            ...JavascriptGlobalVariable,
                            'player', 'target', 'event',
                            'result', 'trigger', 'card',
                            'cards', 'targets',
                            ...JavascriptUsualType,
                            ...JavascriptKeywords
                        ].includes(idFree.value)
                        || bannedKeyWords.some(i => idFree.value.includes(i))
                    );
                    if (idFree.value.includes("\n")) idFree.value = '';
                    back.skill.id = idFree.value;
                    back.organize();
                }
                catch (err) {
                    idFree.value = '';
                    game.xjb_create.alert('警告:' + err);
                }
            }
            idFree.addEventListener('keyup', idFree.submit);
            //
            let kindSeter = newElement('div', '技能种类:', subBack).style1();
            let kindFree = element()
                .clone(buttonContainer)
                .father(subBack)
                .exit()
            back.ele.kinds = kindFree.children
            {
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
            {
                const mapList = {
                    'zhuSkill': '主公技',
                    'forced': "强制发动",
                    "frequent": "自动发动",
                    'usable': '每回合一次',
                    'multitarget': "多角色",
                    "limited": "限定技",
                    "juexingji": "觉醒技",
                    "dutySkill": "使命技",
                    "skillAnimation": "技能动画",
                    "locked": "锁定技",
                    "persevereSkill": "持恒技",
                    "charlotte": "Charlotte技",
                    "locked-false": "非锁定技",
                    "zhenfa": "阵法技",
                    "mainSkill": "主将技",
                    "viceSkill": "副将技",
                    "preHidden": "预亮",
                    "zhuanhuanji": "转换技",
                    "hiddenSkill": "隐匿技",
                    "clanSkill": "宗族技",
                    "groupSkill": "势力技",
                    "mark": "标记持显",
                    'round': "每轮一次",
                    "direct": "直接发动",
                    "sunbenSkill": "昂扬技",
                    "chargeSkill": "蓄力技",
                    "chargingSkill": "蓄能技",
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
                if (back.skill.uniqueList.includes(attr)) {
                    back.skill.uniqueList.remove(attr);
                    e.target.style.backgroundColor = "#e4d5b7";
                } else {
                    let prefix = whichPrefix(attr, ["group", "mainVice", "animation", 'clan'])
                    findPrefix(back.skill.uniqueList, prefix).forEach(k => {
                        back.skill.uniqueList.remove(k);
                        let ele = groupFree.querySelector(`[data-attr="${k}"]`)
                        if (ele !== null) ele.style.backgroundColor = "#e4d5b7";
                    });
                    back.skill.uniqueList.push(attr);
                    e.target.style.backgroundColor = "red";
                }
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
                    if (back.skill.type.includes("mainSkill") || back.skill.type.includes("viceSkill")) {
                        mapList = Object.assign(mapList, {
                            "mainVice-remove1": "鱼减半个"
                        })
                    }
                    if (back.skill.type.includes("groupSkill")) {
                        [...lib.group, "key", "western"].forEach(group => {
                            mapList["group-" + group] = lib.translate[group] + "势力"
                        })
                    }
                    if (back.skill.type.includes("skillAnimation")) {
                        mapList = Object.assign(mapList, {
                            "animation-fire": "燎原动画",
                            "animation-wood": "绿茵动画",
                            "animation-water": "清波动画",
                            "animation-thunder": "紫电动画",
                            "animation-orange": "柑橘动画",
                            "animation-metal": "素金动画",
                        })
                    }
                    if (back.skill.type.includes("clanSkill")) {
                        mapList = Object.assign(mapList, {
                            "clan-陈留吴氏": "陈留吴氏",
                            "clan-颍川荀氏": "颍川荀氏",
                            "clan-颍川韩氏": "颍川韩氏",
                            "clan-太原王氏": "太原王氏",
                            "clan-颍川钟氏": "颍川钟氏"
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
            back.ele.modes = modeFree.children;
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
            let subBack2 = newPage().flexRow().offBack();
            let filterSeter = newElement('div', '<b><font color="red">发动条件</font></b>')
                .style1()
                .setStyle({
                    marginTop: "15px",
                    fontSize: '1.5em'
                })
            const filterFree = newElement('textarea', '')
            const filterContainer1 = element('div')
                .father(subBack2)
                .child(filterSeter)
                .child(filterFree)
                .flexColumn()
                .style({
                    flex: 2,
                    position: 'relative',
                    'backgroundColor': 'rgba(60,65,81,0.7)'
                })
                .exit()
            const filterContainer2 = element('div')
                .father(subBack2)
                .flexColumn()
                .style({
                    flex: 1,
                    position: 'relative',
                    'backgroundColor': 'rgba(63,65,81,0.9)'
                })
                .exit()
            addSidebarButton(filterFree, filterContainer2, 'filter')
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
                NonameCN.standardBoolExpBefore(that)
                NonameCN.underlieVariable(that)
                //处理角色相关字符
                playerCN.forEach(i => {
                    that.changeWord(new RegExp(i + '(的|于|在)回合外', 'g'), i + '不为当前回合角色')
                    that.changeWord(new RegExp(i + '的', 'g'), i)
                });
                appendWordToEvery(' ', playerCN);
                that.changeWord(/体力(?!上限|值)/g, '体力值');
                that.changeWord(/(?<=触发事件)(?!的)/g, ' ');
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
                that.changeWord(/(?<!\n)(并且|或者)/g, '\n$1')
                that.changeWord(/(并且|或者)(?!\n)/g, '$1\n')
                NonameCN.standardFilter(that);
                NonameCN.deleteBlank(that);
                that.adjustTab()
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
                const list = dispose(
                    filterFree.value,
                    back.FilterInherit ? 1 : void 0,
                    NonameCN.FilterList
                )
                const redispose = NonameCN.replace(list.join('\n')).map(t => {
                    let result = t.replace(/trigger(?!name)/g, 'event')
                    return result
                });
                back.skill.filter.push(...redispose);
                back.organize()
            }
            back.ele.filter.adjustTab = function () {
                const that = back.ele.filter;
                that.changeWord(/\t/g, '')
                that.value = adjustTab(that.value, 0, '分支开始', '分支结束')
            }

            listenAttributeChange(filterFree, 'selectionStart').start();
            textareaTool().setTarget(filterFree)
                .clearOrder()
                .dittoOrder()
                .dittoUnderOrder()
                .replaceThenOrder(/(?<![/][*])[ ]*back.FilterInherit[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.FilterInherit=true*/", () => { back.FilterInherit = true })
                .clearThenOrder(/([/][*])[ ]*back.FilterInherit[ ]*\=false[ ]*[ ]*([*][/])/g, () => { back.FilterInherit = false })
                .clearThenOrder("整理", back.ele.filter.arrange)
                .replaceOrder(/(本|此|该)技能id/g, back.getID)
                .replaceThenOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束", back.ele.filter.adjustTab)
                .replaceThenOrder('新否则', "否则\n分支开始\n\n分支结束", back.ele.filter.adjustTab)
                .debounce('keyup', back.ele.filter.submit, 200)
                .listen('keydown', deleteModule)
                .listen('selectionStartChange', adjustSelection)
                .listen('keydown', tabChange("filter"))
                .style({
                    height: '11em',
                    fontSize: '0.75em',
                    width: '85%',
                    tabSize: '2',
                })
                .placeholder(
                    '举例说明\n'
                    + '例如:有一个技能的发动条件是:你的体力值大于3\n'
                    + '就在框框中写:\n'
                    + '你体力值大于3\n'
                    + '每写完一个效果，就提行写下一个效果\n'
                    + "最后输入整理即可\n"
                );
            //第三页
            let subBack3 = newPage().flexRow().offBack();
            let contentSeter = newElement('div', '<b><font color=red>技能效果')
                .style1()
                .setStyle({
                    marginTop: "15px",
                    fontSize: '1.5em'
                })
            const contentFree = newElement('textarea', '');
            const contentContainer1 = element('div')
                .father(subBack3)
                .child(contentSeter)
                .child(contentFree)
                .flexColumn()
                .style({
                    flex: 2,
                    position: 'relative',
                    'backgroundColor': 'rgba(63,65,81,0.9)'
                })
                .exit()
            const contentContainer2 = element('div')
                .father(subBack3)
                .flexColumn()
                .style({
                    flex: 1,
                    position: 'relative',
                    'backgroundColor': 'rgba(60,65,81,0.7)'
                })
                .exit()
            addSidebarButton(contentFree, contentContainer2, "content")
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
                //
                newLine()
                //卡牌处理
                that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                    return p[0];
                })
                //处理角色称谓
                textareaTool().setTarget(that)
                    .replace(/(所|被)(选|选择)的?角色/g, '所选角色')
                //处理变量词
                NonameCN.standardShort(that)
                NonameCN.standardBoolExpBefore(that)
                NonameCN.standardModBefore(that)
                NonameCN.standardEffectBefore(that)
                NonameCN.underlieVariable(that)
                //处理player相关字符
                that.changeWord(new RegExp(`由(${JOINED_PLAYAERCN})造成的`, 'g'), `$1}`);
                that.changeWord(new RegExp(`对(${JOINED_PLAYAERCN})造成伤害的牌`, 'g'), "造成伤害的牌");
                that.changeWord(new RegExp(`(${JOINED_PLAYAERCN})的`, 'g'), '$1');
                ["体力值", "体力上限", "手牌数"].forEach(i => {
                    that.changeWord(new RegExp(i, 'g'), i + ' ');
                });
                //处理事件有关字符
                NonameCN.standardEvent(that);
                NonameCN.standardEeffectMid(that);
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
                for (let i = 1; i <= 10; i++) {
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
                for (let i = 1; i <= 10; i++) {
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
                    that.changeWord("加" + get.cnNumber(i), "+" + i);
                    that.changeWord("减" + get.cnNumber(i), "-" + i);
                    that.changeWord("乘" + get.cnNumber(i), "*" + i);
                    that.changeWord("乘以" + get.cnNumber(i), "*" + i);
                    that.changeWord("加" + (i), "+" + i);
                    that.changeWord("减" + (i), "-" + i);
                    that.changeWord("乘" + (i), "*" + i);
                    that.changeWord("乘以" + (i), "*" + i);
                    that.changeWord("*" + get.cnNumber(i), "*" + i);
                    that.changeWord("+" + get.cnNumber(i), "+" + i);
                    that.changeWord("-" + get.cnNumber(i), "-" + i);
                }
                that.value = suitSymbolToCN(that.value);
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
                    let group = findWordsGroup(line, playerCN);
                    if (line.includes("令为") || line.includes("变量") || !group.length) return;
                    if (/其他角色计算(和|与)你的?距离/.test(line)) return;
                    if (/添单[ ]*你/.test(line)) return;
                    if (new RegExp(`^无视${JOINED_PLAYAERCN}防具的牌$`).test(line)) return;
                    let restWords = clearWordsGroup(line, playerCN);
                    return `${group.shift()} ${restWords} ${group.join(" ")}`
                })
                that.changeWord(new RegExp(`(${JOINED_PLAYAERCN})`, 'g'), '$1 ');
                NonameCN.standardEvent(that);
                NonameCN.deleteBlank(that);
                that.changeWord(/(?<!\n)(并且|或者)/g, '\n$1');
                that.changeWord(/(并且|或者)(?!\n)/g, '$1\n');
                that.adjustTab();
            }
            contentFree.zeroise = function () {
                this.value = "";
            }
            contentFree.getID = function () {
                return back.getID();
            }
            back.ele.content.adjustTab = function () {
                const that = back.ele.content;
                that.changeWord(/\t/g, '');
                that.value = adjustTab(that.value, 0, '分支开始', '分支结束');
            }
            back.ele.content.inherit = function () {
                let wonderfulInherit = (contentFree.value.match(/继承.+\n/) && contentFree.value.match(/继承.+\n/)[0]) || '';
                if (wonderfulInherit && wonderfulInherit != '继承') {
                    let preSkill = '';
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
                    back.stepIgnore = true;
                    back.ContentInherit = true;
                }
            }
            back.ele.content.submit = function (bool = false) {
                back.ele.content.inherit();
                //清空content数组
                back.skill.content = []
                //数组为空则返回
                if (contentFree.value.length === 0) {
                    if (bool !== true) back.organize()
                    return;
                }
                //后续处理，如果涉及到继承，则为数字1就返回
                const list = dispose(contentFree.value, back.ContentInherit ? 1 : void 0, NonameCN.ContentList)
                const redispose = NonameCN.replace(list.join('\n'))
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
                .replaceOrder(/(本|此|该)技能id/g, back.getID)
                .clearThenOrder("整理", back.ele.content.arrange)
                .replaceThenOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束", back.ele.content.adjustTab)
                .replaceThenOrder('新否则', "否则\n分支开始\n\n分支结束", back.ele.content.adjustTab)
                .debounce('keyup', back.ele.content.submit, 200)
                .listen('keydown', deleteModule)
                .listen('selectionStartChange', adjustSelection)
                .listen('keydown', tabChange("content"))
                .style({
                    height: '11em',
                    fontSize: '0.75em',
                    width: '85%',
                    tabSize: '2',
                })
                .placeholder(
                    '举例说明\n'
                    + '例如:技能的一个效果是:你摸三张牌\n'
                    + '就在框框中写:\n'
                    + '你摸三张牌\n'
                    + '每写完一个效果，就提行写下一个效果\n'
                    + '最后输入整理即可'
                );
            //第五页
            let subBack5 = newPage();
            let triggerAdd = (who, en) => {
                back.trigger.push(who);
                who.style.display = 'none';
            }
            let triggerSeter = newElement('div', '<b><font color=red>触发时机</font></b>')
                .style1()
                .setStyle({
                    display: "block",
                    marginTop: "15px",
                    position: "relative",
                    fontSize: '1.5em'
                })
            const triggerFree = newElement('textarea', '')
            back.ele.trigger = triggerFree;
            const triggerPage = element('div')
                .father(subBack5)
                .flexRow()
                .height("100%")
                .width("100%")
                .exit()
            const triggerContainer1 = element('div')
                .father(triggerPage)
                .child(triggerSeter)
                .child(triggerFree)
                .flexColumn()
                .style({
                    flex: 2,
                    position: 'relative',
                    'backgroundColor': 'rgba(60,65,81,0.7)'
                })
                .exit()
            const triggerContainer2 = element('div')
                .father(triggerPage)
                .flexColumn()
                .style({
                    flex: 1,
                    position: 'relative',
                    'backgroundColor': 'rgba(63,65,81,0.9)'
                })
                .exit()
            addSidebarButton(triggerFree, triggerContainer2, "trigger")
            triggerFree.changeWord = function (replaced, replacer) {
                this.value = this.value.replace(replaced, replacer)
                return true
            }
            triggerFree.arrange = function () {
                const that = triggerFree;
                that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
                    return p[0];
                })
                //逻辑处理
                that.changeWord(/(?<!使用)或(?!打出)/g, ' ')
                //省略
                that.changeWord(/一张/g, '');
                that.changeWord(/^(.*?)(一点)(.*?)$/mg, '$1$3 $2')
                //统一写法                    
                that.changeWord(/红牌/g, '红色牌');
                that.changeWord(/黑牌/g, '黑色牌');
                that.value = suitSymbolToCN(that.value)
                NonameCN.standardTriBefore(that)
                //关于角色
                that.changeWord(/^(你|每名角色|一名角色)/mg, "$1 ")
                NonameCN.standardEvent(that);
                NonameCN.standardTri(that);
                NonameCN.deleteBlank(that);
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
                        .replace(/当(?!前)/g, '')
                    return myTarget;
                }
                let list = dispose(disposeTriggerValue(), 3, NonameCN.TriList)
                let tri_player = [], tri_global = [], tri_target = [], tri_source = [], tri_players = []
                let cardsNames = Object.keys(lib.card),
                    suits = lib.suits,
                    colors = Object.keys(lib.color)
                let strToArrayTarget = function (pending, str, global) {
                    if (!pending.includes(str)) return false;
                    if (!global) tri_target.includes(str) || tri_target.push(str);
                    pending = pending.replace(str, '').replace(':', '');
                    if (cardsNames.includes(pending)) back.skill.filter_card.push(str + ':"' + pending + '"')
                    if (suits.includes(pending)) back.skill.filter_suit.push(str + ':"' + pending + '"')
                    if (colors.includes(pending)) back.skill.filter_color.push(str + ':"' + pending + '"')
                    return true
                }
                let strToArrayPlayer = function (pending, str, global) {
                    if (!pending.includes(str)) return false;
                    if (!global) tri_player.includes(str) || tri_player.push(str);
                    pending = pending.replace(str, '').replace(':', '')
                    if (cardsNames.includes(pending)) back.skill.filter_card.push(str + ':"' + pending + '"')
                    if (suits.includes(pending)) back.skill.filter_suit.push(str + ':"' + pending + '"')
                    if (colors.includes(pending)) back.skill.filter_color.push(str + ':"' + pending + '"')
                    return true
                }
                list.forEach(i => {
                    let a = i
                    if (i.includes("一点")) {
                        a.remove("一点")
                        back.skill.getIndex = true
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
                    let a = i
                    if (i === 'damageSource') tri_source.push(a)
                    else if (i.startsWith("source:")) {
                        a = a.slice(7)
                        tri_source.push(a)
                    }
                    else if (i.startsWith("target:")) {
                        a = a.slice(7)
                        if (strToArrayTarget(a, 'useCardToTargeted')) { }
                        else if (strToArrayTarget(a, 'useCardToTarget')) { }
                        else tri_target.push(a)
                    }
                    else if (i.startsWith("loseAfter")) {
                        back.skill.uniqueTrigger.push('player:' + i);
                        tri_player.push("loseAfter", "loseAsyncAfter");
                        if (i !== 'loseAfter:discard') tri_global.push("equipAfter", "addJudgeAfter", "gainAfter", "addToExpansionAfter");
                    }
                    else if (i.startsWith("player:")) {
                        a = a.slice(7)
                        if (strToArrayPlayer(a, 'useCardToPlayered')) { }
                        else if (strToArrayPlayer(a, 'useCardToPlayer')) { }
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
                    let a = i
                    if (i.startsWith("source:")) {
                        let result = a.slice(7);
                        return result
                    } else if (i.startsWith("target:")) {
                        let result = a.slice(7)
                        if (strToArrayTarget(result, 'useCardToTargeted', true)) return "useCardToTargeted"
                        if (strToArrayTarget(result, 'useCardToTarget', true)) return "useCardToTarget"
                        return result;
                    } else if (i.startsWith("player:")) {
                        let result = a.slice(7)
                        if (strToArrayPlayer(result, 'useCardToPlayered', true)) return 'useCardToPlayered'
                        if (strToArrayPlayer(result, 'useCardToPlayer', true)) return "useCardToPlayer"
                        return result;
                    } else if (i.includes(':useCardAfter')) {
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
                back.skill.trigger.global.push(...new Set(tri_global))
                back.ele.filter.submit();
                back.ele.content.submit();
                back.organize()
            }
            textareaTool().setTarget(back.ele.trigger)
                .clearOrder()
                .dittoOrder()
                .dittoUnderOrder()
                .clearThenOrder("整理", back.ele.trigger.arrange)
                .replaceOrder(/(本|此|该)技能id/g, back.getID)
                .debounce('keyup', back.ele.trigger.submit, 200)
                .listen('keydown', tabChange("trigger"))
                .style({
                    height: '11em',
                    fontSize: '0.75em',
                    width: '85%',
                    tabSize: '2',
                    display: "block",
                })
                .placeholder(
                    '举例说明\n'
                    + '例如:有一个技能的发动时机是:你受到伤害后\n'
                    + '就在框框中写:\n'
                    + '你受到伤害后\n'
                    + '每写完一个时机，就提行写下一个时机\n'
                    + "最后输入整理即可\n"
                );
            triggerAdd(triggerPage)
            //
            let enableAdd = (who) => {
                back.phaseUse.push(who)
                who.style.display = 'none'
            }
            let enableButtonAdd = (word, en) => {
                let rat = newElement('div', '').setStyle({
                    marginTop: '10px',
                    height: '1em',
                    position: 'relative',
                    display: "block",
                })
                let it = ui.create.xjb_button(rat, word)
                ui.xjb_giveStyle(it, {
                    float: "",
                    fontSize: '1em',
                    position: 'relative'
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
                return rat
            }
            const filterTargetSeter = enableButtonAdd('选择角色', 'filterTarget')
            const filterTargetFree = newElement('textarea', '').setStyle({
                marginTop: '10px',
                marginLeft: '10px',
                height: '12em',
                fontSize: '0.75em',
                width: '85%',
                position: "relative"
            });
            const filterCardSeter = enableButtonAdd('选择卡片', 'filterCard')
            const filterCardFree = newElement('textarea', '');
            const enablePage = element('div')
                .father(subBack5)
                .flexRow()
                .height("100%")
                .width("100%")
                .exit()
            const enableContainer1 = element('div')
                .father(enablePage)
                .child(filterTargetSeter)
                .child(filterTargetFree)
                .flexColumn()
                .style({
                    flex: 1,
                    position: 'relative',
                    'backgroundColor': 'rgba(60,65,81,0.7)'
                })
                .exit()
            const enableContainer2 = element('div')
                .father(enablePage)
                .child(filterCardSeter)
                .child(filterCardFree)
                .flexColumn()
                .style({
                    flex: 1,
                    position: 'relative',
                    'backgroundColor': 'rgba(63,65,81,0.9)'
                })
                .exit()
            filterTargetFree.changeWord = function (replaced, replacer) {
                this.value = this.value.replace(replaced, replacer)
                return true
            }
            filterTargetFree.arrange = function () {
                const that = filterTargetFree
                that.changeWord(/所选角色/g, '目标')
                NonameCN.standardBoolExpBefore(that)
                NonameCN.underlieVariable(that)
                new Array('你', '目标').forEach(i => {
                    that.changeWord(new RegExp(i, 'g'), i + ' ')
                })
                that.changeWord(/二/g, '两')
                that.changeWord(/(?<=[0-9一二三四五六七八九])(?=到.+?名)/g, '名')
                for (let i = 1; i <= 10; i++) {
                    that.changeWord(new RegExp(`(${i}名)`, 'mg'), " $1 ");
                    that.changeWord(new RegExp(`(${get.cnNumber(i)}名)`, 'mg'), " $1 ");
                }
                NonameCN.deleteBlank(that)
            }
            filterTargetFree.adjustTab = function () {
                const that = filterTargetFree;
                that.changeWord(/\t/g, '')
                that.value = adjustTab(that.value, 0, '分支开始', '分支结束')
            }
            filterTargetFree.submit = function (e) {
                const that = filterTargetFree
                back.skill.filterTarget = [];
                back.skill.selectTarget = '';
                let line = dispose(that.value);
                let processLine = line.filter(line => {
                    let result = line
                    if (line.includes('atLeast')) {
                        result = result.replace('atLeast', '')
                        result = `[${result},Infinity]`
                        back.skill.selectTarget = result;
                        return false;
                    }
                    if (line.includes('atMost')) {
                        result = result.replace('atMost', '')
                        result = `[1,${result}]`
                        back.skill.selectTarget = result
                        return false;
                    }
                    if (/[0-9]到[0-9]/.test(line)) {
                        result = result.replace('到', ',')
                        result = `[${result}]`
                        back.skill.selectTarget = result
                        return false;
                    }
                    if (Number(result) == result) {
                        back.skill.selectTarget = result
                        return false;
                    }
                    return true
                })
                back.skill.filterTarget.push(...processLine)
                back.organize()
            }
            filterCardFree.changeWord = function (replaced, replacer) {
                this.value = this.value.replace(replaced, replacer)
                return true
            }
            filterCardFree.arrange = function () {
                const that = filterCardFree
                that.changeWord(/所选角色/g, '目标')
                NonameCN.standardBoolExpBefore(that)
                NonameCN.underlieVariable(that)
                new Array('你', '目标').forEach(i => {
                    that.changeWord(new RegExp(i, 'g'), i + ' ')
                })
                that.changeWord(/二/g, '两')
                that.changeWord(/(?<=[0-9一二三四五六七八九])(?=到.+?张)/g, '张')
                for (let i = 1; i <= 10; i++) {
                    that.changeWord(new RegExp(`(${i}张)`, 'mg'), " $1 ");
                    that.changeWord(new RegExp(`(${get.cnNumber(i)}张)`, 'mg'), " $1 ");
                }
                NonameCN.deleteBlank(that)
            }
            filterCardFree.adjustTab = function () {
                const that = filterCardFree;
                that.changeWord(/\t/g, '')
                that.value = adjustTab(that.value, 0, '分支开始', '分支结束')
            }
            filterCardFree.submit = function (e) {
                const that = filterCardFree
                back.skill.filterCard = [];
                back.skill.selectCard = '';
                let line = dispose(that.value);
                let processLine = line.filter(line => {
                    let result = line
                    if (line.includes('atLeast')) {
                        result = result.replace('atLeast', '')
                        result = `[${result},Infinity]`
                        back.skill.selectCard = result;
                        return false;
                    }
                    if (line.includes('atMost')) {
                        result = result.replace('atMost', '')
                        result = `[1,${result}]`
                        back.skill.selectCard = result
                        return false;
                    }
                    if (/[0-9]到[0-9]/.test(line)) {
                        result = result.replace('到', ',')
                        result = `[${result}]`
                        back.skill.selectCard = result
                        return false;
                    }
                    if (Number(result) == result) {
                        back.skill.selectCard = result
                        return false;
                    }
                    return true
                })
                back.skill.filterCard.push(...processLine)
                back.organize()
            }
            back.ele.filterTarget = filterTargetFree
            back.ele.filterCard = filterCardFree
            textareaTool().setTarget(back.ele.filterTarget)
                .clearOrder()
                .dittoOrder()
                .dittoUnderOrder()
                .order(/.+/, e => { if (!back.skill.type.includes('filterTarget')) e.target.value = '' })
                .clearThenOrder("整理", back.ele.filterTarget.arrange)
                .replaceOrder(/(本|此|该)技能id/g, back.getID)
                .replaceThenOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束", back.ele.filterTarget.adjustTab)
                .replaceThenOrder('新否则', "否则\n分支开始\n\n分支结束", back.ele.filterTarget.adjustTab)
                .debounce('keyup', back.ele.filterTarget.submit, 200)
                .listen('keydown', tabChange("trigger"))
                .style({
                    marginTop: '10px',
                    marginLeft: '10px',
                    height: '12em',
                    fontSize: '0.75em',
                    width: '88%',
                    position: "relative"
                })
                .placeholder(
                    '点击选择角色按钮后可进行书写!!!\n'
                    + '可以设置选择角色的数量:\n'
                    + '比如你可以在一行中写:\n'
                    + '两名/至少一名/至多五名/一到两名\n'
                    + '你也可以写角色的限制条件,写法同限制条件框\n'
                    + '比如你可以在一行中写:\n'
                    + '所选角色体力大于3\n'
                    + '每写完一个条件,就提行写下一个条件\n'
                    + "最后输入整理即可\n"
                );
            textareaTool().setTarget(back.ele.filterCard)
                .clearOrder()
                .dittoOrder()
                .dittoUnderOrder()
                .order(/.+/, e => { if (!back.skill.type.includes('filterCard')) e.target.value = '' })
                .clearThenOrder("整理", back.ele.filterCard.arrange)
                .replaceOrder(/(本|此|该)技能id/g, back.getID)
                .replaceThenOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束", back.ele.filterCard.adjustTab)
                .replaceThenOrder('新否则', "否则\n分支开始\n\n分支结束", back.ele.filterCard.adjustTab)
                .debounce('keyup', back.ele.filterCard.submit, 200)
                .style({
                    marginTop: '10px',
                    marginLeft: '10px',
                    height: '12em',
                    fontSize: '0.75em',
                    width: '88%',
                    position: "relative"
                })
                .placeholder(
                    '点击选择卡片按钮后可进行书写!!!\n'
                    + '可以设置选择卡片的数量:\n'
                    + '比如你可以在一行中写:\n'
                    + '两张/至少一张/至多五张/一到两张\n'
                    + '你也可以写卡片的限制条件,写法同限制条件框\n'
                    + '比如你可以在一行中写:\n'
                    + '卡片颜色为红色\n'
                    + '每写完一个条件,就提行写下一个条件\n'
                    + "最后输入整理即可\n"
                );
            enableAdd(enablePage);
            //
            let chooseSeter = newElement('div', '视为的牌')
                .style1()
                .setStyle({
                    "height": "1em"
                })
            const cardNameFree = element()
                .clone(buttonContainer)
                .flexRow()
                .setStyle("align-items", "center")
                .exit();
            cardNameFree.colorList = ["red", "orange", "yellow", "green", "pink", "#add8e6"]
            let costSeter = newElement('div', '视为的花费')
                .style1()
                .setStyle({
                    "height": "1em"
                })
            const costFree1 = element()
                .clone(buttonContainer)
                .flexRow()
                .exit();
            const costFree2 = element()
                .clone(costFree1)
                .exit();
            const costFree3 = element()
                .clone(costFree1)
                .exit();
            const choosePage = element('div')
                .father(subBack5)
                .child(chooseSeter)
                .child(cardNameFree)
                .child(costSeter)
                .child(costFree1)
                .child(costFree2)
                .child(costFree3)
                .flexColumn()
                .setStyle("just-content", "space-evenly")
                .height("100%")
                .width("100%")
                .exit()
            {
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
                        element().setTarget(it)
                            .block()
                            .setStyle("fontSize", "1em")
                            .hook(ele => {
                                ele[domEleAttr] = en
                                if (k >= 6) ui.xjb_giveStyle(it, {
                                    display: 'none'
                                });
                            })
                    });
                    listener(domEle, e => {
                        let list = Array.from(domEle.children)
                        if (!list.includes(e.target)) return;
                        if (e.target.innerText.includes('>>>')) {
                            const a = list.indexOf(e.target) + 1;
                            let b = Math.min((a + 5), (list.length - 1));
                            list.splice(a, (b - a + 1)).forEach(ele => ele.style.display = "block")
                            list.forEach(ele => ele.style.display = "none")
                            return;
                        }
                        if (e.target.innerText.includes('<<<')) {
                            const a = list.indexOf(e.target) - 1;
                            let b = Math.max(0, (a - 5));
                            list.splice(b, (a - b + 1)).forEach(ele => ele.style.display = "block")
                            list.forEach(ele => ele.style.display = "none")
                            return;
                        }
                        if (backAttr.includes(e.target[domEleAttr])) backAttr.remove(e.target[domEleAttr]);
                        else if (backAttr.length < colorList.length) backAttr.push(e.target[domEleAttr]);
                        let arr = Array.from(domEle.children)
                        for (let collection of extra) {
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
                    setDom(cardNameFree, mapList, back.skill.viewAs, "cardName", [])
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
                    setDom(costFree1, mapList, back.skill.viewAsCondition, "condition", costFree2.children, costFree3.children)
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
                    setDom(costFree2, mapList, back.skill.viewAsCondition, "condition", costFree1.children, costFree3.children)
                };
                if (costFree3) {
                    const mapList = {
                        "preEve-link-true": "横置之",
                        "preEve-link-false": "重置之"
                    };
                    setDom(costFree3, mapList, back.skill.viewAsCondition, "condition", costFree1.children, costFree2.children)
                };
            }
            //第四页
            let subBack4 = newPage()
            let skillSeter = newElement('h2', '技能', subBack4)
            let subSkill = newElement('span', '更多', skillSeter)
            subSkill.style.float = 'right'
            listener(subSkill, e => {
                game.xjb_create.chooseAnswer(
                    "选择一个功能进行",
                    [
                        "添加子技能",
                        "查看及删除子技能",
                        "切换为原技能",
                        "添加技能组",
                        "查看及删除技能组",
                        "增添标记"
                    ],
                    true,
                    function () {
                        switch (this.resultIndex) {
                            case 0: {
                                if (back.skill.subSkillEditing) return game.xjb_create.alert("此技能已经是一个子技能!")
                                back.cachePrimarySkill();
                                back.ele.groupsContainer.groupsPageNum = 0;
                                back.clearTextarea();
                                back.skillEditorStart();
                                delete back.skill.subSkill
                                back.skill.subSkillEditing = true;
                            }; break;
                            case 1: {
                                if (back.skill.subSkillEditing) return game.xjb_create.alert("此技能已经是一个子技能!")
                                const map = {};
                                for (let skillName of Object.keys(back.skill.subSkill)) {
                                    skillName = skillName;
                                    if (back.skill.group.includes(skillName)) continue;
                                    map[skillName] = `子技能-${skillName}`
                                }
                                game.xjb_create.seeDelete(
                                    map,
                                    '查看',
                                    '删除',
                                    function () {
                                        const id = this.container.dataset.xjb_id;
                                        back.cachePrimarySkill();
                                        back.readSubskillCache(id);
                                        element().setTarget(back)
                                            .anotherClickTouch(this.yesButton, 'touchend')
                                        back.ele.groupsContainer.groupsPageNum = 0;
                                        back.skill.subSkillEditing = true;
                                        back.organize()
                                    },
                                    function () {
                                        const id = this.container.dataset.xjb_id
                                        delete back.skill.subSkill[id]
                                        back.organize()
                                    },
                                    function () {
                                    }
                                )
                            }; break;
                            case 2: {
                                if (back.skill.subSkillEditing) {
                                    back.cacheSubskill()
                                }
                                back.readPrimarySkillCache()
                                back.skill.subSkillEditing = false;
                            }; break;
                            case 3: {
                                const map = {};
                                for (let skillName of Object.keys(back.skill.subSkill)) {
                                    skillName = back.skill.id + "_" + skillName;
                                    if (back.skill.group.includes(skillName)) continue;
                                    map[skillName] = `${skillName}(${skillName})`
                                }
                                for (let skillName in lib.skill) {
                                    if (!lib.translate[skillName]) continue;
                                    if (!lib.translate[skillName + "_info"]) continue;
                                    if (back.skill.group.includes(skillName)) continue;
                                    map[skillName] = `${lib.translate[skillName]}(${skillName})`
                                }
                                game.xjb_create.seeDelete(
                                    map,
                                    '查看',
                                    '添加',
                                    function () {
                                        if (this.innerText === "查看") {
                                            const id = this.container.dataset.xjb_id
                                            this.descEle.innerHTML += `<span>${lib.translate[id + '_info']}</span>`
                                            this.innerText = "收起"
                                            this.seeExpanding = true;
                                        } else if (this.innerText === "收起") {
                                            /**
                                             * @type {HTMLElement}
                                             */
                                            const descEle = this.descEle
                                            const span = descEle.querySelector('span')
                                            span && span.remove();
                                            this.innerText = '查看'
                                            this.seeExpanding = false;
                                        }

                                    },
                                    function () {
                                        const id = this.container.dataset.xjb_id
                                        this.yesButton.result.push(id)
                                    },
                                    function () {
                                        back.skill.group.push(...this.result)
                                        back.organize()
                                    }
                                )
                            }; break;
                            case 4: {
                                const map = {};
                                for (let skillName of back.skill.group) {
                                    map[skillName] = `${lib.translate[skillName]}(${skillName})`
                                }
                                let dialog = game.xjb_create.seeDelete(
                                    map,
                                    '查看',
                                    '删除',
                                    function () {
                                        if (this.innerText === "查看") {
                                            const id = this.container.dataset.xjb_id
                                            this.descEle.innerHTML += `<span>${lib.translate[id + '_info']}</span>`
                                            this.innerText = "收起"
                                        } else if (this.innerText === "收起") {
                                            /**
                                             * @type {HTMLElement}
                                             */
                                            const descEle = this.descEle
                                            const span = descEle.querySelector('span')
                                            span && span.remove();
                                            this.innerText = '查看'
                                        }

                                    },
                                    function () {
                                        const id = this.container.dataset.xjb_id
                                        this.yesButton.result.remove(id)
                                    },
                                    function () {
                                        back.skill.group = [...this.result]
                                        back.organize()
                                    }
                                )
                                dialog.buttons[0].result = [...back.skill.group]
                            }; break;
                            case 5: {
                                game.xjb_create.multiprompt(function () {
                                    back.skill.marktext = this.resultList[0];
                                    back.skill.markName = this.resultList[1];
                                    back.skill.markContent = this.resultList[2];
                                    back.organize();
                                })
                                    .appendPrompt('标记外观', back.skill.marktext ? back.skill.marktext : void 0, '这里写标记外观文字,只能写一个字!',)
                                    .appendPrompt('标记名字', back.skill.markName ? back.skill.markName : void 0, '这里写标记的名字',)
                                    .appendPrompt('标记内容', back.skill.markContent ? back.skill.markContent : void 0, '这里写点开标记后显示的内容', 4);
                            }; break;
                        }
                    }
                )
            })
            let copy = newElement('span', '复制', skillSeter)
            copy.style.marginRight = "0.5em"
            copy.style.float = 'right'
            function copyToClipboard() {
                if (document.execCommand) {
                    back.target.select();
                    document.execCommand("copy")
                } else {
                    game.xjb_create.alert('由于所用方法已废弃，请手动复制(已为你选中，点击文本框即可复制。)', function () {
                        back.target.select();
                    })
                }
            }
            function throwEditorResultErrow() {
                NonameCN.GenerateEditorError(
                    `使用牌开始时（"useCardBegin"）并不是“牌无法相应”的对应触发时机，请换成“使用牌时”、“使用牌指定目标（后）”或“成为牌的目标（后）”`,
                    /"useCard(Begin|Before)"/.test(back.target.value),
                    /trigger\.getParent\("useCard",void 0,true\).directHit/.test(back.target.value)
                )
                NonameCN.GenerateEditorError(
                    `引用了目标组中的元素却没有“多角色”标签！请在第一页-技能标签中选中“多角色”标签后再试！`,
                    !back.skill.type.includes("multitarget"),
                    back.skill.type.includes("filterTarget"),
                    /(?<!result.)targets\[[0-9]\]/.test(back.target.value)
                )
            }
            listener(copy, e => {
                e.preventDefault();
                try {
                    throwEditorResultErrow()
                    if (back.skill.mode === 'mainCode') {
                        let func = new Function('lib', back.target.value)
                    }
                    else new Function('let mega={' + back.target.value + '}')
                    if (isOpenCnStr(back.target.value)) {
                        game.xjb_create.confirm(
                            "代码中含有未被引号包围的全中文段落，说明该功能可能暂未实现，仍要复制吗？",
                            copyToClipboard()
                        )
                    } else {
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
                    throwEditorResultErrow()
                    if (isOpenCnStr(back.target.value)) throw new Error("代码中含有未被引号包围的全中文段落！")
                    if (back.skill.mode === 'mainCode') {
                        let func = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', back.target.value)
                        func(_status, lib, game, ui, get, ai);
                        game.xjb_create.confirm('技能' + back.skill.id + "已生成(本局游戏内生效)!是否将该技能分配给玩家？", function () {
                            game.me.addSkill(back.skill.id)
                            if (back.skill.group) game.me.addSkill(back.skill.group)
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
            back.contentDoms = [contentContainer1, contentContainer2]
            back.viewAsDoms = [chooseSeter]
            back.choose = [choosePage];
            //初始化
            back.organize()
            return back
        }
        ui.create.system("技能编辑", game.xjb_skillEditor);
    }
    EditorContent()
}