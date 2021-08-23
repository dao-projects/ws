import EventCenter from './EventCenter';
/**
 * `WS` constructor.
 *
 * @param {Object} opts
 * {
 *  url                  
 *  pingTimeout 未收到消息多少秒之后发送ping请求，默认15000毫秒
    pongTimeout  发送ping之后，未收到消息超时时间，默认10000毫秒
    reconnectTimeout
    pingMsg
 * }
 * @api public
 */

/**
 * websocket封装
 * @class WS
 */
class WS {
  // 实例化参数
  options = {};
  // 一个协议字符串或一个协议字符串数组。
  // 这些字符串用来指定子协议，这样一个服务器就可以实现多个WebSocket子协议
  protocols;
  // WebSocket 实例
  ws = null;
  // 连接次数
  repeat = 0;
  // 是否在重连中(是否断开连接)
  lockReconnect = false;
  // 延时重连的 id
  timeId = null;
  // 是否是用户手动关闭连接
  forbidReconnect = false;
  // 错误消息队列
  errorStack = [];
  // 消息管理中心
  eventCenter = new EventCenter();
  // 关闭监听
  onclose = () => {
    // 用户手动关闭的不重连
    //  if (this.forbidReconnect) return
  };
  // 异常监听
  onerror = () => {};
  // 打开监听
  onopen = () => {
    // 发送成功连接之前所发送失败的消息
    this.errorStack.forEach((message) => this.send(message));
    this.errorStack = [];
    this.lockReconnect = false;
  };
  // 消息监听
  onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      this.eventCenter.emit(data.type || data.code, data.data);
    } catch (error) {
      console.log(error, "error");
    }
  };
  // 重连监听
  onreconnect = () => {};
  /**
   * Creates an instance of WS.
   * @param {*} {
   *     url,                     //websocket链接地址
   *     pingTimeout = 15000,     //未收到消息多少秒之后发送ping请求，默认15000毫秒
   *     pongTimeout = 10000,     //发送ping之后，未收到消息超时时间，默认10000毫秒
   *     reconnectTimeout = 2000, //断线重连超时时间，默认2000毫秒
   *     pingMsg = "heartbeat",   //心跳检测字符串，默认heartbeat
   *     repeatLimit = null,      // 最大重连次数
   *   }
   * @memberof WS
   */
  constructor(
    {
      url,
      pingTimeout = 15000,
      pongTimeout = 10000,
      reconnectTimeout = 2000,
      pingMsg = "heartbeat",
      repeatLimit = null,
    },
    protocols = "subprotocol"
  ) {
    // 参数
    this.options = {
      //ws地址
      url,
      //心跳超时（发送）
      pingTimeout,
      //心跳超时（接收）
      pongTimeout,
      // 重连超时
      reconnectTimeout,
      // 心跳字符串
      pingMsg,
      // 重连次数
      repeatLimit,
    };
    this.protocols = protocols;
    // 初始化websocket调用
    this.createWebSocket();
  }
  //初始化websocket
  createWebSocket() {
    try {
      this.ws = new WebSocket(this.options.url, this.protocols);
      this.initEventHandle();
    } catch (e) {
      this.reconnect();
      throw e;
    }
  }
  // 事件监听
  initEventHandle() {
    this.ws.onclose = () => {
      this.onclose();
      this.reconnect();
      // this.lockReconnect = false
    };
    this.ws.onerror = () => {
      this.onerror();
      this.reconnect();
      // this.lockReconnect = false
    };
    this.ws.onopen = () => {
      this.repeat = 0;
      this.onopen();
      //心跳检测重置
      this.heartCheck();
    };
    this.ws.onmessage = (event) => {
      this.onmessage(event);
      //如果获取到消息，心跳检测重置
      //拿到任何消息都说明当前连接是正常的
      this.heartCheck();
    };
  }
  // 重新连接
  reconnect() {
    if (this.options.repeatLimit > 0 && this.options.repeatLimit <= this.repeat)
      return;
    if (this.lockReconnect || this.forbidReconnect) return;
    this.lockReconnect = true;
    this.repeat++; //必须在lockReconnect之后，避免进行无效计数
    this.onreconnect();
    //没连接上会一直重连，设置延迟避免请求过多
    setTimeout(() => {
      this.createWebSocket();
      this.lockReconnect = false;
    }, this.options.reconnectTimeout);
  }
  // 消息发送
  send(msg) {
    // 连接失败时的处理
    if (this.ws.readyState !== 1) {
      this.errorStack.push(msg);
      return;
    }
    this.ws.send(msg);
  }
  //心跳检测
  heartCheck() {
    this.heartReset();
    this.heartStart();
  }
  // 开始重连
  heartStart() {
    if (this.forbidReconnect) return; //不再重连就不再执行心跳
    this.pingTimeoutId = setTimeout(() => {
      //这里发送一个心跳，后端收到后，返回一个心跳消息，
      //onmessage拿到返回的心跳就说明连接正常
      this.ws.send(this.options.pingMsg);
      //如果超过一定时间还没重置，说明后端主动断开了
      this.pongTimeoutId = setTimeout(() => {
        //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
        this.ws.close();
      }, this.options.pongTimeout);
    }, this.options.pingTimeout);
  }
  // 重置重连
  heartReset() {
    clearTimeout(this.pingTimeoutId);
    clearTimeout(this.pongTimeoutId);
  }
  // 手动开启连接
  start() {
    //如果手动开启连接，继续重连
    this.forbidReconnect = false;
    this.reconnect();
  }
  // 手动关闭连接
  close() {
    //如果手动关闭连接，不再重连
    this.forbidReconnect = true;
    this.heartReset();
    this.ws.close();
  }
  // 订阅
  subscribe(eventName, cb) {
    this.eventCenter.on(eventName, cb);
  }
  // 取消订阅
  unsubscribe(eventName, cb) {
    this.eventCenter.off(eventName, cb);
  }
  // 销毁
  destroy() {
    this.close();
    this.ws = null;
    this.errorStack = null;
    this.eventCenter = null;
  }
}

export default WS;

// 后端需判断（可以减少连接次数）
// if(msg=='heartbeat') socket.send(anything);
