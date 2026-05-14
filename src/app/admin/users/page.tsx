import { getUsers } from "./actions";
import UsersClient from "./users-client";

export const dynamic = 'force-dynamic';

export default async function UserManagementPage() {
  const users = await getUsers();
  return <UsersClient initialUsers={users} />;
}
