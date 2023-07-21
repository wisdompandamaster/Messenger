### Pusher用法

- **在server端, 触发事件**
`pusherServer.trigger("your-channel", "your-event", {"message":"your-message"})` 
- **在client端订阅频道**
`pusherClient.subscribe("your-channel")` 
- **绑定事件和处理函数，含函数中获得参数来处理**
`pusherClient.bind("your-event", handlerEvent)` 
- **最后记得解绑，防止内存泄漏**
`pusherClient.unbind("your-event", handlerEvent)` 

<!-- TODO:完成结构 -->
### 项目数据库结构
