const convert = require('xml-js')
const CryptoJS = require('crypto-js')
const MD5 = require('crypto-js/md5')
const request = require('./request')
const timeFormatter = require('./time-formatter')

class Klcps {
  constructor() {
    this.unionId = undefined
    this.appSecret = undefined
  }
  config({unionId, appSecret}) {
    this.unionId = unionId
    this.appSecret = appSecret
  }
  isConfigured() {
    return this.unionId && this.appSecret
  }
  async getGoodsInfo({ goods, type = 1 }) {
    // type: 0传urls, 1传goodsIds
    if (!this.isConfigured()) {
      console.warn('[warn] Klcps should be configured with unionId and appSecret first')
    }
    const params = {
      unionId: this.unionId,
      timestamp: timeFormatter(new Date()),
      v: '1.0',
      signMethod: 'md5',
      //urls似乎并不支持
      type: 1,
    }
    let result
    if (type) {
      params.goodsIds = goods
    } else {
      // console.log(goods)
      params.goodsIds = goods.split(',').map(item => (/product\/(\d*)/.exec(item))[1]).join(',')
    }

    const alphabetParamKeyArr = Reflect.ownKeys(params).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)

    const sign = MD5(`${this.appSecret}${alphabetParamKeyArr.map(key => `${key}${params[key]}`).join('')}${this.appSecret}`).toString(CryptoJS.enc.Hex).toUpperCase()

    params.sign = sign

    try {
      result = await request.get('http://cps.kaola.com/cps/api/queryGoodsDetail', params, {
        headers: {
          Accept: 'application/xml'
        },
        responseType: 'text',
      })
      result = result.replace(/&lt;/g, '<')
      result = result.replace(/&gt;/g, '>')
      result = JSON.parse(convert.xml2json(result, {
        compact: true,
        ignoreDeclaration: true
      }))
    } catch(err) {
      console.error('error: ', err)
      result = {goodsList: {goods: []}}
    }

    result.goodsList.goods = result.goodsList.goods || []

    if (Array.isArray(result.goodsList.goods) === false) {
      result.goodsList.goods = [result.goodsList.goods]
    }

    const ret = result.goodsList.goods.map(item => {
      for (const key in item) {
        item[key] = item[key]._text || item[key]._cdata
      }
      return item
    })

    return ret
  }
  async getOrderInfo({ startDate, endDate, orderId, status }) {
    // orderId和 日期范围互斥
    // status 0:下单成功，1:已支付，2:已发货，3:交易成功，4:交易失败，5:过期关单
    if (!this.isConfigured()) {
      console.warn('[warn] Klcps should be configured with unionId and appSecret first')
    }
    const params = {
      unionId: this.unionId,
      timestamp: timeFormatter(new Date()),
      v: '1.0',
      signMethod: 'md5',
    }
    let result

    if (orderId) {
      params.orderId = orderId
    } else {
      params.startDate = timeFormatter(new Date(startDate))
      params.endDate = timeFormatter(new Date(endDate))
    }

    if (status) {
      params.status = status
    }

    const alphabetParamKeyArr = Reflect.ownKeys(params).sort((a, b) => a > b ? 1 : a < b ? -1 : 0)

    const sign = MD5(`${this.appSecret}${alphabetParamKeyArr.map(key => `${key}${params[key]}`).join('')}${this.appSecret}`).toString(CryptoJS.enc.Hex).toUpperCase()

    params.sign = sign

    try {
      result = await request.get('http://cps.kaola.com/cps/api/queryorder', params, {
        headers: {
          Accept: 'application/xml'
        },
        responseType: 'text',
      })
      result = result.replace(/&lt;/g, '<')
      result = result.replace(/&gt;/g, '>')
      // console.log(result)
      result = JSON.parse(convert.xml2json(result, {
        compact: true,
        ignoreDeclaration: true
      }))
    } catch(err) {
      console.error('error: ', err)
      result = {orders: {order: []}}
    }

    result.orders.order = result.orders.order || []

    if (Array.isArray(result.orders.order) === false) {
      result.orders.order = [result.orders.order]
    }

    const ret = result.orders.order.map(item => {
      for (const key in item) {
        item[key] = item[key]._text || item[key]._cdata
      }
      return item
    })

    return ret
  }
}

module.exports = new Klcps()
