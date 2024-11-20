import {
    eachLine,
    addPSFix
} from './string.js'
class elementTool {
    /**
     * @type {HTMLElement}
     */
    ele

    constructor(tag) {
        if (tag) this.ele = document.createElement(tag)
    }
    /**
     * @param {HTMLElement} ele 
     * @returns {elementTool}
     */
    setTarget(ele) {
        this.ele = ele
        return this
    }
    shortCut(key) {
        this.ele.tabIndex = -1;
        this.ele.setAttribute('accesskey', key);
        this.listen("focus", function () {
            requestAnimationFrame(() => {
                this.blur();
            })
        })
        return this;
    }
    /**
     * @param {string} str 
     * @returns {elementTool}
     */
    innerHTML(str) {
        this.ele.innerHTML = str;
        return this;
    }
    /**
     * @param {string} str 
     * @returns {elementTool}
     */
    appendInnerHTML(str) {
        this.ele.innerHTML += str;
        return this;
    }
    block() {
        this.ele.style.display = 'block';
        return this;
    }
    width(size) {
        this.ele.style.width = size;
        return this;
    }
    height(size) {
        this.ele.style.height = size;
        return this;
    }
    flexColumn() {
        this.ele.style.display = "flex";
        this.ele.style.flexDirection = "column";
        return this;
    }
    flexRow() {
        this.ele.style.display = "flex";
        this.ele.style.flexDirection = "row";
        return this;
    }
    /**
     * @param {string} key 
     * @param {string} value 
     * @returns {elementTool}
     */
    setStyle(key, value) {
        this.ele.style[key] = value;
        return this;
    }
    /**
     * @param {object} style 
     * @returns {elementTool}
     */
    style(style) {
        for (let k in style) {
            this.ele.style[k] = style[k];
        }
        return this;
    }
    /**
     * @param {string} event 
     * @param {function} callback 
     * @returns {elementTool}
     */
    listen(event, callback) {
        this.ele.addEventListener(event, callback)
        return this;
    }
    accesskey(key) {
        this.setAttribute('accesskey', key)
        return this;
    }
    /**
     * @param {HTMLElement} fatherEle 
     * @returns {elementTool}
     */
    father(fatherEle) {
        if (fatherEle) fatherEle.appendChild(this.ele);
        return this;
    }
    child(childEle) {
        this.ele.appendChild(childEle);
        return this;
    }
    children(children) {
        this.ele.append(...children);
        return this;
    }
    /**
     * @returns {elementTool}
     */
    removeAllChildren() {
        while (this.ele.firstChild) {
            this.ele.firstChild.remove()
        }
        return this;
    }
    /**
     * @param {HTMLElement} target 
     * @param {boolean} bool
     * @returns {elementTool}
     */
    clone(target, bool) {
        this.ele = target.cloneNode(bool);
        return this
    }
    id(id) {
        this.ele = id;
        return this;
    }
    /**
     * @param {Array<string>|string} toAddClass 
     * @returns {elementTool}
     */
    addClass(toAddClass) {
        if (Array.isArray(toAddClass)) this.ele.classList.add(...toAddClass);
        else this.ele.classList.add(...arguments);
        return this;
    }
    /**
     * @param {string} name 
     * @returns {elementTool}
     */
    className(name) {
        this.ele.className = name;
        return this;
    }
    /**
     * @param {string} key 
     * @param {string} value 
     * @returns {elementTool}
     */
    src(src) {
        this.ele.setAttribute(`src`, src);
        return this;
    }
    type(type) {
        this.ele.setAttribute(`type`, type);
        return this;
    }
    value(value) {
        this.ele.setAttribute(`value`, value);
        return this;
    }
    min(min) {
        if (min) this.ele.min = min;
        return this;
    }
    max(max) {
        if (max) this.ele.max = max;
        return this;
    }
    setAttribute(key, value) {
        if (key.startsWith("data-") || this.ele.hasAttribute(key)) {
            this.ele.setAttribute(key, value);
        } else {
            this.ele.setAttribute(`data-${key}`, value);
        }
        return this;
    }
    /**
     * @param {object} attrs 
     * @returns {elementTool}
     */
    attributes(attrs) {
        for (let k in attrs) {
            this.setAttribute(k, attrs[k])
        }
        return this;
    }
    /**
     * @param {function(HTMLElement)} func 
     * @returns {elementTool}
     */
    hook(func) {
        func(this.ele);
        return this;
    }

