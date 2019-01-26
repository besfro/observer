import Compile from './lib/compile.js'
import Observer from './lib/observer.js'

export default class Vue {
    constructor(opts = {}) {
        this.$el = opts.el
        this.$data = opts.data
        
        if(this.$el) {
            new Observer(this)
            new Compile(this.$el, this)
        }
    }
}