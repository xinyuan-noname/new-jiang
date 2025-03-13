"use script"
import {
	lib,
	game,
	ui,
	ai,
	get,
	_status
} from "./../../../noname.js"
import {
	adjustTab,
	indexRange,
	selectionIsInRange,
	validParenthness,
	findPrefix,
	whichPrefix,
	eachLine,
	findWordsGroup,
	clearWordsGroup,
	deleteRepeat,
	isOpenCnStr,
	correctPunctuation,
	JavascriptKeywords,
	JavascriptUsualType,
	JavascriptGlobalVariable
} from './tool/string.js'
import {
	listenAttributeChange,
	element,
	textareaTool,
	touchE
} from './tool/ui.js'
import {
	NonameCN
} from './editor/nonameCN.js'
import { EditorInteraction } from './editor/interaction.mjs';
import { dispose, disposeTri, TransCnText } from './editor/transCnText.mjs';
import { EditorArrange } from './editor/arrange.mjs';
import { ImplicitTextTool } from "./editor/implicitText.mjs";
import { EditorOrganize } from "./editor/organize.mjs";
import { choiceMode } from "./editor/choiceMode.mjs";
import { EditorDataAnalyze } from "./editor/dataAnalyze.mjs"
const DEFAULT_EVENT = lib.config.touchscreen ? 'touchend' : 'click';
if (!lib.config.xjb_editorConfig) lib.config.xjb_editorConfig = {};
lib.xjb_class = {
	player: ['_status.currentPhase', 'target', 'game.me',
		'player', 'trigger.player', 'trigger.source', 'trigger.target',
		...new Array(10).fill('targets').map((_, i) => _ + "[" + i + "]"),
		...new Array(10).fill('result.targets').map((_, i) => _ + "[" + i + "]")
	],
	players: ['game.players', 'result.targets', 'targets'],
	game: ['game'],
	get: ['get'],
	event: ['event', 'trigger', 'trigger.parent', 'event.parent', '_status.event', "evt",
		"judgeEvent", "chooseEvent"],
	suit: ['"red"', '"black"', '"club"', '"spade"', '"heart"', '"diamond"', '"none"'],
	nature: ['"ice"', '"fire"', '"thunder"'],
	Math: ["Math"],
	cardName: (() => {
		const cardNameList = [].concat(...lib.config.cards.map(name => lib.cardPack[name]));
		return cardNameList.map(card => `"${card}"`);
	})(),
	number: ['1', '2', '3', '4', '5', '6',
		'7', '8', '9', '10', '11', '12', '13'],
	gain: ['"gain2"', '"draw"', '"giveAuto"', "'gain2'", "'draw'", "'giveAuto'"],
	card: ["trigger.card", 'card'],
	logicConj: [" > ", " < ", " >= ", " <= ", " == ", ">", "<", ">=", "<=", "=="],
	variable: ["const ", "let ", "var "]
}
get.xjb_en = (str) => NonameCN.getEn(str);
lib.xjb_translate = { ...NonameCN.AllList }
lib.xjb_editorUniqueFunc = NonameCN.uniqueFunc;
//判定类型
game.xjb_judgeType = function (word) {
	if (!word || !word.length) return;
	if (Object.values(NonameCN.groupedList.array).some(arr => word === arr)) return "array"
	for (let k in lib.xjb_class) {
		if (lib.xjb_class[k].includes(word)) return k;
	}
}
game.xjb_skillEditor = function (readCache = true) {
	const playerCN = NonameCN.playerCN;
	const JOINED_PLAYAERCN = playerCN.join("|");
	const [back, close] = ui.create.xjb_back()
	back.close = close
	back.classList.add("xjb-editor")
	back.ele = {}
	back.skill = get.copy(NonameCN.backSkillMap);
	back.pageNum = 0;
	back.pages = [];
	back.trigger = [];
	back.phaseUse = [];
	back.choose = [];
	back.cnSentence = new Map();
	back.skillEditorStart = function () {
		const cache = back.skill.primarySkillCache;
		back.skill = get.copy(NonameCN.backSkillMap);
		back.skill.primarySkillCache = { ...cache };
		back.organize();
	}
	back.getID = function () {
		return (back.skill.subSkillEditing ? back.skill.primarySkillCache.skill.id + '_' + back.skill.id : back.skill.id) || "xxx"
	}
	back.getSourceID = function () {
		return back.skill.primarySkillCache.skill.id || back.skill.id || "xxx";
	}
	back.clearTextarea = function () {
		const listEle = [
			"id",
			"filter",
			"content",
			"trigger",
			"filterTarget",
			"filterCard"
		]
		for (const itemName of listEle) {
			back.ele[itemName].value = '';
		};
	}
	//缓存部分
	back.cachePrimarySkill = function () {
		if (!back.skill.subSkillEditing) {
			const listSkill = Object.keys(back.skill).filter(item => {
				return item !== "primarySkillCache" && !item.startsWith("variable_");
			})
			for (const itemName of listSkill) {
				if (Array.isArray(back.skill[itemName])) {
					back.skill.primarySkillCache.skill[itemName] = [...back.skill[itemName]];
				}
				else if (typeof back.skill[itemName] === "object") {
					back.skill.primarySkillCache.skill[itemName] = { ...back.skill[itemName] };
				}
				else back.skill.primarySkillCache.skill[itemName] = back.skill[itemName];
			}
			const listEle = [
				"id",
				"filter",
				"content",
				"trigger",
				"filterTarget",
				"filterCard"
			]
			for (const itemName of listEle) {
				back.skill.primarySkillCache.ele[itemName] = back.ele[itemName].value;
			};
		}
	}
	back.readPrimarySkillCache = function () {
		for (const itemName in back.skill.primarySkillCache.ele) {
			back.ele[itemName].value = back.skill.primarySkillCache.ele[itemName];
		};
		for (const itemName in back.skill.primarySkillCache.skill) {
			if (Array.isArray(back.skill[itemName])) {
				back.skill[itemName] = [...back.skill.primarySkillCache.skill[itemName]];
			}
			else if (typeof back.skill[itemName] === "object") {
				back.skill[itemName] = { ...back.skill.primarySkillCache.skill[itemName] };
				continue;
			}
			back.skill[itemName] = back.skill.primarySkillCache.skill[itemName];
		}
		back.organize()
	}
	back.cacheSubskill = function () {
		if (back.skill.subSkillEditing) {
			const id = back.skill.id
			if (!back.skill.primarySkillCache.skill.subSkill[id]) back.skill.primarySkillCache.skill.subSkill[id] = {};
			if (!back.skill.primarySkillCache.skill.subSkill[id].skill) back.skill.primarySkillCache.skill.subSkill[id].skill = {};
			if (!back.skill.primarySkillCache.skill.subSkill[id].ele) back.skill.primarySkillCache.skill.subSkill[id].ele = {};
			const listSkill = Object.keys(back.skill).filter(item => {
				return item !== "primarySkillCache" && !item.startsWith("variable_");
			})
			for (const itemName of listSkill) {
				if (Array.isArray(back.skill[itemName])) {
					back.skill.primarySkillCache.skill.subSkill[id].skill[itemName] = [...back.skill[itemName]];
				}
				else if (typeof back.skill[itemName] === "object") {
					back.skill.primarySkillCache.skill.subSkill[id].skill[itemName] = { ...back.skill[itemName] };
				}
				else back.skill.primarySkillCache.skill.subSkill[id].skill[itemName] = back.skill[itemName];
			}
			const listEle = [
				"id",
				"filter",
				"content",
				"trigger",
				"filterTarget",
				"filterCard"
			]
			for (const itemName of listEle) {
				back.skill.primarySkillCache.skill.subSkill[id].ele[itemName] = back.ele[itemName].value;
			};
			back.skill.mode = 'self';
			back.organize();
			back.skill.primarySkillCache.skill.subSkill[id].result = EditorOrganize.oneSubSkill(back, id, back.target.value);
		}
	}
	back.readSubskillCache = function (id) {
		for (const itemName in back.skill.subSkill[id].ele) {
			back.ele[itemName].value = back.skill.subSkill[id].ele[itemName];
		};
		for (const itemName in back.skill.subSkill[id].skill) {
			if (Array.isArray(back.skill.subSkill[id].skill[itemName])) {
				back.skill[itemName] = [...back.skill.subSkill[id].skill[itemName]];
			}
			else if (typeof back.skill.subSkill[id].skill[itemName] === "object") {
				back.skill[itemName] = { ...back.skill.subSkill[id].skill[itemName] };
				continue;
			}
			back.skill[itemName] = back.skill.subSkill[id].skill[itemName];
		}
		delete back.skill.subSkill;
		back.organize()
	}
	//获取变量,在两者已提交后
	back.allVariable = function () {
		back.skill.variable_content.clear();
		back.skill.variable_filter.clear();
		back.skill.content.forEach(str => {
			let regexp = /(var|const|let)(\s)+(.+)\=\s*(.+)/
			if (regexp.exec(str) != null) {
				str.replace(regexp, function (...arr) {
					/**
					 * @type {Map}
					 */
					let map = back.skill.variable_content;
					map.set(arr[4].replace(/\s/g, ""), arr[3].replace(/\s/g, ""));
				})
			}
		});
		back.skill.filter.forEach(str => {
			let regexp = /(var|const|let)(\s)+(.+)=\s*(.+)/
			if (regexp.exec(str) != null) {
				str.replace(regexp, function (...arr) {
					/**
					 * @type {Map}
					 */
					let map = back.skill.variable_filter;
					map.set(arr[4].replace(/\s/g, ""), arr[3].replace(/\s/g, ""));
				})
			}
		});
	}
	back.modTest = function () {
		back.ele.content.submit(true);
		back.skill.mod = {
			cardUsable_Infinity: [],
			targetInRange_Infinity: [],
			targetEnabled_false: [],
			cardEnabled_false: [],
			globalFrom: [],
			globalTo: []
		}
		function giveMethodOfGet(name, condition) {
			Object.defineProperty(back.skill.mod, name, {
				get() {
					let result = 0;
					for (let k in back.skill.mod) {
						const atrr = back.skill.mod[k];
						const bool = condition === void 0 ? true : k.startsWith(condition)
						if (bool && Array.isArray(atrr)) result += atrr.length;
					}
					return result;
				}
			});
		}
		giveMethodOfGet('length')
		giveMethodOfGet('lengthOfCardUsable', 'cardUsable')
		giveMethodOfGet('lengthOfTargetInRange', 'targetInRange')
		giveMethodOfGet('lengthOfTargetEnabled', 'targetEnabled')
		giveMethodOfGet('lengthOfCardEnabled', 'cardEnabled')
		giveMethodOfGet('lengthOfGlobalFrom', 'globalFrom')
		giveMethodOfGet('lengthOfGlobalTo', 'globalTo')
		/**
		 * @param {RegExp} regexp 
		 * @param {string} output 
		 * @param {string} attr
		 * @param {function} func
		 */
		function addMod(regexp, output, attr, func) {
			[...back.skill.content].forEach((cont, i) => {
				let match = regexp.exec(cont);
				if (!match) return;
				if (func) [output, attr] = func(...match)
				{
					const next = back.skill.content[i + 1];
					//强制转对象,以便添加属性和方法
					const last = new String(back.skill.content[i - 1]);
					last.contentIndex = i - 1;
					last.getLast = function () {
						const result = new String(back.skill.content[this.contentIndex - 1])
						if (result == "undefined") return;
						if (result.endsWith(",")) return;
						result.getLast = this.getLast;
						result.contentIndex = this.contentIndex - 1;
						return result;
					}
					if (last == "{" && next == "}") {
						let line = last.getLast()
						for (let _ = 0; _ < 20; _++) {
							if (line == "if(") break;
							if (line == "undefined") break;
							line = line.getLast();
						}
						if (line != "undefined") {
							const startIndex = line.contentIndex;
							let slice = back.skill.content.splice(startIndex, i - startIndex + 2);
							back.skill.mod[attr].push(...slice.slice(0, -2), output, slice.slice(-1)[0]);
							return;
						}
					};
					back.skill.content.remove(cont);
					back.skill.mod[attr].push(output);
				}
			})
		}
		for (const [regexp, args] of NonameCN.skillModMap.entries()) {
			addMod(regexp, ...args)
		}
	}
	back.addUserCustom = function () {
		back.skill.content_ignoreIndex = [];
		let start = false, nowMatch = '', i = 0;
		for (const line of [...back.skill.content]) {
			let match = line.match(/^<([$_a-zA-Z0-9]+)>$/);
			if (!nowMatch && match) {
				nowMatch = match[1];
				back.skill.custom[nowMatch] = '';
				start = true;
				back.skill.content_ignoreIndex.push(i);
			}
			else if (start && line === `</${nowMatch}>`) {
				start = false;
				nowMatch = null;
				back.skill.content_ignoreIndex.push(i);
			} else if (start) {
				back.skill.custom[nowMatch] += `${line}\n`;
				back.skill.content_ignoreIndex.push(i);
			}
			i++;
		}
	}
	back.addFilterVariable = function () {
		back.skill.filter_ignoreIndex = [];
		back.skill.variableArea_filter = [];
		let start = false;
		for (const [i, line] of [...back.skill.filter].entries()) {
			if (line === "#变量区头" || line === "#变量 区头") {
				start = true;
				back.skill.filter_ignoreIndex.push(i)
			}
			else if (line === "#变量区尾" || line === "#变量 区尾") {
				start = false;
				back.skill.filter_ignoreIndex.push(i)
			}
			else if (start) {
				back.skill.variableArea_filter.push(line)
				back.skill.filter_ignoreIndex.push(i)
			}
		}
	}
	back.subSkillTest = function () {
		for (const skillName in back.skill.subSkill) {
			if (back.skill.subSkill[skillName].viewAsSubSkill) delete back.skill.subSkill[skillName];
		}
		return true
	}
	back.groupTest = function () {
		for (const skillName in back.skill.subSkill) {
			if (back.skill.subSkill[skillName].viewAsSubSkill) back.skill.group.remove(back.skill.id + '_' + skillName);
		}
		return true;
	}
	back.aiTest = function () {
		back.skill.ai = [];
		back.skill.subSkillAi = [];
		back.aiArrange();
		return true;
	}
	back.aiArrange = function () {
		return true;
	}
	back.isContentAsync = function () {
		if (back.skill.contentAsync) return;
		if (back.skill.content.some(line => /\bawait\b/.test(line))) {
			back.skill.contentAsync = true;
		}
	}
	//调整显示
	back.updateDisplay = function () {
		for (const kindButton of back.ele.kinds) {
			kindButton.unchosen();
			if (kindButton.kind === back.skill.kind) {
				kindButton.chosen();
			}
		}
		for (const skindButton of back.ele.switchKinds) {
			skindButton.unchosen();
			if (skindButton.kind === back.skill.kind) {
				skindButton.chosen();
			}
		}
		if (back.skill.kind) {
			kindSettingPage.hide();
		}
		for (const typeButton of [...back.ele.types, ...back.ele.phaseUseButton]) {
			if (back.skill.type.includes(typeButton.type)) {
				typeButton.style.backgroundColor = "red";
				continue;
			}
			typeButton.style.backgroundColor = "#e4d5b7";
		}
		back.ele.groupsContainer.update()
		for (const uniqueButton of back.ele.groups) {
			if (back.skill.uniqueList.includes(uniqueButton.dataset.attr)) {
				uniqueButton.style.backgroundColor = "red";
				continue;
			}
			uniqueButton.style.backgroundColor = "#e4d5b7";
		}
		for (const modeButton of back.ele.modes) {
			if (modeButton.mode == back.skill.mode) {
				modeButton.style.backgroundColor = 'red';
				continue;
			}
			modeButton.style.backgroundColor = "#e4d5b7";
		}
		for (const positionButton of back.ele.positions) {
			if (back.skill.position.includes(positionButton.position)) {
				positionButton.style.backgroundColor = "red";
				continue;
			}
			positionButton.style.backgroundColor = "#e4d5b7";
		}
		[...back.trigger, ...back.phaseUse, ...back.choose].forEach(i => {
			i.style.display = 'none'
		});
		switch (back.skill.kind) {
			case "trigger": {
				back.trigger.forEach(i => { i.style.display = 'flex' });
				back.trigger[0].parentElement.offBack()
			}; break;
			case 'enable:"phaseUse"': {
				back.phaseUse.forEach(i => { i.style.display = 'flex' });
				back.phaseUse[0].parentElement.offBack()
			}; break;
			default: {
				back.skill.boolList.includes("viewAs") && back.choose.forEach(i => { i.style.display = 'flex' })
				back.choose[0].parentElement.onBack()
			}; break;
		}
	}
	back.turnToPageOne = function () {
		back.pageNum = 0;
		back.pages.forEach((i, k) => {
			i.style.display = back.pageNum == k ? 'flex' : 'none'
		})
	}
	//
	function isJianxiongGain() {
		/**
		 * @type {Map}
		 */
		let map = back.skill.variable_content
		let p = map.get("trigger.cards")
		const bool1 = back.skill.trigger.player.includes("damageEnd");
		const bool2 = back.skill.content.some(str => {
			return /gain\(.*trigger.cards.*\)/.exec(str) !== null;
		});
		const bool3 = back.skill.content.some(str => {
			return new RegExp(`gain\(.*${p}.*\)`).exec(str) != null;
		})
		return bool1 && (bool2 || bool3);
	}
	function isViewAs() {
		const bool = back.skill.kind && back.skill.kind !== "trigger" && back.skill.kind !== 'enable:"phaseUse"'
		return bool
	}
	function moreViewAs() {
		const bool = back.skill.viewAs.length > 1 && back.skill.viewAsCondition.length > 1
		return bool;
	}
	back.prepare = function () {
		back.allVariable();
		back.skill.boolList.length = 0;
		if (!back.skill.mode) back.skill.mode = 'self';
		isJianxiongGain() && back.skill.boolList.push("jianxiong_gain");
		isViewAs() && back.skill.boolList.push("viewAs");
		moreViewAs() && back.skill.boolList.push("moreViewAs");
		//
		back.modTest();
		back.groupTest();
		back.aiTest();
		back.subSkillTest();
		back.isContentAsync();
		//
		if (back.hasVariableArea) back.addFilterVariable();
		//
		back.addUserCustom();
		//更新显示状态
		back.updateDisplay();
	}
	back.organize = function () {
		back.prepare();
		/*初始化:最终输出的文字*/
		let strParts = [];
		const { asCardType } = NonameCN.analyzeViewAsData(back);
		const filter = EditorOrganize.filter(back, asCardType);
		const content = EditorOrganize.content(back);
		const enableSkillNeed = EditorOrganize.enablePart(back);
		//根据所选的编辑器类型确定开头
		strParts.push(EditorOrganize.opening(back));
		strParts.push(EditorOrganize.init(back));
		strParts.push(EditorOrganize.mod(back));
		strParts.push(EditorOrganize.kind(back));
		strParts.push(EditorOrganize.skillTag(back));
		strParts.push(EditorOrganize.getIndex(back));
		if (content.includes('.custom_researchCardsDif')) {
			strParts.push(EditorOrganize.custom.researchCardsDif())
		}
		if (enableSkillNeed.includes('.custom_selectedIsSameCard')) {
			strParts.push(EditorOrganize.custom.selectedIsSameCard())
		}
		if (enableSkillNeed.includes('.custom_selectedIsDifCard')) {
			strParts.push(EditorOrganize.custom.selectedIsDifCard())
		}
		if (back.skill.custom.judgeCallback) {
			strParts.push(EditorOrganize.judgeCallback(back));
		}
		if (back.skill.custom.cost) {
			strParts.push(EditorOrganize.cost(back));
		}
		//filter部分	
		if (!/filter\:function\(event\,player\,triggername\)\{\n\s*(return true;)?\s*?\n\}\,\n/.test(filter)) {
			strParts.push(filter);
		}
		strParts.push(enableSkillNeed)
		//content部分
		if (!back.skill.boolList.includes("viewAs")) {
			strParts.push(content);
		}
		else if (back.skill.viewAs.length && back.skill.viewAsCondition.length) {
			strParts.push(EditorOrganize.viewAs(back, 0));
			if (asCardType) {
				strParts.push(EditorOrganize.buttonRequire(back))
			}
		}
		if (back.aiArrange() && back.skill.ai.length) {
			strParts.push(EditorOrganize.ai(back));
		}
		if (back.skill.boolList.includes("moreViewAs")) {
			const limit = Math.min(back.skill.viewAs.length, back.skill.viewAsCondition.length);
			for (let index = 1; index < limit; index++) {
				back.skill.subSkill[index] = {
					viewAsSubSkill: true,
					result: EditorOrganize.oneSubSkill(
						back,
						index,
						`${back.skill.kind},\n`,
						filter,
						EditorOrganize.viewAs(back, index)
					)
				}
				back.skill.group.push(back.skill.id + "_" + index)
			}
		}
		strParts.push(EditorOrganize.subSkill(back));
		strParts.push(EditorOrganize.group(back));
		strParts.push(EditorOrganize.ending(back));
		let str = strParts.join('')
		str = str.split('\\-skillID').join(back.getID());
		str = str.split('\\skillID').join(`"${back.getID()}"`);
		str = str.replace(/\.undefined/g, "");
		str = correctPunctuation(str)
		str = deleteRepeat(str, /if\(.+?\)/g);
		//
		for (const [number, content] of back.cnSentence.entries()) {
			str = str.split(number).join(`"${content}"`);
		}
		str = str.replace(/\\u([0-9A-Fa-f]{4})/g, (match, ...p) => {
			return String.fromCharCode(parseInt(p[0], 16));
		})
		//tab处理
		str = adjustTab(str, back.skill.mode === 'self' ? 1 : 0);
		back.target.value = str;
		NonameCN.deleteBlank2(back.target);
	}


	back.changableSKillKey = ["variable_content", "variable_filter"]
	back.storeCache = function () {
		if (lib.config.xjb_editorCache) {
			const cache = {
				skill: get.copy(back.skill),
				ele: {}
			};
			for (const key of back.changableSKillKey) {
				delete cache.skill[key];
			}
			const listEle = [
				"id",
				"filter",
				"content",
				"trigger",
				"filterTarget",
				"filterCard"
			]
			for (const itemName of listEle) {
				cache.ele[itemName] = back.ele[itemName].value;
			};
			game.saveConfig("xjb_editorCache", cache)
		}
	}
	back.clearCache = function () {
		lib.config.xjb_editorCache = null;
		game.saveConfig("xjb_editorCache", lib.config.xjb_editorCache)
	}
	back.loadLastCache = function () {
		if (lib.config.xjb_editorCache && typeof lib.config.xjb_editorCache === "object") {
			for (const k in lib.config.xjb_editorCache.ele) {
				back.ele[k].value = lib.config.xjb_editorCache.ele[k];
			};
			for (const k in lib.config.xjb_editorCache.skill) {
				back.skill[k] = lib.config.xjb_editorCache.skill[k];
			}
			back.organize()
		}
	}

	close.addEventListener(DEFAULT_EVENT, () => {
		if (!readCache) return;
		if (lib.config.xjb_editorCache && (typeof lib.config.xjb_editorCache === "object" || lib.config.xjb_editorCache === true)) {
			back.storeCache();
		}
	})



	/**
	 * @param {String} tag 
	 * @param {String} innerHTML 
	 * @param {HTMLElement} father 
	 * @returns {HTMLElement}
	 */
	function newElement(tag, innerHTML = '', father) {
		let h = document.createElement(tag);
		h.innerHTML = innerHTML;
		if (father) father.appendChild(h);
		h.setStyle = function (style) {
			ui.xjb_giveStyle(this, style);
			return this;
		};
		h.style1 = function (style) {
			return this.setStyle({
				height: "1.5em",
				position: 'relative'
			})
		};
		return h;
	}
	/**
	 * @param {HTMLElement} ele 
	 * @param {Function} fn 
	 */
	function listener(ele, fn) {
		ele.addEventListener(DEFAULT_EVENT, fn)
	}
	function newPage() {
		let subBack = newElement('div', '', back).setStyle({
			flexDirection: 'column',
			bottom: '25px',
			fontSize: '1.5em',
			width: 'calc(95% - 50px)',
			height: 'calc(65% + 50px)',
			margin: 'auto',
			position: 'relative',
			display: 'flex',
			"font-family": "xingkai",
			backgroundColor: "rgba(60,65,81,0.7)",
		});
		back.pages.push(subBack)
		if (back.pages.length > 1) subBack.style.display = "none"
		subBack.flexRow = function () {
			ui.xjb_giveStyle(subBack, {
				flexDirection: 'row',
			})
			return this;
		}
		subBack.offBack = function () {
			ui.xjb_giveStyle(subBack, {
				backgroundColor: "",
			})
			return this;
		}
		subBack.onBack = function () {
			ui.xjb_giveStyle(subBack, {
				backgroundColor: "rgba(60,65,81,0.7)",
			})
			return this;
		}
		return subBack;
	}
	function deleteModule(e) {
		const i = this.selectionStart, k = this.selectionEnd;
		if (i === k && i === 0) return;
		if (k > i) return;
		if (e.key !== "Delete" && e.key !== "Backspace") {
			return;
		};
		e.preventDefault();
		const deleteModule = (start, end) => {
			let arr1 = validParenthness(this.value, start, end);
			let over1 = false
			let some1 = arr1.some(ranges => {
				const rangeA = ranges[0], rangeB = ranges[1];
				if (over1 === true) return true;
				if (selectionIsInRange(i, rangeA, true) || selectionIsInRange(i, rangeB, true)) {
					this.value = `${this.value.slice(0, rangeA[0])}${this.value.slice(rangeB[1] + 1)}`;
					this.arrange();
					over1 = true;
					return true;
				}
			})
			return some1
		}
		if (!deleteModule('如果', '那么')
			&& !deleteModule('分支开始', '分支结束')) {
			this.value = `${this.value.slice(0, i - 1)}${this.value.slice(i)}`;
			this.selectionStart = this.selectionEnd = i - 1;
		}
	}
	function adjustSelection(e) {
		let arr = [
			...indexRange(this.value, '如果'),
			...indexRange(this.value, '如果\n'),
			...indexRange(this.value, '那么'),
			...indexRange(this.value, '分支开始'),
			...indexRange(this.value, "分支开始\n"),
			...indexRange(this.value, '分支结束'),
			...indexRange(this.value, '否则')
		]
		const i = this.selectionStart;
		arr.forEach(range => {
			if (selectionIsInRange(i, range)) this.selectionStart = range[1] + 1;
		})
	}
	function addSidebarButton(myTarget, myContainer) {
		const button_arrange = ui.create.xjb_button(myContainer, '整理');
		element().setTarget(button_arrange)
			.listen(DEFAULT_EVENT, e => {
				e.preventDefault();
				myTarget.arrange();
				myTarget.submit();
			})
		const button_clear = ui.create.xjb_button(myContainer, '清空');
		element().setTarget(button_clear)
			.listen(DEFAULT_EVENT, e => {
				e.preventDefault();
				myTarget.value = '';
				myTarget.submit();
			})
		const button_replace = ui.create.xjb_button(myContainer, '替换');
		element().setTarget(button_replace)
			.listen(DEFAULT_EVENT, e => {
				game.xjb_create.multiprompt(function () {
					const searchValue = this.resultList[0];
					const replaceValue = this.resultList[1];
					myTarget.value = myTarget.value.split(searchValue).join(replaceValue);
					myTarget.submit();
				})
					.appendPrompt('替换什么', void 0, '这里写替换的文字,不支持正则!')
					.appendPrompt('替换为', void 0, '这里替换后的文字')
			})
		const button_thisIdWithQuotes = ui.create.xjb_button(myContainer, '"本技能ID"');
		element().setTarget(button_thisIdWithQuotes)
			.listen(DEFAULT_EVENT, e => {
				e.preventDefault()
				const start = myTarget.selectionStart;
				const end = myTarget.selectionEnd;
				const content = myTarget.value;
				const id = `"` + back.getID() + `"`
				myTarget.value = content.slice(0, start) + id + content.slice(end);
				myTarget.selectionStart = myTarget.selectionEnd = start + id.length
				myTarget.submit();
			})
		const button_giveSentence = ui.create.xjb_button(myContainer, '查询语句')
		element().setTarget(button_giveSentence)
			.listen(DEFAULT_EVENT, e => {
				EditorInteraction.GivenSentenceDialog(myTarget);
			})
	}
	/**
	 * @type {HTMLElement}
	 */
	const buttonContainer = element("div")
		.style({
			height: '1.5em',
			position: 'relative'
		})
		.exit()
	const h1 = newElement('h1', '', back).setStyle({
		width: '90%'
	});
	const h1Title = element("span")
		.father(h1)
		.innerHTML(`魂氏技能编辑器
			<span class="xjb-weakHidden xjb-pointer" style=font-size:0.7em>📓</span>
			<span class="xjb-weakHidden xjb-pointer" style=font-size:0.7em>⚙️</span>
			<span class="xjb-weakHidden xjb-pointer" style=font-size:0.7em>🆕</span>
		`)
		.addClass("hover-showChildren")
		.listen(DEFAULT_EVENT, async e => {
			if (e.target.innerText === "📓") {
				if (lib.config.xjb_editorCache) {
					await game.xjb_create.promise.alert("你已经处于缓存状态中！");
					return;
				}
				const { bool } = await game.xjb_create.promise.confirm("是否缓存？当你关闭时自动保存数据，这些数据将保存至你复制此技能时。");
				if (bool) {
					lib.config.xjb_editorCache = true;
				}
			} else if (e.target.innerText === "⚙️") {
				if (!lib.config.xjb_editorConfig) lib.config.xjb_editorConfig = {}
				const { result, bool, changedItems } = await game.xjb_create.promise.setConfig(
					"技能编辑器目前配置如下，可以进行修改。",
					{
						"autoCache": "自动缓存"
					},
					lib.config.xjb_editorConfig
				);
				if (bool) {
					game.saveConfig("xjb_editorConfig", result);
					if (changedItems.includes("autoCache") && result.autoCache === true && !lib.config.xjb_editorCache) {
						lib.config.xjb_editorCache = true;
					}
				}
			} else if (e.target.innerText === "🆕") {
				const { bool } = await game.xjb_create.promise.alert("是否重置编辑器并开启一个新的技能？");
				if (bool) {
					if (lib.config.xjb_editorCache) lib.config.xjb_editorCache = true;
					game.xjb_skillEditor();
				}
			}
		})
		.exit();
	//换页功能
	//切换至下一页
	const next = newElement('span', '下一页', h1).setStyle({
		float: 'right'
	});
	back.ele.nextPage = next;
	function turnNextPage() {
		if (back.pageNum < back.pages.length - 1) back.pageNum++
		else back.pageNum = 0
		back.pages.forEach((i, k) => {
			i.style.display = back.pageNum == k ? 'flex' : 'none'
		})
	}
	element().setTarget(next)
		.listen(DEFAULT_EVENT, turnNextPage)
		.shortCut('n')
	//切换至上一页
	const last = newElement('span', '上一页', h1).setStyle({
		float: 'right',
		marginRight: '10px'
	})
	back.ele.lastPage = last
	function turnLastPage() {
		back.pageNum--
		if (back.pageNum < 0) back.pageNum = back.pages.length - 1
		back.pages.forEach((i, k) => {
			i.style.display = back.pageNum == k ? 'flex' : 'none'
		})
	}
	element().setTarget(last)
		.listen(DEFAULT_EVENT, turnLastPage)
		.shortCut('l');


	//第一页
	let subBack = newPage()
	let idSeter = newElement('div', '技能id:', subBack).style1();
	let idFree = newElement('textarea', '', subBack).setStyle({
		fontSize: '1em',
		height: '1em',
		width: '50%',
		position: 'relative',
	})
	back.ele.id = idFree;
	idFree.submit = function (e) {
		try {
			NonameCN.GenerateEditorError(
				`"${idFree.value}"不是合法id`,
				[
					...JavascriptGlobalVariable,
					'player', 'target', 'event',
					'result', 'trigger', 'card',
					'cards', 'targets',
					...JavascriptUsualType,
					...JavascriptKeywords
				].includes(idFree.value)
				|| bannedKeyWords.some(i => idFree.value.includes(i))
			);
			if (idFree.value.includes("\n")) idFree.value = '';
			back.skill.id = idFree.value;
			back.organize();
		}
		catch (err) {
			idFree.value = '';
			game.xjb_create.alert('警告:' + err);
		}
	}
	idFree.addEventListener('keyup', idFree.submit);
	//
	let kindSeter = newElement('div', '技能种类:', subBack).style1();
	let kindFree = element()
		.clone(buttonContainer)
		.father(subBack)
		.exit()
	back.ele.kinds = kindFree.children
	const generateKindsButton = (parentNode) => {
		const skillCategories = {
			'触发类': 'trigger',
			'出牌阶段类': 'enable:"phaseUse"',
			'使用类': 'enable:"chooseToUse"',
			'打出类': 'enable:"chooseToRespond"',
			'使用打出类': 'enable:["chooseToUse","chooseToRespond"]'
		};
		for (const [category, kind] of Object.entries(skillCategories)) {
			// 这是创建一个button,设置技能的类别;
			const button = ui.create.xjb_button(parentNode, category);
			ui.xjb_giveStyle(button, {
				fontSize: '1em'
			});
			button.kind = kind;
			listener(button, e => {
				if (button.computedStyleMap().get("opacity") <= 0.1) return;
				back.skill.kind = button.kind;
				for (const child of button.parentElement.children) {
					child.unchosen();
					if (child.kind === back.skill.kind) {
						child.chosen();
					}
				}
				back.organize();
			});
		}
	}
	generateKindsButton(kindFree)
	/**
	 * @param {Array<string>} list1 
	 * @returns {Array<string>}
	 */
	function xjb_formatting(list1) {
		if (list1.length > 5) {
			let t = Math.floor((list1.length - 5) / 4)
			list1.splice(5, 0, ">>>", "<<<")
			for (let i = 0; i < t; i++) {
				list1.splice(7 + 4 * (i + 1) + 2 * i, 0, ">>>", "<<<")
			}
		}
		return list1
	}
	//
	const typeSeter = newElement('div', '技能标签:', subBack).style1();
	const typeFree = element()
		.clone(buttonContainer)
		.father(subBack)
		.addClass("xjb-ED-skillTag-Container")
		.exit()
	back.ele.types = typeFree.children;
	const TAG_TYPE_LIST = {
		"发动": [
			["forced", "强制发动"],
			["frequent", "自动发动"],
			["direct", "直接发动"],
			["forceDie", "死亡可发动"],
			["usable-1", "每回合一次"],
			["round-1", "每轮一次"]
		],
		"防封印": [
			["locked", "锁定技"],
			["locked-false", "非锁定技"],
			["persevereSkill", "持恒技"],
			["charlotte", "Charlotte"],
			["superCharlotte", "superCharlotte"],
		],
		"限定": [
			["limited", "限定技"],
			["juexingji", "觉醒技"],
			["dutySkill", "使命技"],
			["skillAnimation", "技能动画"]
		],
		"标签": [
			["zhuSkill", "主公技"],
			["zhuanhuanji", "转换技"],
			["hiddenSkill", "隐匿技"],
			["clanSkill", "宗族技"],
			["groupSkill", "势力技"],
			["sunbenSkill", "昂扬技"],
			["chargeSkill", "蓄力技"],
		],
		"国战": [
			["zhenfa", "阵法技"],
			["mainSkill", "主将技"],
			["viceSkill", "副将技"],
			["preHidden", "技能预亮"]
		],
		"选角色": [
			["deadTarget", "死亡角色可选"],
			["includeOut", "离场角色可选"],
			["multitarget", "多名角色"],
			["complexTarget", "复合选角色"]
		],
		"选牌": [
			["lose-false", "不失去牌"],
			["discard-false", "不弃置牌"],
			["complexCard", "复合选卡牌"],
		],
		"其他": [
			["mark", "标记持续显示"],
			["multiline", "多指示线"],
			['firstDo', '最先触发'],
			["lastDo", "最后触发"]
		],
		"自定义": [
			["usable-n", "每回合限n次"],
			["round-n", "每n轮限一次"],
		],
	};
	(() => {
		const entriesObj = Object.entries(TAG_TYPE_LIST)
		for (const [index, [innerHTML, tagArray]] of entriesObj.entries()) {
			const relatedNode = [];
			if (index !== 0) {
				relatedNode.push(ui.create.xjb_button(typeFree, "<<<"));
			}
			for (const [tagEn, tagCn] of tagArray) {
				const node = ui.create.xjb_button(typeFree, tagCn)
				ui.xjb_giveStyle(node, { margin: "auto" })
				node.type = tagEn;
				relatedNode.push(node);
			}
			if (index !== entriesObj.length - 1) {
				relatedNode.push(ui.create.xjb_button(typeFree, ">>>"))
			}
			else {
				relatedNode.push(ui.create.xjb_button(typeFree, "重置"))
				relatedNode.slice(-1)[0].diyTagNodes = relatedNode.slice(1, -1)
			}
			if (index !== 0) {
				relatedNode.forEach(node => ui.xjb_hideElement(node))
			}
			const changePageNode = element("div")
				.father(typeSeter)
				.innerHTML(innerHTML)
				.className("xjb_brightButton")
				.setKey("relatedNode", relatedNode)
				.exit();
			relatedNode.at(0).loyalTo = changePageNode;
			relatedNode.slice(-1)[0].loyalTo = changePageNode;
		}
	})();
	element().setTarget(typeSeter)
		.listen(DEFAULT_EVENT, e => {
			if (!e.target.relatedNode) return;
			const target = e.target;
			[...back.ele.types].forEach(node => {
				if (!target.relatedNode.includes(node)) ui.xjb_hideElement(node)
				else ui.xjb_showElement(node);
			})
			return;
		})
	listener(typeFree, e => {
		let list = Array.from(typeFree.children)
		if (!list.includes(e.target)) return;
		if (e.target.innerText.includes('<<<')) {
			element().setTarget(e.target.loyalTo.previousElementSibling)
				.clickAndTouch()
			return;
		}
		if (e.target.innerText.includes('>>>')) {
			element().setTarget(e.target.loyalTo.nextElementSibling)
				.clickAndTouch()
			return;
		}
		if (["每回合限n次", "每n轮限一次"].includes(e.target.innerText)) {
			const node = e.target
			game.xjb_create.range(e.target.innerText, 1, 20, 1, function () {
				node.innerText = node.innerText.replace("n", this.result);
				node.type = node.type.replace(/\bn\b/, this.result);
				back.skill.type.push(node.type);
				back.organize();
			})
			return;
		}
		if (e.target.innerText === "重置") {
			e.target.diyTagNodes.forEach(node => {
				back.skill.type.remove(node.type);
				node.innerText = node.innerText.replace(/\d+/, "n");
				node.type = node.type.replace(/\d+/, "n");
			});
			back.organize();
			return;
		}
		if (back.skill.type.includes(e.target.type)) {
			back.skill.type.remove(e.target.type);
			e.target.style.backgroundColor = "#e4d5b7";
		} else {
			e.target.style.backgroundColor = "red";
			back.skill.type.push(e.target.type);
		};
		back.organize();
	});
	let groupSeter = newElement('div', '特殊设置:', subBack).style1()
	let groupFree = element()
		.clone(buttonContainer)
		.father(subBack)
		.addClass("xjb-ED-uniqueSetting-Container")
		.setKey("groupsPageNum", 0)
		.exit()
	back.ele.groupsContainer = groupFree;
	back.ele.groups = groupFree.children;
	listener(groupFree, e => {
		let list = Array.from(groupFree.children)
		if (!list.includes(e.target)) return;
		if (e.target.innerText.includes('>>>')) {
			const a = list.indexOf(e.target) + 1;
			let b = Math.min((a + 5), (list.length - 1));
			list.splice(a, (b - a + 1)).forEach(ele => ui.xjb_showElement(ele))
			list.forEach(ele => ui.xjb_hideElement(ele));
			groupFree.groupsPageNum++;
			return;
		}
		if (e.target.innerText.includes('<<<')) {
			const a = list.indexOf(e.target) - 1;
			let b = Math.max(0, (a - 5));
			list.splice(b, (a - b + 1)).forEach(ele => ui.xjb_showElement(ele))
			list.forEach(ele => ui.xjb_hideElement(ele));
			groupFree.groupsPageNum--;
			return;
		}
		let attr = e.target.getAttribute('data-attr');
		if (back.skill.uniqueList.includes(attr)) {
			back.skill.uniqueList.remove(attr);
			e.target.style.backgroundColor = "#e4d5b7";
		} else {
			let prefix = whichPrefix(attr, ["group", "mainVice", "animation", 'clan'])
			findPrefix(back.skill.uniqueList, prefix).forEach(k => {
				back.skill.uniqueList.remove(k);
				let ele = groupFree.querySelector(`[data-attr="${k}"]`)
				if (ele !== null) ele.style.backgroundColor = "#e4d5b7";
			});
			back.skill.uniqueList.push(attr);
			e.target.style.backgroundColor = "red";
		}
		back.organize();
	});
	groupFree.update = function () {
		const pageNum = groupFree.groupsPageNum;
		groupFree.groupsPageNum = 0;
		function groupFreeChange() {
			//先移除所有元素
			element().setTarget(groupFree)
				.removeAllChildren();
			let mapList = {};
			if (back.skill.type.includes("mainSkill") || back.skill.type.includes("viceSkill")) {
				mapList = Object.assign(mapList, {
					"mainVice-remove1": "阴阳鱼减半个"
				})
			}
			if (back.skill.type.includes("groupSkill")) {
				[...lib.group, "key", "western"].forEach(group => {
					mapList["group-" + group] = lib.translate[group] + "势力"
				})
			}
			if (back.skill.type.includes("skillAnimation")) {
				mapList = Object.assign(mapList, {
					"animation-fire": "燎原动画",
					"animation-wood": "绿茵动画",
					"animation-water": "清波动画",
					"animation-thunder": "紫电动画",
					"animation-orange": "柑橘动画",
					"animation-metal": "素金动画",
				})
			}
			if (back.skill.type.includes("clanSkill")) {
				mapList = Object.assign(mapList, {
					"clan-陈留吴氏": "陈留吴氏",
					"clan-颍川荀氏": "颍川荀氏",
					"clan-颍川韩氏": "颍川韩氏",
					"clan-太原王氏": "太原王氏",
					"clan-颍川钟氏": "颍川钟氏"
				})
			}
			let list = xjb_formatting(Object.values(mapList));
			let list1 = xjb_formatting(Object.keys(mapList));
			list.forEach((i, k) => {
				const en = list1[k];
				let it = ui.create.xjb_button(groupFree, i);
				element().setTarget(it)
					.hook(ele => {
						if (k >= 6) ui.xjb_hideElement(ele)
					}).
					setAttribute('data-attr', en);
				if (back.skill.uniqueList.includes(en)) it.style.backgroundColor = "red";
			});
			return list.length;
		}
		if (groupFreeChange()) {
			element().setTarget(groupSeter)
				.setStyle("display", "inline-block")
				.setTarget(groupFree)
				.setStyle("display", "inline-block")
		} else {
			element().setTarget(groupSeter)
				.setStyle("display", "none")
				.setTarget(groupFree)
				.setStyle("display", "none")
		};
		while (groupFree.groupsPageNum !== pageNum) {
			/**
			 * @type {HTMLElement}
			 */
			let target = Array.from(groupFree.querySelectorAll(':not(.xjb_hidden)')).slice(-1)[0];
			if (target && target.innerText.includes('>>>')) {
				target.click();
				target.dispatchEvent(touchE);
			} else break;
		}
	}
	groupFree.update();
	//编辑模式选择
	let modeSeter = newElement('div', '编写位置:', subBack).style1()
	let modeFree = element()
		.clone(buttonContainer)
		.father(subBack)
		.exit()
	back.ele.modes = modeFree.children;
	; (() => {
		let list = ['本体自带编写器', 'mt管理器', '主代码'];
		let list1 = ['self', 'mt', 'mainCode']
		list.forEach((i, k) => {
			let it = ui.create.xjb_button(modeFree, i)
			ui.xjb_giveStyle(it, {
				fontSize: '1em'
			})
			it.mode = list1[k]
			listener(it, e => {
				back.skill.mode = it.mode
				Array.from(it.parentElement.children).forEach(t => {
					t.style.backgroundColor = "#e4d5b7"
					if (t.mode == back.skill.mode) t.style.backgroundColor = 'red'
				})
				back.organize()
			})
		})
	})()
	//第二页
	let subBack2 = newPage().flexRow().offBack();
	let filterSeter = newElement('div', '<b><font color="red">发动条件</font></b>')
		.style1()
		.setStyle({
			marginTop: "15px",
			fontSize: '1.5em'
		})
	const filterContainer1 = element('div')
		.father(subBack2)
		.child(filterSeter)
		.flexColumn()
		.style({
			flex: 2,
			position: 'relative',
			'backgroundColor': 'rgba(60,65,81,0.7)'
		})
		.exit()
	const filterFreeContainer = element("div")
		.father(filterContainer1)
		.block()
		.setStyle("position", "relative")
		.exit();
	const filterFree = element('textarea')
		.father(filterFreeContainer)
		.setKey("toPart", "filter")
		.exit();
	const filterContainer2 = element('div')
		.father(subBack2)
		.flexColumn()
		.style({
			flex: 1,
			position: 'relative',
			'backgroundColor': 'rgba(63,65,81,0.9)'
		})
		.exit();
	addSidebarButton(filterFree, filterContainer2, 'filter')
	back.ele.filter = filterFree;
	filterFree.changeWord = function (replaced, replacer) {
		this.value = this.value.replace(replaced, replacer)
		return true
	}
	filterFree.arrange = function () {
		const that = filterFree;
		/**
		* @param {string} appendWord 
		* @param {string[]} every 
		*/
		function appendWordToEvery(appendWord, every) {
			every.forEach(i => {
				that.changeWord(new RegExp(i, 'g'), i + appendWord);
			});
		}
		//
		that.changeWord(/【([\u4e00-\u9fa5]+)】/g, function (match, ...p) {
			return p[0];
		})
		//处理变量词
		EditorArrange.standardBoolExp(that)
		NonameCN.underlieVariable(that)
		//处理角色相关字符
		playerCN.forEach(i => {
			that.changeWord(new RegExp(i + '(的|于|在)回合外', 'g'), i + '不为当前回合角色')
			that.changeWord(new RegExp(i + '的', 'g'), i)
		});
		appendWordToEvery(' ', playerCN);
		that.changeWord(/体力(?!上限|值)/g, '体力值');
		that.changeWord(/(?<=触发事件)(?!的)/g, ' ');
		appendWordToEvery(' ', ["体力值", "体力上限", "手牌数"]);
		//处理game相关字符
		that.changeWord(/游戏轮数/g, '游戏 轮数')
		/*统一写法*/
		EditorArrange.transCnCalculation(that);
		that.changeWord(/该回合/g, "本回合")
		//处理一些特殊属性
		that.changeWord(/([火雷冰])杀/g, '$1属性杀')
		that.changeWord(/([红黑])杀/g, '$1色杀')
		that.changeWord(/([火雷冰]属性)/g, ' $1 ')
		that.changeWord(/(?<!有)([红黑]色)/g, ' $1 ')
		that.changeWord(/(?<!有)(红桃|方片|梅花|黑桃|无花色)/g, ' $1 ')
		that.changeWord(/(武器牌|防具牌|\+1马牌|\-1马牌|宝物牌)/g, ' $1 ')
		EditorArrange.makeOccupyLine(that, ["并且", "或者"])
		that.adjustTab();
		NonameCN.deleteBlank2(that);
	}
	back.ele.filter.submit = function (e) {
		const _this = this
		back.skill.filter = [];
		filterFree.inherit();
		const implicitText = ImplicitTextTool.filter(filterFree.value);
		const list = dispose(implicitText, void 0, NonameCN.FilterList);
		const redispose = NonameCN.replace(list.join('\n')).map(t => {
			let result = t.replace(/\btrigger\b/g, 'event');
			return result;
		});
		back.skill.filter.push(...redispose);
		back.organize();
	}
	back.ele.filter.inherit = function () {
		// 继承指令
		const inheritLine = filterFree.value.match(/继承.+\n/);
		if (!inheritLine || inheritLine[0].trim() === '继承') return;
		const skillId = inheritLine[0].replace('继承', '').trim();
		const skill = lib.skill[skillId];
		if (!skill || !skill.filter) {
			filterFree.changeWord(/继承.+\n/, "");
			return;
		};
		let filterCode = skill.filter.toString();
		filterCode = filterCode.replace(/\s\s+/g, '\n');
		filterCode = filterCode.slice(filterCode.indexOf('{') + 2, -1);
		filterCode = filterCode.replace(/\s\s+/g, '\n');
		filterCode = filterCode.replace(new RegExp(skillId, 'g'), back.skill.id);
		back.returnIgnore = true;
		filterFree.changeWord(/继承.+\n/, filterCode);
		filterFree.value = `/*back.returnIgnore=true*/\n${filterFree.value}`;
		filterFree.adjustTab();
	};
	back.ele.filter.adjustTab = function () {
		const that = back.ele.filter;
		that.changeWord(/\t/g, '')
		that.value = adjustTab(that.value, 0, '分支开始', '分支结束')
		that.value = adjustTab(that.value, 0, '如果', '那么', true)
		that.value = adjustTab(that.value, 0, '{', '}', true)
	}
	listenAttributeChange(filterFree, 'selectionStart').start();
	textareaTool().setTarget(filterFree)
		.replaceThenOrder(/新变量[区域]/g, '#变量区头\n\n#变量区尾', () => { back.hasVariableArea = true })
		.replaceThenOrder(/(?<![/][*])[ ]*back.returnIgnore[ ]*\=[ ]*true[ ]*(?![*][/])/g, "/*back.returnIgnore=true*/", () => { back.returnIgnore = true })
		.clearThenOrder(/([/][*])[ ]*back.returnIgnore[ ]*\=false[ ]*[ ]*([*][/])/g, () => { back.returnIgnore = false })
		.debounce('keyup', back.ele.filter.submit, 200)
		.listen('keydown', deleteModule)
		.listen('selectionStartChange', adjustSelection)
		.style({
			height: '11em',
			fontSize: '0.75em',
			width: '85%',
			tabSize: '2',
		})
		.placeholder(
			'举例说明\n'
			+ '例如:有一个技能的发动条件是:你的体力值大于3\n'
			+ '就在框框中写:\n'
			+ '你体力值大于3\n'
			+ '每写完一个效果，就提行写下一个效果\n'
			+ "最后输入整理即可\n"
		);
	EditorInteraction.addFootButton(filterContainer1, filterFree);
	//第三页
	let subBack3 = newPage().flexRow().offBack();
	let contentSeter = newElement('div', '<b><font color=red>技能效果')
		.style1()
		.setStyle({
			marginTop: "15px",
			fontSize: '1.5em'
		})
	const content_chooseMode = element()
		.setTarget(ui.create.xjb_button(contentSeter, "选择模式"))
		.setStyle("fontSize", "0.6em")
		.exit()
	const contentContainer1 = element('div')
		.father(subBack3)
		.child(contentSeter)
		.flexColumn()
		.style({
			flex: 2,
			position: 'relative',
			'backgroundColor': 'rgba(63,65,81,0.9)'
		})
		.exit()
	const contentFreeContainer = element("div")
		.father(contentContainer1)
		.block()
		.setStyle("position", "relative")
		.exit();
	const contentFree = element('textarea')
		.father(contentFreeContainer)
		.setKey("toPart", "content")
		.exit()
	const contentContainer2 = element('div')
		.father(subBack3)
		.flexColumn()
		.style({
			flex: 1,
			position: 'relative',
			'backgroundColor': 'rgba(60,65,81,0.7)'
		})
		.exit()
	const contentContainer3 = element("div")
		.father(subBack3)
		.flexColumn()
		.style({
			flex: 1,
			position: 'relative',
			'backgroundColor': 'rgba(60,65,81,0.7)'
		})
		.addClass("xjb-Ed-contentChoiceContainer")
		.hook(ele => ui.xjb_hideElement(ele))
		.exit()
	choiceMode.init(contentContainer3)
	addSidebarButton(contentFree, contentContainer2, "content")
	content_chooseMode.addEventListener(lib.config.touchscreen ? "touchend" : "click", function () {
		contentContainer2.classList.toggle("xjb_hidden");
		contentContainer3.classList.toggle("xjb_hidden");
		this.classList.toggle("xjb-chosen");
		if (navigator.userAgent.includes("Android")) {
			back.classList.toggle("xjb-chooseMode");
		}
	})
	back.ele.content = contentFree;
	contentFree.changeWord = function (replaced, replacer) {
		this.value = this.value.replace(replaced, typeof replacer === 'function' ? replacer : '' + replacer)
		return true
	};
	contentFree.arrange = function () {
		const that = contentFree;
		EditorArrange.standardEffect0(that);
		//这部分用不可能出现的字符替换,然后再替换回来
		const pureEnList = [], strings = [[], [], [], []];
		that.changeWord(/(?<=').+?(?=')/g, match => {
			strings[0].push(match);
			return "*&dy".repeat(3)
		});
		that.changeWord(/(?<=").+?(?=")/g, match => {
			strings[1].push(match);
			return "*&sy".repeat(3)
		});
		that.changeWord(/(?<=`).+?(?=`)/g, match => {
			strings[2].push(match);
			return "*&fy".repeat(3)
		});
		that.changeWord(/^[^\u4e00-\u9fa5]+$/mg, match => {
			pureEnList.push(match)
			return "-&".repeat(6)
		})
		//
		that.changeWord(/【([\u4e00-\u9fa5]+)】/g, '$1');
		NonameCN.standardShort(that);
		EditorArrange.standardBoolExp(that);
		NonameCN.standardModBefore(that);
		EditorArrange.standardEffect1(that);
		NonameCN.underlieVariable(that);
		//处理player相关字符
		that.changeWord(new RegExp(`由(${JOINED_PLAYAERCN})造成的`, 'g'), `$1`);
		that.changeWord(new RegExp(`对(${JOINED_PLAYAERCN})造成伤害的牌`, 'g'), "造成伤害的牌");
		that.changeWord(new RegExp(`(${JOINED_PLAYAERCN})的`, 'g'), '$1');
		["体力值", "体力上限", "手牌数"].forEach(i => {
			that.changeWord(new RegExp(i, 'g'), i + ' ');
		});
		//处理事件有关字符
		NonameCN.standardEvent(that);
		NonameCN.standardEeffectMid(that);
		//数字参数处理
		EditorArrange.makeNumToEnd(that);
		//统一写法
		EditorArrange.transCnCalculation(that);
		EditorArrange.makeOtherToEnd(that);
		EditorArrange.makeWordsToEnd(that, ['魏势力', '蜀势力', '吴势力', '群势力', '晋势力', '神势力'])
		EditorArrange.makeWordsToEnd(that, ["火属性", "冰属性", "雷属性"])
		EditorArrange.makeWordsToEnd(that, ["任意张", "任意名", "从牌堆底"])
		EditorArrange.makeWordsToEnd(that, ["至多", "至少"])
		that.value = eachLine(contentFree.value, line => {
			if (line.startsWith("返回")) return;
			if (/[ ]访[ ]/.test(line)) return;
			if (/(变量|常量|块变|令为)/.test(line)) return;
			if (NonameCN.skillModMap.keys().some(regexp => regexp.test(line))) return;
			const startsWithAwait = /^\s*等待 /.test(line)
			if (startsWithAwait) line = line.slice(3)
			let group = findWordsGroup(line, playerCN, "!的");
			if (!group.length) return;
			//如果每个次都能成功翻译 则不进行次序调换
			if (line.split(" ").every(word => /^[\x00-\x7F]*$/.test(TransCnText.translate(word, NonameCN.ContentList)))) return;
			// if (/^选择结果目标组/.test(line)) return;
			let restWords = clearWordsGroup(line, playerCN, "!的");
			return `${startsWithAwait ? "等待 " : ""}${group.shift()} ${restWords} ${group.join(" ")}`
		})
		NonameCN.standardEeffect(that);
		NonameCN.standardEvent(that);
		EditorArrange.makeOccupyLine(that, ["并且", "或者"])
		//这里就是上文说的替换回来
		pureEnList.forEach(words => {
			that.changeWord("-&".repeat(6), words);
		})
		strings[0].forEach(words => {
			that.changeWord("*&dy".repeat(3), words);
		})
		strings[1].forEach(words => {
			that.changeWord("*&sy".repeat(3), words);
		})
		strings[2].forEach(words => {
			that.changeWord("*&fy".repeat(3), words);
		})
		that.adjustTab();
		NonameCN.deleteBlank(that);
	}
	contentFree.zeroise = function () {
		this.value = "";
	}
	contentFree.getID = function () {
		return back.getID();
	}
	contentFree.toLastLine = function (step = 1) {
		const lengthes = this.value.slice(0, this.selectionStart).split("\n").map(word => word.length);
		for (let i = 0; i < step; i++) {
			let length = lengthes.pop() + 1;
			this.selectionStart -= length;
			this.selectionEnd = this.selectionStart;
		}
	}
	back.ele.content.adjustTab = function () {
		const that = back.ele.content;
		that.changeWord(/\t/g, '');
		that.value = adjustTab(that.value, 0, '分支开始', '分支结束');
		that.value = adjustTab(that.value, 0, '如果', '那么', true);
		that.value = adjustTab(that.value, 0, '函数开始', '函数结束', true);
		that.value = adjustTab(that.value, 0, '{', '}', true);
	}
	back.ele.content.inherit = function () {
		let wonderfulInherit = (contentFree.value.match(/继承.+\n/) && contentFree.value.match(/继承.+\n/)[0]) || '';
		if (wonderfulInherit && wonderfulInherit != '继承') {
			let preSkill = '';
			//获取继承的技能的id                   
			wonderfulInherit = wonderfulInherit.replace(/继承/, '');
			wonderfulInherit = wonderfulInherit.replace(/\n/, '');
			//获取继承的技能的content并处理                    
			if (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content) preSkill = wonderfulInherit;
			wonderfulInherit = (lib.skill[wonderfulInherit] && lib.skill[wonderfulInherit].content && lib.skill[wonderfulInherit].content.toString()) || ''
			if (wonderfulInherit.includes('async content')) back.skill.contentAsync = true
			/*清除空格*/
			wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
			/*截取函数*/
			wonderfulInherit = wonderfulInherit.slice((wonderfulInherit.indexOf('{') + 2), -1)
			wonderfulInherit = wonderfulInherit.replace(/\s\s+/g, '\n')
			wonderfulInherit = wonderfulInherit.replace(new RegExp(preSkill, 'g'), back.skill.id)
			contentFree.changeWord(/继承.+\n/, wonderfulInherit);
			contentFree.value = `${back.skill.contentAsync ? "/*back.skill.contentAsync=true*/\n" : ""
				}/*back.ContentInherit = true*/\n${contentFree.value}`
			back.ContentInherit = true;
			contentFree.adjustTab();
		}
	}
	back.ele.content.submit = function (bool = false) {
		//清空content数组
		back.skill.content = []
		//数组为空则返回
		back.ele.content.inherit();
		if (contentFree.value.length === 0) {
			if (bool !== true) back.organize()
			return;
		}
		const implicitText = ImplicitTextTool.content(contentFree.value);
		const list = dispose(implicitText, void 0, NonameCN.ContentList)
		const redispose = NonameCN.replace(list.join('\n'))
		back.skill.content.push(...redispose);
		if (bool !== true) back.organize()
	}
	listenAttributeChange(contentFree, 'selectionStart').start();
	EditorInteraction.addContentOrder_setting(contentFree);
	EditorInteraction.addContentOrder_area(contentFree);
	EditorInteraction.whenChangeLineHas_content(contentFree);
	textareaTool().setTarget(contentFree)
		.replaceThenOrder('新选择如果', "如果\n有选择结果\n那么\n分支开始\n\n分支结束", back.ele.content.adjustTab)
		.replaceThenOrder('新选择角色', '变量 选择事件 令为 你 选择角色 一名\n选择事件 设置角色限制条件\n选择事件 设置角色选择数量\n新步骤\n如果\n选择结果布尔\n那么\n分支开始\n\n分支结束', back.ele.content.adjustTab)
		.replaceThenOrder('新选择选项', '变量 选项列表 令为 数组开始 %#&1 , %#&2  数组结束\n变量 选择事件 令为 你 选择选项 选项列表\n新步骤\n如果\n选择结果选项 为 %#&1\n那么\n分支开始\n\n分支结束\n如果\n选择结果选项 为 %#&2\n那么\n分支开始\n\n分支结束\n', back.ele.content.adjustTab)
		.replaceThenOrder('新拼点事件', '变量 选择事件 令为 你 拼点 目标\n新步骤\n如果\n拼点赢\n那么\n分支开始\n\n分支结束\n如果\n拼点平局\n那么\n分支开始\n\n分支结束\n如果\n拼点输\n那么\n分支开始\n\n分支结束', back.ele.content.adjustTab)
		.replaceThenOrder("新花色判定", '变量 判定事件 令为 你 进行判定\n新步骤\n分岔 ( 判定结果的花色 )\n分支开始\n情况 红桃 :\n分支开始\n\n分支结束\n打断\n情况 方片 :\n分支开始\n\n分支结束\n打断\n情况 黑桃 :\n分支开始\n\n分支结束\n打断\n情况 梅花 :\n分支开始\n\n分支结束\n打断\n分支结束', back.ele.content.adjustTab)
		.replaceThenOrder("新颜色判定", '变量 判定事件 令为 你 进行判定\n新步骤\n如果\n判定结果的颜色 为 红色\n那么\n分支开始\n\n分支结束\n否则\n分支开始\n\n分支结束', back.ele.content.adjustTab)
		.replaceThenOrder("新牌名判定", '变量 判定事件 令为 你 进行判定\n新步骤\n如果\n判定结果的牌名 为 桃\n那么\n分支开始\n\n分支结束\n否则\n分支开始\n\n分支结束', back.ele.content.adjustTab)
		.replaceThenOrder(
			'新选择发动',
			'#选择发动区头\n异步 函数 (事件,触发,角色)  函数开始\n变量 选择事件 令为 你 $herePlaceTheCostWhatYouChosen\n变量 结果 令为 等待 选择事件 获取事件结果\n事件的结果 令为 {布尔:选择结果的布尔,花费的数据:{...结果}}\n函数结束\n#选择发动区尾\n',
			() => {
				back.ele.content.adjustTab();
				const list = [
					"选择牌",
					"选择弃置牌",
					"选择弃置手牌",
					"选择角色"
				];
				game.xjb_create.chooseAnswer(
					"选择发动技能的花费",
					list,
					true,
					function () {
						back.ele.content.value = back.ele.content.value.replace("$herePlaceTheCostWhatYouChosen", list[this.resultIndex]);
						back.ele.content.arrange();
						back.ele.content.submit();
					}
				);
			}
		)
		.addClass("xjb-Ed-contentTextarea")
		.debounce('keyup', back.ele.content.submit, 200)
		.listen('keydown', deleteModule)
		.listen('selectionStartChange', adjustSelection)
		.style({
			height: '11em',
			fontSize: '0.75em',
			width: '85%',
			tabSize: '2',
		})
		.placeholder(
			'举例说明\n'
			+ '例如:技能的一个效果是:你摸三张牌\n'
			+ '就在框框中写:\n'
			+ '你摸三张牌\n'
			+ '每写完一个效果，就提行写下一个效果\n'
			+ '最后输入整理即可'
		);
	EditorInteraction.addFootButton(contentContainer1, contentFree);
	//第五页
	let subBack5 = newPage();

	const kindSettingPage = element('div')
		.father(subBack5)
		.setStyle()
		.addClass("ED-kindSwitchPage")
		.exit();
	const oepnClose = element("div")
		.father(kindSettingPage)
		.innerHTML("-")
		.setStyle("border", "2px solid black")
		.setStyle("float", "right")
		.setStyle("position", "relative")
		.setStyle("z-index", "2")
		.addClass("xjb-pointer")
		.block()
		.listen(DEFAULT_EVENT, (e) => {
			if (e.target.innerHTML === "-") kindSettingPage.hide()
			else if (e.target.innerHTML === "+") kindSettingPage.show()
		})
		.exit();
	const switchKindTitle = element("div")
		.father(kindSettingPage)
		.innerHTML("请选择一个技能种类")
		.block()
		.setStyle("position", "relative")
		.exit();
	const switchKind = element("div")
		.father(kindSettingPage)
		.setStyle("position", "relative")
		.exit();
	generateKindsButton(switchKind);
	kindSettingPage.hide = function () {
		ui.xjb_hideElement(switchKind)
		ui.xjb_hideElement(switchKindTitle)
		kindSettingPage.style.width = 0;
		oepnClose.innerHTML = "+"
	};
	kindSettingPage.show = function () {
		kindSettingPage.style.width = "100%";
		setTimeout(() => {
			ui.xjb_showElement(switchKind)
			ui.xjb_showElement(switchKindTitle)
		}, 300)
		oepnClose.innerHTML = "-"
	}
	back.ele.switchKindContainer = kindSettingPage;
	back.ele.switchKinds = switchKind.children;

	let triggerAdd = (who, en) => {
		back.trigger.push(who);
		who.style.display = 'none';
	}
	let triggerSeter = newElement('div', '<b><font color=red>触发时机</font></b>')
		.style1()
		.setStyle({
			display: "block",
			marginTop: "15px",
			position: "relative",
			fontSize: '1.5em'
		})
	const triggerFree = newElement('textarea', '')
	const triggerPage = element('div')
		.father(subBack5)
		.flexRow()
		.height("100%")
		.width("100%")
		.exit()
	const triggerContainer1 = element('div')
		.father(triggerPage)
		.child(triggerSeter)
		.child(triggerFree)
		.flexColumn()
		.style({
			flex: 2,
			position: 'relative',
			'backgroundColor': 'rgba(60,65,81,0.7)'
		})
		.exit()
	const triggerContainer2 = element('div')
		.father(triggerPage)
		.flexColumn()
		.style({
			flex: 1,
			position: 'relative',
			'backgroundColor': 'rgba(63,65,81,0.9)'
		})
		.exit()
	addSidebarButton(triggerFree, triggerContainer2, "trigger")
	back.ele.trigger = triggerFree;
	triggerFree.toPart = "trigger";
	triggerFree.changeWord = function (replaced, replacer) {
		this.value = this.value.replace(replaced, replacer)
		return true
	}
	triggerFree.arrange = function () {
		const that = triggerFree;
		EditorArrange.standardTri1(that);
		NonameCN.standardEvent(that);
		EditorArrange.standardTri2(that);
		NonameCN.deleteBlank(that);
	}
	back.ele.trigger.init = function () {
		back.skill.uniqueTrigger = [];
		back.skill.trigger.source = [];
		back.skill.trigger.player = [];
		back.skill.trigger.global = [];
		back.skill.trigger.target = [];
	}
	back.ele.trigger.submit = async function (e) {
		back.ele.trigger.init();
		if (triggerFree.value.length === 0) return;
		triggerFree.inherit();
		let list = disposeTri(ImplicitTextTool.trigger(this.value))
		const [trigger, triggerFilter, triLength, getIndexMap, triLoseReason] = EditorDataAnalyze.trigger(list);
		const allTrigger = [...trigger.player, ...trigger.target, ...trigger.global, ...trigger.source];
		const gameStartEvts = allTrigger.filter(triName => triName === "enterGame");
		const loseEvts = allTrigger.filter(triName => triName.startsWith("lose") && !triName.startsWith("loseHp") && !triName.startsWith("loseMaxHp"));
		const gainEvts = allTrigger.filter(triName => triName.startsWith("gain") && !triName.startsWith("gainMaxHp"));
		back.skill.trigger = trigger;
		back.skill.triggerFilter = triggerFilter;
		back.skill.triLength = triLength;
		back.skill.triGainEvts = gainEvts;
		back.skill.triLoseEvts = loseEvts;
		back.skill.triLoseReason = triLoseReason;
		back.skill.triGameStart = gameStartEvts.length > 0;
		if (getIndexMap) back.skill.getIndex = getIndexMap;
		if (gainEvts.length && triLength > 1) {
			await game.xjb_create.promise.alert("涉及到获得牌事件作为触发时机，请仅保留此触发时机为唯一触发时机，否则可能导致编辑器无法正常生成技能！");
		} else if (loseEvts.length && triLength > 1) {
			await game.xjb_create.promise.alert("涉及到失去牌事件作为触发时机，请仅保留此触发时机为唯一触发时机，否则可能导致编辑器无法正常生成技能！");
		} else if (gameStartEvts.length && triLength > 1) {
			await game.xjb_create.promise.alert("涉及到游戏开始时作为触发时机，请仅保留此触发时机为唯一触发时机，否则可能导致编辑器无法正常生成技能！");
		}
		back.ele.filter.submit();
		back.ele.content.submit();
		back.organize()
	}
	back.ele.trigger.inherit = function () {
		// 继承指令
		const inheritLine = triggerFree.value.match(/继承.+\n/);
		if (!inheritLine || inheritLine[0].trim() === '继承') return;
		const skillId = inheritLine[0].replace('继承', '').trim();
		const skill = lib.skill[skillId];
		if (!skill || !skill.trigger) {
			triggerFree.changeWord(/继承.+\n/, "");
			return;
		};
		let triggerCode = "";
		const targetTrigger = skill.trigger;
		for (const key in targetTrigger) {
			if (typeof targetTrigger[key] === "string") triggerCode += `${key} ${targetTrigger[key]}\n`;
			else triggerCode += `${key} ${targetTrigger[key].join(" ")}\n`;
		}
		triggerFree.changeWord(/继承.+\n/, triggerCode);
	};
	textareaTool().setTarget(back.ele.trigger)
		.debounce('keyup', back.ele.trigger.submit, 200)
		.style({
			height: '11em',
			fontSize: '0.75em',
			width: '85%',
			tabSize: '2',
			display: "block",
		})
		.placeholder(
			'举例说明\n'
			+ '例如:有一个技能的发动时机是:你受到伤害后\n'
			+ '就在框框中写:\n'
			+ '你受到伤害后\n'
			+ '每写完一个时机，就提行写下一个时机\n'
			+ "最后输入整理即可\n"
		);
	triggerAdd(triggerPage)



	let enableAdd = (who) => {
		back.phaseUse.push(who)
		who.style.display = 'none'
	}
	let enableButtonAdd = (word, en) => {
		let rat = newElement('div', '').setStyle({
			marginTop: '10px',
			height: '1em',
			position: 'relative',
			display: "block",
		})
		let it = ui.create.xjb_button(rat, word)
		ui.xjb_giveStyle(it, {
			fontSize: '1em',
			position: 'relative'
		})
		it.type = en
		listener(it, e => {
			if (back.skill.type.includes(it.type)) {
				back.skill.type.remove(it.type)
				it.style.backgroundColor = "#e4d5b7";
			} else {
				it.style.backgroundColor = "red";
				back.skill.type.push(it.type)
			}
			back.organize()
		})
		return rat
	}
	const filterTargetSeter = enableButtonAdd('选择角色', 'filterTarget')
	const filterTargetFree = newElement('textarea', '').setStyle({
		marginTop: '10px',
		marginLeft: '10px',
		height: '12em',
		fontSize: '0.75em',
		width: '85%',
		position: "relative"
	});
	const filterCardSeter = enableButtonAdd('选择卡片', 'filterCard')
		; (() => {
			const h = ui.create.xjb_button(filterCardSeter, "手牌")
			h.position = "h"
			h.style.fontSize = "0.75em"
			h.style.margin = "auto 10px"
			const e = ui.create.xjb_button(filterCardSeter, "装备")
			e.position = "e"
			e.style.fontSize = "0.75em"
			e.style.margin = "auto 10px"
			const s = ui.create.xjb_button(filterCardSeter, "木牛流马")
			s.position = "s"
			s.style.fontSize = "0.75em"
			s.style.margin = "auto 10px"
			listener(filterCardSeter, e => {
				if (!e.target.position) return;
				if (back.skill.position.includes(e.target.position)) {
					back.skill.position.remove(e.target.position)
					e.target.style.backgroundColor = "#e4d5b7";
				} else {
					e.target.style.backgroundColor = "red";
					back.skill.position.push(e.target.position)
				}
				back.organize()
			})
			back.ele.positions = [h, e, s]
		})();
	const filterCardFree = newElement('textarea', '');
	const enablePage = element('div')
		.father(subBack5)
		.flexRow()
		.height("100%")
		.width("100%")
		.exit();
	const enableContainer1 = element('div')
		.father(enablePage)
		.child(filterTargetSeter)
		.child(filterTargetFree)
		.flexColumn()
		.style({
			flex: 1,
			position: 'relative',
			'backgroundColor': 'rgba(60,65,81,0.7)'
		})
		.exit();
	const enableContainer2 = element('div')
		.father(enablePage)
		.child(filterCardSeter)
		.child(filterCardFree)
		.flexColumn()
		.style({
			flex: 1,
			position: 'relative',
			'backgroundColor': 'rgba(63,65,81,0.9)'
		})
		.exit()
	filterTargetFree.toPart = "filterTarget";
	filterTargetFree.changeWord = function (replaced, replacer) {
		this.value = this.value.replace(replaced, replacer)
		return true
	}
	filterTargetFree.arrange = function () {
		const that = filterTargetFree
		that.changeWord(/(你|目标)/g, "$1 ");
		EditorArrange.standardBoolExp(that)
		NonameCN.underlieVariable(that)
		NonameCN.standardFilterTargetBef(that)
		new Array('你', '目标').forEach(i => {
			that.changeWord(new RegExp(i, 'g'), i + ' ')
		})
		EditorArrange.makeNumToEnd_ming(that);
		NonameCN.deleteBlank(that)
	}
	filterTargetFree.adjustTab = function () {
		const that = filterTargetFree;
		that.changeWord(/\t/g, '')
		that.value = adjustTab(that.value, 0, '分支开始', '分支结束')
		that.value = adjustTab(that.value, 0, '如果', '那么', true);
		that.value = adjustTab(that.value, 0, '{', '}', true);
	}
	filterTargetFree.submit = function (e) {
		if (!back.skill.type.includes('filterTarget')) back.skill.type.push("filterTarget")
		const that = filterTargetFree
		back.skill.filterTarget = [];
		back.skill.selectTarget = '';
		let line = dispose(that.value);
		let processLine = line.filter(line => {
			if (/^[ \t]+$/.test(line)) return false;
			const [isSelect, result] = EditorDataAnalyze.select(line);
			if (isSelect) {
				back.skill.selectTarget = result
				return false;
			}
			return true
		})
		back.skill.filterTarget.push(...processLine)
		back.organize()
	}
	//
	filterCardFree.toPart = "filterCard";
	filterCardFree.changeWord = function (replaced, replacer) {
		this.value = this.value.replace(replaced, replacer)
		return true
	}
	filterCardFree.arrange = function () {
		const that = filterCardFree
		that.changeWord(/所选角色/g, '目标')
		EditorArrange.standardBoolExp(that)
		NonameCN.underlieVariable(that)
		NonameCN.standardFilterCardBef(that)
		that.changeWord(/(你|目标)/g, "$1 ");
		EditorArrange.makeNumToEnd_zhang(that);
		NonameCN.deleteBlank(that)
	}
	filterCardFree.adjustTab = function () {
		const that = filterCardFree;
		that.changeWord(/\t/g, '')
		that.value = adjustTab(that.value, 0, '分支开始', '分支结束')
		that.value = adjustTab(that.value, 0, '如果', '那么', true);
		that.value = adjustTab(that.value, 0, '{', '}', true);
	}
	filterCardFree.submit = function (e) {
		if (!back.skill.type.includes('filterCard')) back.skill.type.push("filterCard")
		const that = filterCardFree
		back.skill.filterCard = [];
		back.skill.selectCard = '';
		let implicitText = ImplicitTextTool.filterCard(that.value);
		let line = dispose(implicitText);
		let processLine = line.filter(line => {
			if (/^[ \t]+$/.test(line)) return false;
			const [isSelect, result] = EditorDataAnalyze.select(line);
			if (isSelect) {
				back.skill.selectCard = result;
				return false;
			}
			return true;
		})
		back.skill.filterCard.push(...processLine)
		back.organize()
	}
	back.ele.filterTarget = filterTargetFree
	back.ele.filterCard = filterCardFree
	textareaTool().setTarget(back.ele.filterTarget)
		.clearThenOrder("整理", back.ele.filterTarget.arrange)
		.replaceOrder(/(本|此|该)技能id/g, back.getID)
		.replaceThenOrder('新如果', "如果\n\n那么\n分支开始\n\n分支结束", back.ele.filterTarget.adjustTab)
		.replaceThenOrder('新否则', "否则\n分支开始\n\n分支结束", back.ele.filterTarget.adjustTab)
		.debounce('keyup', back.ele.filterTarget.submit, 200)
		.style({
			marginTop: '10px',
			marginLeft: '10px',
			height: '12em',
			fontSize: '0.75em',
			width: '88%',
			position: "relative"
		})
		.placeholder(
			'可以设置选择角色的数量:\n'
			+ '比如你可以在一行中写:\n'
			+ '两名/至少一名/至多五名/一到两名\n'
			+ '你也可以写角色的限制条件,写法同限制条件框\n'
			+ '比如你可以在一行中写:\n'
			+ '所选角色体力大于3\n'
			+ '每写完一个条件,就提行写下一个条件\n'
			+ "最后输入整理即可\n"
		);
	textareaTool().setTarget(back.ele.filterCard)
		.clearThenOrder("整理", back.ele.filterCard.arrange)
		.debounce('keyup', back.ele.filterCard.submit, 200)
		.style({
			marginTop: '10px',
			marginLeft: '10px',
			height: '12em',
			fontSize: '0.75em',
			width: '88%',
			position: "relative"
		})
		.placeholder(
			'可以设置选择卡片的数量:\n'
			+ '比如你可以在一行中写:\n'
			+ '两张/至少一张/至多五张/一到两张\n'
			+ '你也可以写卡片的限制条件,写法同限制条件框\n'
			+ '比如你可以在一行中写:\n'
			+ '卡片颜色为红色\n'
			+ '每写完一个条件,就提行写下一个条件\n'
			+ "最后输入整理即可\n"
		);
	enableAdd(enablePage);



	//
	const chooseSeter = newElement('div', '视为的牌')
		.style1()
		.setStyle({
			"height": "1em"
		})
	const cardTypeFree = element()
		.clone(buttonContainer)
		.flexRow()
		.setStyle("align-items", "center")
		.exit();
	const cardNameFree = element()
		.clone(buttonContainer)
		.flexRow()
		.setStyle("align-items", "center")
		.exit();
	let costSeter = newElement('div', '视为的花费')
		.style1()
		.setStyle({
			"height": "1em"
		})
	const costFree1 = element()
		.clone(buttonContainer)
		.flexRow()
		.exit();
	const costFree2 = element()
		.clone(costFree1)
		.exit();
	const costFree3 = element()
		.clone(costFree1)
		.exit();
	let frequencySeter = newElement('div', '视为限制')
		.style1()
		.setStyle({
			"height": "1em"
		})
	const frequencyFree = element()
		.clone(buttonContainer)
		.flexRow()
		.exit();
	const choosePage = element('div')
		.father(subBack5)
		.children([chooseSeter, cardNameFree, cardTypeFree])
		.children([costSeter, costFree1, costFree2, costFree3])
		.children([frequencySeter, frequencyFree])
		.flexColumn()
		.setStyle("just-content", "space-evenly")
		.height("100%")
		.width("100%")
		.exit()
	const VIEWAS_LIST = {
		"基本": [
			['sha', '杀'],
			['nature-fire:sha', '火杀'],
			['nature-thunder:sha', '雷杀'],
			['nature-ice:sha', '冰杀'],
			['nature-stab:sha', '刺杀'],
			['shan', '闪'],
			['tao', '桃'],
			['jiu', '酒'],
		],
		"军争": [
			['wugu', '五谷丰登'],
			['taoyuan', '桃园结义'],
			['nanman', '南蛮入侵'],
			['wanjian', '万箭齐发'],
			['wuzhong', '无中生有'],
			['juedou', '决斗'],
			['shunshou', '顺手牵羊'],
			['guohe', '过河拆桥'],
			['jiedao', '借刀杀人'],
			['wuxie', '无懈可击'],
			['huogong', '火攻'],
			['tiesuo', '铁索连环'],
		],
		"国战": [
			['xietianzi', '挟令'],
			['shuiyanqijunx', '水淹七军'],
			['lulitongxin', '勠力同心'],
			['lianjunshengyan', '联军盛宴'],
			['chiling', '敕令'],
			['diaohulishan', '调虎离山'],
			['huoshaolianying', '火烧连营'],
			['yuanjiao', '远交近攻'],
			['zhibi', '知己知彼'],
			['yiyi', '以逸待劳']
		],
		"应变": [
			['yiyi', '以逸待劳'],
			['suijiyingbian', '随机应变'],
			['zhujinqiyuan', '逐近弃远'],
			['dongzhuxianji', '洞烛先机'],
			['chuqibuyi', '出其不意']
		],
		"忠胆": [
			['jinchan', '金蝉脱壳'],
			['qijia', '弃甲曳兵'],
			['shengdong', '声东击西'],
			['zengbin', '增兵减灶'],
		],
		"延时": [
			['lebu', '乐不思蜀'],
			['shandian', '闪电'],
			['bingliang', '兵粮寸断'],
			['fulei', '浮雷'],
			['caomu', '草木皆兵']
		],
	};
	{
		const colorList = ["red", "orange", "yellow", "green", "pink", "#add8e6"];
		/**
		 * @param {HTMLElement} domEle 
		 * @param {object} mapList 
		 * @param {string} backAttrName 
		 * @param {string} domEleAttr 
		 */
		function setDom(domEle, mapList, backAttrName, domEleAttr, ...extra) {
			let list = xjb_formatting(Object.values(mapList));
			let list1 = xjb_formatting(Object.keys(mapList));
			list.forEach((i, k) => {
				const en = list1[k];
				let it;
				it = ui.create.xjb_button(domEle, i);
				ui.xjb_giveStyle(it, {
					fontSize: '1em'
				});
				element().setTarget(it)
					.block()
					.setStyle("fontSize", "1em")
					.hook(ele => {
						ele[domEleAttr] = en
						if (k >= 6) ui.xjb_hideElement(ele)
					})
			});
			listener(domEle, e => {
				let list = Array.from(domEle.children)
				if (!list.includes(e.target)) return;
				if (e.target.innerText.includes('>>>')) {
					const a = list.indexOf(e.target) + 1;
					let b = Math.min((a + 5), (list.length - 1));
					const toShow = list.splice(a, (b - a + 1))
					toShow.forEach(ele => ui.xjb_showElement(ele))
					list.forEach(ele => ui.xjb_hideElement(ele))
					return;
				}
				if (e.target.innerText.includes('<<<')) {
					const a = list.indexOf(e.target) - 1;
					let b = Math.max(0, (a - 5));
					list.splice(b, (a - b + 1)).forEach(ele => ui.xjb_showElement(ele))
					list.forEach(ele => ui.xjb_hideElement(ele))
					return;
				}
				const backAttr = back.skill[backAttrName];
				if (backAttr.includes(e.target[domEleAttr])) {
					backAttr.remove(e.target[domEleAttr]);
				}
				else if (domEleAttr === "frequency") {
					backAttr.remove(...NonameCN.viewAsFrequencyList)
					backAttr.push(e.target[domEleAttr]);
				}
				else if (backAttr.length < colorList.length) {
					backAttr.push(e.target[domEleAttr]);
				}
				let arr = Array.from(domEle.children)
				for (let collection of extra) {
					arr.push(...collection)
				}
				arr.filter(ele => {
					ele.style.backgroundColor = "#e4d5b7";
					return true;
				}).forEach(ele => {
					const k = backAttr.indexOf(ele[domEleAttr]);
					if (k !== -1) ele.style.backgroundColor = colorList[k];
				});
				back.organize();
			});
			return {
				append(key, value, attr) {
					let it;
					it = ui.create.xjb_button(domEle, value);
					element().setTarget(it)
						.block()
						.setStyle("fontSize", "1em")
						.hook(ele => {
							ele[attr] = key
							if ([...domEle.children].length >= 6) ui.xjb_hideElement(ele)
						})
				}
			}
		}
		if (cardNameFree) {
			const mapList = {
			};
			lib.inpile_nature.forEach(k => {
				mapList["nature-" + k + ":sha"] = lib.translate[k] + '杀'
			});
			[...lib.cardPack.standard, ...lib.cardPack.extra,
			...lib.cardPack.guozhan, ...lib.cardPack.yingbian, ...lib.cardPack.sp].forEach(k => {
				if (lib.translate[k] && get.type(k) != "equip") mapList[k] = lib.translate[k]
			})
			setDom(cardNameFree, mapList, "viewAs", "viewAs", cardTypeFree.children)
		};

		if (cardTypeFree) {
			const mapList = {
				'cardType-basic': '基本',
				'cardType-trick': '普通锦囊',
				'cardType-delay': '延时锦囊',
				'cardType-trick2': '锦囊',
			};
			setDom(cardTypeFree, mapList, "viewAs", "viewAs", cardNameFree.children)
		};
		if (costFree1) {
			const mapList = {
			};
			lib.inpile_nature.forEach(k => {
				mapList["cardName-nature-" + k + ":sha"] = lib.translate[k] + '杀'
			});
			[...lib.cardPack.standard, ...lib.cardPack.extra,
			...lib.cardPack.guozhan].forEach(k => {
				if (lib.translate[k]) mapList["cardName-" + k] = lib.translate[k]
			})
			setDom(costFree1, mapList, "viewAsCondition", "condition", costFree2.children, costFree3.children)
		};
		if (costFree2) {
			const mapList = {
				'color-pos-hes:black': "黑色牌",
				'color-pos-hs:black': "黑色手牌",
				'color-pos-hes:red': "红色牌",
				'color-pos-hs:red': "红色手牌",
				'suit-pos-hes:heart': "♥牌",
				'suit-pos-hs:heart': "♥手牌",
				'suit-pos-hes:diamond': "♦牌",
				'suit-pos-hs:diamond': "♦手牌",
				'suit-pos-hes:club': "♣牌",
				'suit-pos-hs:club': "♣手牌",
				'suit-pos-hes:spade': "♠牌",
				'suit-pos-hs:spade': "♠手牌",
			};
			setDom(costFree2, mapList, "viewAsCondition", "condition", costFree1.children, costFree3.children)
		};
		if (costFree3) {
			const mapList = {
				"preEve-link-true": "横置之",
				"preEve-link-false": "重置之"
			};
			setDom(costFree3, mapList, "viewAsCondition", "condition", costFree1.children, costFree2.children)
		};
		if (frequencyFree) {
			const mapList = {
				"frequency-phase-cardName": "回合牌名限一",
				"frequency-round-cardName": "每轮牌名限一",
				"frequency-game-cardName": "本局牌名限一",
			}
			setDom(frequencyFree, mapList, "viewAsFrequency", "frequency", [])
		}
	}
	//给以上所有free绑定事件
	for (const eleToAdd of [filterFree, contentFree, filterCardFree, filterTargetFree]) {
		EditorInteraction.addCommonOrder(eleToAdd);
	}
	for (const eleToAdd of [filterFree, contentFree, filterCardFree, filterTargetFree, triggerFree]) {
		EditorInteraction.addAllOrder(eleToAdd);
	}
	back.ele.phaseUseButton = [filterCardSeter.firstChild, filterTargetSeter.firstChild]
	//第四页
	let subBack4 = newPage()
	let skillSeter = newElement('h2', '技能', subBack4)
	let subSkill = newElement('span', '更多', skillSeter)
	subSkill.style.float = 'right'
	listener(subSkill, e => {
		game.xjb_create.chooseAnswer(
			"选择一个功能进行",
			[
				"添加子技能",
				"查看及删除子技能",
				"切换为原技能",
				"添加技能组",
				"查看及删除技能组",
				"增添标记",
				"技能提示",
			],
			true,
			function () {
				if (!NonameCN.moreSetDialog[this.resultIndex]) return;
				NonameCN.moreSetDialog[this.resultIndex](back);
			}
		)
	})
	let copy = newElement('span', '复制', skillSeter)
	copy.style.marginRight = "0.5em"
	copy.style.float = 'right'
	function copyToClipboard() {
		back.clearCache();
		if (document.execCommand) {
			back.target.select();
			document.execCommand("copy")
		} else {
			game.xjb_create.alert('由于所用方法已废弃，请手动复制(已为你选中，点击文本框即可复制。)', function () {
				back.target.select();
			})
		}
	}
	function throwEditorResultErrow() {
		NonameCN.GenerateEditorError(
			`使用牌开始时（"useCardBegin"）并不是“牌无法相应”的对应触发时机，请换成“使用牌时”、“使用牌指定目标（后）”或“成为牌的目标（后）”`,
			/"useCard(Begin|Before)"/.test(back.target.value),
			/trigger\.getParent\("useCard",void 0,true\).directHit/.test(back.target.value)
		)
		NonameCN.GenerateEditorError(
			`引用了目标组中的元素却没有“多角色”标签！请在第一页-技能标签中选中“多角色”标签后再试！`,
			!back.skill.type.includes("multitarget"),
			back.skill.type.includes("filterTarget"),
			/(?<!result.)targets\[[0-9]\]/.test(back.target.value)
		)
	}
	listener(copy, e => {
		e.preventDefault();
		try {
			throwEditorResultErrow()
			if (back.skill.mode === 'mainCode') {
				let func = new Function('lib', back.target.value)
			}
			else new Function('let mega={' + back.target.value + '}')
			if (isOpenCnStr(back.target.value)) {
				game.xjb_create.confirm(
					"代码中含有未被引号包围的全中文段落，说明该功能可能暂未实现，仍要复制吗？",
					copyToClipboard()
				)
			} else {
				copyToClipboard()
			}
		}
		catch (err) {
			game.xjb_create.alert("！！！报错：<br>" + err)
		}
	})
	let generator = newElement('span', '生成', skillSeter)
	generator.style.float = 'right'
	generator.style.marginRight = "0.5em"
	listener(generator, e => {
		e.preventDefault();
		try {
			throwEditorResultErrow()
			if (isOpenCnStr(back.target.value)) throw new Error("代码中含有未被引号包围的全中文段落！")
			let func = new Function('_status', 'lib', 'game', 'ui', 'get', 'ai', NonameCN.TransToOtherModeCode({ code: back.target.value, from: back.skill.mode, to: "mainCode", id: back.skill.id }))
			func(_status, lib, game, ui, get, ai);
			game.xjb_create.confirm('技能' + back.skill.id + "已生成(本局游戏内生效)!是否将该技能分配给玩家？", function () {
				game.me.addSkill(back.skill.id)
				if (back.skill.group) game.me.addSkill(back.skill.group)
			})
		}
		catch (err) {
			game.xjb_create.alert("！！！报错：<br>" + err)
		}
	})
	let skillFree = newElement('textarea', '', subBack4)
	ui.xjb_giveStyle(skillFree, {
		height: '10em',
		fontSize: '0.75em',
		tabSize: '4'
	})
	//关于dom
	back.target = skillFree
	back.contentDoms = [contentContainer1, contentContainer2]
	back.viewAsDoms = [chooseSeter]
	back.choose = [choosePage];
	if (lib.config.xjb_editorCache && typeof lib.config.xjb_editorCache === "object" && readCache) {
		back.loadLastCache();
	} else if (lib.config.xjb_editorConfig && lib.config.xjb_editorConfig.autoCache && readCache) {
		lib.config.xjb_editorCache = true;
		back.organize();
	} else {
		back.organize();
	}
	return back;
}