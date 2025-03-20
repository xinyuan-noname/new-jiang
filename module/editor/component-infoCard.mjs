import { HTMLNonameFocusUIElement } from "./component-base.mjs";
const nonameCardFragment = (() => {
    const fragment = document.createDocumentFragment();
    const style = document.createElement("style");
    style.textContent = `:host {
        width: 100%;
        color: wheat;
        display: flex;
        flex-direction: column;
        background-color: #000;
    }

    :host>*{
        width: 100%;
    }

    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    .main-content[draggable] {
        cursor: grab;
    }

    [data-audio-list-item] {
        color: gold;
        margin: 1px 0;
        filter: contrast(1.2);
    }

    .interact-bar {
        display: flex;
        justify-content: flex-end;
        background-color: #1e1e1e;
    }

    .interact-bar>* {
        font-size: 20px;
        cursor: pointer;
    }

    .interact-bar>.use {
        cursor: not-allowed;
    }

    .interact-bar>.use.allowed{
        cursor: pointer;
        filter: grayscale(0%);
    }

    .interact-bar>.use,
    .interact-bar>.like {
        filter: grayscale(80%);
    }

    .interact-bar>.like.liked {
        filter: grayscale(0%);
    }

    [data-audio-src]::after{
        content: "🔈";
    }`
    const showInfo = document.createElement("div");
    showInfo.className = "show-info";
    const interactBar = document.createElement("div");
    interactBar.className = "interact-bar"
    fragment.append(style, showInfo, interactBar);
    return fragment;
})();
class HTMLNonameInfoCardElement extends HTMLNonameFocusUIElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: "open" });
        shadow.append(nonameCardFragment.cloneNode(true));
    }
    static observedAttributes = ["likable", "removable", "usable", "usefor", "markwords"];
    connectedCallback() {
        this.shadowRoot.addEventListener("pointerdown", (e) => {
            const node = e.target;
            if (!node.dataset.audioSrc) return;
            this.multiMediaQuery("audio", { src: node.dataset.audioSrc, volume: 1 })
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        const interactBar = this.shadowRoot.querySelector(".interact-bar");
        switch (name) {
            case "usable": {
                if (newValue === "true") {
                    const useSpan = document.createElement("span");
                    useSpan.className = "use";
                    useSpan.textContent = "⬅️";
                    useSpan.addEventListener("pointerdown", () => {
                        this.triggerEvent("useCardData");
                    });
                    interactBar.prepend(useSpan);
                } else {
                    interactBar.querySelector(":scope>.use")?.remove?.();
                    this.removeAttribute("usefor");
                }
            }; break;
            case "likable": {
                if (newValue === "true") {
                    const likeSpan = document.createElement("span");
                    likeSpan.className = "like";
                    likeSpan.textContent = "❤️"
                    likeSpan.addEventListener("pointerdown", () => {
                        if (!likeSpan.classList.contains("liked")) {
                            likeSpan.classList.add("liked");
                            this.triggerEvent("like");
                        } else if (likeSpan.classList.contains("like")) {
                            likeSpan.classList.remove("liked")
                            this.triggerEvent("likeCancel");
                        }
                    })
                    interactBar.insertBefore(likeSpan, interactBar.children[2]);
                } else {
                    interactBar.querySelector(":scope>.like")?.remove?.();
                }
            }; break;
            case "removable": {
                if (newValue === "true") {
                    const removeSpan = document.createElement("span");
                    removeSpan.className = "remove";
                    removeSpan.textContent = "🗑️"
                    removeSpan.addEventListener("pointerdown", () => {
                        this.triggerEvent("removeCard");
                        this.remove();
                    })
                    interactBar.insertBefore(removeSpan, interactBar.children[1]);
                } else {
                    interactBar.querySelector(":scope>.remove")?.remove?.();
                }
            }; break;
            case "usefor": {
                const mainContentDiv = this.shadowRoot.querySelector(".main-content");
                const use = interactBar.querySelector(":scope>.use");
                if (this.useForNode && this.useForNode.id == newValue || (this.useForNode = document.getElementById(newValue))) {
                    mainContentDiv.setAttribute("draggable", "true");
                    if (use) {
                        use?.classList?.add?.("allowed");
                        use.onpointerdown = (e) => {
                            this.sendEvent("requestUseSkill", this.useForNode);
                        };
                    }
                    mainContentDiv.ondragstart = (e) => {
                        this.setAttribute("id", "chosen-card");
                        e.dataTransfer.setData("text", "chosen-card");
                        mainContentDiv.ondragend = (e) => {
                            this.removeAttribute("id");
                            mainContentDiv.ondragend = null;
                        }
                    }
                } else {
                    mainContentDiv.removeAttribute("draggable");
                    mainContentDiv.ondragstart = null;
                    if (use) {
                        use?.classList?.remove?.("allowed");
                        use.onpointerdown = null;
                    }
                    this.useForNode = null;
                }
            }; break;
            case "markwords": {
                if (newValue) {
                    this.markTextNode(".main-content", newValue.split(" "), { root: "shadowRoot" })
                } else {
                    this.unmarkTextNode(".main-content", { root: "shadowRoot" });
                }
            }
        }
    }
    /**
     * @param {"like"|"use"|"remove"} type 
     */
    triggerInteractEvent(type) {
        const event = new Event("pointerdown")
        switch (type) {
            case "like": {
                this.shadowRoot.querySelector(".interact-bar>.like")?.dispatchEvent?.(event);
            }; break;
            case "use": {
                this.shadowRoot.querySelector(".interact-bar>.use")?.dispatchEvent?.(event);
            }; break;
            case "remove": {
                this.shadowRoot.querySelector(".interact-bar>.remove")?.dispatchEvent?.(event);
            }; break;
        }
    }
}
class HTMLNonameSkillInfoCardElement extends HTMLNonameInfoCardElement {
    static observedAttributes = super.observedAttributes.concat("skill-info")
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "skill-info") {
            const showInfo = this.shadowRoot.querySelector(".show-info");
            showInfo.replaceChildren();
            const skillInfo = JSON.parse(this.getAttribute("skill-info"));
            const fragment = document.createDocumentFragment();
            if (skillInfo) {
                const mainContentDiv = document.createElement('div');
                mainContentDiv.className = 'main-content';
                mainContentDiv.innerHTML =
                    `${skillInfo.name}(${skillInfo.id})</br>
                    ${skillInfo.description}`
                fragment.appendChild(mainContentDiv);
                if (skillInfo.audios?.length) {
                    const audioUl = document.createElement('ul');
                    skillInfo.audios.forEach(audio => {
                        const li = document.createElement('li');
                        li.dataset.audioListItem = true;
                        const span = document.createElement('span');
                        span.dataset.audioSrc = audio.file
                        li.append(audio.text, span);
                        audioUl.appendChild(li);
                    });
                    mainContentDiv.appendChild(audioUl);
                }
                showInfo.replaceChildren(fragment);
            }
        }
        else super.attributeChangedCallback(name, oldValue, newValue);
    }
}
class HTMLNonameCharacterInfoCardElement extends HTMLNonameInfoCardElement {
    static observedAttributes = super.observedAttributes.concat("character-info", "skill-likable", "skill-usable")
    constructor() {
        super();
    }
    connectedCallback() {
        super.connectedCallback();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue) return;
        if (name === "character-info") {
            const showInfo = this.shadowRoot.querySelector(".show-info");
            showInfo.replaceChildren();
            const characterInfo = JSON.parse(this.getAttribute("character-info"));
            if (characterInfo) {
                const fragment = document.createDocumentFragment();
                const mainContentDiv = document.createElement('div');
                mainContentDiv.className = 'main-content';
                mainContentDiv.innerHTML =
                    `${characterInfo.name}(${characterInfo.id})</br>
                    武将包：${characterInfo.packageName}</br>
                    分包：${characterInfo.characterSortName}</br>
                    性别：${characterInfo.sex}</br>
                    势力：${characterInfo.group}</br>
                    体力：${characterInfo.hp}/${characterInfo.maxHp}</br>
                    护甲：${characterInfo.hujia}</br>
                    宗族：${characterInfo.clans}</br>
                    技能：</br>${characterInfo.skillList.join("</br>")}`
                mainContentDiv.setBackground(characterInfo.id, "character");
                if (characterInfo.dieAudios?.length) {
                    const audioUl = document.createElement('ul');
                    characterInfo.dieAudios.forEach(audio => {
                        const li = document.createElement('li');
                        li.dataset.audioListItem = true;
                        const span = document.createElement('span');
                        span.dataset.audioSrc = audio.file
                        li.append(audio.text, span);
                        audioUl.appendChild(li);
                    });
                    mainContentDiv.appendChild(audioUl);
                }
                fragment.appendChild(mainContentDiv);
                if (characterInfo.skills) {
                    const skillsUl = document.createElement('ul');
                    characterInfo.skills.forEach(skillInfoItem => {
                        const skillCard = document.createElement('skill-info-card');
                        skillCard.setAttribute('skill-info', JSON.stringify(skillInfoItem));
                        skillCard.setAttribute('skill-id', skillInfoItem.id);
                        skillsUl.appendChild(skillCard);
                    });
                    fragment.appendChild(skillsUl);
                }
                showInfo.appendChild(fragment);
            }
        } else if (name === "skill-likable") {
            if (newValue === "true") {
                this.shadowRoot.querySelectorAll("skill-info-card").forEach(skillCard => {
                    skillCard.setAttribute("likable", "true");
                })
            } else {
                this.shadowRoot.querySelectorAll("skill-info-card").forEach(skillCard => {
                    skillCard.setAttribute("likable", "false");
                })
            }
        } else if (name === "skill-usable") {
            if (newValue === "true") {
                this.shadowRoot.querySelectorAll("skill-info-card").forEach(skillCard => {
                    skillCard.setAttribute("usable", "true");
                })
            } else {
                this.shadowRoot.querySelectorAll("skill-info-card").forEach(skillCard => {
                    skillCard.setAttribute("usable", "false");
                })
            }
        } else {
            super.attributeChangedCallback(name, oldValue, newValue);
        }

    }
}
customElements.define("skill-info-card", HTMLNonameSkillInfoCardElement);
customElements.define("character-info-card", HTMLNonameCharacterInfoCardElement);