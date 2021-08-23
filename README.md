<!--
 * @Descripttion: This is descripttion
 * @version: 0.0.1
 * @Author: liuhb
 * @Date: 2021-08-21 20:28:36
 * @LastEditors: liuhb
 * @LastEditTime: 2021-08-23 11:35:51
-->
# ws
一款基于WebSocket封装实现库

## Install&Usage (安装&使用)

```
# Install(安装)
npm install --save @daoxin/ws

# Usage(使用)
//浏览器
<script src="//unpkg.com/@daoxin/ws@1.0.0/index.js"></script>
<script> console.log(ws);</script>

//ES6
import ws from '@daoxin/ws'

// commonjs
const ws = require('@daoxin/ws')
```

## 发送消息格式
```
{
  "code": "USER_INFO",  # 事件码(必填项)
  "data": "xxxxxxx",    # 发送给服务器数据（字符串或加密串）
  "mes": "获取用户信息" # 操作说明
}
```

## 返回消息格式
```
{
  "code": "USER_INFO",  # 事件码
  "data": "xxxxxxxxx",  # 响应的数据(first为true时使用ras解密，否则aes解密)
  "first": false,       # 是否是创建连接以来第一次响应数据
  "mes": "获取用户信息",# 提示信息(status 为false时可能需要展示给用户看)
  "status": true        # 本次操作状态 true成功，false失败
}
```