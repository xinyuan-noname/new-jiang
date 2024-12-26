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
	delete dongzhouSkill[name].$audio;
	dongzhouTranslate[name] = skill.translate;
	dongzhouTranslate[name + "_info"] = skill.description
	if (skill.$audio && skill.$audio.length) {
		for (const [i, audioWords] of skill.$audio.entries()) {
			dongzhouTranslate[`#${name}${i + 1}`] = audioWords;
		}
	}
	return dongzhouSkill[name];
};


//急子&寿
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

//诸儿
const xjb_xionghu = SkillCreater(
	"xjb_xionghu", {
	translate: "雄狐",
	description: "出牌阶段限一次，若你已受伤，你可以令一名女性角色弃置两张牌，你与其各回复一点体力",
	enable: "phaseUse",
	usable: 1,
	filterTarget: (card, player, target) => {
		return target.hasSex("female") && target.countDiscardableCards(target, "he") >= 2;
	},
	filter: (event, player) => {
		if (player.isHealthy()) return false
		return game.filterPlayer(curr => get.info("xjb_xionghu").filterTarget(void 0, player, curr)).length > 0;
	},
	content: async function (event, trigger, player) {
		await event.target.chooseToDiscard(2, "he", true);
		await player.recover();
		await event.target.recover();
	}
})
const xjb_yanshi = SkillCreater(
	"xjb_yanshi", {
	translate: "宴弑",
	description: "当一名女性角色回复一点体力时，你可以失去一点体力，对其距离为1一名角色使用一张刺【杀】。",
	trigger: {
		global: "recoverAfter"
	},
	filter: (event, player) => {
		return event.player.hasSex("female") && event.num != 0
	},
	getIndex: (event, player) => {
		return event.num;
	},
	cost: async function (event, trigger, player) {
		event.result = await player.chooseTarget("是否失去一点体力，然后对选择的角色使用一张刺【杀】？")
			.set("filterTarget", (_, player, target) => {
				const { sister } = _status.event;
				return get.distance(sister, target) === 1;
			}).set("sister", trigger.player).forResult();
	},
	content: async function (event, trigger, player) {
		await player.loseHp();
		await player.useCard({ name: "sha", nature: "stab" }, event.targets[0], false);
	}
})
const xjb_xuechou = SkillCreater(
	"xjb_xuechou", {
	translate: "雪仇",
	description: "限定技，出牌阶段，你可以选择一名上下位均阵亡的其他角色，你依次将手牌视为【决斗】对其使用。此过程中，你对其造成伤害后，你获得其一张牌；你受到伤害后，你摸一张牌。",
	$audio: [
		"家国之仇，岂在五世!",
		"九世之仇，犹可报之!"
	],
	limited: true,
	enable: "phaseUse",
	skillAnimation: true,
	animationColor: "fire",
	filterTarget: (card, player, target) => {
		return target.previousSeat.isDead() && target.nextSeat.isDead() && target != player;
	},
	filter: (event, player) => {
		if (!player.countCards("h")) return false;
		return game.hasPlayer(curr => get.info("xjb_xuechou").filterTarget(void 0, player, curr))
	},
	content: async function (event, trigger, player) {
		player.awakenSkill(event.name)
		player.addTempSkill(event.name + "_gain", { player: event.name + "After" })
		player.addTempSkill(event.name + "_draw", { player: event.name + "After" })
		while (event.target.isAlive() && player.countCards("h")) {
			const { result: { bool } } = await player.chooseUseTarget(event.target, { name: "juedou" }, [player.getCards("h").at(0)], false, "九世之仇，今日报之！")
				.set("prompt2", "将第一张手牌视为【决斗】对" + get.translation(event.target) + "使用");
			if (!bool) return;
		}
	},
	subSkill: {
		draw: {
			trigger: {
				player: "damageEnd"
			},
			forced: true,
			content: function () {
				player.draw()
			}
		},
		gain: {
			trigger: {
				source: 'damageSource'
			},
			forced: true,
			filter: (event, player) => {
				return event.player.countGainableCards(player, "he")
			},
			content: function () {
				console.log(trigger)
				player.gainPlayerCard(trigger.player, "he");
			}
		}
	}
})
const xjb_guaqi = SkillCreater(
	"xjb_guaqi", {
	global: "xjb_guaqi_shubian",
	translate: "瓜期",
	description: "出牌阶段限一次，你可以将一张牌交给一名其他角色，称为“瓜”。手牌中拥有瓜的角色：1.回合开始时，失去一点体力并摸一张牌；2.回合内使用牌无次数限制；3.其本轮获得的牌不计入手牌上限；4.不能使用瓜。每轮开始时，你可以获得场上的所有瓜。",
	enable: "phaseUse",
	position: "he",
	usable: 1,
	filterCard: true,
	lose: false,
	discard: false,
	delay: false,
	filterTarget: lib.filter.notMe,
	content: async function (event, trigger, player) {
		await player.give(event.cards, event.targets[0], true);
		event.targets[0].addGaintag(event.cards, "xjb_guaqi_gua");
	},
	group: "xjb_guaqi_daigua",
	subSkill: {
		shubian: {
			trigger: {
				player: "phaseBegin"
			},
			filter: (event, player) => {
				return player.getCards("h").some(card => card.hasGaintag("xjb_guaqi_gua"));
			},
			forced: true,
			content: async function (event, trigger, player) {
				await player.loseHp();
				player.draw()
			},
			mod: {
				cardUsable: function (card, player, num) {
					if (player.getCards("h").every(card => !card.hasGaintag("xjb_guaqi_gua"))) return;
					return Infinity;
				},
				ignoredHandcard: function (card, player) {
					if (player.getCards("h").every(card => !card.hasGaintag("xjb_guaqi_gua"))) return;
					if (player.getRoundHistory("gain", lib.filter.all).map(evt => evt.cards).flat().includes(card)) return true;
				},
				cardDiscardable: function (card, player, name) {
					if (player.getCards("h").every(card => !card.hasGaintag("xjb_guaqi_gua"))) return;
					if (name == "phaseDiscard" && player.getRoundHistory("gain", lib.filter.all).map(evt => evt.cards).flat().includes(card)) return false;
				},
				cardEnabled2: function (card, player) {
					if (card.hasGaintag("xjb_guaqi_gua") && get.position(card) === "h") return false;
				},
			},
		},
		daigua: {
			trigger: {
				global: "roundStart"
			},
			filter: (event, player) => {
				return game.players.some(curr => curr.countCards("h", card => card.hasGaintag("xjb_guaqi_gua")))
			},
			content: async function (event, trigger, player) {
				const record = [], allCards = [];
				for (const target of game.players) {
					const cards = target.getCards("he", card => card.hasGaintag("xjb_guaqi_gua"))
					if (cards.length) {
						record.push([target, cards]);
						allCards.push(...cards);
					}
				}
				await game.loseAsync({
					lose_list: record
				}).setContent("chooseToCompareLose");
				await player.gain(allCards, "gain2");
			}
		}
	}
})

