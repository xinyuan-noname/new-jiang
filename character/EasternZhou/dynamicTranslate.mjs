export default{
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
}