"use script";
import url from "./url.mjs";
import "./component.mjs";
class UniqueChoiceManager {
    /**
     * @type {HTMLElement[]}
     */
    nodeList = [];
    /**
     * @type {HTMLElement}
     */
    chosen;
    /**
     * @type {function(HTMLElement,HTMLElement):void}
     */
    callback;
    proxy;
    /**
     * @param  {...HTMLElement} nodes 
     */
    constructor(...nodes) {
        this.nodeList.push(...nodes);
        this.proxy = new Proxy(this, {
            set(target, p, val) {
                if (p === "chosen") {
                    target.callback?.(target.chosen, val);
                }
                return Reflect.set(target, p, val);
            }
        })
        return this.proxy;
    }
    /**
     * @param  {...string} classNames 
     * @returns {this}
     */
    forClass(...classNames) {
        this.callback = ((last, now) => {
            last?.classList?.remove?.(...classNames);
            now?.classList?.add?.(...classNames);
        })
        return this;
    }
    /**
     * @param {WeakMap<HTMLElement,HTMLElement>} nodeMap 
     * @param  {...string} classNames 
     * @returns {this}
     */
    forClassByNodeMap(nodeMap, ...classNames) {
        this.callback = ((last, now) => {
            nodeMap.get(last)?.classList?.remove?.(...classNames);
            nodeMap.get(now)?.classList?.add?.(...classNames);
        })
        return this;
    }
    /**
     * @param {WeakMap<HTMLElement,Map<HTMLElement,string[]>>} nodeClassMap 
     * @returns 
     */
    forClassByNodeClassMap(nodeClassMap) {
        this.callback = ((last, now) => {
            nodeClassMap.get(last)?.forEach?.((classNames, node) => {
                node?.classList?.remove(...classNames);
            })
            nodeClassMap.get(now)?.forEach?.((classNames, node) => {
                node?.classList?.add(...classNames);
            })
        })
        return this;
    }
    /**
     * @param {function(HTMLElement,HTMLElement)} callback 
     * @returns {this}
     */
    setCallback(callback) {
        this.callback = callback;
        return this;
    }
    /**
     * @param {keyof HTMLElementEventMap} type 
     * @param {function(Event,HTMLElement):boolean} filter 
     * @returns {this}
     */
    listenAllNodes(type, filter) {
        this.nodeList.forEach(node => {
            node.addEventListener(type, (e) => {
                if (!filter || filter?.(e, node)) this.choose(node);
            })
        })
        return this;
    }
    /**
    * @param {keyof HTMLElementEventMap} type 
    * @param {function(Event,HTMLElement):boolean} filter 
    * @returns {this}
    */
    listenSiblings(type, filter) {
        const commonParentNode = this.nodeList[0].parentNode
        if (this.nodeList.some(node => node.parentNode != commonParentNode)) throw new Error("The nodes must be siblings");
        commonParentNode.addEventListener(type, (e) => {
            if (!this.nodeList.includes(e.target)) return;
            if (!filter || filter?.(e, e.target)) this.choose(e.target);
        })
        return this;
    }
    /**
     * @param {HTMLElement} target 
     * @returns {this}
     */
    choose(target) {
        this.proxy.chosen = target;
        return this;
    }
}
class DragManager {
    /**
     * @type {HTMLElement}
     */
    draggableTargetsParentNode;
    draggableTargets = [];
    dragStatus = new Proxy({
        isDragging: false,
        draggingNode: null,
        canDrag: false,
        preX: 0,
        preY: 0,
        preTop: 0,
        preLeft: 0,
        frame: null,
        longPressStartTimer: null,
        leaveCountdownTimer: null
    }, {
        set: (target, p, val) => {
            if (p === "canDrag" && val === true) {
                this.eventMap.forEach((func, type) => {
                    this.draggableTargetsParentNode.addEventListener(type, func);
                })
            } else if (p === "canDrag" && val === false) {
                this.eventMap.forEach((func, type) => {
                    this.draggableTargetsParentNode.removeEventListener(type, func);
                })
            }
            if (p === "isDragging" && val === true) {
                this.draggableTargetsParentNode.classList.add("xy-ED-high-z-index");
            } else if (p === "isDragging" && val === false) {
                this.draggableTargetsParentNode.classList.remove("xy-ED-high-z-index");
            }
            return Reflect.set(target, p, val);
        }
    })
    eventMap = new Map([
        ["pointerdown", e => {
            if (!this.draggableTargets.includes(e.target) || this.isDragging) return;
            this.dragStatus.longPressStartTimer = setTimeout(() => {
                const { left, top } = e.target.style;
                this.dragStatus.isDragging = true;
                this.dragStatus.draggingNode = e.target;
                this.dragStatus.preLeft = left.replace("px", "") * 1;
                this.dragStatus.preTop = top.replace("px", "") * 1;
                this.dragStatus.preX = e.pageX;
                this.dragStatus.preY = e.pageY;
                this.dragStatus.longPressStartTimer = null;
            }, 75)
        }],
        ["pointermove", e => {
            if (!this.dragStatus.isDragging) return;
            if (this.dragStatus.frame) cancelAnimationFrame(this.dragStatus.frame);
            this.dragStatus.frame = requestAnimationFrame(() => {
                const { preX, preY, preLeft, preTop } = this.dragStatus;
                let computedLeft = (preLeft + (e.pageX - preX) / devicePixelRatio),
                    computedTop = (preTop + (e.pageY - preY) / devicePixelRatio);
                const max_right = this.draggableTargetsParentNode.offsetWidth - this.dragStatus.draggingNode.offsetWidth,
                    max_bottom = this.draggableTargetsParentNode.offsetHeight - this.dragStatus.draggingNode.offsetHeight
                if (computedLeft < 0) computedLeft = 0;
                if (computedLeft > max_right) computedLeft = max_right;
                if (computedTop < 0) computedTop = 0;
                if (computedTop > max_bottom) computedTop = max_bottom;
                this.dragStatus.draggingNode.style.left = `${computedLeft}px`;
                this.dragStatus.draggingNode.style.top = `${computedTop}px`;
                this.dragStatus.frame = null;
                clearTimeout(this.dragStatus.leaveCountdownTimer);
            })
        }],
        ["pointerup", () => {
            if (this.dragStatus.isDragging) {
                this.dragStatus.isDragging = false;
            }
            else clearTimeout(this.dragStatus.longPressStartTimer);
        }],
        ["pointerleave", () => {
            if (this.dragStatus.isDragging) {
                this.dragStatus.leaveCountdownTimer = setTimeout(() => {
                    this.dragStatus.isDragging = false;
                    this.dragStatus.leaveCountdownTimer = null;
                }, 300)
            }
            else clearTimeout(this.dragStatus.longPressStartTimer);
        }]
    ]);
    beDraggable() {
        this.dragStatus.canDrag = true;
        return this;
    }
    constructor(parentNode, ...draggableTargets) {
        this.draggableTargetsParentNode = parentNode;
        this.draggableTargets.push(...draggableTargets);
    }
}

