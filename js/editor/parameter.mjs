export const EditorParameterList = {
    draw: [
        { cn: "张数", type: "number", value: "num", min: 1 },
        { cn: "来源(谁令你摸的?)", type: "Player", value: "source" },
        { cn: "有无摸牌动画", type: "boolean", value: "animate", defualtValue: true, cnTrue: "有", cnFalse: "无" },
        {
            type: "otherArgs",
            args: [
                { cn: "无延迟摸牌", value: '"nodelay"', type: "string" },
                { cn: "摸到的牌全场可见", value: '"visible"', type: "string" },
                { cn: "从牌堆底摸", value: '"bottom"', type: "string" }
            ]
        }
    ],
}

const regexps = [
    /\bplayer\b$/,
    /\btarget\b$/,
    /\bsource\b$/,
]
export const parameterJudge = {
    Player: (str) => {
        if (regexps.some(regexp => regexp.test(str))) return true;
        return false;
    }
}
