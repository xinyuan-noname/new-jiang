import { game, get, lib } from "../../../../noname.js";
const chineseRegex = /[\u4e00-\u9fff]+/;
class Searcher {
    static cache = {
        skill: {},
        character: {}
    }
    /**
     * @type {Iterator}
     */
    searcher;
    constructor(keyWords, type, config) {
        switch (type) {
            case "skill": this.searcher = Searcher.searchSkillGenerator(keyWords, config); break;
            case "character": this.searcher = Searcher.searchCharacterGenerator(keyWords, config); break;
            default: this.searcher = Searcher.searchCharacter(keyWords, config); break;
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
    static parseSkill(skillId, characterId) {
        const skillName = lib.translate[skillId] || "";
        const description = lib.translate[skillId + "_info"] || "";
        const audios = get.Audio.skill({ skill: skillId, player: characterId }).audioList.filter(audio => audio.text);
        return { id: skillId, name: skillName, description, audios };
    }
    static *searchCharacterGenerator(keyWords, config) {
        for (const packageId in lib.characterPack) {
            const packageName = lib.translate[packageId + "_character_config"];
            const characterPack = lib.characterPack[packageId];
            const characterSort = lib.characterSort[packageId];
            for (const id in characterPack) {
                const characterSortId = (() => {
                    for (const sortId in characterSort) {
                        if (characterSort[sortId].includes(id)) return sortId;
                    }
                })()
                const characterSortName = lib.translate[characterSortId] ?? "未分包";
                const character = characterPack[id];
                const name = get.translation(id);
                const group = character.doubleGroup.length ? character.doubleGroup.map(group => lib.translate[group]).join("/") : lib.translate[character.group];
                const sex = character.trashBin.includes("sex:male_castrated") ? "男（太监）" : lib.translate[character.sex];
                const clans = character.clans.length ? character.clans : "无"
                const dieAudios = get.Audio.die({ player: id }).audioList.filter(audio => audio.text);
                const skills = character.skills.map(skillId => this.parseSkill(skillId, id));
                const skillList = skills.map(skill => `${skill.name}(${skill.id})`);
                let searchText = get.plainText(`${name}(${id})${packageName}${characterSortName}${group}${sex}${clans}${skillList.join("")}`);
                if (Array.isArray(config?.filter) && config.filter.some(word => searchText.includes(word))) {
                    continue;
                }
                if (keyWords.every(word => searchText.includes(word))) {
                    yield { id, name, packageName, characterSortName, sex, group, clans, hp: character.hp, maxHp: character.maxHp, hujia: character.hujia, characterSortId, characterSortName, dieAudios, skillList, skills };
                }
            }
        }
    }
    static *searchSkillGenerator(keyWords, config) {
        for (const id in lib.skill) {
            const skill = lib.skill[id];
            if (skill.sub === true || skill.sourceSkill) continue;
            const { name, description, audios } = this.parseSkill(id);
            let searchText = `${name}${id}${description}`;
            if (Array.isArray(config?.filter) && config.filter.some(word => searchText.includes(word))) {
                continue;
            }
            if (keyWords.every(word => searchText.includes(word))) {
                yield { id, name, audios, description };
            }
        }
    }
}
export class NonameData {
    readFile(file, type = "text", encoding) {
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
    checkId(val, type) {
        switch (type) {
            case "character": return !(val in lib.character);
            case "skill": return !(val in lib.skill);
            default: return false;
        }
    }
    parsePath(path, type) {
        let parsedPath = path;
        if (path.startsWith("ext:")) parsedPath = path.replace(/^ext:/, "extension/");
        /**既然是解析路径就先不考虑从数据库读取的事情吧 */
        // else if (path.startsWith("db:")) parsedPath = path
        switch (type) {
            case "audio": {
                parsedPath = "audio" + parsedPath;
            }; break;
        }
        return parsedPath;
    }
    /**
     * @param {number} hp 
     * @param {number} maxHp 
     * @returns {"healthy"|"damaged"|"dangerous"}
     */
    getHpStatus(hp, maxHp) {
        if (hp > Math.round(maxHp / 2) || hp === maxHp) {
            return "healthy";
        } else if (hp > Math.floor(maxHp / 3)) {
            return "damaged";
        } else {
            return "dangerous";
        }
    }
    /**
     * @param {"character"} type 
     * @param {"sex"|"group"} attr 
     * @param {string} text 
     */
    getTranslation(type, attr, text) {
        if (type === "character") {
            switch (attr) {
                case "sex": {
                    if (text === "none") return "无性";
                    if (text === "male-castrated") return "太监";
                    return lib.translate[text] + "性";
                }
                case "group": {
                    let group = lib.translate[text];
                    return group + "势力";
                }
            }
        }
        else if (type === "skill") {
            switch (attr) {
                case "name": {
                    return lib.translate[text] || text;
                };
                case "description": case "info": {
                    return lib.translate[text + "_info"] || ""
                }
            }
        }
        return ""
    }
    /**
     * @param {"wei"|"shu"|"wu"|"qun"|"jin"|"shen"|"western"|"key"|string} group 
     * @returns 
     */
    getTextShadowStyle(nature) {
        switch (nature) {
            case "wei": return "rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, black 0 0 1px";
            case "shu": return "rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, black 0 0 1px";
            case "wu": return "rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, black 0 0 1px";
            case "qun": return "rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, black 0 0 1px";
            case "jin": case "western": return "rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, black 0 0 1px";
            case "shen": return "rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, black 0 0 1px";
            case "key": return "rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, black 0 0 1px";
        }
    }
    /**
     * @param {string} text 
     * @param {boolean} withTone 
     * @returns 
     */
    getPinyin(text, withTone) {
        if (!chineseRegex.test(text)) return [];
        return get.pinyin(text, withTone);
    }
    /**
     * @param {string} string 
     * @param {"camel"|"kebab"} to 
     * @returns 
     */
    camelKebabSwitch(string, to) {
        switch (to) {
            case "kebab": return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
            case "camel": return string.replace(/-([a-z])/g, (_match, letter) => letter.toUpperCase());
        }
    }
    requestMultiMedia(query, type, config = {}) {
        switch (type) {
            case "audio": {
                return new Promise((resolve, reject) => {
                    const audio = game.playAudio({
                        path: query,
                        addVideo: false,
                        onended: resolve,
                        onerror: reject,
                    });
                    if (config.volume) audio.volume = config.volume;
                })
            }
        }
    }
}
export class NonameEditorData extends NonameData {
    view;
    /**
     * @type {Object<string,(null|Searcher)>}
     */
    searchManager = {
        "character": null,
        "skill": null
    };
    constructor() {
        super();
    }
    search(type, config = {}) {
        const { require, keyWords, filter } = config;
        this.searchManager[type] = new Searcher(keyWords, type, { filter });
        return this.searchManager[type].search(require);
    }
    continueSearch(type, require) {
        if (!this.searchManager[type]) return [];
        return this.searchManager[type].search(require);
    }
    getData() { }
}