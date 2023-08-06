import { Conversation, Message, User } from "@prisma/client";

// 创建新的特殊类型，避免typescript类型冲突

export type FullMessageType = Message & {
  sender: User;
  seen: User[];
};

export type FullConversationType = Conversation & {
  users: User[];
  messages: FullMessageType[];
  unreadCount?: number;
};
