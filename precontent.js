"use script"
import {
	lib,
	game,
	ui,
	get,
	ai,
	_status
} from "../../noname.js";
import {
	xjb_library
} from "./js/library.js";
import {
	LOAD_GAME_TETRIS
} from "./js/game/tetris.js";
import "./js/interact/dialog.mjs";
import "./js/interact/ui.mjs";

import "./js/feature/remnantArea.js";
import "./js/feature/skillCard.mjs";
import "./js/feature/hpCard.js";
function provideFunction() {
	lib.xjb_dataGet = function () {
		return Object.keys(lib.config).filter(function (a) {
			return a.includes("xjb_");
		})
	}
	game.xjb_judgeSkill = {
		Tri_logSkill: function (skill) {
			const info = get.info(skill);
			if (!info.trigger) return false;
			if (!info.content) return false;
			if (info.direct && !info.content.toString().includes("logSkill")) return false;
			if (info.popup === false && !info.content.toString().includes("logSkill")) return false;
			return true;
		},
		enableNotView: function (skill) {
			const info = get.info(skill);
			if (!info.enable) return false;
			if (info.viewAs) return false;
			return true;
		}
	}
	game.xjb_bossLoad = function (str, player) {
		if (_status.timeout) game.pause()
		if (!player) player = game.me
		if (!str) str = "0000"
		lib.skill.xjb_theLevel.theLevel[str].init(player)
	}
	game.xjb_filterData = function (Array) {
		if (arguments.length > 1) {
			for (var i = 0; i < arguments.length; i++) {
				game.xjb_filterData(arguments[i])
			}
			return;
		}
		var target = lib
		for (var i = 0; i < Array.length; i++) {
			target = target[Array[i]]
		}
		var list = {}
		for (var i in target) {
			if (target[i] != null) list[i] = target[i]
		}
		target = list
		return target
	}
	game.xjb_gainJP = function (str, boolean, turn = 1) {
		switch (str) {
			//有技能槽则获得，消耗能量
			case "技能(1个)": {
				var list = get.xjb_allHunSkills();
				var willget = list.randomGet();
				if (game.xjb_condition(3, 1)) {
					game.xjb_create.alert('你获得了技能' + get.translation(willget))
					lib.config.xjb_newcharacter.skill.add(willget)
					game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
					game.xjb_systemEnergyChange(-20)
				}
				else {
					game.xjb_getHunbi(8, void 0, true, true)
					game.xjb_create.alert("请确保你有获得技能的能力！已退还8魂币")
				}
			}; break
			case "称号(1个)": {
				game.xjb_newCharacterGetTitle(1 * turn)
			}; break
			case "技能槽(1个)": {
				game.xjb_newCharacterAddJnc(1 * turn)
			}; break
			case "体力卡(1张，3点)": {
				game.xjb_getHpCard('xjb_newCharacter', 3, turn)
			}; break
			case "体力卡(1张，1点)": {
				game.xjb_getHpCard('xjb_newCharacter', 1, turn)
			}; break
			case "体力值(1点)": {
				game.xjb_newCharacterAddHp(1 * turn, boolean)
			}; break
			case "免费更改势力": case "择木卡一张": {
				game.xjb_newCharacterChangeGroup(1 * turn, boolean)
			}; break
			case "免费更改性别": case "性转卡一张": {
				game.xjb_newCharacterChangeSex(1 * turn, boolean)
			}; break
			case "免费更改姓名": {
				game.xjb_newCharacterChangeName(1 * turn)
			}; break
			default: {
				//替换处1
				var num = parseInt(str, 10)
				if (str.indexOf("打卡点数+") === 0) {
					let dakadianAdded = str.replace("打卡点数+", "")
					game.xjb_addDakadian(dakadianAdded * turn, boolean)
				}
				else if (Object.keys(lib.skill).includes(str)) {
					if (game.xjb_condition(3, 1)) {
						game.xjb_create.alert('你获得了技能' + get.translation(str))
						lib.config.xjb_newcharacter.skill.add(str)
						game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
						game.xjb_systemEnergyChange(-20)
					}
				}
				else if (num != NaN) {
					game.xjb_getHunbi(num, turn, boolean, false, 'Bonus')
				}
			}; break
		}

	}
	game.xjb_getCurrentDate = function (boolean) {
		var date = new Date()
		var a = date.getFullYear(), b = date.getMonth() + 1, c = date.getDate(), d = date.getHours(), e = date.getMinutes()
		if (boolean) {
			var d = date.getDay()
			return d === 0 ? 7 : d
		}
		return [a, b, c, d, e]
	};
	game.xjb_newcharacter_zeroise = function () {
		lib.config.xjb_newcharacter.name2 = '李华'
		lib.config.xjb_newcharacter.sex = 'male';
		lib.config.xjb_newcharacter.group = 'qun';
		lib.config.xjb_newcharacter.hp = 1;
		lib.config.xjb_newcharacter.skill = [];
		lib.config.xjb_newcharacter.intro = '';
		lib.config.xjb_newcharacter.sink = [];
		lib.config.xjb_newcharacter.selectedSink = "ext:新将包/xin_newCharacter.jpg"
		game.saveConfig('xjb_newcharacter', lib.config.xjb_newcharacter)
	}
	game.zeroise_xjbCount = function (target) {
		lib.config.xjb_count[target.name1] = {
			kill: 0,
			thunder: 0,
			fire: 0,
			ice: 0,
			loseMaxHp: 0,
			gainMaxHp: 0,
			HpCard: [],
			uniqueSkill: []
		}
	}
	get.xjb_number = function (number, tarlen1, num1) {
		var tarlen = tarlen1
		if (!number) return ''
		if (typeof number === 'string') {
			return parseInt(number, 10)
		}
		if (!tarlen1) tarlen = 1
		var numobj = {}, name = '选择' + get.cnNumber(tarlen) + '名角色，你'
		var num2 = num1 || 1
		for (var i = 0; i < arguments.length; i++) {
			if (typeof arguments[i] === 'object') {
				numobj = arguments[i]
			}
		}
		var words1 = tarlen === 1 ? '其' : '这些角色各',
			words2 = tarlen === 1 ? '其' : '这些角色分别',
			wordsAdd = numobj.wordsAdd || ''
		if (tarlen === -1) {
			words1 = '所有角色'
			words2 = '所有角色'
			name = '你'
		}
		if (![2, 32, 183].includes(number) && number % 10 !== 4) {
			name += '令'
		} else if (number % 10 === 4) {
			name += '对' + words1 + '造成' + get.cnNumber(num2)
		}
		switch (number) {
			case 1: name += words1 + '摸' + get.cnNumber(num2) + '张牌'; break;
			case 11: name += words1 + '恢复' + get.cnNumber(num2) + '点体力'; break;
			case 21: name += words1 + '加' + get.cnNumber(num2) + '点体力上限'; break;
			case 41: case 123: name += words2 + '获得一个Buff'; break;
			case 2: name += '弃置' + words1 + get.cnNumber(num2) + '张牌'; break;
			case 12: case 52: name += words1 + '失去' + get.cnNumber(num2) + '点体力'; break;
			case 22: name += words1 + '减' + get.cnNumber(num2) + '点体力上限'; break;
			case 32: name += '获得' + words1 + get.cnNumber(num2) + '张牌'; break;
			case 42: name += words1 + '弃置' + get.cnNumber(num2) + '张牌'; break;
			case 62: name += words1 + '弃置全域内' + get.cnNumber(num2) + '张牌'; break;
			case 72: case 113: name += words2 + '获得一个Debuff'; break;
			case 3: name += words2 + '重置之'; break;
			case 13: name += words2 + '横置之'; break;
			case 23: name += words2 + '获得技能' + get.translation(numobj.skills); break;
			case 33: name += words2 + '获得技能' + get.translation(numobj.skills); break;
			case 83: {
				name += words2 + '视为拥有技能' + get.translation(numobj.skills)
			}; break;
			case 153: name += words2 + '正面朝上'; break;
			case 163: name += words2 + '背面朝上'; break;
			case 173: name += words2 + '翻面'; break;
			case 183: name += '对' + words2 + '使用' + get.translation(numobj.toUseCard); break;
			case 4: name += '点火属性伤害'; break;
			case 14: name += '点雷属性伤害'; break;
			case 24: name += '点冰属性伤害'; break;
			case 34: name += '点神属性伤害'; break;
			case 44: {
				name += wordsAdd + '点伤害'
			}; break;
			case 54: name += wordsAdd + '点伤害(此伤害无视护甲)'; break;
		}
		return name
	}


	//技能=object(强制技恢复)
	game.xjb_EqualizeSkillObject = function (string1, object2) {
		lib.skill[string1] = {}
		var list = Object.keys(object2)
		for (var i = 0; i < list.length; i++) {
			lib.skill[string1][list[i]] = object2[list[i]]
		}
		return lib.skill[string1]
	}
	game.xjb_choujiangStr = function (object, num) {
		let willget = JSON.stringify(object);
		willget = willget.replace(/\"|'/g, "");
		if (num && num === 1) {
			willget = willget.replace(/\{|}/g, "");
			willget = willget.replace(/\gainMaxHp/g, "获得体力上限");
			willget = willget.replace(/\loseMaxHp/g, "失去体力上限");
			willget = willget.replace(/\uniqueSkill/g, "特殊技能");
			willget = willget.replace(/\HpCard/g, "体力牌");
			willget = willget.replace(/\,/g, "<br>");
		} else {
			willget = willget.replace(/\*/g, "%<br>");
			willget = willget.replace(/\{|}/g, "<hr>");
			willget = willget.replace(/\,|100/g, "");
			willget = willget.replace(/\,|1?00/g, "");
		}
		return willget
	}
	//get函数
	//新将包翻译
	get.xjb_translation = function (target) {
		if (Array.isArray(target)) {
			var spare = []
			for (var i = 0; i < target.length; i++) {
				spare.push(get.xjb_translation(target[i]))
			}
			return spare
		}
		var translation
		var list1 = Object.keys(lib.xjb_list_xinyuan.translate)
		var list2 = Object.values(lib.xjb_list_xinyuan.translate)
		for (var i = 0; i < list1.length; i++) {
			if (list1[i] == target) translation = list2[i]
			if (list2[i] == target) translation = list1[i]
		}
		if (!translation) {
			translation = []
			var list3 = Object.keys(lib.translate)
			var list4 = Object.values(lib.translate)
			for (var i = 0; i < list3.length; i++) {
				if (list4[i] == target) translation.push(list3[i])
				if (list3[i] == target) {
					translation = list4[i]
				}
			}
		}
		if (typeof target === 'number') translation = get.xjb_number(target)
		if (Array.isArray(translation) && translation.length === 0) return target
		return translation
	}
}
function way() {
	//新将包路径来源     
	if (document.body.outerHTML) {
		let srcs = Array.from(document.scripts).map(function (a) {
			if (a.outerHTML.indexOf('extension') > -1) return a.src;
		}).filter(a => a)
		let src = srcs[0];
		if (srcs) {
			src = src.replace("/extension.js", "");
			let i = src.lastIndexOf("/");
			src = src.slice(0, i);
			src += "/新将包/";
			lib.xjb_src = src;
		}
	}
	if (!lib.config.xjb_fileURL) {
		const initWay = localStorage.getItem("noname_inited");
		lib.config.xjb_fileURL = `${initWay}extension/新将包/`;
		if (initWay === "nodejs") lib.config.xjb_fileURL = lib.xjb_src;
	}
	lib.xjb_fileURL = lib.config.xjb_fileURL;
}
function importFile() {
	let count = 0;
	const files = [
		"lingli",
		"card",
		"title",
		"project",
		"rpg",
		"character",
		"economy",
		"raise",
		"event",
		"skills"
	];
	function loadFiles(fileName) {
		let script = lib.init.js(lib.xjb_src + "js", fileName, () => {
			count++;
		}, (err) => { game.print(err) });
		script.type = 'module';
	}
	new Promise(res => {
		//引入css文件    
		lib.init.css(lib.xjb_src + "css", "main");
		lib.init.css(lib.xjb_src + "css", "nature");
		//引入js文件
		files.forEach(file => {
			loadFiles(file)
		})
		function interval() {
			if (count >= files.length) {
				res()
				clearInterval(interval)
			}
		}
		setInterval(interval, 100)
	}).then(() => {
		const script = lib.init.js(lib.xjb_src + "js", "final", () => {
			window.XJB_LOAD_FINAL()
		})
		script.type = "module";
	});
	//引入api
	/**
	 * @property {function} xjb_loadAPI
	 */
	game.xjb_loadAPI = function (suc = () => void 0, fail = () => void 0, branch = "master") {
		if (window.xjb_xyAPI) {
			alert('工具已引入,无需重新引入!');
			return;
		}
		game.download(
			'https://gitee.com/xinyuanwm/xy-api/raw/master/xjb_xyAPI.js',
			'extension/新将包/xjb_xyAPI.js',
			() => {
				lib.init.js(
					lib.xjb_src.slice(0, -1),
					"xjb_xyAPI",
					load => {
						game.print('xjb_xyAPI加载成功');
						xjb_xyAPI.setGameData(lib, game, ui, get, ai, _status);
						xjb_xyAPI.autoAddExtension(
							'新将包',
							`https://gitee.com/xinyuanwm/new-jiang/raw/${branch}/`
						);
						suc(load);
					},
					(err) => {
						game.print('xjb_xyAPI加载失败');
						game.print(err)
						fail(err);
					});
			},
			(err) => {
				fail(err)
			}
		);
	};
	game.xjb_loadAPI_PR = function () {
		game.xjb_loadAPI(() => {
			game.print(window.xjb_xyAPI);
		}, void 0, "PR-branch");
	};
}
function initialize() {
	lib.xjb_skillsStore = [];
	window.XJB_GLOBAL_VAR = {
		lib,
		game,
		get,
		_status,
		ai,
		ui
	}
	lib.element.XJB_CLASS = {}
	//设置刘徽-祖冲之祖项目
	//设置参数π、e、Φ，这些参数越大越精确
	if (!lib.config.xjb_π) {
		lib.config.xjb_π = 6
	}
	if (!lib.config.xjb_e) {
		lib.config.xjb_e = 1
	}
	if (!lib.config.xjb_Φ) {
		lib.config.xjb_Φ = 1
	}
	//设置技能标签
	if (!lib.config.xjb_skillTag_Character) lib.config.xjb_skillTag_Character = []
	if (!lib.config.xjb_skillTag_Skill) lib.config.xjb_skillTag_Skill = {}
	//设置xjb_redSkill
	if (!lib.config.xjb_redSkill) lib.config.xjb_redSkill = { list: [], skill: {}, translate: {} }
	//设置物品
	if (!lib.config.xjb_objects) lib.config.xjb_objects = {}
	//设置技能槽
	if (!lib.config.xjb_jnc || typeof lib.config.xjb_jnc != 'number') lib.config.xjb_jnc = 0
	//设置打卡，第一行用于记录年月日及次数，第二行记录打卡点
	if (!lib.config.xjb_hundaka) lib.config.xjb_hundaka = [0, 0, 0, 0]
	if (!lib.config.xjb_hundaka2 || typeof lib.config.xjb_hundaka2 != 'number') lib.config.xjb_hundaka2 = 0
	//设置抽奖类型
	if (!lib.config.cjb_cj_type) lib.config.cjb_cj_type = "1";
	//设置系统能量
	if (lib.config.xjb_systemEnergy == undefined) lib.config.xjb_systemEnergy = 50;
	if (lib.config.xjb_systemEnergy > 5e8) lib.config.xjb_systemEnergy = 5e8;
	if (isNaN(lib.config.xjb_systemEnergy)) lib.config.xjb_systemEnergy = 0;
	//设置魂币
	if (lib.config.xjb_hunbi !== undefined) {
		if (lib.config.xjb_hunbi > 5e7) lib.config.xjb_hunbi = 5e7;
		if (isNaN(lib.config.xjb_hunbi)) lib.config.xjb_hunbi = 1;
	}
	if (!lib.config.xjb_hunbiLog) lib.config.xjb_hunbiLog = "";
	//设置称号
	if (!lib.config.xjb_title) {
		lib.config.xjb_title = [];
	}
	if (!lib.config.xjb_count) lib.config.xjb_count = {}

	//设置养成角色
	if (!lib.config.xjb_newcharacter) {
		lib.config.xjb_newcharacter = {}
	}
	if (!lib.config.xjb_newcharacter.name2) lib.config.xjb_newcharacter.name2 = '李华';
	if (!lib.config.xjb_newcharacter.sex) lib.config.xjb_newcharacter.sex = 'male';
	if (!lib.config.xjb_newcharacter.group) lib.config.xjb_newcharacter.group = 'qun';
	if (!lib.config.xjb_newcharacter.hp || typeof lib.config.xjb_newcharacter.hp != 'number') lib.config.xjb_newcharacter.hp = 1;
	if (lib.config.xjb_newcharacter.hp > 8) lib.config.xjb_newcharacter.hp = 8
	if (!lib.config.xjb_newcharacter.skill) lib.config.xjb_newcharacter.skill = [];
	if (!lib.config.xjb_newcharacter.intro) lib.config.xjb_newcharacter.intro = '';
	if (!lib.config.xjb_newcharacter.skin) lib.config.xjb_newcharacter.skin = [];
	if (!lib.config.xjb_newcharacter.selectedSkin) lib.config.xjb_newcharacter.selectedSkin = "ext:新将包/xin_newCharacter.jpg"
	//设置存档
	if (!lib.config.xjb_myStorage) {
		lib.config.xjb_myStorage = {
			total: 0,
		}
	}
	if (lib.config.xjb_cardStore === void 0) lib.config.xjb_cardStore = true;
	if (lib.config.xjb_lingli_Allallow === void 0) lib.config.xjb_lingli_Allallow = false;
	//设置变身
	lib.config.xjb_bianshenCharacter = {};
	//设置增加到牌堆的卡牌
	if (!lib.config.xjb_cardAddToPile) lib.config.xjb_cardAddToPile = {}
	//设置列表
	lib.xjb_hunList = lib.config.xjb_list_hunbilist = {
		skill: {},
		choujiang: {},
	}
	//选项    
	lib.xjb_list_xinyuan = {
		_order: {
			win_fan: 33.7,
			win_zhong: 33.3,
			win_nei: 33.5,
			win_zhu: 33.1,
			playedTimes_fan: 33.6,
			playedTimes_zhu: 33,
			playedTimes_zhong: 33.2,
			playedTimes_nei: 33.4,
			winRate_fan: 33.71,
			winRate_zhong: 33.31,
			winRate_nei: 33.51,
			winRate_zhu: 33.11,
			win1: 32,
			playedTimes1: 31,
			winRate1: 32.1,
			win2: 42,
			playedTimes2: 41,
			winRate2: 43,
			win_farmer: 44,
			playedTimes_farmer: 44.1,
			winRate_farmer: 44.2,
			win_landlord: 45,
			playedTimes_landlord: 45.1,
			winRate_landlord: 45.2,
			win3: 52,
			playedTimes3: 51,
			winRate3: 53,
			strongDamage: 10,
			ice: 13,
			fire: 11,
			thunder: 12,
			kami: 14,
			"kill": 1,
			"recover": 20,
			"loseHp": 21,
			"loseMaxHp": 22,
			"gainMaxHp": 23,
		},
		translate: {
			//count翻译
			lingfa: "灵法",
			kind: "种族",
			lingtan: "灵弹",
			selectedTitle: "当前称号",
			strongDamage: "重伤害",
			ice: "冰属性伤害",
			fire: "火属性伤害",
			thunder: "雷属性伤害",
			kami: "神属性伤害",
			"kill": "击杀人数",
			"HpCard": "体力牌",
			"recover": "恢复体力",
			"loseHp": "失去体力",
			"loseMaxHp": "失去体力上限",
			"gainMaxHp": "增加体力上限",
			"die": "死亡",
			"link": "横置",
			"insertPhase": "额外进行一个回合",
			//单词翻译
			'none': '无',
			//技能翻译
			'limited': '限定技',
			'juexingji': '觉醒技',
			'zhuanhuanji': '转换技',
			'zhuSkill': '主公技',
			'forced': '锁定技',
			'skill_X': 'X技',
			'qzj': '强制技',
			'viewAs': "视为技"
		},
		jiangchi: [],
		skills: {
			first: ["xjb_juanqu", "xjb_lunhui"],
			second: ["xjb_leijue", "xjb_bingjue"],
			third: ["xjb_pomie", "xjb_huojue"],
			red: []
		},
		choujiang: {
		},
		theStorage: "",
		theFunction: {
			xjb_chupingjisha: function () {
				ui.xjb_chupingjisha && ui.xjb_chupingjisha.remove && ui.xjb_chupingjisha.remove()
				//"stayleft"可以让该元素保持在左边
				const cpjs = ui.xjb_chupingjisha = ui.create.control("触屏即杀", 'stayleft', lib.xjb_list_xinyuan.dom_event.chupingjisha)
				return cpjs;
			}
		},
		dom_event: {
			chupingjisha: function () {
				this.hide()
				var next = game.createEvent("xjb-chupingjisha");
				next.player = game.me;
				_status.event.next.remove(next);
				_status.event.getParent().next.push(next);
				next.setContent(async function (event, trigger, player) {
					const eventList1 = [
						[["loseHp", false], "流失体力"],
						[["damage", false, player], "普通伤害"],
						[["damage", false, "fire", player], "火焰伤害"],
						[["damage", false, "thunder", player], "雷电伤害"],
						[["damage", false, "ice", player], "冰冻伤害"],
						[["damage", false, "kami", player], "神袛伤害"],
					];
					const eventList2 = [
						[["useCard", true, { name: "sha" }], "杀"],
						[["useCard", true, { name: "sha", nature: "fire" }], "火杀"],
						[["useCard", true, { name: "sha", nature: "thunder" }], "雷杀"],
						[["useCard", true, { name: "sha", nature: "ice" }], "冰杀"],
						[["useCard", true, { name: "juedou" }], "决斗"],
						[["executeDelayCardEffect", false, "shandian"], "闪电"],
						[["executeDelayCardEffect", false, "xjb_tianqian"], "天谴"],
					];
					const eventList3 = [
						[["fanjian", true, "fanjian"], '反间'],
						[["useSkill", true, "releiji"], '雷击'],
						[["useSkill", true, "fangzhu"], '放逐'],
						[["useSkill", true, "xinfu_guolun"], '过论'],
						[["sbliegong", true, { name: "sha" }], "烈弓"],
						[["repojun", true, { name: "sha" }], "破军"],
						[["retieji", true, { name: "sha" }], "铁骑"],
						[["zhuandui", true, { name: "sha" }], "专对"],
					]
					const { bool, links } = await player.chooseButton([
						'请选择一种连点方式',
						[eventList1, 'tdnodes'],
						[eventList2, 'tdnodes'],
						[eventList3, 'tdnodes'],
					]).forResult();
					const uniqueEventPre = {
						"zhuandui": (player) => {
							player.addTempSkill(["zhuandui", "tianbian"], { global: "phaseAfter", player: "xjb-chupingjishaAfter" })
							return "useCard";
						},
						"repojun": (player) => {
							const card = game.createCard("guding", "spade", 1);
							player.chooseUseTarget(card);
							card.storage.cpjs = true;
							player.addTempSkill(["repojun"], { global: "phaseAfter", player: "xjb-chupingjishaAfter" });
							player.when("xjb-chupingjishaAfter").then(() => {
								const guding = player.getCards("e", item => item.name == "guding" && item.storage.cpjs === true);
								if (guding) player.discard(guding, ui.ordering);
								guding.remove();
							})
							return "useCard";
						},
						"retieji": (player) => {
							player.addTempSkill(["retieji"], { global: "phaseAfter", player: "xjb-chupingjishaAfter" })
							return "useCard";
						},
						"sbliegong": (player) => {
							player.addTempSkill(["sbliegong"], { global: "phaseAfter", player: "xjb-chupingjishaAfter" });
							player.when({ global: "phaseAfter", player: "xjb-chupingjishaAfter" }).then(() => {
								delete player.storage.sbliegong;
								player.removeTip("sbliegong");
							})
							return "useCard";
						},
						"fanjian": (player) => {
							return "useSkill"
						}
					}
					const uniqueEventEveryTurn = {
						"repojun": (player, target) => {
							return player.chooseUseTarget({ name: "jiu" }, true, false);
						},
						"sbliegong": (player) => {
							player.markAuto("sbliegong", lib.suits.slice(0));
							player.storage.sbliegong.sort((a, b) => lib.suit.indexOf(b) - lib.suit.indexOf(a));
							player.addTip("sbliegong", get.translation("sbliegong") + player.getStorage("sbliegong").reduce((str, suit) => str + get.translation(suit), ""));
							return;
						},
						"fanjian": (player) => {
							return player.draw();
						}
					}
					if (bool) {
						const wayName = links[0].shift();
						const toTarget = links[0].shift();
						let toDo = wayName;
						if (wayName in uniqueEventPre) {
							toDo = uniqueEventPre[wayName](player);
						}
						while (_status.event === event) {
							const chooseEvent = player.chooseTarget();
							if (!get.xjb_haveEnergy()) chooseEvent.set("filterTarget", () => false)
							const { result } = await chooseEvent;
							if (!result || !result.bool) break;
							const target = result.targets[0]
							if (wayName in uniqueEventEveryTurn) {
								await uniqueEventEveryTurn[wayName](player, target)
							}
							if (toTarget) await player[toDo](...links[0], target, [target])
							else await target[toDo](...links[0]);
							await game.xjb_systemEnergyChange(-5)
						}
					}
					ui.xjb_chupingjisha.show();
				})
				//如果是你的出牌阶段发动此技能
				if (_status.event.name == 'chooseToUse' && _status.event.player) {
					_status.event.result = {
						bool: true,
						skill: 'xjb_updateStrategy'
					};
					game.resume();
				}
			},
		}
	}
}
function LOAD_SMALL_GAME() {
	LOAD_GAME_TETRIS(lib, game, ui, get, ai, _status)
}
export function XJB_PRECONTENT() {
	provideFunction();
	way();
	initialize();
	importFile();
	LOAD_SMALL_GAME();
	window.xjb_library = xjb_library;
	//折头折百花联动
	// if (lib.config.extensions.includes('枝头折百花') && lib.config.extension_枝头折百花_enable) {
	//     lib.nature && lib.nature.push && lib.nature.push('flower')
	//     game.addNature && game.addNature('flower')
	//     lib.skill._ztzbh_flowerDamage = {
	//         trigger: {
	//             source: ["damageBegin"],
	//         },
	//         filter: function (event, player) {
	//             if (game.roundNumber % 4 == 1) lib.translate._ztzbh_flowerDamage = '春雷'
	//             if (game.roundNumber % 4 == 2) lib.translate._ztzbh_flowerDamage = '炎夏'
	//             if (game.roundNumber % 4 == 3) lib.translate._ztzbh_flowerDamage = '寂秋'
	//             if (game.roundNumber % 4 == 0) lib.translate._ztzbh_flowerDamage = '凌冬'
	//             if (!(event.nature == "flower")) return false;
	//             return true;
	//         },
	//         content: function () {
	//             "step 0"
	//             trigger.cancel()
	//             if (game.roundNumber % 4 == 1) trigger.player.damage(1, "thunder", player) && player.popup('春雷')
	//             if (game.roundNumber % 4 == 2) trigger.player.damage(1, "fire", player) && player.popup('炎夏')
	//             if (game.roundNumber % 4 == 3) trigger.player.loseHp(1, player) && player.popup('寂秋')
	//             if (game.roundNumber % 4 == 0) trigger.player.damage(1, "ice", player) && player.popup('凌冬')
	//         },
	//     }
	//     lib.translate._ztzbh_flowerDamage = '花伤'
	//     lib.skill._ztzbh_liandong = {
	//         trigger: {
	//             player: [],
	//         },
	//         filter: function (event, player) {
	//             return player === game.me
	//         },
	//         direct: true,
	//         content: function () {
	//             let name = player.name
	//             game.xjb_getDaomo(player, "flower")
	//         }
	//     }
	// }
}
