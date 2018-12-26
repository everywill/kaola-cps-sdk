const utils = require('./utils')
const request = require('./network')

function KaolaClient(options) {
  if(!(this instanceof KaolaClient)) {
    return new KaolaClient(options)
  }
  options = options || {}

  const { unionId, appSecret } = options

  if (!unionId || !appSecret) {
    throw new Error('unionId and appSecret are necessary!')
  }

  const endpoint = options.endpoint || 'http://cps.kaola.com/cps/api'
  const stack = []

  const clearStack = () => {
    stack.splice(0, stack.length)
  }

  const sign = params => {
    var sorted = Object.keys(params).sort()
    var basestring = appSecret
    for (var i = 0, l = sorted.length; i < l; i++) {
      var k = sorted[i]
      basestring += k + params[k]
    }
    // console.log(params)
    basestring += appSecret
    // console.log('basestring ==>', basestring)
    return utils.md5(basestring).toUpperCase()
  }

  return new Proxy((...args) => {
    const method = stack[0]
    if(!method) {
      throw new Error('a method should be invoked!')
    }

    const params = args[0] || {}

    params.timestamp = utils.YYYYMMDDHHmmss()
    params.v = '1.0'
    params.signMethod = 'md5'
    params.unionId = unionId

    params.sign = sign(params)

    return request.get(`${endpoint}/${method}`, params, {
      headers: {
        Accept: 'application/xml'
      },
      responseType: 'text',
    }).then(res => res.replace(/&lt;/g, '<').replace(/&gt;/g, '>'))
  }, {
    get(target, key, receiver) {
      if (typeof key === 'string') {
        stack.push(key)
      }
      return receiver
    },
    apply(target, thisArg, args) {
      const result = target(...args)
      clearStack()
      return result
    }
  })
}

module.exports = KaolaClient
