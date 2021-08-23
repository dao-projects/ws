
# ws

一款基于WebSocket封装实现库，主要封装心跳检测及事件订阅等

## Install&Usage (安装&使用)

```
# Install(安装)
npm install --save @daoxin/ws

# Usage(使用)
//浏览器
<script src="//unpkg.com/@daoxin/ws@1.0.0/index.js"></script>

//ES6
import WS from '@daoxin/ws'

// commonjs
const WS = require('@daoxin/ws')


const url = "ws://localhost:9970";
let ws = new WS({
      url: url,
      pingTimeout: 8000,
      pongTimeout: 8000,
})
 ws.onopen = function () {
    console.log('连接成功!');
   ws.send("test")
 }

 ws.onreconnect = function () {
    console.log(`重连中...`, "chocolate");
};


ws.onmessage = (e) => {
    onsole.log(`onmessage: ${e.data}`)
    if(e.data == 'close') ws.close();
}
```


##  参数 `new WS(options)`


| 属性 | 必填 | 类型 | 默认值 | 描述 |
| ------ | ------ | ------ | ------ | ------ |
| url | true | string | none | websocket服务端接口地址 |
| pingTimeout | false | number | 15000 | 每隔15秒发送一次心跳，如果收到任何后端消息定时器将会重置 |
| pongTimeout | false | number | 10000 | ping消息发送之后，10秒内没收到后端消息便会认为连接断开 |
| reconnectTimeout | false | number | 2000 | 尝试重连的间隔时间 |
| pingMsg | false | string | "heartbeat" | ping消息值 |
| repeatLimit | false | number | null | 重连尝试次数。默认不限制 |

```
const options = {
    url: 'ws://xxxx',
    pingTimeout: 15000, 
    pongTimeout: 10000, 
    reconnectTimeout: 2000,
    pingMsg: "heartbeat"
}
let ws = new WS(options);
```

## 方法（钩子函数和事件函数）

* 发送消息 `send(msg)`

```
 ws.send('hello websocket');
```

* 关闭连接 `close()`
```
//前端手动断开websocket连接，此方法不会触发重连。
ws.close()
```

* 关闭监听 `onclose`
```
ws.onclose = () => {
    console.log('连接关闭');
}
```

* 错误监听 `onerror`
```
ws.onerror = () => {
    console.log('连接错误');
}
```

* 打开监听 `onopen`
```
ws.onopen = () => {
    console.log('打开成功');
}
```

* 消息监听 `onmessage`
```
ws.onmessage = (e) => {
    console.log('消息':e.data);
}
```

* 重连监听 `onreconnect`
```
ws.onreconnect = (e) => {
    console.log('重连中...');
}
```

## 通过事件订阅（方式）

```
# 注意（格式）： 后台推送的内容为  {code:"USER_INFO",data:""}

// 订阅()
ws.subscribe("USER_INFO", function(data){
    console.log(data)
})

// 取消订阅
ws.unsubscribe("USER_INFO", function(data){
    console.log(data)
})
```

## 发送消息格式（建议）
```
{
  "code": "USER_INFO",  # 事件码(必填项)
  "data": "xxxxxxx",    # 发送给服务器数据（字符串或加密串）
  "mes": "获取用户信息" # 操作说明
}
```

## 返回消息格式（建议）
```
{
  "code": "USER_INFO",  # 事件码
  "data": "xxxxxxxxx",  # 响应的数据(字符串或加密串)
  "first": false,       # 是否是创建连接以来第一次响应数据
  "mes": "获取用户信息",# 提示信息(status 为false时可能需要展示给用户看)
  "status": true        # 本次操作状态 true成功，false失败
}
```

