import Watcher from './watcher.js'
import Tools from './tools.js'

const updater = {
    text(node, value) {
        node.textContent = value
    },
    model(node, value) {
        node.value = value
    }
}


const addWatcher = (vm, value, update) => {
    new Watcher(vm, value, function(newValue) {
        update(newValue)
    })
}

const handler = {
    text(node, vm, text) {
        const value = Tools.getVal(vm.$data, text) || text
        const update = value => updater['text'](node, value)
        addWatcher(vm, text, update)
        update(value)
    },
    textMul(node, vm, expr) {
        const getVal = () => Tools.getTextVal(vm.$data, expr)
        const update = (value) => updater['text'](node, getVal())
        const watcher = value => {
            addWatcher(vm, value, update)
        }
        const value = Tools.getTextVal(vm.$data, expr, watcher) || expr
        update(value)
    },
    model(node, vm, expr) {
        const value = Tools.getVal(vm.$data, expr)
        const update = value => updater['model'](node, value)
        
        addWatcher(vm, expr, update)
        update(value)

        node.addEventListener('input', e => {
            const value = e.target.value
            Tools.setVal(vm.$data, expr, value)
        })
    },
    for(node, vm, expr) {

    }
}

export { handler }