import getCurrentUser from "../actions/getCurrentUser";
import getUsers from "../actions/getUsers";
import EmptyState from "../components/EmptyState";
import RequestCard from "./components/FriendRequest";

const Users = async () => {
  const currentUser = await getCurrentUser();
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
      {/* <EmptyState /> */}
      <div
        className='
         flex
         gap-3
         p-5
         flex-wrap
      '
      >
        {users.map(user => (
          <RequestCard key={user.id} user={user!} />
        ))}
      </div>
    </div>
  );
};

export default Users;
