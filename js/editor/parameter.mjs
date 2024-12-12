const judgeIsLimitSkill = (skill) => {
    return skill.limited || skill.juexingji || skill.dutySkill
}
export const EditorParameterList = {
    draw: [
        { cn: "张数", type: "number", value: "num", min: 1, mission: "摸牌" },
        { cn: "来源(谁令你摸的?)", type: "Player", value: "source" },
        { cn: "有无摸牌动画(默认有)", type: "boolean", value: "animate", defualtValue: true, cnTrue: "有", cnFalse: "无" },
        {
            type: "otherArgs",
            args: [
                { cn: "无延迟摸牌", value: 'nodelay', type: "string" },
                { cn: "摸到的牌全场可见", value: 'visible', type: "string" },
                { cn: "从牌堆底摸", value: 'bottom', type: "string" }
            ]
        }
    ],
    drawTo: [
        { cn: "到多少", type: "number", value: "num", min: 1, order: true, mission: "将手牌摸至" },
        {
            type: "heArray",
            eles: [
                { cn: "来源(谁令你摸的?)", value: "source", type: "Player" },
                { cn: "有无摸牌动画", value: "animate", type: "boolean", defualtValue: true, cnTrue: "有", cnFalse: "无" },
                {
                    type: "otherArgs",
                    args: [
                        { cn: "无延迟摸牌", value: 'nodelay', type: "string" },
                        { cn: "摸到的牌全场可见", value: 'visible', type: "string" },
                        { cn: "从牌堆底摸", value: 'bottom', type: "string" }
                    ]
                }
            ]
        }
    ],
    gain: [
        { cn: "获得的牌", type: "cards", value: "cards", mission: "获得牌" },
        { cn: "来源(从谁那里获得了牌)", type: "Player", value: "source" },
        {
            cn: "获得牌动画", type: "stringToChoose", value: "animate",
            choices: [
                ["一般式获得", "gain2"],
                ["涌出后获得", "gain"],
                ["背面朝下", "draw"],
                ["可见式给出牌", 'give'],
                ["不可见式给出牌", 'giveAuto']
            ]
        },
        { cn: "获得牌是否有延迟", type: "boolean", value: "delay" },
        {
            type: "otherArgs",
            args: [
                { cn: "录入游戏日志", value: 'log', type: "string" },
                { cn: "从标记中获得牌", value: 'fromStorage', type: "string" },
                { cn: "从仁库中获得牌", value: 'fromRenku', type: "string" },
                { cn: "这是从自己这里获得的牌", value: 'bySelf', type: "string" },
            ]
        }
    ],
    gainMultiple: [
        { cn: "获得牌的角色", type: "Players", value: "targets", mission: "获得多名角色指定区域的牌", order: true },
        { cn: "可获得牌区域(默认为手牌区)", type: "position", value: "position", positionList: "hej" },
    ],
    give: [
        { cn: "给出的牌", type: "cards", value: "cards", mission: "给出牌", order: true },
        { cn: "给牌的目标", type: "Player", value: "target" },
        { cn: "给出牌是否可见", type: "boolean", value: "animate" }
    ],
    lose: [
        { cn: "失去的牌", type: "cards", value: "cards", mission: "失去牌" },
        { cn: "来源(因为谁失去了牌)", type: "Player", value: "source" },
        {
            cn: "牌的去向", type: "freeInput", value: "position",
            choices: {
                "牌堆": "ui.cardPile",
                "弃牌堆": "ui.discardPile",
                "中央区": "ui.ordering"
            }
        },
        {
            type: "otherArgs",
            args: [
                { cn: "这些牌可见", value: "visible", type: "string" },
                { cn: "这些牌加入仁库(无视去向)", value: 'toRenku', type: "string" },
                { cn: "插入所选去向中(影响顺序)", value: "insert", type: "string" }
            ]
        }
    ],
    loseToDiscardpile: [
        { cn: "失去的牌", type: "cards", value: "cards", mission: "失去牌至弃牌堆" },
        { cn: "来源(因为谁弃置了牌)", type: "Player", value: "source" },
        { cn: "有无弃牌动画", type: "boolean", value: "animate" },
        {
            type: "otherArgs",
            args: [
                { cn: "不是被自己弃置的牌", value: "notBySelf", type: "string" },
                { cn: "插入到弃牌堆中(影响顺序)", value: "insert", type: "string" },
                { cn: "事件是否可见", value: "blank", type: "string" }
            ]
        }
    ],
    loseToSpecial: [
        { cn: "失去的牌", type: "cards", value: "cards", order: true, mission: "失去牌至特殊区域" },
        { cn: "特殊区域的名字(英文则自动翻译)", type: "string", value: "source", skillIdToList: true },
        { cn: "到谁的特殊区域(默认为你)", type: "Player", value: "target" },
    ],
    addToExpansion: [
        { cn: "获得的牌", type: "cards", value: "cards", mission: "置于武将牌上", NaPIndex: [2] },
        { cn: "牌的来源", type: "Player", value: "source" },
        { cn: "牌的记号", type: "stringArray", value: "gaintag" },
        {
            cn: "获得牌动画", type: "stringToChoose", value: "animate",
            choices: [
                ["一般式获得", "gain2"],
                ["涌出后获得", "gain"],
                ["背面朝下", "draw"],
                ["可见式给出牌", 'give'],
                ["不可见式给出牌", 'giveAuto']
            ]
        },
        { cn: "获得牌是否有延迟", type: "boolean", value: "delay" },
        {
            type: "otherArgs",
            args: [
                { cn: "录入游戏日志", value: 'log', type: "string" },
                { cn: "牌来自标记中", value: 'fromStorage', type: "string" },
                { cn: "牌来自仁库中", value: 'fromRenku', type: "string" },
                { cn: "牌来自自己", value: 'bySelf', type: "string" },
            ]
        }
    ],
    discard: [
        { cn: "弃置的牌", type: "cards", value: "cards", mission: "弃置牌" },
        { cn: "来源(因为谁弃置了牌)", type: "Player", value: "source" },
        { cn: "有无弃牌动画", type: "boolean", value: "animate" },
        {
            cn: "牌的去向", type: "freeInput", value: "position",
            choices: {
                "牌堆": "ui.cardPile",
                "弃牌堆": "ui.discardPile",
                "中央区": "ui.ordering"
            }
        },
        {
            type: "otherArgs",
            args: [
                { cn: "不是被自己弃置的牌", value: "notBySelf", type: "string" },
            ]
        }
    ],
    randomDiscard: [
        { cn: "弃置的张数", type: "number", value: "num", mission: "随机弃置指定区域的牌" },
        { cn: "弃置牌的区域", type: "position", value: "position", positionList: "he" },
        { cn: "是否有延迟", type: "boolean", value: "delay" }
    ],
    randomGain: [
        { cn: "从谁哪里获得牌", type: "Player", value: "target", mission: "随机获得指定区域的牌" },
        { cn: "获得的张数", type: "number", value: "num" },
        { cn: "弃置牌的区域", type: "position", value: "position", positionList: "he" },
        { cn: "是否有指示线", type: "boolean", value: "delay" }
    ],
    //缺少后面两个函数参数 但是一般用不到
    recast: [
        { cn: "重铸的牌", type: "cards", value: "cards", mission: "重铸牌" },
    ],
    swapHandcards: [
        { mission: "交换手牌区", type: "Player", value: "target", cn: "交换的角色" },
        { cn: "你用来交换的手牌", type: "cards", value: "cards1" },
        { cn: "目标用来交换的手牌", type: "cards", value: "cards2" }
    ],
    swapEquip: [
        { mission: "交换装备区", type: "Player", value: "target", cn: "交换的角色" }
    ],
    link: [
        { cn: "指定重置/横置类型", type: "boolean", cnTrue: "横置", cnFalse: "重置", mission: "横置或重置" }
    ],
    turnOver: [
        { cn: "指定翻面类型", type: "boolean", cnTrue: "翻至正面朝下", cnFalse: "翻至正面朝上", mission: "翻面" }
    ],
    damage: [
        { cn: "伤害点数", type: "number", value: "num", min: 0, mission: "受到伤害" },
        { cn: "伤害属性", type: "nature", value: "nature", singer: false },
        { cn: "伤害来源(选择了“没有伤害来源”则本设置失效)", value: "source", type: "Player" },
        {
            type: "otherArgs",
            args: [
                { cn: "虚拟伤害", value: 'unreal', type: "string" },
                { cn: "没有伤害来源", value: "nosource", key: null, type: "string" },
                { cn: "没有造成伤害卡牌(默认为事件相关的卡牌)", value: "nocard", key: null, type: "string" },
                { cn: "不触发Before/Begin/End/After四个时机", value: 'notrigger', type: "string" },
            ]
        }
    ],
    recover: [
        { cn: "回复点数", type: "number", value: "num", min: 1, mission: "回复体力" },
        { cn: "回复来源(选择了“没有回复来源”则本设置失效)", value: "source", type: "Player" },
        {
            type: "otherArgs",
            args: [
                { cn: "没有回复来源", value: "nosource", key: null, type: "string" },
                { cn: "没有回复体力的卡牌(默认为事件相关的卡牌)", value: "nocard", key: null, type: "string" }
            ]
        }
    ],
    recoverTo: [
        { cn: "到多少", type: "number", value: "num", min: 1, mission: "将体力值回复至" },
        { cn: "回复来源(选择了“没有回复来源”则本设置失效)", value: "source", type: "Player" },
        {
            type: "otherArgs",
            args: [
                { cn: "没有回复来源", value: "nosource", key: null, type: "string" },
                { cn: "没有回复体力的卡牌(默认为事件相关的卡牌)", value: "nocard", key: null, type: "string" }
            ]
        }
    ],
    loseHp: [
        { cn: "失去体力的点数", type: "number", value: "num", min: 1, mission: "失去体力" }
    ],
    gainMaxHp: [
        { cn: "增加的体力上限点数", type: "number", value: "num", min: 1, mission: "增加体力上限" }
    ],
    loseMaxHp: [
        { cn: "失去的体力上限点数", type: "number", value: "num", min: 1, mission: "失去体力上限" }
    ],
    changeHujia: [
        { cn: "更改的点数", type: "number", value: "num", order: true, mission: "改变护甲值" },
        {
            cn: "类型(默认自动设置)", type: "stringToChoose", value: "type",
            choices: [
                ["获得护甲", "gain"],
                ["失去护甲", "lose"],
                ["抵消伤害", "damage"],
                ["空", "null"]
            ]
        },
        { cn: "护甲值上限(若设为true,则为5)", type: "number", value: "limit", defaultVars: ["true"] }
    ],
    skip: [
        { cn: "跳过的阶段名", type: "phase", single: true, mission: "跳过阶段" }
    ],
    changeGroup: [
        { cn: "改为的势力", type: "group", value: "group", single: true, mission: "更改势力", order: true },
        { cn: "是否录入游戏日志", type: "boolean" }
    ],
    addSkill: [
        { cn: "获得的技能", type: "skill", mission: "获得技能", order: true },
        { cn: "是否检查禁用技能组目录", type: "boolean" },
    ],
    removeSkill: [
        { cn: "失去的技能", type: "skill", mission: "失去技能" },
    ],
    addSkills: [
        { cn: "获得的技能", type: "skill", value: "addSkill", mission: "获得技能(触发事件)" },
    ],
    removeSkills: [
        { cn: "失去的技能", type: "skill", value: "removeSkill", mission: "失去技能(触发事件)" },
    ],
    changeSkills: [
        { cn: "获得的技能", type: "skill", mustBeArray: true, value: "addSkill", mission: "更换技能", order: true },
        { cn: "失去的技能", type: "skill", mustBeArray: true, value: "removeSkill" },
    ],
    addAdditionalSkill: [
        { cn: "为哪个技能添加衍生技", type: "skill", single: true, order: true, mission: "获得衍生技能" },
        { cn: "设置衍生技能", type: "skill", mustBeArray: true },
        { cn: "是否保留此技能原有的衍生技(默认不保留)", type: "boolean" }
    ],
    removeAdditionalSkill: [
        { cn: "移除哪个技能的衍生技", type: "skill", single: true, order: true, mission: "移去衍生技能" },
        { cn: "移除的技能(不填为移去全部)", type: "skill", single: true },
    ],
    addAdditionalSkills: [
        { cn: "为哪个技能添加衍生技", type: "skill", single: true, order: true, mission: "获得衍生技能(触发事件)" },
        { cn: "设置衍生技能", type: "skill", mustBeArray: true },
        { cn: "是否保留此技能原有的衍生技(默认不保留)", type: "boolean" }
    ],
    removeAdditionalSkills: [
        { cn: "移除哪个技能的衍生技", type: "skill", single: true, order: true, mission: "移去衍生技能(触发事件)" },
        { cn: "移除的技能(不填为移去全部)", type: "skill", single: true },
    ],
    addTempSkill: [
        { cn: "获得的技能", type: "skill", mission: "临时获得技能", defaultValue: ["fengyin"], order: true },
        { cn: "截止到的时机(默认到回合结束)", type: "expire" },
        { cn: "是否检查禁用技能组目录", type: "boolean" },
    ],
    tempBanSkill: [
        { cn: "失效的技能", type: "skill", mission: "临时禁用技能", order: true },
        { cn: "截止到的时机(默认到回合结束)", type: "expire", defaultValue: ["无期"] },
        { cn: "是否录入游戏日志", type: "boolean" },
    ],
    clearSkills: [
        { cn: "不清除的技能", type: "skill", mission: "清除技能" }
    ],
    awakenSkill: [
        { cn: "标记为已发动的限定技/觉醒技", type: "skill", single: true, filter: judgeIsLimitSkill, mission: "记录技能为已发动", order: true },
        { cn: "是否阻止unmarkSkill", type: "boolean" }
    ],
    restoreSkill: [
        { cn: "重置的限定技/觉醒技", type: "skill", single: true, filter: judgeIsLimitSkill, mission: "重置技能", order: true },
        { cn: "是否阻止markSkill", type: "boolean" }
    ]
}
const PlayerVarName = ["player", "source", "target"];
const PlayerVarValue = ['player', 'target', 'game.me', 'game.zhu', '_status.currentPhase', 'trigger.player', 'trigger.source', 'trigger.target', 'event.target']
const CardVarNameREs = [/card(x)?/, /card\d/];
const CardsVarName = ["cards", "Cards"];
const numberVarName = ["num", "number"];
const numberVarValueOfPlayer = [
    'hp', 'maxHp', 'hujia', 'phaseNum', 'getSeatNum()', 'getDamagedHp()'
];
const useMath = /^Math\.[a-zA-Z]+(\(.*?\))?$/
const booleanVarName = ["bool", "boolean"];
const booleanVarValue = ["true", "false"];
export const parameterJudge = {
    Player: (varName, varValue) => {
        if (PlayerVarName.includes(varName)) return true;
        if (PlayerVarValue.includes(varValue)) return true;
        return false;
    },
    card: (varName, varValue) => {
        if (CardVarNameREs.some(regexp => regexp.test(varName))) return true;
        return false;
    },
    card: (varName, varValue) => {
        if (CardsVarName.includes(varName)) return true;
        return false;
    },
    number: (varName, varValue) => {
        if (numberVarName.includes(varName)) return true;
        const pureValue = varValue.replace(/[ ]*[\+\-\*\/][ ]*\d/g, "");
        if (!isNaN(parseInt(pureValue))) return true;
        if (useMath.test(pureValue)) return true;
        if (!pureValue.includes('.')) return false;
        const [obj, key] = pureValue.split(/\.(?=[^.]*$)/);
        if (PlayerVarName.includes(obj)) {
            if (numberVarValueOfPlayer.includes(key)) return true;
        }
        return false;
    },
    bool: (varName, varValue) => {
        if (booleanVarName.includes(varName)) return true;
        if (booleanVarValue.includes(varValue)) return true;
        return false;
    },
    skill: (varName, varValue) => {
        if (varName === "skill") return true;
        return false;
    },
    skills: (varName, varValue) => {
        if (varName === "skills") return true;
        return false;
    }
}
