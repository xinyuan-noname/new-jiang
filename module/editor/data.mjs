import { get } from "../../../../noname.js";
const chineseRegex = /[\u4e00-\u9fff]+/;
export class NonameEditorData {
    view;
    constructor() {
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
    static getHpStatus(hp, maxHp) {
        if (hp > Math.round(maxHp / 2) || hp === maxHp) {
            return "healthy";
        } else if (hp > Math.floor(maxHp / 3)) {
            return "damaged";
        } else {
            return "dangerous";
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