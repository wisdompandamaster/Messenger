"use client";

import useConversation from "@/app/hooks/useConversation";

import { FullMessageType } from "@/app/types";
import { useState, useRef, useEffect } from "react";

import MessageBox from "./MessageBox";
import axios from "axios";

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
    axios.post(`/api/conversations/${conversationId}/seen`, {});
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