//管仲
const xjb_zhangwei = SkillCreater(
	"xjb_zhangwei", {
	translate: '张维',
	description: "每轮开始时，你可以重置任意张牌，令至多等量名角色下个摸牌阶段多摸一张牌，这些角色本轮视为拥有〖货殖〗、〖仓实〗和〖尊攘〗",
	derivation: ["xjb_huozhi", "xjb_cangshi", "xjb_zunrang"],
	$audio: [
		"仓廪实则知礼节，衣食足则知荣辱，上服度则六亲固。",
		"守国之度，在饰四维。"
	],
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
	description: "出牌阶段限一次，你可与一名本回合未发动过本技能的其他角色各展示一张手牌称为“货”，然后你与其用其他手牌拼点：双方获得对方的“货”，赢的角色获得拼点牌。若你赢，本回合你可多发动一次该技能。",
	enable: "phaseUse",
	usable: 1,
	filterTarget: (card, player, target) => {
		const targets = player.getHistory("useSkill", evt => evt.skill === "xjb_huozhi").map(evt => evt.targets).flat();
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


//嬴政
const xjb_zulong = SkillCreater(
	"xjb_zulong", {
	translate: "祖龙",
	description: "每回合每种类别限一次，一名角色减少一点体力后，可以你选择获得指定种类的一个技能。若此技能为觉醒技，则无视发动条件。",
	$audio: [
		"朕为始皇帝，后世以计数，二世、三世至于万世，传之无穷。",
		"受命于天，既寿永昌。"
	],
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