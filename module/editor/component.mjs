import url from "./url.mjs";
import { preventEnter, toggleMultiClass } from "./encapsulated.mjs";
import { HTMLNonameFocusUIElement } from "./component-base.mjs";
import "./component-infoCard.mjs";
import "./component-dialog.mjs";
class HTMLNonameCharacterEditorElement extends HTMLNonameFocusUIElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        //$: shadow , html/character-editor.html//
shadow.innerHTML=`
<link rel="stylesheet" href="./${url}/style/character-editor.css">
<div>
    <div class="left">
        <div data-setting="avatar" data-avatar="">
            <div class="avatar-view high">
                <div class="img-container">
                    <img draggable="false">
                    <section class="cutter">
                        <div class="cutter-view"></div>
                        <span class="control-point lt"></span>
                        <span class="control-point lb"></span>
                        <span class="control-point rt"></span>
                        <span class="control-point rb"></span>
                    </section>
                    <section class="curtain"></section>
                </div>
                <div class="img-loading"></div>
            </div>
            <div class="tool-bar">
                <span class="reset" title="重置">⟲</span>
                <span class="cut" title="裁剪">✂</span>
            </div>
        </div>
        <div data-setting="dieAudios"></div>
    </div>
    <div class="right">
        <div data-setting="name pinyin" data-name="" data-pinyin="" data-required="true">
            <span>
                <span>姓名</span>
                <span class="expandable-expanded" data-for="name"></span>
                <span></span>
            </span>
            <ruby data-by="name">
                <div contenteditable="true" spellcheck="false"></div>
                <rp>(</rp>
                <rt contenteditable="true" spellcheck="false"></rt>
                <rp>)</rp>
            </ruby>
        </div>
        <div data-setting="id" data-id="">
            <span>
                <span>武将标识符(id)</span>
                <span class="expandable-expanded" data-for="id"></span>
                <span></span>
            </span>
            <ruby data-by="id">
                <div contenteditable="true" spellcheck="false"></div>
                <button>使用拼音</button>
            </ruby>
        </div>
        <div data-setting="sex" data-sex="">
            <span>
                <span>性别</span>
                <span class="expandable-expanded" data-for="sex"></span>
                <span></span>
            </span>
            <ul data-by="sex">
                <li data-sex-option="male" style="--url:url(/image/card/sex_male.png);">男性</li>
                <li data-sex-option="female" style="--url:url(/image/card/sex_female.png)">女性</li>
                <li data-sex-option="double" style="--url:url(/image/card/sex_double.png)">双性</li>
                <li data-sex-option="none" style="--url:url(/image/card/sex_none.png)">无性</li>
                <li data-sex-option="male-castrated" style="--url:url(/image/card/sex_male_castrated.png)">太监</li>
            </ul>
        </div>
        <div data-setting="group" data-group="" data-double-group="">
            <span>
                <span>势力</span>
                <span class="expandable-expanded" data-for="group"></span>
                <span></span>
            </span>
            <section data-by="group">
                <span class="checkbox" data-group-double value="double">选择多势力</span>
                <ul>
                    <li data-group-option="wei"
                        style="--url:url(/image/card/group_wei.png);--group-text-shadow:rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, rgb(78 117 140) 0 0 2px, black 0 0 1px">
                        魏</li>
                    <li data-group-option="shu"
                        style="--url:url(/image/card/group_shu.png);--group-text-shadow:rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, rgb(128 59 2) 0 0 2px, black 0 0 1px">
                        蜀</li>
                    <li data-group-option="wu"
                        style="--url:url(/image/card/group_wu.png);--group-text-shadow:rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, rgb(57 123 4) 0 0 2px, black 0 0 1px">
                        吴</li>
                    <li data-group-option="qun"
                        style="--url:url(/image/card/group_qun.png);--group-text-shadow:rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, rgb(164 164 164) 0 0 2px, black 0 0 1px">
                        群</li>
                    <li data-group-option="jin"
                        style="--url:url(/image/card/group_jin.png);--group-text-shadow:rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, black 0 0 1px">
                        晋</li>
                    <li data-group-option="shen"
                        style="--url:url(/image/card/group_shen.png);--group-text-shadow:rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, rgb(243 171 27) 0 0 2px, black 0 0 1px">
                        神</li>
                </ul>
                <span>
                    <span class="expandable-collapsed" data-for="more-group">更多势力</span>
                </span>
                <ul class="hidden" data-by="more-group">
                    <li data-group-option="western"
                        style="--url:url(/image/card/group_western.png);--group-text-shadow:rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, rgb(100 74 139) 0 0 2px, black 0 0 1px">
                        西</li>
                    <li data-group-option="key"
                        style="--url:url(/image/card/group_key.png);--group-text-shadow:rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, rgb(203 177 255) 0 0 2px, black 0 0 1px">
                        键</li>
                    <li data-diy>新增</li>
                </ul>
            </section>
        </div>
        <div data-setting="clans" data-clans="">
            <span>
                <span>宗族</span>
                <span class="expandable-collapsed" data-for="clans"></span>
                <span></span>
            </span>
            <section data-by="clans" class="hidden">
                <ul>
                    <li data-clan-option="陈留吴氏" style="--url:url(../image/clan/陈留吴氏.png)">陈留吴氏</li>
                    <li data-clan-option="颍川荀氏" style="--url:url(../image/clan/颍川荀氏.png)">颍川荀氏</li>
                    <li data-clan-option="颍川韩氏" style="--url:url(../image/clan/颍川韩氏.png)">颍川韩氏</li>
                    <li data-clan-option="太原王氏" style="--url:url(../image/clan/太原王氏.png)">太原王氏</li>
                    <li data-clan-option="颍川钟氏" style="--url:url(../image/clan/颍川钟氏.png)">颍川钟氏</li>
                </ul>
                <span>
                    <span class="expandable-collapsed" data-for="more-clans">更多宗族</span>
                </span>
                <ul class="hidden" data-by="more-clans">
                    <li data-diy>添加宗族</li>
                </ul>
            </section>
        </div>
        <div data-setting="hp maxHp hujia" data-hp="4" data-max-hp="4" data-hujia="0">
            <span>
                <span>体力&护甲</span>
                <span class="expandable-expanded" data-for="hp"></span>
                <span></span>
            </span>
            <div data-by="hp">
                <div class="hp-operation">
                    <div>
                        <span>体力</span>
                        <span contenteditable="true">4</span>
                        <span>/</span>
                        <span contenteditable="true">4</span>
                    </div>
                    <div class="hp-more-show hidden">
                        <div>
                            <span data-hp-adjust-mode="hp">体力值</span>
                            <span data-hp-adjust-mode="maxHp">体力上限</span>
                        </div>
                    </div>
                    <div class="hp-show">
                        <div class="hpContainer healthy">
                            <div class="hp lost"></div>
                            <div class="hp lost"></div>
                            <div class="hp lost"></div>
                            <div class="hp lost"></div>
                        </div>
                    </div>
                    <div class="hp-adjust">
                        <div>
                            <div class="hp-plus">+</div>
                            <hr>
                            <div class="hp-minus">-</div>
                        </div>
                        <span contenteditable="true">1</span>
                    </div>
                </div>
                <div class="hujia-operation">
                    <div>
                        <span>护甲</span>
                        <span contenteditable="true">0</span>
                    </div>
                    <div class="hujiaContainer">
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia lost"></div>
                        <div class="hujia reset"></div>
                    </div>
                </div>
            </div>
        </div>
        <div data-setting="skills" data-skills="" id="noname-skill-editor-skills-setting">
            <span>
                <span>技能</span>
                <span class="expandable-expanded" data-for="skills"></span>
                <span></span>
            </span>
            <div data-by="skills">
                <ruby>
                    <div contenteditable="true" spellcheck="false"></div>
                    <span></span>
                </ruby>
                <p>搜索技能，将侧边栏技能拖入该区域，或选择技能卡片中的⬅️以添加技能</p>
                <section>
                    <header>
                        <span>技能列表：</span>
                        <span class="expandable-expanded" data-for="skill-list"></span>
                    </header>
                    <ul data-by="skill-list"></ul>
                </section>
            </div>
        </div>
        <div data-setting="isZhu hasHiddenSkill isAiForbidden" data-more data-is-zhu-gong="false" data-is-hidden="false">
            <span>
                <span>杂项</span>
                <span class="expandable-expanded" data-for="more"></span>
                <span></span>
            </span>
            <ul data-by="more">
                <li class="checkbox" data-more-option="isZhuGong">
                    <p>设为主公</p>
                    <span></span>
                </li>
                <li class="checkbox" data-more-option="hasHiddenSkill">
                    <p>登场隐匿</p>
                    <span></span>
                </li>
                <li class="checkbox" data-more-option="isUnseen" title="该武将在武将包中不可见">
                    <p>隐藏武将</p>
                    <span></span>
                </li>
                <li class="checkbox" data-more-option="isAiForbidden">
                    <p>人机禁用</p>
                    <span></span>
                </li>
                <li class="checkbox" data-more-option="isBoss">
                    <p>设为BOSS</p>
                    <span></span>
                </li>
            </ul>
        </div>
        <div data-setting="intro" data-intro>
            <span>
                <span>武将介绍</span>
                <span class="expandable-expanded" data-for="intro"></span>
                <span></span>
            </span>
            <section data-by="intro">
                <p></p>
                <footer class="tool-bar">
                    <button class="edit">编辑</button>
                </footer>
            </section>
        </div>
    </div>
</div>`
//#: shadow , html/character-editor.html//
    }
    connectedCallback() {
        this.#listenAvatar();
        this.#listenName();
        this.#listenId();
        this.#listenSex();
        this.#listenGroup();
        this.#listenClans();
        this.#listenHp();
        this.#listenSkills();
        this.#listenMore();
        this.#listenIntro();
        //
        this.#listenExpanable();
    }
    #listenAvatar() {
        let imgType = "", minDelay = 0.05;
        const URLStack = this.dataStructureQuery("stack");
        const avatarDataArea = this.getDataAreaDom("avatar");
        const avatar = avatarDataArea.querySelector('.avatar-view');
        const imgContainer = avatarDataArea.querySelector(".avatar-view .img-container");
        const curtain = avatarDataArea.querySelector(".avatar-view .img-container .curtain");
        const img = avatarDataArea.querySelector(".avatar-view img");
        const cutter = avatarDataArea.querySelector(".cutter")
        const resetButton = avatarDataArea.querySelector(".reset");
        const cutButton = avatarDataArea.querySelector(".cut");
        /**
         * 
         * @param {File} file 
         */
        const loadFile = async (file) => {
            for (const url of URLStack) {
                URL.revokeObjectURL(url);
            }
            URLStack.push(URL.createObjectURL(file));
            imgType = file.type;
            img.style.cssText = "";
            img.src = URLStack.peek();
            avatar.classList.add("done");
            this.changeData("avatar", URLStack.peek());
        }
        const reloadImage = (url) => {
            URLStack.push(url);
            img.src = url;
            avatar.classList.add("done");
            this.changeData("avatar", url);
        }
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            avatar.addEventListener(event, e => {
                if (avatar.classList.contains("done")) return;
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        avatar.addEventListener("pointerup", async () => {
            if (avatar.classList.contains("done")) return;
            const fileList = await this.fileQuery("submit", { format: "image/*" });
            if (fileList !== null) loadFile(fileList[0]);
        });
        avatar.addEventListener("drop", e => {
            if (e?.dataTransfer?.files?.item(0)?.type?.startsWith?.("image")) {
                loadFile(e.dataTransfer.files[0]);
            }
        });
        resetButton.addEventListener("pointerup", () => {
            avatar.classList.remove("done");
            img.removeAttribute("src");
            img.style.cssText = "";
            this.changeData("avatar", "");
        });
        cutButton.addEventListener("pointerup", () => {
            avatar.classList.add("cutting", "editing");
            const initialHeight = img.offsetHeight,
                initialWidth = img.offsetWidth;
            cutter.querySelectorAll('.control-point').forEach((handle) => {
                handle.addEventListener('pointerdown', (event) => {
                    const startX = event.clientX,
                        startY = event.clientY;
                    const startLeft = parseFloat(cutter.style.left) || 0,
                        startTop = parseFloat(cutter.style.top) || 0;
                    const startWidth = cutter.offsetWidth,
                        startHeight = cutter.offsetHeight;
                    const updateRate = () => {
                        const scale = cutter.offsetHeight / initialHeight;
                        cutter.style.setProperty("--scale", scale);
                    }
                    const pointerMove =
                        event.target.classList.contains("rb") ? (e) => {
                            let width = startWidth + e.clientX - startX,
                                height = startHeight + e.clientY - startY,
                                left = parseFloat(cutter.style.left) || 0,
                                top = parseFloat(cutter.style.top) || 0;
                            const maxWidth = Math.min(initialWidth - left, initialWidth),
                                maxHeight = Math.min(initialHeight - top, initialHeight);
                            if (width > maxWidth) width = maxWidth;
                            if (height > maxHeight) height = maxHeight;
                            cutter.style.width = `${width}px`;
                            cutter.style.height = `${height}px`;
                            updateRate()
                        } : event.target.classList.contains("lb") ? (e) => {
                            let width = startWidth + startX - e.clientX,
                                height = startHeight + e.clientY - startY,
                                left = startLeft + e.clientX - startX,
                                top = parseFloat(cutter.style.top) || 0
                            const maxWidth = Math.min(initialWidth - left, initialWidth),
                                maxHeight = Math.min(initialHeight - top, initialHeight);
                            if (width > maxWidth) width = maxWidth;
                            if (height > maxHeight) height = maxHeight;
                            if (left < 0) left = 0;
                            if (left > initialWidth) left = initialWidth;
                            cutter.style.width = `${width}px`;
                            cutter.style.height = `${height}px`;
                            cutter.style.left = `${left}px`;
                            updateRate()
                        } : event.target.classList.contains("rt") ? (e) => {
                            let width = startWidth + e.clientX - startX,
                                height = startHeight + startY - e.clientY,
                                left = parseFloat(cutter.style.left) || 0,
                                top = startTop + e.clientY - startY
                            const maxWidth = Math.min(initialWidth - left, initialWidth),
                                maxHeight = Math.min(initialHeight - top, initialHeight);
                            if (width > maxWidth) width = maxWidth;
                            if (height > maxHeight) height = maxHeight;
                            if (top < 0) top = 0;
                            if (top > initialHeight) top = initialHeight;
                            cutter.style.width = `${width}px`;
                            cutter.style.height = `${height}px`;
                            cutter.style.top = `${top}px`;
                            updateRate()
                        } : event.target.classList.contains("lt") ? (e) => {
                            let width = startWidth + startX - e.clientX,
                                height = startHeight + startY - e.clientY,
                                left = startLeft + e.clientX - startX,
                                top = startTop + e.clientY - startY
                            const maxWidth = Math.min(initialWidth - left, initialWidth),
                                maxHeight = Math.min(initialHeight - top, initialHeight);
                            if (width > maxWidth) width = maxWidth;
                            if (height > maxHeight) height = maxHeight;
                            if (left < 0) left = 0;
                            if (left > initialWidth) left = initialWidth;
                            if (top < 0) top = 0;
                            if (top > initialHeight) top = initialHeight;
                            cutter.style.width = `${width}px`;
                            cutter.style.height = `${height}px`;
                            cutter.style.left = `${left}px`;
                            cutter.style.top = `${top}px`;
                            updateRate()
                        } : null;
                    const pointerUp = () => {
                        document.removeEventListener('pointermove', pointerMove);
                        document.removeEventListener('pointerup', pointerUp);
                    }
                    document.addEventListener('pointermove', pointerMove);
                    document.addEventListener('pointerup', pointerUp);
                });
            });
            const listener = async (e) => {
                if (e.composedPath()[0] === curtain || !imgContainer.contains(e.composedPath()[0])) {
                    document.removeEventListener("pointerdown", listener);
                    if (cutter.style.cssText.length > 0) {
                        avatar.classList.add("loading");
                        if (imgType === "image/gif") {
                            const clipManager = this.multiMediaQuery("gifClip", {
                                img,
                                x: parseFloat(cutter.style.left) || 0,
                                y: parseFloat(cutter.style.top) || 0,
                                width: cutter.clientWidth,
                                height: cutter.clientHeight,
                                dataForm: "blobURL",
                                quality: 1,
                                minDelay,
                                useClientData: true
                            })
                            clipManager.on("dataend", URLStack.length === 1 ? (result) => {
                                minDelay = result.image.duration / 1e6;
                                avatar.classList.remove("cutting");
                            } : () => {
                                avatar.classList.remove("cutting");
                            });
                            clipManager.on("finished", (data) => {
                                reloadImage(data);
                                avatar.classList.remove("editing", "loading");
                            })
                        } else {
                            reloadImage(await this.multiMediaQuery("staticImgClip", {
                                img,
                                x: parseFloat(cutter.style.left) || 0,
                                y: parseFloat(cutter.style.top) || 0,
                                width: cutter.clientWidth,
                                height: cutter.clientHeight,
                                dataForm: "blobURL",
                                type: imgType,
                                useClientData: true
                            }));
                            avatar.classList.remove("cutting", "editing", "loading");
                        }
                    } else {
                        avatar.classList.remove("cutting", "editing");
                    }
                    cutter.style.cssText = "";
                }
            }
            document.addEventListener("pointerdown", listener);
        });
        img.addEventListener("load", (e) => {
            //模拟cover效果
            const scaleH = img.naturalHeight / avatar.clientHeight,
                scaleW = img.naturalWidth / avatar.clientWidth;
            img.classList.add(scaleH < scaleW ? "full-height" : "full-width");
        })
    }
    #listenName() {
        const nameDataArea = this.getDataAreaDom("name")
        const nameInput = nameDataArea.querySelector('div');
        const pinyinInput = nameDataArea.querySelector('rt');
        preventEnter(nameInput, pinyinInput);
        new MutationObserver(() => {
            this.changeData("name", nameInput.innerText);
            pinyinInput.innerText = this.textQuery("pinyin", { text: nameInput.innerText, withTone: true });
        }).observe(nameInput, { characterData: true, subtree: true, childList: true });
        new MutationObserver(() => {
            this.changeData("pinyin", pinyinInput.innerText);
        }).observe(pinyinInput, { characterData: true, subtree: true, childList: true });
    }
    #listenId() {
        const idDataArea = this.getDataAreaDom("id");
        const idInput = idDataArea.querySelector("div");
        const button = idDataArea.querySelector("button");
        const title = idDataArea.querySelector("span>span");
        preventEnter(idInput);
        button.addEventListener("pointerup", () => {
            const pinyin = this.textQuery("pinyin", { text: this.getData("name"), withTone: false }).join("");
            idInput.innerText = pinyin;
        });
        new MutationObserver(() => {
            this.changeData("id", idInput.innerText)
            if (this.checkQuery("characterId", { id: idInput.innerText })) {
                if (title.classList.contains("wrong")) title.classList.remove("wrong");
            } else {
                if (!title.classList.contains("wrong")) title.classList.add("wrong");
            }
        }).observe(idInput, { characterData: true, subtree: true, childList: true });
    }
    #listenSex() {
        const sexOptions = this.getDataAreaDom("sex").querySelectorAll("[data-sex-option]");
        this.createUniqueChoiceManager("sex", ...sexOptions)
            .listenSiblings("pointerup")
            .setCallback((pre, now, funcMap) => {
                funcMap.forClass("chosen");
                this.changeData("sex", now.dataset.sexOption);
            })
            .choose(sexOptions[0]);
    }
    createGroupOption({ id, name, textShadow, imageData } = {}) {
        const li = document.createElement("li");
        li.dataset.groupOption = id;
        li.textContent = name;
        li.style.setProperty("--url", `url(${imageData})`);
        li.style.setProperty("--group-text-shadow", textShadow);
        return li;
    }
    #listenGroup() {
        const groupDataArea = this.getDataAreaDom("group")
        const groupChosenSection = groupDataArea.querySelector("section");
        const groupOptions = groupDataArea.querySelectorAll("[data-group-option]");
        const doubleGroupCheckBox = groupDataArea.querySelector(".checkbox");
        const singleManager = this.createUniqueChoiceManager("group", ...groupOptions);
        const doubleManager = this.createMultipleChoiceManager("doubleGroup", ...groupOptions);
        const chosenModeManager = this.createMultipleChoiceManager("groupChosenMode", doubleGroupCheckBox);
        const weakmap = new WeakMap([
            [
                doubleGroupCheckBox,
                new Map([
                    [doubleGroupCheckBox, ["chosen"]],
                    [groupChosenSection, ["double-group-choosing"]]
                ])
            ]
        ])
        chosenModeManager.listenSiblings("pointerup")
            .setCallback((type, target, eventMap) => {
                eventMap.forClassByNodeClassMap(weakmap);
                if (type === "delete" && target === doubleGroupCheckBox) {
                    doubleManager.reset();
                }
            })
            .setGetInfoMethod((target) => {
                return target.getAttribute("value");
            })
        singleManager.listenAllNodes("pointerup", () => !chosenModeManager.getLastestInfo())
            .setCallback((pre, now, funcMap) => {
                funcMap.forClass("chosen");
                this.changeData("group", now.dataset.groupOption);
                const textShadow = now.style.getPropertyValue("--group-text-shadow");
                this.style.setProperty("--data-group", `"${now.textContent.trim()}势力"`);
                if (textShadow) {
                    this.style.setProperty("--data-group-text-shadow", textShadow);
                }
            })
            .choose(groupOptions[0]);
        doubleManager.listenAllNodes("pointerup", (_event, node) => chosenModeManager.getLastestInfo() === "double" && !node.classList.contains("chosen"))
            .setCallback((type, target, funMap) => {
                funMap.forClass("double-group-chosen");
                const info = doubleManager.getInfo("all");
                const groupList = info.map(info => info.groupName).filter(Boolean);
                const groupTextShadowList = info.map(info => info.groupTextShadow.replace(", black 0 0 1px", "")).filter(Boolean);
                groupList.unshift(singleManager.chosen?.textContent?.trim?.());
                groupTextShadowList.unshift(singleManager.chosen?.style?.getPropertyValue?.("--group-text-shadow"));
                this.style.setProperty(
                    "--data-group",
                    `"${groupList.join("/")}势力"`
                );
                this.style.setProperty(
                    "--data-group-text-shadow",
                    groupTextShadowList.join(",")
                )
            })
            .setGetInfoMethod(target => {
                return { groupName: target?.textContent?.trim(), groupTextShadow: target.style.getPropertyValue("--group-text-shadow") };
            })
        const groupDiy = groupDataArea.querySelector("[data-diy]");
        groupDiy.addEventListener("pointerup", async () => {
            const dialog = document.createElement("noname-dialog");
            dialog.setAttribute("type", "diygroup");
            this.shadowRoot.append(dialog);
            const result = await dialog.wait()
            if (result !== false) {
                const newGroupOption = this.createGroupOption(false);
                groupDiy.parentElement.insertBefore(newGroupOption, groupDiy);
                singleManager.append(newGroupOption);
                doubleManager.append(newGroupOption);
            }
        })
    }
    createClanOption(name) {
        const li = document.createElement("li");
        li.dataset.clanOption = name;
        li.textContent = name;
        return li;
    }
    #listenClans() {
        const clansDataArea = this.getDataAreaDom("clans")
        const clanOptions = clansDataArea.querySelectorAll("[data-clan-option]");
        const manager = this.createUniqueChoiceManager("clans", ...clanOptions)
            .listenAllNodes("pointerup")
            .setCallback((pre, now, funcMap) => {
                funcMap.forClass("chosen");
                if (pre instanceof HTMLElement) {
                    this.removeSkill(this.playerQuery("clanSkillId", { clan: pre.dataset.clanOption }));
                }
                if (now instanceof HTMLElement) {
                    const clanSkillId = this.playerQuery("clanSkillId", { clan: now.dataset.clanOption });
                    this.addSkill(clanSkillId);
                    this.changeData("clans", now.dataset.clanOption);
                } else {
                    this.changeData("clans", "");
                }
            })
            .setRevocable(true);
        const clanDiy = clansDataArea.querySelector("[data-diy]");
        clanDiy.addEventListener("pointerup", async () => {
            const dialog = document.createElement("noname-dialog");
            dialog.setAttribute("type", "prompt");
            this.shadowRoot.append(dialog);
            dialog.setAttribute("message", "请输入宗族");
            const result = await dialog.wait()
            if (result !== false) {
                const newClanOption = this.createClanOption(result);
                clanDiy.parentElement.insertBefore(newClanOption, clanDiy);
                manager.append(newClanOption);
            }
        })
    }
    #listenHp() {
        let hpAdjustMode, hpAdjustUnitOffset = 1;
        const hpDataArea = this.getDataAreaDom("hp");
        const hpContainer = hpDataArea.querySelector(".hpContainer");
        const moreShowContainer = hpDataArea.querySelector(".hp-more-show");
        const unitOffsetInput = hpDataArea.querySelector(".hp-adjust [contenteditable]")
        const [hpInput, maxHpInput] = hpDataArea.querySelectorAll(".hp-operation [contenteditable]");
        const [hpPlus, hpMinus] = hpDataArea.querySelectorAll(".hp-adjust>div>div");
        const hpManager = this.createUniqueChoiceManager("hp", ...hpDataArea.querySelectorAll(".hp"));
        const adjustOptionManager = this.createUniqueChoiceManager(null, ...hpDataArea.querySelectorAll(".hp-more-show span"));
        const unitOffsetInputManager = this.createEditableElementManager(null, unitOffsetInput)
        const hpInputManager = this.createEditableElementManager("hp", hpInput);
        const maxHpInputManager = this.createEditableElementManager("maxHp", maxHpInput);
        const adjustHpDivsTo = (num) => {
            if (num < 1 || num > 6) return;
            const hps = Array.from(hpDataArea.querySelectorAll(`.hp`));
            const d = num - hps.length;
            if (d > 0) {
                for (let i = 0; i < d; i++) {
                    const hp = document.createElement("div");
                    hp.className = "hp lost";
                    hpContainer.prepend(hp);
                    hpManager.append(hp);
                }
            } else if (d < 0) {
                hps.slice(0, Math.abs(d)).forEach(node => {
                    node.remove();
                    hpManager.remove(node);
                })
            }
        }
        const prependMaxHp = (num = 1, onlyMaxHp = false) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp");
            const changedMaxHp = nowMaxHp + num
            maxHpInputManager.changeValue(changedMaxHp);
            this.changeData("maxHp", changedMaxHp);
            if (changedMaxHp <= 6) {
                adjustHpDivsTo(changedMaxHp);
                if (onlyMaxHp === false) {
                    hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-last-child(${nowHp + num})`));
                }
            } else {
                if (moreShowContainer.classList.contains("hidden")) {
                    moreShowContainer.classList.remove("hidden");
                }
                if (onlyMaxHp === false) {
                    hpInputManager.changeValue(nowHp + num);
                    this.changeData("hp", nowHp + num);
                }
                hpManager.choose(null);
            }
        }
        const removeMaxHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp"); num = Math.min(num, nowMaxHp - 1);
            const changedMaxHp = num === Infinity ? 1 : nowMaxHp - num;
            this.changeData("maxHp", changedMaxHp);
            maxHpInputManager.changeValue(changedMaxHp);
            if (changedMaxHp <= 6) {
                adjustHpDivsTo(changedMaxHp);
                if (!moreShowContainer.classList.contains("hidden")) moreShowContainer.classList.add("hidden");
                if (changedMaxHp < nowHp) {
                    hpManager.choose(hpDataArea.querySelector(".hp"));
                } else {
                    hpManager.choose(hpDataArea.querySelector(`.hp:nth-last-child(${nowHp})`));
                }
            } else if (changedMaxHp < nowHp) {
                hpInputManager.changeValue(nowHp - num);
                this.changeData("hp", nowHp - num);
            }
        }
        const addHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp");
            const d = nowHp + num - nowMaxHp;
            hpInputManager.changeValue(nowHp + num);
            this.changeData("hp", nowHp + num);
            if (d > 0) {
                prependMaxHp(d, true);
            }
            if (d < 0 && nowMaxHp <= 6 || d > 0 && nowMaxHp + d <= 6) {
                hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-last-child(${nowHp + num})`));
            }
        }
        const removeHp = (num = 1) => {
            if (num < 0) return;
            const nowHp = this.getData("hp"), nowMaxHp = this.getData("maxHp"); num = Math.min(num, nowHp - 1);
            const changedHp = num === Infinity ? 1 : nowHp - num;
            hpInputManager.changeValue(changedHp);
            this.changeData("hp", changedHp);
            if (nowMaxHp <= 6) {
                hpManager.choose(this.getDataAreaDom("hp").querySelector(`.hp:nth-last-child(${changedHp})`));
            }
        }
        maxHpInputManager.inputNumber({
            min: 1, max: Infinity, value: 4, supportInfinity: true, isInteger: true,
            commonCallback: (e, val, last) => {
                const d = val - last;
                if (d < 0) removeMaxHp(Math.abs(d));
                else if (d > 0) prependMaxHp(d, true);
            }
        });
        hpInputManager.inputNumber({
            min: 1, max: Infinity, value: 4, supportInfinity: true, isInteger: true,
            commonCallback: (e, val, last) => {
                const d = val - last;
                if (d > 0) addHp(d)
                else if (d < 0) removeHp(Math.abs(d))
            }
        });
        unitOffsetInputManager.inputNumber({
            min: 1, max: Infinity, value: 1, supportInfinity: true, isInteger: true,
            commonCallback: (e, i) => {
                hpAdjustUnitOffset = i;
            }
        })
        hpManager.listenSiblings("pointerup").setCallback((pre, now, funcMap) => {
            funcMap.forClass("chosen");
            const hps = Array.from(this.getDataAreaDom("hp").querySelectorAll(".hp"));
            const i = hps.indexOf(now);
            const hpValue = hps.length - i;
            this.changeData("hp", hpValue);
            hpInputManager.changeValue(hpValue);
        }).chooseFirst()
        adjustOptionManager.listenSiblings("pointerup").setCallback((pre, now, funcMap) => {
            funcMap.forClass("chosen");
            hpAdjustMode = now.dataset.hpAdjustMode;
        }).chooseFirst()
        hpPlus.addEventListener("pointerup", () => {
            const maxHp = this.getData("maxHp"), hp = this.getData("hp");
            if (maxHp > 6) {
                if (hpAdjustMode === "maxHp") prependMaxHp(hpAdjustUnitOffset, true);
                else addHp(hpAdjustUnitOffset);
            } else if (hp === maxHp) {
                prependMaxHp(1, false);
            } else {
                prependMaxHp(1, true);
            }
        });
        hpMinus.addEventListener("pointerup", () => {
            if (this.getData("maxHp") > 6) {
                if (hpAdjustMode === "maxHp") removeMaxHp(hpAdjustUnitOffset);
                else removeHp(hpAdjustUnitOffset);
            } else removeMaxHp();
        });
        //
        const hujias = Array.from(this.getDataAreaDom("hujia").querySelectorAll(".hujia"));
        const hujiaManager = this.createUniqueChoiceManager("hujia", ...hujias);
        const hujiaInputManager = this.createEditableElementManager("hujia", this.getDataAreaDom("hujia").querySelector(".hujia-operation [contenteditable]"))
        hujiaInputManager.inputNumber({
            min: 0, max: 5, value: 0, isInteger: true,
            commonCallback: (e, i) => {
                hujiaManager.choose(hujias[5 - i])
            }
        })
        hujiaManager.listenSiblings("pointerup")
            .setCallback((last, now, funcMap) => {
                funcMap.forClass("chosen");
                const i = hujias.indexOf(now);
                const hujiaValue = 5 - i;
                this.changeData("hujia", hujiaValue);
                hujiaInputManager.changeValue(hujiaValue);
            })
        new MutationObserver(() => {
            toggleMultiClass(hpContainer, "healthy", "damaged", "dangerous")
                .single(this.playerQuery("hpStatus", { hp: this.getData("hp"), maxHp: this.getData("maxHp") }));
        }).observe(hpContainer, {
            attributes: true,
            childList: true,
            subtree: true,
            attributeFilter: ['class']
        });
    }
    addSkill(arg) {
        const skillsDataArea = this.getDataAreaDom("skills");
        const ul = skillsDataArea.querySelector("ul");
        let id;
        if (arg instanceof HTMLElement && arg.tagName === "SKILL-INFO-CARD") {
            const node = arg;
            id = node.getAttribute("skill-id")
            node.removeAttribute("usable");
            node.removeAttribute("likable");
            node.removeAttribute("id");
            node.removeAttribute("markWords");
            ul.append(node);
        } else if (typeof arg === "string" && arg.trim().length !== 0) {
            id = arg;
            const nowSkillInfo = this.infoQuery("skill", { skillId: id, characterId: this.getData("id") })
            const skillCard = document.createElement("skill-info-card");
            skillCard.setAttribute("skill-id", id);
            skillCard.setAttribute("skill-info", JSON.stringify(nowSkillInfo));
            skillCard.setAttribute("removable", true)
            ul.append(skillCard);
        } else return;
        this.changeData("skills", id, { mode: "append" });
        if (this.checkQuery("skillTags", { id, tags: ["hiddenSkill"] })) {
            this.getMultipleChocieManager("more").selectByFind(node => node.dataset.moreOption === "hasHiddenSkill")
        }
        if (this.checkQuery("skillTags", { id, tags: ["zhuSkill"] })) {
            this.getMultipleChocieManager("more").selectByFind(node => node.dataset.moreOption === "isZhuGong")
        }
    }
    removeSkill(arg) {
        const skillsDataArea = this.getDataAreaDom("skills");
        const ul = skillsDataArea.querySelector("ul");
        let id, node;
        if (arg instanceof HTMLElement) {
            node = arg;
            id = node.getAttribute("skill-id");
        } else if (typeof arg === "string" && arg.trim().length !== 0) {
            id = arg;
            node = ul.querySelector(`[skill-id=${id}]`);
        } else return;
        node.remove();
        this.changeData("skills", id, { mode: "remove" });
    }
    #listenSkills() {
        const skillsDataArea = this.getDataAreaDom("skills");
        const searchInput = skillsDataArea.querySelector("ruby>[contenteditable]");
        const searchInputManager = this.createEditableElementManager("skillsSearch", searchInput);
        const search = skillsDataArea.querySelector("ruby>span");
        searchInputManager.inputSearch({
            searchCallback: (e, { filter, keyWords }) => {
                this.triggerEvent("searchSkill", { from: skillsDataArea, toggleNav: true, keyWords, filter });
            },
            associated: {
                element: search,
                listenerType: "pointerup"
            }
        });
        skillsDataArea.addEventListener("requestUseSkill", (e) => {
            const { from: node } = e.detail;
            this.addSkill(node);
        });
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(event => {
            skillsDataArea.addEventListener(event, e => {
                e.preventDefault();
                e.stopPropagation();
            }, false);
        });
        skillsDataArea.addEventListener("drop", e => {
            const id = e.dataTransfer.getData("text");
            /**
             * @type {HTMLNonameFocusUIElement}
             */
            const node = document.getElementById(id);
            if (!node) return;
            this.addSkill(node);
        });
        skillsDataArea.addEventListener("removeCard", (e) => {
            const { from: node } = e.detail;
            this.removeSkill(node)
        })
    }
    #listenMore() {
        const moreDataArea = this.getDataAreaDom("isZhuGong");
        const options = moreDataArea.querySelectorAll("ul li.checkbox");
        const manager = this.createMultipleChoiceManager("more", ...options)
            .listenAllNodes("pointerup")
            .setCallback((type, target, funMap) => {
                funMap.forClass("chosen");
                this.changeData(this.dataset.moreOption, type === "add");
            });
    }
    #listenIntro() {
        const introDataArea = this.getDataAreaDom("intro");
        const introParagraph = introDataArea.querySelector("p");
        const editButton = introDataArea.querySelector(".edit");
        let sourceHTML;
        editButton.addEventListener("pointerup", async (e) => {
            const dialog = document.createElement("noname-dialog");
            dialog.setAttribute("type", "text");
            if (sourceHTML) dialog.setAttribute("message", sourceHTML);
            this.shadowRoot.append(dialog);
            this.appendChildViaSlot(dialog, "dialogText");
            const result = await dialog.wait();
            if (result !== false) {
                introParagraph.innerHTML = result.noPElementHTML;
                sourceHTML = result.sourceHTML;
                this.changeData("intro", result.noPElementHTML);
            }
        });
    }
    #listenExpanable() {
        this.shadowRoot.querySelectorAll("[class^=expandable]").forEach(node => {
            const linkedNodes = this.shadowRoot.querySelectorAll(`[data-by=${node.dataset.for}]`)
            node.addEventListener("pointerup", () => {
                if (node.classList.contains("expandable-expanded")) {
                    node.classList.remove("expandable-expanded");
                    node.classList.add("expandable-collapsed");
                    linkedNodes.forEach(linkedNode => {
                        if (!linkedNode.classList.contains("hidden")) linkedNode.classList.add("hidden");
                    })
                } else if (node.classList.contains("expandable-collapsed")) {
                    node.classList.remove("expandable-collapsed");
                    node.classList.add("expandable-expanded");
                    linkedNodes.forEach(linkedNode => {
                        if (linkedNode.classList.contains("hidden")) linkedNode.classList.remove("hidden");
                    })
                }
            })
        })
    }
    /**
     * @typedef {"avatar"|"hp"|"maxHp"|"hujia"|"pinyin"|"name"|"sex"|"group"|"id"|"clans"|"skills"|"isZhuGong"|"intro"} dataType
     */
    /**
     * @param {dataType} type 
     * @returns {HTMLElement}
     */
    getDataAreaDom(type) {
        return this.shadowRoot.querySelector(`[data-${this.textQuery("formatTransfer", { to: "kebab", text: type })}]`)
    }
    /**
     * @param {dataType} type 
     * @param {any} val 
     */
    changeData(type, val, config) {
        if (!type) return;
        switch (type) {
            case "id": {
                this.getDataAreaDom("id").dataset["id"] = val;
                this.style.setProperty("--data-id", `'${val}'`);
            }; break;
            case "pinyin": {
                this.getDataAreaDom("pinyin").dataset["pinyin"] = val;
                this.style.setProperty("--data-pinyin", val == "" ? "" : `'(${val})'`);
            }; break;
            case "group": {
                this.getDataAreaDom("group").dataset["group"] = val;
            }; break;
            case "sex": {
                this.getDataAreaDom("sex").dataset["sex"] = val;
                this.style.setProperty("--data-sex", `'${this.textQuery("characterTranslation", { attr: type, text: val })}'`);
            }; break;
            case "clans": case "clan": {
                this.getDataAreaDom("clans").dataset["clans"] = val;
                this.style.setProperty("--data-clans", `'${val}'`);
            }; break;
            case "hp": case "maxHp": case "hujia": {
                if (typeof val !== "number") return false;
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-" + type, val == Infinity ? "'∞'" : `'${val}'`);
            }; break;
            case "skills": {
                const skillsDataArea = this.getDataAreaDom("skills");
                let skills;
                if (config.mode === "append") {
                    skills = skillsDataArea.dataset[type].split(" ").filter(Boolean).concat(val);
                    skillsDataArea.dataset[type] = skills.join(" ");
                } else if (config.mode === "remove") {
                    skills = skillsDataArea.dataset[type].split(" ").filter(skill => skill && skill !== val);
                    skillsDataArea.dataset[type] = skills.join(" ");
                } else if (config.mode === "rewrite") {
                    if (Array.isArray(val)) {
                        skillsDataArea.dataset[type] = val.join(" ");
                        skills = val;
                    } else {
                        skillsDataArea.dataset[type] = val;
                        skills = skillsDataArea.dataset[type].split("");
                    }
                }
                if (Array.isArray(skills)) {
                    this.style.setProperty(
                        "--data-skills",
                        `"${skills.map(skill => this.textQuery("skillTranslation", { text: skill, attr: "name" })).join("，")}"`
                    );
                }
            }; break;
            case "avatar": {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-" + type, `url(${val})`);
            }; break;
            default: {
                this.getDataAreaDom(type).dataset[type] = val;
                this.style.setProperty("--data-" + type, `'${val}'`);
            }; break;
        }
    }
    /**
     * @param {dataType} type 
     * @param {any} val 
     */
    getData(type) {
        const camelizedType = this.textQuery("formatTransfer", { to: "camel", text: type });
        let result = this.getDataAreaDom(type).dataset[camelizedType];
        switch (camelizedType) {
            case "hp": case "maxHp": case "hujia": return Number(result);
            case "skills": return result.split(" ");
            default: return result;
        }
    }
    preview() {
        const tempCharacterManager = this.playerQuery("tempCharacter", {
            id: this.getData("id"),
            name: this.getData("name"),
            sex: this.getData("sex"),
            group: this.getData("group"),
            hp: this.getData("hp"),
            maxHp: this.getData("maxHp"),
            hujia: this.getData("hujia"),
            skills: this.getData("skills"),
            clans: this.getData("clans"),
            avatar: this.getData("avatar")
        });
        const playerElement = tempCharacterManager.use();
        playerElement.style.position = "absolute";
        playerElement.style.top = 0;
        playerElement.style.bottom = 0;
        playerElement.style.left = 0;
        playerElement.style.right = 0;
        playerElement.style.margin = "auto";
        const nonameDialog = document.createElement("noname-dialog");
        nonameDialog.append(playerElement);
        this.shadowRoot.append(nonameDialog);
    }
}
customElements.define("character-editor", HTMLNonameCharacterEditorElement);