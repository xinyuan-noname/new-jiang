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
        /**
         * @param {HTMLElement} fatherEle 
         * @returns {elementTool}
         */
        father(fatherEle) {
            fatherEle.appendChild(this.ele);
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
        clone(target,bool) {
            this.ele = target.cloneNode(bool);
            return this
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
         * @param {function} func 
         * @returns {elementTool}
         */
        hook(func) {
            func(this.ele);
            return this;
        }
        /**
         * @returns {HTMLElement}
         */
        exit() {
            return this.ele;
        }
    }
    return new elementTool(tag)
}