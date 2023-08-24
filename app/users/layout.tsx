import getFriends from "../actions/getFriends";
import getUsers from "../actions/getUsers";
import Sidebar from "../components/sidebar/Sidebar";
import UserList from "./components/UserList";

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const users = await getUsers();
  const friends = await getFriends();
  return (
    // @ts-expext-error Server Component
    <Sidebar>
      <div className='h-full'>
        <UserList items={friends} />
        {children}
      </div>
    </Sidebar>
  );
}
