import getCurrentUser from "../actions/getCurrentUser";
import getFriendRequests from "../actions/getFriendRequests";
import getUsers from "../actions/getUsers";
import EmptyState from "../components/EmptyState";
import AddFriends from "./components/AddFriends";
import RequestCard from "./components/FriendRequest";

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
      <div
        className='
         flex
         gap-3
         px-5
         flex-wrap
      '
      >
        {requests.map(request => (
          <RequestCard key={request.user.id} user={request.user!} />
        ))}
      </div>
    </div>
  );
};

export default Users;
