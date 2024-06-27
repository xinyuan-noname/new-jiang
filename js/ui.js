export const touchE = new TouchEvent("touchend", {
    bubbles: true,
    cancelable: true,
    composed: true
});
/**
 * 
 * @param {HTMLElement} element 
 * @param {String} attr 
 * @returns {AttributeListener}
 */
export function listenAttributeChange(element, attr) {
    class AttributeListener {
        target
        attribute
        lastValue
        originValue
        isStopped
        /**
         * 
         * @param {HTMLElement} target 
         * @param {String} attribute 
         */
        constructor(target, attribute) {
            this.target = target;
            this.attribute = attribute;
            this.lastValue = this.originValue = this.getAttribute()
        }
        getAttribute(){
            return (this.target.getAttribute(this.attribute)||this.target[this.attribute])
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
}