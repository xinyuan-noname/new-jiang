import { get, lib } from "../../../../noname.js";
const chineseRegex = /[\u4e00-\u9fff]+/;
class Searcher {
    /**
     * @type {Iterator}
     */
    searcher;
    constructor(keyWords, type) {
        switch (type) {
            case "skill": this.searcher = Searcher.searchSkillGenerator(keyWords); break;
            case "character": this.searcher = Searcher.searchCharacterGenerator(keyWords); break;
            default: this.searcher = Searcher.searchCharacter(keyWords); break;
        }
    }
    /**
     * @param {num} require 
     * @returns {any[]}
     */
    search(require) {
        let collected = [];
        for (let i = 0; i < require; i++) {
            const next = this.searcher.next();
            if (next.done) break;
            collected.push(next.value);
        }
        return collected;
    }
    static *searchCharacter(keyWords, config) {
        for (const packageId in lib.characterPack) {
            const packageName = lib.translate[packageId];
            const characterPack = lib.characterPack[packageId];
            for (const id in characterPack) {
                const character = lib.character[id];
                const name = get.translation(id);
                const group = character.doubleGroup.length ? character.doubleGroup.map(group => lib.translate[group]).join("/") : lib.translate[character.group];
                const sex = character.trashBin.includes("sex:male_castrated") ? "男（太监）" : lib.translate[character.sex];
                const clans = character.clans.length ? clans : "无"
                const introduction = lib.characterIntro[id];
                const dieAudios = lib.translate["#" + id];
                const skills = character.skills.map(skillId => {
                    const skillName = lib.translate[skillId] || "";
                    const description = lib.translate[skillId + "_info"] || "";
                    const audio = lib.translate["#" + skillId] || "";
                    const info = `${name}(${skillId})：${description}`;
                    return { skillId, skillName, description, audio, info };
                })
                const info = `${name}(${id})：\n来自：${packageName}，\n势力：${group}，\n性别：${sex}，\n技能：${skills.map(skill => `${skill.name}(${skill.id})`)}，宗族：${clans})`
                let searchText = get.plainText(info);
                if (keyWords.every(word => searchText.includes(word))) yield { info: searchText, id, character, introduction, dieAudios, skills };
            }
        }
    }
    static *searchSkillGenerator(keyWords, config) {
        for (const id in lib.skill) {
            const skill = lib.skill[id];
            if (skill.sub === true) continue;
            const name = lib.translate[id] || "";
            const description = lib.translate[id + "_info"] || "无描述";
            const audios = get.Audio.skill({ skill: id }).textList;
            const info = `${name}(${id})：${description}`;
            let searchText = get.plainText(info);
            if (keyWords.every(word => searchText.includes(word))) yield { info, id, name, audios, description };
        }
    }
}
export class NonameEditorData {
    view;
    /**
     * @type {Object<string,(null|Searcher)>}
     */
    searchManager = {
        "character": null,
        "skill": null
    };
    constructor() {
    }
    search(keyWords, type, require) {
        this.searchManager[type] = new Searcher(keyWords, type);
        return this.searchManager[type].search(require);
    }
    continueSearch(type, require) {
        if (!this.searchManager[type]) return [];
        return this.searchManager[type].search(require);
    }
    getData() { }
    static async readFile(file, type = "text", encoding) {
        if (!(file instanceof File)) throw new Error(file + "is not a file.");
        return new Promise((resolve) => {
            const fileReader = new FileReader();
            fileReader.addEventListener("loadend", e => {
                resolve(e.target.result);
            })
            switch (type) {
                case "text": fileReader.readAsText(file, encoding); break;
                case "arrayBuffer": fileReader.readAsArrayBuffer(file); break;
                case "URL": case "url": fileReader.readAsDataURL(file); break;
            }
        })
    }
    static getPinyin(text, withTone) {
        if (!chineseRegex.test(text)) return "";
        if (withTone === "both") {
            return {
                with: get.pinyin(text),
                without: get.pinyin(text, false)
            }
        }
        return get.pinyin(text, withTone);
    }
    static checkId(type, val) {
        switch (type) {
            case "character": return !(val in lib.character);
            case "skill": return !(val in lib.skill);
        }
    }
    /**
     * @param {number} hp 
     * @param {number} maxHp 
     * @returns {"healthy"|"damaged"|"dangerous"}
     */
    static getHpStatus(hp, maxHp) {
        if (hp > Math.round(maxHp / 2) || hp === maxHp) {
            return "healthy";
        } else if (hp > Math.floor(maxHp / 3)) {
            return "damaged";
        } else {
            return "dangerous";
        }
    }
    static getTranslation(type, attr, text) {
        if (type === "character") {
            switch (attr) {
                case "sex": {
                    if (text === "none") return "无性";
                    if (text === "male-castrated") return "太监";
                    return get.translation(text) + "性";
                }
                case "group": {
                    return get.translation(text) + "势力";
                }
                case "textShadow": {
                    switch (text) {
                        case "wei": return "rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, black 0 0 1px";
                        case "shu": return "rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, black 0 0 1px";
                        case "wu": return "rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, black 0 0 1px";
                        case "qun": return "rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, black 0 0 1px";
                        case "jin": case "western": return "rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, black 0 0 1px";
                        case "shen": return "rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, black 0 0 1px";
                        case "key": return "rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, black 0 0 1px";
                    }
                }
            }
        }
    }
    /**
     * @param {string} string 
     * @param {"camel"|"kebab"} to 
     * @returns 
     */
    static camelKebabSwitch(string, to) {
        switch (to) {
            case "kebab": return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            case "camel": return string.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
        }
    }
}