# Kaola-cps-SDK
考拉cps node sdk，对提供的商品查询和订单查询接口进行了封装便于调用。

#### 安装
使用npm:
```
npm i kaola-cps-sdk -S
```
或者yarn:
```
yarn add kaola-cps-sdk
```

#### 引入文件
```
const KaolaClient = require('kaola-cps-sdk')
```

#### 配置
调用接口前需要先使用unionId和appSecret进行配置:
```
const client = KaolaClient.config({
  unionId,
  appSecret
})
```

#### API
在client上调用api对应的方法，自然支持未来的新方法；注意调用api返回的都是promise，可使用async/await。
应用级别的入参和出参请参看[考拉cps官方文档](http://cps.kaola.com/apiInterface#)

商品查询:
```
client.queryGoodsDetail({
  goods,
  type
})
```
订单查询:
```
client.queryorder({
  startDate,
  endDate,
  orderId,
  status
 })
```

欢迎issue和pr。
