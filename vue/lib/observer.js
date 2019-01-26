import {oproxy} from './oproxy.js'

export default class Observer {
    constructor(vm) {
        this.defData = vm.$data
        vm.$data = oproxy(this.defData)
    }
}