export class NonameEditorView {
    /**
     * @type {HTMLDivElement}
     */
    mainPage;
    /**
     * @type {HTMLDivElement}
     */
    get minimizeControl() {
        return this.mainPage.querySelector(".xy-ED-minimizeControl");
    }
    /**
     * @type {HTMLDivElement}
     */
    get operationPage() {
        return this.mainPage.querySelector(".xy-ED-operationPage");
    }
    /**
     * @type {HTMLDivElement}
     */
    get h_minimize() {
        return this.mainPage.querySelector(".xy-ED-control-minize");
    }
    /**
     * @type {HTMLDivElement}
    */
    get h_close() {
        return this.mainPage.querySelector(".xy-ED-control-close");
    }
    /**
     * @type {HTMLDivElement}
    */
    get viewArea() {
        return this.mainPage.querySelector(".xy-ED-viewArea");
    }
    /**
     * @type {HTMLDivElement}
    */
    get sideBar() {
        return this.mainPage.querySelector(".xy-ED-viewArea>sideBar");
    }
    /**
     * @type {HTMLDivElement}
    */
    get mainArea() {
        return this.mainPage.querySelector(".xy-ED-viewArea");
    }
    /**
     * @type {HTMLHRElement}
    */
    get resizeLine() {
        return this.mainPage.querySelector(".xy-ED-viewArea>.xy-ED-sideBar>hr");
    }
    /**
     * @type {HTMLElement}
    */
    get nav() {
        return this.mainPage.querySelector(".xy-ED-viewArea>.xy-ED-sideBar>nav");
    }
    /**
     * @type {NodeListOf<HTMLElement>}
    */
    get navs() {
        return this.mainPage.querySelectorAll(".xy-ED-viewArea>.xy-ED-sideBar>nav>*");
    }
    /**
     * @type {HTMLElement}
    */
    get sideBarContent() {
        return this.mainPage.querySelector(".xy-ED-sideBar>.xy-ED-sideBar-content");
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarSetting() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-setting")
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarCharacter() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-character")
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarCard() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-card")
    }
    /**
     * @type {HTMLElement}
     */
    get sideBarSearch() {
        return this.sideBarContent.querySelector(".xy-ED-sideBar-search")
    }
    /**
     * @type {NodeListOf<HTMLElement>}
    */
    get sideBarContents() {
        return this.mainPage.querySelectorAll(".xy-ED-sideBar>.xy-ED-sideBar-content>*");
    }
    /**
     * @type {NodeListOf<HTMLElement>}
     */
    get expanables() {
        return this.mainArea.querySelectorAll("[class^=xy-ED-expandable]");
    }
    constructor() {
        const mainPage = document.createElement("div");
        mainPage.classList.add("xy-ED-nonameEditor")
        this.mainPage = mainPage;
    }
    /**
     * @param {HTMLElement} parentNode 
     */
    async init(parentNode) {
        const mainPage = this.mainPage;
        const response = await fetch(`./${url}/html/index.html`);
        if (!response.ok) throw new Error(response.statusText);
        //$: mainPage , html/index.html//
        mainPage.innerHTML = `
<div class="xy-ED-minimizeControl" draggable>魂</div>
<div class="xy-ED-operationPage">
    <header>
        <div class="xy-ED-header-left">
            <div class="xy-ED-title">魂氏编辑器</div>
        </div>
        <div class="xy-ED-header-right">
            <div class="xy-ED-control-minize"></div>
            <div class="xy-ED-control-close"></div>
        </div>
    </header>
    <div class="xy-ED-viewArea">
        <div class="xy-ED-mainArea">
            <div></div>
        </div>
        <div class="xy-ED-sideBar">
            <hr>
            <div class="xy-ED-sideBar-content">
                <div class="xy-ED-sideBar-setting" data-by="setting"></div>
                <div class="xy-ED-sideBar-charcter" data-by="character"></div>
                <div class="xy-ED-sideBar-card" data-by="card"></div>
                <div class="xy-ED-sideBar-search" data-by="search">
                    <div class="xy-ED-input-container">
                        <input spellcheck="false" placeholder="这里输入搜索的资源">
                        <span class="xy-ED-input-clear"></span>
                        <span class="xy-ED-input-search"></span>
                    </div>
                    <hr>
                    <div class="xy-ED-searchResult">
                        <header>
                            <div class="xy-ED-expandable-expanded" data-for=search-result></div>
                            <div>搜索结果</div>
                        </header>
                        <ul class="xy-ED-show-scrollbar" data-by=search-result></ul>
                    </div>
                </div>
            </div>
            <nav>
                <div class="xy-ED-nav-setting" data-for="setting" draggable="true"></div>
                <div class="xy-ED-nav-character" data-for="character" draggable="true"></div>
                <div class="xy-ED-nav-card" data-for="card" draggable="true"></div>
                <div class="xy-ED-nav-search" data-for="search" draggable="true"></div>
            </nav>
        </div>
    </div>
</div>`
        //#: mainPage , html/index.html//
        parentNode.appendChild(mainPage);
        this.listenPageClose();
        this.listenPageMinize();
        //
        this.listenSideBarResize();
        //
        this.listenNavsReOrder();
        this.listenNavChoose();
        //
        this.listenExpanable();
    }
    //
    listenPageClose() {
        this.h_close.addEventListener("pointerup", () => {
            this.mainPage.remove();
        })
    }
    listenPageMinize() {
        const { h_minimize, minimizeControl, operationPage, mainPage } = this;
        const dragManager = new DragManager(mainPage, minimizeControl)
            .beDraggable();
        const nodeMap = new WeakMap([
            [h_minimize, operationPage],
            [minimizeControl, minimizeControl]
        ])
        new UniqueChoiceManager(h_minimize, minimizeControl)
            .forClassByNodeMap(nodeMap, "xy-ED-hidden")
            .listenAllNodes("pointerup", () => !dragManager.dragStatus.isDragging)
            .choose(minimizeControl);
    }
    //
    listenSideBarResize() {
        const { viewArea, resizeLine } = this;
        const resizeStatus = {
            isResizing: false,
            frame: null
        }
        viewArea.addEventListener("pointerdown", e => {
            if (e.target !== resizeLine) return;
            resizeStatus.isResizing = true;
        })
        viewArea.addEventListener("pointermove", e => {
            if (!resizeStatus.isResizing) return;
            if (this.frame) cancelAnimationFrame(this.frame);
            this.frame = requestAnimationFrame(() => {
                let r = e.clientX / devicePixelRatio / viewArea.clientWidth;
                viewArea.style.setProperty("--xy-ED-WidthRatio", (1 - r) / r);
                this.frame = null;
            })
        });
        viewArea.addEventListener("pointerup", () => {
            if (!resizeStatus.isResizing) return;
            resizeStatus.isResizing = false;
        });
    }
    //
    listenSideBarCharacter() { }
    listenSideBarSearch() {
        const { sideBarSearch } = this;
        const input = sideBarSearch.querySelector("input");
        const ul = sideBarSearch.querySelector("ul");
        const clearIcon = sideBarSearch.querySelector(".xy-ED-input-clear");
        const searchIcon = sideBarSearch.querySelector(".xy-ED-input-search");
        const search = () => { };
        input.addEventListener("keydown", async e => {
            if (e.key !== "Enter") return;
            search();
        });
        searchIcon.addEventListener("pointerdown", async e => {
            search();
        });
        clearIcon.addEventListener("click", () => (input.value = ""));
    }
    //
    listenNavsReOrder() {
        let draggingNode = null;
        this.navs.forEach(node => {
            node.addEventListener("dragstart", e => (draggingNode = e.target));
            node.addEventListener("dragover", e => {
                e.preventDefault()
                const navArray = Array.from(this.navs)
                let i = navArray.indexOf(draggingNode),
                    j = navArray.indexOf(e.target);
                i < j ?
                    this.nav.insertBefore(e.target, draggingNode) : this.nav.insertBefore(draggingNode, e.target);
            });
        })
    }
    listenNavChoose() {
        const navsArray = Array.from(this.navs).map(node => [node, new Map([
            [node, ["xy-ED-nav-chosen"]],
            [this.sideBarContent.querySelector(`[data-by=${node.dataset.for}]`), ["xy-ED-shown-flex"]]
        ])]);
        new UniqueChoiceManager(...this.navs)
            .listenSiblings("pointerup")
            .forClassByNodeClassMap(new WeakMap(navsArray))
    }
    //
    listenExpanable() {
        this.expanables.forEach(node => {
            const linkedNodes = this.operationPage.querySelectorAll(`[data-by=${node.dataset.for}]`)
            node.addEventListener("pointerdown", (e) => {
                linkedNodes.forEach(linkedNode => {
                    linkedNode.classList.toggle("xy-ED-hidden");
                })
                if (node.classList.contains("xy-ED-expandable-expanded")) {
                    node.classList.remove("xy-ED-expandable-expanded");
                    node.classList.add("xy-ED-expandable-collapsed");
                } else if (node.classList.contains("xy-ED-expandable-collapsed")) {
                    node.classList.remove("xy-ED-expandable-collapsed");
                    node.classList.add("xy-ED-expandable-expanded");
                }
            })
        })
    }
    //
    send() {
    }
    receive() {
    }
}