const context = {}

function defineGetter(proto, target, key) {
  proto.__defineGetter__(key, function () {
    return this[target][key]
  })
}

function defineSetter(target, key) {
  context.__defineSetter__(key, function (value) {
    this[target][key] = value
  })
}

defineGetter(context, "request", "url")
defineGetter(context, "request", "path")
defineGetter(context, "request", "method")
defineGetter(context, "response", "body")
defineSetter(context, "response", "body")

module.exports = context
