import { extPath } from "./url.mjs";
export const character =  {
    "xjb_rider": {
        sex: "male",
        group: "shen",
        hp: 5,
        skills: [],
        trashBin: [],
        isUnseen: true
    },
    "xjb_daqiao": {
        sex: "female",
        group: "wu",
        hp: 3,
        skills: ["xjb_liuli", "xjb_guose"],
        trashBin: []
    },
    "xjb_sunce": {
        sex: "male",
        group: "wu",
        hp: 4,
        skills: ["xjb_taoni", "jiang", "xjb_yingfa"],
        trashBin: []
    },
    "xjb_guojia": {
        sex: "male",
        group: "wei",
        hp: 3,
        skills: ["xjb_yiji", "xjb_tiandu"],
        trashBin: []
    },
    "xjbhan_caocao": {
        sex: "male",
        group: "xjb_han",
        hp: 4,
        skills: ["xin_zhibang", "xin_chuhui"],
        trashBin: []
    },
    "xjbhan_xunyu": {
        sex: "male",
        group: "xjb_han",
        hp: 3,
        clans: ["颍川荀氏"],
        skills: ["xjb_bingjie", "xjb_liuxiang", "clandaojie"],
        trashBin: []
    },
    "xjb_pangtong": {
        sex: "male",
        group: "shu",
        hp: 3,
        skills: ["xjb_fengchu", "lianhuan"],
        trashBin: []
    },
    "xjb_caocao": {
        sex: "male",
        group: "wei",
        hp: 4,
        skills: ["xjb_jianxiong", "xjb_huibian"],
        trashBin: []
    },
    "xjb_zhouyu": {
        sex: "male",
        group: "wu",
        hp: 3,
        skills: ["xjb_shiyin", "xjb_yingfa", "xjb_ruijin"],
        trashBin: []
    },
    "xjb_liushan": {
        sex: "male",
        group: "shu",
        hp: 5,
        skills: ["xjb_fangquan", "xjb_xiangle"],
        trashBin: []
    },
    "xjb_dianwei": {
        sex: "male",
        group: "wei",
        hp: 4,
        skills: ["xin_huzhu", "xin_xiongli"],
        trashBin: []
    },
    "xjb_ganning": {
        sex: "male",
        group: "wu",
        hp: 4,
        skills: ["xjb_yexi", "xjb_ziruo"],
        trashBin: []
    },
    "xjb_zhugeliang": {
        sex: "male",
        group: "shu",
        hp: 3,
        skills: ["xjb_zhijue", "xjb_qiongzhi", "kongcheng"],
        trashBin: []
    },
    "xjb_jin_simayi": {
        sex: "male",
        group: "jin",
        hp: 3,
        skills: ["xjb_xianmou", "xjb_yintao"],
        trashBin: []
    },
    "xjb_lvmeng": {
        sex: "male",
        group: "wu",
        hp: 4,
        skills: ["xjb_xiaomeng", "xjb_shelie", "xjb_keji", "xjb_guamu"],
        trashBin: []
    },
}
for (const id in character) {
    character[id].trashBin.push(`${extPath}/image/character/${id}.jpg`);
}
export default character;