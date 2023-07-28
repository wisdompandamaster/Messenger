import { create } from "zustand";
// 一个轻量状态管理工具

interface ActiveListStore {
  members: string[];
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (id: string[]) => void;
}

// 创建一个全局唯一 store，管理登录状态的 members
const useActiveList = create<ActiveListStore>(set => ({
  members: [],
  //  添加
  add: id => set(state => ({ members: [...state.members, id] })),
  //   删除
  remove: id =>
    set(state => ({
      members: state.members.filter(memberId => memberId !== id),
    })),
  // set
  set: ids => set({ members: ids }),
}));

export default useActiveList;
