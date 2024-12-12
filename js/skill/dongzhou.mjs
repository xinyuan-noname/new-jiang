import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
export const dongzhouSkill = {};
export const dongzhouTranslate = {};
/**
 * 
 * @param {*} name 
 * @param {Skill} skill 
 * @returns 
 */
function SkillCreater(name, skill) {
	dongzhouSkill[name] = { ...skill }
	delete dongzhouSkill[name].translate;
	delete dongzhouSkill[name].description;
	dongzhouTranslate[name] = skill.translate;
	dongzhouTranslate[name + "_info"] = skill.description
	return dongzhouSkill[name];
};


const xjb_tongzhou = SkillCreater(
	"xjb_tongzhou", {
	translate: "同舟",
	description: "准备阶段和结束阶段,你可以摸两张牌",
	trigger: {
		player: ["phaseZhunbeiBegin", "phaseJieshuBegin"],
	},
	content: async function (event, trigger, player) {
		player.draw(2);
	},
	ai: {
		threaten: 2,
	}
})

const xjb_fuwei = SkillCreater(
	"xjb_fuwei", {
	translate: "赴危",
	description: "限定技，当你受到致命伤害时，你可以防止此伤害，然后将同舟的触发时机改为准备阶段。",
	trigger: {
		player: ["damageBegin"],
	},
	limited: true,
	filter: function (event, player, triggername) {
		if (!(event.num >= player.hp)) return false;
		return true;
	},
	content: async function (event, trigger, player) {
		player.awakenSkill("xjb_fuwei");
		trigger.cancel()
		lib.skill.xjb_tongzhou.trigger.player = "phaseZhunbeiBegin"
		player.removeSkillTrigger("xjb_tongzhou");
		player.addSkillTrigger("xjb_tongzhou");
	},
})

const xjb_taihuo = SkillCreater(
	"xjb_taihuo", {
	translate: "台祸",
	description: "其他角色的出牌阶段限一次,其可以弃置X张牌,对你使用一张刺杀(X为你的体力值-1且至少为1)",
	global: "xjb_taihuo_cisha",
	subSkill: {
		cisha: {
			usable: 1,
			enable: "phaseUse",
			filter: function (event, player, triggername) {
				return !player.hasSkill("xjb_taihuo", null, false, false);
			},
			filterTarget: function (card, player, target) {
				return target.hasSkill("xjb_taihuo", null, false, false) && ui.selected.cards.length === Math.max(target.hp - 1, 1);
			},
			filterCard: true,
			selectCard: [1, Infinity],
			selectTarget: 1,
			content: function () {
				"step 0"
				player.useCard({ name: "sha", nature: "stab" }, target)
			},
			ai: {
				order: 2,
				result: {
					target: function (player, target, card) {
						if (target.hp === 1) return -2;
						if (player.countCards("h") - target.hp < 3) return 0;
						return -2;
					}
				}
			}
		}
	}
})


const xjb_zulong = SkillCreater(
	"xjb_zulong", {
	translate: "祖龙",
	description: "每回合每种类别限一次，一名角色减少一点体力后，可以你选择获得指定种类的一个技能。若此技能为觉醒技，则无视发动条件。",
	trigger: {
		global: ["damageEnd", "loseHpEnd"],
	},
	getIndex(trigger) {
		return trigger.num || 1;
	},
	skillMap: {
		"觉醒技": "juexingji",
		"主公技": "zhuSkill",
		"限定技": "limited"
	},
	filter(event, player) {
		return !player.storage['xjb_zulong'] || player.storage["xjb_zulong"].length < 3;
	},
	frequent: true,
	content: async function (event, trigger, player) {
		const list = ['觉醒技', '主公技', '限定技'];
		if (player.storage[event.name]) list.removeArray(player.storage[event.name]);
		const { result } = await player.chooseControl(list)
		const skillMap = get.info("xjb_zulong").skillMap;
		const skillType = skillMap[result.control];
		player.addSkillrandom(skillType, 1);
		player.markAuto(event.name, result.control)
		player.when({ global: "phaseEnd" }).then(() => {
			player.storage["xjb_zulong"] = [];
		})
	},
	ai: {
		threaten: 0.8
	}
});
const xjb_longwei = SkillCreater(
	"xjb_longwei", {
	translate: "龙威",
	description: "锁定技，你失去体力上限改为增加等量点体力上限,",
	trigger: {
		player: ["loseMaxHpBefore"]
	},
	forced: true,
	content: async function (event, trigger, player) {
		await player.gainMaxHp(event.num);
		trigger.cancel()
	}
})
