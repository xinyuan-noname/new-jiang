import { lib, game, ui, get, ai, _status } from "../../../../noname.js";
const skill = {};
export default skill;
export const skillTranslate = {};
/**
 * 
 * @param {string} name 
 * @param {Skill} skillInfo 
 * @returns 
 */
function SkillCreater(name, skillInfo) {
	skill[name] = { ...skillInfo };
	delete skill[name].translate;
	delete skill[name].description;
	delete skill[name].$audio;
	skillTranslate[name] = skillInfo.translate;
	skillTranslate[name + "_info"] = skillInfo.description;
	if (skillInfo.$audio && skillInfo.$audio.length) {
		for (const [i, audioWords] of skillInfo.$audio.entries()) {
			skillTranslate[`#${name}${i + 1}`] = audioWords;
		}
	}
	return skill[name];
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
	description: "限定技，当你受到致命伤害时，你可以防止此伤害，然后将〖同舟〗的触发时机改为准备阶段。",
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

//卫赤
const xjb_haohe = SkillCreater(
	"xjb_haohe", {
	translate: "好鹤",
	description: "锁定技，游戏开始时，你声明一张不是【闪】且合法的非装备牌。结束阶段，你可以将一张与之牌同名的牌置于一名角色的武将牌旁，其手牌均视为与之同名牌直到失去“鹤”。",
	forced: true,
	trigger: {
		player: "enterGame",
		global: "phaseBefore"
	},
	filter(event, player) {
		return game.hasPlayer(current => current != player) && (event.name != "phase" || game.phaseNumber == 0);
	},
	mark: true,
	marktext: "好",
	intro: {
		name: "好鹤",
		content: "$"
	},
	async content(event, trigger, player) {
		const list = [];
		for (const i of lib.inpile) {
			if (get.type(i) === "equip") continue;
			if (i === "wuzhong") continue;
			if (i === "shunshou") continue;
			if (i === "shan") continue;
			list.push(["好鹤", "", i]);
		}
		const { result: { links } } = await player.chooseButton(["好鹤", [list, 'vcard']], true);
		player.storage.xjb_haohe = links[0][2];
	},
	group: ["xjb_haohe_bianhe"],
	global: "xjb_haohe_effect",
	subSkill: {
		effect: {
			marktext: "鹤",
			intro: {
				name: "鹤",
				content: "expansion",
				countMark: "expansion"
			},
			mod: {
				cardname(card, player, name) {
					const target = game.findPlayer2(curr => curr.hasSkill("xjb_shiguo"));
					if (player.hasExpansions('xjb_haohe_effect') && get.position(card) === "h") {
						return target.storage.xjb_haohe;
					}
				},
			}
		},
		bianhe: {
			trigger: {
				player: "phaseJieshuBegin"
			},
			filter(event, player) {
				return player.countCards("h", card => {
					return get.name(card) === player.storage.xjb_haohe;
				});
			},
			async cost(event, trigger, player) {
				const { result: { bool, cards, targets } } = await player.chooseCardTarget()
					.set("filterCard", card => {
						return get.name(card) === _status.event.player.storage.xjb_haohe;
					})
					.set("filterTarget", (card, player, target) => {
						return target !== player && !target.hasExpansions('xjb_haohe_effect')
					})
					.set("position", "he");
				event.result = { bool, cost_data: { cards }, targets }
			},
			async content(event, trigger, player) {
				event.targets[0].addToExpansion(event.cost_data.cards).gaintag.add("xjb_haohe_effect")
			}
		},

	}
})
const xjb_shiguo = SkillCreater(
	"xjb_shiguo", {
	translate: "失国",
	description: "锁定技，你的装备牌和【闪】均视为〖好鹤〗声明的牌。结束阶段，武将牌旁有“鹤”的角色可以弃置“鹤”，令你失去一点体力。",
	mod: {
		cardname(card, player, name) {
			if (player.storage.xjb_haohe && (lib.card[card.name].type === "equip" || card.name === "shan")) return player.storage.xjb_haohe;
		},
	},
	global: "xjb_shiguo_fanshi",
	subSkill: {
		fanshi: {
			trigger: {
				player: "phaseEnd"
			},
			prompt(event, player) {
				const target = game.findPlayer(curr => curr.hasSkill("xjb_shiguo"));
				return "是否移去“鹤”，令" + get.translation(target) + "失去一点体力"
			},
			filter(event, player) {
				return player.hasExpansions("xjb_haohe_effect");
			},
			async content(event, trigger, player) {
				const cards = player.getExpansions("xjb_haohe_effect");
				await player.lose(cards, ui.ordering);
				const target = game.findPlayer(curr => curr.hasSkill("xjb_shiguo"));
				if (target) target.loseHp();
			}
		}
	}
})

//诸儿
const xjb_xionghu = SkillCreater(
	"xjb_xionghu", {
	translate: "雄狐",
	description: "出牌阶段限一次，若你已受伤，你与一名女性角色各弃置一张牌，你与其各回复一点体力。然后你对其距离为1一名角色使用一张刺【杀】。",
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
		const { targets } = await player.chooseTarget("是否使用一张刺【杀】？")
			.set("filterTarget", (_, player, target) => {
				const { sister } = _status.event;
				return get.distance(sister, target) === 1;
			}).set("sister", trigger.player).forResult();
		await player.useCard({ name: "sha", nature: "stab" }, targets[0], false);
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
			const { result: { bool } } = await player.chooseUseTarget(event.target, { name: "juedou" }, [player.getCards("h")[0]], false, "九世之仇，今日报之！")
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
				player.gainPlayerCard(trigger.player, "he");
			}
		}
	}
})
const xjb_guaqi = SkillCreater(
	"xjb_guaqi", {
	global: "xjb_guaqi_shubian",
	translate: "瓜期",
	description: "出牌阶段限一次，你可以将一张牌交给一名其他角色，称为“瓜”。手牌中拥有瓜的角色：1.回合开始时，失去一点体力；2.回合内使用牌无次数限制；3.其本轮获得的牌不计入手牌上限。每轮开始时，你可以获得场上的所有瓜。",
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
				player.loseHp();
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
				}
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
		const { result: { bool, cards } } = await player.chooseCard("he", [1, Infinity], (card, player) => player.canRecast(card))
		if (bool) {
			player.recast(cards);
			event.result = await player.chooseTarget([1, cards.length]).forResult();
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
	description: "出牌阶段限一次，你可与一名本回合未发动过本技能的其他角色各展示一张手牌，称为“货”，并用另一张手牌拼点。拼点结算后，双方交换“货”，赢的角色获得拼点牌，若赢的角色是你，重置此技能的发动次数。",
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
		if (winner === player) player.getStat().skill[event.name] = 0;
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
	init(player, skill) {
		if (player.countMark(skill)) player.markSkill(skill)
	},
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

//赢任好
const xjb_kaidi = SkillCreater(
	"xjb_kaidi", {
	translate: "开地",
	description: "当你使用基本牌或普通锦囊牌指定唯一目标后，你可以为此牌多指定任意个目标，若其在你攻击范围外，其可视为对你使用一张普通锦囊牌。",
	trigger: {
		player: "useCardToPlayered",
	},
	filter: function (event, player, triggername) {
		if (get.type(event.card) !== "trick" && get.type(event.card) !== "basic") return false;
		if (event.targets.length > 1) return false;
		return true;
	},
	cost: async function (event, trigger, player) {
		event.result = await player.chooseTarget([1, Infinity])
			.set("filterTarget", (card, player, target) => {
				var trigger = _status.event.getTrigger();
				return !trigger.targets.includes(target) && lib.filter.targetEnabled2(trigger.card, trigger.player, target);
			})
			.set("ai", (card, player, target) => {
				var trigger = _status.event.getTrigger();
				return get.effect(target, trigger.card, trigger.player, _status.event.player);
			})
			.forResult();
	},
	content: async function (event, trigger, player) {
		trigger.targets.addArray(event.targets)
		const outTargets = event.targets.filter(curr => !curr.inRangeOf(player));
		for (const target of outTargets) {
			const list = [];
			for (const i of lib.inpile) {
				if (get.type(i) !== "trick") continue;
				if (!target.canUse(i, player)) continue;
				list.push(['锦囊', '', i])
			}
			const { bool, links } = await target.chooseButton(['开地', [list, 'vcard']])
				.set("prompt", "选择一张锦囊牌，对秦穆公使用之。")
				.set("ai", button => {
					const evt = _status.event;
					return get.effect(evt.source, button, evt.player, evt.player);
				})
				.set("source", player)
				.forResult();
			if (bool) {
				await target.useCard([player], { name: links[0][2] });
			}
		}
	},
})
const xjb_ranrong = SkillCreater(
	"xjb_ranrong", {
	translate: "染戎",
	description: "锁定技，当你未使用【无懈可击】响应其他角色对你使用的非红色普通锦囊牌时，本回合你失去非锁定技。其下一次使用牌指定你为目标时，你摸一张牌，然后你无法响应此牌。",
	forced: true,
	trigger: {
		global: "useCardAfter"
	},
	filter(event, player) {
		if (!event.targets.includes(player)) return false;
		if (event.player === player) return false;
		if (get.type(event.card) !== "trick" || get.color(event.card) !== "red") return false;
		if (player.getHistory("useCard", evt => evt.card.name === "wuxie" && evt.respondTo && evt.respondTo[0] === event.player && evt.respondTo[1] === event.card).length) return false;
		return true;
	},
	content: async function (event, trigger, player) {
		player.addTempSkill("fengyin");
		trigger.player.markAuto("xjb_ranrong", player);
		trigger.player.when({ player: "useCardToPlayer" })
			.filter((event, player) => {
				return player.storage["xjb_ranrong"].includes(event.target);
			})
			.then(() => {
				trigger.getParent().directHit.add(trigger.target);
				trigger.target.draw();
				player.storage["xjb_ranrong"].remove(trigger.target);
				trigger.target.logSkill("xjb_ranrong");
			})
	},
	ai: {
		respondSha: true,
		respondShan: true,
	}
})

//荀息
const xjb_jiatu = SkillCreater(
	"xjb_jiatu", {
	translate: "假道",
	description: "出牌阶段限一次，你可以交给一名角色一张牌，你对其攻击范围的一名角色造成一点伤害。若你以此法使该角色阵亡，你可以选择一名本回合获得过你牌的角色，你获得其一张牌并对其造成一点伤害。",
	enable: "phaseUse",
	filterCard: true,
	filterTarget: (card, player, target) => {
		return player !== target;
	},
	position: "he",
	usable: 1,
	content: async function (event, trigger, player) {
		await player.give(event.cards, event.target);
		const { bool, targets } = await player.chooseTarget().set("filterTarget", (card, player, target) => {
			return _status.event.yuguo.inRange(target)
		})
			.set("yuguo", event.target)
			.forResult();
		if (!bool) return;
		await targets[0].damage(player);
		if (targets[0].isDead()) {
			const { bool: boolx, targets: targetsx } = await player.chooseTarget().set("filterTarget", (card, player, target) => {
				const evt = target.getHistory("gain", evt => evt.giver === player);
				return evt.length > 0;
			}).forResult();
			if (!boolx) return;
			await player.gainPlayerCard(targetsx[0], "he", 1).forResult();
			await targetsx[0].damage();
		}
	},
})
const xjb_gugong = SkillCreater(
	"xjb_gugong", {
	translate: "股肱",
	description: "锁定技，当你使用一张普通锦囊牌后，你须选择本回合未选择的一项：1.失去一点体力，重置一个技能；2.摸一张牌，回收此牌。",
	trigger: {
		player: "useCardAfter",
	},
	forced: true,
	filter: (event, player) => {
		return get.type(event.card) === "trick"
			&& event.card.cards && event.card.cards.length
			&& (!player.storage.xjb_gugong || player.storage.xjb_gugong.length < 2);
	},
	choiceList: ["失去一点体力，重置一个技能", "摸一张牌，回收此牌"],
	content: async function (event, trigger, player) {
		const choices = ["选项一", "选项二"]
		const choiceList = get.info("xjb_gugong").choiceList;
		const choiceListx = choiceList.map((choice, index) => {
			if (player.storage.xjb_gugong && player.storage.xjb_gugong.includes(index)) {
				if (index === 0) choices.remove("选项一")
				else if (index === 1) choices.remove("选项二")
				return '<s>' + choice + '</s>'
			}
			return choice;
		});
		const control = await player.chooseControl()
			.set("choiceList", choiceListx)
			.set("controls", choices)
			.forResultControl();
		if (control === "选项一") {
			await player.loseHp();
			player.markAuto("xjb_gugong", 0);
			//以下用中流和蹈节改的
			const suffixs = ["used", "round", "block", "blocker"];
			const skills = player.getSkills(null, false, false).filter(skill => {
				const info = get.info(skill);
				if (!info) return false;
				if (typeof info.usable == "number") {
					if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
						return true;
					}
					if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
						return true;
					}
				}
				if (info.round && player.storage[skill + "_roundcount"]) {
					return true;
				}
				if (player.storage[`temp_ban_${skill}`]) {
					return true;
				}
				if (player.awakenedSkills.includes(skill)) {
					return true;
				}
				for (const suffix of suffixs) {
					if (player.hasSkill(skill + "_" + suffix)) {
						return true;
					}
				}
			});
			const list = [];
			for (const skill of skills) {
				list.push([skill, '<div class="popup text" style="width:calc(100% - 10px);display:inline-block"><div class="skill">【' + get.translation(skill) + "】</div><div>" + lib.translate[skill + "_info"] + "</div></div>"]);
			}
			if (!list.length) return;
			const [skill] = await player.chooseButton([
				"肱骨：重置一个技能",
				[list, "textbutton"]
			], true).forResultLinks();
			const info = get.info(skill);
			if (typeof info.usable == "number") {
				if (player.hasSkill("counttrigger") && player.storage.counttrigger[skill] && player.storage.counttrigger[skill] >= 1) {
					delete player.storage.counttrigger[skill];
				}
				if (typeof get.skillCount(skill) == "number" && get.skillCount(skill) >= 1) {
					delete player.getStat("skill")[skill];
				}
			}
			if (info.round && player.storage[skill + "_roundcount"]) {
				delete player.storage[skill + "_roundcount"];
			}
			if (player.storage[`temp_ban_${skill}`]) {
				delete player.storage[`temp_ban_${skill}`];
			}
			if (player.awakenedSkills.includes(skill)) {
				player.restoreSkill(skill);
			}
			for (const suffix of suffixs) {
				if (player.hasSkill(skill + "_" + suffix)) {
					player.removeSkill(skill + "_" + suffix);
				}
			}
			game.log(player, "重置了技能", "#g" + "【" + get.translation(skill) + "】");
		} else if (control === "选项二") {
			await player.draw();
			await player.gain(trigger.cards);
			player.markAuto("xjb_gugong", 1);
		}
		player.when({ global: "phaseAfter" }).then(() => {
			delete player.storage.xjb_gugong;
		})
	}
})

