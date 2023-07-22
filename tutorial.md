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

- Prisma 项目的 ORM
1. 用户
```js
    model User {
    // 用户ID 
    id             String    @id @default(auto()) @map("_id") @db.ObjectId
    // 用户名
    name           String?
    // 用户邮箱，唯一标识
    email          String?   @unique
    // 邮箱验证时间
    emailVerified  DateTime?
    // 头像图片
    image          String?
    // 哈希后的密码
    hashedPassword String?
    // 创建时间
    createdAt      DateTime  @default(now())
    // 更新时间
    updatedAt      DateTime  @updatedAt

    // 包含该用户的 conversation 的 id 的数组，是另一个对象的id的数组
    conversationIds String[]       @db.ObjectId
    // 定义关系, 通过 conversationIds 字段对应到相同id 的 conversation 实例
    conversations   Conversation[] @relation(fields: [conversationIds], references: [id])

    // 定义字段，用来连接关系 
    seenMessageIds String[]  @db.ObjectId
    // 定义关系“Seen”, 看过的消息的数组，直接连接到对应消息的id
    seenMessages   Message[] @relation("Seen", fields: [seenMessageIds], references: [id])

    // 账户 对象
    accounts Account[]
    // 消息 对象
    messages Message[]
    }
```

2. 账户