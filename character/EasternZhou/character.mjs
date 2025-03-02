import { extPath } from "./url.mjs"
const character = {
    //names按照无名杀规则，写成姓+名吧，毕竟屈原写的芈|原，但是为什么不是芈|平？
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
        group: "xjb_chunqiu_qi",
        hp: 4,
        skills: ["xjb_xionghu", "xjb_xuechou", "xjb_guaqi"],
        trashBin: [],
        names: "姜|诸儿"
    },
    "xjb_guanyiwu": {
        sex: "male",
        group: "xjb_chunqiu_qi",
        hp: 3,
        skills: ["xjb_zhangwei"],
        trashBin: [],
        names: "姬|夷吾"
    },

    "xjb_qinmugong": {
        sex: "male",
        group: "xjb_qin",
        hp: 4,
        skills: ["xjb_kaidi", "xjb_ranrong"],
        trashBin: [],
        names: "赢|任好"
    },

    "xjb_xunan": {
        sex: "male",
        group: "xjb_chunqiu_jin",
        hp: 3,
        skills: ["xjb_jiatu", "xjb_gugong"],
        trashBin: [],
        names: "姬|黯"
    },
    "xjb_xianzhen": {
        sex: "male",
        group: "xjb_chunqiu_jin",
        hp: 3,
        maxHp: 4,
        skills: ["xjb_xiaojian", "xjb_guizhan"],
        trashBin: [],
    },

    "xjb_wuyuan": {
        sex: "male",
        group: "xjb_chunqiu_wu",
        hp: 3,
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
}
for (const id in character) {
    character[id].trashBin.push(`${extPath}/image/character/${id}.jpg`);
}
export default character;