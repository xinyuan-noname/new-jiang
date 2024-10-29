export const editorInbuiltSkillMap = new Map()
//曹操部分
editorInbuiltSkillMap.set(
    /(?<!异步)引入[ ]*(标?奸雄|jianxiong)\n/,
    {
        trigger: `受到伤害后`,
        content: `你 获得牌 造成伤害的牌 亮出式`
    }
);
editorInbuiltSkillMap.set(
    /异步引入[ ]*(标?奸雄|jianxiong)\n/,
    {
        contentAsync: true,
        trigger: `受到伤害后`,
        content: `你 获得牌 造成伤害的牌 亮出式`
    }
);
//司马懿部分
editorInbuiltSkillMap.set(
    /(?<!异步)引入[ ]*(标?反馈|fankui)\n/,
    {
        trigger: `受到伤害后`,
        filter: [
            "伤害点数 大于 0",
            "伤害来源 不为 你",
            "伤害来源 可被获得的牌数 你",
            "大于",
            "0"
        ].join("\n"),
        content: `你 获得角色牌 一张 伤害来源 强制发动`
    }
);
editorInbuiltSkillMap.set(
    /异步引入[ ]*(标?反馈|fankui)\n/,
    {
        contentAsync: true,
        trigger: `受到伤害后`,
        filter: [
            "伤害点数 大于 0",
            "伤害来源 不为 你",
            "伤害来源 可被获得的牌数 你",
            "大于",
            "0"
        ].join("\n"),
        content: `你 获得角色牌 一张 伤害来源 强制发动`
    }
);
//张飞部分
editorInbuiltSkillMap.set(
    /(?<!异步)引入[ ]*(标?咆哮|咆哮)\n/,
    {
        content: `你使用杀无次数限制`
    }
);
editorInbuiltSkillMap.set(
    /异步引入[ ]*(标?咆哮|咆哮)\n/,
    {
        contentAsync: true,
        content: `你使用杀无次数限制`
    }
);
//刘备部分
//孙权部分