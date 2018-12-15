const axios = require('axios')
const qs = require('qs')
const methods = ['post', 'get', 'put', 'delete']
const ins = {}

methods.forEach((method) => {
  ins[method] = (url, data, options = {}) => {
    data = data || {}

    if (method === 'get') {
      data = { params: data }
    } else {
      data = { data: qs.stringify(data) }
    }

    const promise = new Promise((resolve, reject) => axios({
      url,
      method,
      ...data,
      ...options
    }).then(response => response.data).then((res) => {
      const { code: resCode, ...rest } = res
      const code = parseInt(resCode)
      if (code === 0 || code === 200) {
        resolve(rest)
      } else if (res.startsWith('<?xml')) {
        resolve(res)
      } else {
        reject(rest)
      }
    }).catch((error) => {
      reject(error)
    }))

    return promise
  }
})

module.exports = ins
