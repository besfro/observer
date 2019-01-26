import Dep from './dep.js'

class Oproxy {
    constructor(obj, deep) {
        this.defObj = obj
        this.deep = deep
        this.status = 'beforeCreate'
        this.obj = this.observe(obj)
        this.status = 'afterCreate'
    }
    
    observe(defObj, key) {
        let _this = this, newObj = {}

        const isObject = obj => Object.prototype.toString.call(obj) === '[object Object]'

        if(!defObj || !isObject(defObj)) {
            return
        }

        //proxy 代理对象
        newObj = _this.defineReactive(defObj, key)
        //遍历子属性
        this.deep && 
        Object.keys(defObj).forEach(key => {  
            if(isObject(defObj[key])) {
                newObj[key] = _this.observe(defObj[key], key)
            }
        })
        return newObj
    }

    defineReactive(data, key) {
        const _this = this
        const dep = new Dep()
        
        return new Proxy(data, {
            get(target, key, value) {
                Dep.target && dep.addSub(key, Dep.target)
                return Reflect.get(target, key, value)
            },
            set(target, key, value, receiver) {
                if(_this.status !== 'beforeCreate' && target[key] !== value) {
                    _this.observe(value)
                    //进入microTask
                    Promise.resolve().then(() => dep.notify(key))
                }
                return Reflect.set(target, key, value, receiver)
            }
        })
    }

    get() {
        return this.obj
    }
}

const accessType = (obj) => {
    const types = Object.prototype.toString.call(obj) 
    return types === '[object Object]' || types === '[object Array]'   
};

export function oproxy(data, deep = true) {
    if(!data || !accessType(data)) {
        throw new Error('Access object or Array')
    }

    const objs = new Oproxy(data, deep)
    
    return objs.get()
}
