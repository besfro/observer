export default class Tools {

    static setVal(data, expr, value) {
        const arr = expr.split('.')
        const len = arr.length
        arr.reduce((prev, next, index) => {
            if(index >= len - 1) {
                prev[next] = value
            } else {
                return prev && prev[next] || ''
            }
        }, data)
    }
    
    static getVal(data, expr) {
        return expr.split('.').reduce((prev, next) => {
            return prev && prev[next] || ''
        }, data)
    }

    static getTextVal(data, expr, process) {
        const reg = /\{\{(.+)\}\}/g
        return expr.replace(reg, (...args) => {
            const value = args[1]
            process && process(value)
            return this.getVal(data, value)
        })
    }
}