//先轸
const xjb_xiaojian = SkillCreater(
	"xjb_xiaojian", {
	translate: "崤歼",
	description: "当你造成伤害后，你可以将受到伤害的角色至多X张牌置入弃牌堆。（X为其牌数-其体力值）。",
	trigger: {
		source: "damageSource"
	},
	filter: (event, player) => {
		return event.player.countCards("he") > event.player.hp
	},
	cost: async function (event, trigger, player) {
		const max = Math.max(0, trigger.player.countCards("he") - trigger.player.hp)
		const { bool, cards } = await player.choosePlayerCard(trigger.player, "he", [1, max])
			.set("prompt", `将${get.translation(trigger.player)}至多${get.cnNumber(max)}牌置入弃牌堆`)
			.forResult();
		event.result = { bool, cost_data: { cards } }
	},
	content: async function (event, trigger, player) {
		await trigger.player.loseToDiscardpile(event.cost_data.cards, player);
	}
})
const xjb_guizhan = SkillCreater(
	"xjb_guizhan", {
	translate: "诡战",
	description: "出牌阶段限X次，你可以选择任意张牌和等量名角色并声明一张基本牌或普通锦囊牌，视为对这些角色使用之，若这些牌颜色相同，此牌不可被响应。(X为本回合进入过濒死状态的角色数+1)。",
	enable: "phaseUse",
	selectTarget: () => {
		return ui.selected.cards.length;
	},
	filterTarget: true,
	multitarget: true,
	multiline: true,
	selectCard: [1, Infinity],
	filterCard: true,
	discard: false,
	lose: false,
	position: "he",
	judgeOk: (player, target, name, cards, nature) => {
		return lib.filter.targetEnabled2(get.autoViewAs({ name, nature }, cards), player, target)
	},
	filter: (event, player) => {
		return player.countSkill("xjb_guizhan") <= (player.storage.xjb_guizhan || 0)
	},
	content: async function (event, trigger, player) {
		const list = [];
		const jugdeOk = get.info(event.name).judgeOk;
		for (const name of lib.inpile) {
			if (get.type(name) !== "basic" && get.type(name) != "trick") continue;
			if (event.targets.every(target => jugdeOk(player, target, name, event.cards))) {
				if (name === "sha") {
					for (const nature of lib.inpile_nature) {
						list.push(["基本", "", name, nature])
					}
				}
				list.push([get.translation(get.type(name)), "", name])
			}
		}
		const { result: { bool, links } } = await player.chooseButton([
			"诡战",
			[list, "vcard"]
		]);
		if (!bool) {
			player.getStat().skill.xjb_guizhan--;
			return;
		}
		const [_, __, name, nature] = links[0]
		const next = player.useCard({ name, nature }, event.cards, event.targets)
		if (event.cards.every(card => get.color(card) === get.color(event.cards[0]))) {
			next.set("directHit", event.targets);
		}
		await next;
	},
	group: ["xjb_guizhan_countDie"],
	subSkill: {
		countDie: {
			trigger: {
				global: "dying"
			},
			charlotte: true,
			direct: true,
			content: async function (event, trigger, player) {
				game.broadcastAll(player => {
					if (!player.storage.xjb_guizhan) player.storage.xjb_guizhan = 0;
					player.storage.xjb_guizhan++;
				}, player)
				player.when({ global: "phaseAfter" }).then(() => {
					delete player.storage.xjb_guizhan;
				})
			}
		}
	}
})

