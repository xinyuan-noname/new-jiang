export class UniqueChoiceManager {
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
     * @param {function(HTMLElement,HTMLElement,{forClass:function(...string),forClassByNodeMap:function(WeakMap<HTMLElement,HTMLElement>,...string),forClassByNodeClassMap:function(WeakMap<HTMLElement,Map<HTMLElement,string[]>>)})} callback 
     * @returns {this}
     */
    setCallback(callback) {
        this.callback = (last, now) => {
            callback(last, now, {
                forClass: (...classNames) => {
                    last?.classList?.remove?.(...classNames);
                    now?.classList?.add?.(...classNames);
                },
                forClassByNodeMap: (nodeMap, ...classNames) => {
                    nodeMap.get(last)?.classList?.remove?.(...classNames);
                    nodeMap.get(now)?.classList?.add?.(...classNames);
                },
                forClassByNodeClassMap: (nodeClassMap) => {
                    nodeClassMap.get(last)?.forEach?.((classNames, node) => {
                        node?.classList?.remove(...classNames);
                    })
                    nodeClassMap.get(now)?.forEach?.((classNames, node) => {
                        node?.classList?.add(...classNames);
                    })
                }
            })
        };
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
        if (this.nodeList.length > 0) this.proxy.chosen = target;
        return this;
    }
    chooseFirst() {
        this.proxy.chosen = this.nodeList[0];
        return this;
    }
    append(...nodes) {
        this.nodeList.push(...nodes);
    }
    remove(...nodes) {
        for (let i = 0, j = 0; i < this.nodeList.length; i++) {
            const node = this.nodeList[i];
            if (!nodes.includes(node)) this.nodeList[j++] = node;
        }
    }
}
export class MultipleChoiceManager {
    /**
     * @type {HTMLElement[]}
     */
    nodeList = [];
    /**
     * @type {HTMLElement}
     */
    chosenList = [];
    /**
     * @type {}
     */
    collectedInfo = [];
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
        this.proxy = new Proxy(this.chosenList, {
            set(target, p, val) {
                if (Reflect.get(target, p) !== val) {
                    target.callback?.("add", val, target);
                    target.collect(val, target, target.collectFilter);
                }
                return Reflect.set(target, p, val);
            },
            deleteProperty(target, p) {
                target.callback?.("delete", target[p], target);
                target.destroy(Reflect.get(target, p), target, target.deleteFilter);
                return Reflect.deleteProperty(target, p);
            }
        })
    }
    collect(target, chosenList, filter) {
        if (this.getInfoMethod && (!filter || filter?.(node, chosenList))) {
            this.collectedInfo.push({ source: target, info: this.getInfoMethod(target, chosenList) })
        }
    }
    destroy(node, chosenList, filter) {
        for (let i = 0, j = 0; i < this.collectedInfo.length; i++) {
            const info = this.collectedInfo[i];
            if (info?.source !== node && (!filter || filter?.(node, chosenList))) {
                this.collectedInfo[j++] = info;
            }
        }
    }
    /**
     * @param  {...string} classNames 
     * @returns {this}
     */
    forClass(...classNames) {
        this.callback = ((type, item) => {
            if (type === "add") {
                item?.classList?.add?.(...classNames);
            } else if (type === "delete") {
                item?.classList?.remove?.(...classNames);
            }
        })
        return this;
    }
    /**
     * @param {WeakMap<HTMLElement,HTMLElement>} nodeMap 
     * @param  {...string} classNames 
     * @returns {this}
     */
    forClassByNodeMap(nodeMap, ...classNames) {
        this.callback = ((type, item) => {
            if (type === "add") {
                nodeMap.get(item)?.classList?.add?.(...classNames);
            } else if (type === "delete") {
                nodeMap.get(item)?.classList?.remove?.(...classNames);
            }
        })
        return this;
    }
    /**
     * @param {WeakMap<HTMLElement,Map<HTMLElement,string[]>>} nodeClassMap 
     * @returns 
     */
    forClassByNodeClassMap(nodeClassMap) {
        this.callback = ((type, item) => {
            if (type === "add") {
                nodeClassMap.get(item)?.forEach?.((classNames, node) => {
                    node?.classList?.add(...classNames);
                })
            } else if (type === "delete") {
                nodeClassMap.get(item)?.forEach?.((classNames, node) => {
                    node?.classList?.remove(...classNames);
                })
            }
        })
        return this;
    }
    forDataset(attr) {

    }
    /**
     * @param {function(HTMLElement,HTMLElement,{forClass:function(...string),forClassByNodeMap:function(WeakMap<HTMLElement,HTMLElement>,...string),forClassByNodeClassMap:function(WeakMap<HTMLElement,Map<HTMLElement,string[]>>)})} callback 
     * @returns {this}
     */
    setCallback(callback) {
        this.callback = (last, now) => {
            callback(last, now, {
                forClass: (...classNames) => {
                    if (type === "add") {
                        item?.classList?.add?.(...classNames);
                    } else if (type === "delete") {
                        item?.classList?.remove?.(...classNames);
                    }
                },
                forClassByNodeMap: (nodeMap, ...classNames) => {
                    if (type === "add") {
                        nodeMap.get(item)?.classList?.add?.(...classNames);
                    } else if (type === "delete") {
                        nodeMap.get(item)?.classList?.remove?.(...classNames);
                    }
                },
                forClassByNodeClassMap: (nodeClassMap) => {
                    if (type === "add") {
                        nodeClassMap.get(item)?.forEach?.((classNames, node) => {
                            node?.classList?.add(...classNames);
                        })
                    } else if (type === "delete") {
                        nodeClassMap.get(item)?.forEach?.((classNames, node) => {
                            node?.classList?.remove(...classNames);
                        })
                    }
                }
            })
        };
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
    select(target) {
        this.proxy.chosenList.push(target);
        return this;
    }
    unselect(target) {
        const i = this.chosenList.indexOf(target);
        if (i === -1) return this;
        this.proxy.chosenList.splice(i, 1);
        return this;
    }
    append(...nodes) {
        this.nodeList.push(...nodes);
    }
    remove(...nodes) {
        for (let i = 0, j = 0; i < this.nodeList.length; i++) {
            const node = this.nodeList[i];
            if (!nodes.includes(node)) this.nodeList[j++] = node;
        }
    }
}
export class EditableElementManager {
    /**
     * @type {HTMLElement}
     */
    node;
    min;
    max;
    int;
    value;
    changeValueRewrite;
    listenerMap = new Map();
    constructor(node) {
        this.node = node;
    }
    inputNumber({ min, max, value, offset = 1, wheelCallback, blurCallback, EnterBlur, enterCallback, supportInfinity, commonCallback, isInteger } = {}) {
        const changeValue = (val) => {
            if (val != undefined) {
                if (isInteger) val = Math.round(val)
                this.node.innerText = this.value = Number(val);
            }
            if (supportInfinity && (val === "无穷" || val === "∞")) this.value = Infinity;
            else if (isNaN(this.value)) this.node.innerText = this.value = this.min;
            if (!this.node.innerText.length || this.value < this.min) {
                this.node.innerText = this.value = this.min;
            }
            if (this.value > this.max) {
                this.node.innerText = this.value = this.max;
            }
            return Number(this.value);
        }
        const wheelListener = (e) => {
            const lastValue = this.value;
            const value = changeValue(e.deltaY < 0 ? this.value + offset : this.value - offset);
            commonCallback?.(e, value, lastValue);
            wheelCallback?.(e, value, lastValue);
        }
        const blurListener = (e) => {
            const lastValue = this.value;
            const value = changeValue(this.node.innerText);
            commonCallback?.(e, value, lastValue);
            blurCallback?.(e, value, lastValue);
        }
        this.recordListener("wheel", wheelListener);
        this.recordListener("blur", blurListener);
        this.node.addEventListener("wheel", wheelListener)
        this.node.addEventListener("blur", blurListener)
        if (commonCallback || blurCallback) {
            this.preventEnter(EnterBlur, (e) => {
                const lastValue = this.value;
                const value = changeValue(this.node.innerText);
                commonCallback?.(e, value, lastValue);
                enterCallback?.(e, value, lastValue);
            })
        } else {
            this.preventEnter(EnterBlur);
        };
        if (value != void 0) changeValue(value);
        if (min != void 0) this.min = min;
        if (max != void 0) this.max = max;
        this.rewriteChangeValue(changeValue);
        return this;
    }
    rewriteChangeValue(func) {
        this.changeValueRewrite = func
    }
    changeValue(val) {
        if (!this.changeValueRewrite) this.node.innerText = this.value = val;
        else this.changeValueRewrite(val);
    }
    preventEnter(blur = true, callback) {
        const listener = (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                blur && this.node.blur();
                callback?.(e);
            }
        }
        this.recordListener("keydown", listener)
        this.node.addEventListener("keydown", listener);
        return this;
    }
    recordListener(type, listener) {
        if (!this.listenerMap.has(type)) this.listenerMap.set(type, []);
        this.listenerMap.get(type).push(listener);
        return this;
    }
}
export class DragManager {
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
export class SetOpenProxy {
    proxy;
    callbacks = [];
    intercepetors = [];
    constructor(target) {
        this.proxy = new Proxy(target, {
            set: (target, p, val) => {
                if (this.intercepetors.some(p, val)) return;
                this.callbacks.forEach(func => {
                    func(p, val);
                })
                return Reflect.set(target, p, val);
            }
        });
    }
    setCallbacks(...funcs) {
        this.callbacks.push(...funcs);
    }
    removeCallbacks(...funcs) {
        for (let i, j = 0; i < this.callbacks.length; i++) {
            let func = funcs.find(func => func === this.callbacks[i])
            if (!func) funcs[j++] = this.callbacks[i];
        }
    }
    setIntercepetors(...funcs) {
        this.intercepetors.push(...funcs);
    }
    removeIntercepetors(...funcs) {
        for (let i, j = 0; i < this.intercepetors.length; i++) {
            let func = funcs.find(func => func === this.intercepetors[i])
            if (!func) funcs[j++] = this.intercepetors[i];
        }
    }
}
/**
 * @param {HTMLElement} node
 * @param  {...string} classNames 
 * @returns 
 */
export const toggleMultiClass = (node, ...classNames) => {
    return {
        single: (p) => {
            let targetClassName
            if (p in classNames) targetClassName = classNames[p];
            else if (classNames.includes(p)) targetClassName = p;
            if (targetClassName) {
                for (let i = 0; i < classNames.length; i++) {
                    const className = classNames[i];
                    if (targetClassName === className) {
                        if (!node.classList.contains(className)) node.classList.add(className);
                        continue;
                    }
                    if (node.classList.contains(className)) node.classList.remove(className);
                }
            }
        }
    }

}
export const preventEnter = (...nodes) => {
    nodes.forEach(node => {
        node.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                node.blur();
            }
        });
    })
}