import getCurrentUser from "../actions/getCurrentUser";
import EmptyState from "../components/EmptyState";
import RequestCard from "./components/RequestCard";

const Users = async () => {
  const currentUser = await getCurrentUser();
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
      <RequestCard user={currentUser!} />
    </div>
  );
};

export default Users;
