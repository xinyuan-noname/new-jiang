export default {
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
}