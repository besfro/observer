import Dep from './dep.js'
import Tools from './tools.js'

export default class Watcher {
    constructor(vm, expr, cb) {
        this.vm = vm
        this.expr = expr
        this.cb = cb
        this.value = this.get()
    }

    get() {
        Dep.target = this
        const value = this.getValue()
        Dep.target = null
        return value
    }

    getValue() {
        return Tools.getVal(this.vm.$data, this.expr)
    }

    update() {
        const oldValue = this.value
        const newValue = this.getValue()

        if(oldValue !== newValue) {
            this.cb && this.cb(newValue)
        }
    }
}