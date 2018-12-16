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
const klcps = require('kaola-cps-sdk')
```

#### 配置
调用接口前需要先使用unionId和appSecret进行配置:
```
klcps.config({
  unionId,
  appSecret
})
```

#### API
注意调用api返回的都是promise，可使用async/await；应用级别的入参和出参请参看[考拉cps官方文档](http://cps.kaola.com/apiInterface#)

商品查询:
```
klcps.getGoodsInfo({
  goods, 
  type
})
```
订单查询:
```
klcps.getOrderInfo({ 
  startDate, 
  endDate, 
  orderId, 
  status 
 })
```

欢迎issue和pr。

#### buy me a coffee
![支付宝赞赏码](https://images.yyshhhh.com/WechatIMG25.jpeg?imageView2/0/w/400)
![微信赞赏码](https://images.yyshhhh.com/WechatIMG26.jpeg?imageView2/0/w/400)
