import Dep from './dep.js'

export default class Observer {
    constructor(data) {
        this.observe(data)
    }

    observe(data) {
        if(!data || Object.prototype.toString.call(data) !== '[object Object]') {
            return
        }

        Object.keys(data).forEach(key => {
            this.defineReactive(data, key, data[key])
            this.observe(data[key])
        })
    }

    defineReactive(data, key, value) {
        const _this = this
        const dep = new Dep()
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: true,
            get() {
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newValue) {
                if(newValue !== value) {
                    _this.observe(newValue)
                    value = newValue
                    dep.notify()
                }
            }
        })
    }
}