    /**
     * @param {String} name
     * @param {ang[]} args
     * @returns {elementTool}
     */
    callMethod(name, ...args) {
        this.ele[name](...args)
        return this;
    }
    /**
     * @param {String} typeof
     * @param {object} options
     * @param {boolean} options.bubbles
     * @param {boolean} options.cancelable
     * @param {boolean} options.composed
     * @param {String} options.key
     * @param {String} options.code
     * @returns {elementTool}
     */
    triggerKey(type, options) {
        let evt = new KeyboardEvent(type, {
            ...options,
            target: this.ele
        })
        this.ele.dispatchEvent(evt)
        return this;
    }
    triggerInput(value, options) {
        this.ele.value += value;
        let evt = new InputEvent("input", {
            ...options,
            target: this.ele
        })
        this.ele.dispatchEvent(evt)
        return this;
    }
    /**
     * @param {String} typeof
     * @param {object} options
     * @param {boolean} options.bubbles
     * @param {boolean} options.composed
     * @param {boolean} options.cancelable
     * @returns {elementTool}
     */
    triggerTouch(type, options) {
        let evt = new TouchEvent(type, {
            ...options,
            target: this.ele
        })
        this.ele.dispatchEvent(evt)
        return this;
    }
    clickAndTouch(type = "touchend") {
        this.ele.click()
        let evt = new TouchEvent(type, {
            bubbles: true,
            composed: true,
            cancelable: true,
            target: this.ele
        })
        this.ele.dispatchEvent(evt)
        return this;
    }
    click() {
        this.ele.click()
        return this;
    }
    /**
     * 
     * @param {HTMLElement} traget 
     * @param {string} type 
     * @returns {elementTool}
     */
    anotherClickTouch(target, type) {
        target.click()
        target.dispatchEvent(new TouchEvent(
            type, {
            bubbles: true,
            cancelable: true,
            composed: true
        }))
        return this;
    }
    /**
    * @param {string} type 
    * @returns {this} 
    */
    scrollToTop(type = 'smooth') {
        if (typeof this.ele.scrollTo !== 'function') {
            throw new Error('Element does not support scrollTo method.');
        }

        if (!['auto', 'instant', 'smooth'].includes(type)) {
            console.warn('Invalid value for "behavior". Using default ("smooth").');
            type = 'smooth';
        }
        this.ele.scrollTo({
            top: 0,
            behavior: type
        })
        return this;
    }
    /**
    * 方法用于为事件绑定一个防抖处理函数。
    * @param {string} event - 需要绑定防抖动处理的事件名称。
    * @param {Function} func - 当事件触发时需要执行的函数。
    * @param {number} wait - 防抖动等待的时间，即在触发事件后需要等待的时间，这段时间内如果再次触发事件，计时器将重新开始。
    * @returns {elementTool} 返回当前对象，支持链式调用。
    */
    debounce(event, func, wait) {
        /**
         * 创建一个防抖函数。
         * 这个函数返回一个新的函数，该函数将在被调用后等待指定的等待时间后，再执行传入的函数。
         * 
         * @param {Function} func - 需要被延迟执行的函数。
         * @returns {Function} 返回一个防抖后的函数。
         */
        function debounce(func) {
            let timeout
            return function (...args) {
                // 清除现有的定时器，以避免上一次的防抖动操作还未结束就再次触发。
                clearTimeout(timeout)
                // 设置一个新的定时器，当定时器到期时，执行传入的函数。
                timeout = setTimeout(() => {
                    func.apply(this, args)
                }, wait)
            }
        }
        // 绑定事件监听，但是事件的处理函数是防抖后的函数。
        this.listen(event, debounce(func))
        // 允许链式调用。
        return this;
    }
    /**
     * @returns {HTMLElement}
     */
    exit() {
        return this.ele;
    }
}
elementTool.prototype.needListenPressedCtrlElements = [];
elementTool.prototype.pressedCtrl = false;
class TextareaTool extends elementTool {
    /**
     * @type {HTMLTextAreaElement}
     */
    ele
    constructor(tag) {
        super(tag);
        if (!tag) return;
        this.setTarget(this.ele);
    }
    /**
     * 重写setTarget方法，检查并确保传入的元素为textarea，否则抛出错误
     * @param {HTMLElement} ele 
     * @returns {TextareaTool}
     */
    setTarget(ele) {
        if (!(ele instanceof HTMLTextAreaElement)) {
            throw new TypeError('传入的元素必须是<textarea>类型');
        }
        super.setTarget(ele);
        return this;
    }
    /**
     * @param {string} value
     * @returns {TextareaTool}
     */
    placeholder(value) {
        this.ele.setAttribute('placeholder', value)
        return this;
    }
    /**
     * 
     * @param {string|RegExp} match 
     * @param {function} func 
     * @returns {TextareaTool}
     */
    order(match, func) {
        let callback;
        if (typeof match === "string") {
            callback = e => {
                this.ele.value.includes(match) && func.apply(this.ele, [e]);
            }
        } else if (match instanceof RegExp) {
            callback = e => {
                match.test(this.ele.value) === true && func.apply(this.ele, [e]);
            }
        }
        this.listen('input', e => {
            callback(e);
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    clearOrder() {
        this.order('清空', () => {
            this.ele.value = ''
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    dittoOrder() {
        this.order('\n同上', () => {
            const callback = item => {
                if (callback.lastLine === void 0 || callback.lastLine === null) return;
                if (item.includes("同上")) return item.replace('同上', callback.lastLine)
            }
            this.ele.value = eachLine(this.ele.value, callback)
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    dittoUnderOrder() {
        this.order('同下\n', () => {
            const callback = item => {
                if (callback.nextLine === void 0 || callback.nextLine === null) return;
                if (item.includes("同下")) return item.replace('同下', callback.nextLine)
            }
            this.ele.value = eachLine(this.ele.value, callback)
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    replaceOrder(searchValue = '', replaceValue = '') {
        this.order(searchValue, () => {
            this.ele.value = this.ele.value.replaceAll(searchValue, replaceValue)
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    clearThenOrder(clearValue, func) {
        this.order(clearValue, e => {
            this.ele.value = this.ele.value.replace(clearValue, "")
            func(this.ele, e)
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    clearThenAnotherClickTouch(clearValue, target, type) {
        this.order(clearValue, e => {
            this.ele.value = this.ele.value.replace(clearValue, "");
            target.click()
            target.dispatchEvent(new TouchEvent(
                type, {
                bubbles: true,
                cancelable: true,
                composed: true
            }))
        })
        return this;
    }
    /**
     * @returns {TextareaTool} 返回当前对象实例，允许链式调用。
     */
    replaceThenOrder(searchValue = '', replaceValue = '', func) {
        this.order(searchValue, e => {
            this.ele.value = this.ele.value.replaceAll(searchValue, replaceValue)
            func(this.ele, e)
        })
        return this;
    }
    /**
     * @param {string|RegExp} searchValue - 要搜索并替换的值或正则表达式。
     * @param {string} replaceValue - 用于替换搜索值的新字符串。
     * @return {elementTool}
     */
    replace(searchValue = '', replaceValue = '') {
        if (searchValue instanceof RegExp && !searchValue.global) searchValue = new RegExp(searchValue.source, 'g')
        this.ele.value = this.ele.value.replaceAll(searchValue, replaceValue)
        return this;
    }
    mark(match, prefix, suffix) {
        this.ele.value = addPSFix(this.ele.value, match, prefix, suffix)
        return this;
    }
}
/**
 * @type {TouchEvent}
 */
export const touchE = new TouchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    composed: true
});
/**
 * @param {HTMLElement} element 
 * @param {string} attr 
 * @returns {AttributeListener}
 */
export function listenAttributeChange(element, attr) {
    class AttributeListener {
        /**
         * @type {HTMLElement}
         */
        target
        /**
         * @type {string}
         */
        attribute
        lastValue
        originValue
        /**
         * @type {boolean}
         */
        isStopped
        /**
         * 
         * @param {HTMLElement} target 
         * @param {string} attribute 
         */
        constructor(target, attribute) {
            this.target = target;
            this.attribute = attribute;
            this.lastValue = this.originValue = this.getAttribute()
        }
        getAttribute() {
            return (this.target.getAttribute(this.attribute) || this.target[this.attribute])
        }
        get nowValue() {
            return this.getAttribute();
        }
        start() {
            const loop = () => {
                if (this.target.parentElement === null) {
                    this.isStopped = true;
                    return;
                }
                if (this.lastValue !== this.nowValue) {
                    this.target.dispatchEvent(new CustomEvent(this.attribute + 'Change', {
                        detail: {
                            lastValue: this.lastValue,
                            nowValue: this.nowValue,
                            originValue: this.originValue
                        }
                    }));
                    this.lastValue = this.getAttribute()
                }
                if (!this.isStopped) requestAnimationFrame(loop);
            }
            loop();
        }
        end() {
            this.isStopped = true;
        }
    }
    return new AttributeListener(element, attr)
};
/**
 * @param {String|void} tag 
 * @returns {elementTool}
 */
export function element(tag) {
    return new elementTool(tag)
}

export function textareaTool(tag) {
    return new TextareaTool(tag)
}

