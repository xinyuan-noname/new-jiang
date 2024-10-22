window.XJB_LOAD_TRANSLATE = function (_status, lib, game, ui, get, ai) {
    let skill = {       
        "xin_qns": "急救",
        "xin_qns_info": "你可以将一张红色牌当做【桃】使用。若此时，你的手牌数<3，你摸一张牌。",
        "xin_whlw1": "帷幕",
        "xin_whlw1_info": "锁定技，当成为其他角色的目标时，你令来源使用两张对应的残牌。",
        "xin_whlw2": "完杀",
        "xin_whlw2_info": "锁定技，当有角色于你的回合内进入濒死阶段时，你获得其所有手牌。",
        "xin_htzjq2": "铁骑",
        "xin_htzjq2_info": "当你使用【杀】指定一名角色为目标后，你令其选择失去一点体力/体力上限。",
        
        "xjb_xinsheng": "新生",
        "xjb_xinsheng_info": "出牌阶段，你可以弃置三张手牌令一名角色复活。",
        "xjb_lunhui": "灵愈",
        "xjb_lunhui_info": "当你濒死时，你可以恢复三点体力然后弃置全区域内两张牌。",
        "xjb_sicuan": "倒置",
        "xjb_sicuan_info": "每轮限一次，你可令一名角色的两种事件颠倒进行",
    }
    
    lib.translate = {
        ...lib.translate,
        ...skill,
    }
}