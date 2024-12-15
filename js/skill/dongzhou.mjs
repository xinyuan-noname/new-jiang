import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
export const dongzhouSkill = {};
export const dongzhouTranslate = {};
/**
 * 
 * @param {string} name 
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

const xjb_zhangwei = SkillCreater(
	"xjb_zhangwei", {
	translate: '张维',
	description: "每轮开始时，你可以重置任意张牌，令至多等量名角色下个摸牌阶段多摸一张牌，这些角色本轮视为拥有〖货殖〗、〖仓实〗和〖尊攘〗",
	derivation: ["xjb_huozhi", "xjb_cangshi", "xjb_zunrang"],
	trigger: {
		global: "roundStart"
	},
	cost: async function (event, trigger, player) {
		const { result: { bool, cards } } = await player.chooseCard("he", [1, Infinity], card => player.canRecast(card))
		if (bool) {
			const { length: num } = cards;
			player.recast(cards);
			event.result = await player.chooseTarget([1, num]).forResult();
		}
	},
	content: async function (event, trigger, player) {
		for (const target of event.targets) {
			target.when({ player: "phaseDrawBegin2" }).then(() => {
				trigger.num += 1;
			});
			target.addTempSkill(["xjb_zunrang", "xjb_huozhi", "xjb_cangshi"], { global: "roundStart" })
		}
	}
})
const xjb_zunrang = SkillCreater(
	"xjb_zunrang", {
	translate: "尊攘",
	description: "回合开始时，你可以获得一名其他角色一张牌，然后你令另一名其他角色摸一张牌",
	trigger: {
		player: 'phaseBegin'
	},
	content: async function (event, trigger, player) {
		const next1 = player.chooseTarget("选择一名角色，你获得其一张牌");
		next1.set("filterTarget", (card, player, target) => target.countGainableCards(player, "h") > 0 && target != player);
		next1.set("ai", (target) => {
			const playerx = _status.event.player;
			return get.attitude(playerx, target) <= 0;
		})
		const { result: { targets: targets1, bool: bool1 } } = await next1;
		if (!bool1) return;
		await player.gainPlayerCard("he", targets1[0]);
		const next2 = player.chooseTarget("选择一名角色，你令其摸一张牌", true);
		next2.set("filterTarget", (card, player, target) => {
			return target != player && target != _status.event.targetLast
		})
		next2.set("targetLast", targets1[0]);
		next2.set("ai", (target) => {
			const playerx = _status.event.player;
			return get.attitude(playerx, target)
		})
		const { result: { targets: targets2, bool: bool2 } } = await next2;
		if (!bool2) return;
		targets2[0].draw();
	}
})
const xjb_huozhi = SkillCreater(
	"xjb_huozhi", {
	translate: "货殖",
	description: "出牌阶段限一次，你可与一名其他未发动过本技能的角色各展示一张手牌称为“货”，然后你与其用其他手牌拼点：双方获得对方的“货”，赢的角色获得拼点牌。若你赢，本回合你可多发动一次该技能。",
	enable: "phaseUse",
	usable: 1,
	filterTarget: (card, player, target) => {
		const targets = player.getHistory("useSkill").map(evt => evt.targets).flat();
		return !targets.includes(target) && player.canCompare(target) && target.countCards("h") >= 2 && player.countCards("h") >= 2;
	},
	content: async function (event, trigger, player) {
		for (const target of [player, event.target]) {
			const { result: { cards } } = await target.chooseCard("h", true);
			target.addGaintag(cards, "xjb_huozhi_huo");
			await target.showCards(cards);
		}
		const next = player.chooseToCompare(event.target);
		next.set("filterCard", (card) => {
			return !card.hasGaintag("xjb_huozhi_huo");
		})
		const { result: { player: pCard, target: tCard, winner } } = await next;
		const pExchange = player.getCards("h", (card) => card.hasGaintag("xjb_huozhi_huo"));
		const tExchange = event.target.getCards("h", (card) => card.hasGaintag("xjb_huozhi_huo"));
		await player.swapHandcards(event.target, pExchange, tExchange);
		if (winner) {
			await winner.gain([pCard, tCard], "gain2")
		}
		if (winner === player) player.getStat().skill[event.name]--;
	},
	ai: {
		order: 6,
		result: {
			target: (player, target, card) => {
				return -2;
			}
		}
	}
})
const xjb_cangshi = SkillCreater(
	"xjb_cangshi", {
	translate: "仓实",
	description: "出牌阶段，你可以弃置两张基本牌，令你手牌上限+1",
	enable: "phaseUse",
	filter: (event, player) => {
		return player.countCards("h", { type: "basic" }) >= 2;
	},
	filterCard: card => {
		return get.type(card) === "basic"
	},
	selectCard: 2,
	content: async function (event, trigger, player) {
		player.addMark("xjb_cangshi");
	},
	marktext: "仓",
	intro: {
		name: "仓廪",
		content: "仓廪实而知礼节，衣食足而知荣辱。"
	},
	mod: {
		maxHandcardBase(player, num) {
			return num + player.countMark("xjb_cangshi")
		}
	}
})

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
		player: ["damageBefore"],
	},
	limited: true,
	filter: function (event, player, triggername) {
		return event.num >= player.hp;
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
	description: "其他角色的出牌阶段限一次,其可以弃置X张牌,对你使用一张刺杀(X为你的体力值)",
	global: "xjb_taihuo_cisha",
	subSkill: {
		cisha: {
			usable: 1,
			enable: "phaseUse",
			check: function (card) {
				return 6 - get.value(card);
			},
			filter: function (event, player, triggername) {
				return !player.hasSkill("xjb_taihuo", null, false, false);
			},
			filterTarget: function (card, player, target) {
				return target.hasSkill("xjb_taihuo", null, false, false) && ui.selected.cards.length === target.hp;
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
