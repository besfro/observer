import Watcher from './watcher.js'
import Tools from './tools.js'

export default class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm

        this.updaterInit()
        this.compileUtilInit()
        
        //有el元素开始编译
        if(this.el) {
            //dom移入fragment片段
            let fragment = this.node2fragment(this.el)
            //编译 => 提取 v-model 和 {{}}
            this.compile(fragment)
            //放回去
            this.el.appendChild(fragment)
        }
    }

    //是否元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }

    //是否含 'v-'
    isDirective(name) {
        return name.includes('v-')
    }

    node2fragment(el) {
        const fragment = document.createDocumentFragment()
        while (el.firstChild) {
            fragment.appendChild(el.firstChild)
        }
        return fragment
    }

    compile(fragment) {
        const childNodes = fragment.childNodes
        Array.from(childNodes).forEach(node => {
            if(this.isElementNode(node)) {
                this.compileElement(node)
                this.compile(node)
            } else {
                this.compileText(node)
            }
        }) 
    }

    compileElement(node) {
        const attrs = node.attributes;
        Array.from(attrs).forEach(attr => {
            let name = attr.name
            if(this.isDirective(name)) {
                let [, type] = name.split('-')
                this.compileUtil[type] && this.compileUtil[type](node, this.vm, attr.value)
            }
        })
    }

    compileText(node) {
        const reg = /\{\{(.+)\}\}/g
        const text = node.textContent
        if(reg.test(text)) {
            this.compileUtil['text'](node, this.vm, text)
        }
    }

    updaterInit() {
        this.updater = {
            textUpdater(node, value) {
                node.textContent = value
            },
            modelUpdater(node, value) {
                node.value = value
            }
        }
    }
    
    compileUtilInit(type) {
        this.compileUtil = {
            text: (node, vm, text) => {
                const watcher = value => {
                    new Watcher(vm, value, function(newValue) {
                        updater(node, newValue)
                    })
                }
                const value = Tools.getTextVal(vm.$data, text, watcher) || text
                const updater = this.updater['textUpdater']
                
                updater(node, value)
            },
            model: (node, vm, expr) => {
                const value = Tools.getVal(vm.$data, expr)
                const updater = this.updater['modelUpdater']

                updater(node, value)

                node.addEventListener('input', e => {
                    const value = e.target.value
                    Tools.setVal(vm.$data, expr, value)
                })

                new Watcher(vm, expr, function(newValue) {
                    updater(node, newValue)
                })
            },
            html: () => {

            }
        }
    }

}