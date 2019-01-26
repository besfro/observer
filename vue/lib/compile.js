import { handler } from './handler.js'

export default class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el)
        this.vm = vm
        
        //有el元素开始编译
        if(this.el) {
            //dom移入fragment片段
            let fragment = this.node2fragment(this.el)
            //编译 => 提取 v- 和 {{}}
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

    compileElementFor() {}

    compileElement(node) {
        const attrs = node.attributes 
        Array.from(attrs).forEach(attr => {
            let name = attr.name
            if(this.isDirective(name)) {
                let [, type] = name.split('-')
                handler[type] && (
                    node.removeAttribute(name),
                    handler[type](node, this.vm, attr.value)
                )
            }
        })
    }

    compileText(node) {
        const reg = /\{\{(.+)\}\}/g
        const text = node.textContent
        if(reg.test(text)) {
            handler['textMul'](node, this.vm, text)
        }
    }
}