import { create } from "zustand";
import { FullConversationType } from "../types";
// 一个轻量状态管理工具

interface TotalUnreadStore {
  conversations: FullConversationType[];
  set: (conversatons: FullConversationType[]) => void;
}

// 创建一个全局唯一 store，管理登录状态的 conversations
const useTotalUnread = create<TotalUnreadStore>(set => ({
  conversations: [],

  // set
  set: conversations => set({ conversations: conversations }),
}));

export default useTotalUnread;
