const context = {}

function defineGetter(proto, target, key) {
  proto.__defineGetter__(key, function () {
    return this[target][key]
  })
}

defineGetter(context, "request", "url")
defineGetter(context, "request", "path")
defineGetter(context, "request", "method")

module.exports = context
