"use script";
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
            now.classList.add(...classNames);
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
            }, 50)
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
    constructor() {
        const mainPage = document.createElement("div");
        mainPage.classList.add("xy-ED-nonameEditor")
        this.mainPage = mainPage;
    }
    /**
     * @param {HTMLElement} parentNode 
     */
    init(parentNode) {
        const mainPage = this.mainPage;
        parentNode.appendChild(mainPage);
        mainPage.innerHTML =
            `<div class="xy-ED-minimizeControl" draggable>魂</div>
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
                    <div class="xy-ED-mainArea"></div>
                    <div class="xy-ED-sideBar"></div>
                </div>
            </div>`;
        this.listenPageClose();
        this.listenPageMinize();
    }
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
}