import getCurrentUser from "../actions/getCurrentUser";
import getFriendRequests from "../actions/getFriendRequests";
import getUsers from "../actions/getUsers";
import EmptyState from "../components/EmptyState";
import AddFriends from "./components/AddFriends";
import FriendRequest from "./components/FriendRequest";
import RequestCard from "./components/RequestCard";

const Users = async () => {
  const requests = await getFriendRequests();
  const users = await getUsers();
  return (
    <div
      className='
        hidden
        lg:block 
        lg:pl-80
        h-full
      '
    >
      <AddFriends />
      {/* <EmptyState /> */}
      <FriendRequest requests={requests} />
    </div>
  );
};

export default Users;
