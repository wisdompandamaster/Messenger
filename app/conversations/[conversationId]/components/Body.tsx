"use client";

import useConversation from "@/app/hooks/useConversation";

import { FullMessageType } from "@/app/types";
import { useState, useRef, useEffect } from "react";

import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}

const Body: React.FC<BodyProps> = ({ initialMessages }) => {
  const [messages, setMessages] = useState(initialMessages);

  // 有新消息时跳转到底部
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation();

  // body组件打开且conversationId刷新时，说明看过对应最新消息，发到后端
  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  // pusher实现实时信息更新
  useEffect(() => {
    // 订阅 channel
    pusherClient.subscribe(conversationId);
    // 有最新消息，直接滑倒最底部
    bottomRef?.current?.scrollIntoView();

    // 收到消息后的处理函数
    const messageHandler = (message: FullMessageType) => {
      // 同时回复哪些人看了消息
      axios.post(`/api/conversations/${conversationId}/seen`);

      setMessages(current => {
        // 比较 current 的信息里面是否有最新的 message id
        // lodash find 比较数组里的对象
        if (find(current, { id: message.id })) {
          return current;
        }
        // 有更新就更新
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages(current =>
        current.map(currentMessage => {
          if (currentMessage.id === newMessage.id) {
            return newMessage;
          }
          return currentMessage;
        })
      );
    };

    // 绑定要接收的消息,然后处理
    pusherClient.bind("messages:new", messageHandler);
    pusherClient.bind("message:update", updateMessageHandler);

    // 组件销毁后解除监听和绑定，防止内存泄漏
    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind("messages:new", messageHandler);
      pusherClient.unbind("message:update", updateMessageHandler);
    };
  }, [conversationId]);

  return (
    <div
      className='
    flex-1
    overflow-y-auto
  '
    >
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className='pt-24 ' />
    </div>
  );
};

export default Body;
