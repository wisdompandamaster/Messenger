import { Channel } from "pusher-js";
import useActiveList from "./useActiveList";
import { useState } from "react";

const useActiveChannel = () => {
  const { set, add, remove } = useActiveList();
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
};

export default useActiveChannel;
