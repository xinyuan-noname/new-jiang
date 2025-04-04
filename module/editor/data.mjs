import { game, get, lib, ui } from "../../../../noname.js";
import url from "./url.mjs";
const chineseRegex = /[\u4e00-\u9fff]+/;
const parseSkill = (skillId, characterId) => {
    if (!(skillId in lib.skill)) return null;
    const skillName = lib.translate[skillId] || "";
    const description = lib.translate[skillId + "_info"] || "";
    const audios = get.Audio.skill({ skill: skillId, player: characterId }).audioList.filter(audio => audio.text);
    return { id: skillId, name: skillName, description, audios };
}
class Searcher {
    static cache = {
        skill: {},
        character: {},
        bwikiSkin: {}
    }
    /**
     * @type {function|null}
     */
    onSearcherLoad = null
    /**
     * @type {Iterator}
     */
    searcher;
    constructor(keyWords, type, config) {
        switch (type) {
            case "skill": {
                new Promise((reslove) => {
                    setTimeout(() => {
                        this.searcher = Searcher.searchSkillGenerator(keyWords, config);
                        this.onSearcherLoad?.();
                        reslove();
                    }, 0)
                });
            }; break;
            case "character": {
                new Promise((reslove) => {
                    setTimeout(() => {
                        this.searcher = Searcher.searchCharacterGenerator(keyWords, config);
                        this.onSearcherLoad?.();
                        reslove();
                    }, 0)
                });
            }; break;
            case "bwikiSkin": {
                new Promise((resolve) => {
                    resolve(Searcher.searchBwikiSkinGenerator(keyWords, config));
                }).then(generator => {
                    this.searcher = generator;
                    this.onSearcherLoad?.();
                });
            }; break;
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
    static * searchCharacterGenerator(keyWords, config) {
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
                const skills = character.skills.map(skillId => parseSkill(skillId, id));
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
    static * searchSkillGenerator(keyWords, config) {
        for (const id in lib.skill) {
            const skill = lib.skill[id];
            if (skill.sub === true || skill.sourceSkill) continue;
            const { name, description, audios } = parseSkill(id);
            let searchText = `${name}${id}${description}`;
            if (Array.isArray(config?.filter) && config.filter.some(word => searchText.includes(word))) {
                continue;
            }
            if (keyWords.every(word => searchText.includes(word))) {
                yield { id, name, audios, description };
            }
        }
    }
    static async searchBwikiSkinGenerator(keyWords, config) {
        const urls = [
            "https://wiki.biligame.com/sgs/api.php",
            "https://wiki.biligame.com/sgsol/api.php",
            "https://wiki.biligame.com/msgs/api.php"
        ];
        const skins = [];
        await Promise.all(urls.map(async url => {
            const URLObject = new URL(url);
            URLObject.searchParams.append("action", "parse");
            URLObject.searchParams.append("format", "json");
            URLObject.searchParams.append("disablelimitreport", "true");
            URLObject.searchParams.append("prop", "text");
            URLObject.searchParams.append("contentmodel", "wikitext");
            URLObject.searchParams.append("smaxage", "3600");
            URLObject.searchParams.append("maxage", "3600");
            URLObject.searchParams.append("origin", "*");
            URLObject.searchParams.append("text", `{{#ask:[[分类:皮肤]][[所属武将::~*${keyWords}]]|?所属武将|?皮肤名|?品质|?画师|?下载链接|sort=品质等级,所属武将,皮肤名|order=desc,asc,asc|offset=0|limit=1000|mainlabel=-|headers=hide|format=list|link=none|searchlabel=|sep=、}}`);
            const response = await fetch(URLObject.toString());
            if (!response.ok) throw new Error(response.statusText);
            const json = await response.json();
            const html = json?.parse?.text?.["*"];
            if (!html) return;
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, "text/html");
            const rows = doc.querySelectorAll(".smw-row");
            rows.forEach((row) => {
                const fields = row.querySelectorAll(".smw-field");
                if (fields.length < 4) return;
                const name = fields[0].querySelector(".smw-value")?.textContent.trim();
                const skinName = fields[1].querySelector(".smw-value")?.textContent.trim();
                const quality = fields[2].querySelector(".smw-value")?.textContent.trim();
                const artist = fields[3].querySelector(".smw-value")?.textContent.trim();
                const downloadLinks = Array.from(fields[4]?.querySelectorAll("a") || []).map((link) => (link.href));
                skins.push({
                    skinName,
                    quality,
                    artist,
                    downloadLinks,
                });
            });
        }))
        return (function* () {
            for (const skin of skins) {
                for (const link of skin.downloadLinks) {
                    yield {
                        skinName: skin.skinName,
                        quality: skin.quality,
                        artist: skin.artist,
                        link
                    };
                }
            }
        })();
    }
}
class AST {
    static #ast = {
        Babel: null,
    }
    get babel() {
        return AST.#ast.Babel;
    }
    get Babel() {
        return AST.#ast.Babel;
    }
    get parser() {
        return this.Babel?.packages?.parser;
    }
    get generator() {
        return this.Babel?.packages?.generator;
    }
    get traverse() {
        return this.Babel?.packages?.traverse?.default;
    }
    get types() {
        return this.Babel?.packages?.types;
    }
    parseCode(code, configs) {
        const { parser } = this;
        const abstractSyntaxTree = parser.parse(code, configs);
        return abstractSyntaxTree;
    }
    traverseAST(ast, config) {
        const { traverse } = this;
        traverse(ast, config);
    }
    getNodeByType(ast, type) {
        let target = null;
        this.traverseAST(ast, {
            [type]: (path) => {
                target = path;
                path.stop();
            }
        });
        return target;
    }
    getNodeListByType(ast, type) {
        const nodeList = [];
        this.traverseAST(ast, {
            [type]: (path) => {
                nodeList.push(path)
            }
        });
        return target;
    }
    //create系列函数 从给定的值中创建对应的AST节点
    createNode(val) {
        let node;
        if (Array.isArray(val)) {
            node = this.createArrayExpression(val);
        } else if (typeof val === "object" && val !== null) {
            node = this.createObjectExpression(val);
        } else {
            node = this.createLiteral(val);
        }
        return node;
    }
    createLiteral(literal) {
        let literalPath;
        const { types } = this;
        switch (true) {
            case (literal instanceof RegExp): {
                literalPath = types.regExpLiteral(literal.source, literal.flags);
            }; break;
            case (typeof literal === "bigint"): {
                literalPath = types.regExpLiteral(literal.toString());
            }; break;
            case (typeof literal === "string"): {
                literalPath = types.StringLiteral(literal);
            }; break;
            case (typeof literal === "number"): {
                literalPath = types.NumberLiteral(literal);
            }; break;
            case (literal === null): {
                literalPath = types.NullLiteral();
            }; break;
        }
        return literalPath;
    }
    createArrayExpression(array) {
        const { types } = this;
        return types.ArrayExpression(array.map(element => this.createNode(element)).filter(Boolean));
    }
    createFunction(func) {
        const funcAST = this.parser.parse(func.toString());
        const funcNode = this.getNodeByType(funcAST, "FunctionExpression|ArrowFunctionExpression");
        return funcNode;
    }
    createObjectProperty(key, val) {
        const { types } = this;
        let keyPath, valuePath;
        if (typeof key === "string") {
            valuePath = this.createNode(val);
            if (valuePath) {
                keyPath = this.checkIdentifierValid(key) ? types.identifier(key) : types.StringLiteral(key);
                return this.types.ObjectProperty(keyPath, valuePath);
            }
        }
    }
    createObjectMethod(name, func) {
        const { types } = this;
        let namePath, funcPath;
        if (typeof name === "string") {
            funcPath = this.createFunction(func);
            if (funcPath) {
                namePath = this.checkIdentifierValid(name) ? types.identifier(name) : types.StringLiteral(name);
                return this.types.ObjectMehod("method", namePath, funcPath);
            }
        }
    }
    createObjectExpression(object) {
        const { types } = this;
        const objectExpression = types.ObjectExpression([])
        for (const k in object) {
            if (object.hasOwnProperty(k)) {
                if (typeof object[k] !== "function") {
                    const property = this.createObjectProperty(k, object[k]);
                    if (property) objectExpression.properties.push(property);
                } else {
                    const method = this.createObjectMethod(k, object[k]);
                    if (method) objectExpression.properties.push(method);
                }
            }
        }
        return objectExpression;
    }
    //
    checkIdentifierValid(identifier) {
        try {
            this.parseCode(`var ${identifier};`);
            return true;
        } catch (err) {
            return false;
        }
    }
    replaceWithLiteral(path, literal) {
        let literalPath = this.createLiteral(literal);
        if (literalPath) path.replaceWith(literalPath);
    }
    generateCode(ast, configs) {
        const { generator } = this;
        const code = generator.generate(ast, configs);
        return code;
    }
    /**
     * @returns {Promise<void>}
     */
    load() {
        let loading;
        if (!AST.#ast.Babel) {
            loading = Promise.all([
                import("./libs/babel/standalone/babel.min.js").then(module => {
                    AST.#ast.Babel = window.Babel;
                    // delete window.Babel;
                })
            ]);
        } else {
            loading = Promise.resolve();
        }
        return loading;
    }
}
class EventManager {
    #eventMap = {}
    on(type, callback) {
        this.#eventMap[type] = callback;
    }
    async emit(type, ...data) {
        if (type in this.#eventMap && typeof this.#eventMap[type] === "function") {
            await this.#eventMap[type](...data);
        }
    }
}
export class NonameData {
    /**
     * @param {Blob|URL} file 
     * @param {"text"|"arrayBuffer"|"url"} type 
     * @param {string} encoding 
     * @returns 
     */
    readFile(file, type = "text", encoding) {
        if ((file instanceof Blob)) {
            return new Promise((resolve) => {
                const fileReader = new FileReader();
                fileReader.addEventListener("loadend", e => {
                    resolve(e.target.result);
                })
                switch (String(type).toLocaleLowerCase()) {
                    case "text": fileReader.readAsText(file, encoding); break;
                    case "arrayBuffer": fileReader.readAsArrayBuffer(file); break;
                    case "URL": case "url": fileReader.readAsDataURL(file); break;
                }
            })
        } else if (URL.canParse(file) || file instanceof URL) {
            let url = file;
            fetch(url).then(async response => {
                if (!response.ok) throw new Error(response.statusText);
                switch (type) {
                    case "text": return await response.text();
                    case "arrayBuffer": return await response.arrayBuffer();
                    case "url": case "URL": return await this.readFile(await response.blob(), "url");
                }
            })
        }
        else throw new TypeError(file + "不是可以被读取的文件或文件的URL");
    }
    submitFile(format, multiple = false) {
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        if (Array.isArray(format)) {
            input.accept = format.join(",");
        } else if (format) {
            input.accept = format;
        }
        if (multiple) input.setAttribute("multiple", true);
        let resolveFile;
        const promise = new Promise((resolve) => {
            resolveFile = resolve;
        })
        input.onchange = (e) => {
            resolveFile(Array.from(input.files));
        }
        input.click();
        return promise;
    }
    checkId(val, type) {
        switch (type) {
            case "character": return !(val in lib.character);
            case "skill": return !(val in lib.skill);
            default: return false;
        }
    }
    checkSkillTags(id, tags) {
        if (!(id in lib.skill)) return false;
        const info = lib.skill[id];
        if (!info) return false;
        return tags.every(tag => info[tag]);
    }
    parseSkill(skillId, characterId) {
        return parseSkill(skillId, characterId)
    }
    createTempCharacter(characterData) {
        const tempCharacterManager = {
            id: null,
            playerElement: null,
            load() {
                const { id, name, sex, avatar, ...characterNeedData } = characterData;
                this.id = id;
                lib.translate[id] = name;
                if (sex === "male-castrated") {
                    characterNeedData.sex = "male";
                    if (!Array.isArray(characterNeedData.trashBin)) {
                        characterNeedData.trashBin = [];
                    }
                    characterNeedData.trashBin.push("sex:male_castrated")
                } else {
                    characterNeedData.sex = sex;
                }
                lib.character[id] = new lib.element.character.constructor(characterNeedData);
                this.load = null;
            },
            /**
             * @param {HTMLElement} parentNode 
             * @returns {import("../../../../noname/library/index.js").Player}
             */
            use(parentNode) {
                const playerElement = ui.create.player();
                if (parentNode instanceof HTMLElement) parentNode.appendChild(playerElement);
                playerElement.init(this.id);
                playerElement.setBackgroundImage(characterData.avatar);
                this.use = null;
                return playerElement;
            },
            unload() {
                if (this.playerElement instanceof HTMLElement) this.playerElement.remove();
                delete lib.character[this.character];
                delete lib.translate[this.id];
                this.id = null;
                this.playerElement = null;
            }
        };
        tempCharacterManager.load();
        return tempCharacterManager;
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
    getClanSkillId(clanName) {
        switch (clanName) {
            case "陈留吴氏": {
                return 'clanmuyin';
            };
            case "颍川荀氏": {
                return "clandaojie";
            };
            case "颍川韩氏": {
                return "clanxumin"
            };
            case "太原王氏": {
                return "clanzhongliu";
            }
            case "颍川钟氏": {
                return "clanbaozu";
            }
        }
    }
    getCharacterIntro(id) {
        return get.characterIntro(id);
    }
    /**
     * @param {"character"|"skill"} type 
     * @param {"sex"|"group"|"name"} attr 
     * @param {string} text 
     */
    getTranslation(type, attr, text) {
        if (type === "character") {
            switch (attr) {
                case "sex": {
                    if (text === "none") return "无性";
                    if (text === "male-castrated") return "太监";
                    return (lib.translate[text] || "") + "性";
                }
                case "group": {
                    let group = lib.translate[text] || "";
                    return group + "势力";
                }
                case "name": {
                    return lib.translate[text] || "";
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
    /**
     * @param {string} src 
     * @param {{volume:number}} config 
     * @returns 
     */
    playAudio(src, config = {}) {
        return new Promise((resolve, reject) => {
            const audio = game.playAudio({
                path: src,
                addVideo: false,
                onEnded: resolve,
                onError: reject,
            });
            if (config.volume) audio.volume = config.volume;
        })
    }
    getFrame(data, type, config) {
        const manager = new EventManager();
        ; (async () => {
            const decoder = new ImageDecoder({ data, type, ...config });
            await decoder.tracks.ready;
            const count = decoder.tracks.selectedTrack?.frameCount;
            for (let index = 0; index < count; index++) {
                const result = await decoder.decode({ frameIndex: index });
                await manager.emit("data", result);
            }
            manager.emit("finished");
        })()
        return manager;
    }
    async getAST() {
        const ast = new AST();
        await ast.load();
        return ast;
    }
    /**
     * @param {Blob|URL} fileSource 
     */
    async getAbstractSyntaxTreeFromFileSource(fileSource) {
        const astObject = await this.getAST();
        const code = await this.readFile(fileSource, "text");
        const node = astObject.parseCode(code)
        return { ast: astObject, node };
    }
    newCharacterExpressionStatement = "lib.character['xxx'] = new lib.element.Character();";
    async genCharacterCode(characterInfo, mode = 'object') {
        const { id, intro, pinyin, dieAudioText, ...basicCharacterInfo } = characterInfo;
        const astObject = await this.getAST();
        const ast = astObject.parseCode(this.newCharacterExpressionStatement);
        switch (mode) {
            case "object": {
                const stringLiteral = astObject.getNodeByType(ast, "StringLiteral");
                const newExpression = astObject.getNodeByType(ast, "NewExpression");
                astObject.replaceWithLiteral(stringLiteral, id);
                newExpression.node.arguments.push(astObject.createNode(basicCharacterInfo));
            }
            case "array": {

            }
        }
        return astObject.generateCode(ast).code;
    }
    /**
     * @param {HTMLImageElement} img 
     * @param {Object} config 
     */
    clipGif(img, config) {
        if (!(img instanceof HTMLImageElement)) throw new Error(`${img}必须为HTMLImageElement对象！`)
        if (!("ImageDecoder" in window)) throw new Error("当前浏览器暂不支持该功能！请切换至chorme94浏览器或更改版本！");
        const clipManager = new EventManager();
        const {
            useClientData = true,
            quality = 1,
            dataForm = "url",
            minDelay
        } = config;
        let { x, y, height, width } = config;
        if (!x) x = 0;
        if (!y) y = 0;
        if (!width) width = img.naturalWidth;
        if (!height) height = img.naturalHeight;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
        const drawFrame = useClientData === true ? (() => {
            const rateX = img.clientWidth / img.naturalWidth,
                rateY = img.clientHeight / img.naturalHeight;
            width /= rateX;
            height /= rateY;
            return (result) => {
                tempCanvas.height = height;
                tempCanvas.width = width;
                tempCtx.drawImage(result,
                    x / rateX, y / rateY, width, height,
                    0, 0, width, height
                );
            }
        })() : (() => {
            return (result) => {
                tempCanvas.height = height;
                tempCanvas.width = width;
                tempCtx.drawImage(result,
                    x, y, img.naturalWidth, img.naturalHeight,
                    0, 0, width, height
                )
            }
        })();
        (async () => {
            if (!("gif" in window)) await import("./libs/gif.js/gif.js");
            const gif = new GIF({
                worker: 20,
                quality,
                workerScript: `./${url}/libs/gif.js/gif.worker.js`
            })
            const response = await fetch(img.src);
            const frameManager = this.getFrame(await response.arrayBuffer(), "image/gif");
            const frameResults = []
            frameManager.on("data", async (result) => {
                frameResults.push(result);
                drawFrame(result.image);
                const frame = new Image(width, height);
                frame.src = tempCanvas.toDataURL();
                await new Promise(r => {
                    frame.onload = () => {
                        let delay = (result.image?.duration || 1e4) / 1e6;
                        if (!isNaN(minDelay) && delay < minDelay) delay = minDelay;
                        gif.addFrame(frame, { delay });
                        r()
                    }
                });
                clipManager.emit("data", result);
            })
            frameManager.on("finished", () => {
                clipManager.emit("dataend", frameResults)
                gif.on("finished", (blob) => {
                    if (dataForm.toLocaleLowerCase() === "blob") {
                        clipManager.emit("finished", blob);
                    } else if (dataForm === "blobURL") {
                        clipManager.emit("finished", URL.createObjectURL(blob));
                    } else if (dataForm.toLocaleLowerCase() === "url") {
                        this.readFile(blob, "url").then(data => {
                            clipManager.emit("finished", data);
                        });
                    } else {
                        clipManager.emit("finished", null);
                    }
                });
                gif.render();
            })
        })()
        return clipManager;
    }
    /**
     * @param {HTMLImageElement} img 
     * @param {Object} config 
     */
    clipStaticImg(img, config) {
        if (!(img instanceof HTMLImageElement)) throw new Error(`${img}必须为HTMLImageElement对象！`)
        const {
            useClientData = true,
            quality = 1,
            type = "image/png",
            dataForm = "url",
        } = config;
        let { x, y, height, width } = config
        if (!x) x = 0;
        if (!y) y = 0;
        if (!width) width = img.naturalWidth;
        if (!height) height = img.naturalHeight;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext("2d", { willReadFrequently: true });
        const drawFrame = useClientData === true ? (() => {
            const rateX = img.clientWidth / img.naturalWidth,
                rateY = img.clientHeight / img.naturalHeight;
            width /= rateX;
            height /= rateY;
            return (result) => {
                tempCanvas.height = height;
                tempCanvas.width = width;
                tempCtx.drawImage(result,
                    x / rateX, y / rateY, width, height,
                    0, 0, width, height
                );
            }
        })() : (() => {
            return (result) => {
                tempCanvas.height = height;
                tempCanvas.width = width;
                tempCtx.drawImage(result,
                    x, y, img.naturalWidth, img.naturalHeight,
                    0, 0, width, height
                )
            }
        })();
        return new Promise((resolve) => {
            drawFrame(img);
            if (dataForm.toLocaleLowerCase() === "url") {
                tempCanvas.toDataURL(resolve, type, quality);
            } else if (dataForm.toLocaleLowerCase() === "blob" || dataForm === "blobURL") {
                tempCanvas.toBlob(resolve, type, quality);
            } else {
                resolve(null);
            }
        }).then((data) => {
            if (dataForm === "blobURL") return URL.createObjectURL(data);
            return data;
        })
    }
}
export class NonameEditorData extends NonameData {
    view;
    /**
     * @type {Object<string,(null|Searcher)>}
     */
    searchManager = {
        "character": null,
        "skill": null,
        "skin": null,
    };
    constructor() {
        super();
    }
    async search(type, config = {}) {
        const { require, keyWords, filter } = config;
        return new Promise((reslove) => {
            const searcher = new Searcher(keyWords, type, { filter });
            searcher.onSearcherLoad = () => {
                reslove(searcher.search(require));
            }
            this.searchManager[type] = searcher;
        })
    }
    continueSearch(type, require) {
        if (!this.searchManager[type]) return [];
        return this.searchManager[type].search(require);
    }
}