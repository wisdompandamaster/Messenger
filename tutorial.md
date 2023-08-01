### Pusher用法

- **在server端, 触发事件**
`pusherServer.trigger("your-channel", "your-event", {"message":"your-message"})` 
- **在client端订阅频道**
`pusherClient.subscribe("your-channel")` 
- **绑定事件和处理函数，含函数中获得参数来处理**
`pusherClient.bind("your-event", handlerEvent)` 
- **最后记得解绑，防止内存泄漏**
`pusherClient.unbind("your-event", handlerEvent)` 

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
```js
model Account {
  //id 
  id                String  @id @default(auto()) @map("_id") @db.ObjectId
  // 用户ID，对应 User   
  userId            String  @db.ObjectId
  //用来登录的其它账户的类型，这些字段都是用来其它账号登录的   
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.String
  access_token      String? @db.String
  // 有效时间   
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.String
  session_state     String?

 // 关联 user 和  Account ，删除用户也会删除账户
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}
```
3. 对话
```js
model Conversation {
  id            String   @id @default(auto()) @map("_id") @db.ObjectId
  createdAt     DateTime @default(now())
  // 对话中最后一条消息的发送时间   
  lastMessageAt DateTime @default(now())
  // 对话名称（群聊名）   
  name          String?
  //   是否是群聊
  isGroup       Boolean?

  // 群聊包括的消息数组 
  messagesIds String[]  @db.ObjectId
  messages    Message[]

  // 群聊包括的 user 数组
  userIds String[] @db.ObjectId
  users   User[]   @relation(fields: [userIds], references: [id])
}   
```

4. 消息
```js
model Message {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  //  消息内容，如果是文字
  body      String?
  //  图片链接，如果是图片
  image     String?
  createdAt DateTime @default(now())

  // 看过的 用户 数组 
  seenIds String[] @db.ObjectId
  seen    User[]   @relation("Seen", fields: [seenIds], references: [id])

  // 属于哪一个 conversation 实例，删除级联，对话删除，也会删除消息
  conversationId String       @db.ObjectId
  conversation   Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  // 发送者 user ，关联 user 实例   
  senderId String @db.ObjectId
  sender   User   @relation(fields: [senderId], references: [id], onDelete: Cascade)
}
```