//伍子胥
const xjb_wanxin = SkillCreater(
	"xjb_wanxin", {
	translate: "剜心",
	description: "锁定技，每轮开始时，你失去“恨”标记数量点体力并摸等量张牌。",
	trigger: {
		global: ["roundStart"],
	},
	forced: true,
	filter: function (event, player, triggername) {
		if (!player.hasMark("xjb_duhen")) return false;
		return true;
	},
	content: async function (event, trigger, player) {
		const x = player.countMark("xjb_duhen")
		await player.loseHp(x)
		await player.draw(x)
	},
});
const xjb_gangli = SkillCreater(
	"xjb_gangli", {
	translate: "刚戾",
	description: "锁定技，你不能成为【乐不思蜀】的目标；你不能被翻面。",
	mod: {
		targetEnabled: function (card, player, target, now) {
			if (get.name(card, player) === "lebu") return false;
		},
	},
	forced: true,
	trigger: {
		player: "turnOverBegin"
	},
	filter: function (event, player, triggername) {
		if (player.isTurnedOver()) return false;
		return true;
	},
	content: function () {
		trigger.cancel()
	},
	ai: {
		noTurnover: true,
	}
})
const xjb_duhen = SkillCreater(
	"xjb_duhen", {
	translate: "渡恨",
	description: "当你造成伤害时，你可以获得一枚“恨”，令此伤害+1。</br>当你使用伤害牌时，你可以获得一枚“恨”，令此牌无法被响应。</br>当你受到伤害时，你可以获得一枚“恨”，对伤害来源造成等量点伤害。</br>出牌阶段开始前，你可以获得一枚“恨”，令本回合你使用牌无距离限制。</br>出牌阶段/濒死阶段，你可以移除〖渡恨〗的一个分项并移去X枚“恨”，然后你回复一点体力。(X为本项你发动的次数)。",
	marktext: "恨",
	intro: {
		name: "渡恨",
		content: "mark",
	},
	group: [
		"xjb_duhen_1",
		"xjb_duhen_2",
		"xjb_duhen_3",
		"xjb_duhen_4",
		"xjb_duhen_5",
	],
	canUse: (player, num) => {
		game.broadcastAll((player) => {
			if (player.storage.xjb_duhen_config == undefined) player.storage.xjb_duhen_config = 0b11111;
		}, player);
		return Boolean(player.storage.xjb_duhen_config & (1 << (num - 1)));
	},
	removeConfig: (player, num) => {
		game.broadcastAll((player, i) => {
			if (player.storage.xjb_duhen_config == undefined) player.storage.xjb_duhen_config = 0b11111;
			player.storage.xjb_duhen_config &= (0b11111 ^ (1 << (i - 1)))
		}, player, num);
	},
	init(player, skill) {
		player.storage.xjb_duhen_config = 0b11111;
	},
	list: [
		"当你造成伤害时，你可以获得一枚“恨”，令此伤害+1。",
		"当你使用伤害牌时，你可以获得一枚“恨”，令此牌无法被响应。",
		"当你受到伤害时，你可以获得一枚“恨”，对伤害来源造成等量点伤害。",
		"出牌阶段开始前，你可以获得一枚“恨”，令本回合你使用牌无距离限制。",
		"出牌阶段/濒死阶段，你可以移除〖渡恨〗的一个分项并移去X枚“恨”，然后你回复一点体力。(X为本项你发动的次数)。"
	],
	subSkill: {
		1: {
			trigger: {
				source: ["damageBegin"],
			},
			prompt2(event, player) {
				return `令对${get.translation(event.player)}造成的伤害+1`
			},
			filter: function (event, player, triggername) {
				if (!get.info("xjb_duhen").canUse(player, 1)) return false;
				return event.notLink();
			},
			content: function () {
				"step 0"
				player.addMark("xjb_duhen", 1)
				trigger.num += 1
			},
		},
		2: {
			trigger: {
				player: ["useCard"],
			},
			prompt2(event, player) {
				return `令${get.translation(event.card)}不可被响应`
			},
			filter: function (event, player, triggername) {
				if (!get.info("xjb_duhen").canUse(player, 2)) return false;
				if (!get.tag(event.card, "damage")) return false;
				return true;
			},
			content: function () {
				"step 0"
				player.addMark("xjb_duhen", 1);
				trigger.directHit.addArray(trigger.targets);
			},
		},
		3: {
			trigger: {
				player: "damageEnd"
			},
			filter: function (event, player, triggername) {
				if (!get.info("xjb_duhen").canUse(player, 3)) return false;
				if (!(event.source)) return false;
				return true;
			},
			prompt2(event, player) {
				return `是否对${get.translation(event.source)}造成${event.num}点伤害`
			},
			content: function () {
				"step 0"
				trigger.source.damage(trigger.num, player)
				player.addMark("xjb_duhen", 1);
			},
		},
		4: {
			trigger: {
				player: ["phaseUseBegin"],
			},
			filter: (event, player) => {
				if (!get.info("xjb_duhen").canUse(player, 4)) return false;
				return true;
			},
			prompt2: "你本回合使用牌无距离限制",
			content: function () {
				"step 0"
				player.addMark("xjb_duhen", 1)
				player.addTempSkill("xjb_duhen_infinity")
			},

		},
		infinity: {
			mod: {
				targetInRange: function (card, player, target, now) {
					return true;
				}
			},
		},
		5: {
			enable: "chooseToUse",
			filter: (event, player) => {
				if (!get.info("xjb_duhen").canUse(player, 5)) return false;
				if (event.type == "dying") {
					if (player != event.dying) return false;
					return true;
				} else if (event.getParent().name == "phaseUse") {
					return true;
				}
				return false;
			},
			content: async function (event, trigger, player) {
				const info = get.info("xjb_duhen");
				const list = [];
				info.list.forEach((description, index) => {
					if (info.canUse(player, index + 1)) list.push([[[index + 1, description]], "tdnodes"])
				});
				const { result: { links, bool } } = await player.chooseButton(list, true);
				if (!bool) return false;
				const [index] = links;
				info.removeConfig(player, index);
				await player.recover();
				player.removeMark("xjb_duhen", player.getAllHistory("useSkill", evt => evt.skill === "xjb_duhen_5").length);
			},
			ai: {
				save: true
			}
		},
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
});