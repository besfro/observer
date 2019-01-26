export default class Dep {
    constructor() {
        this.subs = {}
    }

    addSub(key, watcher) {
        const subs = this.subs
        subs[key]
            ? subs[key].push(watcher)
            : (subs[key] = [watcher])
    }

    notify(key) {
        this.subs[key] && this.subs[key].forEach(watcher => watcher.update())
    }
}