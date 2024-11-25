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
    skip: [
        { cn: "跳过的阶段名", type: "phase", single: true, mission: "跳过阶段" }
    ],
    changeGroup: [
        { cn: "改为的势力", type: "group", value: "group", single: true, mission: "更改势力", order: true },
        { cn: "是否录入游戏日志", type: "boolean" }
    ],
    gainMultiple: [
        { cn: "获得牌的角色", type: "Players", value: "targets", mission: "获得多名角色指定区域的牌", order: true },
        { cn: "可获得牌区域(默认为手牌区)", type: "position", value: "position", positionList: "hej" },
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
